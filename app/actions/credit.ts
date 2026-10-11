"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ==================== 1. ดึงข้อมูล Balance ====================
export async function getUserBalance() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "กรุณาล็อกอินก่อน" };
  }

  try {
    // ดึงข้อมูล balance จาก users table
    const { data: userData } = await supabase
      .from("users")
      .select("balance, credit_total, email")
      .eq("id", user.id)
      .single();

    // ดึงประวัติ transactions ล่าสุด
    const { data: recentTransactions } = await supabase
      .from("credit_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    // ดึงข้อมูล credit usage (การใช้เครดิตซื้อของ)
    const { data: creditUsage } = await supabase
      .from("credit_usage")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    // ดึงข้อมูล transfers
    const { data: transfersSent } = await supabase
      .from("credit_transfers")
      .select("*")
      .eq("from_user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    const { data: transfersReceived } = await supabase
      .from("credit_transfers")
      .select("*")
      .eq("to_user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    return {
      success: true,
      data: {
        balance: userData?.balance || 0,
        creditTotal: userData?.credit_total || 0,
        email: userData?.email || "",
        recentTransactions: recentTransactions || [],
        creditUsage: creditUsage || [],
        transfers: {
          sent: transfersSent || [],
          received: transfersReceived || []
        }
      }
    };
  } catch (error) {
    console.error("Error getting user balance:", error);
    return { error: "ไม่สามารถดึงข้อมูลได้" };
  }
}

// ==================== 2. เพิ่มเครดิต (จำกัดสิทธิ์เฉพาะ Admin เท่านั้น) ====================
export async function addCredit(
  userId: string,
  amount: number,
  type: 'referral' | 'bonus' | 'manual' | 'refund',
  description: string,
  referenceId?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "กรุณาล็อกอินก่อน" };
  }

  // ✅ ตรวจสอบสิทธิ์ Admin ป้องกันผู้ใช้ภายนอกเรียก Server Action เพื่อเติมเงินเข้าตัวเอง
  const { data: callerProfile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (callerProfile?.role !== "admin") {
    console.warn(`[Security Alert] Unauthorized credit add attempt by user ${user.id}`);
    return { error: "ไม่มีสิทธิ์ในการดำเนินการนี้ (ต้องการสิทธิ์ Admin)" };
  }

  if (amount <= 0 || isNaN(amount)) {
    return { error: "จำนวนเครดิตไม่ถูกต้อง" };
  }

  try {
    const { data: targetUser } = await supabase
      .from("users")
      .select("balance")
      .eq("id", userId)
      .single();

    if (!targetUser) {
      return { error: "ไม่พบผู้ใช้ปลายทาง" };
    }

    const newBalance = targetUser.balance + amount;
    
    const { error: updateError } = await supabase
      .from("users")
      .update({ balance: newBalance })
      .eq("id", userId);

    if (updateError) throw updateError;

    const { error: transactionError } = await supabase
      .from("credit_transactions")
      .insert({
        user_id: userId,
        transaction_type: "earn",
        amount: amount,
        description: description,
        reference_type: type,
        reference_id: referenceId
      });

    if (transactionError) throw transactionError;

    revalidatePath("/profile/balance");
    revalidatePath("/profile");
    
    return { 
      success: true, 
      newBalance,
      message: `ได้รับเครดิต ${amount} ${type === 'referral' ? 'จากระบบแนะนำเพื่อน' : ''}`
    };
  } catch (error) {
    console.error("Error adding credit:", error);
    return { error: "ไม่สามารถเพิ่มเครดิตได้" };
  }
}

// ==================== 3. ใช้เครดิต (เมื่อซื้อสินค้า) ====================
export async function useCredit(
  _userId: string,
  amount: number,
  orderId: string,
  items: Array<{ name: string; price: number }>,
  description?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "กรุณาล็อกอินก่อน" };
  }

  // ✅ ป้องกัน IDOR: บังคับใช้ user.id จาก session ของผู้เรียกเสมอ
  const effectiveUserId = user.id;

  if (amount <= 0 || isNaN(amount)) {
    return { error: "จำนวนเครดิตที่ต้องการใช้ไม่ถูกต้อง" };
  }

  try {
    const { data: targetUser } = await supabase
      .from("users")
      .select("balance")
      .eq("id", effectiveUserId)
      .single();

    if (!targetUser) {
      return { error: "ไม่พบข้อมูลผู้ใช้" };
    }

    if (targetUser.balance < amount) {
      return { error: "เครดิตไม่เพียงพอ" };
    }

    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
    const finalAmount = Math.max(0, totalPrice - amount);
    const newBalance = targetUser.balance - amount;

    const { error: updateError } = await supabase
      .from("users")
      .update({ balance: newBalance })
      .eq("id", effectiveUserId);

    if (updateError) throw updateError;

    const { error: usageError } = await supabase
      .from("credit_usage")
      .insert({
        user_id: effectiveUserId,
        order_id: orderId,
        credit_used: amount,
        original_amount: totalPrice,
        final_amount: finalAmount,
        items: items
      });

    if (usageError) throw usageError;

    const { error: transactionError } = await supabase
      .from("credit_transactions")
      .insert({
        user_id: effectiveUserId,
        transaction_type: "spend",
        amount: amount,
        description: description || `ใช้เครดิตซื้อ ${items.map(i => i.name).join(', ')}`,
        reference_type: "purchase",
        reference_id: orderId
      });

    if (transactionError) throw transactionError;

    revalidatePath("/profile/balance");
    revalidatePath("/profile/invoices");
    
    return { 
      success: true, 
      newBalance,
      creditUsed: amount,
      finalAmount,
      message: `ใช้เครดิต ${amount} สำหรับคำสั่งซื้อ #${orderId}`
    };
  } catch (error) {
    console.error("Error using credit:", error);
    return { error: "ไม่สามารถใช้เครดิตได้" };
  }
}

// ==================== 4. โอนเครดิตให้เพื่อน ====================
export async function transferCredit(
  _fromUserId: string,
  toUserEmail: string,
  amount: number,
  note?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "กรุณาล็อกอินก่อน" };
  }

  // ✅ ป้องกัน IDOR: บังคับใช้ user.id จาก session เป็นผู้โอนเสมอ
  const effectiveFromUserId = user.id;

  if (amount <= 0 || isNaN(amount)) {
    return { error: "จำนวนเครดิตที่ต้องการโอนต้องมากกว่า 0" };
  }

  if (user.email && user.email.toLowerCase() === toUserEmail.toLowerCase()) {
    return { error: "ไม่สามารถโอนเครดิตให้ตัวเองได้" };
  }
  
  try {
    const { data, error } = await supabase
      .rpc('transfer_credits', {
        p_from_user_id: effectiveFromUserId,
        p_to_user_email: toUserEmail,
        p_amount: amount,
        p_note: note || ''
      });

    if (error) throw error;
    
    if (data && !data.success) {
      return { error: data.error || "การโอนล้มเหลว" };
    }

    revalidatePath("/profile/balance");
    revalidatePath("/profile");
    
    return { 
      success: true,
      transferId: data?.transfer_id,
      message: `โอนเครดิต ${amount} ให้ ${toUserEmail} สำเร็จ`
    };
  } catch (error) {
    console.error("Error transferring credit:", error);
    return { error: "ไม่สามารถโอนเครดิตได้" };
  }
}

// ==================== 5. ดึงประวัติทั้งหมด (เฉพาะของตนเอง) ====================
export async function getTransactionHistory(
  _userId?: string,
  filters?: {
    type?: string;
    startDate?: string;
    endDate?: string;
  },
  limit: number = 20,
  offset: number = 0
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "กรุณาล็อกอินก่อน" };
  }

  // ✅ ป้องกัน IDOR: บังคับดึงเฉพาะประวัติของตนเอง
  const effectiveUserId = user.id;
  
  try {
    let query = supabase
      .from("credit_transactions")
      .select("*", { count: "exact" })
      .eq("user_id", effectiveUserId);

    if (filters?.type) {
      query = query.eq("transaction_type", filters.type);
    }
    
    if (filters?.startDate) {
      query = query.gte("created_at", filters.startDate);
    }
    
    if (filters?.endDate) {
      query = query.lte("created_at", filters.endDate);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      success: true,
      data: data || [],
      totalCount: count || 0,
      hasMore: (count || 0) > offset + limit
    };
  } catch (error) {
    console.error("Error getting transaction history:", error);
    return { error: "ไม่สามารถดึงประวัติได้" };
  }
}

// ==================== 6. สร้าง credit สำหรับ testing ====================
export async function addTestCredit(
  _userId: string,
  amount: number = 100
) {
  if (process.env.NODE_ENV === 'production') {
    return { error: "ไม่อนุญาตให้ใช้ฟังก์ชันนี้ในโหมด Production" };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  return await addCredit(
    user.id,
    amount,
    'manual',
    'ทดสอบระบบเครดิต (Dev Only)',
    'test-' + Date.now()
  );
}

// ==================== 7. เช็ค balance ก่อน checkout ====================
export async function checkBalanceBeforeCheckout(
  _userId: string,
  cartTotal: number
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "กรุณาล็อกอินก่อน" };
  }

  const effectiveUserId = user.id;
  
  try {
    const { data: targetUser } = await supabase
      .from("users")
      .select("balance")
      .eq("id", effectiveUserId)
      .single();

    if (!targetUser) {
      return { error: "ไม่พบผู้ใช้" };
    }

    const canUseCredit = targetUser.balance > 0;
    const maxCreditToUse = Math.min(targetUser.balance, cartTotal);
    const finalAmount = cartTotal - maxCreditToUse;

    return {
      success: true,
      canUseCredit,
      userBalance: targetUser.balance,
      cartTotal,
      maxCreditToUse,
      finalAmount,
      message: canUseCredit 
        ? `สามารถใช้เครดิตได้สูงสุด ${maxCreditToUse}`
        : "เครดิตไม่เพียงพอ"
    };
  } catch (error) {
    console.error("Error checking balance:", error);
    return { error: "ไม่สามารถเช็คยอดได้" };
  }
}

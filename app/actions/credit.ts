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

// ==================== 2. เพิ่มเครดิต ====================
export async function addCredit(
  userId: string,
  amount: number,
  type: 'referral' | 'bonus' | 'manual' | 'refund',
  description: string,
  referenceId?: string
) {
  const supabase = await createClient();
  
  try {
    // ตรวจสอบว่ามี user ไหม
    const { data: user } = await supabase
      .from("users")
      .select("balance")
      .eq("id", userId)
      .single();

    if (!user) {
      return { error: "ไม่พบผู้ใช้" };
    }

    // อัพเดต balance ใน users table
    const newBalance = user.balance + amount;
    
    const { error: updateError } = await supabase
      .from("users")
      .update({ balance: newBalance })
      .eq("id", userId);

    if (updateError) throw updateError;

    // บันทึก transaction
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
  userId: string,
  amount: number,
  orderId: string,
  items: Array<{ name: string; price: number }>,
  description?: string
) {
  const supabase = await createClient();
  
  try {
    // ตรวจสอบ balance
    const { data: user } = await supabase
      .from("users")
      .select("balance")
      .eq("id", userId)
      .single();

    if (!user) {
      return { error: "ไม่พบผู้ใช้" };
    }

    // ตรวจสอบว่า balance พอไหม
    if (user.balance < amount) {
      return { error: "เครดิตไม่เพียงพอ" };
    }

    // คำนวณยอดหลังใช้เครดิต
    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
    const finalAmount = totalPrice - amount;
    const newBalance = user.balance - amount;

    // ลด balance
    const { error: updateError } = await supabase
      .from("users")
      .update({ balance: newBalance })
      .eq("id", userId);

    if (updateError) throw updateError;

    // บันทึก credit usage
    const { error: usageError } = await supabase
      .from("credit_usage")
      .insert({
        user_id: userId,
        order_id: orderId,
        credit_used: amount,
        original_amount: totalPrice,
        final_amount: finalAmount,
        items: items
      });

    if (usageError) throw usageError;

    // บันทึก transaction
    const { error: transactionError } = await supabase
      .from("credit_transactions")
      .insert({
        user_id: userId,
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
  fromUserId: string,
  toUserEmail: string,
  amount: number,
  note?: string
) {
  const supabase = await createClient();
  
  try {
    // เรียกใช้ PostgreSQL function ที่เราสร้างไว้
    const { data, error } = await supabase
      .rpc('transfer_credits', {
        p_from_user_id: fromUserId,
        p_to_user_email: toUserEmail,
        p_amount: amount,
        p_note: note || ''
      });

    if (error) throw error;
    
    // ตรวจสอบผลลัพธ์จาก RPC function
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

// ==================== 5. ดึงประวัติทั้งหมด ====================
export async function getTransactionHistory(
  userId: string,
  filters?: {
    type?: string;
    startDate?: string;
    endDate?: string;
  },
  limit: number = 20,
  offset: number = 0
) {
  const supabase = await createClient();
  
  try {
    let query = supabase
      .from("credit_transactions")
      .select("*", { count: "exact" })
      .eq("user_id", userId);

    // Apply filters ถ้ามี
    if (filters?.type) {
      query = query.eq("transaction_type", filters.type);
    }
    
    if (filters?.startDate) {
      query = query.gte("created_at", filters.startDate);
    }
    
    if (filters?.endDate) {
      query = query.lte("created_at", filters.endDate);
    }

    // ดึงข้อมูล
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
  userId: string,
  amount: number = 100
) {
  // ฟังก์ชันนี้สำหรับ developer เท่านั้น
  if (process.env.NODE_ENV === 'production') {
    return { error: "ไม่สามารถใช้ใน production ได้" };
  }

  return await addCredit(
    userId,
    amount,
    'manual',
    'ทดสอบระบบเครดิต',
    'test-' + Date.now()
  );
}

// ==================== 7. เช็ค balance ก่อน checkout ====================
export async function checkBalanceBeforeCheckout(
  userId: string,
  cartTotal: number
) {
  const supabase = await createClient();
  
  try {
    const { data: user } = await supabase
      .from("users")
      .select("balance")
      .eq("id", userId)
      .single();

    if (!user) {
      return { error: "ไม่พบผู้ใช้" };
    }

    const canUseCredit = user.balance > 0;
    const maxCreditToUse = Math.min(user.balance, cartTotal);
    const finalAmount = cartTotal - maxCreditToUse;

    return {
      success: true,
      canUseCredit,
      userBalance: user.balance,
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
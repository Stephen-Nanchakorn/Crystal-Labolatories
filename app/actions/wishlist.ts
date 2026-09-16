"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ==================== 1. เพิ่ม/ลบ Wishlist ====================
export async function toggleWishlist(
  pluginSlug: string,
  pluginData?: {
    name: string;
    price: number;
    image_url?: string;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "กรุณาล็อกอินก่อน" };
  }

  try {
    // ตรวจสอบว่ามีใน wishlist ไหม
    const { data: existing } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("plugin_id", pluginSlug)
      .single();

    if (existing) {
      // ถ้ามีอยู่แล้ว -> ลบออก
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("id", existing.id);

      if (error) throw error;

      revalidatePath("/plugins");
      revalidatePath("/profile/wishlist");
      
      return { 
        success: true, 
        action: "removed",
        message: "นำออกจากรายการโปรดแล้ว"
      };
    } else {
      // ถ้ายังไม่มี -> เพิ่ม
      const wishlistData: any = {
        user_id: user.id,
        plugin_id: pluginSlug,
      };

      // ถ้ามี pluginData ให้เก็บ snapshot
      if (pluginData) {
        wishlistData.plugin_data = {
          name: pluginData.name,
          price: pluginData.price,
          image_url: pluginData.image_url,
          added_at: new Date().toISOString()
        };
      }

      const { error } = await supabase
        .from("wishlist")
        .insert(wishlistData);

      if (error) throw error;

      revalidatePath("/plugins");
      revalidatePath("/profile/wishlist");
      
      return { 
        success: true, 
        action: "added",
        message: "เพิ่มลงรายการโปรดแล้ว"
      };
    }
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    return { error: "ไม่สามารถอัพเดตรายการโปรดได้" };
  }
}

// ==================== 2. ดึง Wishlist ทั้งหมด ====================
export async function getWishlist() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "กรุณาล็อกอินก่อน" };
  }

  try {
    // ดึง wishlist items
    const { data: wishlistItems } = await supabase
      .from("wishlist")
      .select(`
        id,
        plugin_id,
        plugin_data,
        notes,
        created_at,
        plugins:plugin_id (
          slug,
          name,
          description,
          price,
          currency,
          image_url,
          discount_percent,
          is_free
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    // ดึง plugin details สำหรับ items ที่ไม่มี plugin_data
    const itemsWithDetails = await Promise.all(
      (wishlistItems || []).map(async (item: any) => {
        if (item.plugin_data) {
          return {
            ...item,
            plugin: item.plugin_data
          };
        }

        // ถ้าไม่มี plugin_data ให้ดึงจาก plugins table
        if (item.plugin_id && item.plugins) {
          return {
            ...item,
            plugin: item.plugins
          };
        }

        return item;
      })
    );

    // ดึง wishlist count
    const { data: countData } = await supabase
      .rpc('get_wishlist_count', { p_user_id: user.id });

    // ดึง notifications ที่ยังไม่อ่าน
    const { data: notifications } = await supabase
      .from("wishlist_notifications")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_read", false)
      .order("created_at", { ascending: false })
      .limit(10);

    return {
      success: true,
      data: {
        items: itemsWithDetails,
        count: countData || 0,
        notifications: notifications || []
      }
    };
  } catch (error) {
    console.error("Error getting wishlist:", error);
    return { error: "ไม่สามารถดึงรายการโปรดได้" };
  }
}

// ==================== 3. เช็คว่าปลั๊กอินอยู่ใน wishlist ไหม ====================
export async function checkWishlistStatus(pluginSlug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { isInWishlist: false };
  }

  try {
    const { data } = await supabase
      .rpc('is_plugin_in_wishlist', {
        p_user_id: user.id,
        p_plugin_slug: pluginSlug
      });

    return { isInWishlist: data || false };
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    return { isInWishlist: false };
  }
}

// ==================== 4. ลบหลายรายการจาก Wishlist ====================
export async function removeFromWishlistBulk(itemIds: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "กรุณาล็อกอินก่อน" };
  }

  if (!itemIds || itemIds.length === 0) {
    return { error: "ไม่มีรายการที่เลือก" };
  }

  try {
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .in("id", itemIds)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/profile/wishlist");
    
    return { 
      success: true,
      message: `ลบ ${itemIds.length} รายการออกจากรายการโปรดแล้ว`
    };
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return { error: "ไม่สามารถลบรายการได้" };
  }
}

// ==================== 5. เพิ่มโน๊ตใน Wishlist item ====================
export async function updateWishlistNote(itemId: string, notes: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "กรุณาล็อกอินก่อน" };
  }

  try {
    const { error } = await supabase
      .from("wishlist")
      .update({ 
        notes: notes || null,
        updated_at: new Date().toISOString()
      })
      .eq("id", itemId)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/profile/wishlist");
    
    return { 
      success: true,
      message: "บันทึกโน๊ตแล้ว"
    };
  } catch (error) {
    console.error("Error updating wishlist note:", error);
    return { error: "ไม่สามารถบันทึกโน๊ตได้" };
  }
}

// ==================== 6. แชร์ Wishlist ====================
export async function shareWishlist(
  sharedWithEmail: string,
  canEdit: boolean = false,
  expiresInDays: number = 7
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "กรุณาล็อกอินก่อน" };
  }

  try {
    // สร้าง share token
    const shareToken = `wish_${Math.random().toString(36).substr(2, 9)}_${Date.now().toString(36)}`;
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // สร้าง sharing record
    const { error } = await supabase
      .from("wishlist_shared")
      .insert({
        shared_by_user_id: user.id,
        shared_with_email: sharedWithEmail,
        share_token: shareToken,
        can_edit: canEdit,
        expires_at: expiresAt.toISOString()
      });

    if (error) throw error;

    // สร้าง share URL
    const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://crystal-labolatories-zc28.vercel.app'}/wishlist/shared/${shareToken}`;

    return { 
      success: true,
      shareUrl,
      message: "สร้างลิงก์แชร์สำเร็จ"
    };
  } catch (error) {
    console.error("Error sharing wishlist:", error);
    return { error: "ไม่สามารถแชร์รายการโปรดได้" };
  }
}

// ==================== 7. Mark notification as read ====================
export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "กรุณาล็อกอินก่อน" };
  }

  try {
    const { error } = await supabase
      .from("wishlist_notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/profile/wishlist");
    
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { error: "ไม่สามารถอัพเดตการแจ้งเตือนได้" };
  }
}

// ==================== 8. ดึง shared wishlist ====================
export async function getSharedWishlist(token: string) {
  const supabase = await createClient();

  try {
    // ดึงข้อมูล sharing
    const { data: shareData } = await supabase
      .from("wishlist_shared")
      .select(`
        *,
        wishlist:wishlist_id (
          user_id,
          plugin_id,
          plugin_data,
          created_at,
          user:user_id (
            email
          )
        )
      `)
      .eq("share_token", token)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (!shareData) {
      return { error: "ลิงก์แชร์ไม่ถูกต้องหรือหมดอายุ" };
    }

    // ดึง wishlist items ของ user นั้น
    const { data: wishlistItems } = await supabase
      .from("wishlist")
      .select(`
        id,
        plugin_id,
        plugin_data,
        notes,
        created_at
      `)
      .eq("user_id", shareData.wishlist.user_id)
      .order("created_at", { ascending: false });

    return {
      success: true,
      data: {
        share: shareData,
        items: wishlistItems || [],
        owner: shareData.wishlist.user
      }
    };
  } catch (error) {
    console.error("Error getting shared wishlist:", error);
    return { error: "ไม่สามารถดึงรายการที่แชร์ได้" };
  }
}
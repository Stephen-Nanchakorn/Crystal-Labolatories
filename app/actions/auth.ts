"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ==================== 1. เปลี่ยนรหัสผ่าน (ต้องรู้รหัสเก่า) ====================
export async function changePassword(currentPassword: string, newPassword: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "กรุณาล็อกอินก่อน" };
  }

  try {
    // อัปเดตรหัสผ่าน
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      console.error("Error changing password:", error);
      
      // Handle specific errors
      if (error.message.includes("Password should be at least")) {
        return { error: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร" };
      }
      
      return { error: "ไม่สามารถเปลี่ยนรหัสผ่านได้" };
    }

    revalidatePath("/profile");
    
    return {
      success: true,
      message: "เปลี่ยนรหัสผ่านสำเร็จแล้ว"
    };
  } catch (error) {
    console.error("Error changing password:", error);
    return { error: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน" };
  }
}

// ==================== 2. ส่งอีเมลรีเซ็ตรหัสผ่าน ====================
export async function sendPasswordResetEmail(email: string) {
  const supabase = await createClient();
  
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://crystal-labolatories-zc28.vercel.app'}/profile/password/reset`,
    });

    if (error) {
      console.error("Error sending reset email:", error);
      return { error: "ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้" };
    }

    return {
      success: true,
      message: "ส่งอีเมลรีเซ็ตรหัสผ่านแล้ว กรุณาตรวจสอบอีเมลของคุณ"
    };
  } catch (error) {
    console.error("Error sending reset email:", error);
    return { error: "เกิดข้อผิดพลาดในการส่งอีเมล" };
  }
}

// ==================== 3. อัปเดตรหัสผ่านจากลิงก์รีเซ็ต ====================
export async function updatePasswordFromReset(newPassword: string) {
  const supabase = await createClient();
  
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      console.error("Error updating password from reset:", error);
      return { error: "ไม่สามารถอัปเดตรหัสผ่านได้" };
    }

    return {
      success: true,
      message: "อัปเดตรหัสผ่านสำเร็จแล้ว"
    };
  } catch (error) {
    console.error("Error updating password from reset:", error);
    return { error: "เกิดข้อผิดพลาดในการอัปเดตรหัสผ่าน" };
  }
}

// ==================== 4. เช็คสถานะการรีเซ็ตรหัสผ่าน ====================
export async function verifyResetToken() {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      return { error: "ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุ" };
    }

    return {
      success: true,
      user: data.user
    };
  } catch (error) {
    console.error("Error verifying reset token:", error);
    return { error: "ไม่สามารถตรวจสอบลิงก์รีเซ็ตได้" };
  }
}

// ==================== 5. อัปเดตอีเมล ====================
export async function updateEmail(newEmail: string, currentPassword: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "กรุณาล็อกอินก่อน" };
  }

  try {
    // ต้องตรวจสอบรหัสผ่านปัจจุบันก่อน
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword
    });

    if (signInError) {
      return { error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" };
    }

    // อัปเดตอีเมล
    const { error: updateError } = await supabase.auth.updateUser({
      email: newEmail
    });

    if (updateError) {
      console.error("Error updating email:", updateError);
      return { error: "ไม่สามารถอัปเดตอีเมลได้" };
    }

    revalidatePath("/profile");
    
    return {
      success: true,
      message: "ส่งคำขอเปลี่ยนอีเมลแล้ว กรุณาตรวจสอบอีเมลใหม่ของคุณ"
    };
  } catch (error) {
    console.error("Error updating email:", error);
    return { error: "เกิดข้อผิดพลาดในการอัปเดตอีเมล" };
  }
}
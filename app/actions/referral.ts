"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function generateReferralLink() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "กรุณาล็อกอินก่อน" };
  }

  try {
    // ใช้ function ที่สร้างไว้ใน database
    const { data: codeResult, error: functionError } = await supabase
      .rpc('generate_referral_code');

    if (functionError) {
      // ถ้า RPC ไม่ได้ ให้ใช้ client-side generation
      const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      const { data, error } = await supabase
        .from("referral_links")
        .insert({
          user_id: user.id,
          code: referralCode
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          // ถ้า code ซ้ำ ลองใหม่
          return await generateReferralLink();
        }
        throw error;
      }

      revalidatePath("/refer");
      return { 
        success: true, 
        data: {
          code: referralCode,
          link: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://crystal-labolatories-zc28.vercel.app'}/?ref=${referralCode}`
        }
      };
    }

    // ถ้า RPC สำเร็จ
    const referralCode = codeResult;
    const { data, error } = await supabase
      .from("referral_links")
      .insert({
        user_id: user.id,
        code: referralCode
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/refer");
    return { 
      success: true, 
      data: {
        code: referralCode,
        link: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://crystal-labolatories-zc28.vercel.app'}/?ref=${referralCode}`
      }
    };
    
  } catch (error) {
    console.error("Error generating referral link:", error);
    return { error: "ไม่สามารถสร้างลิงก์ได้ในขณะนี้" };
  }
}

// ฟังก์ชันอื่นๆ ใช้ public.users แทน users
export async function getReferralStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "กรุณาล็อกอินก่อน" };
  }

  try {
    // ดึงข้อมูลจาก public.users
    const { data: userProfile } = await supabase
      .from("users")
      .select("balance, referral_code, referred_by")
      .eq("id", user.id)
      .single();

    // ดึงข้อมูล referral link
    const { data: referralLink } = await supabase
      .from("referral_links")
      .select("*")
      .eq("user_id", user.id)
      .single();

    // ดึงข้อมูล conversions
    const { data: conversions } = await supabase
      .from("referral_conversions")
      .select("*")
      .eq("referrer_id", user.id)
      .order("created_at", { ascending: false });

    // ดึงข้อมูล credits
    const { data: credits } = await supabase
      .from("user_credits")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const totalEarned = referralLink?.total_earned || 0;
    const totalClicks = referralLink?.clicks || 0;
    const totalConversions = referralLink?.conversions || 0;
    const availableCredits = userProfile?.balance || 0;

    return {
      success: true,
      data: {
        referralLink,
        conversions: conversions || [],
        credits: credits || [],
        userProfile,
        stats: {
          totalEarned,
          totalClicks,
          totalConversions,
          availableCredits,
          conversionRate: totalClicks > 0 
            ? ((totalConversions / totalClicks) * 100).toFixed(1) 
            : "0.0"
        }
      }
    };
  } catch (error) {
    console.error("Error getting referral stats:", error);
    return { error: "ไม่สามารถดึงข้อมูลได้" };
  }
}
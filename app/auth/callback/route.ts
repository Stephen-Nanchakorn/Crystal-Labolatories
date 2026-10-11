import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  // ถ้าไม่มี code ให้ redirect ไปหน้า home
  if (!code) {
    return NextResponse.redirect(requestUrl.origin);
  }

  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("Auth callback error:", error.message);
      // Redirect ไปหน้า login พร้อมส่ง error กลับ
      return NextResponse.redirect(`${requestUrl.origin}/login?error=${encodeURIComponent(error.message)}`);
    }

    // สำเร็จ → redirect ไปหน้าที่ระบุใน next
    const targetUrl = next.startsWith("http")
      ? next
      : `${requestUrl.origin}${next.startsWith('/') ? next : `/${next}`}`;
    return NextResponse.redirect(targetUrl);

  } catch (err) {
    console.error("Unexpected error in callback:", err);
    return NextResponse.redirect(`${requestUrl.origin}/login?error=unexpected_error`);
  }
}

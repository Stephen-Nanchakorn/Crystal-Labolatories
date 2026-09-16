import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // เช็คว่ามี referral code ใน URL หรือไม่
  const ref = request.nextUrl.searchParams.get("ref");
  
  if (ref) {
    // บันทึก referral code ใน cookie (30 วัน)
    response.cookies.set("referral_code", ref, {
      maxAge: 60 * 60 * 24 * 30, // 30 วัน
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    
    // บันทึกใน session storage สำหรับ client-side access
    response.headers.set("X-Referral-Code", ref);
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
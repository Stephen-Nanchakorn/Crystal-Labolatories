// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const country = req.geo?.country || "TH";
  const res = NextResponse.next();
  res.cookies.set("detected-currency", country === "TH" ? "THB" : "USD");
  return res;
}

// กำหนดว่า middleware นี้ทำงานกับ path ไหนบ้าง (ทั้งเว็บ)
export const config = {
  matcher: "/:path*",
};
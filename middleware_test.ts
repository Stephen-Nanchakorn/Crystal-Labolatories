import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("Middleware running for:", req.nextUrl.pathname);
  
  const country = req.headers.get("x-vercel-ip-country") || "TH";
  const res = NextResponse.next();
  
  // ตั้งคุกกี้เฉพาะถ้า path ไม่ใช่ auth callback (เผื่อมีปัญหา)
  if (!req.nextUrl.pathname.startsWith("/auth/callback")) {
    res.cookies.set("detected-currency", country === "TH" ? "THB" : "USD");
  }
  
  return res;
}

export const config = {
  matcher: "/:path*",
};
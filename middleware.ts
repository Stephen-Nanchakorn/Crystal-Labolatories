import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const country = req.headers.get("x-vercel-ip-country") || "TH";
  const res = NextResponse.next();
  res.cookies.set("detected-currency", country === "TH" ? "THB" : "USD");
  return res;
}

export const config = {
  matcher: "/:path*",
};
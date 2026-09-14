import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/header";
import { CurrencyProvider } from "@/app/context/CurrencyContext";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crystal Labs",
  description: "High-quality audio plugins for modern producers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ✅ ครอบทุกหน้าด้วย CurrencyProvider ตัวเดียว */}
        <CurrencyProvider>
          <Header />
          {children}
        </CurrencyProvider>
        <Analytics />
      </body>
    </html>
  );
}
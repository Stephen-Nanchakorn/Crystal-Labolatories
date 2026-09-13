import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/header"; // เราจะสร้างไฟล์นี้ในขั้นตอนถัดไป
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CRYSTAL LABS",
  description: "Premium Audio Plugins",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <Header />
        <main className="min-h-[calc(100vh-80px)]">{children}</main>

        {/* Footer */}
        <footer className="border-t border-gray-800 py-8 px-8 text-center text-gray-500 text-sm">
          <p>© 2026 CRYSTAL LABS. All rights reserved.</p>
        </footer>

        <Analytics />
      </body>
    </html>
  );
}
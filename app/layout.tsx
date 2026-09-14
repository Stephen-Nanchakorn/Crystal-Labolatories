import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/header";
import LiveChat from "@/app/components/LiveChat";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crystal Lab",
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
        <Header />
        {children}
        <LiveChat />
      </body>
    </html>
  );
}
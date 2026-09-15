import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/header";
import SubscriptionHeader from "@/app/components/SubscriptionHeader";
import Footer from "@/app/components/Footer";
import { AppProvider } from "@/app/context/AppContext";
import LiveChat from "@/app/components/LiveChat";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crystal Lab",
  description: "High-quality audio plugins for modern producers",
};

export default function RootLayout({
  children,
}: { // ✅ เปลี่ยนจาก ReadOnly/Readonly เป็น type ง่ายๆ
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <SubscriptionHeader />
          <Header />
          {children}
          <Footer />
          <LiveChat />
        </AppProvider>
      </body>
    </html>
  );
}
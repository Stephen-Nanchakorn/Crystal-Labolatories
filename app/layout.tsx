import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/header";
import { AppProvider } from "@/app/context/AppContext";

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
        <AppProvider>
          <Header />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
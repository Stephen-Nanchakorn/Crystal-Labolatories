"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function EmailInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    async function loadInvoice() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        const { data: invoice, error: invoiceError } = await supabase
          .from("invoices")
          .select("invoice_number, billing_email")
          .eq("id", params.id)
          .eq("user_id", user.id)
          .single();

        if (invoiceError) throw invoiceError;

        setInvoiceNumber(invoice.invoice_number);
        setEmail(invoice.billing_email || user.email || "");
        setLoading(false);

      } catch (err: any) {
        console.error("Error loading invoice:", err);
        setError(err.message || "ไม่พบใบเสร็จนี้");
        setLoading(false);
      }
    }

    loadInvoice();
  }, [params.id, router, supabase]);

  const handleSendEmail = async () => {
    setSending(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // ส่ง request ไป API สำหรับส่งอีเมล
      const response = await fetch("/api/invoices/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: params.id,
          email: email,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "ส่งอีเมลไม่สำเร็จ");
      }

      setSent(true);

      // บันทึก history
      await supabase
        .from("invoice_emails")
        .insert({
          invoice_id: params.id,
          user_id: user.id,
          sent_to: email,
          sent_at: new Date().toISOString(),
        });

    } catch (err: any) {
      console.error("Error sending email:", err);
      setError(err.message || "ส่งอีเมลไม่สำเร็จ");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error && !sending) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4">เกิดข้อผิดพลาด</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            href={`/profile/invoices/${params.id}`}
            className="inline-block bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-6 py-3 rounded-lg"
          >
            ← กลับไปหน้าใบเสร็จ
          </Link>
        </div>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">📧</div>
          <h1 className="text-2xl font-bold mb-2">ส่งอีเมลสำเร็จ!</h1>
          <p className="text-gray-400 mb-2">ใบเสร็จ #{invoiceNumber}</p>
          <p className="text-gray-500 text-sm mb-4">
            ใบเสร็จถูกส่งไปยัง
            <br />
            <span className="font-medium text-cyan-300">{email}</span>
          </p>
          <p className="text-gray-500 text-xs mb-6">
            โปรดตรวจสอบ Inbox และ Spam folder
          </p>
          
          <div className="space-y-3">
            <Link
              href={`/profile/invoices/${params.id}`}
              className="block bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-6 py-3 rounded-lg"
            >
              ← กลับไปหน้าใบเสร็จ
            </Link>
            <Link
              href="/profile/invoices"
              className="block border border-gray-700 hover:bg-gray-800 px-6 py-3 rounded-lg"
            >
              ดูใบเสร็จทั้งหมด
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📧</div>
          <h1 className="text-2xl font-bold mb-2">ส่งใบเสร็จไปที่อีเมล</h1>
          <p className="text-gray-400">ใบเสร็จ #{invoiceNumber}</p>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2">อีเมลปลายทาง</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="your@email.com"
            />
            <p className="text-gray-500 text-xs mt-2">
              ใบเสร็จจะถูกส่งไปยังอีเมลนี้
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSendEmail}
              disabled={sending || !email}
              className="w-full bg-cyan-400 hover:bg-cyan-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition-colors"
            >
              {sending ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  กำลังส่ง...
                </>
              ) : (
                "ส่งอีเมลเลย"
              )}
            </button>

            <Link
              href={`/profile/invoices/${params.id}`}
              className="block w-full border border-gray-700 hover:bg-gray-800 text-white py-3 rounded-lg text-center transition-colors"
            >
              ยกเลิก
            </Link>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm">
          <p>อีเมลจะประกอบด้วยใบเสร็จ PDF และข้อมูลการชำระเงิน</p>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { downloadInvoice, sendInvoiceByEmail } from "@/app/actions/invoices";

interface Invoice {
  id: string;
  invoice_number: string;
  total_amount: number;
  currency: string;
  status: "paid" | "pending" | "failed";
  created_at: string;
  items: any;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [emailSending, setEmailSending] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        const { data: invoicesData, error: invoicesError } = await supabase
          .from("invoices")
          .select("id, invoice_number, total_amount, currency, status, created_at, items")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (invoicesError) {
          throw new Error(invoicesError.message);
        }

        setInvoices(invoicesData || []);
      } catch (err: any) {
        setError(err.message || "ไม่สามารถโหลดข้อมูลใบเสร็จได้");
      } finally {
        setLoading(false);
      }
    }

    fetchInvoices();
  }, [router, supabase]);

  function getPluginName(items: any): string {
    try {
      if (Array.isArray(items) && items.length > 0) {
        return items[0].name || items[0].plugin_name || "Plugin";
      }
      return "Plugin";
    } catch {
      return "Plugin";
    }
  }

  async function handleDownload(invoiceId: string, invoiceNumber: string) {
    setDownloading(invoiceId);
    setEmailSuccess(null);
    setEmailError(null);

    const result = await downloadInvoice(invoiceId);

    if (result.success) {
      if (result.useDirectUrl && result.url) {
        window.open(result.url, '_blank');
      } else if (result.redirectPath) {
        router.push(result.redirectPath);
      }
    } else if (result.error) {
      alert(result.error);
    }

    setDownloading(null);
  }

  async function handleSendEmail(invoiceId: string, invoiceNumber: string) {
    setEmailSending(invoiceId);
    setDownloading(null);
    setEmailSuccess(null);
    setEmailError(null);

    const result = await sendInvoiceByEmail(invoiceId);

    if (result.success) {
      setEmailSuccess(result.message || "ส่งอีเมลสำเร็จ!");
      setTimeout(() => setEmailSuccess(null), 5000);
    } else {
      setEmailError(result.error || "ส่งอีเมลไม่สำเร็จ");
    }

    setEmailSending(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">เกิดข้อผิดพลาด</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link href="/profile" className="text-cyan-400 hover:text-cyan-300">
            ← กลับไปหน้าโปรไฟล์
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/profile" className="text-gray-400 hover:text-white mb-4 inline-block">
            ← กลับไปหน้าโปรไฟล์
          </Link>
          <h1 className="text-3xl font-bold">ใบเสร็จของฉัน</h1>
          <p className="text-gray-400 mt-2">
            {invoices.length > 0
              ? `คุณมีใบเสร็จทั้งหมด ${invoices.length} ใบ`
              : "คุณยังไม่มีใบเสร็จ"}
          </p>
        </div>

        {emailSuccess && (
          <div className="bg-green-900/30 border border-green-800 rounded-lg p-4 mb-6">
            <p className="text-green-300">{emailSuccess}</p>
          </div>
        )}
        {emailError && (
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-300">{emailError}</p>
          </div>
        )}

        <div className="space-y-4">
          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">ยังไม่มีใบเสร็จ</p>
              <Link href="/plugins" className="inline-block mt-4 text-cyan-400 hover:text-cyan-300">
                เริ่มซื้อปลั๊กอิน →
              </Link>
            </div>
          ) : (
            invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold">#{invoice.invoice_number}</h2>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          invoice.status === "paid"
                            ? "bg-green-900 text-green-300"
                            : invoice.status === "pending"
                            ? "bg-yellow-900 text-yellow-300"
                            : "bg-red-900 text-red-300"
                        }`}
                      >
                        {invoice.status === "paid" ? "ชำระแล้ว" : invoice.status === "pending" ? "รอการชำระ" : "ล้มเหลว"}
                      </span>
                    </div>
                    <p className="text-gray-400">{getPluginName(invoice.items)}</p>
                    <p className="text-2xl font-bold text-cyan-400">
                      {invoice.total_amount} {invoice.currency?.toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(invoice.created_at).toLocaleDateString("th-TH")}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/profile/invoices/${invoice.id}`}
                      className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg text-center transition-colors"
                    >
                      ดูรายละเอียด
                    </Link>
                    <button
                      onClick={() => handleDownload(invoice.id, invoice.invoice_number)}
                      disabled={downloading === invoice.id}
                      className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {downloading === invoice.id ? "กำลังดาวน์โหลด..." : "ดาวน์โหลด"}
                    </button>
                    <button
                      onClick={() => handleSendEmail(invoice.id, invoice.invoice_number)}
                      disabled={emailSending === invoice.id}
                      className="border border-gray-700 hover:bg-gray-800 px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {emailSending === invoice.id ? "กำลังส่ง..." : "ส่งไปที่อีเมล"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
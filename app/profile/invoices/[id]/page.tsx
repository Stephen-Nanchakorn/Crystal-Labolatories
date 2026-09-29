"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { downloadInvoice, sendInvoiceByEmail } from "@/app/actions/invoices";

interface InvoiceItem {
  name?: string;
  plugin_name?: string;
  price?: number;
  quantity?: number;
}

interface Invoice {
  id: string;
  invoice_number: string;
  status: string;
  items: InvoiceItem[];
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  credit_used: number;
  total_amount: number;
  currency: string;
  payment_method: string | null;
  stripe_payment_intent_id: string | null;
  stripe_receipt_url: string | null;
  billing_email: string | null;
  billing_name: string | null;
  created_at: string;
  paid_at: string | null;
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvoice() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        const { data, error: fetchError } = await supabase
          .from("invoices")
          .select("*")
          .eq("id", params.id)
          .eq("user_id", user.id)
          .single();

        if (fetchError || !data) {
          throw new Error("ไม่พบใบเสร็จ");
        }

        setInvoice(data);
      } catch (err: any) {
        setError(err.message || "ไม่พบใบเสร็จ");
      } finally {
        setLoading(false);
      }
    }

    fetchInvoice();
  }, [params.id, router, supabase]);

  async function handleDownload() {
    if (!invoice) return;
    setDownloading(true);

    const result = await downloadInvoice(invoice.id);

    if (result.success) {
      if (result.useDirectUrl && result.url) {
        window.open(result.url, "_blank");
      } else if (result.redirectPath) {
        router.push(result.redirectPath);
      }
    } else if (result.error) {
      alert(result.error);
    }

    setDownloading(false);
  }

  async function handleSendEmail() {
    if (!invoice) return;
    setEmailSending(true);
    setEmailSuccess(null);
    setEmailError(null);

    const result = await sendInvoiceByEmail(invoice.id);

    if (result.success) {
      setEmailSuccess(result.message || "ส่งอีเมลสำเร็จ!");
      setTimeout(() => setEmailSuccess(null), 5000);
    } else {
      setEmailError(result.error || "ส่งอีเมลไม่สำเร็จ");
    }

    setEmailSending(false);
  }

  function getItemsList(items: any): InvoiceItem[] {
    if (Array.isArray(items)) return items;
    return [];
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">ไม่พบใบเสร็จ</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link href="/profile/invoices" className="text-cyan-400 hover:text-cyan-300">
            ← กลับไปหน้ารายการใบเสร็จ
          </Link>
        </div>
      </div>
    );
  }

  const items = getItemsList(invoice.items);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/profile/invoices" className="text-gray-400 hover:text-white mb-6 inline-block">
          ← กลับไปหน้ารายการใบเสร็จ
        </Link>

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

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-2">#{invoice.invoice_number}</h1>
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
            <div className="text-right text-gray-400 text-sm">
              <p>วันที่ออกใบเสร็จ</p>
              <p className="text-white">{new Date(invoice.created_at).toLocaleDateString("th-TH")}</p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 mb-6">
            <h2 className="text-lg font-bold mb-4">รายการสินค้า</h2>
            <div className="space-y-3">
              {items.length > 0 ? (
                items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-gray-300">
                    <span>
                      {item.name || item.plugin_name || "Plugin"}{" "}
                      {item.quantity && item.quantity > 1 ? `x${item.quantity}` : ""}
                    </span>
                    <span>{item.price ?? "-"} {invoice.currency?.toUpperCase()}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">ไม่มีรายละเอียดสินค้า</p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 mb-6 space-y-2">
            <div className="flex justify-between text-gray-400">
              <span>ยอดรวม</span>
              <span>{invoice.subtotal ?? invoice.total_amount} {invoice.currency?.toUpperCase()}</span>
            </div>
            {invoice.discount_amount > 0 && (
              <div className="flex justify-between text-gray-400">
                <span>ส่วนลด</span>
                <span>-{invoice.discount_amount} {invoice.currency?.toUpperCase()}</span>
              </div>
            )}
            {invoice.tax_amount > 0 && (
              <div className="flex justify-between text-gray-400">
                <span>ภาษี</span>
                <span>{invoice.tax_amount} {invoice.currency?.toUpperCase()}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-cyan-400 pt-2 border-t border-gray-800">
              <span>ยอดสุทธิ</span>
              <span>{invoice.total_amount} {invoice.currency?.toUpperCase()}</span>
            </div>
          </div>

          {invoice.stripe_payment_intent_id && (
            <div className="border-t border-gray-800 pt-6 mb-6 text-sm text-gray-500">
              <p>Payment ID: {invoice.stripe_payment_intent_id}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {downloading ? "กำลังดาวน์โหลด..." : "ดาวน์โหลด PDF"}
            </button>
            <button
              onClick={handleSendEmail}
              disabled={emailSending}
              className="flex-1 border border-gray-700 hover:bg-gray-800 px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {emailSending ? "กำลังส่ง..." : "ส่งไปที่อีเมล"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
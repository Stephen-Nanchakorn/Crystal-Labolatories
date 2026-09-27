"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface InvoiceDetail {
  id: string;
  invoice_number: string;
  plugin_id: string;
  plugin_name: string;
  amount_total: number;
  currency: string;
  status: string;
  created_at: string;
  billing_email: string;
  payment_intent_id: string;
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInvoice() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        const { data, error } = await supabase
          .from("invoices")
          .select(`
            id,
            invoice_number,
            plugin_id,
            amount_total,
            currency,
            status,
            created_at,
            billing_email,
            payment_intent_id,
            plugins:plugin_id (name)
          `)
          .eq("id", params.id)
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        setInvoice({
          id: data.id,
          invoice_number: data.invoice_number,
          plugin_id: data.plugin_id,
          plugin_name: (data as any).plugins?.name || data.plugin_id,
          amount_total: data.amount_total,
          currency: data.currency,
          status: data.status,
          created_at: data.created_at,
          billing_email: data.billing_email,
          payment_intent_id: data.payment_intent_id,
        });
      } catch (err: any) {
        console.error("Error loading invoice:", err);
        setError(err.message || "ไม่พบใบเสร็จนี้");
      } finally {
        setLoading(false);
      }
    }

    loadInvoice();
  }, [params.id, router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">ไม่พบใบเสร็จ</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link href="/profile/invoices" className="text-cyan-400 hover:text-cyan-300">
            ← กลับไปหน้ารายการใบเสร็จ
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/profile/invoices" className="text-gray-400 hover:text-white mb-4 inline-block">
            ← กลับไปหน้ารายการใบเสร็จ
          </Link>
          <h1 className="text-3xl font-bold">ใบเสร็จ #{invoice.invoice_number}</h1>
          <p className="text-gray-400 mt-2">สร้างเมื่อ {formatDate(invoice.created_at)}</p>
        </div>

        {/* Invoice Card */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold mb-4">รายละเอียดการซื้อ</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">สินค้า</p>
                  <p className="font-medium">{invoice.plugin_name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">จำนวนเงิน</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    {formatCurrency(invoice.amount_total, invoice.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">สถานะ</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    invoice.status === "paid" 
                      ? "bg-green-900 text-green-300" 
                      : "bg-yellow-900 text-yellow-300"
                  }`}>
                    {invoice.status === "paid" ? "ชำระเงินแล้ว" : invoice.status}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">ข้อมูลการชำระเงิน</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">อีเมลที่ออกใบเสร็จ</p>
                  <p className="font-medium">{invoice.billing_email || "ไม่มีข้อมูล"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">รหัสการชำระเงิน (Stripe)</p>
                  <p className="font-mono text-sm text-gray-300">{invoice.payment_intent_id || "ไม่มีข้อมูล"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">สกุลเงิน</p>
                  <p className="font-medium">{invoice.currency}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href={`/profile/invoices/${invoice.id}/download`}
            className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-4 rounded-xl text-center transition-colors"
          >
            📥 ดาวน์โหลด PDF
          </Link>
          <Link
            href={`/profile/invoices/${invoice.id}/email`}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white py-4 rounded-xl text-center transition-colors"
          >
            📧 ส่งไปที่อีเมล
          </Link>
          <Link
            href="/profile/invoices"
            className="border border-gray-700 hover:bg-gray-800 text-white py-4 rounded-xl text-center transition-colors"
          >
            ← ดูใบเสร็จทั้งหมด
          </Link>
        </div>

        {/* Note */}
        <div className="text-center text-gray-500 text-sm">
          <p>หากมีข้อสงสัยเกี่ยวกับใบเสร็จ กรุณาติดต่อ support@crystal-labs.com</p>
        </div>
      </div>
    </div>
  );
}
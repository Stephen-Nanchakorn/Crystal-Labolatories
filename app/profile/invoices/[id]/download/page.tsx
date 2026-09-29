"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function DownloadInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");

  useEffect(() => {
    async function downloadInvoice() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        const { data: invoice, error: invoiceError } = await supabase
          .from("invoices")
          .select("*")
          .eq("id", params.id)
          .eq("user_id", user.id)
          .single();

        if (invoiceError || !invoice) {
          throw new Error("Invoice not found");
        }

        setInvoiceNumber(invoice.invoice_number);

        // ✅ ดึงชื่อ plugin จาก items (jsonb) แทนการ join กับตาราง plugins
        const items = Array.isArray(invoice.items) ? invoice.items : [];
        const pluginNames =
          items.map((item: any) => item.name || item.plugin_name || "Plugin").join(", ") || "Plugin";

        const { jsPDF } = await import("jspdf");
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

        doc.setFont("helvetica");

        doc.setFontSize(24);
        doc.setTextColor(6, 182, 212);
        doc.text("CRYSTAL LABS", 20, 25);

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(`INVOICE #${invoice.invoice_number}`, 20, 40);

        doc.setFontSize(11);
        doc.text(`Date: ${new Date(invoice.created_at).toLocaleDateString()}`, 20, 55);
        doc.text(`Plugin: ${pluginNames}`, 20, 65);

        let y = 75;
        if (invoice.discount_amount > 0) {
          doc.text(`Discount: -${invoice.discount_amount} ${invoice.currency}`, 20, y);
          y += 10;
        }
        if (invoice.tax_amount > 0) {
          doc.text(`Tax: ${invoice.tax_amount} ${invoice.currency}`, 20, y);
          y += 10;
        }

        doc.setFontSize(13);
        doc.text(`Total: ${invoice.total_amount} ${invoice.currency}`, 20, y);
        y += 10;

        doc.setFontSize(11);
        doc.text(`Status: ${invoice.status.toUpperCase()}`, 20, y);
        y += 10;

        if (invoice.stripe_payment_intent_id) {
          doc.text(`Payment ID: ${invoice.stripe_payment_intent_id}`, 20, y);
          y += 10;
        }

        doc.setFontSize(10);
        doc.setTextColor(120, 120, 120);
        doc.text("Thank you for your purchase!", 20, y + 20);
        doc.text("Crystal Labs - support@crystal-labs.com", 20, y + 28);

        const pdfBlob = doc.output("blob");

        if (!pdfBlob || pdfBlob.size === 0) {
          throw new Error("Failed to generate PDF blob");
        }

        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice-${invoice.invoice_number}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => URL.revokeObjectURL(url), 1000);

        setLoading(false);
      } catch (err: any) {
        console.error("❌ Download error:", err);
        setError(err.message || "Download failed");
        setLoading(false);
      }
    }

    downloadInvoice();
  }, [params.id, router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-6"></div>
          <h1 className="text-2xl font-bold mb-3">Creating PDF...</h1>
          <p className="text-gray-400 mb-2">invoice-{invoiceNumber || "..."}.pdf</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4">Download Failed</h1>
          <p className="text-red-300 font-mono text-sm mb-6">{error}</p>
          <Link
            href={`/profile/invoices/${params.id}`}
            className="inline-block bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-6 py-3 rounded-lg"
          >
            ← Back to Invoice
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-2">Download Complete!</h1>
        <p className="text-gray-400 mb-6">invoice-{invoiceNumber}.pdf</p>
        <div className="space-y-3">
          <Link
            href={`/profile/invoices/${params.id}`}
            className="block bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-6 py-4 rounded-lg text-center"
          >
            ← Back to Invoice
          </Link>
          <Link
            href="/profile/invoices"
            className="block border border-gray-700 hover:bg-gray-800 px-6 py-4 rounded-lg text-center"
          >
            View All Invoices
          </Link>
        </div>
      </div>
    </div>
  );
}
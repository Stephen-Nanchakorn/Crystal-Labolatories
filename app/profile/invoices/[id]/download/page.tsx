"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function DownloadInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");

  useEffect(() => {
    async function downloadInvoice() {
      try {
        // 1. ตรวจสอบ authentication
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        // 2. ดึงข้อมูล invoice
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

        // 3. ดึงชื่อ plugin
        let pluginName = invoice.plugin_id;
        try {
          const { data: pluginData } = await supabase
            .from("plugins")
            .select("name")
            .eq("id", invoice.plugin_id)
            .single();
          if (pluginData?.name) pluginName = pluginData.name;
        } catch {
          // ใช้ plugin_id แทนถ้าหาไม่เจอ
        }

        // 4. ✅ สำคัญมาก: สร้าง PDF ด้วย jspdf อย่างถูกต้อง
        console.log("Creating PDF with jsPDF...");
        
        // Dynamic import jsPDF
        const { jsPDF } = await import("jspdf");
        
        // สร้าง PDF ใหม่
        const doc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4"
        });

        // ตั้งค่าเริ่มต้น
        doc.setFont("helvetica");
        
        // Header
        doc.setFontSize(24);
        doc.setTextColor(6, 182, 212); // cyan color
        doc.text("CRYSTAL LABS", 20, 25);
        
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(`INVOICE #${invoice.invoice_number}`, 20, 40);
        
        // Invoice details
        doc.setFontSize(11);
        doc.text(`Date: ${new Date(invoice.created_at).toLocaleDateString()}`, 20, 55);
        doc.text(`Plugin: ${pluginName}`, 20, 65);
        doc.text(`Amount: ${invoice.amount_total} ${invoice.currency}`, 20, 75);
        doc.text(`Status: ${invoice.status.toUpperCase()}`, 20, 85);
        
        if (invoice.payment_intent_id) {
          doc.text(`Payment ID: ${invoice.payment_intent_id}`, 20, 95);
        }
        
        // Footer
        doc.setFontSize(10);
        doc.setTextColor(120, 120, 120);
        doc.text("Thank you for your purchase!", 20, 150);
        doc.text("Crystal Labs - support@crystal-labs.com", 20, 158);
        
        // 5. ✅ สำคัญ: สร้าง PDF Blob ด้วยวิธีที่ถูกต้อง
        console.log("Generating PDF blob...");
        const pdfBlob = doc.output("blob");
        
        // ตรวจสอบว่า Blob ถูกต้อง
        console.log("PDF Blob size:", pdfBlob.size, "type:", pdfBlob.type);
        
        if (!pdfBlob || pdfBlob.size === 0) {
          throw new Error("Failed to generate PDF blob");
        }

        // 6. ดาวน์โหลดไฟล์
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice-${invoice.invoice_number}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // รอสักครู่ก่อนลบ URL
        setTimeout(() => {
          URL.revokeObjectURL(url);
          console.log("PDF download completed!");
        }, 1000);

        setLoading(false);

      } catch (err: any) {
        console.error("❌ Download error:", err);
        setError(err.message || "Download failed");
        setLoading(false);
      }
    }

    downloadInvoice();
  }, [params.id, router, supabase]);

  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-6"></div>
          <h1 className="text-2xl font-bold mb-3">Creating PDF...</h1>
          <p className="text-gray-400 mb-2">invoice-{invoiceNumber || "..."}.pdf</p>
          <p className="text-gray-500 text-sm">This may take a few seconds...</p>
        </div>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4">Download Failed</h1>
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-300 font-mono text-sm">{error}</p>
          </div>
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

  // Success UI
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-6">
          <span className="text-5xl">✅</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Download Complete!</h1>
        <p className="text-gray-400 mb-2">invoice-{invoiceNumber}.pdf</p>
        <p className="text-gray-500 text-sm mb-6">
          File has been downloaded to your device
        </p>
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
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

// ✅ ใช้ PDFKit แทน jsPDF (ง่ายกว่า)
const generatePDF = async (invoice: any, pluginName: string) => {
  // สร้าง text-based PDF (ง่ายสุด)
  const pdfContent = `
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 232 >>
stream
BT
/F1 12 Tf
72 720 Td
(CRYSTAL LABS - INVOICE #${invoice.invoice_number}) Tj
0 -20 Td
(Date: ${new Date(invoice.created_at).toLocaleDateString()}) Tj
0 -20 Td
(Plugin: ${pluginName}) Tj
0 -20 Td
(Amount: ${invoice.amount_total} ${invoice.currency}) Tj
0 -20 Td
(Status: ${invoice.status.toUpperCase()}) Tj
0 -20 Td
(Payment ID: ${invoice.payment_intent_id || "N/A"}) Tj
0 -40 Td
(Thank you for your purchase!) Tj
0 -20 Td
(Crystal Labs - support@crystal-labs.com) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000105 00000 n 
0000000205 00000 n 
0000000500 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
657
%%EOF
`;

  return new Blob([pdfContent], { type: "application/pdf" });
};

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
          .select(`
            id,
            invoice_number,
            plugin_id,
            amount_total,
            currency,
            status,
            created_at,
            billing_email,
            payment_intent_id
          `)
          .eq("id", params.id)
          .eq("user_id", user.id)
          .single();

        if (invoiceError || !invoice) {
          throw new Error("ไม่พบใบเสร็จนี้");
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
        } catch (e) {
          console.log("Using plugin ID as name");
        }

        // 4. สร้างและดาวน์โหลด PDF
        const pdfBlob = await generatePDF(invoice, pluginName);
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice-${invoice.invoice_number}.pdf`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);

        // 5. บันทึก history
        try {
          await supabase.from("invoice_downloads").upsert({
            invoice_id: params.id,
            user_id: user.id,
            downloaded_at: new Date().toISOString(),
            file_name: `invoice-${invoice.invoice_number}.pdf`,
          });
        } catch (historyError) {
          console.warn("History save failed:", historyError);
        }

        setLoading(false);

      } catch (err: any) {
        console.error("Download error:", err);
        setError(err.message || "ดาวน์โหลดไม่สำเร็จ");
        setLoading(false);
      }
    }

    downloadInvoice();
  }, [params.id, router, supabase]);

  // ... (loading, error, success UI เหมือนเดิม)
  if (loading) return <LoadingUI invoiceNumber={invoiceNumber} />;
  if (error) return <ErrorUI error={error} params={params} />;
  return <SuccessUI invoiceNumber={invoiceNumber} params={params} />;
}

// Component แยก
function LoadingUI({ invoiceNumber }: { invoiceNumber: string }) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-6"></div>
        <h1 className="text-2xl font-bold mb-3">กำลังสร้าง PDF...</h1>
        <p className="text-gray-400">invoice-{invoiceNumber || "..."}.pdf</p>
      </div>
    </div>
  );
}

function ErrorUI({ error, params }: { error: string, params: any }) {
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

function SuccessUI({ invoiceNumber, params }: { invoiceNumber: string, params: any }) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-2">ดาวน์โหลดสำเร็จ!</h1>
        <p className="text-gray-400 mb-6">invoice-{invoiceNumber}.pdf</p>
        <div className="space-y-3">
          <Link
            href={`/profile/invoices/${params.id}`}
            className="block bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-6 py-3 rounded-lg"
          >
            ← กลับไปหน้าใบเสร็จ
          </Link>
        </div>
      </div>
    </div>
  );
}
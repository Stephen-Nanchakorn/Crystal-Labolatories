"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/app/context/AppContext";
import { getUserInvoices, getInvoiceStats, downloadInvoice, sendInvoiceByEmail } from "@/app/actions/invoices";

// ==================== TYPES ====================
interface InvoiceItem {
  id: string;
  plugin_slug: string;
  plugin_name: string;
  description: string;
  unit_price: number;
  quantity: number;
  discount_percent: number;
  total_price: number;
  created_at: string;
}

interface InvoicePayment {
  id: string;
  payment_method: string;
  amount: number;
  currency: string;
  status: string;
  stripe_payment_intent_id: string;
  payment_date: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  status: string;
  items: InvoiceItem[];
  invoice_items: InvoiceItem[];
  invoice_payments: InvoicePayment[];
  subtotal: number;
  discount_amount: number;
  credit_used: number;
  total_amount: number;
  currency: string;
  payment_method: string;
  stripe_receipt_url: string | null;
  billing_email: string;
  billing_name: string | null;
  created_at: string;
  paid_at: string | null;
}

// ==================== MAIN COMPONENT ====================
export default function InvoicesPage() {
  const { language } = useApp();
  const router = useRouter();
  const supabase = createClient();
  
  // ==================== STATES ====================
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const limit = 10;

  // ==================== EFFECTS ====================
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      if (user) {
        await loadInvoices(1, true);
        await loadStats();
      } else {
        setLoading(false);
      }
    }
    checkAuth();
  }, [supabase.auth]);

  // ==================== FUNCTIONS ====================
  async function loadInvoices(pageNum: number, reset: boolean = false) {
    setLoading(true);
    const offset = (pageNum - 1) * limit;
    
    const result = await getUserInvoices(limit, offset, selectedStatus);
    
    if (result.success && result.data) {
      if (reset) {
        setInvoices(result.data as Invoice[]);
      } else {
        setInvoices(prev => [...prev, ...(result.data as Invoice[])]);
      }
      setTotalCount(result.totalCount || 0);
      setHasMore(result.hasMore || false);
      setPage(pageNum);
    }
    
    setLoading(false);
  }

  async function loadStats() {
    const result = await getInvoiceStats();
    if (result.success && result.data) {
      setStats(result.data);
    }
  }

  async function handleDownload(invoiceId: string, invoiceNumber: string) {
    setDownloading(invoiceId);
    setEmailSuccess(null);
    setEmailError(null);
    
    const result = await downloadInvoice(invoiceId);
    
    if (result.success && result.url) {
      // Open download in new tab
      window.open(result.url, '_blank');
      
      // Or trigger download
      const link = document.createElement('a');
      link.href = result.url;
      link.download = result.fileName || `invoice-${invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (result.error) {
      alert(result.error);
    }
    
    setDownloading(null);
  }

  async function handleSendEmail(invoiceId: string, invoiceNumber: string) {
    setSendingEmail(invoiceId);
    setEmailSuccess(null);
    setEmailError(null);
    
    const result = await sendInvoiceByEmail(invoiceId);
    
    if (result.success) {
      setEmailSuccess(result.message || "ส่งอีเมลสำเร็จ");
      setTimeout(() => setEmailSuccess(null), 5000);
    } else if (result.error) {
      setEmailError(result.error);
      setTimeout(() => setEmailError(null), 5000);
    }
    
    setSendingEmail(null);
  }

  function handleStatusFilter(status: string) {
    setSelectedStatus(status);
    loadInvoices(1, true);
  }

  function loadMore() {
    if (hasMore && !loading) {
      loadInvoices(page + 1, false);
    }
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      language === "th" ? "th-TH" : "en-US",
      { day: 'numeric', month: 'short', year: 'numeric' }
    );
  }

  function getStatusText(status: string): string {
    const translations = language === "th" ? {
      draft: "แบบร่าง",
      pending: "รอชำระ",
      paid: "ชำระแล้ว",
      refunded: "คืนเงิน",
      cancelled: "ยกเลิก",
      failed: "ล้มเหลว"
    } : {
      draft: "Draft",
      pending: "Pending",
      paid: "Paid",
      refunded: "Refunded",
      cancelled: "Cancelled",
      failed: "Failed"
    };
    return translations[status as keyof typeof translations] || status;
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'paid': return 'bg-green-900/30 text-green-400';
      case 'pending': return 'bg-yellow-900/30 text-yellow-400';
      case 'draft': return 'bg-blue-900/30 text-blue-400';
      case 'refunded': return 'bg-purple-900/30 text-purple-400';
      case 'cancelled': return 'bg-red-900/30 text-red-400';
      case 'failed': return 'bg-red-900/30 text-red-400';
      default: return 'bg-gray-800 text-gray-400';
    }
  }

  // ==================== RENDER - NOT LOGGED IN ====================
  if (!isLoggedIn && !loading) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">
            {language === "th" ? "ใบเสร็จของฉัน" : "My Invoices"}
          </h1>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12">
            <div className="text-6xl mb-6">🧾</div>
            <h2 className="text-2xl font-bold mb-4">
              {language === "th" ? "เข้าสู่ระบบเพื่อดูใบเสร็จ" : "Sign in to view invoices"}
            </h2>
            <p className="text-gray-400 mb-8">
              {language === "th"
                ? "ดูประวัติการซื้อและใบเสร็จทั้งหมด"
                : "View your purchase history and all invoices"}
            </p>
            <button
              onClick={() => router.push("/login")}
              className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-8 py-3 rounded-lg transition-colors"
            >
              {language === "th" ? "เข้าสู่ระบบ" : "Sign In"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ==================== RENDER - LOADING ====================
  if (loading && invoices.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="mt-4 text-gray-400">
              {language === "th" ? "กำลังโหลดใบเสร็จ..." : "Loading invoices..."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const symbol = language === "th" ? "฿" : "$";

  // ==================== RENDER - MAIN CONTENT ====================
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {language === "th" ? "ใบเสร็จของฉัน" : "My Invoices"}
          </h1>
          <p className="text-gray-400">
            {language === "th"
              ? "ประวัติการซื้อและใบเสร็จทั้งหมด"
              : "Your purchase history and invoices"}
          </p>
        </div>

        {/* EMAIL NOTIFICATIONS */}
        {emailSuccess && (
          <div className="mb-6 bg-green-900/30 border border-green-700 text-green-400 px-4 py-3 rounded-lg">
            ✅ {emailSuccess}
          </div>
        )}
        
        {emailError && (
          <div className="mb-6 bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
            ❌ {emailError}
          </div>
        )}

        {/* STATS */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-gray-400 text-sm">
                {language === "th" ? "ใบเสร็จทั้งหมด" : "Total Invoices"}
              </div>
              <div className="text-2xl font-bold">{stats.totalInvoices}</div>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-gray-400 text-sm">
                {language === "th" ? "ชำระแล้ว" : "Paid"}
              </div>
              <div className="text-2xl font-bold text-green-400">{stats.paidInvoices}</div>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-gray-400 text-sm">
                {language === "th" ? "รอชำระ" : "Pending"}
              </div>
              <div className="text-2xl font-bold text-yellow-400">{stats.pendingInvoices}</div>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-gray-400 text-sm">
                {language === "th" ? "ใช้จ่ายทั้งหมด" : "Total Spent"}
              </div>
              <div className="text-2xl font-bold text-cyan-400">
                {symbol}{stats.totalSpent.toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {/* FILTERS */}
        <div className="mb-6 bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="font-bold mb-4">
            {language === "th" ? "ตัวกรองใบเสร็จ" : "Invoice Filters"}
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusFilter("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${selectedStatus === "all" ? "bg-cyan-400 text-black" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
            >
              {language === "th" ? "ทั้งหมด" : "All"}
            </button>
            <button
              onClick={() => handleStatusFilter("paid")}
              className={`px-4 py-2 rounded-lg transition-colors ${selectedStatus === "paid" ? "bg-cyan-400 text-black" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
            >
              {language === "th" ? "ชำระแล้ว" : "Paid"}
            </button>
            <button
              onClick={() => handleStatusFilter("pending")}
              className={`px-4 py-2 rounded-lg transition-colors ${selectedStatus === "pending" ? "bg-cyan-400 text-black" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
            >
              {language === "th" ? "รอชำระ" : "Pending"}
            </button>
            <button
              onClick={() => handleStatusFilter("refunded")}
              className={`px-4 py-2 rounded-lg transition-colors ${selectedStatus === "refunded" ? "bg-cyan-400 text-black" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
            >
              {language === "th" ? "คืนเงิน" : "Refunded"}
            </button>
          </div>
        </div>

        {/* INVOICES LIST */}
        {invoices.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-6">🧾</div>
            <h2 className="text-2xl font-bold mb-4">
              {language === "th" ? "ยังไม่มีใบเสร็จ" : "No invoices yet"}
            </h2>
            <p className="text-gray-400 mb-8">
              {language === "th"
                ? "เริ่มซื้อปลั๊กอินเพื่อสร้างใบเสร็จแรกของคุณ"
                : "Start purchasing plugins to create your first invoice"}
            </p>
            <button
              onClick={() => router.push("/plugins")}
              className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-8 py-3 rounded-lg transition-colors"
            >
              {language === "th" ? "สำรวจปลั๊กอิน" : "Browse Plugins"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => {
              const invoiceItems = invoice.invoice_items || invoice.items || [];
              const payment = invoice.invoice_payments?.[0];
              const currencySymbol = invoice.currency === "THB" ? "฿" : "$";
              
              return (
                <div key={invoice.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-colors">
                  <div className="p-5">
                    {/* INVOICE HEADER */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold">
                            {invoice.invoice_number}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(invoice.status)}`}>
                            {getStatusText(invoice.status)}
                          </span>
                        </div>
                        <div className="text-gray-400 text-sm mt-1">
                          {formatDate(invoice.created_at)}
                          {invoice.paid_at && ` • ${language === "th" ? "ชำระเมื่อ" : "Paid on"} ${formatDate(invoice.paid_at)}`}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-cyan-400">
                          {currencySymbol}{invoice.total_amount.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-400">
                          {payment?.payment_method || invoice.payment_method}
                        </div>
                      </div>
                    </div>

                    {/* INVOICE ITEMS */}
                    <div className="mb-4">
                      <div className="text-gray-400 text-sm mb-2">
                        {language === "th" ? "รายการสินค้า" : "Items"} ({invoiceItems.length})
                      </div>
                      <div className="space-y-2">
                        {invoiceItems.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">•</span>
                              <span className="truncate max-w-xs">
                                {item.plugin_name || item.description}
                              </span>
                              <span className="text-gray-500">
                                x{item.quantity || 1}
                              </span>
                            </div>
                            <div>
                              {currencySymbol}{item.total_price.toFixed(2)}
                            </div>
                          </div>
                        ))}
                        {invoiceItems.length > 2 && (
                          <div className="text-gray-500 text-sm">
                            + {invoiceItems.length - 2} {language === "th" ? "รายการอื่น" : "more items"}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* SUMMARY */}
                    <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">
                          {language === "th" ? "ยอดรวมก่อนลด" : "Subtotal"}
                        </div>
                        <div>{currencySymbol}{invoice.subtotal.toFixed(2)}</div>
                      </div>
                      
                      {invoice.discount_amount > 0 && (
                        <div>
                          <div className="text-gray-400">
                            {language === "th" ? "ส่วนลด" : "Discount"}
                          </div>
                          <div className="text-green-400">
                            -{currencySymbol}{invoice.discount_amount.toFixed(2)}
                          </div>
                        </div>
                      )}
                      
                      {invoice.credit_used > 0 && (
                        <div>
                          <div className="text-gray-400">
                            {language === "th" ? "ใช้เครดิต" : "Credit Used"}
                          </div>
                          <div className="text-cyan-400">
                            -{currencySymbol}{invoice.credit_used.toFixed(2)}
                          </div>
                        </div>
                      )}
                      
                      <div className="col-span-2 border-t border-gray-800 pt-2 mt-2">
                        <div className="flex justify-between font-bold">
                          <span>{language === "th" ? "ยอดสุทธิ" : "Total"}</span>
                          <span>{currencySymbol}{invoice.total_amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleDownload(invoice.id, invoice.invoice_number)}
                        disabled={downloading === invoice.id}
                        className="border border-gray-700 text-gray-300 hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {downloading === invoice.id ? (
                          <>
                            <span className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full"></span>
                            {language === "th" ? "กำลังดาวน์โหลด..." : "Downloading..."}
                          </>
                        ) : (
                          <>
                            📥 {language === "th" ? "ดาวน์โหลด" : "Download"}
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleSendEmail(invoice.id, invoice.invoice_number)}
                        disabled={sendingEmail === invoice.id}
                        className="border border-gray-700 text-gray-300 hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {sendingEmail === invoice.id ? (
                          <>
                            <span className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full"></span>
                            {language === "th" ? "กำลังส่ง..." : "Sending..."}
                          </>
                        ) : (
                          <>
                            📧 {language === "th" ? "ส่งไปที่อีเมล" : "Email Invoice"}
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => router.push(`/profile/invoices/${invoice.id}`)}
                        className="border border-gray-700 text-gray-300 hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors"
                      >
                        {language === "th" ? "ดูรายละเอียด" : "View Details"}
                      </button>
                      
                      {invoice.stripe_receipt_url && (
                        <a
                          href={invoice.stripe_receipt_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border border-cyan-700 text-cyan-400 hover:bg-cyan-900/20 px-4 py-2 rounded-lg transition-colors"
                        >
                          {language === "th" ? "ใบเสร็จ Stripe" : "Stripe Receipt"}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* PAGINATION */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading
                    ? (language === "th" ? "กำลังโหลด..." : "Loading...")
                    : (language === "th" ? "โหลดเพิ่มเติม" : "Load More")
                  }
                </button>
              </div>
            )}
          </div>
        )}

        {/* INFO SECTION */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">
              {language === "th" ? "เกี่ยวกับใบเสร็จ" : "About Invoices"}
            </h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">📄</span>
                <span>
                  {language === "th"
                    ? "ใบเสร็จจะถูกสร้างอัตโนมัติหลังการชำระเงินสำเร็จ"
                    : "Invoices are automatically generated after successful payment"}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">📧</span>
                <span>
                  {language === "th"
                    ? "ใบเสร็จจะถูกส่งไปที่อีเมลที่ลงทะเบียนไว้"
                    : "Invoices are sent to your registered email"}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">💾</span>
                <span>
                  {language === "th"
                    ? "เก็บใบเสร็จไว้สำหรับการติดตามค่าใช้จ่ายทางธุรกิจ"
                    : "Keep invoices for business expense tracking"}
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">
              {language === "th" ? "ต้องการความช่วยเหลือ?" : "Need Help?"}
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/support")}
                className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-3"
              >
                <span>🛟</span>
                <span>{language === "th" ? "ติดต่อฝ่ายสนับสนุน" : "Contact Support"}</span>
              </button>
              <button
                onClick={() => router.push("/profile/balance")}
                className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-3"
              >
                <span>💰</span>
                <span>{language === "th" ? "ตรวจสอบเครดิต" : "Check Credits"}</span>
              </button>
              <button
                onClick={() => router.push("/subscription")}
                className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-3"
              >
                <span>🔄</span>
                <span>{language === "th" ? "จัดการสมาชิก" : "Manage Subscription"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
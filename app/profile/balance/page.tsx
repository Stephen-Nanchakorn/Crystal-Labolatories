"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/app/context/AppContext";
import { getTransactionHistory } from "@/app/actions/credit";

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  description: string;
  reference_type: string;
  status: string;
  created_at: string;
}

interface FilterOptions {
  type: string;
  startDate: string;
  endDate: string;
  status: string;
}

export default function BalanceHistoryPage() {
  const { language } = useApp();
  const router = useRouter();
  const supabase = createClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({
    type: "all",
    startDate: "",
    endDate: "",
    status: "all"
  });

  const limit = 20;

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      if (user) {
        await loadTransactions(1, true);
      } else {
        setLoading(false);
      }
    }
    checkAuth();
  }, [supabase.auth]);

  async function loadTransactions(pageNum: number, reset: boolean = false) {
    setLoading(true);
    
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return;

    const offset = (pageNum - 1) * limit;
    
    // สร้าง filter object
    const filterObj: any = {};
    if (filters.type !== "all") filterObj.type = filters.type;
    if (filters.startDate) filterObj.startDate = filters.startDate;
    if (filters.endDate) filterObj.endDate = filters.endDate;

    const result = await getTransactionHistory(userId, filterObj, limit, offset);
    
    if (result.success) {
      if (reset) {
        setTransactions(result.data);
      } else {
        setTransactions(prev => [...prev, ...result.data]);
      }
      setTotalCount(result.totalCount);
      setHasMore(result.hasMore);
      setPage(pageNum);
    }
    
    setLoading(false);
  }

  function handleFilterChange(key: keyof FilterOptions, value: string) {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  function applyFilters() {
    loadTransactions(1, true);
  }

  function resetFilters() {
    setFilters({
      type: "all",
      startDate: "",
      endDate: "",
      status: "all"
    });
    loadTransactions(1, true);
  }

  function loadMore() {
    if (hasMore && !loading) {
      loadTransactions(page + 1, false);
    }
  }

  // ถ้ายังไม่ล็อกอิน
  if (!isLoggedIn && !loading) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">
            {language === "th" ? "ประวัติเครดิต" : "Credit History"}
          </h1>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12">
            <div className="text-6xl mb-6">📊</div>
            <h2 className="text-2xl font-bold mb-4">
              {language === "th" ? "เข้าสู่ระบบเพื่อดูประวัติ" : "Sign in to view history"}
            </h2>
            <p className="text-gray-400 mb-8">
              {language === "th"
                ? "ดูประวัติการทำธุรกรรมเครดิตทั้งหมดได้หลังจากเข้าสู่ระบบ"
                : "View all credit transaction history after signing in"}
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

  const symbol = language === "th" ? "฿" : "$";

  // ฟังก์ชันแปลประเภท transaction
  const getTypeText = (type: string) => {
    const translations = language === "th" ? {
      earn: "ได้รับ",
      spend: "ใช้จ่าย",
      transfer_in: "รับโอน",
      transfer_out: "โอนออก",
      all: "ทั้งหมด"
    } : {
      earn: "Earned",
      spend: "Spent",
      transfer_in: "Transfer In",
      transfer_out: "Transfer Out",
      all: "All"
    };
    return translations[type as keyof typeof translations] || type;
  };

  // ฟังก์ชันแปลสถานะ
  const getStatusText = (status: string) => {
    const translations = language === "th" ? {
      completed: "สำเร็จ",
      pending: "รอดำเนินการ",
      failed: "ล้มเหลว",
      cancelled: "ยกเลิก",
      all: "ทั้งหมด"
    } : {
      completed: "Completed",
      pending: "Pending",
      failed: "Failed",
      cancelled: "Cancelled",
      all: "All"
    };
    return translations[status as keyof typeof translations] || status;
  };

  // ฟังก์ชันแปลงวันที่
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      language === "th" ? "th-TH" : "en-US",
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  };

  // ฟังก์ชันได้สัญลักษณ์และสี
  const getTransactionDetails = (transaction: Transaction) => {
    const isEarn = transaction.transaction_type === "earn" || transaction.transaction_type === "transfer_in";
    
    return {
      sign: isEarn ? "+" : "-",
      color: isEarn ? "text-green-400" : "text-cyan-400",
      bgColor: isEarn ? "bg-green-900/20" : "bg-cyan-900/20",
      icon: isEarn ? "💰" : "💸",
      typeColor: isEarn ? "bg-green-900/30 text-green-400" : "bg-cyan-900/30 text-cyan-400"
    };
  };

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {language === "th" ? "ประวัติเครดิต" : "Credit History"}
              </h1>
              <p className="text-gray-400">
                {language === "th"
                  ? "ประวัติการทำธุรกรรมเครดิตทั้งหมด"
                  : "Complete credit transaction history"}
              </p>
            </div>
            <button
              onClick={() => router.push("/profile/balance")}
              className="text-cyan-400 hover:text-cyan-300"
            >
              ← {language === "th" ? "กลับไปที่เครดิต" : "Back to Credits"}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-gray-400 text-sm">
                {language === "th" ? "ธุรกรรมทั้งหมด" : "Total Transactions"}
              </div>
              <div className="text-2xl font-bold">{totalCount}</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-gray-400 text-sm">
                {language === "th" ? "รายได้ทั้งหมด" : "Total Earnings"}
              </div>
              <div className="text-2xl font-bold text-green-400">
                {symbol}
                {transactions
                  .filter(t => t.transaction_type === "earn" || t.transaction_type === "transfer_in")
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-gray-400 text-sm">
                {language === "th" ? "ใช้จ่ายทั้งหมด" : "Total Spending"}
              </div>
              <div className="text-2xl font-bold text-cyan-400">
                {symbol}
                {transactions
                  .filter(t => t.transaction_type === "spend" || t.transaction_type === "transfer_out")
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-gray-400 text-sm">
                {language === "th" ? "แสดง" : "Showing"}
              </div>
              <div className="text-2xl font-bold">{transactions.length}</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {language === "th" ? "ตัวกรอง" : "Filters"}
          </h2>
          
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            {/* Type Filter */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                {language === "th" ? "ประเภท" : "Type"}
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">{getTypeText("all")}</option>
                <option value="earn">{getTypeText("earn")}</option>
                <option value="spend">{getTypeText("spend")}</option>
                <option value="transfer_in">{getTypeText("transfer_in")}</option>
                <option value="transfer_out">{getTypeText("transfer_out")}</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                {language === "th" ? "สถานะ" : "Status"}
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">{getStatusText("all")}</option>
                <option value="completed">{getStatusText("completed")}</option>
                <option value="pending">{getStatusText("pending")}</option>
                <option value="failed">{getStatusText("failed")}</option>
                <option value="cancelled">{getStatusText("cancelled")}</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                {language === "th" ? "เริ่มวันที่" : "From Date"}
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                {language === "th" ? "ถึงวันที่" : "To Date"}
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={applyFilters}
              className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-6 py-2 rounded-lg transition-colors"
            >
              {language === "th" ? "ใช้ตัวกรอง" : "Apply Filters"}
            </button>
            <button
              onClick={resetFilters}
              className="border border-gray-700 text-gray-300 hover:bg-gray-800 font-bold px-6 py-2 rounded-lg transition-colors"
            >
              {language === "th" ? "รีเซ็ต" : "Reset"}
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {loading && transactions.length === 0 ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
              <p className="mt-4 text-gray-400">
                {language === "th" ? "กำลังโหลด..." : "Loading..."}
              </p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold mb-2">
                {language === "th" ? "ไม่พบธุรกรรม" : "No transactions found"}
              </h3>
              <p className="text-gray-400">
                {language === "th"
                  ? "ลองเปลี่ยนตัวกรองหรือเริ่มทำธุรกรรมใหม่"
                  : "Try changing filters or start making transactions"}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left p-4 text-gray-400">
                        {language === "th" ? "วันที่และเวลา" : "Date & Time"}
                      </th>
                      <th className="text-left p-4 text-gray-400">
                        {language === "th" ? "ประเภท" : "Type"}
                      </th>
                      <th className="text-left p-4 text-gray-400">
                        {language === "th" ? "รายละเอียด" : "Description"}
                      </th>
                      <th className="text-left p-4 text-gray-400">
                        {language === "th" ? "จำนวน" : "Amount"}
                      </th>
                      <th className="text-left p-4 text-gray-400">
                        {language === "th" ? "สถานะ" : "Status"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => {
                      const details = getTransactionDetails(transaction);
                      return (
                        <tr
                          key={transaction.id}
                          className="border-b border-gray-800/50 hover:bg-gray-800/30"
                        >
                          <td className="p-4">
                            <div className="text-sm">
                              {formatDate(transaction.created_at)}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span>{details.icon}</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${details.typeColor}`}>
                                {getTypeText(transaction.transaction_type)}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="max-w-xs">
                              {transaction.description}
                              {transaction.reference_type && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {language === "th" ? "อ้างอิง: " : "Ref: "}
                                  {transaction.reference_type}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className={`font-bold ${details.color}`}>
                              {details.sign}
                              {symbol}
                              {transaction.amount.toFixed(2)}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              transaction.status === 'completed'
                                ? 'bg-blue-900/30 text-blue-400'
                                : transaction.status === 'pending'
                                ? 'bg-yellow-900/30 text-yellow-400'
                                : transaction.status === 'failed'
                                ? 'bg-red-900/30 text-red-400'
                                : 'bg-gray-800 text-gray-400'
                            }`}>
                              {getStatusText(transaction.status)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination/Load More */}
              <div className="p-4 border-t border-gray-800">
                <div className="flex justify-between items-center">
                  <div className="text-gray-500 text-sm">
                    {language === "th" 
                      ? `แสดง ${transactions.length} จาก ${totalCount} ธุรกรรม`
                      : `Showing ${transactions.length} of ${totalCount} transactions`}
                  </div>
                  
                  {hasMore && (
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {loading
                        ? (language === "th" ? "กำลังโหลด..." : "Loading...")
                        : (language === "th" ? "โหลดเพิ่มเติม" : "Load More")
                      }
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Export Options */}
        <div className="mt-6 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4">
            {language === "th" ? "ตัวเลือกเพิ่มเติม" : "Additional Options"}
          </h3>
          <div className="flex flex-wrap gap-3">
            <button className="border border-gray-700 text-gray-300 hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors">
              📥 {language === "th" ? "ดาวน์โหลด CSV" : "Download CSV"}
            </button>
            <button className="border border-gray-700 text-gray-300 hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors">
              🧾 {language === "th" ? "พิมพ์รายงาน" : "Print Report"}
            </button>
            <button className="border border-gray-700 text-gray-300 hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors">
              📧 {language === "th" ? "ส่งไปที่อีเมล" : "Email Report"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
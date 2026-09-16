// /app/components/balance/TransactionList.tsx
"use client";

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  description: string;
  created_at: string;
  status: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  language: string;
  symbol: string;
}

export default function TransactionList({
  transactions,
  language,
  symbol
}: TransactionListProps) {
  const getTypeText = (type: string) => {
    if (language === "th") {
      switch (type) {
        case "earn": return "ได้รับ";
        case "spend": return "ใช้จ่าย";
        case "transfer_in": return "รับโอน";
        case "transfer_out": return "โอนออก";
        default: return type;
      }
    } else {
      switch (type) {
        case "earn": return "Earned";
        case "spend": return "Spent";
        case "transfer_in": return "Transfer In";
        case "transfer_out": return "Transfer Out";
        default: return type;
      }
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "earn":
      case "transfer_in":
        return "bg-green-900/30 text-green-400";
      case "spend":
      case "transfer_out":
        return "bg-cyan-900/30 text-cyan-400";
      default:
        return "bg-gray-800 text-gray-400";
    }
  };

  const getSign = (type: string) => {
    return type === "earn" || type === "transfer_in" ? "+" : "-";
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-4 text-gray-400">
                {language === "th" ? "วันที่" : "Date"}
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
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="p-4">
                  {new Date(transaction.created_at).toLocaleDateString(
                    language === "th" ? "th-TH" : "en-US",
                    { day: 'numeric', month: 'short' }
                  )}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(transaction.transaction_type)}`}>
                    {getTypeText(transaction.transaction_type)}
                  </span>
                </td>
                <td className="p-4 max-w-xs truncate">
                  {transaction.description}
                </td>
                <td className="p-4">
                  <span className={
                    transaction.transaction_type === "earn" || transaction.transaction_type === "transfer_in"
                      ? "text-green-400"
                      : "text-cyan-400"
                  }>
                    {getSign(transaction.transaction_type)}
                    {symbol}{Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    transaction.status === 'completed'
                      ? 'bg-blue-900/30 text-blue-400'
                      : transaction.status === 'pending'
                      ? 'bg-yellow-900/30 text-yellow-400'
                      : 'bg-gray-800 text-gray-400'
                  }`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
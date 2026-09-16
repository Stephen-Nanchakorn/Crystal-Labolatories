// /app/components/balance/BalanceCard.tsx
"use client";

interface BalanceCardProps {
  title: string;
  amount: number;
  symbol: string;
  description: string;
  color: "cyan" | "green" | "blue";
}

export default function BalanceCard({
  title,
  amount,
  symbol,
  description,
  color
}: BalanceCardProps) {
  const colorClasses = {
    cyan: "border-cyan-500 bg-gradient-to-br from-gray-900 to-cyan-900/20",
    green: "border-green-500 bg-gradient-to-br from-gray-900 to-green-900/20",
    blue: "border-blue-500 bg-gradient-to-br from-gray-900 to-blue-900/20"
  };

  const textColors = {
    cyan: "text-cyan-400",
    green: "text-green-400",
    blue: "text-blue-400"
  };

  return (
    <div className={`border rounded-2xl p-6 ${colorClasses[color]}`}>
      <div className="text-gray-400 text-sm mb-2">{title}</div>
      <div className={`text-3xl font-bold ${textColors[color]}`}>
        {symbol}{amount.toFixed(2)}
      </div>
      <div className="text-gray-500 text-sm mt-2">{description}</div>
    </div>
  );
}
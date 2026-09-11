"use client";

import { useState, useEffect } from 'react';

export default function PriceDisplay({ usdPrice }: { usdPrice: number }) {
  const [currency, setCurrency] = useState<'THB' | 'USD'>('THB');
  const [exchangeRate, setExchangeRate] = useState(35); // Fixed 35 บาท/1 USD

  const calculatePrice = () => {
    if (currency === 'THB') {
      return Math.round(usdPrice * exchangeRate);
    }
    return usdPrice;
  };

  const symbol = currency === 'THB' ? '฿' : '$';
  const price = calculatePrice();
  const formattedPrice = currency === 'THB' 
    ? price.toLocaleString('th-TH') 
    : price.toLocaleString('en-US', { minimumFractionDigits: 2 });

  return (
    <div className="border border-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-cyan-400">ราคา</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrency('THB')}
            className={`px-3 py-1 rounded-full text-sm ${currency === 'THB' ? 'bg-cyan-400 text-black' : 'bg-gray-800 text-gray-300'}`}
          >
            THB
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-3 py-1 rounded-full text-sm ${currency === 'USD' ? 'bg-cyan-400 text-black' : 'bg-gray-800 text-gray-300'}`}
          >
            USD
          </button>
        </div>
      </div>
      
      <div className="text-3xl font-bold">
        {symbol}{formattedPrice}
        <span className="text-sm text-gray-400 ml-2">
          {currency === 'THB' ? 'บาท' : 'ดอลลาร์'}
        </span>
      </div>
      
      <div className="text-sm text-gray-500 mt-2">
        {currency === 'THB' 
          ? `≈ $${usdPrice.toFixed(2)} USD (คงที่ 35 บาท/1 USD)` 
          : `≈ ฿${(usdPrice * 35).toLocaleString('th-TH')} THB`}
      </div>
    </div>
  );
}
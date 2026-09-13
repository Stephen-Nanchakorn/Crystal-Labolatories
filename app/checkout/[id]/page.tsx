import PriceDisplay from "@/app/components/PriceDisplay";
import { createCheckoutSession } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const pluginPrices = {
  "drop-tune": {
    name: "Drop-Tune",
    usd: 0,
    thb: 0,
  },
  "stem-splitter": {
    name: "Stem Splitter",
    usd: 99,
    thb: 3249,
  },
  "analog-eq": {
    name: "Analog EQ",
    usd: 59,
    thb: 1949,
  },
};

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: pluginId } = await params;
  const supabase = await createClient();

  const plugin = pluginPrices[pluginId as keyof typeof pluginPrices] || {
    name: "Unknown Plugin",
    usd: 1999,
    thb: 69965,
  };

  const pluginPriceUSD = plugin.usd;
  const pluginPriceTHB = plugin.thb;

  // ✅ เปลี่ยนเป็นใช้ THB เท่านั้น (ไม่มีตัวเลือก currency)
  async function handlePurchase() {
    "use server";

    // ในฟังก์ชัน handlePurchase
    const baseUrl = "https://crystal-labolatories-zc28.vercel.app";
    const successUrl = `${baseUrl}/purchase-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/plugins/${pluginId}`;


    const checkoutUrl = await createCheckoutSession(
      pluginId,
      1,
      "THB", // ✅ ใช้ THB เท่านั้น
      successUrl,
      cancelUrl
    );

    redirect(checkoutUrl!);
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">ชำระเงิน</h1>

        {/* Product Info */}
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">{plugin.name}</h2>
          <p className="text-gray-400">License: Lifetime, Updates Included</p>
        </div>

        {/* Price Display (แสดงแค่ THB) */}
        <PriceDisplay usdPrice={pluginPriceUSD} thbPrice={pluginPriceTHB} />

        {/* ✅ ปุ่ม Purchase เดียว */}
        <form action={handlePurchase} className="mt-8">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-black font-bold py-4 rounded-xl text-lg"
          >
            🛒 Purchase Now
          </button>
        </form>

        {/* ✅ ลบบรรทัด USD, PromptPay ออกทั้งหมด */}

      </div>
    </main>
  );
}
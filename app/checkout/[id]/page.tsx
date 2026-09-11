import PriceDisplay from "@/app/components/PriceDisplay";
import { getPriceInCurrency, createCheckoutSession } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: pluginId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pluginPriceUSD = 1999; // $19.99 USD

  // Server Action ในตัวเดียวกัน
  async function createStripeSession(currency: "THB" | "USD") {
    "use server";
    
    const successUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/plugin/${pluginId}`;

    const checkoutUrl = await createCheckoutSession(
      pluginId,
      1,
      currency,
      successUrl,
      cancelUrl
    );

    redirect(checkoutUrl!);
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">ชำระเงิน</h1>

        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Plugin Name</h2>
          <p className="text-gray-400">License: Lifetime, Updates Included</p>
        </div>

        <PriceDisplay usdPrice={pluginPriceUSD / 100} />

        <div className="mt-8 space-y-4">
          {/* ปุ่ม THB */}
          <form action={createStripeSession.bind(null, "THB")}>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-black font-bold py-4 rounded-xl text-lg"
            >
              ชำระด้วยบัตรหรือ PromptPay (THB)
            </button>
          </form>

          {/* ปุ่ม USD */}
          <form action={createStripeSession.bind(null, "USD")}>
            <button
              type="submit"
              className="w-full border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 font-bold py-4 rounded-xl text-lg"
            >
              Pay with Card (USD)
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
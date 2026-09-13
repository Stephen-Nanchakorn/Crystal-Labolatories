import Stripe from "stripe";

// ✅ Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-08-26.dahlia",
});

// ✅ Helper: แปลงราคาเป็น cents/satang
function getPriceInCents(pluginId: string, currency: "THB" | "USD"): number {
  const prices = {
    "drop-tune": { thb: 0, usd: 0 },
    "stem-splitter": { thb: 3249 * 100, usd: 99 * 100 }, // 3249 บาท = 324900 satang
    "analog-eq": { thb: 1949 * 100, usd: 59 * 100 }, // 1949 บาท = 194900 satang
  };
  
  const plugin = prices[pluginId as keyof typeof prices] || { thb: 0, usd: 0 };
  return currency === "THB" ? plugin.thb : plugin.usd;
}

// ✅ Main function สำหรับสร้าง checkout session
export async function createCheckoutSession(
  pluginId: string,
  quantity: number,
  currency: "THB" | "USD",
  successUrl: string,
  cancelUrl: string
) {
  try {
    // ✅ ตรวจสอบ environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not set");
      return null;
    }

    const unitAmount = getPriceInCents(pluginId, currency);
    
    // ✅ ตรวจสอบราคา (ต้อง > 0 ยกเว้น drop-tune)
    if (unitAmount <= 0 && pluginId !== "drop-tune") {
      console.error("Invalid price for plugin:", pluginId);
      return null;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: currency === "THB" ? ["card", "promptpay"] : ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `Crystal Labs - ${pluginId.replace("-", " ").toUpperCase()}`,
              description: "Lifetime license with free updates",
            },
            unit_amount: unitAmount,
          },
          quantity,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        pluginId,
        currency,
      },
    });

    return session.url;
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return null;
  }
}

// ✅ Optional: ฟังก์ชันสำหรับสร้าง product ใน Stripe Dashboard
export async function createStripeProductIfNotExists(pluginId: string, name: string) {
  try {
    const products = await stripe.products.list({
      limit: 100,
    });
    
    const existing = products.data.find(p => p.metadata.pluginId === pluginId);
    if (existing) return existing.id;

    const product = await stripe.products.create({
      name,
      metadata: { pluginId },
    });
    
    return product.id;
  } catch (error) {
    console.error("Error creating Stripe product:", error);
    return null;
  }
}
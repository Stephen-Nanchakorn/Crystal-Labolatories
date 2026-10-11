import { stripe } from "./stripe/config";
import { getPriceInCents, getPluginName } from "@/lib/plugin-prices";
import Stripe from "stripe";

export { stripe };

export async function createCheckoutSession(
  pluginId: string,
  quantity: number,
  currency: "THB" | "USD",
  successUrl: string,
  cancelUrl: string,
  userId: string,
  customerEmail?: string,
  bundlePluginId?: string,
  creditDiscountAmount?: number
) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not set");
      return null;
    }

    const unitAmount = getPriceInCents(pluginId, currency);

    if (unitAmount <= 0 && pluginId !== "drop-tune") {
      console.error("Invalid price for plugin:", pluginId);
      return null;
    }

    if (pluginId === "drop-tune" && !bundlePluginId) {
      return `${successUrl}&free=true`;
    }

    const items: Array<{ plugin_slug: string; plugin_name: string }> = [
      { plugin_slug: pluginId, plugin_name: getPluginName(pluginId) }
    ];

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: `Crystal Labs - ${getPluginName(pluginId)}`,
            description: "Lifetime license with free updates",
          },
          unit_amount: unitAmount,
        },
        quantity,
      },
    ];

    // ✅ รองรับ Mix & Match Bundle (ส่วนลด 25% สำหรับปลั๊กอินที่เพิ่มใน Bundle)
    if (bundlePluginId && bundlePluginId !== pluginId) {
      const bundleFullPriceInCents = getPriceInCents(bundlePluginId, currency);
      const bundleDiscountedPriceInCents = Math.round(bundleFullPriceInCents * 0.75); // ลด 25%

      items.push({
        plugin_slug: bundlePluginId,
        plugin_name: getPluginName(bundlePluginId)
      });

      lineItems.push({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: `Crystal Labs - ${getPluginName(bundlePluginId)} (Mix & Match 25% Off)`,
            description: "Bundle Special Add-on: 25% Discount Lifetime License",
          },
          unit_amount: bundleDiscountedPriceInCents,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: currency === "THB" ? ["card", "promptpay"] : ["card"],
      customer_email: customerEmail,
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        pluginId,
        bundlePluginId: bundlePluginId || "",
        currency,
        userId,
        items: JSON.stringify(items), // Webhook ใช้สร้างสิทธิ์ License ทั้งหมดในออเดอร์
      },
    });

    return session.url;
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return null;
  }
}

export async function verifyPaymentSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    return {
      session,
      paymentIntent: session.payment_intent,
      isPaid: session.payment_status === "paid",
      metadata: session.metadata,
    };
  } catch (error) {
    console.error("Error verifying payment session:", error);
    return null;
  }
}

export async function getPaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error("Error retrieving payment intent:", error);
    return null;
  }
}

export async function createStripeProductIfNotExists(pluginId: string, name: string) {
  try {
    const products = await stripe.products.list({ limit: 100 });
    const existing = products.data.find((p) => p.metadata.pluginId === pluginId);
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

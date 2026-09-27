import { stripe } from "./stripe/config";
import { getPriceInCents, getPluginName } from "@/lib/plugin-prices";

export { stripe };

export async function createCheckoutSession(

  pluginId: string,

  quantity: number,

  currency: "THB" | "USD",

  successUrl: string,

  cancelUrl: string,

  userId: string,

  customerEmail?: string

) {
  try {

    // ✅ เปลี่ยนจาก STRIPE_SECRET_KEY เป็นชื่อที่ถูกต้อง

    if (!process.env.STRIPE_SECRET_KEY) {

      console.error("STRIPE_SECRET_KEY is not set");

      return null;

    }

    const unitAmount = getPriceInCents(pluginId, currency);

    if (unitAmount <= 0 && pluginId !== "drop-tune") {
      console.error("Invalid price for plugin:", pluginId);
      return null;
    }

    if (pluginId === "drop-tune") {
      return `${successUrl}&free=true`;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: currency === "THB" ? ["card", "promptpay"] : ["card"],
      customer_email: customerEmail,
      line_items: [
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
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        pluginId,
        currency,
        userId,
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
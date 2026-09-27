"use server";

import { stripe } from "@/lib/stripe";

export async function createStripeProduct(pluginId: string, name: string) {
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
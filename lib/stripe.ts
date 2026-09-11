import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-08-26.dahlia', // ใช้ version ล่าสุด
});

// คำนวณราคาเป็น THB/USD
export const getPriceInCurrency = (
  usdAmount: number,
  currency: 'THB' | 'USD' = 'THB'
): number => {
  const rates = {
    THB: 35, // Fixed rate 35 บาท/1 USD
    USD: 1,
  };
  return Math.round(usdAmount * rates[currency]);
};

// สร้าง Stripe Checkout Session
export const createCheckoutSession = async (
  productId: string,
  quantity: number = 1,
  currency: 'THB' | 'USD' = 'THB',
  successUrl: string,
  cancelUrl: string
) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'promptpay'], // ✅ Support PromptPay (Stripe)
    line_items: [
      {
        price_data: {
          currency: currency.toLowerCase(), // 'thb' หรือ 'usd'
          product_data: {
            name: `Plugin ${productId}`,
            // ใส่ metadata เพิ่มตามต้องการ
          },
          unit_amount: getPriceInCurrency(1999, currency), // ตัวอย่าง $19.99 USD
        },
        quantity,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      product_id: productId,
      user_id: '...', // ต้องดึงจาก session
    },
  });

  return session.url; // redirect ไป stripe
};
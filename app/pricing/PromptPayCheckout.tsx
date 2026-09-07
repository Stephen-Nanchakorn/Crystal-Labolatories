"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function PromptPayCheckout({
  amount,
  planName,
}: {
  amount: number;
  planName: string;
}) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "waiting" | "success">("idle");

  const handlePay = async () => {
    setStatus("loading");

    const res = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, planName, customerEmail: "user@example.com" }),
    });
    const { clientSecret } = await res.json();

    const stripe = await stripePromise;
    if (!stripe) return;

    const { paymentIntent, error } = await stripe.confirmPromptPayPayment(clientSecret);

    if (error) {
      console.error(error);
      setStatus("idle");
      return;
    }

    const nextAction = paymentIntent?.next_action as any;

    if (nextAction?.promptpay_display_qr_code) {

      setQrCodeUrl(nextAction.promptpay_display_qr_code.image_url_png);

      setStatus("waiting");

      pollPaymentStatus(paymentIntent!.id);

    }
  };

  const pollPaymentStatus = (id: string) => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/check-payment-status?id=${id}`);
      const data = await res.json();
      if (data.status === "succeeded") {
        clearInterval(interval);
        setStatus("success");
      }
    }, 3000);
  };

  return (
    <div className="p-6 border rounded-lg text-center">
      {status === "idle" && (
        <button onClick={handlePay} className="bg-blue-600 text-white px-6 py-3 rounded-lg">
          ชำระเงินด้วย PromptPay
        </button>
      )}
      {status === "loading" && <p>กำลังสร้าง QR Code...</p>}
      {status === "waiting" && qrCodeUrl && (
        <div>
          <p className="mb-3">สแกน QR Code ด้วยแอปธนาคารของคุณ</p>
          <img src={qrCodeUrl} alt="PromptPay QR" className="mx-auto w-64 h-64" />
          <p className="mt-2 text-sm text-gray-500">รอการชำระเงิน...</p>
        </div>
      )}
      {status === "success" && (
        <p className="text-green-600 font-bold">✅ ชำระเงินสำเร็จ!</p>
      )}
    </div>
  );
}
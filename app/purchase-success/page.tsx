import { Suspense } from "react";
import PurchaseSuccessContent from "./PurchaseSuccessContent";

export default function PurchaseSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    }>
      <PurchaseSuccessContent />
    </Suspense>
  );
}
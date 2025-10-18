"use client";

import type { ShippingData } from "./ShippingForm";
import type { PaymentData } from "./PaymentForm";

export default function OrderDone({
  total,
  shipping,
  payment,
  onDone,
}: {
  total: number;
  shipping: ShippingData;
  payment: PaymentData;
  onDone: () => void;
}) {
  return (
    <div className="rounded-2xl border p-8 text-center bg-white shadow-sm">
      <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 grid place-items-center text-2xl">
        ✓
      </div>
      <h3 className="mt-4 text-2xl font-extrabold">Thank you for your order!</h3>
      <p className="mt-2 text-slate-600">
        We’ve sent a confirmation to <span className="font-medium">{shipping.email}</span>.
      </p>
      <div className="mt-4 text-lg">
        Paid: <span className="font-bold">€{total.toFixed(2)}</span> via{" "}
        <span className="font-medium">{payment.method === "card" ? "Card" : "Crypto"}</span>
        {payment.cardLast4 ? ` • **** **** **** ${payment.cardLast4}` : ""}
        {payment.txId ? ` • TX: ${payment.txId.slice(0, 10)}…` : ""}
      </div>
      <button
        onClick={onDone}
        className="mt-6 px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 cursor-pointer"
      >
        Continue shopping
      </button>
    </div>
  );
}

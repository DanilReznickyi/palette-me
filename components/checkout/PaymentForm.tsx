"use client";

import { useMemo, useState } from "react";
import { isValidCardNumber, maskCard } from "@/lib/payments";
import type { ShippingData } from "./ShippingForm";
import { COUNTRIES } from "@/lib/countries";

export type PaymentData = {
  method: "card" | "crypto";
  cardLast4?: string;
  txId?: string;
};

// helpers
const digits = (s: string) => s.replace(/\D/g, "");

const formatCard = (s: string) => {
  const d = digits(s).slice(0, 19); // до 19 цифр (AMEX/др.)
  // группируем по 4: 4-4-4-4-3
  return d
    .match(/.{1,4}/g)
    ?.join(" ")
    .trim() ?? "";
};

const formatExp = (s: string) => {
  const d = digits(s).slice(0, 4); // ММГГ
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
};

const validExp = (exp: string) => {
  // строго MM/YY и MM в 01..12
  const m = exp.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const mm = Number(m[1]);
  return mm >= 1 && mm <= 12;
};

export default function PaymentForm({
  total,
  shipping,
  onSubmit,
  onBack,
}: {
  total: number;
  shipping: ShippingData;
  onSubmit: (data: PaymentData) => void;
  onBack: () => void;
}) {
  const [method, setMethod] = useState<"card" | "crypto">("card");

  // card fields (храним в отформатированном виде, «сырые» цифры вычисляем)
  const [cardNumber, setCardNumber] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");

  // crypto fields
  const [wallet, setWallet] = useState<"USDT" | "BTC" | "ETH">("USDT");
  const address = useMemo(() => {
    if (wallet === "USDT") return "TRC20: TK1b...x93";
    if (wallet === "BTC") return "bc1q...9sk";
    return "0xABC...123";
  }, [wallet]);

  const rawCard = digits(cardNumber);
  const rawCvc = digits(cvc);

  const cardOk =
    method === "crypto" ||
    (isValidCardNumber(rawCard) && validExp(exp) && /^\d{3,4}$/.test(rawCvc));

  // код страны для телефона в Summary
  const phoneDial =
    COUNTRIES.find((c) => c.iso2 === shipping.phoneCountry)?.dial ?? "";

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="rounded-2xl border p-5">
        <h3 className="font-semibold mb-4">Payment method</h3>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setMethod("card")}
            className={`px-4 py-2 rounded-lg border cursor-pointer transition
              ${method === "card" ? "bg-indigo-50 border-indigo-200" : "hover:bg-slate-50"}`}
          >
            💳 Card
          </button>
          <button
            onClick={() => setMethod("crypto")}
            className={`px-4 py-2 rounded-lg border cursor-pointer transition
              ${method === "crypto" ? "bg-indigo-50 border-indigo-200" : "hover:bg-slate-50"}`}
          >
            ₿ Crypto
          </button>
        </div>

        {method === "card" ? (
          <div className="grid gap-4">
            <Field
              label="Card number"
              value={cardNumber}
              onChange={(v) => setCardNumber(formatCard(v))}
              placeholder="4242 4242 4242 4242"
              inputMode="numeric"
            />
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Exp (MM/YY)"
                value={exp}
                onChange={(v) => setExp(formatExp(v))}
                placeholder="12/27"
                inputMode="numeric"
                maxLength={5}
              />
              <Field
                label="CVC"
                value={cvc}
                onChange={(v) => setCvc(digits(v).slice(0, 4))}
                placeholder="123"
                inputMode="numeric"
                maxLength={4}
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            <div>
              <label className="text-sm text-slate-600">Currency</label>
              <select
                value={wallet}
                onChange={(e) => setWallet(e.target.value as any)}
                className="mt-1 w-full rounded-lg border px-3 py-2"
              >
                <option value="USDT">USDT (TRC20)</option>
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-600">Address</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  readOnly
                  value={address}
                  className="w-full rounded-lg border px-3 py-2 bg-slate-50"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(address)}
                  className="px-3 py-2 rounded-lg border hover:bg-slate-50 cursor-pointer"
                >
                  Copy
                </button>
              </div>
              <Field
                label="Transaction ID"
                value={cvc /* переиспользуем состояние */}
                onChange={setCvc}
                placeholder="paste tx id"
              />
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border p-5 bg-slate-50/60">
        <h3 className="font-semibold mb-4">Summary</h3>
        <div className="text-sm text-slate-600">
          <div>
            <span className="font-medium">Name:</span> {shipping.firstName} {shipping.lastName}
          </div>
          <div>
            <span className="font-medium">Email:</span> {shipping.email}
          </div>
          <div>
            <span className="font-medium">Phone:</span> {phoneDial} {shipping.phoneLocal}
          </div>
          <div className="mt-2">
            <span className="font-medium">Address:</span> {shipping.address1}, {shipping.city},{" "}
            {shipping.zip}, {shipping.country}
          </div>
        </div>

        <div className="mt-6 text-xl">
          Total to pay: <span className="font-bold">€{total.toFixed(2)}</span>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-lg border font-semibold hover:bg-slate-50 cursor-pointer"
          >
            ← Back
          </button>
          <button
            disabled={!cardOk}
            onClick={() =>
              onSubmit(
                method === "card"
                  ? { method, cardLast4: maskCard(rawCard) }
                  : { method, txId: cvc || "pending" }
              )
            }
            className={`px-6 py-3 rounded-lg text-white font-semibold cursor-pointer transition
              ${
                cardOk
                  ? "bg-indigo-600 hover:bg-indigo-500"
                  : "bg-slate-300 cursor-not-allowed"
              }`}
          >
            Pay now
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
}) {
  return (
    <div>
      <label className="text-sm text-slate-600">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}

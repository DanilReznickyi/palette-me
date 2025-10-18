"use client";

import { useMemo, useState } from "react";
import { COUNTRIES } from "@/lib/countries";

export type ShippingData = {
  firstName: string;
  lastName: string;
  email: string;
  country: string; // ISO-2
  city: string;
  zip: string;
  address1: string;
  phoneCountry: string; // ISO-2
  phoneLocal: string;   // только цифры
};

const onlyLetters = (s: string) => s.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ \-']/g, "");
const onlyDigits = (s: string) => s.replace(/\D/g, "");
const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const flagFromISO = (iso2: string) =>
  String.fromCodePoint(...[...iso2.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));

export default function ShippingForm({
  initial,
  onSubmit,
  onBack,
}: {
  initial?: ShippingData;
  onSubmit: (data: ShippingData) => void;
  onBack: () => void;
}) {
  const def = COUNTRIES.find((c) => c.iso2 === "DE")!;

  const [firstName, setFirstName] = useState(initial?.firstName ?? "");
  const [lastName, setLastName] = useState(initial?.lastName ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [country, setCountry] = useState(initial?.country ?? def.iso2);
  const [city, setCity] = useState(initial?.city ?? "");
  const [zip, setZip] = useState(initial?.zip ?? "");
  const [address1, setAddress1] = useState(initial?.address1 ?? "");

  const [phoneCountry, setPhoneCountry] = useState(initial?.phoneCountry ?? def.iso2);
  const [phoneLocal, setPhoneLocal] = useState(initial?.phoneLocal ?? "");

  const phoneMeta = useMemo(
    () => COUNTRIES.find((c) => c.iso2 === phoneCountry) ?? def,
    [phoneCountry, def]
  );

  const phoneLenOk =
    phoneLocal.length >= phoneMeta.phone.min && phoneLocal.length <= phoneMeta.phone.max;

  const valid =
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    emailOk(email) &&
    city.trim().length >= 2 &&
    zip.trim().length >= 3 &&
    address1.trim().length >= 5 &&
    phoneLenOk;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        onSubmit({
          firstName,
          lastName,
          email,
          country,
          city,
          zip,
          address1,
          phoneCountry,
          phoneLocal,
        });
      }}
      className="space-y-6"
    >
      {/* Навигация шага */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-lg border font-semibold hover:bg-slate-50 cursor-pointer"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={!valid}
          className={`px-6 py-3 rounded-lg font-semibold cursor-pointer transition text-white ${
            valid ? "bg-indigo-600 hover:bg-indigo-500" : "bg-slate-300 cursor-not-allowed"
          }`}
        >
          Continue →
        </button>
      </div>

      {/* Форма */}
      <div className="rounded-2xl border p-6">
        <h3 className="text-lg font-semibold">Shipping details</h3>
        <p className="mt-1 text-sm text-slate-500">
          Please fill your name, address and a valid phone number.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">First name</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(onlyLetters(e.target.value))}
              placeholder="John"
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Last name</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(onlyLetters(e.target.value))}
              placeholder="Doe"
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border px-3 py-2"
              inputMode="email"
            />
            {!emailOk(email) && email.length > 0 && (
              <p className="mt-1 text-xs text-red-500">Invalid email.</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">
              Phone{" "}
              <span className="text-xs text-slate-500">
                (digits: {phoneMeta.phone.min}–{phoneMeta.phone.max})
              </span>
            </label>

            <div className="flex gap-2">
              {/* ТОЛЬКО один селект: флаг + страна + (+код) */}
              <select
                value={phoneCountry}
                onChange={(e) => setPhoneCountry(e.target.value)}
                className="min-w-[210px] rounded-lg border px-3 py-2"
                title="Phone country"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.iso2} value={c.iso2}>
                    {c.flag ?? flagFromISO(c.iso2)} {c.name} ({c.dial})
                  </option>
                ))}
              </select>

              {/* Локальный номер (без кода) */}
              <input
                value={phoneLocal}
                onChange={(e) => setPhoneLocal(onlyDigits(e.target.value))}
                inputMode="numeric"
                placeholder="1234567"
                className="flex-1 rounded-lg border px-3 py-2"
              />
            </div>

            {!phoneLenOk && phoneLocal.length > 0 && (
              <p className="mt-1 text-xs text-red-500">
                Phone length must be {phoneMeta.phone.min}–{phoneMeta.phone.max} digits (without
                country code).
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
            >
              {COUNTRIES.map((c) => (
                <option key={c.iso2} value={c.iso2}>
                  {(c.flag ?? flagFromISO(c.iso2)) + " " + c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">City</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Berlin"
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">ZIP / Postal code</label>
            <input
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="10115"
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Address line 1</label>
            <input
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              placeholder="Street, house, apt"
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
        </div>
      </div>
    </form>
  );
}

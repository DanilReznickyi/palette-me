"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const q = useSearchParams();
  const email = q.get("email") || "";
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!email) router.replace("/signup");
  }, [email, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, name }),
    });
    setLoading(false);

    if (res.ok) {

      alert("Email verified. Please sign in.");
      router.replace("/signin");
    } else {
      const j = await res.json().catch(() => ({}));
      alert(j.error || "Error");
    }
  }

  return (
    <section className="container mx-auto max-w-xl px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Verify email</h1>
      <p className="mb-4 text-slate-600 text-center">
        We sent a 6-digit code to <b>{email}</b>
      </p>

      <form onSubmit={submit} className="space-y-3">
        <input
          type="text"
          maxLength={6}
          inputMode="numeric"
          placeholder="6-digit code"
          className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-400 tracking-widest text-center"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Name (optional)"
          className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 text-white py-2 hover:bg-indigo-500 disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Please wait..." : "Confirm"}
        </button>
      </form>
    </section>
  );
}

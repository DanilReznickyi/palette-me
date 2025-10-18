"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [birth, setBirth] = useState(""); 
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [submitErr, setSubmitErr] = useState<string | null>(null);

  // Валидации
  const emailRe = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i, []);
  const onlyLettersRe = useMemo(() => /^[\p{L}]+$/u, []);
  const firstOk = !first || onlyLettersRe.test(first);
  const lastOk = !last || onlyLettersRe.test(last);

  const score = useMemo(() => {
    let s = 0;
    if (pass.length >= 8) s++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) s++;
    if (/\d/.test(pass)) s++;
    if (/[^a-zA-Z0-9]/.test(pass)) s++;
    return s;
  }, [pass]);

  const passRules = {
    len: pass.length >= 8,
    case: /[a-z]/.test(pass) && /[A-Z]/.test(pass),
    num: /\d/.test(pass),
    spec: /[^a-zA-Z0-9]/.test(pass),
  };

  const passMatch = pass2.length === 0 || pass === pass2;

  function onEmailBlur() {
    if (!email) {
      setEmailErr(null);
      return;
    }
    if (!emailRe.test(email)) setEmailErr("Please enter a valid email address.");
    else setEmailErr(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitErr(null);

    if (!first || !last || !birth || !email || !pass || !pass2) {
      setSubmitErr("Please fill in all fields.");
      return;
    }
    if (!onlyLettersRe.test(first) || !onlyLettersRe.test(last)) {
      setSubmitErr("First/Last name must contain letters only.");
      return;
    }
    if (!emailRe.test(email)) {
      setEmailErr("Please enter a valid email address.");
      return;
    }
    if (!(passRules.len && passRules.case && passRules.num)) {
      setSubmitErr("Password does not meet requirements.");
      return;
    }
    if (pass !== pass2) {
      setSubmitErr("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: first,
          lastName: last,
          birthDate: birth,
          email,
          password: pass,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setSubmitErr(j.error || "Error");
      } else {
        window.location.href = "/signin";
      }
    } catch {
      setSubmitErr("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container mx-auto px-4 py-10 max-w-xl">
      <h1 className="text-3xl font-bold text-center mb-6">Create account</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <input
              value={first}
              onChange={(e) => setFirst(e.target.value)}
              placeholder="First name"
              className={[
                "w-full rounded-lg border px-4 py-2 outline-none focus:ring-2",
                firstOk ? "focus:ring-indigo-400" : "border-red-400 focus:ring-red-400",
              ].join(" ")}
              inputMode="text"
              autoComplete="given-name"
            />
            {!firstOk && (
              <p className="mt-1 text-sm text-red-600">
                Letters only, no spaces or hyphens.
              </p>
            )}
          </div>

          <div>
            <input
              value={last}
              onChange={(e) => setLast(e.target.value)}
              placeholder="Last name"
              className={[
                "w-full rounded-lg border px-4 py-2 outline-none focus:ring-2",
                lastOk ? "focus:ring-indigo-400" : "border-red-400 focus:ring-red-400",
              ].join(" ")}
              inputMode="text"
              autoComplete="family-name"
            />
            {!lastOk && (
              <p className="mt-1 text-sm text-red-600">
                Letters only, no spaces or hyphens.
              </p>
            )}
          </div>
        </div>

        <input
          type="date"
          value={birth}
          onChange={(e) => setBirth(e.target.value)}
          className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Birth date"
        />

        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={onEmailBlur}
            placeholder="Email"
            className={[
              "w-full rounded-lg border px-4 py-2 outline-none focus:ring-2",
              emailErr ? "border-red-400 focus:ring-red-400" : "focus:ring-indigo-400",
            ].join(" ")}
            autoComplete="email"
          />
          {emailErr && <p className="mt-1 text-sm text-red-600">{emailErr}</p>}
        </div>

        <div className="relative">
          <input
            type={show1 ? "text" : "password"}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Password (min 8, Aa1)"
            className="w-full rounded-lg border px-4 py-2 pr-10 outline-none focus:ring-2 focus:ring-indigo-400"
            autoComplete="new-password"
          />
          <button
            type="button"
            aria-label={show1 ? "Hide password" : "Show password"}
            onClick={() => setShow1((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-100"
          >
            {show1 ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" />
                <path d="M10.6 10.6a3 3 0 104.24 4.24" stroke="currentColor" strokeWidth="1.8" />
                <path d="M9 5.5A11.5 11.5 0 0121 12c-1.2 2.2-3.7 4.5-6.8 5.3" stroke="currentColor" strokeWidth="1.8" />
                <path d="M6.8 7.1C4.7 8.3 3.2 10 3 12c.5 1 1.9 3.2 4.6 4.8" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            )}
          </button>
        </div>

        <div className="h-1.5 w-full bg-slate-200 rounded mt-2 overflow-hidden">
          <div
            className="h-full transition-all"
            style={{
              width: `${(Math.min(score, 4) / 4) * 100}%`,
              background: score < 2 ? "#ef4444" : score < 3 ? "#eab308" : "#22c55e",
            }}
          />
        </div>
        <ul className="text-sm space-y-1 mt-2">
          <li className={passRules.len ? "text-slate-600" : "text-red-600"}>
            • At least 8 characters
          </li>
          <li className={passRules.case ? "text-slate-600" : "text-red-600"}>
            • Upper & lower case
          </li>
          <li className={passRules.num ? "text-slate-600" : "text-red-600"}>
            • At least one number
          </li>
          <li className={passRules.spec ? "text-slate-600" : "text-amber-600"}>
            • Special character recommended
          </li>
        </ul>

        <div className="relative">
          <input
            type={show2 ? "text" : "password"}
            value={pass2}
            onChange={(e) => setPass2(e.target.value)}
            placeholder="Confirm password"
            className={[
              "w-full rounded-lg border px-4 py-2 pr-10 outline-none focus:ring-2",
              passMatch ? "focus:ring-indigo-400" : "border-red-400 focus:ring-red-400",
            ].join(" ")}
            autoComplete="new-password"
          />
          <button
            type="button"
            aria-label={show2 ? "Hide password" : "Show password"}
            onClick={() => setShow2((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-100"
          >
            {show2 ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" />
                <path d="M10.6 10.6a3 3 0 104.24 4.24" stroke="currentColor" strokeWidth="1.8" />
                <path d="M9 5.5A11.5 11.5 0 0121 12c-1.2 2.2-3.7 4.5-6.8 5.3" stroke="currentColor" strokeWidth="1.8" />
                <path d="M6.8 7.1C4.7 8.3 3.2 10 3 12c.5 1 1.9 3.2 4.6 4.8" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            )}
          </button>
          {!passMatch && (
            <p className="mt-1 text-sm text-red-600">Passwords do not match.</p>
          )}
        </div>

        {submitErr && <p className="text-sm text-red-600">{submitErr}</p>}

        <button
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 text-white py-2 hover:bg-indigo-500 disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Please wait..." : "Sign up"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600 mt-4">
        Already have an account?{" "}
        <Link href="/signin" className="text-indigo-600 hover:underline">
          Sign in
        </Link>
      </p>
    </section>
  );
}

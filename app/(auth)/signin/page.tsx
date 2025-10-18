"use client";

import { useEffect, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const [appleOpen, setAppleOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setAppleOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setAppleOpen(false);
    }
    if (appleOpen) {
      document.addEventListener("mousedown", onDown);
      document.addEventListener("keydown", onEsc);
    }
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [appleOpen]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { email, password: pass, redirect: false });
    setLoading(false);
    if (res?.ok) window.location.href = "/";
    else alert(res?.error || "Invalid credentials");
  }

  return (
    <section className="container mx-auto px-4 py-10 max-w-xl">
      <h1 className="text-3xl font-bold text-center mb-6">Sign in</h1>

      <div className="grid gap-2 sm:grid-cols-3">
        <button
          onClick={() => signIn("google")}
          className="flex items-center justify-center gap-2 rounded-lg border px-3 py-2 hover:bg-slate-50 cursor-pointer"
        >
          <Image src="/icons/google.png" alt="" width={18} height={18} />
          <span className="text-sm">Google</span>
        </button>
        <button
          onClick={() => signIn("facebook")}
          className="flex items-center justify-center gap-2 rounded-lg border px-3 py-2 hover:bg-slate-50 cursor-pointer"
        >
          <Image src="/icons/facebook.png" alt="" width={18} height={18} />
          <span className="text-sm">Facebook</span>
        </button>
        <button
          onClick={() => setAppleOpen(true)}
          className="flex items-center justify-center gap-2 rounded-lg border px-3 py-2 hover:bg-slate-50 cursor-pointer"
        >
          <Image src="/icons/apple.png" alt="" width={18} height={18} />
          <span className="text-sm">Apple</span>
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-3 mt-6">
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <PasswordInput
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="Password"
        />

        <button
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 text-white py-2 hover:bg-indigo-500 disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Please wait..." : "Sign in"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600 mt-4">
        Don’t have an account?{" "}
        <Link href="/signup" className="text-indigo-600 hover:underline">
          Sign up
        </Link>
      </p>

      {appleOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 grid place-items-center p-4">
          <div
            ref={modalRef}
            className="w-full max-w-sm rounded-2xl bg-white shadow-xl ring-1 ring-black/10 p-5 relative"
          >
            <button
              aria-label="Close"
              className="absolute right-2 top-2 h-8 w-8 rounded-full grid place-items-center hover:bg-slate-100"
              onClick={() => setAppleOpen(false)}
            >
              ✕
            </button>
            <div className="flex items-center gap-3 mb-3">
              <Image src="/icons/apple.png" alt="" width={22} height={22} />
              <h3 className="text-lg font-semibold">Apple Sign-in</h3>
            </div>
            <p className="text-slate-700">
              Coming soon. We’ll add Apple login shortly.
            </p>
            <div className="mt-4 text-right">
              <button
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
                onClick={() => setAppleOpen(false)}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function PasswordInput({
  value,
  onChange,
  placeholder = "Password",
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className="w-full rounded-lg border px-4 py-2 pr-10 outline-none focus:ring-2 focus:ring-indigo-400"
        value={value}
        onChange={onChange}
        required
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute inset-y-0 right-2 my-auto h-8 w-8 rounded-full grid place-items-center hover:bg-slate-100 cursor-pointer"
        aria-label={show ? "Hide password" : "Show password"}
        title={show ? "Hide password" : "Show password"}
      >
        {show ? "👁️" : "👁️‍🗨️"}
      </button>
    </div>
  );
}

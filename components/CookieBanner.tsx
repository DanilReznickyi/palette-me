"use client";

import { useEffect, useState } from "react";

type Consent = {
  essential: boolean;
  analytics: boolean; 
  marketing: boolean; 
};

const CONSENT_COOKIE = "pm_consent"; 
const LANG_COOKIE = "pm_lang"; 

function getCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}
function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/; SameSite=Lax`;
}

function detectLang(): string {
  const nav = typeof navigator !== "undefined" ? navigator : ({} as any);
  const raw = (nav.languages?.[0] || nav.language || "en").toLowerCase();
  if (raw.startsWith("de")) return "de";
  if (raw.startsWith("uk")) return "uk";
  if (raw.startsWith("ru")) return "ru";
  return "en";
}

function detectOsBrowser() {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const platform = (navigator as any)?.platform || "";
  return { ua, platform };
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = getCookie(CONSENT_COOKIE);
    if (saved) return;
    setVisible(true);
  }, []);

  const accept = (all: boolean) => {
    const consent: Consent = {
      essential: true,
      analytics: all, 
      marketing: false,
    };


    setCookie(CONSENT_COOKIE, JSON.stringify(consent));

    const lang = detectLang();
    setCookie(LANG_COOKIE, lang);


    if (consent.analytics) {
      const info = detectOsBrowser();
      try {
        localStorage.setItem("pm_device", JSON.stringify(info));
      } catch {}
    }

    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-3xl">
      <div className="rounded-2xl bg-white p-4 md:p-5 shadow-2xl ring-1 ring-black/10">
        <h4 className="text-base font-semibold mb-2">We use cookies</h4>
        <p className="text-sm text-slate-600">
          We use essential cookies to make this site work. With your consent, we may also use
          analytics cookies to understand device/OS/browser and improve our product. You can change your choice later.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
          <button
            onClick={() => accept(false)}
            className="px-4 py-2 rounded-lg border hover:bg-slate-100"
          >
            Essential only
          </button>
          <button
            onClick={() => accept(true)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
          >
            Accept all
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          We don’t collect personal data here. Language preference is stored as essential.
        </p>
      </div>
    </div>
  );
}

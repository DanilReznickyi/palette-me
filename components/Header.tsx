"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/lib/cartStore";

/** ---------- small helpers ---------- */
function useDismiss(onClose: () => void, deps: unknown[] = []) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

function Dropdown({
  open,
  className = "",
  children,
}: {
  open: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={[
        "absolute top-full right-0 mt-2 w-60 rounded-xl bg-white shadow-xl ring-1 ring-black/10 origin-top-right transition duration-150 z-50",
        open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
        className,
      ].join(" ")}
      role="menu"
      aria-hidden={!open}
    >
      {children}
    </div>
  );
}

/** flag pills */
function Flag({ code }: { code: "en" | "de" | "uk" | "ru" }) {
  if (code === "de")
    return (
      <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true">
        <rect width="18" height="4" y="0" fill="#000" />
        <rect width="18" height="4" y="4" fill="#DD0000" />
        <rect width="18" height="4" y="8" fill="#FFCE00" />
      </svg>
    );
  if (code === "uk")
    return (
      <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true">
        <rect width="18" height="6" y="0" fill="#005BBB" />
        <rect width="18" height="6" y="6" fill="#FFD500" />
      </svg>
    );
  if (code === "ru")
    return (
      <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true">
        <rect width="18" height="4" y="0" fill="#fff" />
        <rect width="18" height="4" y="4" fill="#0039A6" />
        <rect width="18" height="4" y="8" fill="#D52B1E" />
      </svg>
    );
  // EN
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true">
      <rect width="18" height="12" fill="#012169" />
      <path d="M0,0 L18,12 M18,0 L0,12" stroke="#FFF" strokeWidth="2.4" />
      <path d="M0,0 L18,12 M18,0 L0,12" stroke="#C8102E" strokeWidth="1.2" />
      <rect x="7" width="4" height="12" fill="#FFF" />
      <rect y="4" width="18" height="4" fill="#FFF" />
      <rect x="7.6" width="2.8" height="12" fill="#C8102E" />
      <rect y="4.6" width="18" height="2.8" fill="#C8102E" />
    </svg>
  );
}

function LangRow({
  code,
  label,
  onPick,
}: {
  code: "en" | "de" | "uk" | "ru";
  label: string;
  onPick: (c: "en" | "de" | "uk" | "ru") => void;
}) {
  return (
    <button
      onClick={() => onPick(code)}
      className="w-full cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 transition text-sm text-slate-800"
      role="menuitem"
    >
      <Flag code={code} />
      <span className="flex-1 text-left">{label}</span>
      <span className="text-[10px] uppercase text-slate-500">{code}</span>
    </button>
  );
}

const EMOJI = ["🦊", "🐻", "🐼", "🦄", "🐥", "🐳", "🦉", "🐯", "🐸", "🐝", "🦋", "🐰"];
function emojiFromSeed(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return EMOJI[Math.abs(h) % EMOJI.length];
}

/** ---------- header ---------- */
export default function Header() {
  const pathname = usePathname();
  const isShop = pathname?.startsWith("/shop");
  const { data: session } = useSession();
  const user = session?.user;

  const { items, open: openCart } = useCart();
  const count = items.reduce((s, i) => s + i.qty, 0);

  // dropdown state
  const [langOpen, setLangOpen] = useState(false);
  const [profOpenDesktop, setProfOpenDesktop] = useState(false);
  const [profOpenMobile, setProfOpenMobile] = useState(false);

  const langRef = useDismiss(() => setLangOpen(false), [langOpen]);
  const profDeskRef = useDismiss(() => setProfOpenDesktop(false), [profOpenDesktop]);
  const profMobRef = useDismiss(() => setProfOpenMobile(false), [profOpenMobile]);

  const avatarEmoji = useMemo(
    () => (user?.email || user?.name ? emojiFromSeed(user.email || user.name || "") : emojiFromSeed("guest")),
    [user?.email, user?.name]
  );

  const AvatarCircle = (
    <div className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-lg">
      {user?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.image}
          alt="avatar"
          className="h-9 w-9 rounded-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span aria-hidden="true">{avatarEmoji}</span>
      )}
    </div>
  );

  const pickLang = (c: "en" | "de" | "uk" | "ru") => {
    alert(`Language set to ${c.toUpperCase()}`);
    setLangOpen(false);
  };

  return (
    <header className="sticky top-0 z-[60] bg-white/80 backdrop-blur shadow-lg ring-1 ring-black/5">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3 relative z-[61]">
        {/* logo */}
        <Link href="/" className="font-extrabold tracking-tight cursor-pointer">
          <span className="text-2xl md:text-3xl bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            PaletteMe
          </span>
        </Link>

        <div className="flex items-center gap-4 md:gap-5">
          {/* shop */}
          <Link
            href="/shop"
            className={[
              "flex items-center gap-2 font-medium px-3 py-2 rounded-lg transition cursor-pointer",
              "hover:bg-sky-50 hover:ring-1 hover:ring-sky-200",
              isShop ? "text-indigo-600 bg-indigo-50 ring-1 ring-indigo-100" : "text-slate-800",
            ].join(" ")}
            title="Shop"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 10l1.2-4a2 2 0 0 1 1.9-2h11.8a2 2 0 0 1 1.9 2l1.2 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M5 10v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="hidden sm:inline">Shop</span>
          </Link>

          {/* cart */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-slate-800 transition hover:bg-sky-50 hover:ring-1 hover:ring-sky-200 cursor-pointer"
            title="Cart"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6h15l-1.5 9h-12L6 6Z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9 6l-1-3H3" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="9" cy="20" r="1.5" fill="currentColor" />
              <circle cx="18" cy="20" r="1.5" fill="currentColor" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-indigo-600 text-white text-[11px] leading-5 text-center font-semibold">
                {count}
              </span>
            )}
          </button>

          {/* languages */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              aria-expanded={langOpen}
              aria-haspopup="menu"
              className="p-2 rounded-full text-slate-800 transition hover:bg-sky-50 hover:ring-1 hover:ring-sky-200 cursor-pointer"
              title="Language"
            >
              🌐
            </button>
            <Dropdown open={langOpen}>
              <div className="px-3 pt-2 pb-1 text-xs font-semibold text-slate-500">Language</div>
              <div className="px-1 pb-2">
                <LangRow code="en" label="English" onPick={pickLang} />
                <LangRow code="de" label="Deutsch" onPick={pickLang} />
                <LangRow code="uk" label="Українська" onPick={pickLang} />
                <LangRow code="ru" label="Русский" onPick={pickLang} />
              </div>
            </Dropdown>
          </div>

          {/* desktop: try + auth/avatar */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/upload"
              className="px-4 py-2 rounded-lg bg-amber-400 text-slate-900 font-semibold hover:bg-amber-500 transition cursor-pointer"
            >
              Try now
            </Link>

            {user ? (
              <div ref={profDeskRef} className="relative">
                <button
                  onClick={() => setProfOpenDesktop((v) => !v)}
                  aria-expanded={profOpenDesktop}
                  aria-haspopup="menu"
                  className="flex items-center gap-2 hover:opacity-90 cursor-pointer"
                  title="Profile"
                >
                  {AvatarCircle}
                </button>
                <Dropdown open={profOpenDesktop}>
                  <div className="px-3 py-2 text-sm">
                    <div className="font-semibold truncate">{user.name || user.email}</div>
                  </div>
                  <hr className="border-slate-200" />
                  <div className="p-1">
                    <Link href="/profile/orders" className="block px-3 py-2 rounded-md hover:bg-slate-100 text-sm">
                      My orders
                    </Link>
                    <Link href="/profile/settings" className="block px-3 py-2 rounded-md hover:bg-slate-100 text-sm">
                      Account settings
                    </Link>
                  </div>
                  <hr className="border-slate-200" />
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 text-red-600 text-sm cursor-pointer"
                    role="menuitem"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M15 17l5-5-5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M20 12H9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      <path d="M12 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                    Log out
                  </button>
                </Dropdown>
              </div>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="px-4 py-2 rounded-lg border hover:bg-sky-50 hover:ring-1 hover:ring-sky-200 transition cursor-pointer"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition cursor-pointer"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* mobile: avatar button → small menu with spacing */}
          <div ref={profMobRef} className="relative md:hidden">
            <button
              onClick={() => setProfOpenMobile((v) => !v)}
              aria-expanded={profOpenMobile}
              aria-haspopup="menu"
              className="p-1.5 rounded-full hover:bg-sky-50 hover:ring-1 hover:ring-sky-200 cursor-pointer"
              title="Profile"
            >
              {user ? AvatarCircle : (
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-base">🙂</div>
              )}
            </button>
            <Dropdown open={profOpenMobile} className="w-56">
              {user ? (
                <>
                  <div className="px-3 py-2 text-sm">
                    <div className="font-semibold truncate">{user.name || user.email}</div>
                  </div>
                  <hr className="border-slate-200" />
                  <div className="p-1">
                    <Link href="/profile/orders" className="block px-3 py-2 rounded-md hover:bg-slate-100 text-sm">
                      My orders
                    </Link>
                    <Link href="/profile/settings" className="block px-3 py-2 rounded-md hover:bg-slate-100 text-sm">
                      Account settings
                    </Link>
                  </div>
                  <hr className="border-slate-200" />
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 text-red-600 text-sm cursor-pointer"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M15 17l5-5-5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M20 12H9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      <path d="M12 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                    Log out
                  </button>
                </>
              ) : (
                <div className="p-2">
                  <Link
                    href="/upload"
                    className="block w-full text-center mb-2 px-4 py-2 rounded-lg bg-amber-400 text-slate-900 font-semibold hover:bg-amber-500 transition cursor-pointer"
                  >
                    Try now
                  </Link>
                  <div className="space-y-2">
                    <Link
                      href="/signin"
                      className="block w-full text-center px-4 py-2 rounded-lg border hover:bg-sky-50 hover:ring-1 hover:ring-sky-200 transition cursor-pointer"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/signup"
                      className="block w-full text-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition cursor-pointer"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              )}
            </Dropdown>
          </div>
        </div>
      </nav>
    </header>
  );
}

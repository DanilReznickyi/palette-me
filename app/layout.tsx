import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import CookieBanner from "@/components/CookieBanner";
import CartDrawer from "@/components/cart/CartDrawer"; 
import SessionProvider from "@/components/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PaletteMe",
  description: "Turn your photo into a paint-by-numbers masterpiece",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-slate-50 text-slate-800 text-[17px] md:text-[18px] min-h-screen flex flex-col`}>
        <SessionProvider>
          <Header />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <CookieBanner />
          <BackToTop />
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
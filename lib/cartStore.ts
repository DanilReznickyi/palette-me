"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  qty: number;
  slug?: string;
  meta?: any;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  hydrated: boolean;
  // actions
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (item: CartItem, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  setHydrated: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      hydrated: false,

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set({ isOpen: !get().isOpen }),

      add: (item, qty = 1) =>
        set((s) => {
          const idx = s.items.findIndex((it) => it.id === item.id);
          if (idx >= 0) {
            const next = [...s.items];
            next[idx] = { ...next[idx], qty: next[idx].qty + qty };
            return { items: next };
          }
          return { items: [...s.items, { ...item, qty }] };
        }),

      setQty: (id, qty) =>
        set((s) => ({
          items: s.items
            .map((it) => (it.id === id ? { ...it, qty: Math.max(1, qty) } : it))
            .filter((it) => it.qty > 0),
        })),

      remove: (id) => set((s) => ({ items: s.items.filter((it) => it.id !== id) })),
      clear: () => set({ items: [] }),

      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "pm-cart-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }), // сохраняем только товары
      onRehydrateStorage: () => (state) => {
        // вызовется после чтения из storage
        state?.setHydrated();
      },
    }
  )
);

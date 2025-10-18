// components/shop/FilterSidebar.tsx
"use client";

import { CanvasSize, Category } from "./mockData";

const SIZES: CanvasSize[] = ["A4", "A3", "50x70", "60x80"];
const CATEGORIES: Category[] = ["nature", "forest", "city", "animals", "abstract", "sea", "mountains"];

export type FiltersState = {
  sizes: Set<CanvasSize>;
  minPrice: number;
  maxPrice: number;
  categories: Set<Category>;
};

export default function FilterSidebar({
  state,
  onChange,
}: {
  state: FiltersState;
  onChange: (partial: Partial<FiltersState>) => void;
}) {
  return (
    <aside className="hidden lg:block lg:w-64 shrink-0">
      <div className="sticky top-20 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500">Filters</h3>

        {/* Sizes */}
        <div className="mt-3">
          <p className="text-sm font-medium">Canvas size</p>
          <div className="mt-2 space-y-2">
            {SIZES.map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300"
                  checked={state.sizes.has(s)}
                  onChange={() => {
                    const next = new Set(state.sizes);
                    next.has(s) ? next.delete(s) : next.add(s);
                    onChange({ sizes: next });
                  }}
                />
                <span>{s}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="mt-4">
          <p className="text-sm font-medium">Price range (€)</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input
              type="number"
              min={0}
              value={state.minPrice}
              onChange={(e) => onChange({ minPrice: Number(e.target.value || 0) })}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
              placeholder="Min"
            />
            <input
              type="number"
              min={0}
              value={state.maxPrice}
              onChange={(e) => onChange({ maxPrice: Number(e.target.value || 0) })}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
              placeholder="Max"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mt-4">
          <p className="text-sm font-medium">Tags</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const active = state.categories.has(c);
              return (
                <button
                  key={c}
                  onClick={() => {
                    const next = new Set(state.categories);
                    active ? next.delete(c) : next.add(c);
                    onChange({ categories: next });
                  }}
                  className={[
                    "px-2.5 py-1 rounded-lg text-xs capitalize border transition",
                    active
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() =>
            onChange({
              sizes: new Set<CanvasSize>(),
              minPrice: 0,
              maxPrice: 0,
              categories: new Set<Category>(),
            })
          }
          className="mt-5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
        >
          Reset filters
        </button>
      </div>
    </aside>
  );
}

"use client";

export default function Preview({ url }: { url: string }) {
  return (
    <div className="rounded-2xl border p-4">
      <h3 className="text-lg font-semibold mb-3">Preview</h3>
      <img
        src={url}
        alt="Generated preview"
        className="w-full aspect-video object-contain rounded-xl bg-slate-50"
      />
      <p className="mt-2 text-xs text-slate-500">
        This is a low-res preview. Final PDF/PNG will have print quality.
      </p>
    </div>
  );
}

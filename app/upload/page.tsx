"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Dropzone from "@/components/upload/Dropzone";
import Params from "@/components/upload/Params";
import { useCart } from "@/lib/cartStore";
import ResultModal from "@/components/upload/ResultModal";

async function posterizePreview(inputUrl: string, colors: number): Promise<string> {
  const steps = Math.max(2, Math.min(64, Math.round(colors / 2)));
  const toStep = (v: number) => {
    const s = Math.round((v / 255) * (steps - 1));
    return Math.round((s * 255) / (steps - 1));
  };

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = () => resolve(im);
    im.onerror = reject;
    im.src = inputUrl;
  });

  const maxW = 900;
  const scale = Math.min(1, maxW / img.width);
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, w, h);

  const data = ctx.getImageData(0, 0, w, h);
  const px = data.data;
  for (let i = 0; i < px.length; i += 4) {
    px[i] = toStep(px[i]);
    px[i + 1] = toStep(px[i + 1]);
    px[i + 2] = toStep(px[i + 2]);
  }
  ctx.putImageData(data, 0, 0);

  return c.toDataURL("image/png");
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [palette, setPalette] = useState<{ hex: string; index: number }[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [colors, setColors] = useState(24);
  const [detail, setDetail] = useState(3);
  const [paper, setPaper] = useState<"A4" | "A3" | "A2">("A4");
  const [contour, setContour] = useState(2);
  const [withNumbers, setWithNumbers] = useState(true);

  const [submitting, setSubmitting] = useState(false);

	const { add, openCart, items } = useCart();

  const price = useMemo(() => {
    const base = 6;
    const sizeMul = { A4: 1.0, A3: 1.4, A2: 1.8 }[paper];
    const perColor = 0.2;
    const detailSurcharge = Math.max(0, detail - 3) * 0.8;
    const total = base * sizeMul + colors * perColor + detailSurcharge;
    return (Math.round(total * 2) / 2).toFixed(2);
  }, [paper, colors, detail]);

  const revokeRef = useRef<string | null>(null);
  const onFileChosen = (f: File) => {
    setFile(f);
    if (revokeRef.current) URL.revokeObjectURL(revokeRef.current);
    const url = URL.createObjectURL(f);
    revokeRef.current = url;
    setPreviewUrl(url);
    setResultUrl(null);
    setPalette([]);
  };
  useEffect(() => {
    return () => {
      if (revokeRef.current) URL.revokeObjectURL(revokeRef.current);
    };
  }, []);
  const onRemoveFile = () => {
    if (revokeRef.current) URL.revokeObjectURL(revokeRef.current);
    revokeRef.current = null;
    setFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setPalette([]);
  };

  const generate = async () => {
    if (!file) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("colors", String(colors));
      fd.append("detail", String(detail));
      fd.append("paper", paper);
      fd.append("contour", String(contour));
      fd.append("withNumbers", String(withNumbers));

      const res = await fetch("/api/generate", { method: "POST", body: fd });
      const raw = await res.text();

      let data: any = null;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error(raw.slice(0, 200));
      }
      if (!res.ok) throw new Error(data?.error || "Generation failed");

      setResultUrl(data.previewUrl || data.svgUrl || "");

      let pal: any[] = [];
      if (Array.isArray(data?.palette)) pal = data.palette;
      else if (Array.isArray(data?.colors)) pal = data.colors;

      const normalized = pal.map((p: any, i: number) =>
        typeof p === "string" ? { hex: p, index: i } : { hex: p?.hex, index: p?.index ?? i }
      );
      setPalette(normalized);

      (localStorage as any).lastSVG = data.svgUrl || "";

      setModalOpen(true);
    } catch (e: any) {
      alert(e?.message || "Generation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const addToCart = () => {
    if (!file) return;
    const wasEmpty = items.length === 0;
		add(
			{
				id: `custom-${Date.now()}`,
				title: `Custom canvas (${paper}, ${colors} colors)`,
				price: Number(price),
				slug: undefined,
				meta: { colors, detail, paper, contour, withNumbers, preview: resultUrl ?? previewUrl },
			},
			1
		);
		if (wasEmpty) openCart();
  };
  const onClearResult = () => {
    setResultUrl(null);
    setPalette([]);
    setModalOpen(false);
  };
  const onAddToCartFromModal = () => {
    addToCart();
    setModalOpen(false);
  };

  return (
    <section className="container mx-auto px-6 py-10">
      <h1 className="mb-6 text-3xl md:text-4xl font-extrabold">Upload your photo</h1>
      <p className="mb-8 text-slate-600">
        Drag &amp; drop a JPG/PNG or pick from device. Adjust parameters and generate a paint-by-numbers preview.
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        <Dropzone file={file} previewUrl={previewUrl} onChoose={onFileChosen} onRemove={onRemoveFile} />

        <div>
          <Params
            colors={colors}
            setColors={setColors}
            detail={detail}
            setDetail={setDetail}
            paper={paper}
            setPaper={setPaper}
            contour={contour}
            setContour={setContour}
            withNumbers={withNumbers}
            setWithNumbers={setWithNumbers}
          />

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={generate}
              disabled={!file || submitting}
              className={`px-6 py-3 rounded-lg text-white font-semibold transition ${
                file && !submitting ? "bg-indigo-600 hover:bg-indigo-500 cursor-pointer" : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              {submitting ? "Generating..." : "Generate preview"}
            </button>

            <button
              onClick={addToCart}
              disabled={!file}
              className={`px-6 py-3 rounded-lg border font-semibold transition ${
                file ? "hover:bg-slate-50 cursor-pointer" : "cursor-not-allowed opacity-60"
              }`}
            >
              Add to cart
            </button>

            <div className="text-slate-700">
              Estimated price: <span className="font-bold">€{price}</span>
            </div>
          </div>
        </div>
      </div>

      <ResultModal
        open={modalOpen && !!resultUrl}
        imageUrl={resultUrl ?? ""}            
        palette={palette}
        meta={{ paper, colors, detail, contour, withNumbers }} 
        onAddToCart={onAddToCartFromModal}
        onClear={onClearResult}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}

// app/api/generate/route.ts
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const PY = process.env.PBN_SERVICE_URL || "http://127.0.0.1:8000";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const fd = new FormData();
    fd.append("file", file);
    for (const k of ["colors", "detail", "paper", "contour", "withNumbers"]) {
      const v = form.get(k);
      if (v !== null) fd.append(k, String(v));
    }

    const res = await fetch(`${PY}/generate`, { method: "POST", body: fd });
    const raw = await res.text();
    let data: any;
    try { data = JSON.parse(raw); } 
    catch { throw new Error(raw.slice(0, 300)); }

    if (!res.ok) {
      throw new Error(data?.error || "Generator error");
    }

    const outDir = path.join(process.cwd(), "public", "generated");
    await fs.mkdir(outDir, { recursive: true });

    const id = data.id || Math.random().toString(36).slice(2, 10);
    const svgPath = path.join(outDir, `${id}.svg`);
    const pngPath = path.join(outDir, `${id}.png`);

    await fs.writeFile(svgPath, data.svg, "utf8");
    if (data.preview_png_b64) {
      const buf = Buffer.from(data.preview_png_b64, "base64");
      await fs.writeFile(pngPath, buf);
    }

    return NextResponse.json({
      id,
      svgUrl: `/generated/${id}.svg`,
      previewUrl: `/generated/${id}.png`,
      width: data.width,
      height: data.height,
      palette: data.palette,
    });
  } catch (e: any) {
    console.error("GENERATOR PROXY ERROR:", e);
    return NextResponse.json({ error: e?.message || "Failed to generate" }, { status: 500 });
  }
}

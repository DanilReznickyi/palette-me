import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, code, name } = await req.json();
    if (!email || !code) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

    const vt = await prisma.verificationToken.findUnique({ where: { token: code } });
    if (!vt || vt.identifier !== email) return NextResponse.json({ error: "Wrong code" }, { status: 400 });
    if (vt.expires < new Date()) return NextResponse.json({ error: "Code expired" }, { status: 400 });

    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date(), name: name?.toString()?.trim()?.slice(0, 80) || undefined },
    });

    await prisma.verificationToken.delete({ where: { token: code } });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

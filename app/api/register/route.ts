import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";      
export const dynamic = "force-dynamic";  
export const revalidate = 0;

type Body = {
  firstName: string;
  lastName: string;
  birthDate: string;    
  email: string;
  password: string;
};

const emailRe =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;


const onlyLettersRe = /^[\p{L}]+$/u;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const { firstName, lastName, birthDate, email, password } = body;

    if (!firstName || !lastName || !birthDate || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!onlyLettersRe.test(firstName) || !onlyLettersRe.test(lastName)) {
      return NextResponse.json({ error: "Name fields must contain letters only" }, { status: 400 });
    }

    if (!emailRe.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const okLen = password.length >= 8;
    const okCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
    const okNum = /\d/.test(password);

    if (!(okLen && okCase && okNum)) {
      return NextResponse.json({ error: "Weak password" }, { status: 400 });
    }

    // уже есть такой email?
    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hash,
        name: `${firstName} ${lastName}`,
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

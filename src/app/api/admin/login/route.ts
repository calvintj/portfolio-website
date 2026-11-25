import { NextResponse } from "next/server";
import {
  checkPassword,
  createSessionToken,
  getAuthConfig,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/auth";

export async function POST(req: Request) {
  const config = getAuthConfig();
  if (!config) {
    return NextResponse.json(
      { error: "Admin is locked: ADMIN_PASSWORD or SESSION_SECRET is not set" },
      { status: 503 },
    );
  }

  let password = "";
  try {
    const body = await req.json();
    if (typeof body?.password === "string") password = body.password;
  } catch {
    // bad body: treated as a wrong password below
  }

  if (!(await checkPassword(password, config.password, config.secret))) {
    // Slows down guessing; the compare itself is constant-time.
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await createSessionToken(config.secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}

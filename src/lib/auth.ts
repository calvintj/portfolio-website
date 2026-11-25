// Admin session: one password, one HMAC-signed cookie. Web Crypto only,
// so it runs in route handlers and proxy alike. No "@/" imports, so the
// node:test file can load it directly.

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // seconds

export type AuthConfig = { password: string; secret: string };

/**
 * Null means admin is locked: a missing secret must never mean "open".
 * A short secret is treated as missing, since it can be guessed.
 */
export function getAuthConfig(
  env: Record<string, string | undefined> = process.env,
): AuthConfig | null {
  const password = env.ADMIN_PASSWORD;
  const secret = env.SESSION_SECRET;
  if (!password || !secret || secret.length < 32) return null;
  return { password, secret };
}

const enc = new TextEncoder();

function hmacKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toB64url(buf: ArrayBuffer) {
  return Buffer.from(buf).toString("base64url");
}

/** Constant-time: HMAC verify compares in fixed time, at any input length. */
export async function checkPassword(
  input: string,
  password: string,
  secret: string,
) {
  const key = await hmacKey(secret);
  const expected = await crypto.subtle.sign("HMAC", key, enc.encode(password));
  return crypto.subtle.verify("HMAC", key, expected, enc.encode(input));
}

/** Token is "<expiry ms>.<signature>"; the signature covers the expiry. */
export async function createSessionToken(secret: string, now = Date.now()) {
  const exp = String(now + SESSION_MAX_AGE * 1000);
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(`admin.${exp}`));
  return `${exp}.${toB64url(sig)}`;
}

export async function verifySessionToken(
  token: string | undefined,
  secret: string,
  now = Date.now(),
) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [exp, sig] = parts;
  if (!/^\d+$/.test(exp) || !sig) return false;
  if (Number(exp) <= now) return false;
  const key = await hmacKey(secret);
  return crypto.subtle.verify(
    "HMAC",
    key,
    Buffer.from(sig, "base64url"),
    enc.encode(`admin.${exp}`),
  );
}

/** Reads the session cookie from a request; false when admin is locked. */
export async function isAdmin(req: Request) {
  const config = getAuthConfig();
  if (!config) return false;
  const cookie = req.headers.get("cookie") ?? "";
  const token = cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);
  return verifySessionToken(token, config.secret);
}

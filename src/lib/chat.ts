// Guards for the public chat route, which spends the DeepInfra key.
// No "@/" imports, so node:test can load it directly.

export const MAX_USER_CHARS = 1000;
const MAX_BOT_CHARS = 4000;
/** Turns sent to the model; older ones are dropped to bound cost. */
export const MAX_HISTORY = 12;

export type ChatMessage = { role: "user" | "assistant"; content: string };

type Result =
  | { ok: true; messages: ChatMessage[] }
  | { ok: false; error: string };

const fail = (error: string): Result => ({ ok: false, error });

/**
 * Only user and assistant turns get through: a visitor-sent "system"
 * message would override the portfolio prompt.
 */
export function sanitizeMessages(input: unknown): Result {
  if (!Array.isArray(input) || input.length === 0)
    return fail("messages array required");

  const messages: ChatMessage[] = [];
  for (const m of input) {
    const role = m?.role === "bot" ? "assistant" : m?.role;
    if (role !== "user" && role !== "assistant") return fail("Invalid message");
    if (typeof m.content !== "string") return fail("Invalid message");
    const max = role === "user" ? MAX_USER_CHARS : MAX_BOT_CHARS;
    if (m.content.length > max)
      return fail(`Message is too long (${MAX_USER_CHARS} characters max)`);
    messages.push({ role, content: m.content });
  }

  const last = messages.at(-1);
  if (last?.role !== "user" || !last.content.trim())
    return fail("Invalid message");

  return { ok: true, messages: messages.slice(-MAX_HISTORY) };
}

type Window = { start: number; count: number };

/**
 * Fixed-window limits, in memory: fine for the single web container.
 * The global cap is the cost backstop when visitor IPs can't be trusted.
 */
export function createRateLimiter(opts: {
  perKey: number;
  keyWindowMs: number;
  global: number;
  globalWindowMs: number;
  now?: () => number;
}) {
  const now = opts.now ?? Date.now;
  const keys = new Map<string, Window>();
  let all: Window = { start: now(), count: 0 };

  return (key: string) => {
    const t = now();
    if (t - all.start >= opts.globalWindowMs) all = { start: t, count: 0 };

    let w = keys.get(key);
    if (!w || t - w.start >= opts.keyWindowMs) {
      w = { start: t, count: 0 };
      keys.set(key, w);
    }

    if (w.count >= opts.perKey || all.count >= opts.global) return false;
    w.count++;
    all.count++;

    // Keep the map from growing without bound.
    if (keys.size > 10_000) {
      for (const [k, v] of keys)
        if (t - v.start >= opts.keyWindowMs) keys.delete(k);
    }
    return true;
  };
}

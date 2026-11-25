// Upload checks. Files land in public/uploads and are served from the
// site's own domain, so anything that could run script (html, svg) must
// never get through. The type comes from the bytes, not the file name.

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

const startsWith = (b: Uint8Array, sig: number[], at = 0) =>
  sig.every((v, i) => b[at + i] === v);

const ascii = (s: string) => [...s].map((c) => c.charCodeAt(0));

export function detectImageType(
  b: Uint8Array,
): ".jpg" | ".png" | ".webp" | null {
  if (startsWith(b, [0xff, 0xd8, 0xff])) return ".jpg";
  if (startsWith(b, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    return ".png";
  if (startsWith(b, ascii("RIFF")) && startsWith(b, ascii("WEBP"), 8))
    return ".webp";
  return null;
}

/** File name without folders or extension, reduced to [a-zA-Z0-9_-]. */
export function safeBaseName(name: string) {
  const file = name.split(/[\\/]/).pop() ?? "";
  const dot = file.lastIndexOf(".");
  const base = dot > 0 ? file.slice(0, dot) : dot === 0 ? "" : file;
  const clean = base.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  return clean || "image";
}

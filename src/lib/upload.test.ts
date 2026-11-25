import assert from "node:assert/strict";
import { test } from "node:test";
import { detectImageType, safeBaseName } from "./upload.ts";

const bytes = (...b: number[]) => new Uint8Array([...b, 0, 0, 0, 0, 0, 0]);
const ascii = (s: string) => [...s].map((c) => c.charCodeAt(0));

test("detects jpg, png and webp by their first bytes", () => {
  assert.equal(detectImageType(bytes(0xff, 0xd8, 0xff, 0xe0)), ".jpg");
  assert.equal(
    detectImageType(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)),
    ".png",
  );
  assert.equal(
    detectImageType(bytes(...ascii("RIFF"), 1, 2, 3, 4, ...ascii("WEBP"))),
    ".webp",
  );
});

test("refuses html, svg, scripts and anything else", () => {
  for (const s of [
    "<!doctype html>",
    "<svg xmlns=",
    "<script>",
    "GIF89a",
    "",
  ]) {
    assert.equal(detectImageType(new Uint8Array(ascii(s))), null);
  }
  // RIFF that is not WEBP (for example a WAV file)
  assert.equal(
    detectImageType(bytes(...ascii("RIFF"), 1, 2, 3, 4, ...ascii("WAVE"))),
    null,
  );
});

test("base names keep only safe characters", () => {
  assert.equal(safeBaseName("my photo.final.png"), "my-photo-final");
  assert.equal(safeBaseName("../../etc/passwd"), "passwd");
  assert.equal(safeBaseName("<img onerror=x>.jpg"), "img-onerror-x");
  assert.equal(safeBaseName(".png"), "image");
});

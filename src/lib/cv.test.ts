import assert from "node:assert/strict";
import { test } from "node:test";
import { cvHref } from "./cv.ts";

const id = "1s-pXdsFw3TXNT8wPUEWXIGIXaIY6X9fvZg_muX5plJA";
const exportUrl = `https://docs.google.com/document/d/${id}/export?format=pdf`;

test("any Google Docs link becomes the PDF export link", () => {
  for (const link of [
    `https://docs.google.com/document/d/${id}/edit?tab=t.0#heading=h.5sjso25ue5zj`,
    `https://docs.google.com/document/d/${id}/edit`,
    `https://docs.google.com/document/d/${id}`,
    `https://docs.google.com/document/u/0/d/${id}/view`,
    exportUrl,
    `  ${exportUrl}  `,
  ]) {
    assert.equal(cvHref(link), exportUrl, link);
  }
});

test("other https links pass through unchanged", () => {
  assert.equal(
    cvHref("https://example.com/cv.pdf"),
    "https://example.com/cv.pdf",
  );
  assert.equal(cvHref("/uploads/cv.pdf"), "/uploads/cv.pdf");
});

test("empty or unsafe links give no button", () => {
  for (const bad of [
    undefined,
    "",
    "   ",
    "javascript:alert(1)",
    "data:text/html,hi",
    "http://example.com/cv.pdf",
    "//evil.com/cv.pdf",
    "docs.google.com/document/d/abc",
  ]) {
    assert.equal(cvHref(bad), null, String(bad));
  }
});

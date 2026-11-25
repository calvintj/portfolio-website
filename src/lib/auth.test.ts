import assert from "node:assert/strict";
import { test } from "node:test";
import {
  checkPassword,
  createSessionToken,
  getAuthConfig,
  SESSION_MAX_AGE,
  verifySessionToken,
} from "./auth.ts";

const secret = "a".repeat(32);
const now = 1_800_000_000_000;

test("config is null (locked) when either value is missing or the secret is short", () => {
  assert.equal(getAuthConfig({}), null);
  assert.equal(getAuthConfig({ ADMIN_PASSWORD: "pw" }), null);
  assert.equal(getAuthConfig({ SESSION_SECRET: secret }), null);
  assert.equal(
    getAuthConfig({ ADMIN_PASSWORD: "pw", SESSION_SECRET: "short" }),
    null,
  );
  assert.deepEqual(
    getAuthConfig({ ADMIN_PASSWORD: "pw", SESSION_SECRET: secret }),
    { password: "pw", secret },
  );
});

test("password check accepts only the exact password", async () => {
  assert.equal(await checkPassword("hunter2", "hunter2", secret), true);
  assert.equal(await checkPassword("hunter3", "hunter2", secret), false);
  assert.equal(await checkPassword("", "hunter2", secret), false);
  assert.equal(await checkPassword("hunter2x", "hunter2", secret), false);
});

test("a fresh token verifies, until it expires", async () => {
  const token = await createSessionToken(secret, now);
  assert.equal(await verifySessionToken(token, secret, now), true);
  assert.equal(
    await verifySessionToken(token, secret, now + SESSION_MAX_AGE * 1000 - 1),
    true,
  );
  assert.equal(
    await verifySessionToken(token, secret, now + SESSION_MAX_AGE * 1000 + 1),
    false,
  );
});

test("a token signed with another secret, or tampered with, is refused", async () => {
  const token = await createSessionToken(secret, now);
  assert.equal(await verifySessionToken(token, "b".repeat(32), now), false);

  // Pushing the expiry forward breaks the signature.
  const [, sig] = token.split(".");
  const later = String(now + 10 * SESSION_MAX_AGE * 1000);
  assert.equal(await verifySessionToken(`${later}.${sig}`, secret, now), false);
});

test("missing or malformed tokens are refused", async () => {
  for (const bad of [undefined, "", "x", "1.2.3", "abc.def", ".", "123."]) {
    assert.equal(await verifySessionToken(bad, secret, now), false);
  }
});

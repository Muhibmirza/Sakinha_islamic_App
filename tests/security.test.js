import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { allowedImageFile, boundedInteger, cleanText, safeAuthMessage, validEmail } from "../src/lib/security.js";

test("text and email inputs are bounded and normalized", () => {
  assert.equal(cleanText("  safe\u0000name  ", 20), "safename");
  assert.equal(cleanText("abcdef", 3), "abc");
  assert.equal(validEmail(" person@example.com "), "person@example.com");
  assert.equal(validEmail("not-an-email"), "");
});

test("numeric ranges reject fractional and out-of-range values", () => {
  assert.equal(boundedInteger("30", 1, 30), 30);
  assert.equal(boundedInteger(0, 1, 30), null);
  assert.equal(boundedInteger(1.5, 1, 30), null);
});

test("custom images enforce allow-list and size ceiling", () => {
  assert.equal(allowedImageFile({ type: "image/png", size: 1000 }), true);
  assert.equal(allowedImageFile({ type: "image/svg+xml", size: 1000 }), false);
  assert.equal(allowedImageFile({ type: "image/png", size: 1_500_001 }), false);
});

test("reset response resists account enumeration", () => {
  assert.match(safeAuthMessage("reset"), /If an account exists/);
});

test("service worker does not cache coordinate-bearing Aladhan requests", async () => {
  const worker = await readFile(new URL("../public/sw.js", import.meta.url), "utf8");
  assert.doesNotMatch(worker, /api\.aladhan\.com.*DATA_CACHE/);
  assert.match(worker, /url\.hostname === "api\.alquran\.cloud"/);
});

test("deployment config contains baseline browser protections", async () => {
  const config = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
  const headers = config.headers.flatMap((entry) => entry.headers).map((entry) => entry.key);
  for (const required of ["Content-Security-Policy", "Strict-Transport-Security", "X-Content-Type-Options", "Referrer-Policy", "Permissions-Policy"]) assert.ok(headers.includes(required));
});
import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { PAGES } from "./routes";

// The built site as Cloudflare serves it (wrangler dev applies _redirects and _headers).

test("every page is served at its old URL", async ({ request }) => {
  for (const route of PAGES) {
    const r = await request.get(route, { maxRedirects: 0 });
    expect(r.status(), route).toBe(200);
  }
  const bare = await request.get("/the-issue", { maxRedirects: 0 });
  expect([301, 307, 308]).toContain(bare.status());
  expect(bare.headers()["location"]).toMatch(/\/the-issue\/$/);
});

test("old WordPress media URLs redirect to their new paths", async ({ request }) => {
  const rules = fs
    .readFileSync(new URL("../../public/_redirects", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.startsWith("/wp-content/uploads/"))
    .map((l) => l.trim().split(/\s+/));
  expect(rules.length).toBeGreaterThanOrEqual(35);
  for (const [from, to, status] of rules) {
    const r = await request.get(from, { maxRedirects: 0 });
    expect(r.status(), from).toBe(Number(status));
    expect(new URL(r.headers()["location"], "http://x").pathname, from).toBe(to);
    const target = await request.get(to, { maxRedirects: 0 });
    expect(target.status(), to).toBe(200);
  }
});

test("WordPress machinery paths go somewhere sensible", async ({ request }) => {
  const cases: [string, string][] = [
    ["/home/", "/"],
    ["/feed/", "/"],
    ["/comments/feed/", "/"],
    ["/about/feed/", "/about/"],
    ["/wp-admin/", "/"],
    ["/wp-admin/post.php", "/"],
    ["/wp-login.php", "/"],
    ["/xmlrpc.php", "/"],
    ["/wp-json/wp/v2/pages", "/"],
    ["/wp-content/themes/assembler/style.css", "/"],
    ["/2026/09/05/navigation/", "/"],
    ["/sitemap.xml", "/sitemap-index.xml"],
  ];
  for (const [from, to] of cases) {
    const r = await request.get(from, { maxRedirects: 0 });
    expect(r.status(), from).toBe(301);
    expect(new URL(r.headers()["location"], "http://x").pathname, from).toBe(to);
  }
});

test("unknown paths get the 404 page", async ({ request }) => {
  const r = await request.get("/no-such-page/");
  expect(r.status()).toBe(404);
  expect(await r.text()).toContain("That address does not lead to a page on this site.");
});

test("security and caching headers", async ({ request }) => {
  const page = await request.get("/");
  const h = page.headers();
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(h["content-security-policy"]).toContain("default-src 'self'");
  expect(h["x-robots-tag"]).toBeUndefined();
  const html = await page.text();
  expect(html, "no inline executable script").not.toMatch(/<script(?![^>]*\b(?:src=|type="application\/ld\+json"))[^>]*>/);
  const asset = html.match(/\/_astro\/[^"']+\.js/)?.[0];
  expect(asset, "the page's script is a hashed file").toBeTruthy();
  const a = await request.get(asset!);
  expect(a.headers()["cache-control"]).toContain("immutable");

  // The Worker runs first for /take-action/ (to sign the form's timestamp); the page keeps
  // every header from _headers, and is never answered from a stale cache.
  const act = await request.get("/take-action/");
  const ah = act.headers();
  expect(ah["content-security-policy"]).toBe(h["content-security-policy"]);
  expect(ah["x-frame-options"]).toBe("DENY");
  expect(ah["x-content-type-options"]).toBe("nosniff");
  expect(ah["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(ah["etag"]).toBeUndefined();
  expect(ah["cache-control"]).toBe("private, no-cache");
  expect(await act.text()).toMatch(/name="t" value="\d{10}\.[0-9a-f]{64}"/);
});

test("only breakbondsar.org may be indexed", async ({ request }) => {
  const robots = async (host: string) => (await request.get("/", { headers: { Host: host } })).headers()["x-robots-tag"];
  expect(await robots("breakbondsar.org")).toBeUndefined();
  expect(await robots("breakbondsar.example.workers.dev")).toBe("noindex");
  expect(await robots("1a2b3c4d-breakbondsar.example.workers.dev")).toBe("noindex");
  expect(await robots("www.breakbondsar.org")).toBe("noindex");
});

// Pages as served with the real headers: the CSP must not block anything the pages load.
test("pages run under the production Content-Security-Policy", async ({ page }) => {
  const problems: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error" || /Content Security Policy|Content-Security-Policy/i.test(m.text())) problems.push(m.text());
  });
  page.on("pageerror", (e) => problems.push(e.message));
  for (const route of PAGES) await page.goto(route, { waitUntil: "networkidle" });
  expect(problems).toEqual([]);

  await page.goto("/take-action/", { waitUntil: "networkidle" });
  await expect(page.locator(".copy-button").first()).toBeVisible();
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.locator('[data-copy-target="official-message"]').last().click();
  await expect(page.locator("#official-copy-status")).toHaveText("Suggested message copied. Adapt it before sending.");
});

test("a printed evidence page keeps its hashes", async ({ page }) => {
  await page.goto("/evidence/", { waitUntil: "networkidle" });
  await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
  await expect(page.locator("details.disclosure[open]")).toHaveCount(10);
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("code.hash").first()).toBeVisible();
  await expect(page.getByText("c1fee73d741980e2196d3c421269ed11c6cc6b1bdcdee5e8bb96f108aae42894")).toBeVisible();
});

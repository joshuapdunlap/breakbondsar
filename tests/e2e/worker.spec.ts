import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { ROUTES } from "./routes";

// The built site as Cloudflare serves it (wrangler dev applies _redirects and _headers).

test("every page is served at its old URL", async ({ request }) => {
  for (const route of ROUTES) {
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
  expect(await r.text()).toContain("This page is not");
});

test("security and caching headers", async ({ request }) => {
  const page = await request.get("/");
  const h = page.headers();
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(h["content-security-policy"]).toContain("default-src 'self'");
  expect(h["x-robots-tag"]).toBeUndefined();
  const html = await page.text();
  const asset = html.match(/\/_astro\/[^"']+\.(?:woff2|js|webp|avif)/)?.[0];
  expect(asset, "a hashed asset referenced by the home page").toBeTruthy();
  const a = await request.get(asset!);
  expect(a.headers()["cache-control"]).toContain("immutable");
});

test("only breakbondsar.org may be indexed", async ({ request }) => {
  const robots = async (host: string) => (await request.get("/", { headers: { Host: host } })).headers()["x-robots-tag"];
  expect(await robots("breakbondsar.org")).toBeUndefined();
  expect(await robots("breakbondsar.example.workers.dev")).toBe("noindex");
  expect(await robots("1a2b3c4d-breakbondsar.example.workers.dev")).toBe("noindex");
  expect(await robots("www.breakbondsar.org")).toBe("noindex");
});

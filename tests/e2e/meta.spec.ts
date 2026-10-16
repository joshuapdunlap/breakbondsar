import { test, expect } from "@playwright/test";
import { ROUTES, ORIGIN } from "./routes";

test("every page has its title, description, canonical URL, share image and icons", async ({ page, request }) => {
  for (const route of ROUTES) {
    await page.goto(route);
    const head = await page.evaluate(() => {
      const m = (sel: string) => document.querySelector(sel)?.getAttribute("content") ?? null;
      return {
        title: document.title,
        description: m('meta[name="description"]'),
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
        ogTitle: m('meta[property="og:title"]'),
        ogImage: m('meta[property="og:image"]'),
        ogImageAlt: m('meta[property="og:image:alt"]'),
        ogUrl: m('meta[property="og:url"]'),
        twitterCard: m('meta[name="twitter:card"]'),
        twitterImage: m('meta[name="twitter:image"]'),
        icon: document.querySelector('link[rel="icon"]')?.getAttribute("href"),
        touch: document.querySelector('link[rel="apple-touch-icon"]')?.getAttribute("href"),
        robots: m('meta[name="robots"]'),
        author: m('meta[name="author"]'),
        jsonld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent ?? ""),
      };
    });
    expect(head.title, route).toMatch(/\| Break the Bonds \| Arkansas$/);
    expect(head.description, route).toBeTruthy();
    expect(head.canonical, route).toBe(ORIGIN + route);
    expect(head.ogUrl, route).toBe(ORIGIN + route);
    expect(head.ogTitle, route).toBeTruthy();
    expect(head.ogImageAlt, route).toBeTruthy();
    expect(head.twitterCard, route).toBe("summary_large_image");
    expect(head.twitterImage, route).toBe(head.ogImage);
    expect(head.robots, route).toBeNull();
    expect(head.author, route).toBeNull();
    expect(head.ogImage, route).toMatch(new RegExp(`^${ORIGIN}/media/.+\\.png$`));
    // The share image exists in this build.
    const img = await request.get(new URL(head.ogImage!).pathname);
    expect(img.status(), head.ogImage!).toBe(200);
    for (const href of [head.icon!, head.touch!]) expect((await request.get(href)).status(), href).toBe(200);
    for (const block of head.jsonld) expect(() => JSON.parse(block), route).not.toThrow();
  }
});

test("robots.txt, sitemap and manifest", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain(`Sitemap: ${ORIGIN}/sitemap-index.xml`);
  const sitemap = await (await request.get("/sitemap-0.xml")).text();
  for (const route of ROUTES) expect(sitemap, route).toContain(`<loc>${ORIGIN}${route}</loc>`);
  expect(sitemap).not.toContain("/404/");
  expect((await request.get("/site.webmanifest")).status()).toBe(200);
  expect((await request.get("/favicon.ico")).status()).toBe(200);
});

test("the 404 page is noindex and links home", async ({ page }) => {
  await page.goto("/404/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
  await expect(page.getByRole("link", { name: "Go to the homepage" })).toHaveAttribute("href", "/");
});

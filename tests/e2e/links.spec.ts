import { test, expect } from "@playwright/test";
import { ROUTES } from "./routes";

// Every internal link on every page resolves, and every in-page anchor it names exists.
test("no broken internal links or anchors", async ({ page, request, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  const targets = new Map<string, string>(); // url without hash -> first page that links it
  const anchors: { from: string; url: string; id: string }[] = [];

  for (const route of ROUTES) {
    await page.goto(route);
    const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => (a as HTMLAnchorElement).href));
    for (const href of hrefs) {
      const u = new URL(href);
      if (u.origin !== origin) continue;
      if (u.hash.length > 1) anchors.push({ from: route, url: u.pathname, id: decodeURIComponent(u.hash.slice(1)) });
      u.hash = "";
      if (!targets.has(u.href)) targets.set(u.href, route);
    }
  }

  const broken: string[] = [];
  for (const [url, from] of targets) {
    const r = await request.get(url, { maxRedirects: 0 });
    if (r.status() >= 300) broken.push(`${r.status()} ${url} (linked from ${from})`);
  }
  expect(broken).toEqual([]);

  const missing: string[] = [];
  const idsByPage = new Map<string, Set<string>>();
  for (const a of anchors) {
    if (!idsByPage.has(a.url)) {
      await page.goto(a.url);
      idsByPage.set(a.url, new Set(await page.$$eval("[id]", (els) => els.map((e) => e.id))));
    }
    if (!idsByPage.get(a.url)!.has(a.id)) missing.push(`${a.url}#${a.id} (linked from ${a.from})`);
  }
  expect(missing).toEqual([]);
});

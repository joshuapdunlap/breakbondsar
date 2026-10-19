import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PAGES } from "./routes";

for (const route of PAGES) {
  test.describe(route, () => {
    test("renders with no console errors, no outside requests and no axe violations", async ({ page, baseURL }) => {
      const origin = new URL(baseURL!).origin;
      const errors: string[] = [];
      const outside: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
      });
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("request", (r) => {
        const url = r.url();
        if (!url.startsWith("data:") && new URL(url).origin !== origin) outside.push(url);
      });

      const response = await page.goto(route, { waitUntil: "networkidle" });
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toBeVisible();

      // Load every lazy image before judging requests and the layout.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 30));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForLoadState("networkidle");

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, "horizontal overflow in px").toBeLessThanOrEqual(0);

      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
        .analyze();
      const violations = axe.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
      expect(violations, "axe violations").toEqual([]);
      expect(errors, "console errors").toEqual([]);
      expect(outside, "requests that leave the origin").toEqual([]);
    });
  });
}

import { test, expect } from "@playwright/test";
import { PAGES } from "./routes";

// With JavaScript off, every page still reads and every action still works:
// links, mailto and tel links, disclosures. Only the copy buttons (which need the
// clipboard) stay hidden.
for (const route of PAGES) {
  test(`${route} works without JavaScript`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Take action/ }).first()).toBeVisible();
    await expect(page.locator(".copy-button:visible")).toHaveCount(0);
    const details = page.locator("details.disclosure");
    if ((await details.count()) > 0) {
      const first = details.first();
      const wasOpen = await first.evaluate((d) => (d as HTMLDetailsElement).open);
      await first.locator("summary").click();
      expect(await first.evaluate((d) => (d as HTMLDetailsElement).open)).toBe(!wasOpen);
    }
  });
}

test("the Take action steps work without JavaScript", async ({ page }) => {
  await page.goto("/take-action/");
  await expect(page.getByRole("link", { name: "(501) 682-5888", exact: true })).toHaveAttribute("href", "tel:+15016825888");
  await expect(page.getByRole("link", { name: "Email the campaign" })).toHaveAttribute(
    "href",
    "mailto:breakbondsar@proton.me?subject=I%20contacted%20the%20Treasury",
  );
  await expect(page.locator("#official-message")).toContainText("Treasurer Thurston, Palestinian lives and freedom");
});

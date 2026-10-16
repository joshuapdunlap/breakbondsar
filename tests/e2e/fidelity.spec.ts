import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { ROUTES } from "./routes";

// Content fidelity against the WordPress site as it stood on 16 October 2026. The one deliberate
// change is /privacy/: its hosting section and review date were rewritten for the new host.
// tests/fixtures/fidelity.json holds, per page:
//   facts  - every dollar figure, percentage, date, statute, agency, quote, source ID, CUSIP,
//            hash and citation on the old page (citations as the href the new page must carry);
//   blocks - the text of every paragraph, heading, list item, caption, table cell and link of
//            the old page's content.
// Each must appear on the same page of the build. Comparison ignores whitespace and the
// decorative arrow and plus glyphs that the old links carried (they are drawn icons now).
type Fixture = { facts: { path: string; type: string; value: string }[]; blocks: Record<string, string[]> };
const fixture: Fixture = JSON.parse(fs.readFileSync(new URL("../fixtures/fidelity.json", import.meta.url), "utf8"));

const squash = (s: string) => s.replace(/ /g, " ").replace(/[→↓↗↑+]/g, "").replace(/\s+/g, "");

for (const route of ROUTES) {
  test(`${route} carries every fact and copy block of the old page`, async ({ page }) => {
    await page.goto(route);
    // textContent of every text node, as the snapshot was read: hidden text counts.
    const text = squash(
      await page.evaluate(() => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const parts: string[] = [];
        while (walker.nextNode()) {
          const parent = walker.currentNode.parentElement;
          if (parent && (parent.closest("script") || parent.closest("style"))) continue;
          parts.push(walker.currentNode.nodeValue ?? "");
        }
        return parts.join("");
      }),
    );
    const hrefs = new Set(await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href") ?? "")));

    const facts = fixture.facts.filter((f) => f.path === route);
    expect(facts.length, "facts in the inventory for this page").toBeGreaterThan(0);
    const missingFacts = facts
      .filter((f) => (f.type === "citation" ? !hrefs.has(f.value) : !text.includes(squash(f.value))))
      .map((f) => `${f.type}: ${f.value}`);
    expect(missingFacts, "facts missing from the page").toEqual([]);

    const blocks = fixture.blocks[route] ?? [];
    expect(blocks.length, "copy blocks for this page").toBeGreaterThan(0);
    const missingBlocks = blocks.filter((b) => !text.includes(squash(b)));
    expect(missingBlocks, "copy blocks missing from the page").toEqual([]);
  });
}

import { defineConfig, devices } from "@playwright/test";

// The site tests run against the production build served by `astro preview`.
//   mobile / desktop: every page at 375x812 and 1280x800 (render, console, origin, axe, layout).
//   site: links, content fidelity and metadata, once.
//   nojs: every page with JavaScript disabled.
//   worker: the built site served by `wrangler dev`, to check _redirects and _headers
//           the way Cloudflare applies them.
//   signup: the "Get involved" form against the Worker and a local D1 in .wrangler/test-state,
//           with and without JavaScript.
const PREVIEW = "http://127.0.0.1:4322";
const WORKER = "http://127.0.0.1:8788";
const chrome = devices["Desktop Chrome"];

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  reporter: [["list"]],
  projects: [
    { name: "mobile", testMatch: /pages\.spec\.ts$/, use: { ...chrome, viewport: { width: 375, height: 812 }, baseURL: PREVIEW } },
    { name: "desktop", testMatch: /pages\.spec\.ts$/, use: { ...chrome, viewport: { width: 1280, height: 800 }, baseURL: PREVIEW } },
    { name: "site", testMatch: /(links|fidelity|meta)\.spec\.ts$/, use: { ...chrome, baseURL: PREVIEW } },
    { name: "nojs", testMatch: /nojs\.spec\.ts$/, use: { ...chrome, javaScriptEnabled: false, baseURL: PREVIEW } },
    { name: "worker", testMatch: /worker\.spec\.ts$/, use: { baseURL: WORKER } },
    { name: "signup", testMatch: /signup\.spec\.ts$/, use: { ...chrome, baseURL: WORKER } },
  ],
  webServer: [
    {
      // --ignore-lock keeps astro preview in the foreground for Playwright.
      command: "npx astro build && npx astro preview --host 127.0.0.1 --port 4322 --ignore-lock",
      url: PREVIEW,
      reuseExistingServer: !process.env.CI,
      timeout: 300_000,
    },
    {
      // Starts once the build above has finished writing dist/ (the preview answers only then),
      // with a local D1 kept apart from any other local state and the migrations applied.
      command:
        `node scripts/wait-for.mjs ${PREVIEW}/` +
        " && npx wrangler d1 migrations apply breakbondsar-signups --local --env test --persist-to .wrangler/test-state" +
        " && npx wrangler dev --env test --ip 127.0.0.1 --port 8788 --log-level warn --persist-to .wrangler/test-state",
      url: WORKER,
      reuseExistingServer: !process.env.CI,
      timeout: 300_000,
    },
  ],
});

// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Static build for Cloudflare Workers static assets (see wrangler.jsonc).
// Every page keeps the WordPress URL it had, trailing slash included.
export default defineConfig({
  site: "https://breakbondsar.org",
  output: "static",
  trailingSlash: "always",
  build: {
    format: "directory",
    // Pages are small; inlining the stylesheet removes the only render-blocking request.
    inlineStylesheets: "always",
  },
  // The sign-up thank-you page is reached by sending the form, not by search.
  integrations: [sitemap({ filter: (page) => !page.endsWith("/404/") && !page.endsWith("/take-action/thanks/") })],
  devToolbar: { enabled: false },
  vite: {
    // Never inline a script into the page: the Content-Security-Policy in public/_headers
    // allows scripts only from this origin (script-src 'self'), so the copy buttons'
    // script has to ship as its own file under /_astro/.
    build: { assetsInlineLimit: 0 },
  },
});

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
  integrations: [sitemap({ filter: (page) => !page.endsWith("/404/") })],
  devToolbar: { enabled: false },
});

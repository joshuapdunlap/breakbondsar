// Checks a deployed copy of the site over the network: pages, headers, redirects, 404.
// Run after a deploy or after the domain cutover.
//
//   node scripts/check-live.mjs                       # https://breakbondsar.org, must be indexable
//   node scripts/check-live.mjs https://<preview>     # any other host, must be noindex
//
// Exits 1 if any check fails.

const origin = new URL(process.argv[2] ?? "https://breakbondsar.org").origin;
const canonical = new URL(origin).hostname === "breakbondsar.org";
const ROUTES = [
  "/", "/the-issue/", "/how-we-win/", "/evidence/", "/take-action/", "/about/", "/investments/", "/progress/", "/policy/", "/privacy/",
  "/take-action/thanks/",
];

let failures = 0;
const check = (ok, label, detail = "") => {
  console.log(`${ok ? "ok  " : "FAIL"} ${label}${detail ? `  (${detail})` : ""}`);
  if (!ok) failures++;
};
const get = (path, init = {}) => fetch(new URL(path, origin), { redirect: "manual", ...init });
const pathOf = (res) => new URL(res.headers.get("location") ?? "", origin).pathname;

for (const route of ROUTES) {
  const r = await get(route);
  const robots = r.headers.get("x-robots-tag");
  check(r.status === 200, `${route} returns 200`, String(r.status));
  check(canonical ? robots === null : robots === "noindex", `${route} ${canonical ? "is indexable" : "is noindex"}`, robots ?? "no X-Robots-Tag");
}

const home = await get("/");
const html = await home.text();
check(/default-src 'self'/.test(home.headers.get("content-security-policy") ?? ""), "Content-Security-Policy is sent");
check(home.headers.get("x-content-type-options") === "nosniff", "X-Content-Type-Options is nosniff");
if (canonical) check(/max-age=\d+/.test(home.headers.get("strict-transport-security") ?? ""), "HSTS is sent on the apex");
check(html.includes(`<link rel="canonical" href="https://breakbondsar.org/">`), "home page canonical points to breakbondsar.org");

// Cloudflare adds its own scripts (Web Analytics) to HTML only for browsers, so ask as one.
const BROWSER = {
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};
for (const route of ["/", "/privacy/"]) {
  const page = await (await get(route, { headers: BROWSER })).text();
  const foreign = [...page.matchAll(/<script[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1]).filter((src) => new URL(src, origin).origin !== origin);
  check(foreign.length === 0, `${route} gives a browser no scripts from other hosts`, foreign.join(" "));
}

const script = html.match(/\/_astro\/[^"']+\.js/)?.[0];
if (script) {
  const s = await get(script);
  check(s.status === 200 && /immutable/.test(s.headers.get("cache-control") ?? ""), "hashed script is cached as immutable", s.headers.get("cache-control") ?? "");
} else check(false, "home page references its script under /_astro/");

const redirects = [
  ["/the-issue", "/the-issue/"],
  ["/wp-content/uploads/2026/09/break-the-bonds-arkansas-campaign-brief-2026-09-28.pdf", "/media/break-the-bonds-arkansas-campaign-brief-2026-09-28.pdf"],
  ["/wp-content/uploads/2026/09/treasury-holdings-2025-06-30.png", "/media/treasury-holdings-2025-06-30.png"],
  ["/feed/", "/"],
  ["/wp-admin/", "/"],
  ["/sitemap.xml", "/sitemap-index.xml"],
];
for (const [from, to] of redirects) {
  const r = await get(from);
  check(r.status >= 301 && r.status <= 308 && pathOf(r) === to, `${from} redirects to ${to}`, `${r.status} ${r.headers.get("location") ?? ""}`);
}

// The sign-up: the Worker signs a fresh timestamp into the form and keeps the page's
// headers; the endpoint answers GET with a redirect to the form. Nothing is submitted.
const act = await get("/take-action/");
const actHtml = await act.text();
check(/name="t" value="\d{10}\.[0-9a-f]{64}"/.test(actHtml), "/take-action/ form carries a signed timestamp");
check(act.headers.get("content-security-policy") === home.headers.get("content-security-policy"), "/take-action/ keeps the Content-Security-Policy");
check(act.headers.get("x-frame-options") === "DENY", "/take-action/ keeps X-Frame-Options");
check(act.headers.get("etag") === null && act.headers.get("cache-control") === "private, no-cache", "/take-action/ is never served stale", act.headers.get("cache-control") ?? "");
const api = await get("/api/signup");
check(api.status === 303 && pathOf(api) === "/take-action/", "GET /api/signup redirects to the form", `${api.status} ${api.headers.get("location") ?? ""}`);

const missing = await get("/no-such-page/");
check(missing.status === 404, "unknown paths return 404", String(missing.status));

if (canonical) {
  try {
    const www = await fetch("https://www.breakbondsar.org/take-action/", { redirect: "manual" });
    check(www.status === 301 && www.headers.get("location") === "https://breakbondsar.org/take-action/", "www redirects to the apex with the path", `${www.status} ${www.headers.get("location") ?? ""}`);
  } catch (e) {
    check(false, "www.breakbondsar.org answers", String(e.cause?.code ?? e.message));
  }
}

console.log(failures ? `\n${failures} check(s) failed on ${origin}` : `\nAll checks passed on ${origin}`);
process.exit(failures ? 1 : 0);

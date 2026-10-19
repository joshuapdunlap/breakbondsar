# breakbondsar.org

The website of Break the Bonds | Arkansas, the campaign to get Arkansas out of Israel Bonds. It calls on the State Treasurer to commit publicly to no new purchases, renewals or reinvestment, and to bring the principal home as the bonds mature. It publishes the public records behind those figures: bondholder statements, custody reports, transfer records and purchase confirmations, with redacted copies and their hashes.

Astro builds the pages, and Cloudflare Workers serves them as static assets. One small Worker script, `worker/index.ts`, handles the site's only form, the "Get involved" sign-up on Take action, and stores sign-ups in Cloudflare D1. The site makes no requests to other hosts: fonts are self-hosted, and there are no analytics, embeds, trackers or cookies.

## Pages

| URL | Page |
|---|---|
| `/` | Home |
| `/the-issue/` | The issue |
| `/how-we-win/` | How we win |
| `/take-action/` | Take action |
| `/evidence/` | Source documents |
| `/investments/` | Investment ledger |
| `/policy/` | Institutional routes |
| `/progress/` | Progress |
| `/about/` | About the campaign |
| `/privacy/` | Privacy |
| `/take-action/thanks/` | Where a sign-up lands (not in the sitemap) |

These are the same URLs the earlier WordPress site used. `public/_redirects` sends its old media URLs (`/wp-content/uploads/…`) to `/media/`, and its feeds, admin pages and `wp-json` paths to the home page.

## Layout of the repository

- `src/pages/`: one file per page, with the page's copy in it.
- `src/components/`: the masthead, footer, poster band, maturity timeline, ledger table, evidence figure and icons.
- `src/data/`: the investment ledger, evidence index and progress matrix as JSON, and each page's title, description and share image.
- `src/styles/global.css`: inks, type and shared rules. `src/fonts/`: the three self-hosted fonts and their licences.
- `src/assets/evidence/`: the source crops that Astro resizes. `public/media/`: every file from the old media library, at full size.
- `public/_headers`, `public/_redirects`: read by Cloudflare at deploy.
- `worker/index.ts`: the sign-up Worker. `migrations/`: the D1 schema. `src/data/signup.ts`: the form's limits, choices and messages, shared by the page, its script and the Worker.
- `scripts/`: the live check, Lighthouse runner and the sign-up export.
- `docs/design-spec.md`: the design and the reasons for it. `DESIGN.md` and `PRODUCT.md`: design-system and product notes.
- `tests/`: Playwright tests and the content-fidelity fixture.

## Run it

Needs Node 22.12 or later.

```sh
npm ci
npm run dev        # http://localhost:4321
```

## Build and preview

```sh
npm run build      # writes dist/
npm run preview    # serves dist/ at http://127.0.0.1:4322
```

## Test

```sh
npx playwright install chromium   # once
npm test
```

`npm test` builds the site, serves it with `astro preview` and with `wrangler dev`, and runs:

- every page at 375 and 1280 pixels wide: it renders, logs no console errors, makes no request off the site, has no horizontal overflow and no axe violations;
- every internal link and in-page anchor resolves;
- content fidelity: every figure, date, statute, quote, citation and paragraph from the WordPress pages (as captured on 16 October 2026, in `tests/fixtures/fidelity.json`) appears on the same page;
- titles, descriptions, canonical URLs, share images, sitemap and robots.txt;
- every page with JavaScript turned off;
- under `wrangler dev`: old URLs, redirects, the 404 page, security headers, and `noindex` on every host except breakbondsar.org;
- the sign-up under `wrangler dev` with a local D1 in `.wrangler/test-state`: the form at 375 and 1280 pixels with no axe violations; a submission without JavaScript stores a row and lands on the thank-you page; errors without and with JavaScript; the honeypot, a too-fast form, a forged timestamp and the rate limit are turned away; a second sign-up with the same email updates the first row.

`npm run lhci` runs Lighthouse CI on every page, desktop and mobile, and fails unless accessibility, best practices and SEO score 1.00, performance scores at least 0.97 on desktop and 0.95 on mobile, and each page transfers under 250 KB.

## The sign-up

The form on `/take-action/#get-involved` is a plain HTML form that posts to `/api/signup` and works without JavaScript. The Worker runs first only for `/api/*` and `/take-action/` (`run_worker_first` in `wrangler.jsonc`); every other request is served straight from the static assets.

- `GET /take-action/`: the Worker serves the static page and writes a signed timestamp into the form's hidden `t` field. After a failed submission (`?signup=error&e=…`) it also fills in the error summary and the messages under each field.
- `POST /api/signup`: in order, a rate limit of five attempts a minute per IP address (the `SIGNUP_LIMITER` binding; the address is the key and is never stored), a honeypot field that answers as if it worked and keeps nothing, the signed timestamp (at least 3 seconds and at most 72 hours old), then the fields. A good sign-up is stored in D1 (`DB`, database `breakbondsar-signups`) and answered with a 303 to `/take-action/thanks/`. One row per email address: signing up again updates the earlier row.

Get the sign-ups out with:

```sh
npm run signups:count     # total, newest sign-up and newest change
npm run signups:export    # CSV in ../breakbondsar-work/signup/exports/signups-<date>.csv
```

Both read the live database (`wrangler d1 execute --remote`) and print no sign-up data. The export refuses to write inside this repository; `SIGNUPS_EXPORT_DIR` sets another folder. Add `-- --local` to read the local test database instead.

To delete one sign-up on request:

```sh
npx wrangler d1 execute breakbondsar-signups --remote --command "DELETE FROM signups WHERE email = 'person@example.com'"
```

First-time setup, already done for breakbondsar.org: `npx wrangler d1 create breakbondsar-signups` and put its ID in `wrangler.jsonc`; `npx wrangler d1 migrations apply breakbondsar-signups --remote`; `npx wrangler secret put SIGNUP_SECRET` with a long random value. Without the secret the page is still served, but every sign-up is refused with an error.

## Deploy

Deploys run by hand with Wrangler:

```sh
npx wrangler login     # once
npm run deploy         # builds, then wrangler deploy
```

Wrangler prints the `workers.dev` address. That address, and any address other than breakbondsar.org, is served with `X-Robots-Tag: noindex` (see `public/_headers`).

After a deploy, check the deployed copy over the network:

```sh
npm run check:live                                        # breakbondsar.org: must be indexable
npm run check:live -- https://breakbondsar.<subdomain>.workers.dev   # any other host: must be noindex
```

It checks every page, the security headers, HSTS and the www redirect on the real domain, a sample of the old WordPress redirects, the 404, the script's cache headers, and that `/take-action/` carries a signed timestamp with its headers intact. It submits nothing.

breakbondsar.org is attached to the Worker as a custom domain by the `routes` entry in `wrangler.jsonc`, so every deploy keeps it. `www.breakbondsar.org` is not attached: a Redirect Rule on the Cloudflare zone sends it to the apex with the path and query. Always Use HTTPS is on for the zone. To roll back, pick an earlier version under Deployments in the Cloudflare dashboard and choose Rollback.

## Updating content

The pages reproduce the WordPress copy exactly, and the fidelity test holds them to it. When the campaign changes a page on purpose, edit the page file, then update `tests/fixtures/fidelity.json` to match. Keep each figure's date and source beside it, and keep separate findings separate.

## Licences

No licence has been chosen for the code yet. The fonts are under the SIL Open Font License; their licence files are in `src/fonts/`. The documents in `public/media/` are public records and campaign materials.

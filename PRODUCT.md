# Product

<!-- impeccable:product-schema 1 -->

Written from the owner's brief of 16 October 2026 without an interview, at the owner's instruction. Facts marked *(inferred)* come from the live site's own copy rather than from the brief; nothing here was confirmed in conversation.

## Platform

web

## Stack

Astro with static output, served by Cloudflare Workers static assets (no Worker script). Set by the owner's brief.

## Users

- Arkansans moved by Palestine who want to do something. They arrive from a shared post or a conversation and need to see what Arkansas holds and what to do about it.
- Organizers who need the facts and the ask fast: the figures, their dates and sources, the demand in one line, and the message to send.
- Reporters, officials and skeptics checking the records. They read the evidence archive, the investment ledger and the institutional routes, and they look for what each document does and does not establish.

## Product Purpose

Break the Bonds | Arkansas is the campaign to end Arkansas's investment in Israel Bonds, which it describes as lending money directly to the Israeli government, and it frames that as support for Palestinian freedom.

The demand: State Treasurer John Thurston commits publicly to no new purchases, no renewals and no reinvestment, and brings the principal home as the bonds mature.

Success: a visitor understands what Arkansas holds, trusts the records, and takes the action on /take-action/.

## Positioning

The site pairs Palestinian testimony and the Palestinian call for divestment with Arkansas's own public records: dated bondholder statements, custody reports, transfer records and purchase confirmations obtained through public-records requests, with redacted copies and hashes published. No other campaign can point to these Arkansas documents. The ask is local and specific: one named official, three named institutions, dated maturities.

## Operating Context

- Ten pages, all at fixed URLs that must keep working: /, /the-issue/, /how-we-win/, /evidence/, /take-action/, /about/, /investments/, /progress/, /policy/, /privacy/.
- The action is offline: copy a suggested message, then call or write to the Treasury, then email the campaign. The site sends nothing itself.
- Contact is email only: breakbondsar@proton.me. Instagram: @breakbondsar (https://www.instagram.com/breakbondsar/).
- Evidence is published as PDFs, PNG crops and an Excel ledger. Each record has an ID (SRC-TRE-001 and so on) that the ledger cites.
- Records are dated. The site was last reviewed on 28 September 2026 *(inferred from page copy)*.

## Capabilities and Constraints

- Copy carries over from the WordPress site word for word: figures, dates, citations, quotes, claims and headings. Only interface microcopy (buttons, labels, navigation names) and missing alt text may be rewritten, and every such change is logged.
- No fact may be added, updated or inferred. Out-of-date statements stay as they are and are reported to the owner.
- The evidence pages and the investment ledger are a record: every figure keeps its date and source beside it, and separate findings stay separate. The site tells readers not to add them together.
- No individual organizers are named anywhere: copy, meta tags, author tags, structured data, humans.txt or the README.
- Images come only from the site's own media library. No stock, no AI-generated imagery, nothing pulled from the web.
- No third-party requests at runtime: self-hosted fonts, no embeds, no trackers, no analytics.
- Works without JavaScript. Respects reduced motion, forced colors and print.

## Brand Commitments

- Name: Break the Bonds | Arkansas. Tagline: "Arkansas out of Israel Bonds."
- A standalone campaign. It is not presented as part of, or affiliated with, any other organization.
- The campaign mark (`campaign-site-icon-512.png`, an abstract three-bar mark in bone and red) is kept exactly as it is.
- Voice *(inferred from page copy)*: direct and morally clear about Palestinian freedom, careful and exact about what each record establishes.

## Evidence on Hand

- Ten source records with redacted public copies and SHA-256 hashes (Treasury, APERS and ATRS), in the snapshot's media library.
- Five literal source crops (PNG) of those records, used as figures.
- The investment event ledger (XLSX, 28 September 2026) and a one-page campaign brief (PDF, 28 September 2026).
- Palestinian testimony: Marwa's diary, published by UNICEF, 20 March 2024, quoted and linked.
- There are no photographs of people, places or actions in the media library. Do not fabricate any.

## Product Principles

1. The record leads the rhetoric. A figure without its date and source does not ship.
2. Palestinian life is the reason; Arkansas's records are the lever. Both stay on the page.
3. One ask, one official, one next step. The action is never more than a click from any page.
4. Say what a document establishes and what it leaves open. Never merge separate findings into a total.
5. Nothing runs that the visitor did not ask for: no tracking, no third-party calls.

## Accessibility & Inclusion

WCAG 2.2 AA at minimum, with zero axe violations as a release gate. The site must work without JavaScript, with keyboard alone, under forced colors and reduced motion, and in print. Figures that carry evidence (source crops, the maturity timeline) need text equivalents that state the same facts.

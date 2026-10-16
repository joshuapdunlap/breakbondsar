# Design spec

Break the Bonds | Arkansas, rebuilt in Astro from the WordPress site of September 2026. This covers the look. The copy carried over word for word.

## What the old site got wrong

- Every section used the same template: a red label over a heading, a condensed sans line and an italic serif line. Testimony, records and the demand all looked alike. There were 29 of those labels.
- The home page opened with a band of dates and figures. Its own button sat below the fold at 1280 by 800, and How we win had no action on its first screen.
- The ledger and the progress matrix were each written twice, once for desktop and once for phones. The maturity timeline was copied by hand onto four pages.
- Each page loaded 550 KB, including a 342 KB font it never used, plus three tracking hosts.

## Direction

Each page opens as a silkscreened solidarity poster, and the Arkansas records sit under it as the fine print. The direction comes from the Palestinian poster tradition: flat ink pulled in one pass, one message per sheet, type knocked out of the colour. A campaign with one ask fits that form. The poster states the demand, and the records below it back it up.

Seven directions were listed from the audience's world: a public-records production (Bates numbers, redaction bars), a bond-maturity timetable, the Southern organizing broadside, tatreez embroidery, a cancelled bond certificate, the Palestinian poster, and investigative newspaper layout. Impeccable's seed assigned the poster (seed key 5aaaec31). The public-records production was the strongest alternative. It would have read colder and closer to a legal filing.

The seed also dealt six outside systems to test the direction against. None beat it, but each lent one rule:

- From a baseball card's front and back: a figure never appears without its record line.
- From dance notation: time is drawn to scale. Dates on the timeline sit where they fall.
- From a transit destination blind: three inks only, and one inverted panel per page.
- From a terminal: statuses print as words.
- From a paper automaton: red marks only what is due or being asked now.
- From a kiln shelf's recipe cards: provenance sits beside every figure.

## Inks

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--olive` | `#2b3517` | The poster sheet: masthead and title band | paper on olive 11.4:1 |
| `--paper` | `#eff1e9` | Ground for the record; type knocked out of olive | ink on paper 15.9:1 |
| `--ink` | `#141710` | Text on paper and on red | ink on red 5.9:1 |
| `--red` | `#ff5b4f` | The campaign mark's red. Fields, and display type on olive | 4.2:1 on olive, large type only |
| `--red-deep` | `#c42b22` | Red text on paper | 4.96:1 |
| `--olive-screen` | `#b9c49a` | Paper ink screened over olive: second lines of titles, breadcrumbs | 7.0:1 on olive |

Tints are halftone screens of olive dots, and secondary text on paper is set in olive ink.

## Type

- Lalezar sets titles, figures and buttons. It comes from Arabic-script poster and cinema lettering and has a Latin companion. It has one weight. On the olive sheet, a title's second line is printed in the second ink (paper screened over olive); on paper, titles print in one ink.
- Markazi Text sets the reading copy. It was drawn for Arabic and Latin together, so it shares Lalezar's heritage. It runs narrow, so body text is 21 to 23 px and the measure is 30em, about 70 characters.
- Atkinson Hyperlegible Mono sets record IDs, ISO dates, CUSIPs and hashes, where a reader has to tell 0 from O and 1 from l.

All three are OFL, self-hosted, Latin subsets, about 60 KB together. Fallback faces are size-adjusted so the swap barely moves text.

## Layout

- Home poster. The title "Arkansas out of Israel Bonds." is sized from the font's measured widths so its longest line fills the measure: two lines on desktop (up to 11rem), three on phones. The witness line, the lede and the action share one row under it, and "For Palestinian freedom" signs off the sheet. The red strip with the two dates and "Tell the Treasurer" still lands inside a 1280 by 800 screen.
- Poster band. Every other page opens on an olive band with a breadcrumb, the title and the intro. Read pages set the title up to 5rem so the record starts higher; Take action and How we win use the full 6rem. The label that sat above each old page title is now the breadcrumb's last item, and the breadcrumb's structured data comes from the same map.
- Margin system. On Read pages, datelines such as "Marwa · Gaza · March 2024" and record IDs sit in a 12rem left margin beside the heading on desktop, and under it on phones. Nothing is printed above a heading.
- Record tables. Each record set is one real table. On phones each row reflows into a slip with its column names printed beside the values; ARIA roles keep it a table. Ledger rows carry their event IDs as anchors, so `/investments/#ATR-P01` links to one row.
- Timeline. One component draws it from the dates. Red marks the two fall maturities, as the copy says. The SVG hides below 768 px, and its list version is always present.
- Red strip. Where a page asks for something now (the fall maturities, "Put the demand to Thurston"), the ask is printed on a red field.

## Motion and details

- One authored moment: on the home page the red "out of" drops into register with the olive sheet over 0.9 s. Reduced motion skips it.
- On phones, a "Tell the Treasurer" bar appears once the first screen has scrolled away. It uses a CSS scroll timeline, needs no JavaScript, and appears without sliding under reduced motion.
- Links underline in the ink of their ground: olive on paper, screened paper on olive, ink on red. Only links that carry the ask (anything pointing to Take action, the Treasury phone number and the Treasury's contact pages) underline in red. Focus is a 3 px outline with a ring of the opposite ink, visible on every ground, including ink buttons on red.
- Scrollbars and text selection are themed from the inks.

## Constraints kept

- Copy word for word, checked by a test against 557 facts and 772 text blocks from the old pages.
- Images only from the old media library. Evidence crops are served as AVIF and WebP at the sizes used, and link to the original files.
- No requests leave the site. No analytics, embeds or font services.
- Works without JavaScript. The copy buttons are the only feature that needs it, and they stay hidden without it. The script ships as its own file, because the Content-Security-Policy allows scripts only from the site.
- Forced colours (the fall dates keep a hollow mark; the headline animation is off), print (black on white, disclosures and hashes printed, link and document URLs printed) and reduced motion are handled.

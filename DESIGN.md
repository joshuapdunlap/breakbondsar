---
name: Break the Bonds | Arkansas
description: Arkansas out of Israel Bonds. Every page opens as a silkscreened solidarity poster, with the Arkansas records printed under it as the fine print.
colors:
  olive: "#2b3517"
  olive-screen: "#b9c49a"
  red: "#ff5b4f"
  red-deep: "#c42b22"
  paper: "#eff1e9"
  ink: "#141710"
  letter: "#fbfcf8"
  rule-soft: "rgb(43 53 23 / 0.28)"
  paper-25: "rgb(239 241 233 / 0.25)"
typography:
  poster:
    fontFamily: '"Lalezar", "Lalezar fallback", "Arial Black", sans-serif'
    fontSize: "clamp(5rem, calc((100vw - 5.75rem) / 6.75), 11rem)"
    fontWeight: 400
    lineHeight: 0.84
    letterSpacing: "-0.01em"
  display:
    fontFamily: '"Lalezar", "Lalezar fallback", "Arial Black", sans-serif'
    fontSize: "clamp(3rem, 1.4rem + 7.6vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.005em"
  display-read:
    fontFamily: '"Lalezar", "Lalezar fallback", "Arial Black", sans-serif'
    fontSize: "clamp(2.75rem, 1.3rem + 5.4vw, 5rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.005em"
  headline:
    fontFamily: '"Lalezar", "Lalezar fallback", "Arial Black", sans-serif'
    fontSize: "clamp(2.25rem, 1.6rem + 3vw, 4.25rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.005em"
  title:
    fontFamily: '"Lalezar", "Lalezar fallback", "Arial Black", sans-serif'
    fontSize: "clamp(1.875rem, 1.5rem + 1.6vw, 2.75rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.005em"
  title-sm:
    fontFamily: '"Lalezar", "Lalezar fallback", "Arial Black", sans-serif'
    fontSize: "clamp(1.5rem, 1.3rem + 0.8vw, 1.875rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.005em"
  button:
    fontFamily: '"Lalezar", "Lalezar fallback", "Arial Black", sans-serif'
    fontSize: "1.3125rem"
    fontWeight: 400
    lineHeight: 1
  lede:
    fontFamily: '"Markazi Text", "Markazi fallback", Georgia, serif'
    fontSize: "clamp(1.5rem, 1.3rem + 0.8vw, 1.875rem)"
    fontWeight: 400
    lineHeight: 1.3
  body:
    fontFamily: '"Markazi Text", "Markazi fallback", Georgia, serif'
    fontSize: "clamp(1.3125rem, 1.2rem + 0.4vw, 1.4375rem)"
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: '"lnum"'
  nav:
    fontFamily: '"Markazi Text", "Markazi fallback", Georgia, serif'
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.45
  small:
    fontFamily: '"Markazi Text", "Markazi fallback", Georgia, serif'
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.35
  dateline:
    fontFamily: '"Markazi Text", "Markazi fallback", Georgia, serif'
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.3
  label:
    fontFamily: '"Markazi Text", "Markazi fallback", Georgia, serif'
    fontSize: "1.0625rem"
    fontWeight: 700
    lineHeight: 1.35
  data:
    fontFamily: '"Atkinson Hyperlegible Mono", "Atkinson Mono fallback", ui-monospace, Consolas, monospace'
    fontSize: "0.78em"
    fontWeight: 400
    letterSpacing: "0"
rounded:
  none: "0"
spacing:
  s-1: "0.25rem"
  s-2: "0.5rem"
  s-3: "0.75rem"
  s-4: "1rem"
  s-5: "1.5rem"
  s-6: "2rem"
  s-7: "3rem"
  s-8: "4.5rem"
  s-9: "6.5rem"
  gutter: "clamp(1rem, 4vw, 2.5rem)"
  measure: "30em"
  wide: "78rem"
components:
  button-primary:
    backgroundColor: "{colors.red}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0.55em 1.05em 0.45em"
    height: "3rem"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-primary-hover-on-olive:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  button-primary-current:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0.55em 1.05em 0.45em"
    height: "3rem"
  button-ink-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0.55em 1.05em 0.45em"
    height: "3rem"
  button-quiet-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  masthead:
    backgroundColor: "{colors.olive}"
    textColor: "{colors.paper}"
    padding: "1rem 0 0.75rem"
  nav-link:
    textColor: "{colors.paper}"
    typography: "{typography.nav}"
    height: "2.75rem"
  research-tab:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "0.35em 0.9em 0.25em"
    height: "2.75rem"
  research-tab-current:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  poster-band:
    backgroundColor: "{colors.olive}"
    textColor: "{colors.paper}"
    padding: "2rem 0 4.5rem"
  red-strip:
    backgroundColor: "{colors.red}"
    textColor: "{colors.ink}"
    padding: "2rem 0"
  tell-bar:
    backgroundColor: "{colors.olive}"
    padding: "0.5rem clamp(1rem, 4vw, 2.5rem)"
  record-figure:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "0.75rem"
  letter-sheet:
    backgroundColor: "{colors.letter}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "2rem 1.5rem"
---

# Design System: Break the Bonds | Arkansas

## Overview

**Creative North Star: "The Poster and Its Fine Print"**

Each page opens as a silkscreened solidarity poster from the Palestinian poster tradition: flat ink pulled in one pass, one message per sheet, type knocked out of the colour. The Arkansas records sit under the poster as the fine print it stands on. The poster states the demand at a scale meant to be read across a room. The records below are dated, sourced, and set for close reading, because reporters and skeptics will check them.

The world has three inks and paper. Deep olive covers the poster sheet, and paper-white type is knocked out of it. Mark red, taken from the campaign mark, is held back for what is due or being asked now. Black ink sets the record on a cool lime-wash paper. Tints are halftone screens of olive dots, never washes. Lalezar, from Arabic-script poster and cinema lettering, carries the display voice. Markazi Text, drawn for Arabic and Latin together, sets the reading copy. Atkinson Hyperlegible Mono sets record IDs, CUSIPs, ISO dates and hashes, where a reader has to tell 0 from O.

The density is two-speed. The sheet is loud and sparse, with one message, one action and one strip of dates. The record is quiet and dense, with tables, provenance lines, rules and margins. The system refuses the campaign template of a dark band, a red eyebrow and an italic-serif second line, and it refuses the soft-cornered NGO report.

**Key Characteristics:**
- Every page opens on the olive sheet: a full poster on the home page, a poster band with breadcrumb on every other page.
- Three inks and paper, printed flat. No shadows, no gradient fills, no rounded corners.
- Red means "due now" or "asked now", and nothing else.
- Headings carry their own weight. Nothing is printed above a heading.
- Every figure carries its date and record beside it.
- Rules, bars and squares are the structure. Boxes and cards are not.

## Colors

Three inks and a paper. The olive sheet is the voice, mark red is the ask, and black on lime-wash paper is the record.

### Primary
- **Sheet Olive** (#2b3517): The poster sheet. It covers the masthead, the home poster, every poster band, the phone Tell bar, and the 0.75rem bars that open major blocks. On paper it doubles as the secondary text ink, as rules, timeline lanes and marks, and as the halftone dot. Paper on olive is 11.35:1. The stylesheet aliases it as `--olive-ink` (text) and `--rule` (lines), both the same ink.
- **Second Pull** (#b9c49a): Paper ink screened over olive. Used only on the olive sheet, for the second line of a heading, breadcrumbs, "Arkansas" in the wordmark, provenance on olive, link underlines on olive, the poster's sign-off line and the rule under the poster title. Contrast on olive is 7.03:1.

### Secondary
- **Mark Red** (#ff5b4f): The campaign mark's red. It prints as a field (the due strip, the close strip, the action band, the join panel), as the primary button, as the red "out of" in the home title, as the take-action step numerals, as the timeline mark for the next Treasury maturity, and as the underline on ask links over olive. Ink on red is 5.92:1. Red on olive is 4.22:1, so as text it only ever appears at display scale.
- **Dense Mark Red** (#c42b22): The same red printed dense enough to read on paper (4.96:1). It sets the demand line "No new Israel Bonds.", the first win row on How we win, the demand statement on The issue, and the fall dates in the timeline list. It also underlines ask links on paper and is the form `accent-color`.

### Neutral
- **Lime-Wash Paper** (#eff1e9): The ground for the record, and the colour of type knocked out of olive. Ink on paper is 15.89:1.
- **Press Black** (#141710): A green-leaning black. It sets text on paper and text on red, the ink button, and the focus outline on paper.
- **Letter White** (#fbfcf8): A brighter sheet used for one thing, the suggested letter on Take action, so the text a visitor will copy stands apart from the record.
- **Soft Olive Hairline** (rgb(43 53 23 / 0.28)): Hairlines between table rows, timeline gridlines, and the left rule of an open disclosure panel.
- **Paper Hairline** (rgb(239 241 233 / 0.25)): Hairlines on the olive sheet, between take-action steps and above the phone nav.
- **Halftone Screen** (`radial-gradient(circle at 50% 50%, rgb(43 53 23 / 0.17) 0.95px, transparent 1.3px) 0 0 / 5px 5px` over paper): The only tint. It covers the home responsibility band, open disclosure panels, record-figure mounts, the slip containers, the empty part of the ATRS bar, and a targeted ledger row.

### Named Rules
**The Due-Now Rule.** Red marks only what is due or being asked now: the primary action, the fall maturities, the demand, and links that lead to the ask. If an element is neither the ask nor a date that is due, it is not red. Red is never used for emphasis, decoration, status or error.

**The Ink-of-Its-Ground Rule.** Links underline in the ink of the ground they sit on: olive at 60% on paper, Second Pull on olive, ink on red. Only links that carry the ask underline in red: anything pointing to /take-action/, `tel:` links, and artreasury.gov links. They use Dense Mark Red on paper and Mark Red on olive.

**The Never-Gray Rule.** Secondary text on paper is olive ink. On olive it is Second Pull. No gray exists in the system.

## Typography

**Display Font:** Lalezar (with a size-adjusted Arial Bold fallback, then Arial Black)
**Body Font:** Markazi Text (with a size-adjusted Georgia fallback)
**Label/Mono Font:** Atkinson Hyperlegible Mono (with a size-adjusted Courier New fallback)

**Character:** Lalezar is heavy and condensed poster lettering with Arabic-script cinema roots and a single weight. Markazi Text is a narrow, warm text face from the same bilingual heritage. The two read as one printshop: the poster voice and the record voice. All three faces are OFL, self-hosted, Latin-subset woff2, and the fallbacks are metric-matched so the swap barely moves text.

### Hierarchy
- **Poster** (Lalezar 400, up to 11rem, line-height 0.84, -0.01em): The home title only. Its size is computed from the font's measured widths so the longest line fills the measure. On desktop it sets two lines, with "Arkansas out of" filling the width. On phones it sets three lines at `clamp(3.5rem, calc((100vw - 2.25rem) / 5.6), 7.5rem)`, with "Israel Bonds." filling the width.
- **Display** (Lalezar 400, up to 6rem, 0.95): Poster-band titles on Persuade pages (Take action, How we win), institution headings on The issue, and the 404 title. Set at 14ch maximum.
- **Display Read** (Lalezar 400, up to 5rem, 0.95): Poster-band titles on Read pages, kept smaller so the record starts higher. Set at 16ch maximum.
- **Headline** (Lalezar 400, up to 4.25rem, 0.98): Section headings set as poster lines in two-column splits, chapters, the close-strip line, and win rows.
- **Title** (Lalezar 400, up to 2.75rem, 0.98): The default h2, source headings, the timeline title, and the due-strip title. Lalezar also sets every money figure: record-row amounts at up to 3.25rem, due amounts at up to 2.75rem, and ledger amounts at 1.35rem.
- **Title Small** (Lalezar 400, up to 1.875rem, 1.05): h3 and step titles.
- **Lede** (Markazi Text 400, up to 1.875rem, 1.3): Poster-band intros, at 30em maximum.
- **Body** (Markazi Text 400, 1.3125–1.4375rem, 1.45, lining numerals): Reading copy at a 30em measure (about 70 characters). Markazi runs narrow, so body text is set large.
- **Small** (Markazi Text 400, 1.0625rem, 1.35): Provenance lines, tables, captions, footnotes and scope notes, printed in olive ink.
- **Dateline** (Markazi Text 600, 1.0625rem, 1.3): Datelines and margin labels, in olive ink.
- **Label** (Markazi Text 700, 1.0625rem): Table headers, captions and list labels.
- **Data** (Atkinson Hyperlegible Mono 400, 0.78em of its context, no tracking, no wrap): Record IDs, CUSIPs, ISO dates, hashes and the timeline's year axis.

### Named Rules
**The One-Ink Heading Rule.** On paper a heading prints in one ink. Only on the olive sheet does the heading's second line take the second ink, Second Pull. On red it stays ink. Emphasis is a change of ink. It is never a slant, a second face or a synthesized heavier weight, because Lalezar has one weight (400).

**The Margin Dateline Rule.** No label, eyebrow, kicker or section number is printed above a heading. On Read pages, datelines and record IDs sit in the 12rem left margin beside the heading. On phones they sit under the heading. A page's own label is the last item of its breadcrumb.

**The Figure-and-Record Rule.** A money figure is set in Lalezar, and its record line (date and source, in Small olive ink) prints directly beside or beneath it. A figure never appears without its record line.

**The Mono-for-Records Rule.** Atkinson Hyperlegible Mono is used only where characters must be told apart: IDs, CUSIPs, ISO dates, hashes and measurement axes. It is never a "technical" costume.

## Layout

The site uses one wide column (`.wrap`, 78rem maximum, with the fluid gutter) and inks laid as full-bleed bands. The top of every page is olive. The masthead and the poster or band below it read as one sheet. Paper sections follow, divided by rules. Red fields appear only where the page asks for something. The footer sits on paper under a 0.75rem olive bar.

- **Home poster.** The poster title fills the measure. Under it, a 2px Second Pull rule opens a foot row with the witness line, the lede and the actions. These sit in three columns at 60rem and above (1fr / 1.25fr / auto) and stack on phones. "For Palestinian freedom" signs off the sheet. The red due strip closes the sheet and lands inside a 1280 by 800 first viewport.
- **Poster band.** Breadcrumb, title, then intro (30em, Lede). The band pads 2rem on top and 4.5rem at the bottom. A band with a foot slot drops its bottom padding, and the red strip prints flush at the sheet's foot.
- **Margin grid (Read pages).** At 60rem and above there are two columns, a 12rem margin and the 30em measure, with a 3rem gap. Datelines, record IDs and margin labels take column 1, row 1, beside the heading, each under a 2px olive rule. Below 60rem it is one column in source order: heading, then dateline, then prose.
- **Split.** At 60rem and above, a heading set as a poster line takes the left half and the body (30em) takes the right. Below that, they stack.
- **Rhythm.** Sections pad 4.5rem (`s-8`) top and bottom. Stacks inside a block step at 1rem (`s-4`). A prose h2 takes 3rem above and 1rem below. Paragraphs are separated by 0.8em. Captions and scope notes run to 44em.
- **Breakpoints.** 23rem: the wordmark may wrap. 48rem: tables reflow into slips, the Tell bar appears, and the timeline drawing hides below this width. 60rem: the margin grid, splits, the poster's two-line title and multi-column rows. 64rem: the masthead collapses to a grid below this width.
- **Targets.** Every link and control is at least 2.75rem (44px) tall. Buttons are 3rem.

### Named Rules
**The One-Sheet Rule.** The olive sheet appears once per page, at the top. Further down the page, rules and halftone screens divide sections, and red fields carry the ask. The olive is not repeated as a mid-page band.

**The Measure Rule.** Reading text holds a 30em measure. Display lines may run the full width, but prose may not.

## Elevation & Depth

The system is flat, like a print pulled in one pass. Depth comes from the order of inks: the olive sheet, then the red field, then the halftone-screened panel, then paper, then the letter sheet. There are no shadows for elevation anywhere. The sticky Tell bar on phones is the only element that rides over content, and it is a plain olive strip with no shadow.

### Shadow Vocabulary
- **Focus ring** (`box-shadow: 0 0 0 6px var(--paper)` around a `3px solid var(--ink)` outline offset 3px): The only box-shadow, and it marks focus, not depth. On olive and red the inks swap: a paper outline with an ink ring. An ink button on red keeps an ink outline with a paper ring.

### Named Rules
**The One-Pass Rule.** Nothing floats. Layers are inks laid flat, never elevations. A block needs a different ink, a screen or a rule to stand apart, not a shadow.

## Shapes

Every corner is square (radius 0). Structure comes from rules of set weights, and marks are squares.

- **Rule weights.** A 0.75rem olive bar opens a major block: the witness quote, the demand, institution sections, the officials kit, the first win row and the footer. A 0.5rem olive top opens an evidence source entry, an "At a glance" slip or the letter sheet. A 3px rule opens a record set such as a table, the record list or the timeline. A 2px rule divides sections, heads tables and frames slips. A 1px soft hairline separates rows.
- **Slips.** A slip is a halftone-screened panel framed by a 2px olive border. It holds the investments warning, the follow-up note on Take action and the "At a glance" summaries. "At a glance" adds a 0.5rem top. The letter sheet uses that heavier frame on Letter White.
- **Marks.** Timeline points are 14-unit squares, and list markers are 0.7rem squares. Due marks are Mark Red with an ink stroke. The only circles in the system are halftone dots.
- **Icons.** One drawn set (arrow right, down and up, external, plus, phone, mail, copy, download) on a 24-unit grid with a 2-unit stroke, square caps and mitred joins. Icons always sit beside words and never carry meaning alone.

## Components

### Buttons
Printed blocks of ink. The label names the action.
- **Shape:** Square (0), 2px border in the button's own ink, at least 3rem tall.
- **Primary:** A Mark Red block with ink text in Lalezar 1.3125rem, padded 0.55em 1.05em 0.45em, followed by a drawn arrow at 1em. It is used for the main action on the sheet and in the masthead.
- **Hover / Focus:** On paper a primary button turns ink with paper text. On olive it turns paper with ink text. The change is a 160ms colour transition on the system ease-out. Focus uses the two-ink ring.
- **Ink:** An ink block with paper text, used on red fields. On hover it turns paper with ink text.
- **Quiet:** Transparent, with a border and text in the current ink. It fills with ink on hover. It is used for secondary copy actions.
- **Current:** The masthead's "Take action" button on its own page prints in paper with ink text.
- **Copy buttons:** These need JavaScript, so they stay hidden without it. Once copied, they print ink with a paper border.

### Go Links
A text link that leads somewhere: words first, then a drawn arrow. Markazi 600, underlined, at least 2.75rem tall. On hover the arrow moves 0.15em (diagonally for external links) over 180ms. Inside running text the inline variant stays in the sentence. Go links follow the Ink-of-Its-Ground Rule.

### Navigation
- **Masthead:** Sits on the olive sheet. On the left is the campaign mark (2.75rem) with "Break the Bonds" in Lalezar 1.5rem over "Arkansas" in Lalezar 1.05rem Second Pull. In the middle are nav links in Markazi 600 1.25rem with no underline. They show a 3px bottom border in Second Pull on hover and in paper when current. On the right is the red "Take action" button.
- **Below 64rem:** The masthead becomes a grid, with brand and action on top and the nav underneath, under a paper hairline. The nav runs in two columns on phones and as one row from 48rem to 64rem.
- **Breadcrumbs:** These sit on the band in Small, Second Pull, separated by "/". The current item prints in paper 600.
- **Research tabs:** The evidence section links are bordered tabs (2px Second Pull, Markazi 700 1.15rem). A tab's border turns paper on hover, and the current tab fills paper with ink text.
- **Footer:** Sits on paper under the 0.75rem olive bar. It has a Lalezar wordmark at 2.25rem, page links in two columns with the record links set off by a 1px hairline, and a bottom row on a 2px rule.

### Red Strip
A Mark Red field printed where a page asks for something now, in ink type with an ink button. On the home sheet it is the due strip: "Next maturity: November 1." with the dated amounts, the next one under a 3px ink rule and a passed one set back under a 1px rule at a smaller size, and "Tell the Treasurer". On other pages it is the close strip "Put the demand to Thurston." in Headline type, or a slim strip of maturities at the foot of the Take action band.

### Tell Bar
For phones only: a sticky olive strip at the foot of `<main>` with a full-width primary button, "Tell the Treasurer". A CSS scroll timeline keeps it hidden until the first 90vh has scrolled past, with no JavaScript. Under reduced motion it appears without sliding. It never covers the footer, and Take action does not show it.

### Record Tables
Each record set is one real table under a 3px rule. Headers are 700 with a 2px rule, and rows are separated by 1px hairlines. Amounts are set in Lalezar, citations in olive ink, and IDs and dates in Data. A ledger row targeted by its event-ID anchor takes the halftone screen and a 2px ink outline. Below 48rem each row reflows into a slip: the column name prints above each value (700, olive, 0.85em, hidden from screen readers), slips are separated by 2px rules, and explicit ARIA roles keep the table semantics.

### Record Figure
A literal crop of a source document on a halftone mount: 0.75rem padding, a 2px olive border, and the image on white. It links to the original file. On hover the border turns ink with an extra 1px outline. The caption opens with a Lalezar label in olive ink ("Source record", "Excerpt").

### Maturity Timeline
Maturity dates drawn to scale on one time axis, with one lane per institution, so distance on the line is distance in time. Lanes are 2px olive, gridlines are hairlines, and the years are set in Data. Marks are olive squares. The next Treasury maturity is a Mark Red square with an ink stroke; dates that have passed stay olive. The list version is always present. The drawing hides below 48rem. Under forced colours the due marks become hollow, heavy-stroked squares.

### Ask Steps
The three steps on Take action print across the sheet in three columns at 60rem and above, separated by paper hairlines. Each numeral is set in Lalezar Mark Red at up to 5rem. The numerals carry information, the order of the ask, and they are aria-hidden.

### Statuses
Statuses print as words, using weight and ink and never badges. "No" is olive ink. "Not applicable" is olive ink with a dotted underline. "Against" is 700 ink.

### Disclosures
A printed tab opens onto a screened panel. The summary row sits under a 2px rule, at least 3rem tall, in 700 weight. Its plus icon rotates 45° over 200ms when open. The panel takes the halftone screen with a 1px soft left rule. In print, disclosures print open.

### Motion
There is one authored moment. On the home page, the red "out of" drops into register with the olive sheet: a translate of (0.06em, -0.035em), settling to none over 900ms with `cubic-bezier(0.16, 1, 0.3, 1)` after a 120ms delay. Everything else is a state transition of 200ms or less on the same ease-out. Reduced motion cuts every transition to 1ms, and forced colours turn the register animation off.

## Do's and Don'ts

### Do:
- **Do** open every page on the olive sheet: the full poster on the home page, and the poster band with breadcrumb, title and intro everywhere else.
- **Do** keep red for the ask and what is due now, with Mark Red (#ff5b4f) on olive and as fields, and Dense Mark Red (#c42b22) for text on paper.
- **Do** print the second line of a heading in Second Pull (#b9c49a) only on the olive sheet. On paper and red, a heading is one ink.
- **Do** print every money figure in Lalezar with its date and source beside it in olive-ink Small type.
- **Do** put datelines and record IDs in the 12rem margin on Read pages, under the heading on phones.
- **Do** hold reading text to the 30em measure and every target to at least 2.75rem.
- **Do** separate blocks with the rule weights (0.75rem bar, 3px, 2px, 1px hairline) and tint only with the olive halftone screen.
- **Do** theme the browser surfaces from the inks: red selection with ink text, olive-on-paper scrollbars, the two-ink focus ring, and the 0.18em underline offset.
- **Do** keep forced colours, print and reduced motion working: in print everything goes black on white, disclosures print open, and link URLs are printed.

### Don't:
- **Don't** print a label, eyebrow, kicker or section number above a heading.
- **Don't** use red for emphasis, decoration, status, errors or ordinary links.
- **Don't** slant heading emphasis, set it in a second face, or give paper headings a second ink.
- **Don't** add shadows, rounded corners, gradients other than the halftone screen, glass, or a second olive band mid-page.
- **Don't** use gray. Secondary text is olive ink on paper and Second Pull on olive.
- **Don't** use monospace outside IDs, CUSIPs, ISO dates, hashes and measurement axes.
- **Don't** turn statuses into badges, pills or coloured chips. They print as words.
- **Don't** use photographs, stock or generated imagery. Images are literal crops of source records on a halftone mount.
- **Don't** use Unicode glyphs or emoji as icons. Use the drawn 24-unit, 2-stroke set.
- **Don't** rewrite body copy to fit a layout. The body copy reproduces the old site word for word, so fit the layout to the copy.

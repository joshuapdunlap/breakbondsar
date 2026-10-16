import pages from "./pages.json";

export const SITE = {
  origin: "https://breakbondsar.org",
  name: "Break the Bonds | Arkansas",
  tagline: "Arkansas out of Israel Bonds.",
  email: "breakbondsar@proton.me",
  instagram: "https://www.instagram.com/breakbondsar/",
  mark: "/media/campaign-site-icon-512.png",
} as const;

export type PagePath = keyof typeof pages;
export const PAGES = pages as Record<string, (typeof pages)[PagePath]>;

export const NAV = [
  { href: "/the-issue/", label: "The issue" },
  { href: "/how-we-win/", label: "How we win" },
  { href: "/evidence/", label: "Evidence & progress", section: ["/evidence/", "/investments/", "/policy/", "/progress/"] },
  { href: "/about/", label: "About" },
] as const;

export const RESEARCH = [
  { href: "/evidence/", label: "Source documents" },
  { href: "/investments/", label: "Investment ledger" },
  { href: "/policy/", label: "Institutional routes" },
  { href: "/progress/", label: "Progress" },
] as const;

/** Old absolute links become site-relative; WordPress upload paths become /media/ paths. */
export function local(href: string): string {
  return href
    .replace(/^https:\/\/breakbondsar\.org\/wp-content\/uploads\/\d{4}\/\d{2}\//, "/media/")
    .replace(/^https:\/\/breakbondsar\.org(?=\/)/, "");
}

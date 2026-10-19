// The ten pages of the site, at the URLs the WordPress site used.
export const ROUTES = [
  "/",
  "/the-issue/",
  "/how-we-win/",
  "/evidence/",
  "/take-action/",
  "/about/",
  "/investments/",
  "/progress/",
  "/policy/",
  "/privacy/",
] as const;

/** Pages added after the WordPress site, which the content-fidelity fixture does not cover. */
export const NEW_ROUTES = ["/take-action/thanks/"] as const;

export const PAGES = [...ROUTES, ...NEW_ROUTES];

export const ORIGIN = "https://breakbondsar.org";

// The "Get involved" sign-up: field limits, choices and messages, shared by the form
// (src/components/Signup.astro), its inline checks (src/scripts/enhance.ts) and the
// Worker that stores it (worker/index.ts), so all three say the same thing.

export const LIMITS = { name: 100, email: 254, phone: 25, zip: 10, note: 500 } as const;

/** A person takes longer than this to fill in the form; most scripts do not. */
export const MIN_SECONDS = 3;
/** A form left open longer than this is sent back for a fresh start. */
export const MAX_AGE_HOURS = 72;

export const INTERESTS = [
  { value: "show-up", label: "Show up to actions" },
  { value: "contact-officials", label: "Contact officials" },
  { value: "research", label: "Research and records" },
  { value: "design-media", label: "Design and media" },
  { value: "other", label: "Other" },
] as const;

/** Fields that can carry their own error message, by the id suffix their elements use. */
export const FIELDS = ["name", "email", "phone", "zip", "note"] as const;
export type Field = (typeof FIELDS)[number];

/** Problems that belong to the whole form rather than one field. */
export const FORM_PROBLEMS = ["form", "busy", "server"] as const;
export type Problem = Field | (typeof FORM_PROBLEMS)[number];

export const MESSAGES: Record<Problem, string> = {
  name: "Enter your name, up to 100 characters.",
  email: "Enter your email address, like name@example.com.",
  phone: "Enter a phone number with its area code, or leave it blank.",
  zip: "Enter a five-digit ZIP code, or leave it blank.",
  note: "Keep the note to 500 characters or fewer.",
  form: "Your sign-up was not saved. Check your details and press Sign up again.",
  busy: "Too many sign-ups came from your connection in the last minute. Wait a minute, then try again.",
  server: "Something went wrong on our side and your sign-up was not saved. Try again, or email breakbondsar@proton.me.",
};

export const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s().-]{7,25}$/,
  zip: /^\d{5}(-\d{4})?$/,
};

/** Checks one field as the form holds it. Returns the problem, or null if it is fine. */
export function check(field: Field, raw: string): Field | null {
  const value = raw.trim();
  switch (field) {
    case "name":
      return value.length === 0 || value.length > LIMITS.name ? "name" : null;
    case "email":
      return value.length > LIMITS.email || !PATTERNS.email.test(value) ? "email" : null;
    case "phone": {
      if (!value) return null;
      const digits = value.replace(/\D/g, "").length;
      return !PATTERNS.phone.test(value) || digits < 10 || digits > 15 ? "phone" : null;
    }
    case "zip":
      return value && !PATTERNS.zip.test(value) ? "zip" : null;
    case "note":
      return raw.replace(/\r\n?/g, "\n").trim().length > LIMITS.note ? "note" : null;
  }
}

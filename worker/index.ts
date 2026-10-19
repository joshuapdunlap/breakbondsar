// The site's only server code. Cloudflare serves every page as a static asset; this Worker
// runs first for two paths only (see run_worker_first in wrangler.jsonc):
//
//   POST /api/signup   stores a "Get involved" sign-up in D1, then redirects (303) to
//                      /take-action/thanks/, or back to the form with error codes.
//   GET /take-action/  the static page, with a fresh signed timestamp written into the
//                      form, and, after a failed submission, the error messages.
//
// Spam checks, cheapest first: a per-IP rate limit (the IP is used as the limiter's key
// and never stored), a honeypot field, and the signed timestamp, which must be at least
// MIN_SECONDS old and at most MAX_AGE_HOURS old. Nothing here calls another host.
import { FIELDS, FORM_PROBLEMS, INTERESTS, LIMITS, MAX_AGE_HOURS, MESSAGES, MIN_SECONDS, check, type Field, type Problem } from "../src/data/signup";

// The few runtime types this file uses, so it needs no generated type package.
interface Fetcher {
  fetch(request: Request): Promise<Response>;
}
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<unknown>;
}
interface D1Database {
  prepare(query: string): D1PreparedStatement;
}
interface RateLimit {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}
interface ElementHandler {
  element(el: { setAttribute(n: string, v: string): void; removeAttribute(n: string): void; setInnerContent(c: string, o?: { html: boolean }): void }): void;
}
declare class HTMLRewriter {
  on(selector: string, handler: ElementHandler): HTMLRewriter;
  transform(response: Response): Response;
}

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  SIGNUP_LIMITER: RateLimit;
  /** Signs the form timestamp and keys the user-agent hash. Set with `wrangler secret put`. */
  SIGNUP_SECRET?: string;
}

const FORM_PAGE = "/take-action/";
const THANKS_PAGE = "/take-action/thanks/";
const ANCHOR = "#get-involved";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/signup") return signup(request, env, url);
    if (url.pathname === FORM_PAGE && (request.method === "GET" || request.method === "HEAD")) return formPage(request, env, url);
    return env.ASSETS.fetch(request);
  },
};

// ---------------------------------------------------------------------------------------
// POST /api/signup

async function signup(request: Request, env: Env, url: URL): Promise<Response> {
  if (request.method !== "POST") return redirect(url, FORM_PAGE + ANCHOR);

  // The form only ever posts from this origin (and the CSP's form-action says so too).
  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin) return new Response("Forbidden", { status: 403, headers: noStore() });

  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const { success } = await env.SIGNUP_LIMITER.limit({ key: ip });
  if (!success) return back(url, ["busy"]);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return back(url, ["form"]);
  }
  const text = (name: string) => {
    const v = form.get(name);
    return typeof v === "string" ? v : "";
  };

  // A field people never see. Whatever filled it in is told it worked, and nothing is kept.
  if (text("hp_extra") !== "") return redirect(url, THANKS_PAGE);

  if (!env.SIGNUP_SECRET) return back(url, ["server"]);
  if (!(await timestampIsValid(text("t"), env.SIGNUP_SECRET))) return back(url, ["form"]);

  const problems = FIELDS.map((f) => check(f, text(f))).filter((p): p is Field => p !== null);
  if (problems.length) return back(url, problems);

  const allowed: readonly string[] = INTERESTS.map((i) => i.value);
  const picked = new Set(form.getAll("interests").filter((v): v is string => typeof v === "string"));
  const interests = allowed.filter((v) => picked.has(v)).join(",") || null;

  const now = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const ua = request.headers.get("user-agent");
  const row = {
    name: clean(text("name"), LIMITS.name),
    email: text("email").trim().toLowerCase(),
    phone: phone(text("phone")),
    zip: text("zip").trim() || null,
    interests,
    note: note(text("note")),
    source: sourcePath(request, url),
    user_agent_hash: ua ? (await hmacHex(env.SIGNUP_SECRET, "ua:" + ua)).slice(0, 32) : null,
  };

  try {
    // One row per email address: a second sign-up updates the first. Optional fields left
    // blank the second time keep what was given before.
    await env.DB.prepare(
      `INSERT INTO signups (created_at, updated_at, name, email, phone, zip, interests, note, source, user_agent_hash)
       VALUES (?1, ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
       ON CONFLICT (email) DO UPDATE SET
         updated_at = excluded.updated_at,
         name = excluded.name,
         phone = COALESCE(excluded.phone, signups.phone),
         zip = COALESCE(excluded.zip, signups.zip),
         interests = COALESCE(excluded.interests, signups.interests),
         note = COALESCE(excluded.note, signups.note),
         source = excluded.source,
         user_agent_hash = excluded.user_agent_hash`,
    )
      .bind(now, row.name, row.email, row.phone, row.zip, row.interests, row.note, row.source, row.user_agent_hash)
      .run();
  } catch (e) {
    // Log the failure, never the submission.
    console.error("signup insert failed", e instanceof Error ? e.message : String(e));
    return back(url, ["server"]);
  }
  return redirect(url, THANKS_PAGE);
}

/** Collapses runs of whitespace and drops control characters. */
function clean(value: string, max: number): string {
  return value
    .normalize("NFC")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

/** US numbers become +1 and ten digits; numbers given with a + keep their country code. */
function phone(value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  const digits = v.replace(/\D/g, "");
  if (v.startsWith("+")) return "+" + digits;
  if (digits.length === 10) return "+1" + digits;
  if (digits.length === 11 && digits.startsWith("1")) return "+" + digits;
  return digits;
}

function note(value: string): string | null {
  const v = value
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, "")
    .trim()
    .slice(0, LIMITS.note);
  return v || null;
}

/** The path of the page the form was sent from, if it was this site. Never the query. */
function sourcePath(request: Request, url: URL): string | null {
  const referer = request.headers.get("referer");
  if (!referer) return null;
  try {
    const r = new URL(referer);
    return r.origin === url.origin ? r.pathname.slice(0, 200) : null;
  } catch {
    return null;
  }
}

function redirect(url: URL, path: string): Response {
  return new Response(null, { status: 303, headers: { Location: new URL(path, url.origin).href, ...noStore() } });
}

/** Back to the form, naming the problems (field names only; never what was typed). */
function back(url: URL, problems: Problem[]): Response {
  return redirect(url, `${FORM_PAGE}?signup=error&e=${problems.join(",")}${ANCHOR}`);
}

function noStore(): Record<string, string> {
  return { "Cache-Control": "no-store" };
}

// ---------------------------------------------------------------------------------------
// GET /take-action/

async function formPage(request: Request, env: Env, url: URL): Promise<Response> {
  // Ask for the whole page every time: a 304 would hand back yesterday's timestamp.
  const headers = new Headers(request.headers);
  headers.delete("if-none-match");
  headers.delete("if-modified-since");
  const asset = await env.ASSETS.fetch(new Request(request.url, { method: request.method, headers }));
  if (asset.status !== 200 || !env.SIGNUP_SECRET) return asset;

  const response = new Response(asset.body, asset);
  response.headers.delete("etag");
  response.headers.delete("last-modified");
  response.headers.set("Cache-Control", "private, no-cache");

  const token = await mintTimestamp(env.SIGNUP_SECRET);
  let rewriter = new HTMLRewriter().on('input[name="t"]', {
    element: (el) => el.setAttribute("value", token),
  });

  const problems = errorsFrom(url);
  if (problems.length) {
    const items = problems
      .map((p) => {
        const message = escape(MESSAGES[p]);
        return (FIELDS as readonly string[]).includes(p) ? `<li><a href="#signup-${p}">${message}</a></li>` : `<li>${message}</li>`;
      })
      .join("");
    rewriter = rewriter
      .on("#signup-alert", { element: (el) => el.removeAttribute("hidden") })
      .on("#signup-alert-list", { element: (el) => el.setInnerContent(items, { html: true }) });
    for (const p of problems) {
      if (!(FIELDS as readonly string[]).includes(p)) continue;
      rewriter = rewriter
        .on(`#${p}-error`, { element: (el) => el.setInnerContent(MESSAGES[p]) })
        .on(`#signup-${p}`, { element: (el) => el.setAttribute("aria-invalid", "true") });
    }
  }
  return rewriter.transform(response);
}

/** The known problem codes named in ?signup=error&e=…, in a fixed order. */
function errorsFrom(url: URL): Problem[] {
  if (url.searchParams.get("signup") !== "error") return [];
  const named = new Set((url.searchParams.get("e") ?? "").split(","));
  const known: Problem[] = [...FIELDS, ...FORM_PROBLEMS];
  const found = known.filter((p) => named.has(p));
  return found.length ? found : ["form"];
}

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ---------------------------------------------------------------------------------------
// The signed timestamp: "<unix seconds>.<HMAC-SHA256 hex>"

const keys = new Map<string, Promise<CryptoKey>>();
function key(secret: string): Promise<CryptoKey> {
  let k = keys.get(secret);
  if (!k) {
    k = crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
    keys.set(secret, k);
  }
  return k;
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const sig = await crypto.subtle.sign("HMAC", await key(secret), new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function mintTimestamp(secret: string): Promise<string> {
  const ts = String(Math.floor(Date.now() / 1000));
  return `${ts}.${await hmacHex(secret, "t:" + ts)}`;
}

async function timestampIsValid(token: string, secret: string): Promise<boolean> {
  const m = /^(\d{10})\.([0-9a-f]{64})$/.exec(token);
  if (!m) return false;
  const sig = new Uint8Array(m[2].match(/../g)!.map((h) => parseInt(h, 16)));
  // verify() compares in constant time.
  const ok = await crypto.subtle.verify("HMAC", await key(secret), sig, new TextEncoder().encode("t:" + m[1]));
  if (!ok) return false;
  const age = Date.now() / 1000 - Number(m[1]);
  return age >= MIN_SECONDS && age <= MAX_AGE_HOURS * 3600;
}

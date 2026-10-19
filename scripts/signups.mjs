// Reads the sign-ups out of D1. Nothing it reads is printed; exports go to a folder
// outside the repository.
//
//   npm run signups:count                 total sign-ups and the newest timestamps
//   npm run signups:export                every row as CSV in ../breakbondsar-work/signup/exports/
//
// Add `-- --local` to read the local test database (.wrangler/test-state) instead of the
// live one. SIGNUPS_EXPORT_DIR overrides the export folder; it may not be inside the repo.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [command, ...flags] = process.argv.slice(2);
const local = flags.includes("--local");
const COLUMNS = ["id", "created_at", "updated_at", "name", "email", "phone", "zip", "interests", "note", "source", "user_agent_hash"];

function query(sql) {
  const where = local ? ["--local", "--env", "test", "--persist-to", ".wrangler/test-state"] : ["--remote"];
  const args = ["wrangler", "d1", "execute", "breakbondsar-signups", ...where, "--json", "--command", sql];
  const win = process.platform === "win32";
  // npx is npx.cmd on Windows and needs a shell there; quote each argument for it.
  const run = spawnSync("npx", win ? args.map((a) => `"${a}"`) : args, { cwd: root, shell: win, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const out = run.stdout ?? "";
  const start = out.indexOf("[");
  if (run.status !== 0 || start < 0) {
    // wrangler's own message (never row data, which only comes back on success).
    console.error((run.stderr || out).trim().split("\n").slice(-12).join("\n"));
    console.error("\nThe query failed. If wrangler is logged out, run `npx wrangler login`.");
    process.exit(1);
  }
  return JSON.parse(out.slice(start))[0].results;
}

if (command === "count") {
  const [r] = query("SELECT COUNT(*) AS total, MAX(created_at) AS newest_signup, MAX(updated_at) AS newest_update FROM signups");
  console.log(`Sign-ups: ${r.total}`);
  console.log(`Newest sign-up: ${r.newest_signup ?? "none"} (UTC)`);
  console.log(`Newest change:  ${r.newest_update ?? "none"} (UTC)`);
} else if (command === "export") {
  const dir = path.resolve(process.env.SIGNUPS_EXPORT_DIR ?? path.join(root, "..", "breakbondsar-work", "signup", "exports"));
  const relative = path.relative(root, dir);
  if (!relative.startsWith("..") && !path.isAbsolute(relative)) {
    console.error(`Refusing to write sign-ups inside the repository (${dir}).`);
    process.exit(1);
  }
  const rows = query(`SELECT ${COLUMNS.join(", ")} FROM signups ORDER BY id`);
  // A cell that opens with = + - @ is a formula to a spreadsheet; a leading ' keeps it text.
  const cell = (v) => {
    let s = v === null || v === undefined ? "" : String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [COLUMNS.join(","), ...rows.map((r) => COLUMNS.map((c) => cell(r[c])).join(","))].join("\r\n") + "\r\n";
  const d = new Date();
  const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `signups-${date}${local ? "-local" : ""}.csv`);
  // A byte-order mark so Excel reads the file as UTF-8.
  fs.writeFileSync(file, "﻿" + csv, "utf8");
  console.log(`Wrote ${rows.length} sign-up(s) to ${file}`);
} else {
  console.error("Usage: node scripts/signups.mjs count|export [--local]");
  process.exit(1);
}

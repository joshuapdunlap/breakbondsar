// Lighthouse CI, desktop then mobile, against the local production preview.
// Chrome comes from $CHROME_PATH or the Chromium that Playwright installed. Both runs
// always happen, so a desktop failure cannot hide the mobile results.
import { spawnSync } from "node:child_process";
import { chromium } from "@playwright/test";

const chromePath = process.env.CHROME_PATH || chromium.executablePath();
// npx is npx.cmd on Windows and needs a shell there; quote the path for spaces.
const win = process.platform === "win32";
const failed = [];
for (const config of ["lighthouserc.json", "lighthouserc.mobile.json"]) {
  const run = spawnSync("npx", ["lhci", "autorun", `--config=${config}`, `--collect.chromePath=${win ? `"${chromePath}"` : chromePath}`], {
    shell: win,
    stdio: "inherit",
    env: { ...process.env, CHROME_PATH: chromePath },
  });
  if (run.status !== 0) failed.push(`${config} (exit ${run.status ?? run.signal})`);
}
if (failed.length) {
  console.error(`Lighthouse CI failed: ${failed.join(", ")}`);
  process.exit(1);
}

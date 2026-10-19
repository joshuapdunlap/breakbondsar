// Waits until a URL answers, for up to five minutes. The tests use it so that
// `wrangler dev` starts only after `astro build` has finished writing dist/.
//   node scripts/wait-for.mjs http://127.0.0.1:4322/
const url = process.argv[2];
const deadline = Date.now() + 300_000;
for (;;) {
  try {
    await fetch(url);
    process.exit(0);
  } catch {
    if (Date.now() > deadline) {
      console.error(`${url} did not answer within five minutes`);
      process.exit(1);
    }
    await new Promise((r) => setTimeout(r, 500));
  }
}

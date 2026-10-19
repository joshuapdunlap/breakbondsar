// Progressive enhancement only. Every page reads and works without this file.
import { FIELDS, MESSAGES, check, type Field } from "../data/signup";

// Copy buttons: shown only when the clipboard is available. They copy the visible text
// of their target and say so in a live region; nothing is sent anywhere.
if (navigator.clipboard?.writeText) {
  document.querySelectorAll<HTMLButtonElement>("[data-copy-target]").forEach((button) => {
    const tools = button.closest<HTMLElement>(".copy-tools");
    if (tools) tools.hidden = false;
    button.addEventListener("click", async () => {
      const target = document.getElementById(button.dataset.copyTarget ?? "");
      const status = document.getElementById(button.dataset.copyStatus ?? "");
      if (!target || !status) return;
      const discussion = target.id === "discussion-prompts";
      const text = discussion
        ? "Break the Bonds | Arkansas\n\n" + [...target.querySelectorAll("li")].map((li) => "• " + li.textContent?.trim()).join("\n\n")
        : [...target.querySelectorAll("p")].map((p) => p.textContent?.trim()).join("\n\n");
      const label = button.querySelector<HTMLElement>(".copy-label");
      try {
        await navigator.clipboard.writeText(text);
        status.textContent = discussion ? "Discussion prompts copied." : "Suggested message copied. Adapt it before sending.";
        if (label) {
          button.dataset.label ??= label.textContent ?? "";
          label.textContent = "Copied";
          button.classList.add("is-copied");
          window.clearTimeout(Number(button.dataset.timer));
          button.dataset.timer = String(
            window.setTimeout(() => {
              label.textContent = button.dataset.label ?? "";
              button.classList.remove("is-copied");
            }, 2500),
          );
        }
      } catch {
        status.textContent = "Copy was unavailable. You can select and copy the text above.";
      }
    });
  });
}

// Print every closed disclosure open, so a printed page carries its source notes.
window.addEventListener("beforeprint", () => {
  document.querySelectorAll<HTMLDetailsElement>("details:not([open])").forEach((d) => {
    d.dataset.printOpened = "";
    d.open = true;
  });
});
window.addEventListener("afterprint", () => {
  document.querySelectorAll<HTMLDetailsElement>("details[data-print-opened]").forEach((d) => {
    delete d.dataset.printOpened;
    d.open = false;
  });
});

// Sign-up form: the Worker checks everything again, and the form works without this.
// With JavaScript the same checks run before sending, so mistakes show at once and what
// was typed stays in place. Messages come from src/data/signup.ts, as the Worker's do.
const signup = document.querySelector<HTMLFormElement>("#signup-form");
if (signup) {
  const alert = document.querySelector<HTMLElement>("#signup-alert");
  const alertList = document.querySelector<HTMLElement>("#signup-alert-list");
  const button = signup.querySelector<HTMLButtonElement>('button[type="submit"]');
  const label = button?.querySelector<HTMLElement>(".signup__label");
  let tried = false;
  let sending = false;

  const control = (f: Field) => signup.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#signup-${f}`);
  const show = (f: Field, problem: boolean) => {
    const input = control(f);
    const error = document.getElementById(`${f}-error`);
    if (!input || !error) return;
    error.textContent = problem ? MESSAGES[f] : "";
    if (problem) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  };
  const problems = () => FIELDS.filter((f) => check(f, control(f)?.value ?? "") !== null);

  // The browser's own bubbles would say it differently; these checks replace them.
  signup.noValidate = true;

  signup.addEventListener("submit", (event) => {
    if (sending) {
      event.preventDefault();
      return;
    }
    tried = true;
    const found = problems();
    FIELDS.forEach((f) => show(f, found.includes(f)));
    if (found.length && alert && alertList) {
      event.preventDefault();
      alertList.replaceChildren(
        ...found.map((f) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = `#signup-${f}`;
          a.textContent = MESSAGES[f];
          a.addEventListener("click", (e) => {
            e.preventDefault();
            control(f)?.focus();
          });
          li.append(a);
          return li;
        }),
      );
      alert.hidden = false;
      alert.focus();
      return;
    }
    sending = true;
    button?.setAttribute("aria-disabled", "true");
    if (label) label.textContent = "Sending";
  });

  // After a first try, each field clears its message as soon as it is fixed.
  FIELDS.forEach((f) =>
    control(f)?.addEventListener("input", () => {
      if (tried) show(f, check(f, control(f)?.value ?? "") !== null);
    }),
  );

  // Coming back from the browser's back button: let the form be sent again.
  window.addEventListener("pageshow", () => {
    sending = false;
    button?.removeAttribute("aria-disabled");
    if (label) label.textContent = "Sign up";
  });

  // Sent back by the Worker with problems: start at the list of them.
  if (alert && !alert.hidden) alert.focus();
}

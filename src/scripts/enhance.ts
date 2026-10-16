// Progressive enhancement only. Every page reads and works without this file.

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

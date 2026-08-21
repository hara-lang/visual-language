const text = (root, selector) => root.querySelector(selector)?.textContent?.trim() ?? "";

function selectedDecision(deck) {
  const button = deck.querySelector("[data-guide-mark][aria-pressed='true']");
  return button?.dataset.guideMark ?? "review-required";
}

function selectedChecks(deck) {
  return [...deck.querySelectorAll("[data-guide-check]")].map((article) => ({
    id: article.dataset.guideCheck ?? "unknown",
    checked: article.querySelector("button")?.getAttribute("aria-pressed") === "true"
  }));
}

function downloadJson(filename, value) {
  const blob = new Blob([`${JSON.stringify(value, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function initialiseGuideReviewExport(root = document) {
  if (!root?.querySelector) return;
  const deck = root.querySelector("[data-guide-review-deck]");
  const evidence = root.querySelector("[data-guide-review-evidence]");
  const exportButton = evidence?.querySelector("[data-guide-export-evidence]");
  const status = evidence?.querySelector("[data-guide-export-evidence-status]");
  if (!deck || !evidence || !(exportButton instanceof HTMLButtonElement)) return;

  exportButton.addEventListener("click", () => {
    const reference = evidence.querySelector("[data-guide-evidence-reference]")?.value.trim() ?? "";
    const reviewer = evidence.querySelector("[data-guide-evidence-reviewer]")?.value.trim() ?? "";
    const notes = evidence.querySelector("[data-guide-evidence-notes]")?.value.trim() ?? "";
    const targetId = text(deck, "[data-guide-target-id]");
    const record = {
      schema: "hara.visual-language.review-evidence",
      schemaVersion: "1.0.0",
      guideRevision: "9a88bddd7a539d7aa790e316ee169e8cc81886a4",
      target: {
        id: targetId,
        label: text(deck, "[data-guide-target-label]"),
        route: text(deck, "[data-guide-target-path]"),
        theme: text(deck, "[data-guide-target-theme]"),
        viewport: text(deck, "[data-guide-target-viewport]"),
        task: text(deck, "[data-guide-target-task]"),
        authority: text(deck, "[data-guide-target-provenance]")
      },
      decision: selectedDecision(deck),
      checks: selectedChecks(deck),
      reference,
      reviewer,
      notes,
      generatedAt: new Date().toISOString(),
      persistence: "local-download-only",
      certification: false
    };
    const safeTarget = targetId.replace(/[^a-z0-9-]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "review-target";
    downloadJson(`hara-v2-review-${safeTarget}.json`, record);
    if (status) status.textContent = `Downloaded ${safeTarget} with ${record.checks.filter(({ checked }) => checked).length}/${record.checks.length} checks marked.`;
  });
}

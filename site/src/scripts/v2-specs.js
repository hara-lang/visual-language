import { checkerResult } from "../lib/v2-specs.mjs";

const statusTone = (status) => ({
  accepted: "success",
  proposed: "signal",
  experimental: "warning",
  draft: "neutral",
  superseded: "muted",
  withdrawn: "error",
  pass: "pass",
  warning: "warning",
  failure: "failure",
  unsupported: "unsupported",
  unavailable: "unavailable",
  error: "error",
  notice: "notice"
}[status] ?? "neutral");

const text = (root, selector, value) => {
  const node = root?.querySelector(selector);
  if (node) node.textContent = value ?? "";
};

const setPressed = (nodes, selected) => {
  for (const node of nodes) node.setAttribute("aria-pressed", node === selected ? "true" : "false");
};

const copyValue = async (button) => {
  const value = button.dataset.copyValue ?? "";
  const original = button.textContent;
  try {
    if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
    await navigator.clipboard.writeText(value);
    button.dataset.copyState = "copied";
    button.textContent = "Copied";
  } catch {
    button.dataset.copyState = "unavailable";
    button.textContent = "Copy unavailable";
  }
  window.setTimeout(() => {
    button.textContent = original;
    delete button.dataset.copyState;
  }, 1600);
};

function initialiseCopyButtons(root) {
  for (const button of root.querySelectorAll("[data-copy-value]")) {
    button.addEventListener("click", () => copyValue(button));
  }
}

function initialiseRegistry(root) {
  const query = root.querySelector("[data-specs-query]");
  const status = root.querySelector("[data-specs-status]");
  const domain = root.querySelector("[data-specs-domain]");
  const rows = [...root.querySelectorAll("[data-spec-row]")];
  const count = root.querySelector("[data-specs-count]");
  const empty = root.querySelector("[data-specs-empty]");
  const table = root.querySelector(".specs-registry-table-wrap");
  const inspector = root.querySelector("[data-specs-inspector]");
  if (!query || !status || !domain || rows.length === 0) return;

  const selectRow = (row) => {
    for (const candidate of rows) {
      const selected = candidate === row;
      candidate.dataset.selected = selected ? "true" : "false";
      candidate.querySelector("[data-spec-select]")?.setAttribute("aria-pressed", selected ? "true" : "false");
    }
    if (!inspector) return;
    text(inspector, "[data-inspector-id]", row.dataset.id);
    text(inspector, "[data-inspector-identifier]", row.dataset.identifier);
    text(inspector, "[data-inspector-title]", row.dataset.title);
    text(inspector, "[data-inspector-summary]", row.dataset.summary);
    text(inspector, "[data-inspector-version]", row.dataset.version);
    text(inspector, "[data-inspector-revision]", row.dataset.revision);
    text(inspector, "[data-inspector-contract]", row.dataset.contract);
    text(inspector, "[data-inspector-source]", row.dataset.source);
    text(inspector, "[data-inspector-receipt]", row.dataset.receipt);
    const badge = inspector.querySelector("[data-inspector-status]");
    if (badge) {
      badge.textContent = row.dataset.status ?? "unknown";
      badge.dataset.tone = statusTone(row.dataset.status);
    }
  };

  const applyFilters = () => {
    const needle = query.value.trim().toLowerCase();
    const statusValue = status.value;
    const domainValue = domain.value;
    let visible = 0;
    for (const row of rows) {
      const matches = (!needle || (row.dataset.search ?? "").includes(needle)) &&
        (statusValue === "all" || row.dataset.status === statusValue) &&
        (domainValue === "all" || row.dataset.domain === domainValue);
      row.hidden = !matches;
      if (matches) visible += 1;
    }
    if (count) count.textContent = `${visible} specification${visible === 1 ? "" : "s"}`;
    if (empty) empty.hidden = visible !== 0;
    if (table) table.hidden = visible === 0;

    const selectedVisible = rows.find((row) => row.dataset.selected === "true" && !row.hidden);
    const firstVisible = rows.find((row) => !row.hidden);
    if (!selectedVisible && firstVisible) selectRow(firstVisible);
  };

  query.addEventListener("input", applyFilters);
  status.addEventListener("change", applyFilters);
  domain.addEventListener("change", applyFilters);

  for (const reset of root.querySelectorAll("[data-specs-reset]")) {
    reset.addEventListener("click", () => {
      query.value = "";
      status.value = "all";
      domain.value = "all";
      applyFilters();
      query.focus();
    });
  }

  rows.forEach((row, index) => {
    const button = row.querySelector("[data-spec-select]");
    button?.addEventListener("click", () => selectRow(row));
    button?.addEventListener("keydown", (event) => {
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const visibleRows = rows.filter((candidate) => !candidate.hidden);
      const current = visibleRows.indexOf(row);
      const targetIndex = event.key === "Home" ? 0 :
        event.key === "End" ? visibleRows.length - 1 :
          event.key === "ArrowDown" ? Math.min(current + 1, visibleRows.length - 1) : Math.max(current - 1, 0);
      const target = visibleRows[targetIndex];
      if (target) {
        selectRow(target);
        target.querySelector("[data-spec-select]")?.focus();
      }
    });
    if (index === 0) selectRow(row);
  });
}

const findingLocation = (finding) => finding.line ? `Line ${finding.line}:${finding.column}` : "No source location";
const findingPath = (finding) => finding.path ?? "No value path";
const severityLabel = (severity) => severity === "error" ? "Error" : severity === "warning" ? "Warning" : "Notice";

function updateFindingInspector(root, finding) {
  const inspector = root.querySelector("[data-finding-inspector]");
  if (!inspector) return;
  text(inspector, "[data-finding-severity]", severityLabel(finding.severity));
  text(inspector, "[data-finding-id]", finding.id);
  text(inspector, "[data-finding-location]", findingLocation(finding));
  text(inspector, "[data-finding-path]", findingPath(finding));
  text(inspector, "[data-finding-message]", finding.message);
}

function findingButton(finding, selected, root) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.finding = "";
  button.setAttribute("aria-pressed", selected ? "true" : "false");

  const badge = document.createElement("span");
  badge.className = "specs-state";
  badge.dataset.tone = statusTone(finding.severity);
  badge.textContent = severityLabel(finding.severity);

  const id = document.createElement("strong");
  id.textContent = finding.id;

  const location = document.createElement("small");
  location.textContent = finding.line ? `${findingLocation(finding)} · ${findingPath(finding)}` : "Checker-level finding";

  const message = document.createElement("p");
  message.textContent = finding.message;

  button.append(badge, id, location, message);
  button.addEventListener("click", () => {
    setPressed(root.querySelectorAll("[data-finding]"), button);
    updateFindingInspector(root.closest(".specs-section") ?? document, finding);
  });
  return button;
}

function initialiseChecker(root) {
  const scenarioButtons = [...root.querySelectorAll("[data-checker-scenario]")];
  const result = root.querySelector("[data-checker-result]");
  const findings = root.querySelector("[data-checker-findings]");
  const form = root.querySelector("[data-checker-form]");
  if (scenarioButtons.length === 0 || !result || !findings) return;

  const renderScenario = (id, selectedButton) => {
    const scenario = checkerResult(id);
    result.dataset.state = scenario.state;
    text(result, "[data-checker-heading]", `${scenario.label}: ${scenario.specification}@${scenario.version}`);
    text(result, "[data-checker-summary]", scenario.summary);
    text(result, "[data-checker-source-label]", scenario.sourceLabel);
    text(result, "[data-checker-source-revision]", scenario.sourceRevision);
    text(result, "[data-checker-spec]", `${scenario.specification}@${scenario.version}`);
    text(result, "[data-checker-spec-revision]", scenario.specRevision);
    text(result, "[data-checker-implementation]", scenario.implementation);
    text(result, "[data-checker-receipt]", scenario.receipt ?? "No receipt produced");
    const state = result.querySelector("[data-checker-state]");
    if (state) {
      state.textContent = scenario.state;
      state.dataset.tone = statusTone(scenario.state);
    }
    const receiptButton = result.querySelector("[data-copy-value]");
    if (receiptButton) receiptButton.dataset.copyValue = scenario.receipt ?? "No receipt produced";

    findings.replaceChildren(...scenario.findings.map((finding, index) => findingButton(finding, index === 0, findings)));
    updateFindingInspector(root, scenario.findings[0]);
    setPressed(scenarioButtons, selectedButton);

    const specification = root.querySelector("[data-checker-specification]");
    const version = root.querySelector("[data-checker-version]");
    if (specification) specification.value = scenario.specification;
    if (version) version.value = scenario.version;
  };

  for (const button of scenarioButtons) {
    button.addEventListener("click", () => renderScenario(button.dataset.checkerScenario ?? "pass", button));
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = scenarioButtons.find((button) => button.getAttribute("aria-pressed") === "true") ?? scenarioButtons[0];
    renderScenario(selected.dataset.checkerScenario ?? "pass", selected);
  });
}

function initialiseProposal(root) {
  const buttons = [...root.querySelectorAll("[data-set-proposal-state]")];
  const status = root.querySelector("[data-proposal-status]");
  if (buttons.length === 0 || !status) return;

  for (const button of buttons) {
    button.addEventListener("click", () => {
      const next = button.dataset.setProposalState ?? "draft";
      setPressed(buttons, button);
      for (const item of root.querySelectorAll("[data-proposal-state]")) {
        item.dataset.current = item.dataset.proposalState === next ? "true" : "false";
      }
      status.textContent = next;
      status.dataset.tone = next === "accepted" || next === "merged" ? "success" :
        next === "changes-requested" ? "warning" : next === "draft" ? "neutral" : "signal";
    });
  }
}

function initialiseDigest(root) {
  const buttons = [...root.querySelectorAll("[data-digest-filter]")];
  const entries = [...root.querySelectorAll(".specs-digest-list > article[data-kind]")];
  for (const button of buttons) {
    button.addEventListener("click", () => {
      const filter = button.dataset.digestFilter ?? "all";
      setPressed(buttons, button);
      for (const entry of entries) entry.hidden = filter !== "all" && entry.dataset.kind !== filter;
    });
  }
}

export function initialiseSpecs(root = document) {
  if (!root?.querySelector) return;
  initialiseCopyButtons(root);
  initialiseRegistry(root);
  initialiseChecker(root);
  initialiseProposal(root);
  initialiseDigest(root);
}

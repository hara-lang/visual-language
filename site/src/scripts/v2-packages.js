import { filterPackages, publishState, releaseScenario } from "../lib/v2-packages.mjs";

const all = (root, selector) => [...root.querySelectorAll(selector)];
const setPressed = (nodes, selected) => {
  for (const node of nodes) node.setAttribute("aria-pressed", node === selected ? "true" : "false");
};

async function copyValue(button) {
  const original = button.textContent;
  try {
    if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
    await navigator.clipboard.writeText(button.dataset.copyValue ?? "");
    button.textContent = "Copied";
    button.dataset.copyState = "copied";
  } catch {
    button.textContent = "Copy unavailable";
    button.dataset.copyState = "unavailable";
  }
  window.setTimeout(() => {
    button.textContent = original;
    delete button.dataset.copyState;
  }, 1600);
}

function initialiseCopy(root) {
  for (const button of all(root, "[data-copy-value]")) button.addEventListener("click", () => copyValue(button));
}

function initialiseDiscovery(root) {
  const query = root.querySelector("[data-package-query]");
  const filters = all(root, "[data-package-filter]");
  const views = all(root, "[data-package-view]");
  const cards = all(root, "[data-package-card]");
  const grid = root.querySelector("[data-package-grid]");
  const count = root.querySelector("[data-package-count]");
  const empty = root.querySelector("[data-package-empty]");
  const resets = all(root, "[data-package-reset]");
  if (!query || !grid || cards.length === 0) return;

  let view = views.find((button) => button.getAttribute("aria-pressed") === "true")?.dataset.packageView ?? "updated";
  const apply = () => {
    const options = { query: query.value, view };
    for (const filter of filters) options[filter.dataset.packageFilter] = filter.value;
    const results = filterPackages(options);
    const byId = new Map(cards.map((card) => [card.dataset.packageCard, card]));
    const visible = new Set(results.map(({ id }) => id));
    for (const card of cards) card.hidden = !visible.has(card.dataset.packageCard);
    for (const item of results) {
      const card = byId.get(item.id);
      if (card) grid.append(card);
    }
    if (count) count.textContent = `${results.length} package${results.length === 1 ? "" : "s"}`;
    if (empty) empty.hidden = results.length !== 0;
  };

  query.addEventListener("input", apply);
  for (const filter of filters) filter.addEventListener("change", apply);
  for (const button of views) button.addEventListener("click", () => {
    view = button.dataset.packageView ?? "updated";
    setPressed(views, button);
    apply();
  });
  for (const reset of resets) reset.addEventListener("click", () => {
    query.value = "";
    for (const filter of filters) filter.value = "all";
    view = "updated";
    const updated = views.find((button) => button.dataset.packageView === "updated");
    if (updated) setPressed(views, updated);
    apply();
    query.focus();
  });

  for (const button of all(root, "[data-package-save], [data-package-follow]")) button.addEventListener("click", () => {
    const active = button.getAttribute("aria-pressed") === "true";
    button.setAttribute("aria-pressed", active ? "false" : "true");
    const inactiveLabel = button.dataset.inactiveLabel ?? "Save";
    const activeLabel = button.dataset.activeLabel ?? "Saved";
    button.textContent = active ? inactiveLabel : activeLabel;
  });
}

function initialiseDiscoveryStates(root) {
  const buttons = all(root, "[data-discovery-state]");
  const panels = all(root, "[data-discovery-panel]");
  if (buttons.length === 0 || panels.length === 0) return;
  for (const button of buttons) button.addEventListener("click", () => {
    setPressed(buttons, button);
    const id = button.dataset.discoveryState;
    for (const panel of panels) panel.hidden = panel.dataset.discoveryPanel !== id;
  });
}

function initialiseReleaseStates(root) {
  const buttons = all(root, "[data-release-scenario]");
  const panels = all(root, "[data-release-panel]");
  const status = root.querySelector("[data-release-state-label]");
  const install = root.querySelector("[data-package-install]");
  if (buttons.length === 0 || panels.length === 0) return;

  const render = (id, selected) => {
    const scenario = releaseScenario(id);
    if (selected) setPressed(buttons, selected);
    for (const panel of panels) panel.hidden = panel.dataset.releasePanel !== scenario.id;
    if (status) {
      status.textContent = scenario.label;
      status.dataset.tone = scenario.tone;
    }
    if (install) install.disabled = !scenario.installAllowed;
  };
  for (const button of buttons) button.addEventListener("click", () => render(button.dataset.releaseScenario ?? "available", button));
}

function initialiseNamespace(root) {
  const query = root.querySelector("[data-namespace-query]");
  const rows = all(root, "[data-symbol-row]");
  const count = root.querySelector("[data-symbol-count]");
  const empty = root.querySelector("[data-symbol-empty]");
  if (!query || rows.length === 0) return;
  const apply = () => {
    const needle = query.value.trim().toLowerCase();
    let visible = 0;
    for (const row of rows) {
      const matches = !needle || (row.dataset.search ?? "").includes(needle);
      row.hidden = !matches;
      if (matches) visible += 1;
    }
    if (count) count.textContent = `${visible} public form${visible === 1 ? "" : "s"}`;
    if (empty) empty.hidden = visible !== 0;
  };
  query.addEventListener("input", apply);
}

function initialisePublish(root) {
  const buttons = all(root, "[data-publish-state]");
  const panels = all(root, "[data-publish-panel]");
  const fields = all(root, "[data-publish-author-field]");
  const status = root.querySelector("[data-publish-state-label]");
  const publish = root.querySelector("[data-publish-action]");
  if (buttons.length === 0 || panels.length === 0) return;

  const render = (id, selected) => {
    const state = publishState(id);
    if (selected) setPressed(buttons, selected);
    for (const panel of panels) panel.hidden = panel.dataset.publishPanel !== state.id;
    for (const field of fields) field.disabled = !state.editable;
    if (status) {
      status.textContent = state.label;
      status.dataset.tone = state.tone;
    }
    if (publish) publish.disabled = !["draft", "checks-failing"].includes(state.state);
  };
  for (const button of buttons) button.addEventListener("click", () => render(button.dataset.publishState ?? "draft", button));
}

function initialiseMaintainer(root) {
  const buttons = all(root, "[data-maintainer-filter]");
  const items = all(root, "[data-maintainer-item]");
  if (buttons.length === 0 || items.length === 0) return;
  for (const button of buttons) button.addEventListener("click", () => {
    setPressed(buttons, button);
    const filter = button.dataset.maintainerFilter ?? "all";
    for (const item of items) item.hidden = filter !== "all" && item.dataset.kind !== filter;
  });
}

export function initialisePackages(root = document) {
  if (!root?.querySelector) return;
  initialiseCopy(root);
  initialiseDiscovery(root);
  initialiseDiscoveryStates(root);
  initialiseReleaseStates(root);
  initialiseNamespace(root);
  initialisePublish(root);
  initialiseMaintainer(root);
}

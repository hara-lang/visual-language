const pressed = (nodes, selected) => {
  for (const node of nodes) node.setAttribute("aria-pressed", node === selected ? "true" : "false");
};

const setText = (root, selector, value) => {
  const node = root?.querySelector(selector);
  if (node) node.textContent = String(value ?? "");
};

function initialiseRouteInventory(root) {
  const query = root.querySelector("[data-guide-route-query]");
  const group = root.querySelector("[data-guide-route-group]");
  const rows = [...root.querySelectorAll("[data-guide-route-row]")];
  const count = root.querySelector("[data-guide-route-count]");
  const empty = root.querySelector("[data-guide-route-empty]");
  const table = root.querySelector(".guide-route-table-wrap");
  if (!query || !group || rows.length === 0) return;

  const apply = () => {
    const needle = query.value.trim().toLowerCase();
    const selectedGroup = group.value;
    let visible = 0;
    for (const row of rows) {
      const matches = (!needle || (row.dataset.search ?? "").includes(needle)) &&
        (selectedGroup === "all" || row.dataset.group === selectedGroup);
      row.hidden = !matches;
      if (matches) visible += 1;
    }
    if (count) count.textContent = `${visible} route${visible === 1 ? "" : "s"}`;
    if (empty) empty.hidden = visible !== 0;
    if (table) table.hidden = visible === 0;
  };

  query.addEventListener("input", apply);
  group.addEventListener("change", apply);
  for (const reset of root.querySelectorAll("[data-guide-route-reset]")) {
    reset.addEventListener("click", () => {
      query.value = "";
      group.value = "all";
      apply();
      query.focus();
    });
  }
}

function applyFrameTheme(frame, theme) {
  try {
    const frameWindow = frame.contentWindow;
    const documentElement = frame.contentDocument?.documentElement;
    if (!frameWindow || !documentElement) return;
    documentElement.dataset.theme = theme;
    documentElement.dataset.themePreference = theme;
    frameWindow.dispatchEvent(new frameWindow.CustomEvent("hara:theme-change", {
      detail: { preference: theme, resolved: theme }
    }));
  } catch {
    // The review route is designed for same-origin frames. A downstream host may
    // block inspection; the frame still remains openable as an exact target.
  }
}

function initialiseReviewDeck(root) {
  const deck = root.querySelector("[data-guide-review-deck]");
  if (!deck) return;

  const routeSelect = deck.querySelector("[data-guide-review-route]");
  const themeButtons = [...deck.querySelectorAll("[data-guide-theme]")];
  const viewportButtons = [...deck.querySelectorAll("[data-guide-viewport]")];
  const frame = deck.querySelector("[data-guide-frame]");
  const frameShell = deck.querySelector("[data-guide-frame-shell]");
  const openRoute = deck.querySelector("[data-guide-open-route]");
  const reload = deck.querySelector("[data-guide-reload]");
  const copy = deck.querySelector("[data-guide-copy-target]");
  const status = deck.querySelector("[data-guide-review-status]");
  const markButtons = [...deck.querySelectorAll("[data-guide-mark]")];
  const checkButtons = [...deck.querySelectorAll("[data-guide-check] button")];
  const resetChecks = deck.querySelector("[data-guide-reset-checks]");
  if (!routeSelect || !(frame instanceof HTMLIFrameElement) || !(frameShell instanceof HTMLElement)) return;

  const selectedOption = () => routeSelect.options[routeSelect.selectedIndex];
  const activeTheme = () => themeButtons.find((button) => button.getAttribute("aria-pressed") === "true")?.dataset.guideTheme ?? "light";
  const activeViewport = () => viewportButtons.find((button) => button.getAttribute("aria-pressed") === "true") ?? viewportButtons[0];

  const reviewTarget = () => {
    const option = selectedOption();
    const viewport = activeViewport();
    const routeId = option?.value ?? "catalogue";
    const viewportId = viewport?.dataset.guideViewport ?? "desktop";
    return {
      id: `${routeId}:${viewportId}:${activeTheme()}`,
      routeId,
      path: option?.dataset.path ?? frame.src,
      label: option?.dataset.label ?? routeId,
      task: option?.dataset.task ?? "",
      provenance: option?.dataset.provenance ?? "",
      viewportId,
      width: Number(viewport?.dataset.width ?? 1440),
      height: Number(viewport?.dataset.height ?? 900),
      viewportLabel: viewport?.querySelector("span")?.textContent ?? viewportId,
      theme: activeTheme()
    };
  };

  const resetDecision = () => {
    const defaultButton = markButtons.find((button) => button.dataset.guideMark === "review-required");
    if (defaultButton) pressed(markButtons, defaultButton);
    if (status) {
      status.textContent = "Review required";
      status.dataset.tone = "warning";
    }
  };

  const updateLedger = () => {
    const target = reviewTarget();
    deck.dataset.route = target.routeId;
    deck.dataset.viewport = target.viewportId;
    deck.dataset.theme = target.theme;
    setText(deck, "[data-guide-target-id]", target.id);
    setText(deck, "[data-guide-target-label]", target.label);
    setText(deck, "[data-guide-target-task]", target.task);
    setText(deck, "[data-guide-target-path]", new URL(target.path, location.href).pathname);
    setText(deck, "[data-guide-target-theme]", target.theme === "dark" ? "Dark" : "Light");
    setText(deck, "[data-guide-target-viewport]", `${target.width} × ${target.height}`);
    setText(deck, "[data-guide-target-provenance]", target.provenance);
    setText(deck, "[data-guide-ruler-label]", `${target.viewportLabel} · ${target.width} × ${target.height}`);
    setText(deck, "[data-guide-ruler-theme]", `${target.theme === "dark" ? "Dark" : "Light"} theme`);
    frameShell.style.setProperty("--guide-frame-width", `${target.width}px`);
    frameShell.style.setProperty("--guide-frame-height", `${target.height}px`);
    if (openRoute) openRoute.href = target.path;
    resetDecision();
  };

  const loadSelectedRoute = () => {
    const target = reviewTarget();
    frame.title = `Live review preview: ${target.label}`;
    frame.src = target.path;
    updateLedger();
  };

  routeSelect.addEventListener("change", loadSelectedRoute);

  for (const button of themeButtons) {
    button.addEventListener("click", () => {
      pressed(themeButtons, button);
      applyFrameTheme(frame, button.dataset.guideTheme ?? "light");
      updateLedger();
    });
  }

  for (const button of viewportButtons) {
    button.addEventListener("click", () => {
      pressed(viewportButtons, button);
      updateLedger();
      frameShell.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
  }

  frame.addEventListener("load", () => applyFrameTheme(frame, activeTheme()));
  reload?.addEventListener("click", () => {
    const target = reviewTarget();
    frame.src = target.path;
    resetDecision();
  });

  copy?.addEventListener("click", async () => {
    const target = reviewTarget();
    const value = `${target.label} · ${new URL(target.path, location.href).pathname} · ${target.theme} · ${target.width}x${target.height}`;
    const original = copy.textContent;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(value);
      copy.textContent = "Copied target";
      copy.dataset.copyState = "copied";
    } catch {
      copy.textContent = "Copy unavailable";
      copy.dataset.copyState = "unavailable";
    }
    window.setTimeout(() => {
      copy.textContent = original;
      delete copy.dataset.copyState;
    }, 1600);
  });

  for (const button of markButtons) {
    button.addEventListener("click", () => {
      pressed(markButtons, button);
      const decision = button.dataset.guideMark ?? "review-required";
      if (!status) return;
      status.textContent = decision === "accepted" ? "Accepted locally" : decision === "needs-work" ? "Needs work" : "Review required";
      status.dataset.tone = decision === "accepted" ? "success" : decision === "needs-work" ? "error" : "warning";
    });
  }

  for (const button of checkButtons) {
    button.addEventListener("click", () => {
      const article = button.closest("[data-guide-check]");
      if (!article) return;
      const checked = button.getAttribute("aria-pressed") === "true";
      button.setAttribute("aria-pressed", checked ? "false" : "true");
      article.dataset.state = checked ? "unchecked" : "checked";
      setText(button, ".guide-check-box", checked ? "○" : "✓");
      setText(button, "small", checked ? "Unchecked" : "Checked locally");
    });
  }

  resetChecks?.addEventListener("click", () => {
    for (const button of checkButtons) {
      button.setAttribute("aria-pressed", "false");
      const article = button.closest("[data-guide-check]");
      if (article) article.dataset.state = "unchecked";
      setText(button, ".guide-check-box", "○");
      setText(button, "small", "Unchecked");
    }
    resetChecks.focus();
  });

  updateLedger();
}

export function initialiseGuide(root = document) {
  if (!root?.querySelector) return;
  initialiseRouteInventory(root);
  initialiseReviewDeck(root);
}

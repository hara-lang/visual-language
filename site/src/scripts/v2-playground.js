const STATE_LABELS = {
  idle: "Idle",
  ready: "Ready",
  running: "Running",
  cancelling: "Cancelling",
  cancelled: "Cancelled",
  restarting: "Restarting",
  replacing: "Replacing",
  blocked: "Backend unavailable",
  disposed: "Disposed"
};

const labelFor = (state) => STATE_LABELS[state] ?? state;
const numberFrom = (value, fallback = 0) => {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};
const all = (scope, selector) => [...scope.querySelectorAll(selector)];
const writeText = (scope, selector, value) => all(scope, selector).forEach((node) => { node.textContent = String(value); });

const activateTab = (tab) => {
  if (!(tab instanceof HTMLElement) || tab.disabled) return;
  const list = tab.closest('[role="tablist"]');
  if (!list) return;
  all(list, ':scope > [role="tab"]').forEach((candidate) => {
    const selected = candidate === tab;
    candidate.setAttribute("aria-selected", selected ? "true" : "false");
    candidate.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(candidate.getAttribute("aria-controls") ?? "");
    if (panel) {
      panel.hidden = !selected;
      panel.dataset.active = selected ? "true" : "false";
      panel.tabIndex = selected ? 0 : -1;
    }
  });
  const value = tab.dataset.value;
  const environment = tab.closest(".hara-tool-environment");
  if (environment && value && list.matches('[data-variant="sections"]')) {
    environment.dataset.activeSection = value;
    environment.querySelector(".hara-tool-environment-stage")?.setAttribute("data-active-section", value);
  }
  if (environment && value && list.matches('[data-variant="groups"]')) {
    environment.querySelector(".hara-tool-capability-content")?.setAttribute("data-active-group", value);
  }
};

const initialiseTabs = (scope) => all(scope, '[role="tablist"]').forEach((list) => {
  if (list.dataset.playgroundReady) return;
  list.dataset.playgroundReady = "true";
  list.addEventListener("click", (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (tab && list.contains(tab)) activateTab(tab);
  });
  list.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    const tabs = all(list, ':scope > [role="tab"]:not(:disabled)');
    const current = event.target.closest('[role="tab"]');
    const index = tabs.indexOf(current);
    if (index < 0 || tabs.length === 0) return;
    event.preventDefault();
    const backwards = event.key === "ArrowLeft" || event.key === "ArrowUp";
    const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (backwards ? -1 : 1) + tabs.length) % tabs.length;
    activateTab(tabs[next]);
    tabs[next].focus();
  });
});

const copyText = async (value) => {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value);
  const field = document.createElement("textarea");
  field.value = value;
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.append(field);
  field.select();
  document.execCommand("copy");
  field.remove();
};

const initialiseCopy = (scope) => all(scope, "[data-copy-value]").forEach((button) => {
  const initial = button.textContent;
  button.addEventListener("click", async () => {
    try {
      await copyText(button.dataset.copyValue ?? "");
      button.textContent = "Copied";
    } catch {
      button.textContent = "Copy failed";
    }
    window.setTimeout(() => { button.textContent = initial; }, 1200);
  });
});

const initialiseLoader = (scope) => {
  const form = scope.querySelector("[data-repository-loader]");
  if (!form) return;
  const status = form.querySelector("[data-loader-status]");
  const message = form.querySelector("[data-loader-message]");
  const render = (state, title, detail) => {
    if (status) status.textContent = title;
    if (message) {
      message.dataset.state = state;
      message.innerHTML = `<strong>${title}</strong><span>${detail}</span>`;
    }
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const revision = String(new FormData(form).get("revision") ?? "requested");
    render("ready", "Exact source loaded.", `Revision ${revision} will create a newly fenced session.`);
  });
  all(form, "[data-loader-state-button]").forEach((button) => button.addEventListener("click", () => {
    if (button.dataset.loaderStateButton === "missing") {
      render("danger", "Revision not found.", "Keep the requested coordinates visible; never silently open latest.");
    } else {
      render("warning", "Sample unavailable.", "The requested runtime capabilities are unavailable in this browser host.");
    }
  }));
};

const initialiseStudio = (root) => {
  if (!root || root.dataset.playgroundInitialised) return;
  root.dataset.playgroundInitialised = "true";
  const editor = root.querySelector("[data-playground-editor]");
  const initialSource = editor?.value ?? "";
  const runtime = {
    state: "ready",
    generation: numberFrom(root.querySelector("[data-session-generation]")?.textContent, 4),
    sourceRevision: "9f3c2ab7",
    sequence: numberFrom(root.dataset.eventSequence, 148),
    sessionId: "pg-7a91",
    receipt: 2048,
    disposed: false,
    timer: null
  };
  const runButton = root.querySelector(".playground-run");
  const cancelButton = root.querySelector(".playground-cancel");
  const backend = root.querySelector("[data-backend-request]");
  const result = root.querySelector("[data-run-result]");
  const eventLog = root.querySelector("[data-event-log]");

  const sync = () => {
    root.dataset.runtimeState = runtime.state;
    root.dataset.eventSequence = String(runtime.sequence);
    writeText(root, "[data-runtime-state-label]", labelFor(runtime.state));
    writeText(root, "[data-session-generation]", runtime.generation);
    writeText(root, "[data-source-revision]", runtime.sourceRevision);
    writeText(root, "[data-event-sequence-value]", runtime.sequence);
    writeText(root, "[data-session-id-value]", runtime.sessionId);
    all(root, ".playground-runtime-summary > span, .hara-tool-status-primary > span").forEach((node) => { node.dataset.state = runtime.state; });
    const busy = ["running", "cancelling", "restarting", "replacing"].includes(runtime.state);
    if (runButton) runButton.disabled = runtime.disposed || busy || backend?.value === "hbc";
    if (cancelButton) cancelButton.disabled = runtime.disposed || runtime.state !== "running";
  };
  const appendEvent = (kind, summary, meta) => {
    runtime.sequence += 1;
    const item = document.createElement("li");
    item.innerHTML = `<code>${runtime.sequence}</code><span>${kind}</span><strong>${summary}</strong><small>${meta}</small>`;
    eventLog?.append(item);
    while (eventLog && eventLog.children.length > 8) eventLog.firstElementChild?.remove();
    sync();
  };
  const changeState = (state) => { runtime.state = state; sync(); };
  const clearTimer = () => {
    if (runtime.timer !== null) window.clearTimeout(runtime.timer);
    runtime.timer = null;
  };
  const run = () => {
    if (runtime.disposed || runtime.state === "running") return;
    if (backend?.value === "hbc") {
      changeState("blocked");
      appendEvent("capability.denied", "HBC backend unavailable", `source ${runtime.sourceRevision}`);
      if (result) result.textContent = `{:status :unavailable\n :requested-backend :hbc\n :actual-backend nil\n :fallback :forbidden}`;
      return;
    }
    clearTimer();
    changeState("running");
    appendEvent("lifecycle", "evaluation accepted", `generation ${runtime.generation}`);
    if (result) result.textContent = `{:status :running\n :backend :interpreter}`;
    runtime.timer = window.setTimeout(() => {
      runtime.timer = null;
      runtime.receipt += 1;
      changeState("ready");
      appendEvent("runtime.receipt", `exec-${runtime.receipt} committed`, `source ${runtime.sourceRevision}`);
      if (result) result.textContent = `{:status :ready\n :backend :interpreter\n :frames 2862\n :receipt "runtime:exec-${runtime.receipt}"}`;
    }, 420);
  };
  const cancel = () => {
    if (runtime.state !== "running" || runtime.disposed) return;
    clearTimer();
    changeState("cancelling");
    appendEvent("lifecycle", "cancellation requested", `generation ${runtime.generation}`);
    window.setTimeout(() => {
      changeState("cancelled");
      appendEvent("lifecycle", "cancelled terminally", `source ${runtime.sourceRevision}`);
      if (result) result.textContent = `{:status :cancelled\n :terminal true}`;
    }, 120);
  };
  const restart = () => {
    if (runtime.disposed) return;
    clearTimer();
    runtime.generation += 1;
    changeState("restarting");
    appendEvent("lifecycle", "restart fenced", `generation ${runtime.generation}`);
    window.setTimeout(() => { changeState("ready"); appendEvent("lifecycle", "generation ready", `generation ${runtime.generation}`); }, 180);
  };
  const replace = () => {
    if (runtime.disposed) return;
    clearTimer();
    changeState("replacing");
    appendEvent("lifecycle", "replacement requested", `source ${runtime.sourceRevision}`);
    window.setTimeout(() => {
      runtime.sessionId = "pg-b41f";
      runtime.generation = 1;
      runtime.sourceRevision = "9f3c2ab7";
      changeState("ready");
      appendEvent("lifecycle", "new session ready", `session ${runtime.sessionId}`);
    }, 220);
  };
  const dispose = () => {
    if (runtime.disposed) return;
    clearTimer();
    runtime.disposed = true;
    changeState("disposed");
    appendEvent("lifecycle", "session disposed", `session ${runtime.sessionId}`);
  };
  const reset = () => {
    if (runtime.disposed) return;
    if (editor) editor.value = initialSource;
    restart();
  };

  runButton?.addEventListener("click", run);
  cancelButton?.addEventListener("click", cancel);
  root.querySelector(".playground-restart")?.addEventListener("click", restart);
  root.querySelector(".playground-reset")?.addEventListener("click", reset);
  root.querySelector("[data-replace-session]")?.addEventListener("click", replace);
  root.querySelector("[data-dispose-session]")?.addEventListener("click", dispose);
  backend?.addEventListener("change", () => {
    writeText(root, "[data-backend-actual]", backend.value === "hbc" ? "actual · unavailable" : "actual · interpreter");
    writeText(root, "[data-backend-status]", backend.value === "hbc" ? "unavailable" : "interpreter");
    changeState(backend.value === "hbc" ? "blocked" : "ready");
  });

  const environment = root.querySelector(".hara-tool-environment");
  const rightPane = root.querySelector(".hara-tool-workbench-right");
  root.querySelector(".playground-control-pane-toggle")?.addEventListener("click", (event) => {
    const collapsed = environment?.dataset.controlPane !== "collapsed";
    if (environment) environment.dataset.controlPane = collapsed ? "collapsed" : "open";
    if (rightPane) rightPane.hidden = collapsed;
    event.currentTarget.setAttribute("aria-expanded", collapsed ? "false" : "true");
  });

  all(root, "[data-studio-mode]").forEach((button) => button.addEventListener("click", () => {
    all(root, "[data-studio-mode]").forEach((candidate) => candidate.setAttribute("aria-pressed", candidate === button ? "true" : "false"));
    const mode = button.dataset.studioMode;
    if (mode === "console") {
      root.querySelector("[data-console-surface]")?.setAttribute("data-collapsed", "false");
      return;
    }
    const tab = root.querySelector(`.hara-tool-section-tabs [role="tab"][data-value="${mode}"]`);
    if (tab) activateTab(tab);
  }));

  const consoleSurface = root.querySelector("[data-console-surface]");
  root.querySelector("[data-console-collapse]")?.addEventListener("click", (event) => {
    const collapsed = consoleSurface?.dataset.collapsed !== "true";
    if (consoleSurface) consoleSurface.dataset.collapsed = collapsed ? "true" : "false";
    event.currentTarget.setAttribute("aria-expanded", collapsed ? "false" : "true");
    event.currentTarget.textContent = collapsed ? "Expand" : "Collapse";
  });
  root.querySelector("[data-console-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const command = String(new FormData(event.currentTarget).get("command") ?? "").trim();
    if (command && !runtime.disposed) appendEvent("runtime.value", `${command} → 12`, `generation ${runtime.generation}`);
  });

  const palette = root.querySelector("[data-command-palette]");
  const paletteButton = root.querySelector(".playground-command-palette");
  const openPalette = () => { if (palette) palette.hidden = false; palette?.querySelector("input")?.focus(); };
  const closePalette = () => { if (palette) palette.hidden = true; };
  paletteButton?.addEventListener("click", () => palette?.hidden ? openPalette() : closePalette());
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") { event.preventDefault(); run(); }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); openPalette(); }
    if (event.key === "Escape") palette && !palette.hidden ? closePalette() : cancel();
  });
  sync();
};

const initialiseDensity = (scope) => all(scope, "[data-density-mode]").forEach((button) => button.addEventListener("click", () => {
  scope.querySelector("[data-playground-studio]")?.setAttribute("data-density", button.dataset.densityMode ?? "comfortable");
  all(scope, "[data-density-mode]").forEach((candidate) => candidate.setAttribute("aria-pressed", candidate === button ? "true" : "false"));
}));

const initialiseInlineEmbed = (root) => {
  if (!root) return;
  let timer = null;
  let generation = 1;
  const render = (state, result) => {
    root.dataset.runtimeState = state;
    const label = root.querySelector("[data-embed-state]");
    if (label) label.innerHTML = `<i></i>${labelFor(state)}`;
    if (result) root.querySelector("[data-embed-result]").textContent = result;
    root.querySelector("[data-embed-run]").disabled = state === "running";
    root.querySelector("[data-embed-cancel]").disabled = state !== "running";
  };
  root.querySelector("[data-embed-run]")?.addEventListener("click", () => {
    if (timer !== null) window.clearTimeout(timer);
    render("running", `{:status :running\n :generation ${generation}}`);
    timer = window.setTimeout(() => { timer = null; render("ready", `{:status :ready\n :result {:ribbons 12}\n :receipt "runtime:inline-${generation}"}`); }, 300);
  });
  root.querySelector("[data-embed-cancel]")?.addEventListener("click", () => { if (timer !== null) window.clearTimeout(timer); timer = null; render("cancelled", `{:status :cancelled}`); });
  root.querySelector("[data-embed-restart]")?.addEventListener("click", () => { generation += 1; render("ready", `{:status :ready\n :generation ${generation}}`); });
};

const initialiseExpandedEmbed = (root) => {
  if (!root) return;
  const pane = root.querySelector(".hara-tool-workbench-right");
  const environment = root.querySelector(".hara-tool-environment");
  const toggle = root.querySelector(".playground-embed-pane-toggle");
  if (pane) pane.hidden = true;
  toggle?.addEventListener("click", () => {
    if (!pane) return;
    pane.hidden = !pane.hidden;
    if (environment) environment.dataset.controlPane = pane.hidden ? "collapsed" : "open";
    toggle.setAttribute("aria-expanded", pane.hidden ? "false" : "true");
  });
};

const initialiseMobile = (root) => {
  if (!root) return;
  const editor = root.querySelector("[data-mobile-editor]");
  const result = root.querySelector("[data-mobile-result]");
  const sequence = root.querySelector("[data-mobile-sequence]");
  let seq = numberFrom(sequence?.textContent, 148);
  let timer = null;
  const render = (state) => {
    root.dataset.mobileState = state;
    root.querySelector("[data-mobile-runtime-state]").textContent = labelFor(state);
    root.querySelector("[data-mobile-run]").disabled = state === "running";
    root.querySelector("[data-mobile-cancel]").disabled = state !== "running";
  };
  const runMobile = () => {
    if (timer !== null) window.clearTimeout(timer);
    seq += 1;
    if (sequence) sequence.textContent = String(seq);
    render("running");
    if (result) result.textContent = `{:status :running\n :source "9f3c2ab7"}`;
    // Intentionally no focus call: Run must not summon the software keyboard.
    timer = window.setTimeout(() => {
      timer = null;
      seq += 1;
      if (sequence) sequence.textContent = String(seq);
      render("ready");
      if (result) result.textContent = `{:ribbons 12\n :frames 2862\n :status :ready}`;
    }, 320);
  };
  root.querySelector("[data-mobile-run]")?.addEventListener("click", runMobile);
  root.querySelector("[data-mobile-cancel]")?.addEventListener("click", () => { if (timer !== null) window.clearTimeout(timer); timer = null; render("cancelled"); });
  const edit = root.querySelector("[data-mobile-edit]");
  edit?.addEventListener("click", () => {
    if (!editor) return;
    editor.readOnly = false;
    root.dataset.mobileEditing = "true";
    root.querySelector("[data-mobile-readonly]").textContent = "Editing · keyboard requested explicitly";
    edit.setAttribute("aria-pressed", "true");
    editor.focus();
  });
};

export function initialisePlayground() {
  const scope = document.querySelector(".hara-v2-playground");
  if (!scope) return;
  initialiseTabs(scope);
  initialiseCopy(scope);
  initialiseLoader(scope);
  initialiseStudio(scope.querySelector("[data-playground-studio]"));
  initialiseDensity(scope);
  initialiseInlineEmbed(scope.querySelector("[data-inline-embed]"));
  initialiseExpandedEmbed(scope.querySelector("[data-expanded-embed]"));
  initialiseMobile(scope.querySelector("[data-mobile-playground]"));
}

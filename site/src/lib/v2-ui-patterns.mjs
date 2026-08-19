// @ts-check

/** @typedef {"initial" | "active" | "loading" | "empty" | "partial" | "success" | "warning" | "error" | "offline" | "readonly"} UiState */

/**
 * @typedef {object} PatternFamily
 * @property {string} id
 * @property {string} label
 * @property {string} summary
 * @property {string[]} patterns
 * @property {string[]} nonNegotiables
 */

/**
 * @typedef {object} WorkflowStage
 * @property {string} id
 * @property {string} label
 * @property {UiState} state
 * @property {string} description
 * @property {string} keyboard
 * @property {string} touch
 */

/**
 * @typedef {object} WorkflowStudy
 * @property {string} id
 * @property {string} label
 * @property {string} summary
 * @property {string[]} products
 * @property {WorkflowStage[]} stages
 * @property {UiState[]} requiredStates
 */

/** @type {PatternFamily[]} */
export const uiPatternFamilies = [
  {
    id: "navigation",
    label: "Navigation and discovery",
    summary: "Move from a broad Hara surface to one exact object without flattening catalogue, product, page, and local context into one menu.",
    patterns: ["catalogue disclosure", "product context navigation", "breadcrumbs", "tabs", "sidebar", "search", "filters", "result count", "pagination", "command palette"],
    nonNegotiables: ["current location is explicit", "keyboard and touch paths are equivalent", "empty filters are distinguishable from empty products"]
  },
  {
    id: "mutation",
    label: "Forms and mutation",
    summary: "Carry a user from a reversible draft through validation, preview, submission, review, and an inspectable receipt.",
    patterns: ["draft form", "inline validation", "summary validation", "autosave", "unsaved changes", "preview", "destructive confirmation", "optimistic update", "rollback", "receipt"],
    nonNegotiables: ["the primary action names the consequence", "controlled fields are visibly locked", "success produces durable evidence"]
  },
  {
    id: "content-state",
    label: "Data and content states",
    summary: "Represent absence, delay, staleness, degradation, failure, and recovery as first-class interface states rather than blank panels.",
    patterns: ["skeleton", "progress", "first-use empty", "filtered empty", "partial data", "stale data", "success", "recoverable warning", "fatal failure", "read-only degradation", "offline", "reconnecting"],
    nonNegotiables: ["no state depends on colour alone", "the next safe action remains visible", "source age and confidence are explicit"]
  },
  {
    id: "identity",
    label: "Identity and permission",
    summary: "Show who is acting, what authority they have, and when automation is operating on behalf of an accountable owner.",
    patterns: ["anonymous", "signed in", "account switch", "insufficient permission", "suspended", "revoked", "owner", "maintainer", "reviewer", "contributor", "owned bot"],
    nonNegotiables: ["identity is visible at mutation boundaries", "roles describe authority rather than prestige", "bots always expose an owner and purpose"]
  },
  {
    id: "responsive-input",
    label: "Responsive and input behaviour",
    summary: "Preserve the primary task while rails, inspectors, density, shortcuts, and motion yield to viewport and input constraints.",
    patterns: ["desktop composition", "tablet collapse", "narrow mobile", "touch targets", "keyboard traversal", "shortcut hints", "focus return", "reduced motion", "explicit editor focus"],
    nonNegotiables: ["primary content survives every collapse", "touch targets remain operable", "mobile never summons an editor keyboard before an explicit edit action"]
  }
];

/** @type {WorkflowStudy[]} */
export const workflowStudies = [
  {
    id: "search-inspect",
    label: "Search → filter → select → inspect",
    summary: "A discovery flow shared by Docs, Specs, Packages, World, and Learn without sharing their ranking or domain rules.",
    products: ["Docs", "Specs", "Packages", "World", "Learn"],
    requiredStates: ["initial", "loading", "empty", "partial", "success", "error"],
    stages: [
      { id: "search", label: "Search", state: "initial", description: "Enter a broad term while the interface preserves recent and suggested scopes.", keyboard: "/ focuses search; Escape returns focus", touch: "Search is a full-width, 44px target on narrow screens" },
      { id: "filter", label: "Filter", state: "active", description: "Narrow by type, status, runtime, source, or ownership without losing the query.", keyboard: "Arrow keys move within a filter group", touch: "Filters wrap into a labelled disclosure" },
      { id: "select", label: "Select", state: "success", description: "Choose one result with its source, status, and exact identifier visible.", keyboard: "Enter selects; Space toggles multi-select where supported", touch: "Whole result row is selectable without hiding links" },
      { id: "inspect", label: "Inspect", state: "active", description: "Open detail beside the list on wide screens or as the next view on narrow screens.", keyboard: "Focus moves to the inspector heading and returns on close", touch: "Inspector becomes a full-width view with a Back action" }
    ]
  },
  {
    id: "draft-publish",
    label: "Create draft → validate → preview → submit → receipt",
    summary: "A mutation flow shared by package publishing, specification proposals, feed submissions, and lesson authoring.",
    products: ["Specs", "Packages", "World", "Learn"],
    requiredStates: ["initial", "active", "warning", "error", "success"],
    stages: [
      { id: "draft", label: "Draft", state: "active", description: "Editable fields are separated from generated and reviewer-controlled facts.", keyboard: "Tab order follows the visible form; Ctrl/Cmd+S saves", touch: "One column; generated facts follow editable fields" },
      { id: "validate", label: "Validate", state: "warning", description: "Inline messages sit beside fields and a summary links to every blocking issue.", keyboard: "Submit moves focus to the first blocking issue", touch: "Errors do not disappear behind the virtual keyboard" },
      { id: "preview", label: "Preview", state: "success", description: "Show the public rendering, machine metadata, route, and consequence before mutation.", keyboard: "Preview tabs preserve focus and selected state", touch: "Preview mode is explicit rather than a side-by-side squeeze" },
      { id: "submit", label: "Submit", state: "loading", description: "A single named action creates the proposal or publication request and prevents duplicate mutation.", keyboard: "Button remains focusable and announces busy state", touch: "Transport feedback remains beside the initiating action" },
      { id: "receipt", label: "Receipt", state: "success", description: "Return exact revision, status, next reviewer action, and a stable link.", keyboard: "Receipt heading receives focus", touch: "Copy and open actions remain 44px targets" }
    ]
  },
  {
    id: "session-recovery",
    label: "Load session → edit → run → observe → recover",
    summary: "The shared lifecycle beneath Playground and embedded Hara examples, including fenced revisions and capability-driven degradation.",
    products: ["Playground", "Docs", "Learn"],
    requiredStates: ["loading", "active", "success", "error", "offline", "readonly"],
    stages: [
      { id: "load", label: "Load", state: "loading", description: "Resolve repository, revision, session identity, backend, and declared capabilities.", keyboard: "Cancel remains reachable during load", touch: "No automatic editor focus" },
      { id: "edit", label: "Edit", state: "active", description: "Source changes increment the local revision while preserving the last successful result.", keyboard: "Explicit editor shortcut; Escape returns to chrome", touch: "Edit must be deliberately entered" },
      { id: "run", label: "Run", state: "loading", description: "Run is fenced by session, generation, and source revision; duplicate requests are ignored.", keyboard: "Ctrl/Cmd+Enter runs; transport controls are labelled", touch: "Run and Stop remain primary-sized controls" },
      { id: "observe", label: "Observe", state: "success", description: "Results, diagnostics, events, and backend-specific observations share one lifecycle envelope.", keyboard: "Output and diagnostics are landmarked", touch: "Result precedes optional inspectors" },
      { id: "recover", label: "Recover", state: "error", description: "Restart, reconnect, reset, or continue read-only according to explicit capabilities.", keyboard: "Focus moves to the recovery summary", touch: "The safest recovery action is first and fully named" }
    ]
  },
  {
    id: "feed-comment",
    label: "Browse feed → open thread → comment → published state",
    summary: "A social flow that preserves canonical sources, comment identity, moderation state, and bot ownership.",
    products: ["World"],
    requiredStates: ["loading", "empty", "partial", "active", "success", "error"],
    stages: [
      { id: "browse", label: "Browse", state: "active", description: "Ranked items retain source, age, type, moderation, and comment count.", keyboard: "J/K may move between stories without replacing normal tab order", touch: "Cards avoid swipe-only actions" },
      { id: "thread", label: "Open thread", state: "success", description: "The canonical article remains external while World owns the durable discussion.", keyboard: "Thread heading receives focus after navigation", touch: "Nested replies flatten progressively" },
      { id: "comment", label: "Comment", state: "active", description: "The composer shows the acting user or owned bot, preview, and publication consequence.", keyboard: "Preview and publish have separate controls", touch: "Composer never traps focus behind an overlay keyboard" },
      { id: "published", label: "Published", state: "success", description: "The comment appears in context with exact identity, timestamp, permalink, and moderation status.", keyboard: "Published comment receives programmatic focus", touch: "Receipt and undo remain adjacent" }
    ]
  },
  {
    id: "evidence-share",
    label: "Compare evidence → change tab → share exact view",
    summary: "A dense evidence flow for Benchmarks, Specs, and Packages that preserves filters and exact revision in the shared link.",
    products: ["Benchmarks", "Specs", "Packages"],
    requiredStates: ["initial", "loading", "partial", "success", "warning", "error"],
    stages: [
      { id: "compare", label: "Compare", state: "active", description: "Select records with compatible context and expose incomparable rows rather than hiding them.", keyboard: "Tables preserve header association and row selection", touch: "A card/list alternative precedes horizontal overflow" },
      { id: "tab", label: "Change view", state: "active", description: "Switch summary, samples, methodology, compatibility, or history without losing selection.", keyboard: "Arrow-key tab semantics and visible focus", touch: "Tab strip scrolls with visible selected state" },
      { id: "share", label: "Share exact view", state: "success", description: "Encode filters, selection, revision, and view mode in a stable, inspectable URL.", keyboard: "Copy action announces completion", touch: "Copied state is textual and temporary" }
    ]
  }
];

export const interfaceStates = [
  { id: "loading", label: "Loading", tone: "signal", cue: "Progress + object name", summary: "Reserve expected geometry, name the object being loaded, and keep cancellation available when meaningful.", action: "Cancel load" },
  { id: "empty-first-use", label: "First-use empty", tone: "neutral", cue: "Purpose + first action", summary: "Explain what will live here and offer one safe starting action without pretending data is missing.", action: "Create first draft" },
  { id: "empty-filtered", label: "No filtered results", tone: "neutral", cue: "Query + active filters", summary: "Preserve the query, show which filters removed results, and make clearing them reversible.", action: "Clear status filter" },
  { id: "partial", label: "Partial data", tone: "warning", cue: "Coverage + missing sources", summary: "Render trusted available data while marking omitted sources and preventing false completeness.", action: "Inspect coverage" },
  { id: "stale", label: "Stale data", tone: "warning", cue: "Age + last exact revision", summary: "Keep the last known result readable, identify its age, and separate refresh from destructive replacement.", action: "Refresh index" },
  { id: "success", label: "Success receipt", tone: "success", cue: "Result + exact receipt", summary: "Name what changed, show the resulting status and revision, and provide stable next actions.", action: "Open receipt" },
  { id: "recoverable", label: "Recoverable failure", tone: "warning", cue: "Cause + safe retry", summary: "Keep user input and selection intact, state what failed, and offer the narrowest recovery.", action: "Retry validation" },
  { id: "fatal", label: "Fatal failure", tone: "danger", cue: "Boundary + support evidence", summary: "Stop unsafe mutation, preserve a copyable diagnostic receipt, and provide a route back to a stable surface.", action: "Copy diagnostic" },
  { id: "readonly", label: "Degraded read-only", tone: "neutral", cue: "Capability loss + preserved access", summary: "Keep inspection available when mutation or execution is unavailable, and say exactly which capability is missing.", action: "Continue read-only" },
  { id: "offline", label: "Offline / reconnecting", tone: "signal", cue: "Connection + queued work", summary: "Distinguish unsent local work from confirmed server state and never imply publication before acknowledgement.", action: "Review queued change" }
];

export const identityStates = [
  { id: "anonymous", label: "Anonymous", authority: "Read, run, and draft locally", evidence: "No server mutation; temporary session only" },
  { id: "signed-in", label: "Signed in", authority: "Save, follow, comment, and submit", evidence: "Current GitHub/Hara subject is visible" },
  { id: "switching", label: "Switching account", authority: "Mutation paused until identity is chosen", evidence: "Unsaved work remains local and attributed to nobody" },
  { id: "contributor", label: "Contributor", authority: "Propose changes and respond to review", evidence: "Merged contribution or accepted proposal record" },
  { id: "reviewer", label: "Reviewer", authority: "Request changes or accept within a declared scope", evidence: "Repository/spec/package review role" },
  { id: "maintainer", label: "Maintainer", authority: "Publish and administer owned packages or namespaces", evidence: "Registry-backed stewardship record" },
  { id: "owner", label: "Owner", authority: "Manage identity, source, and automation boundaries", evidence: "Verified account or organization ownership" },
  { id: "insufficient", label: "Insufficient permission", authority: "Read and prepare a proposal", evidence: "Required role and request path are explicit" },
  { id: "suspended", label: "Suspended / revoked", authority: "Read only; mutation disabled", evidence: "Reason, effective time, and appeal/recovery path" },
  { id: "owned-bot", label: "User-owned bot", authority: "Narrow declared actions while owner policy permits", evidence: "Bot purpose, sources, receipts, and accountable owner" }
];

export const responsiveContracts = [
  { id: "desktop", label: "Desktop", width: "1280+", primary: "Main task plus supporting rail and inspector", collapse: "No collapse; secondary regions remain subordinate", targets: "34px comfortable controls; 30px dense tool controls" },
  { id: "tablet", label: "Tablet", width: "681–1024", primary: "Main task and one supporting region", collapse: "Inspector becomes drawer or below-content detail before the navigation rail yields", targets: "40px minimum high-frequency touch controls" },
  { id: "mobile", label: "Mobile", width: "320–680", primary: "One task, one column, explicit mode changes", collapse: "Inspector → sidebar → context actions; product header remains compact", targets: "44px primary touch actions; no autofocus into editors" },
  { id: "keyboard", label: "Keyboard", width: "All", primary: "Semantic traversal plus optional shortcuts", collapse: "Shortcuts never replace focusable controls", targets: "Visible focus; Escape closes and returns focus" },
  { id: "reduced-motion", label: "Reduced motion", width: "All", primary: "Immediate state change with textual continuity", collapse: "Ambient motion removed; progress becomes static or discrete", targets: "No meaning depends on animation" }
];

export const ownershipBoundaries = [
  { layer: "Shared UI contract", owns: "focus, selected/disabled/busy semantics, validation placement, receipts, state vocabulary, responsive collapse order, touch targets, reduced motion", doesNotOwn: "package policy, ranking, reviewer authority, curriculum rules, runtime capability truth" },
  { layer: "Product composition", owns: "information architecture, realistic fields, domain filters, business rules, source evidence, moderation and review policy", doesNotOwn: "protected tokens, foundational control geometry, global catalogue routes" },
  { layer: "Runtime or server", owns: "permissions, exact revision, capabilities, publication status, receipts, source freshness and durable mutation", doesNotOwn: "invented client-side success or silent fallback" },
  { layer: "Laboratory framing", owns: "annotations, state comparison, viewport frames, adoption notes and review controls", doesNotOwn: "new public component behaviour without a package contract" }
];

export const allWorkflowStages = workflowStudies.flatMap((workflow) => workflow.stages.map((stage) => ({
  ...stage,
  workflowId: workflow.id
})));

/** @param {string} id */
export function workflowById(id) {
  return workflowStudies.find((workflow) => workflow.id === id);
}

import {
  haraGlyphCatalog,
  haraGlyphNames,
  haraIconCatalog,
  haraIconNames
} from "../../../src/icons.mjs";

export const iconFixtureNotice = {
  id: "hara-v2-icons-2026-08",
  label: "Original Hara geometry",
  revision: "icons:6ad3e21f",
  productionAuthority: false,
  summary: "The guide reviews deterministic icon geometry and semantic composition. Products and runtimes remain authoritative for commands, capability state, evidence and product status."
};

export const iconSizeScale = [16, 20, 24, 32, 48];

export const iconGroups = [
  {
    id: "navigation",
    label: "Navigation and disclosure",
    description: "Movement, route discovery, search, filters and disclosure controls.",
    names: haraIconNames.filter((name) => haraIconCatalog[name].category === "navigation")
  },
  {
    id: "action",
    label: "Actions and editing",
    description: "Commands that mutate, inspect, publish, transfer or repeat work.",
    names: haraIconNames.filter((name) => haraIconCatalog[name].category === "action")
  },
  {
    id: "state",
    label: "State symbols",
    description: "Current, pending, warning, failure, availability and lifecycle meaning.",
    names: haraIconNames.filter((name) => haraIconCatalog[name].category === "state")
  },
  {
    id: "evidence",
    label: "Evidence semantics",
    description: "Missing, measured zero and unsupported are intentionally different facts.",
    names: haraIconNames.filter((name) => haraIconCatalog[name].category === "evidence")
  }
];

export const stateExamples = [
  { icon: "success", state: "success", label: "Current and passing", evidence: "checker:accepted@204", meaning: "The cited check passed for the exact revision." },
  { icon: "pending", state: "pending", label: "Pending", evidence: "run:queued@205", meaning: "Work has not reached a terminal result." },
  { icon: "warning", state: "warning", label: "Warning", evidence: "compat:partial@18", meaning: "The surface remains usable with explicit caution." },
  { icon: "error", state: "error", label: "Failed", evidence: "run:failed@206", meaning: "A terminal failure receipt exists." },
  { icon: "unavailable", state: "unavailable", label: "Unavailable", evidence: "network:none", meaning: "The path cannot currently complete; execution may still have succeeded." },
  { icon: "partial", state: "partial", label: "Partial", evidence: "target:wasm@9", meaning: "Only a declared subset is supported." },
  { icon: "stale", state: "stale", label: "Stale", evidence: "snapshot:17", meaning: "The fact was valid for an older source revision." },
  { icon: "external-state", state: "external", label: "External authority", evidence: "github:@mina", meaning: "Identity or evidence is controlled outside this product." },
  { icon: "proposed", state: "proposed", label: "Proposed", evidence: "proposal:42", meaning: "Planned behavior must not be presented as current." },
  { icon: "historical", state: "historical", label: "Historical", evidence: "study:2026-07", meaning: "Retained for comparison but no longer the primary contract." },
  { icon: "locked", state: "locked", label: "Locked", evidence: "policy:maintainers", meaning: "The action requires a role or authority boundary." }
];

export const evidenceExamples = [
  { icon: "missing", state: "missing", label: "Missing", value: "—", meaning: "No measurement or fact was supplied." },
  { icon: "zero", state: "zero", label: "Measured zero", value: "0", meaning: "A valid measurement exists and equals zero." },
  { icon: "unsupported", state: "unsupported", label: "Unsupported", value: "N/A", meaning: "The target does not implement this capability or comparison." },
  { icon: "unavailable", state: "unavailable", label: "Unavailable", value: "offline", meaning: "The fact may exist, but cannot be obtained now." },
  { icon: "error", state: "error", label: "Failed", value: "error", meaning: "The attempt reached a terminal failure." }
];

export const capabilityStates = [
  { id: "available", label: "Available", icon: "success", description: "The host advertises the capability." },
  { id: "requested", label: "Requested", icon: "pending", description: "The product requested it but attachment is not complete." },
  { id: "attached", label: "Attached", icon: "success", description: "The capability is active for the exact session generation." },
  { id: "degraded", label: "Degraded", icon: "warning", description: "The capability is active with reduced guarantees." },
  { id: "denied", label: "Denied", icon: "locked", description: "Policy or user authority rejected attachment." },
  { id: "unavailable", label: "Unavailable", icon: "unavailable", description: "The current host cannot provide it." }
];

export const capabilityExamples = [
  { glyph: "session", label: "Session", state: "attached", revision: "session:7c2d9a1e#g4", description: "Identity, generation and lifecycle fence." },
  { glyph: "code", label: "Source", state: "attached", revision: "source:4f31d2c8", description: "Exact form and repository revision." },
  { glyph: "files", label: "Files", state: "requested", revision: "filesystem:pending", description: "Requested browser file access." },
  { glyph: "storage", label: "Storage", state: "degraded", revision: "store:indexeddb@2", description: "Local-only storage; no remote durability." },
  { glyph: "canvas", label: "Canvas", state: "available", revision: "canvas:2d@1", description: "2D rendering surface available." },
  { glyph: "scene-3d", label: "3D scene", state: "unavailable", revision: "scene:none", description: "No 3D host attached." },
  { glyph: "audio", label: "Audio", state: "denied", revision: "permission:audio", description: "User permission has not been granted." },
  { glyph: "network", label: "Network", state: "unavailable", revision: "network:offline", description: "Execution is local and offline." },
  { glyph: "timer", label: "Timer", state: "available", revision: "timer:monotonic@1", description: "Monotonic timing capability." },
  { glyph: "queue", label: "Queue", state: "requested", revision: "queue:proposal@3", description: "A durable queue is requested, not active." },
  { glyph: "database", label: "Database", state: "degraded", revision: "db:readonly@7", description: "Read-only database session." },
  { glyph: "native", label: "Native host", state: "attached", revision: "host:rust@12", description: "Native Rust execution host." },
  { glyph: "wasm", label: "Wasm / browser", state: "attached", revision: "host:wasm@9", description: "Capability-fenced browser runtime." },
  { glyph: "package", label: "Package", state: "available", revision: "std.work:0.4.2", description: "Resolved package coordinate." },
  { glyph: "namespace", label: "Namespace", state: "available", revision: "work.core:17", description: "Resolved namespace identity." },
  { glyph: "agent", label: "Agent tool", state: "requested", revision: "tool:reviewer@2", description: "Agent/tool capability awaits explicit activation." }
];

export const productGlyphs = [
  { glyph: "product-www", id: "www", label: "WWW", route: "hara-lang.org", description: "Public language narrative, Docs and Benchmarks.", function: "Public information family" },
  { glyph: "product-playground", id: "playground", label: "Playground", route: "playground.hara-lang.org", description: "Runnable samples, sessions and live components.", function: "Executable workspace" },
  { glyph: "product-specs", id: "specs", label: "Specs", route: "specs.hara-lang.org", description: "Registry, checker, proposals and conformance evidence.", function: "Standards authority" },
  { glyph: "product-packages", id: "packages", label: "Packages", route: "packages.hara-lang.org", description: "Packages, namespaces, compatibility and stewardship.", function: "Distribution and ownership" },
  { glyph: "product-world", id: "world", label: "World", route: "world.hara-lang.org", description: "Articles, feeds, clippings, comments and contributor identity.", function: "Community reader" },
  { glyph: "product-learn", id: "learn", label: "Learn", route: "learn.hara-lang.org", description: "Curriculum, lessons, practice and learner progress.", function: "Structured learning" }
];

export const compositionExamples = [
  { id: "visible-label", label: "Visible label", rule: "The icon is decorative because the control text supplies the accessible name.", icon: "run" },
  { id: "icon-only", label: "Icon-only control", rule: "The button requires an accessible name; the SVG remains decorative inside the control.", icon: "search" },
  { id: "standalone-meaning", label: "Standalone meaning", rule: "A meaningful standalone icon or glyph uses role=img and an explicit label.", icon: "warning" },
  { id: "state-row", label: "State row", rule: "The symbol is paired with written state and evidence revision.", icon: "partial" },
  { id: "product-link", label: "Product launcher", rule: "A standalone product glyph link exposes the product name and never doubles as an action icon.", glyph: "product-world" }
];

export const iconPrinciples = [
  "Use original Hara geometry; do not copy vendor, operating-system, franchise or third-party icon silhouettes.",
  "Interface icons describe actions and navigation. Product glyphs identify surfaces. Capability glyphs identify runtime boundaries.",
  "Visible text is preferred when a command can be misunderstood; icon-only controls still require an accessible name.",
  "State combines written language, enclosing shape and line treatment. Colour reinforces but never owns meaning.",
  "The SVG never receives keyboard focus. The parent link, button, row or card owns interaction and focus.",
  "Products and runtimes own actual state; Visual Language owns geometry, names, optical balance and rendering defaults."
];

export const iconSummary = {
  interfaceIcons: haraIconNames.length,
  capabilityGlyphs: haraGlyphNames.filter((name) => haraGlyphCatalog[name].category === "capability").length,
  productGlyphs: productGlyphs.length,
  stateExamples: stateExamples.length,
  evidenceExamples: evidenceExamples.length,
  sizes: iconSizeScale.length
};

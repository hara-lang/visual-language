// @ts-check

import {
  catalogueItemById,
  catalogueItems,
  normalizeCataloguePath
} from "./v2-catalogue.mjs";

/** @typedef {"light" | "dark"} ReviewTheme */
/** @typedef {"structural-pass" | "review-required" | "accepted" | "needs-work"} ReviewStatus */

export const guideFixtureNotice = {
  id: "hara-v2-guide-review-2026-08",
  label: "Catalogue review contract",
  sourceRevision: "5975071694bff373",
  productionAudit: false,
  summary: "The route inventory is manifest-backed. Review decisions shown in the live matrix are local design-review state, not an external accessibility certification or screenshot archive."
};

export const reviewViewports = [
  { id: "desktop", label: "Desktop", width: 1440, height: 900, purpose: "Full shell, route navigation, inspectors, dense tables and workbenches." },
  { id: "tablet", label: "Tablet", width: 1024, height: 900, purpose: "Inspector yielding, compact route chrome and two-column product layouts." },
  { id: "compact", label: "680 px", width: 680, height: 860, purpose: "Rail collapse, contained overflow and single-primary-task transition." },
  { id: "phone", label: "390 px", width: 390, height: 844, purpose: "Touch controls, explicit disclosures and phone reading order." },
  { id: "minimum", label: "320 px", width: 320, height: 720, purpose: "Minimum supported width, no document-level horizontal overflow." }
];

export const reviewThemes = [
  { id: "light", label: "Light", summary: "Pale steel and paper with complete state hierarchy." },
  { id: "dark", label: "Dark", summary: "Graphite and recessed black without multiplying every edge." }
];

const coreStates = ["loading", "empty", "error", "disabled", "success"];

export const requiredReviewRoutes = [
  {
    id: "catalogue",
    label: "Catalogue home",
    path: "/v2/",
    group: "Catalogue",
    shell: "Catalogue landing",
    primaryTask: "Understand the route families and choose a detailed reference.",
    states: ["loading", "empty", "error", "disabled", "success", "planned-route", "active-route", "settled-route"],
    provenance: "Typed route manifest and implementation issue relationships.",
    downstream: "All Hara interface consumers"
  },
  {
    id: "design-system",
    label: "Foundations",
    path: "/v2/foundations/",
    group: "Foundations",
    shell: "Document catalogue",
    primaryTask: "Inspect identity, tokens, type, material, motion and accessibility contracts.",
    states: [...coreStates, "selected-token", "reduced-motion", "theme-parity"],
    provenance: "Protected package tokens and shared identity invariants.",
    downstream: "Every downstream product"
  },
  {
    id: "components",
    label: "Components",
    path: "/v2/components/",
    group: "Library",
    shell: "Inventory and composition",
    primaryTask: "Find a public primitive and inspect its states and ownership.",
    states: [...coreStates, "selected", "pressed", "validation", "async-feedback"],
    provenance: "Public package export inventory and exact source paths.",
    downstream: "Every downstream product"
  },
  {
    id: "ui-patterns",
    label: "UI patterns",
    path: "/v2/ui/",
    group: "Library",
    shell: "Workflow reference",
    primaryTask: "Review reusable behavior over time without importing product business rules.",
    states: [...coreStates, "partial", "stale", "offline", "reconnecting", "permission-denied", "revoked"],
    provenance: "Shared interaction contract and product-owned rule boundary.",
    downstream: "Every downstream product"
  },
  {
    id: "frontmatter",
    label: "Front matter",
    path: "/v2/frontmatter/",
    group: "Foundations",
    shell: "Content-contract registry",
    primaryTask: "Inspect author, registry, identity, runtime and source-controlled fields.",
    states: [...coreStates, "valid", "invalid", "migrated", "imported", "superseded", "withdrawn"],
    provenance: "Public hara.* content contracts, exact schema versions and receipts.",
    downstream: "All content-producing products"
  },
  {
    id: "tool-workbenches",
    label: "Tool workbenches",
    path: "/v2/tool/",
    group: "Library",
    shell: "Viewport-first workbench",
    primaryTask: "Manipulate and inspect a durable primary surface while secondary panes yield.",
    states: [...coreStates, "selected", "pressed", "capability-unavailable", "connection-requested", "connection-actual"],
    provenance: "Stateless Astro primitives and package-owned workbench geometry.",
    downstream: "Playground, editors and browser tools"
  },
  {
    id: "www",
    label: "WWW",
    path: "/v2/www/",
    group: "Applications",
    shell: "Public narrative",
    primaryTask: "Understand Hara through bounded claims, proof and executable examples.",
    states: [...coreStates, "low-bandwidth", "runtime-unavailable", "stale-release"],
    provenance: "hara.www claims linked to Specs, Packages, Benchmarks and executable proof.",
    downstream: "hara-www"
  },
  {
    id: "www-docs",
    label: "Docs",
    path: "/v2/www/docs/",
    group: "Applications",
    shell: "Persistent reading shell",
    primaryTask: "Find guidance or reference and optionally run a fenced example.",
    states: [...coreStates, "no-search-results", "version-stale", "runtime-unavailable", "read-only"],
    provenance: "hara.docs content identity, version range, symbols and runtime example revision.",
    downstream: "hara-docs"
  },
  {
    id: "www-benchmarks",
    label: "Benchmarks",
    path: "/v2/www/benchmarks/",
    group: "Applications",
    shell: "Evidence command board",
    primaryTask: "Read an insight, inspect the selected evidence and verify its method.",
    states: [...coreStates, "missing", "incomparable", "partial", "low-confidence"],
    provenance: "Workload, baseline, methodology, environment and exact evidence revision.",
    downstream: "hara-benchmarks"
  },
  {
    id: "playground",
    label: "Playground",
    path: "/v2/playground/",
    group: "Applications",
    shell: "Executable studio",
    primaryTask: "Load exact source, run it and inspect session and observation state.",
    states: [...coreStates, "running", "cancelled", "restarted", "replaced", "disposed", "backend-unavailable", "stale-link"],
    provenance: "Session identity, generation, source revision, backend, capabilities, events and receipts.",
    downstream: "Playground and Docs live embeds"
  },
  {
    id: "specs",
    label: "Specs",
    path: "/v2/specs/",
    group: "Applications",
    shell: "Registry, reader and checker",
    primaryTask: "Find an exact standard, inspect authority and evaluate fenced evidence.",
    states: [...coreStates, "draft", "proposed", "accepted", "superseded", "withdrawn", "experimental", "unsupported", "unavailable"],
    provenance: "Specification identity, exact version, source revision, checker implementation and receipt.",
    downstream: "hara-specs"
  },
  {
    id: "packages",
    label: "Packages",
    path: "/v2/packages/",
    group: "Applications",
    shell: "Registry and publication product",
    primaryTask: "Find, evaluate, install, publish and maintain packages and namespaces.",
    states: [...coreStates, "stale-index", "registry-degraded", "install-failure", "deprecated", "superseded", "withdrawn", "revoked"],
    provenance: "Coordinates, release revision, artifacts, namespace stewardship, compatibility and publication receipt.",
    downstream: "Package and namespace registry product"
  },
  {
    id: "world",
    label: "World",
    path: "/v2/world/",
    group: "Applications",
    shell: "Community reader",
    primaryTask: "Read source-aware community material and participate in accountable discussion.",
    states: [...coreStates, "partial-source", "stale-feed", "moderated", "deleted", "owner-away", "presence-hidden"],
    provenance: "Canonical source, retrieval, syndication, moderation, contributor and bot-owner evidence.",
    downstream: "hara-world"
  },
  {
    id: "learn",
    label: "Learn",
    path: "/v2/learn/",
    group: "Applications",
    shell: "Curriculum and lesson product",
    primaryTask: "Run a visible lesson, follow a concept graph and record meaningful progress.",
    states: [...coreStates, "anonymous", "current", "locked", "optional", "local-pass", "verified", "version-changed", "runtime-unavailable"],
    provenance: "Exact curriculum, lesson, exercise, project, attempt and completion revisions.",
    downstream: "learn.hara-lang.org"
  }
];

export const supplementaryReviewRoutes = [
  { id: "graphics", label: "Graphics", path: "/v2/graphics/", kind: "current-extension", parent: "Foundations", summary: "Raster fields, material textures and progressive shader surfaces." },
  { id: "start", label: "Agent-first Start", path: "/v2/start/", kind: "compatibility", parent: "Learn", summary: "Agent-first discovery and Habitat study with a canonical Learn relationship." },
  { id: "world-discussion", label: "World discussion", path: "/v2/world/discussion/", kind: "current-extension", parent: "World", summary: "Focused article, clipping, comment, profile and presence study." },
  { id: "world-around", label: "Around Hara", path: "/v2/world/around/", kind: "current-extension", parent: "World", summary: "External discovery, provenance, moderation and relay study." },
  { id: "hara-chrome", label: "Hara Chrome", path: "/v2/tool/hara-chrome/", kind: "current-extension", parent: "Tool workbenches", summary: "Browser runtime and bounded diagnostics application study." }
];

export const historicalReviewRoutes = [
  { id: "learn-community-study", label: "Community reader study", path: "/v2/world/community/", canonicalPath: "/v2/learn/studies/world-community/", summary: "Retained under Learn for comparison, not a primary World destination." },
  { id: "learn-onboarding-study", label: "Programmer onboarding study", path: "/v2/world/onboarding/", canonicalPath: "/v2/learn/studies/programmer-onboarding/", summary: "Retained as a Learn teaching study, not active World navigation." },
  { id: "world-feed-study", label: "World feed infrastructure study", path: "/v2/world/feed/", canonicalPath: "/v2/learn/studies/world-feed/", summary: "Retained implementation evidence for source normalization, clustering and relay." }
];

export const reviewChecks = [
  { id: "route", label: "Route and manifest", question: "Does the static route build and resolve from the shared manifest?" },
  { id: "navigation", label: "Navigation ownership", question: "Are catalogue, application-local and prototype controls visibly distinct?" },
  { id: "theme", label: "Light and dark", question: "Do hierarchy, focus and state remain equivalent in both explicit themes?" },
  { id: "responsive", label: "Five widths", question: "Does the primary task survive 1440, 1024, 680, 390 and 320 pixels?" },
  { id: "keyboard", label: "Keyboard and focus", question: "Can every control be reached and is focus visibly distinct?" },
  { id: "hover", label: "No hover-only access", question: "Can touch and keyboard users reveal every required action?" },
  { id: "overflow", label: "Contained overflow", question: "Do tables, code and workbenches scroll locally rather than widening the document?" },
  { id: "motion", label: "Reduced motion", question: "Does reduced motion preserve feedback and state without decorative displacement?" },
  { id: "contrast", label: "Contrast and cues", question: "Are state words, icons or structure present in addition to colour?" },
  { id: "states", label: "Route states", question: "Are loading, empty, error, disabled, success and required domain states represented?" },
  { id: "provenance", label: "Authority and provenance", question: "Do claims expose their exact source, revision, authority and receipt boundary?" }
];

export const navigationLayers = [
  { id: "global", label: "Global catalogue", owner: "Visual Language", surface: "Block-H masthead and Browse launcher", rule: "Knows route groups and current location; never absorbs product workflows." },
  { id: "route", label: "Route and family", owner: "Visual Language manifest", surface: "Breadcrumb, family tabs, status, neighbours and footer", rule: "Derived from one route manifest rather than page-local arrays." },
  { id: "local", label: "Application-local", owner: "Application reference", surface: "Registry, lesson, checker, feed, editor or publishing sections", rule: "Names only the workflow owned by that product." },
  { id: "prototype", label: "Demonstrated product", owner: "Downstream product", surface: "Embedded app toolbar, tabs, inspector and commands", rule: "Must be framed as specimen chrome and cannot masquerade as catalogue navigation." }
];

export const ownershipLayers = [
  { id: "package", label: "Shared package", owns: "Tokens, type, surfaces, focus, state grammar, stateless components and workbench geometry.", excludes: "Product data, registry decisions, runtime behavior and business rules." },
  { id: "catalogue", label: "Catalogue composition", owns: "Route relationships, review specimens, fixture disclosure and cross-product comparison.", excludes: "Production accounts, authoritative content, moderation, evaluation or publication." },
  { id: "product", label: "Product application", owns: "Information architecture, commands, preferences, forms, local navigation and task composition.", excludes: "Facts controlled by identity, source, registry, reviewer or runtime authorities." },
  { id: "authority", label: "Registry and runtime", owns: "Canonical identities, revisions, capabilities, checks, decisions, artifacts, observations and receipts.", excludes: "Presentation-only claims or visual-language fixture data." }
];

export const routeLifecycle = [
  { id: "planned", label: "Planned", entry: "Issue-backed manifest record", exit: "Detailed route and focused tests exist", behavior: "Links to the implementation issue; no shallow placeholder route." },
  { id: "active", label: "Active", entry: "Current internal route on main", exit: "Contract is stable or route is replaced", behavior: "Primary navigation and current-route treatment." },
  { id: "settled", label: "Settled", entry: "Stable reusable contract", exit: "Explicit supersession only", behavior: "Still supported; change requires compatibility review." },
  { id: "historical", label: "Historical", entry: "Replaced study remains useful", exit: "Removal policy and redirects are documented", behavior: "Secondary Learn/reference link; never competes with the current product route." },
  { id: "deprecated", label: "Deprecated", entry: "Replacement and migration path exist", exit: "Removal release", behavior: "Retain exact reason, replacement and compatibility period." }
];

export const newApplicationSteps = [
  "Create an executable issue with outcome, scope, acceptance criteria, validation, relationships, readiness and delivery.",
  "Add one typed manifest record; planned routes point to the issue until a detailed route exists.",
  "Declare the route boundary, local information architecture, authoritative data sources and downstream target.",
  "Consume shared components, UI patterns and content contracts without redefining protected tokens.",
  "Build realistic landing, deep-work, degraded, responsive, light/dark, keyboard and reduced-motion states.",
  "Add focused contract tests, package documentation impact and a downstream adoption note.",
  "Validate the exact branch with repository-wide tests, static build and the live review matrix before merge."
];

export const adoptionTargets = [
  { id: "www", label: "WWW", target: "hara-www", route: "/v2/www/", guide: "V2-WWW.md", ownership: "Narrative, proof, release and getting-started composition." },
  { id: "docs", label: "Docs", target: "hara-docs", route: "/v2/www/docs/", guide: "V2-WWW.md", ownership: "Guides, reference, search and embedded live examples." },
  { id: "benchmarks", label: "Benchmarks", target: "hara-benchmarks", route: "/v2/www/benchmarks/", guide: "V2-WWW.md", ownership: "Evidence, workloads, methods, environments and result history." },
  { id: "playground", label: "Playground", target: "Playground/live-component repositories", route: "/v2/playground/", guide: "V2-PLAYGROUND.md", ownership: "Execution, session lifecycle, sharing and embed runtime behavior." },
  { id: "specs", label: "Specs", target: "hara-specs", route: "/v2/specs/", guide: "V2-SPECS.md", ownership: "Canonical standards, proposals, review and conformance authority." },
  { id: "packages", label: "Packages", target: "package registry product", route: "/v2/packages/", guide: "V2-PACKAGES.md", ownership: "Package/namespace registry, release, compatibility and provenance." },
  { id: "world", label: "World", target: "hara-world", route: "/v2/world/", guide: "V2-WORLD.md", ownership: "Public reading, source discovery, discussion, profiles and accountable bots." },
  { id: "learn", label: "Learn", target: "learn.hara-lang.org", route: "/v2/learn/", guide: "V2-LEARN.md", ownership: "Curriculum, lessons, practice, projects and private progress." }
];

export const screenshotProcedure = [
  "Build the exact branch and serve the static output; record the branch SHA and route revision.",
  "Open each required route in explicit light and explicit dark themes.",
  "Capture 1440×900, 1024×900, 680×860, 390×844 and 320×720 frames without resizing between interaction states.",
  "Exercise keyboard navigation, visible focus, disclosures, local overflow and one representative product mutation before capture.",
  "Capture loading, empty, error, disabled and success plus every route-specific degraded or lifecycle state named in the matrix.",
  "Record contrast, reduced-motion, no-hover and source/provenance observations beside the image rather than relying on visual memory.",
  "Store screenshots as review evidence, not package assets; link the exact PR, SHA, route, theme, viewport and state.",
  "Treat a changed route, token, shell or state contract as invalidating the affected evidence until it is reviewed again."
];

export const releaseImpact = {
  packageExports: "No new runtime or component export is required for the guide. V2-GUIDE.md is included in the published documentation set.",
  routeImpact: "Adds /v2/guide/ as a current Foundations route and a permanent Catalogue guide link in page footers.",
  downstream: "Adoption pull requests remain independent and pin only merged Visual Language revisions.",
  compatibility: "V1 and all existing v2 imports, routes and historical studies remain available."
};

/** @param {string} id */
export function reviewRouteById(id) {
  return requiredReviewRoutes.find((route) => route.id === id) ?? null;
}

/** @param {string} path */
export function reviewRouteByPath(path) {
  const normalized = normalizeCataloguePath(path);
  return requiredReviewRoutes.find((route) => normalizeCataloguePath(route.path) === normalized) ?? null;
}

/** @param {string} id */
export function viewportById(id) {
  return reviewViewports.find((viewport) => viewport.id === id) ?? reviewViewports[0];
}

/** @param {string} id */
export function themeById(id) {
  return reviewThemes.find((theme) => theme.id === id) ?? reviewThemes[0];
}

/** @param {string} routeId */
export function stateCoverageForRoute(routeId) {
  return reviewRouteById(routeId)?.states ?? [];
}

/** @param {string} query @param {string=} group */
export function filterReviewRoutes(query, group = "all") {
  const needle = String(query ?? "").trim().toLowerCase();
  return requiredReviewRoutes.filter((route) => {
    const searchable = [route.label, route.path, route.group, route.shell, route.primaryTask, route.downstream, ...route.states].join(" ").toLowerCase();
    return (!needle || searchable.includes(needle)) && (group === "all" || route.group === group);
  });
}

/** @param {string} routeId @param {string} viewportId @param {string} themeId */
export function reviewCell(routeId, viewportId, themeId) {
  const route = reviewRouteById(routeId);
  const viewport = viewportById(viewportId);
  const theme = themeById(themeId);
  return route ? {
    id: `${route.id}:${viewport.id}:${theme.id}`,
    route,
    viewport,
    theme,
    status: /** @type {ReviewStatus} */ ("review-required")
  } : null;
}

export const guideSummary = {
  requiredRoutes: requiredReviewRoutes.length,
  supplementaryRoutes: supplementaryReviewRoutes.length,
  historicalRoutes: historicalReviewRoutes.length,
  viewports: reviewViewports.length,
  themes: reviewThemes.length,
  matrixCells: requiredReviewRoutes.length * reviewViewports.length * reviewThemes.length,
  reviewChecks: reviewChecks.length,
  manifestBackedRequiredRoutes: requiredReviewRoutes.filter((route) => route.id === "catalogue" || Boolean(catalogueItemById(route.id))).length,
  currentManifestItems: catalogueItems.filter((item) => item.status === "active").length
};

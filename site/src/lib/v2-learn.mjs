// @ts-check

/** @typedef {"anonymous" | "new-account" | "returning"} LearnerState */
/** @typedef {"complete" | "current" | "locked" | "optional"} UnitState */
/** @typedef {"initial" | "checking" | "failure" | "local-pass" | "server-verified" | "version-changed" | "runtime-unavailable"} PracticeState */

export const learnFixtureNotice = {
  id: "hara-v2-learn-fixture-2026-08",
  label: "Learning design-review fixture",
  generatedAt: "2026-08-20T17:47:42Z",
  sourceRevision: "941cefefa20de882",
  curriculumRevision: "learn-curriculum@2.0.0:6f3a91c2",
  productionData: false,
  summary: "Representative curriculum, lesson, practice, project, and progress data for interaction review. It is not a live learner record."
};

export const learnContentTypes = [
  { id: "learn.lesson", version: "2.0.0", label: "Lesson", authority: "Curriculum registry" },
  { id: "learn.concept", version: "2.0.0", label: "Concept", authority: "Curriculum registry" },
  { id: "learn.exercise", version: "2.0.0", label: "Exercise", authority: "Exercise registry" },
  { id: "learn.project", version: "2.0.0", label: "Project", authority: "Curriculum registry" },
  { id: "learn.progress", version: "2.0.0", label: "Progress record", authority: "Learner progress registry" }
];

export const experienceEntrances = [
  {
    id: "new-programmer",
    label: "New to programming",
    title: "Start with values you can see",
    summary: "Run one form, change ordinary data, and build a small page before learning specialist vocabulary.",
    firstLesson: "first-value",
    estimatedMinutes: 18,
    evidence: "first run → first change → first useful output"
  },
  {
    id: "programmed-before",
    label: "Programmed before",
    title: "Map familiar ideas onto Hara",
    summary: "Compare functions, collections, namespaces, capabilities, and package boundaries through executable examples.",
    firstLesson: "hara-by-contrast",
    estimatedMinutes: 24,
    evidence: "values → functions → namespaces → explicit effects"
  },
  {
    id: "lisp-experience",
    label: "Familiar with Lisp",
    title: "Inspect Hara's runtime and data contracts",
    summary: "Move directly into evaluator behavior, typed schemas, native boundaries, durable work, and portable packages.",
    firstLesson: "runtime-and-forms",
    estimatedMinutes: 28,
    evidence: "forms → evaluator → contracts → runtime receipts"
  }
];

export const outcomeTracks = [
  { id: "web", label: "Web", title: "Build a small interactive page", summary: "Render data, respond to events, and publish an inspectable project.", icon: "WWW", status: "available", units: 12 },
  { id: "agents", label: "Agents", title: "Build an accountable agent workflow", summary: "Model work, capabilities, checkpoints, tools, and receipts without hiding execution boundaries.", icon: "AG", status: "available", units: 14 },
  { id: "graphics", label: "Graphics", title: "Make a live visual system", summary: "Use Canvas, animation, shaders, and observations while preserving exact source and session state.", icon: "GX", status: "available", units: 11 },
  { id: "games", label: "Games", title: "Compose a small interactive world", summary: "Learn state, events, update loops, entities, and deterministic simulation through one playable project.", icon: "GM", status: "preview", units: 10 },
  { id: "music", label: "Music", title: "Program an audio patch", summary: "Create patterns, route signals, expose controls, and keep the score as portable Hara data.", icon: "MU", status: "preview", units: 9 },
  { id: "language-tools", label: "Language tools", title: "Inspect and transform source", summary: "Work with forms, parsing, migration, schemas, and source-preserving transformations.", icon: "LT", status: "available", units: 13 }
];

export const learnerStates = [
  {
    id: "anonymous",
    label: "Anonymous try-now",
    summary: "Run lessons and practice locally without signing in. Progress remains browser-local until the learner explicitly saves it.",
    primaryAction: "Run the first lesson",
    controlledFacts: ["local attempts", "runtime receipts"],
    editableFacts: ["scratch source", "private notes"]
  },
  {
    id: "new-account",
    label: "New account",
    summary: "No path is preselected. Learn recommends one next action from declared experience and completed evidence, not an opaque score.",
    primaryAction: "Choose an entrance",
    controlledFacts: ["identity", "curriculum revision", "completion evidence"],
    editableFacts: ["display preferences", "private notes"]
  },
  {
    id: "returning",
    label: "Returning learner",
    summary: "Continue from the exact lesson and curriculum revision last completed, with explicit migration when the course changed.",
    primaryAction: "Continue durable work",
    controlledFacts: ["completed units", "attempt receipts", "exact curriculum revision"],
    editableFacts: ["saved examples", "private notes", "visibility preferences"]
  }
];

export const courseFixture = {
  id: "course-hara-foundations",
  contentType: "learn.project",
  schemaVersion: "2.0.0",
  title: "From one value to a durable Hara project",
  summary: "A practical path through forms, values, functions, namespaces, capabilities, packages, and durable work.",
  author: "identity:github:hoebat",
  exactRevision: "6f3a91c27d84be11",
  runtimeCompatibility: "Browser/Wasm · JVM · Rust evaluator",
  estimatedMinutes: 145,
  downloadableManifest: "hara:learn:course:foundations@6f3a91c2",
  units: [
    { id: "first-value", kind: "lesson", label: "Run an ordinary value", state: "complete", minutes: 8, prerequisites: [] },
    { id: "change-data", kind: "exercise", label: "Change data and inspect the result", state: "complete", minutes: 12, prerequisites: ["first-value"] },
    { id: "functions", kind: "concept", label: "Functions transform values", state: "complete", minutes: 14, prerequisites: ["change-data"] },
    { id: "namespaces", kind: "lesson", label: "Organize code with namespaces", state: "current", minutes: 18, prerequisites: ["functions"] },
    { id: "capabilities", kind: "concept", label: "Effects require explicit capabilities", state: "locked", minutes: 20, prerequisites: ["namespaces"] },
    { id: "package", kind: "project", label: "Publish a small reusable package", state: "locked", minutes: 32, prerequisites: ["capabilities"] },
    { id: "durable-work", kind: "project", label: "Build a receipt-backed work pipeline", state: "optional", minutes: 41, prerequisites: ["capabilities"] }
  ]
};

export const conceptGraph = {
  nodes: [
    { id: "value", label: "Value", x: 8, y: 52, state: "complete" },
    { id: "form", label: "Form", x: 24, y: 30, state: "complete" },
    { id: "function", label: "Function", x: 41, y: 52, state: "complete" },
    { id: "namespace", label: "Namespace", x: 57, y: 28, state: "current" },
    { id: "capability", label: "Capability", x: 72, y: 52, state: "locked" },
    { id: "package", label: "Package", x: 89, y: 30, state: "locked" },
    { id: "work", label: "Durable work", x: 89, y: 76, state: "optional" }
  ],
  edges: [["value", "form"], ["form", "function"], ["function", "namespace"], ["namespace", "capability"], ["capability", "package"], ["capability", "work"]]
};

export const lessonFixture = {
  id: "lesson-namespaces",
  contentType: "learn.lesson",
  schemaVersion: "2.0.0",
  title: "Namespaces give values a durable home",
  summary: "Define, resolve, and inspect names without treating the editor's current buffer as the source of truth.",
  exactRevision: "lesson:namespace:4b7e1a62",
  curriculumRevision: learnFixtureNotice.curriculumRevision,
  author: "identity:github:hoebat",
  objectives: ["Define a namespace and one public value.", "Resolve a qualified symbol from another namespace.", "Explain why source revision and runtime namespace state are separate facts."],
  prerequisites: ["functions", "immutable values"],
  runtime: { sourceRevision: "lesson-source:9f3c2ab7", backend: "browser-wasm", capabilities: ["eval", "observations"], session: "learn-pg-7a91", generation: 2, eventSequence: 41 },
  source: `(ns tutorial.profile)\n\n(def greeting\n  {:message "Hello from a namespace"\n   :next :inspect-qualified-symbol})\n\n(require '[tutorial.profile :as profile])\n\nprofile/greeting`,
  result: `{:message "Hello from a namespace"\n :next :inspect-qualified-symbol}`,
  sections: [{ id: "idea", label: "The idea", kind: "explanatory" }, { id: "run", label: "Run the example", kind: "executable" }, { id: "inspect", label: "Inspect the namespace", kind: "explanatory" }, { id: "check", label: "Check understanding", kind: "assessment" }],
  glossary: [{ term: "namespace", definition: "A named scope that owns vars and source identity." }, { term: "qualified symbol", definition: "A symbol that names both namespace and local name." }, { term: "source revision", definition: "The exact source fence used to create the current runtime state." }],
  related: [{ kind: "specification", label: "runtime.session@1.2.0" }, { kind: "package", label: "hara-runtime" }, { kind: "world", label: "How package maintainers organize namespaces" }],
  degradedStates: [{ id: "stale-lesson", label: "Lesson revision changed", summary: "Keep the completed historical revision and require an explicit migration before claiming current completion." }, { id: "runtime-unavailable", label: "Runtime unavailable", summary: "Keep prose and exact source visible; do not fabricate a result or mark the exercise failed." }]
};

export const practiceScenarios = [
  { id: "initial", label: "Ready to try", state: "initial", summary: "Source is editable locally. No attempt or completion claim exists yet.", findings: [], receipt: null, saveAllowed: false },
  { id: "checking", label: "Checking locally", state: "checking", summary: "The browser evaluator is checking the exact source revision against the exercise contract.", findings: [{ code: "CHECKING", severity: "notice", message: "Evaluating three examples and two namespace assertions." }], receipt: null, saveAllowed: false },
  { id: "failure", label: "Needs another change", state: "failure", summary: "One qualified symbol resolves to the wrong namespace. The attempt remains local and editable.", findings: [{ code: "LEARN-NAMESPACE-004", severity: "error", line: 8, path: "profile/greeting", message: "Expected tutorial.profile/greeting; found tutorial.account/greeting." }, { code: "LEARN-HINT-002", severity: "notice", line: 6, path: "require", message: "Inspect the alias introduced by the require form." }], receipt: "attempt:local:namespace:3b621c9f:failure", saveAllowed: true },
  { id: "local-pass", label: "Local checks pass", state: "local-pass", summary: "All browser checks pass. The learner may save meaningful progress or continue anonymously.", findings: [{ code: "LEARN-PASS-001", severity: "success", message: "Three examples and two namespace assertions passed." }], receipt: "attempt:local:namespace:3b621c9f:pass", saveAllowed: true },
  { id: "server-verified", label: "Verified completion", state: "server-verified", summary: "A durable verifier confirmed the exact exercise, curriculum, source, and checker revisions.", findings: [{ code: "LEARN-VERIFIED-001", severity: "success", message: "Completion evidence is durable and revision-aware." }], receipt: "completion:namespace:6f3a91c2:3b621c9f:verified", saveAllowed: true },
  { id: "version-changed", label: "Exercise version changed", state: "version-changed", summary: "The saved attempt targets an older exercise revision. Preserve it and offer an explicit migration or rerun.", findings: [{ code: "LEARN-VERSION-009", severity: "warning", message: "Attempt targets exercise@1.3.0; current curriculum references exercise@1.4.0." }], receipt: "attempt:historical:namespace:1.3.0", saveAllowed: true },
  { id: "runtime-unavailable", label: "Runtime unavailable", state: "runtime-unavailable", summary: "The browser evaluator could not start. No failure or completion claim has been produced.", findings: [{ code: "LEARN-RUNTIME-OFFLINE", severity: "error", message: "Retain the exact source and retry without changing the attempt fence." }], receipt: null, saveAllowed: false }
];

export const projectFixture = {
  id: "project-live-signal-field", contentType: "learn.project", schemaVersion: "2.0.0", title: "Build a live signal field", outcome: "A shareable Canvas scene with one editable control and an inspectable mutation receipt.", exactRevision: "project:signal-field:72aa901f", sourceRevision: "source:ribbon-field:9f3c2ab7",
  runtime: { backend: "browser-wasm", session: "learn-project-91d2", generation: 3, capabilities: ["eval", "files", "canvas", "observations"] },
  files: [{ path: "src/main.hara", state: "current" }, { path: "src/field.hara", state: "changed" }, { path: "project.hara", state: "ready" }, { path: "README.md", state: "optional" }],
  milestones: [{ id: "run", label: "Run the starter field", state: "complete", evidence: "runtime receipt" }, { id: "change", label: "Change trail width", state: "current", evidence: "source + observation receipt" }, { id: "explain", label: "Explain the capability boundary", state: "locked", evidence: "written reflection" }, { id: "share", label: "Share an exact project link", state: "locked", evidence: "publication reference" }],
  handoffs: ["Open in Playground", "Share exact source", "Publish project note", "Discuss on World"], boundary: "Learn owns milestones and reflection. Playground owns execution and sharing controls. World owns the linked discussion."
};

export const progressFixture = {
  id: "progress-identity-github-hoebat", contentType: "learn.progress", schemaVersion: "2.0.0", learner: "identity:github:hoebat", curriculumRevision: learnFixtureNotice.curriculumRevision, visibility: "private-by-default", completedUnits: 3, currentUnit: "namespaces", savedExamples: 4, privateNotes: 6,
  milestones: [{ id: "first-run", label: "First run", state: "complete", evidence: "attempt:first-value:pass", date: "2026-08-12" }, { id: "first-change", label: "First source change", state: "complete", evidence: "attempt:change-data:pass", date: "2026-08-12" }, { id: "first-solved-problem", label: "First solved problem", state: "complete", evidence: "completion:functions:verified", date: "2026-08-15" }, { id: "first-project", label: "First useful project", state: "current", evidence: "project:signal-field:in-progress", date: null }],
  pathProgress: [{ track: "Language foundations", complete: 3, total: 7, revision: "6f3a91c2" }, { track: "Graphics", complete: 1, total: 11, revision: "a811b9e0" }, { track: "Agents", complete: 0, total: 14, revision: "f77c209d" }],
  privacyControls: ["Keep attempts private", "Share selected projects", "Hide notes", "Export my progress"], excludedMechanics: ["XP", "leaderboards", "required streaks", "engagement penalties"]
};

export const teachingFixture = {
  contentType: "learn.lesson", schemaVersion: "2.0.0", previewRevision: "lesson-draft:31b9d4ee", authorFields: ["title", "summary", "learningObjectives", "prerequisiteConcepts", "estimatedMinutes", "exerciseSpec"], controlledFields: ["contentId", "authors", "conceptGraph", "runtimeExample", "progress", "status", "revision"],
  migrationNotice: { from: "learn.lesson@1.3.0", to: "learn.lesson@2.0.0", summary: "Runnable environments now reference exact source, backend, capability, and expected-observation contracts." },
  conceptRegistry: [{ id: "concept/value", dependants: 4, status: "published" }, { id: "concept/function", dependants: 6, status: "published" }, { id: "concept/namespace", dependants: 5, status: "review" }, { id: "concept/capability", dependants: 8, status: "draft" }],
  machineFormats: ["JSON", "Hara form", "RSS curriculum feed", "downloadable course manifest"]
};

export function entranceById(id) { return experienceEntrances.find((entry) => entry.id === id) ?? experienceEntrances[0]; }
export function trackById(id) { return outcomeTracks.find((track) => track.id === id) ?? outcomeTracks[0]; }
export function practiceScenario(id) { return practiceScenarios.find((scenario) => scenario.id === id) ?? practiceScenarios[0]; }
export function courseUnitsByState(state) { return courseFixture.units.filter((unit) => unit.state === state); }
export function recommendedNextUnit() { return courseFixture.units.find((unit) => unit.state === "current") ?? null; }
export function filterTracks(query) { const needle = String(query ?? "").trim().toLowerCase(); return needle ? outcomeTracks.filter((track) => [track.label, track.title, track.summary, track.status].join(" ").toLowerCase().includes(needle)) : outcomeTracks; }

export const learnSummary = { entrances: experienceEntrances.length, tracks: outcomeTracks.length, courseUnits: courseFixture.units.length, concepts: conceptGraph.nodes.length, practiceStates: practiceScenarios.length, milestones: progressFixture.milestones.length, contentTypes: learnContentTypes.length };

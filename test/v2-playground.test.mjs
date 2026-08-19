import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import {
  catalogueHref,
  catalogueItemById,
  catalogueItemIsCurrent,
  catalogueLinkIsExternal
} from "../site/src/lib/v2-catalogue.mjs";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const includes = (text, phrases) => phrases.forEach((phrase) => assert.match(text, new RegExp(escape(phrase), "i")));

const componentPaths = [
  "../site/src/components/v2-playground/PlaygroundWorkspace.astro",
  "../site/src/components/v2-playground/PlaygroundEmbeds.astro",
  "../site/src/components/v2-playground/PlaygroundMobile.astro"
];
const readScripts = async () => read("../site/src/scripts/v2-playground.js");
const readStyles = async () => (await Promise.all([
  "../site/src/styles/v2-playground.css",
  "../site/src/styles/v2-playground-arrival.css",
  "../site/src/styles/v2-playground-workspace.css",
  "../site/src/styles/v2-playground-downstream.css",
  "../site/src/styles/v2-playground-responsive.css"
].map(read))).join("\n");

const readRouteSource = async () => {
  const parts = await Promise.all([
    read("../site/src/pages/v2/playground/index.astro"),
    ...componentPaths.map(read),
    readScripts()
  ]);
  return parts.join("\n");
};

test("the catalogue activates the detailed Playground route", async () => {
  const playground = catalogueItemById("playground");
  assert.ok(playground);
  assert.equal(playground.status, "active");
  assert.equal(playground.href, "/v2/playground/");
  assert.equal(catalogueHref(playground, "/visual-language/"), "/visual-language/v2/playground/");
  assert.equal(catalogueLinkIsExternal(playground), false);
  assert.equal(catalogueItemIsCurrent(playground, "/v2/playground/"), true);
  await access(new URL("../site/src/pages/v2/playground/index.astro", import.meta.url));
});

test("arrival supports outcomes, exact loading, recovery, and account states", async () => {
  const source = await readRouteSource();
  for (const id of ["arrival", "sample-gallery", "workspace", "embedded", "sharing", "mobile"])
    assert.match(source, new RegExp(`id="${id}"`));
  includes(source, [
    "Choose Run, Edit, or Explore",
    "Repository · branch · path · revision",
    "Show missing revision",
    "Show unavailable sample",
    "Recent sessions",
    "Browser-local until saved",
    "Anonymous",
    "Signed in",
    "Private / unpublished",
    "Stale link"
  ]);
  for (const outcome of ["move", "inspect", "compose", "build"])
    assert.match(source, new RegExp(`id: "${outcome}"`));
  assert.match(source, /data-repository-loader/);
  assert.match(source, /data-loader-state-button="missing"/);
  assert.match(source, /data-loader-state-button="unavailable"/);
});

test("the main studio composes shared workbench primitives and five product modes", async () => {
  const workspace = await read(componentPaths[0]);
  for (const component of ["EnvironmentWorkbench", "Toolbar", "ToolButton", "ToolGroup", "TabStrip", "FrontmatterGrid", "ResourceList", "StatusBar"])
    assert.match(workspace, new RegExp(`import ${component}`), `missing ${component} composition`);
  for (const mode of ["nav", "frontmatter", "graphics", "code", "console"])
    assert.match(workspace, new RegExp(`data-studio-mode="${mode}"`));
  for (const fact of ["Session", "Generation", "Source revision", "Requested backend", "Actual backend", "Capabilities", "Execution receipt"])
    assert.match(workspace, new RegExp(escape(fact), "i"));
  for (const action of ["Run", "Cancel", "Restart", "Reset", "Toggle control pane", "Command palette"])
    assert.match(workspace, new RegExp(`label="${escape(action)}"`));
  for (const group of ["sessions", "files", "canvas", "threeD"])
    assert.match(workspace, new RegExp(`slot="${group}"`));
  includes(workspace, ["Result", "Observations", "Diagnostics", "schema-argument-mismatch", "stack trace", "Capability unavailable"]);
});

test("runtime interaction markers preserve fencing, explicit backend failure, and terminal lifecycle states", async () => {
  const script = await readScripts();
  includes(script, [
    "runtime.sequence += 1",
    "fallback :forbidden",
    "HBC backend unavailable",
    "restart fenced",
    "replacement requested",
    "new session ready",
    "session disposed",
    "cancelled terminally"
  ]);
  assert.match(script, /runtime\.generation \+= 1/);
  assert.match(script, /runtime\.sourceRevision = "9f3c2ab7"/);
  assert.match(script, /if \(runtime\.disposed\) return/);
  assert.match(script, /if \(runtime\.disposed \|\| runtime\.state === "running"\) return/);
  assert.doesNotMatch(script, /\beval\s*\(/);
});

test("inline and expanded embeds expose exact source and capability-driven controls", async () => {
  const embeds = await read(componentPaths[1]);
  includes(embeds, [
    "docs.live-example",
    "Open in Playground",
    "Copy source",
    "Share exact view",
    "Capabilities unavailable",
    "Expanded embed",
    "optional live controls"
  ]);
  assert.match(embeds, /data-inline-embed/);
  assert.match(embeds, /data-expanded-embed/);
  assert.match(embeds, /controlPaneCollapsed=\{true\}/);
  assert.match(embeds, /slot="sessions"/);
  assert.match(embeds, /slot="files"/);
  assert.doesNotMatch(embeds, /slot="canvas"/);
  assert.doesNotMatch(embeds, /slot="threeD"/);
});

test("mobile requires an explicit Edit action before editor focus", async () => {
  const [mobile, script] = await Promise.all([
    read(componentPaths[2]),
    readScripts()
  ]);
  includes(mobile, ["Run first. Edit only when requested", "readonly", "Read-only until Edit", "Run does not focus the editor", "Edit unlocks and focuses source", "44px touch height"]);
  assert.doesNotMatch(mobile, /\bautofocus\b/i);
  const runMobile = script.match(/const runMobile = \(\) => \{[\s\S]*?\n  \};/)?.[0] ?? "";
  const editHandler = script.match(/edit\?\.addEventListener\("click", \(\) => \{[\s\S]*?\n  \}\);/)?.[0] ?? "";
  assert.ok(runMobile, "mobile Run handler must be inspectable");
  assert.doesNotMatch(runMobile, /\.focus\s*\(/);
  assert.match(editHandler, /editor\.readOnly = false/);
  assert.match(editHandler, /editor\.focus\(\)/);
});

test("Playground styling yields across widths without redefining protected tokens", async () => {
  const css = await readStyles();
  for (const selector of [
    ".playground-arrival-actions",
    ".playground-repository-loader",
    ".playground-workspace-shell",
    ".playground-editor-layout",
    ".playground-output-pane",
    ".playground-inline-embed",
    ".playground-expanded-embed",
    ".playground-sharing-grid",
    ".playground-phone",
    ".playground-adoption"
  ]) assert.match(css, new RegExp(escape(selector)));
  assert.match(css, /:focus-visible/);
  assert.match(css, /min-height: 44px/);
  assert.match(css, /overflow-x: clip/);
  assert.match(css, /@media \(max-width: 1180px\)/);
  assert.match(css, /@media \(max-width: 820px\)/);
  assert.match(css, /@media \(max-width: 500px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /--hara-[A-Za-z0-9_-]+\s*:/);
});

test("the adoption note states the simulation boundary and downstream ownership", async () => {
  const guide = await read("../V2-PLAYGROUND.md");
  includes(guide, [
    "interactive protocol and responsive-layout specimen, not a connected Hara evaluator",
    "docs.live-example@2.1.0",
    "learn.exercise@2.0.0",
    "learn.project@2.0.0",
    "Unified runtime envelope",
    "Backend selection never silently falls back",
    "**Disposal** is terminal and idempotent",
    "updates status and result without focusing the editor",
    "Shared visual-language package",
    "Playground application",
    "Runtime and registries"
  ]);
});

import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import {
  componentGroups,
  componentInventoryByName,
  publicComponentInventory,
  supportComponentInventory,
  toolComponentInventory,
  v2ComponentInventory
} from "../site/src/lib/v2-component-inventory.mjs";
import {
  catalogueHref,
  catalogueItemById,
  catalogueItemIsCurrent,
  catalogueLinkIsExternal
} from "../site/src/lib/v2-catalogue.mjs";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const pagePath = "../site/src/pages/v2/components/index.astro";

const requiredSections = [
  "inventory",
  "shell-navigation",
  "controls",
  "content-data",
  "tool-workbench",
  "compound-patterns",
  "states-accessibility",
  "ownership"
];

const compoundPatterns = [
  "pattern-search-table",
  "pattern-article-outline",
  "pattern-editor-inspector",
  "pattern-profile-ledger",
  "pattern-feed-discussion",
  "pattern-form-preview"
];

const sharedClassFamilies = [
  ".hara-v2-shell",
  ".hara-v2-header",
  ".hara-v2-context-nav",
  ".hara-v2-sidebar",
  ".hara-v2-main",
  ".hara-v2-page-header",
  ".hara-v2-button",
  ".hara-v2-icon-button",
  ".hara-v2-command-bar",
  ".hara-v2-field",
  ".hara-v2-select",
  ".hara-v2-panel",
  ".hara-v2-badge",
  ".hara-v2-tabs",
  ".hara-v2-table",
  ".hara-v2-matrix",
  ".hara-v2-code",
  ".hara-v2-prose",
  ".hara-v2-callout",
  ".hara-v2-outline",
  ".hara-v2-feed",
  ".hara-v2-story",
  ".hara-v2-profile-list",
  ".hara-v2-form-grid",
  ".hara-tool-toolbar",
  ".hara-tool-group",
  ".hara-tool-button",
  ".hara-tool-toggle",
  ".hara-tool-field",
  ".hara-tool-select",
  ".hara-tool-number-input",
  ".hara-tool-tab-strip",
  ".hara-tool-icon-rail",
  ".hara-tool-status-bar",
  ".hara-tool-workbench",
  ".hara-tool-dock-panel",
  ".hara-tool-panel-header",
  ".hara-tool-inspector-section",
  ".hara-tool-floating-palette",
  ".hara-tool-viewport-overlay"
];

test("the component route is an active internal catalogue destination", async () => {
  await access(new URL(pagePath, import.meta.url));
  const components = catalogueItemById("components");

  assert.ok(components);
  assert.equal(components.status, "active");
  assert.equal(components.issue, 35);
  assert.equal(catalogueHref(components, "/visual-language/"), "/visual-language/v2/components/");
  assert.equal(catalogueLinkIsExternal(components), false);
  assert.equal(catalogueItemIsCurrent(components, "/v2/components/"), true);
});

test("the visible inventory exactly matches every public Astro package export", async () => {
  const packageJson = JSON.parse(await read("../package.json"));
  const packageExports = Object.keys(packageJson.exports)
    .filter((path) => path.startsWith("./astro/"))
    .sort();
  const inventoryExports = publicComponentInventory.map(({ exportPath }) => exportPath).sort();

  assert.deepEqual(inventoryExports, packageExports);
  assert.equal(publicComponentInventory.length, 37);
  assert.equal(supportComponentInventory.length, 5);
  assert.equal(v2ComponentInventory.length, 32);
  assert.equal(toolComponentInventory.length, 26);

  assert.equal(new Set(publicComponentInventory.map(({ name }) => name)).size, publicComponentInventory.length);
  assert.equal(new Set(inventoryExports).size, inventoryExports.length);

  for (const component of publicComponentInventory) {
    await access(new URL(`../${component.sourcePath}`, import.meta.url));
    assert.ok(component.role.length > 12, `${component.name} needs a semantic role`);
    assert.ok(component.states.length > 0, `${component.name} needs states`);
    assert.ok(component.densities.length > 0, `${component.name} needs density guidance`);
    assert.ok(component.responsive.length > 12, `${component.name} needs responsive guidance`);
    assert.ok(component.accessibility.length > 12, `${component.name} needs accessibility guidance`);
  }
});

test("the inventory preserves the document, tool, environment, runtime, and support boundaries", () => {
  assert.deepEqual(componentGroups.map(({ id }) => id), [
    "support",
    "shell",
    "tool-controls",
    "tool-shell",
    "environment",
    "runtime"
  ]);

  for (const name of ["ThemeToggle", "HaraMark", "Motif", "Backdrop", "Surface"])
    assert.equal(componentInventoryByName(name)?.owner, "support");

  for (const name of ["Shell", "Header", "ContextNav", "Sidebar", "PageHeader", "FleetField"])
    assert.equal(componentInventoryByName(name)?.owner, "shared");

  for (const name of ["Toolbar", "ToolButton", "WorkbenchShell", "CapabilityPane", "EnvironmentWorkbench"])
    assert.equal(componentInventoryByName(name)?.owner, "tool");

  for (const name of ["StatusLamp", "RuntimeSwitch", "ConnectionRow", "CompactRuntimeShell", "RuntimeAppShell"])
    assert.equal(componentInventoryByName(name)?.owner, "runtime");
});

test("the page exposes the complete inventory and all required specimen families", async () => {
  const page = await read(pagePath);

  assert.match(page, /import CatalogueHeader/);
  assert.match(page, /activePath="\/v2\/components\/"/);
  assert.match(page, /import HaraMark/);
  assert.match(page, /import FleetField/);
  assert.match(page, /v2-component-inventory\.mjs/);
  assert.match(page, /src\/v2-tool\.css/);
  assert.match(page, /v2-components-catalogue\.css/);
  assert.match(page, /componentGroups\.map/);
  assert.match(page, /group\.components\.map/);
  assert.match(page, /component\.states\.join/);
  assert.match(page, /component\.densities\.join/);
  assert.match(page, /component\.responsive/);
  assert.match(page, /component\.accessibility/);
  assert.doesNotMatch(page, /<style(?:\s|>)/i);

  for (const id of requiredSections)
    assert.match(page, new RegExp(`id="${id}"`), `missing ${id}`);
});

test("the route demonstrates every major shared document and workbench CSS family", async () => {
  const [page, shell, components, content, toolControls, toolShell] = await Promise.all([
    read(pagePath),
    read("../src/v2/shell.css"),
    read("../src/v2/components.css"),
    read("../src/v2/content.css"),
    read("../src/v2/tool-controls.css"),
    read("../src/v2/tool-shell.css")
  ]);
  const sharedCss = [shell, components, content, toolControls, toolShell].join("\n");

  for (const className of sharedClassFamilies) {
    assert.ok(sharedCss.includes(className), `${className} is not backed by package CSS`);
    assert.ok(page.includes(className.slice(1)), `${className} is not represented on the route`);
  }
});

test("compound patterns compose shared primitives while naming product ownership", async () => {
  const page = await read(pagePath);

  for (const id of compoundPatterns)
    assert.match(page, new RegExp(`id="${id}"`), `missing ${id}`);

  for (const phrase of [
    "Search + filters + result table",
    "Article + metadata + outline",
    "Editor + viewport + inspector",
    "Profile + contribution ledger",
    "Feed item + discussion state",
    "Form + preview + validation summary"
  ]) assert.match(page, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.match(page, /<b>Shared<\/b>/);
  assert.match(page, /<b>Product<\/b>/);
  assert.match(page, /ranking, clustering, moderation, bot accountability/i);
  assert.match(page, /controlled fields and publication workflow/i);
});

test("states remain semantic, keyboard-visible, and understandable without colour or motion", async () => {
  const page = await read(pagePath);

  for (const state of ["default", "selected", "loading", "success", "warning", "danger", "disabled", "focus"])
    assert.match(page, new RegExp(`data-state="${state}"`), `missing ${state} state`);

  for (const contract of [
    /aria-busy="true"/,
    /aria-invalid="true"/,
    /aria-pressed="true"/,
    /aria-selected="true"/,
    /disabled>/,
    /aria-label="Copy exact revision"/,
    /Keyboard focus/,
    /Reduced motion/,
    /at least 34px height/
  ]) assert.match(page, contract);
});

test("the route documents package, catalogue, and product ownership without expanding the API", async () => {
  const page = await read(pagePath);

  for (const phrase of [
    "Package owns",
    "Catalogue owns",
    "Product owns",
    "Import the primitive; compose the product.",
    "Do not copy catalogue CSS into downstream sites",
    "v2.css",
    "v2-tool.css"
  ]) assert.match(page, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("catalogue styling is responsive, focus-visible, motion-safe, and contains no global protected-token definitions", async () => {
  const css = await read("../site/src/styles/v2-components-catalogue.css");

  for (const selector of [
    ".components-hero",
    ".components-section-nav",
    ".components-inventory-grid",
    ".components-demo-shell",
    ".components-controls-grid",
    ".components-content-grid",
    ".components-demo-workbench",
    ".components-pattern-grid",
    ".components-state-matrix",
    ".components-css-ledger",
    ".components-ownership-grid"
  ]) assert.match(css, new RegExp(selector.replace(".", "\\.")));

  assert.match(css, /:focus-visible/);
  assert.match(css, /@keyframes components-spin/);
  assert.match(css, /@media \(max-width: 1240px\)/);
  assert.match(css, /@media \(max-width: 980px\)/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /@media \(max-width: 440px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);

  // Component-level sizing hooks may be set on an individual specimen. The
  // catalogue must not redefine global theme, identity, state, or geometry tokens.
  const globalDefinitions = [...css.matchAll(/(--hara-[A-Za-z0-9_-]+)\s*:/g)]
    .map((match) => match[1])
    .filter((name) => name !== "--hara-tool-workbench-min-height");
  assert.deepEqual(globalDefinitions, []);
});

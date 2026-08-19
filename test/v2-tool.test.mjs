import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const readToolCss = async () => (await Promise.all([
  "../src/v2-tool.css",
  "../src/v2/tool-tokens.css",
  "../src/v2/tool-surfaces.css",
  "../src/v2/tool-controls.css",
  "../src/v2/tool-shell.css"
].map(read))).join("\n");

test("the tool layer is additive to v2 and exported independently", async () => {
  const [entry, packageJson] = await Promise.all([
    read("../src/v2-tool.css"),
    read("../package.json")
  ]);
  assert.match(entry, /@import "\.\/v2\.css"/);
  assert.match(entry, /tool-controls\.css/);
  assert.equal(JSON.parse(packageJson).exports["./v2-tool.css"], "./src/v2-tool.css");
});

test("tool themes expose the complete material contract", async () => {
  const css = await readToolCss();
  for (const token of [
    "bg", "bg-raised", "bg-recessed", "edge", "edge-strong", "glint",
    "shadow", "shadow-inset", "highlight", "noise", "signal", "warning", "danger"
  ]) assert.match(css, new RegExp(`--hara-tool-${token}:`), `missing --hara-tool-${token}`);
  assert.match(css, /:root\[data-theme="dark"\]/);
  assert.match(css, /prefers-color-scheme:\s*dark/);
});

test("tool surfaces cover raised, recessed, framed, clipped, and state variants", async () => {
  const css = await readToolCss();
  for (const name of [
    "hara-tool-surface", "hara-tool-surface--raised", "hara-tool-surface--recessed",
    "hara-tool-surface--framed", "hara-tool-surface--cut", "hara-tool-seam"
  ]) assert.match(css, new RegExp(`\\.${name}\\b`), `missing .${name}`);
  assert.match(css, /data-state="selected"/);
  assert.match(css, /data-state="warning"/);
  assert.match(css, /data-state="danger"/);
  assert.match(css, /focus-visible/);
});

test("toolbar and tool-widget components are exported with semantic state", async () => {
  const names = [
    "Toolbar", "ToolGroup", "ToolButton", "ToolToggle", "ToolSelect",
    "ToolNumberField", "TabStrip", "IconRail", "StatusBar"
  ];
  const packageJson = JSON.parse(await read("../package.json"));
  for (const name of names) {
    const key = `./astro/v2/tool/${name}.astro`;
    assert.equal(packageJson.exports[key], `./src/astro/v2/tool/${name}.astro`);
    await access(new URL(`../src/astro/v2/tool/${name}.astro`, import.meta.url));
  }

  const [toolbar, button, toggle, tabs, status] = await Promise.all([
    read("../src/astro/v2/tool/Toolbar.astro"),
    read("../src/astro/v2/tool/ToolButton.astro"),
    read("../src/astro/v2/tool/ToolToggle.astro"),
    read("../src/astro/v2/tool/TabStrip.astro"),
    read("../src/astro/v2/tool/StatusBar.astro")
  ]);
  assert.match(toolbar, /role="toolbar"/);
  assert.match(button, /aria-label=\{iconOnly/);
  assert.match(toggle, /aria-pressed=/);
  assert.match(tabs, /role="tablist"/);
  assert.match(tabs, /aria-selected=/);
  assert.match(status, /aria-live=/);
});

test("tool control CSS covers density, orientation, pressed, selected, and disabled states", async () => {
  const css = await readToolCss();
  for (const name of [
    "hara-tool-toolbar", "hara-tool-group", "hara-tool-button", "hara-tool-toggle",
    "hara-tool-select", "hara-tool-number-input", "hara-tool-tab-strip",
    "hara-tool-icon-rail", "hara-tool-status-bar"
  ]) assert.match(css, new RegExp(`\\.${name}\\b`), `missing .${name}`);
  assert.match(css, /data-density="dense"/);
  assert.match(css, /data-orientation="vertical"/);
  assert.match(css, /aria-pressed="true"/);
  assert.match(css, /aria-selected="true"/);
  assert.match(css, /:disabled/);
});

test("workbench structure exports explicit dock, overlay, inspector, and shell semantics", async () => {
  const names = [
    "WorkbenchShell", "DockPanel", "FloatingPalette", "ViewportOverlay",
    "InspectorSection", "PanelHeader"
  ];
  const packageJson = JSON.parse(await read("../package.json"));
  for (const name of names) {
    const key = `./astro/v2/tool/${name}.astro`;
    assert.equal(packageJson.exports[key], `./src/astro/v2/tool/${name}.astro`);
    await access(new URL(`../src/astro/v2/tool/${name}.astro`, import.meta.url));
  }

  const [shell, dock, palette, overlay, inspector] = await Promise.all([
    read("../src/astro/v2/tool/WorkbenchShell.astro"),
    read("../src/astro/v2/tool/DockPanel.astro"),
    read("../src/astro/v2/tool/FloatingPalette.astro"),
    read("../src/astro/v2/tool/ViewportOverlay.astro"),
    read("../src/astro/v2/tool/InspectorSection.astro")
  ]);
  for (const slot of ["top", "left", "viewport", "right", "bottom", "overlay", "status"])
    assert.match(shell, new RegExp(`Astro\\.slots\\.has\\("${slot}"\\)`), `missing ${slot} slot state`);
  assert.match(dock, /data-collapsed=/);
  assert.match(dock, /data-selected=/);
  assert.match(palette, /role="dialog"/);
  assert.match(overlay, /data-interactive=/);
  assert.match(inspector, /<details/);
});

test("workbench CSS preserves the viewport while secondary regions collapse", async () => {
  const css = await readToolCss();
  for (const name of [
    "hara-tool-workbench", "hara-tool-workbench-viewport", "hara-tool-dock-panel",
    "hara-tool-floating-palette", "hara-tool-viewport-overlay",
    "hara-tool-inspector-section", "hara-tool-panel-header"
  ]) assert.match(css, new RegExp(`\\.${name}\\b`), `missing .${name}`);
  assert.match(css, /@media \(max-width: 1120px\)[\s\S]*hara-tool-workbench-right/);
  assert.match(css, /@media \(max-width: 820px\)[\s\S]*hara-tool-workbench-left/);
  assert.match(css, /@media \(max-width: 640px\)[\s\S]*hara-tool-workbench-bottom/);
  assert.match(css, /grid-area:\s*viewport/);
});

test("the tool laboratory covers 3D, node/material, and animation workbenches", async () => {
  const [page, documentLab, specimens] = await Promise.all([
    read("../site/src/pages/v2/tool/index.astro"),
    read("../site/src/pages/v2/index.astro"),
    Promise.all([
      "ThreeDWorkbenchSpecimen", "NodeWorkbenchSpecimen", "AnimationWorkbenchSpecimen"
    ].map((name) => read(`../site/src/components/v2-tool/${name}.astro`))).then((parts) => parts.join("\n"))
  ]);

  for (const [name, id] of [
    ["ThreeDWorkbenchSpecimen", "three-d"],
    ["NodeWorkbenchSpecimen", "node"],
    ["AnimationWorkbenchSpecimen", "animation"]
  ]) {
    assert.match(page, new RegExp(`<${name}\\s*/>`), `missing ${name} composition`);
    assert.match(specimens, new RegExp(`id="${id}"`), `missing ${id} specimen`);
  }

  for (const primitive of [
    "WorkbenchShell", "Toolbar", "DockPanel", "PanelHeader", "InspectorSection",
    "ViewportOverlay", "StatusBar"
  ]) assert.match(specimens, new RegExp(primitive), `laboratory does not use ${primitive}`);

  assert.match(page, /v2-tool\.css/);
  assert.match(page, /class="hara-v2 hara-v2-tool"/);
  assert.match(documentLab, /v2\/tool\//);
});

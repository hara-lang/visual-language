import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("the package ships the tool contract and complete public component inventory", async () => {
  const packageJson = JSON.parse(await read("../package.json"));
  assert.ok(packageJson.files.includes("V2-TOOL.md"));
  assert.equal(packageJson.exports["./v2-tool.css"], "./src/v2-tool.css");

  for (const name of [
    "Toolbar", "ToolGroup", "ToolButton", "ToolToggle", "ToolSelect",
    "ToolNumberField", "TabStrip", "IconRail", "StatusBar", "WorkbenchShell",
    "DockPanel", "FloatingPalette", "ViewportOverlay", "InspectorSection", "PanelHeader"
  ]) {
    assert.equal(
      packageJson.exports[`./astro/v2/tool/${name}.astro`],
      `./src/astro/v2/tool/${name}.astro`,
      `missing ${name} export`
    );
  }
});

test("README distinguishes document and tool entry points with usable examples", async () => {
  const readme = await read("../README.md");
  assert.match(readme, /V2-THEME\.md/);
  assert.match(readme, /V2-TOOL\.md/);
  assert.match(readme, /@hara-lang\/visual-language\/v2\.css/);
  assert.match(readme, /@hara-lang\/visual-language\/v2-tool\.css/);
  assert.match(readme, /WorkbenchShell/);
  assert.match(readme, /hara-v2 hara-v2-tool/);
  assert.match(readme, /Product state, docking\s+engines/);
});

test("document and tool contracts cross-link and state the package boundary", async () => {
  const [documentContract, toolContract] = await Promise.all([
    read("../V2-THEME.md"),
    read("../V2-TOOL.md")
  ]);
  assert.match(documentContract, /V2-TOOL\.md/);
  assert.match(toolContract, /V2-THEME\.md/);
  assert.match(toolContract, /does \*\*not\*\* implement a docking engine/);
  assert.match(toolContract, /stateless Astro primitives/);
  assert.match(toolContract, /Import only `v2-tool\.css`; it already imports `v2\.css`/);
});

test("the tool contract covers tokens, components, responsive order, and accessibility", async () => {
  const contract = await read("../V2-TOOL.md");
  for (const token of [
    "--hara-tool-bg", "--hara-tool-bg-raised", "--hara-tool-bg-recessed",
    "--hara-tool-edge-strong", "--hara-tool-signal", "--hara-tool-control-dense"
  ]) assert.match(contract, new RegExp(token), `missing ${token}`);
  for (const component of [
    "Toolbar", "ToolButton", "TabStrip", "WorkbenchShell", "DockPanel",
    "FloatingPalette", "ViewportOverlay", "InspectorSection", "StatusBar"
  ]) assert.match(contract, new RegExp(`\\b${component}\\b`), `missing ${component}`);
  for (const breakpoint of ["1120px", "820px", "640px"])
    assert.match(contract, new RegExp(breakpoint), `missing ${breakpoint}`);
  assert.match(contract, /focus-visible/);
  assert.match(contract, /aria-pressed/);
  assert.match(contract, /reduced motion/i);
  assert.match(contract, /## Migration from document-only v2/);
  assert.match(contract, /## Release note/);
  assert.match(contract, /Existing v1 imports and existing `v2\.css`/);
});

test("the document and tool laboratories cross-link each other", async () => {
  const [documentLab, toolLab] = await Promise.all([
    read("../site/src/pages/v2/index.astro"),
    read("../site/src/pages/v2/tool/index.astro")
  ]);
  assert.match(documentLab, /v2\/tool\//);
  assert.match(toolLab, /documentLab/);
});

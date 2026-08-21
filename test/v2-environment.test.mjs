import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

const COMPONENTS = [
  "SectionNavigator",
  "EnvironmentSection",
  "FrontmatterGrid",
  "ResourceList",
  "CapabilityPane",
  "EnvironmentWorkbench"
];

test("environment widgets are exported as additive v2 tool components", async () => {
  const packageJson = JSON.parse(await read("../package.json"));
  for (const name of COMPONENTS) {
    const key = `./astro/v2/tool/${name}.astro`;
    assert.equal(packageJson.exports[key], `./src/astro/v2/tool/${name}.astro`);
    await access(new URL(`../src/astro/v2/tool/${name}.astro`, import.meta.url));
  }
  assert.ok(packageJson.files.includes("V2-ENVIRONMENT.md"));
});

test("section navigation connects tabs to stable environment panels", async () => {
  const [tabs, navigator, panel] = await Promise.all([
    read("../src/astro/v2/tool/TabStrip.astro"),
    read("../src/astro/v2/tool/SectionNavigator.astro"),
    read("../src/astro/v2/tool/EnvironmentSection.astro")
  ]);
  assert.match(tabs, /aria-controls=\{tab\.controls\}/);
  assert.match(tabs, /data-value=\{tab\.value \?\? tab\.id\}/);
  assert.match(tabs, /hara-tool-tab-badge/);
  for (const id of ["nav", "frontmatter", "graphics", "code"])
    assert.match(navigator, new RegExp(`id: "${id}"`), `missing ${id} section`);
  assert.match(navigator, /variant="sections"/);
  assert.match(panel, /role="tabpanel"/);
  assert.match(panel, /aria-labelledby=\{tabId\}/);
  assert.match(panel, /hidden=\{!active\}/);
  assert.match(panel, /data-section=\{section\}/);
});

test("frontmatter and resources expose semantic facts and live state", async () => {
  const [frontmatter, resources] = await Promise.all([
    read("../src/astro/v2/tool/FrontmatterGrid.astro"),
    read("../src/astro/v2/tool/ResourceList.astro")
  ]);
  assert.match(frontmatter, /<dl class="hara-tool-frontmatter-grid"/);
  assert.match(frontmatter, /<dt>\{entry\.label\}<\/dt>/);
  assert.match(frontmatter, /data-state=\{entry\.status\}/);
  assert.match(frontmatter, /data-code=\{entry\.code/);
  assert.match(resources, /data-resource-id=\{item\.id\}/);
  assert.match(resources, /aria-current=\{item\.current/);
  assert.match(resources, /data-resource-action=\{item\.id\}/);
  assert.match(resources, /hara-tool-resource-empty/);
});

test("capability pane renders only supplied session, file, canvas, and 3D slots", async () => {
  const pane = await read("../src/astro/v2/tool/CapabilityPane.astro");
  for (const [id, slot] of [
    ["sessions", "sessions"],
    ["files", "files"],
    ["canvas", "canvas"],
    ["three-d", "threeD"]
  ]) {
    assert.match(pane, new RegExp(`id: "${id}"`), `missing ${id} capability`);
    assert.match(pane, new RegExp(`Astro\\.slots\\.has\\("${slot}"\\)`), `missing ${slot} slot detection`);
  }
  assert.match(pane, /available\.length > 0/);
  assert.match(pane, /variant="groups"/);
  assert.match(pane, /data-active-group=\{selected\}/);
});

test("environment workbench composes the requested content and capability series", async () => {
  const workbench = await read("../src/astro/v2/tool/EnvironmentWorkbench.astro");
  for (const slot of [
    "nav", "frontmatter", "graphics", "code", "commands", "sessions",
    "files", "canvas", "threeD", "bottom", "overlay", "status"
  ]) assert.match(workbench, new RegExp(`Astro\\.slots\\.has\\("${slot}"\\)`), `missing ${slot} slot state`);
  assert.match(workbench, /<SectionNavigator/);
  assert.match(workbench, /<CapabilityPane/);
  assert.match(workbench, /data-control-pane=/);
  assert.match(workbench, /hasNamedCode \? <slot name="code" \/> : <slot \/>/);
});

test("environment CSS preserves calm hierarchy, state, and responsive yielding", async () => {
  const [entry, css] = await Promise.all([
    read("../src/v2-tool.css"),
    read("../src/v2/tool-environment.css")
  ]);
  assert.match(entry, /tool-environment\.css/);
  for (const name of [
    "hara-tool-section-navigator", "hara-tool-environment-stage",
    "hara-tool-frontmatter-grid", "hara-tool-resource-list",
    "hara-tool-capability-pane"
  ]) assert.match(css, new RegExp(`\\.${name}\\b`), `missing .${name}`);
  assert.match(css, /data-variant="sections"/);
  assert.match(css, /data-control-pane="collapsed"/);
  assert.match(css, /data-state="warning"/);
  assert.match(css, /@media \(max-width: 820px\)/);
  assert.match(css, /@media \(max-width: 560px\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test("the tool reference demonstrates the upstream environment composition", async () => {
  const [page, specimen, contract] = await Promise.all([
    read("../site/src/pages/v2/tool/index.astro"),
    read("../site/src/components/v2-tool/EnvironmentWorkbenchSpecimen.astro"),
    read("../V2-ENVIRONMENT.md")
  ]);
  assert.match(page, /<EnvironmentWorkbenchSpecimen \/>/);
  assert.match(page, /href: "#environment"/);
  for (const component of [
    "EnvironmentWorkbench", "FrontmatterGrid", "ResourceList",
    "InspectorSection", "ToolToggle", "StatusBar"
  ]) assert.match(specimen, new RegExp(component), `specimen does not use ${component}`);
  for (const label of ["Nav", "Frontmatter", "Graphics", "Code", "Sessions", "Files", "Canvas", "3D"])
    assert.match(contract, new RegExp(`\\*\\*${label}\\*\\*`), `contract does not name ${label}`);
  assert.match(contract, /No script is shipped with these widgets/);
  assert.match(contract, /Roll out to sites and products in separate downstream pull requests/);
});

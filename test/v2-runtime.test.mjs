import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("v2 tool entry includes the browser-runtime family", async () => {
  const entry = await read("../src/v2-tool.css");
  assert.match(entry, /tool-runtime\.css/);
});

test("browser-runtime components are exported and remain stateless", async () => {
  const packageJson = JSON.parse(await read("../package.json"));
  const names = [
    "StatusLamp",
    "RuntimeSwitch",
    "ConnectionRow",
    "CompactRuntimeShell",
    "RuntimeAppShell"
  ];

  for (const name of names) {
    const key = `./astro/v2/tool/${name}.astro`;
    assert.equal(packageJson.exports[key], `./src/astro/v2/tool/${name}.astro`);
    await access(new URL(`../src/astro/v2/tool/${name}.astro`, import.meta.url));
    assert.doesNotMatch(await read(`../src/astro/v2/tool/${name}.astro`), /<script\b/i);
  }

  assert.equal(packageJson.files.includes("V2-RUNTIME.md"), true);
});

test("connection controls distinguish requested and actual state", async () => {
  const [lamp, toggle, row] = await Promise.all([
    read("../src/astro/v2/tool/StatusLamp.astro"),
    read("../src/astro/v2/tool/RuntimeSwitch.astro"),
    read("../src/astro/v2/tool/ConnectionRow.astro")
  ]);

  assert.match(lamp, /data-state=/);
  assert.match(lamp, /hara-runtime-status-label/);
  assert.match(toggle, /type="checkbox"/);
  assert.match(toggle, /role="switch"/);
  assert.match(toggle, /aria-label=/);
  assert.match(row, /data-desired=/);
  assert.match(row, /hara-runtime-connection-state/);
  assert.match(row, /<output/);
});

test("compact and application shells expose explicit semantic regions", async () => {
  const [compact, app] = await Promise.all([
    read("../src/astro/v2/tool/CompactRuntimeShell.astro"),
    read("../src/astro/v2/tool/RuntimeAppShell.astro")
  ]);

  for (const slot of ["connections", "status", "error", "actions"])
    assert.match(compact, new RegExp(`Astro\\.slots\\.has\\("${slot}"\\)`));

  for (const region of [
    "hara-runtime-app-header",
    "hara-runtime-app-navigation",
    "hara-runtime-app-toolbar",
    "hara-runtime-app-main",
    "hara-runtime-app-inspector",
    "hara-runtime-app-bottom",
    "hara-runtime-app-status"
  ]) assert.match(app, new RegExp(region));

  assert.match(compact, /role="alert"/);
  assert.match(app, /<main/);
  assert.match(app, /<aside/);
});

test("runtime CSS covers compact geometry, state, focus, and responsive yielding", async () => {
  const css = await read("../src/v2/tool-runtime.css");
  for (const name of [
    "hara-runtime-compact",
    "hara-runtime-connection",
    "hara-runtime-status-lamp",
    "hara-runtime-switch",
    "hara-runtime-actions",
    "hara-runtime-app",
    "hara-runtime-app-main",
    "hara-runtime-app-inspector",
    "hara-runtime-app-bottom"
  ]) assert.match(css, new RegExp(`\\.${name}\\b`), `missing .${name}`);

  for (const state of [
    "ready", "connected", "starting", "stopping", "connecting",
    "attention", "warning", "danger", "error", "disabled"
  ]) assert.match(css, new RegExp(`data-state="${state}"`), `missing ${state} state`);

  assert.match(css, /focus-visible/);
  assert.match(css, /@media \(max-width: 1120px\)/);
  assert.match(css, /@media \(max-width: 820px\)/);
  assert.match(css, /@media \(max-width: 640px\)/);
  assert.match(css, /@media \(max-width: 400px\)/);
  assert.match(css, /prefers-reduced-motion/);
});

test("runtime documentation preserves the visual-versus-behaviour boundary", async () => {
  const [contract, readme] = await Promise.all([
    read("../V2-RUNTIME.md"),
    read("../README.md")
  ]);

  for (const phrase of [
    "requested state",
    "actual state",
    "exact-tab authority",
    "No script",
    "CompactRuntimeShell",
    "RuntimeAppShell",
    "320–380px"
  ]) assert.match(contract, new RegExp(phrase, "i"));

  assert.match(readme, /V2-RUNTIME\.md/);
  assert.match(readme, /browser-runtime/i);
});

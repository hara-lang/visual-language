import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const specimenNames = [
  "HaraChromePopupSpecimen",
  "HaraChromeRuntimeSpecimen",
  "HaraChromeChatGPTSpecimen",
  "HaraChromeTripoSpecimen",
  "HaraChromeDiagnosticsSpecimen"
];
const readSpecimens = async () => (await Promise.all(
  specimenNames.map((name) => read(`../site/src/components/v2-tool/${name}.astro`))
)).join("\n");

test("Hara Chrome has a dedicated v2 tool reference route", async () => {
  const [page, toolPage] = await Promise.all([
    read("../site/src/pages/tool/hara-chrome/index.astro"),
    read("../site/src/pages/tool/index.astro")
  ]);

  for (const name of specimenNames) assert.match(page, new RegExp(`<${name}\\s*/>`));
  assert.match(page, /v2-tool\.css/);
  assert.match(page, /v2-hara-chrome-lab\.css/);
  assert.match(page, /class="hara-v2 hara-v2-tool"/);
  for (const id of ["toolbar-popup", "runtime-app", "chatgpt-app", "tripo-app", "diagnostics-app"])
    assert.match(page, new RegExp(`#${id}|id=\\"${id}\\"`));

  assert.match(toolPage, /v2\/tool\/hara-chrome\//);
  assert.match(toolPage, /Hara Chrome/);
  assert.match(toolPage, /browser runtime \/ compact/);
});

test("screen specimens compose shared runtime and tool primitives", async () => {
  const specimens = await readSpecimens();
  for (const primitive of [
    "CompactRuntimeShell",
    "ConnectionRow",
    "StatusLamp",
    "RuntimeAppShell",
    "TabStrip",
    "Toolbar",
    "ToolGroup",
    "ToolButton",
    "ToolToggle",
    "StatusBar",
    "InspectorSection"
  ]) assert.match(specimens, new RegExp(primitive), `missing ${primitive}`);

  for (const screen of ["popup", "runtime", "chatgpt", "tripo", "diagnostics"])
    assert.match(specimens, new RegExp(`data-hara-chrome-screen=\\"${screen}\\"`));
});

test("toolbar specimen keeps desired and actual state separate", async () => {
  const source = await read("../site/src/components/v2-tool/HaraChromePopupSpecimen.astro");
  for (const label of [
    "Current tab",
    "Hara runtime",
    "RESP",
    "ChatGPT adapter",
    "Diagnostics",
    "DOM service",
    "Downloads",
    "Open REPL",
    "Reconnect",
    "Disconnect all"
  ]) assert.match(source, new RegExp(label));
  assert.match(source, /Desired/);
  assert.match(source, /Actual/);
  assert.match(source, /Exact tab only/);
  assert.match(source, /state="starting"[\s\S]*desired/);
});

test("individual apps represent current authority boundaries", async () => {
  const [runtime, chatgpt, tripo, diagnostics] = await Promise.all([
    read("../site/src/components/v2-tool/HaraChromeRuntimeSpecimen.astro"),
    read("../site/src/components/v2-tool/HaraChromeChatGPTSpecimen.astro"),
    read("../site/src/components/v2-tool/HaraChromeTripoSpecimen.astro"),
    read("../site/src/components/v2-tool/HaraChromeDiagnosticsSpecimen.astro")
  ]);

  assert.match(runtime, /shared offscreen host/i);
  assert.match(runtime, /indexeddb:hara-chrome/);
  assert.match(runtime, /browser\.diagnostics/);
  assert.match(chatgpt, /Credentials remain in Chromium/);
  assert.match(chatgpt, /Page JavaScript[\s\S]*not exposed/);
  assert.match(tripo, /Download confirmation/);
  assert.match(tripo, /Credit spending/);
  assert.match(tripo, /Automatic publication/);
  assert.match(diagnostics, /CDP Overlay/);
  assert.match(diagnostics, /Backend node/);
  assert.match(diagnostics, /No content script · no Runtime\.evaluate/);
});

test("the reference CSS covers popup, app, state, and responsive review widths", async () => {
  const entry = await read("../site/src/styles/v2-hara-chrome-lab.css");
  const css = (await Promise.all([
    "foundation",
    "apps",
    "diagnostics",
    "responsive"
  ].map((part) => read(`../site/src/styles/v2-hara-chrome-lab-${part}.css`)))).join("\n");

  for (const part of ["foundation", "apps", "diagnostics", "responsive"])
    assert.match(entry, new RegExp(`v2-hara-chrome-lab-${part}\\.css`));
  for (const name of [
    "hara-chrome-popup-stage",
    "hara-chrome-editor",
    "hara-chrome-site-app",
    "hara-chrome-chat-transcript",
    "hara-chrome-asset-grid",
    "hara-chrome-format-list",
    "hara-chrome-diagnostics-canvas",
    "hara-chrome-browser-frame",
    "hara-chrome-highlight-box",
    "hara-chrome-event-log"
  ]) assert.match(css, new RegExp(`\\.${name}\\b`), `missing .${name}`);

  for (const width of ["1120px", "900px", "640px", "400px"])
    assert.match(css, new RegExp(`max-width:\\s*${width}`));
  assert.match(css, /focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(css, /--hara-[\w-]+\s*:/, "reference CSS must not redefine protected Hara tokens");
});

test("the screen reference does not implement runtime behaviour", async () => {
  const [page, specimens] = await Promise.all([
    read("../site/src/pages/tool/hara-chrome/index.astro"),
    readSpecimens()
  ]);
  assert.doesNotMatch(specimens, /<script\b/i);
  assert.doesNotMatch(specimens, /chrome\.(runtime|tabs|debugger|downloads|offscreen)/);
  assert.doesNotMatch(specimens, /Runtime\.evaluate\s*\(|fetch\s*\(|new\s+WebSocket|content_scripts\s*:/);
  assert.doesNotMatch(page, /<script\b/i);
});

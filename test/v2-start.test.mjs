import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const sources = [
  "../site/src/pages/start/index.astro",
  ...["Hero", "Discover", "Choose", "Habitat", "HabitatWorkbench", "HabitatRail", "HabitatViewport", "HabitatInspector", "Mutate", "Graduate"]
    .map((name) => `../site/src/components/v2-start/Start${name}.astro`),
  ...["ui", "habitat", "canvas"].map((name) => `../site/src/scripts/v2-start-${name}.js`)
];
const readSource = async () => (await Promise.all(sources.map(read))).join("\n");
const readCss = async () => {
  const entry = await read("../site/src/styles/v2-start.css");
  const imports = [...entry.matchAll(/@import "(.+?)"/g)]
    .map(([, path]) => `../site/src/styles/${path.replace(/^\.\//, "")}`);
  return `${entry}\n${(await Promise.all(imports.map(read))).join("\n")}`;
};
const includes = (text, phrases) => phrases.forEach((phrase) => assert.match(text, new RegExp(escape(phrase), "i")));

test("Start covers discovery through a first live mutation", async () => {
  const source = await readSource();
  for (const id of ["brief", "discover", "choose", "habitat", "mutate", "graduate"])
    assert.match(source, new RegExp(`id="${id}"`));
  includes(source, ["Point your agent at Hara", "Make the agent show its evidence", "Choose by what changes on screen", "Hello, living world", "Change a rule. Keep the world", "Hello, living system"]);
});

test("the agent brief is repository-grounded and fail-closed", async () => {
  const source = await readSource();
  includes(source, ["Open https://github.com/hara-lang/hara", "Read README.md, GETTING_STARTED.md, AGENTS.md", "Do not begin with language history", "three concrete projects grounded in files and capabilities", "runs here, runs locally, prototype, experimental, or planned", "Never silently invent an API"]);
  assert.match(source, /data-copy-agent-brief/);
  assert.match(source, /id: "move"[\s\S]*id: "publish"/);
  assert.match(source, /copyAgentBrief/);
});

test("discovery exposes evidence, gaps, recipes, and capabilities", async () => {
  const source = await readSource();
  includes(source, ["Repository scan model", "Evidence ledger", "Canonical build catalogue", "proposed gap", "Habitat recipe", "candidate", "Fail closed", "Hara Habitat", "Work receipts", "Live inspector"]);
  for (const capability of ["session", "canvas", "clock", "work", "store", "executor", "events", "files"])
    assert.match(source, new RegExp(`(?:\\"|")${capability}(?:\\"|")`));
  assert.match(source, /data-run-scan/);
  assert.match(source, /runVisualScan/);
});

test("Habitat is interactive and explicitly a visual simulation", async () => {
  const source = await readSource();
  includes(source, ["visual simulation", "not connected to a Hara evaluator", "prototype host / no evaluator"]);
  for (const value of ["fear", "separation", "light", "speed"])
    assert.match(source, new RegExp(`data-world-control="${value}"`));
  assert.match(source, /id="habitat-canvas"/);
  assert.match(source, /data-workbench-tab="receipt"/);
  assert.match(source, /applyMutation/);
  assert.match(source, /renderReceipt/);
  assert.match(source, /ResizeObserver/);
  assert.match(source, /requestAnimationFrame\(drawHabitat\)/);
  assert.doesNotMatch(source, /\beval\s*\(/);
});

test("mutations advance source revision while reset advances generation", async () => {
  const source = await readSource();
  includes(source, ["request", "source patch", "state transition", "visible result", "Latest mutation receipt", "[:rules :fear-radius]", "Moths begin evasive movement farther from the bat"]);
  const mutation = source.match(/const applyMutation =[\s\S]*?Object\.entries\(controls\)/)?.[0] ?? "";
  assert.match(mutation, /world\.revision \+= 1/);
  assert.doesNotMatch(mutation, /world\.generation \+= 1/);
  assert.match(source, /data-reset-world[\s\S]*?world\.generation \+= 1/);
  assert.match(source, /:receipt\/id/);
  assert.match(source, /:status :applied/);
});

test("Start styles are product-owned, responsive, and motion-aware", async () => {
  const css = await readCss();
  for (const selector of [".start-agent-window", ".start-scan-pipeline", ".start-recipe-grid", ".start-workbench", ".start-habitat-viewport", ".start-inspector", ".start-live-receipt", ".start-graduation-grid"])
    assert.match(css, new RegExp(escape(selector)));
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media \(max-width: 820px\)/);
  assert.match(css, /@media \(max-width: 620px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /--hara-[A-Za-z0-9_-]+\s*:/);
});

test("the v2 catalogue advertises the active Start route", async () => {
  const [catalogue, page] = await Promise.all([
    read("../site/src/lib/v2-catalogue.mjs"),
    read("../site/src/pages/start/index.astro")
  ]);
  includes(catalogue, ["id: \"start\"", "label: \"Agent-first Start\"", "path: \"/start/\"", "href: \"/start/\"", "status: \"active\""]);
  assert.match(page, /import CatalogueHeader/);
  assert.match(page, /activePath="\/v2\/start\/"/);
});

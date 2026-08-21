import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  symbolFamilies,
  symbolInventory,
  symbolOpticalSizes
} from "../src/v2/symbols.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFile(resolve(root, path), "utf8");
const pagePath = "site/src/pages/v2/symbols/index.astro";
const stylePath = "site/src/styles/v2-symbols-guide.css";

test("the symbols guide route renders the public Symbol component and complete inventory", async () => {
  await access(resolve(root, pagePath));
  const page = await read(pagePath);
  assert.match(page, /import CatalogueHeader/);
  assert.match(page, /import Symbol from "\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/src\/astro\/v2\/Symbol\.astro"/);
  assert.match(page, /activePath="\/v2\/symbols\/"/);
  assert.match(page, /symbolInventory/);
  assert.match(page, /symbolFamilies/);
  assert.match(page, /symbolsByFamily/);
  assert.match(page, /symbolOpticalSizes/);
  assert.match(page, /Complete Hara v2 semantic symbol inventory/);
  assert.match(page, /Design-review fixture/);
  assert.match(page, /Meaning before glyph/i);
  assert.match(page, /Issue 102/);
  assert.ok((page.match(/<Symbol /g) ?? []).length >= 45, "guide must render realistic symbols directly");
});

test("guide compositions cover every semantic family and Hara route boundary", async () => {
  const page = await read(pagePath);
  for (const family of symbolFamilies) assert.match(page, new RegExp(`symbol-family-\\$\\{family\\.id\\}`));
  for (const product of ["www", "docs", "benchmarks", "playground", "specs", "packages", "world", "learn"])
    assert.match(page, new RegExp(`product-${product}`));
  for (const marker of [
    "Playground runtime controls",
    "Capability pane",
    "Specs and Packages lifecycle",
    "Products and accountable identity",
    "Docs and Benchmarks evidence",
    "Missing and incomparable evidence"
  ]) assert.match(page, new RegExp(marker));
  for (const symbol of [
    "action-run", "action-revoke", "state-ready", "state-unavailable", "state-missing",
    "capability-filesystem", "capability-audio", "evidence-revision", "evidence-owned-bot"
  ]) assert.match(page, new RegExp(`name=\\"${symbol}\\"`));
});

test("guide keeps the complete semantic inventory accessible as ordinary table data", async () => {
  const page = await read(pagePath);
  assert.match(page, /<table class="symbol-inventory-table">/);
  assert.match(page, /<caption>Complete Hara v2 semantic symbol inventory<\/caption>/);
  for (const heading of ["Identifier", "Label", "Family", "Text", "Tone", "Interactive", "Usage boundary"])
    assert.match(page, new RegExp(`<th>${heading}<\\/th>`));
  assert.match(page, /symbolInventory\.map/);
  assert.equal(symbolInventory.length, 65);
});

test("guide selection updates text and cloned SVG without persistence or unsafe HTML", async () => {
  const page = await read(pagePath);
  for (const marker of [
    "data-symbol-select",
    "data-symbol-inspector",
    "data-symbol-inspector-icon",
    "data-symbol-inspector-label",
    "data-symbol-inspector-usage"
  ]) assert.match(page, new RegExp(marker));
  assert.match(page, /cloneNode\(true\)/);
  assert.match(page, /replaceChildren\(copy\)/);
  assert.match(page, /textContent = value/);
  assert.match(page, /aria-pressed/);
  assert.doesNotMatch(page, /innerHTML|localStorage|sessionStorage|document\.cookie|fetch\(/);
});

test("guide styling preserves contained inventory, readable compact layouts and print delivery", async () => {
  const css = await read(stylePath);
  for (const selector of [
    ".symbol-guide-main",
    ".symbol-guide-hero",
    ".symbol-inspector-layout",
    ".symbol-inspector",
    ".symbol-composition-grid",
    ".symbol-inventory-table-wrap"
  ]) assert.match(css, new RegExp(selector.replace(".", "\\.")));
  assert.match(css, /overflow:\s*auto/);
  assert.match(css, /@media \(max-width: 980px\)/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /@media \(max-width: 390px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /@media print/);
  assert.doesNotMatch(css, /--hara-[A-Za-z0-9_-]+\s*:/, "guide must consume rather than redefine protected Hara tokens");
});

test("all public optical sizes are rendered in the geometry review", async () => {
  const page = await read(pagePath);
  assert.match(page, /symbolOpticalSizes\.map/);
  assert.deepEqual(symbolOpticalSizes, [16, 20, 24, 32]);
  assert.match(page, /One meaning across four optical sizes/);
});

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  symbolById,
  symbolFamilies,
  symbolFamilyById,
  symbolFixtureNotice,
  symbolInventory,
  symbolOpticalSizes,
  symbolShapeById,
  symbolShapes,
  symbolSummary,
  symbolTones,
  symbolViewBox,
  symbolsByFamily
} from "../src/v2/symbols.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFile(resolve(root, path), "utf8");

const expectedFamilyCounts = new Map([
  ["navigation", 8],
  ["action", 14],
  ["state", 14],
  ["capability", 13],
  ["product", 8],
  ["evidence", 8]
]);

test("public symbol inventory is deterministic, closed and shape-complete", () => {
  assert.equal(symbolInventory.length, 65);
  assert.equal(symbolSummary.symbols, 65);
  assert.equal(symbolFamilies.length, 6);
  assert.equal(Object.keys(symbolShapes).length, symbolInventory.length);
  assert.equal(new Set(symbolInventory.map(({ id }) => id)).size, symbolInventory.length);
  assert.equal(new Set(symbolInventory.map(({ shapeId }) => shapeId)).size, symbolInventory.length);
  assert.deepEqual(new Set(Object.keys(symbolShapes)), new Set(symbolInventory.map(({ id }) => id)));
  assert.equal(symbolFixtureNotice.productionAuthority, false);
  assert.match(symbolFixtureNotice.revision, /^symbol-fixture:[a-f0-9]{16}$/);
  assert.match(symbolFixtureNotice.summary, /deterministic design-review fixture/i);
  assert.match(symbolFixtureNotice.summary, /remain authoritative/i);
});

test("semantic families cover navigation, actions, state, capabilities, products and evidence exactly", () => {
  assert.deepEqual(symbolFamilies.map(({ id }) => id), [...expectedFamilyCounts.keys()]);
  for (const [family, count] of expectedFamilyCounts) {
    assert.equal(symbolsByFamily(family).length, count, `${family} inventory drifted`);
    assert.equal(symbolFamilyById(family)?.id, family);
  }
  assert.equal(symbolFamilyById("missing"), null);
  assert.equal(symbolById("action-run")?.label, "Run");
  assert.equal(symbolById("missing"), null);
  assert.equal(symbolShapeById("missing"), null);
});

test("the optical and currentColor contract is bounded and explicit", () => {
  assert.equal(symbolViewBox, "0 0 24 24");
  assert.deepEqual(symbolOpticalSizes, [16, 20, 24, 32]);
  assert.deepEqual(symbolTones, ["current", "signal", "success", "warning", "danger", "muted"]);
  for (const symbol of symbolInventory) {
    const shape = symbolShapeById(symbol.id);
    assert.ok(shape, `${symbol.id} is missing geometry`);
    assert.ok((shape.paths?.length ?? 0) + (shape.circles?.length ?? 0) + (shape.rects?.length ?? 0) > 0, `${symbol.id} has no visible geometry`);
  }
});

test("state, capability, product and evidence symbols remain text-supported", () => {
  for (const family of ["state", "capability", "product", "evidence"]) {
    assert.ok(symbolsByFamily(family).every(({ text }) => text === "required"), `${family} contains an unexplained icon-only symbol`);
  }
  assert.ok(symbolsByFamily("action").filter(({ destructive }) => destructive).every(({ text, tone }) => text === "required" && tone === "danger"));
  assert.deepEqual(
    symbolsByFamily("action").filter(({ destructive }) => destructive).map(({ id }) => id),
    ["action-reject", "action-revoke"]
  );
  assert.match(symbolById("state-unavailable")?.usage ?? "", /not automatically failure/i);
  assert.match(symbolById("state-missing")?.usage ?? "", /must not become a zero value/i);
  assert.match(symbolById("evidence-owned-bot")?.usage ?? "", /accountable to its present owner/i);
});

test("the Astro Symbol primitive is stateless and owns accessible SVG output", async () => {
  const source = await read("src/astro/v2/Symbol.astro");
  assert.match(source, /symbolById/);
  assert.match(source, /symbolShapeById/);
  assert.match(source, /viewBox=\{symbolViewBox\}/);
  assert.match(source, /stroke="currentColor"/);
  assert.match(source, /focusable="false"/);
  assert.match(source, /role=\{hidden \? undefined : "img"\}/);
  assert.match(source, /aria-hidden=\{hidden \? "true" : undefined\}/);
  assert.match(source, /aria-label=\{hidden \? undefined : accessibleLabel\}/);
  assert.match(source, /data-symbol=\{name\}/);
  assert.match(source, /Unknown Hara v2 symbol/);
  assert.match(source, /Unsupported Hara v2 symbol size/);
  assert.match(source, /Unsupported Hara v2 symbol tone/);
  assert.doesNotMatch(source, /addEventListener|localStorage|sessionStorage|document\.cookie|fetch\(/);
});

test("the public package exports the symbol manifest, component, stylesheet and written contract", async () => {
  const packageJson = JSON.parse(await read("package.json"));
  assert.equal(packageJson.exports["./v2-symbols.css"], "./src/v2/symbols.css");
  assert.equal(packageJson.exports["./symbols.js"], "./src/v2/symbols.mjs");
  assert.equal(packageJson.exports["./astro/v2/Symbol.astro"], "./src/astro/v2/Symbol.astro");
  assert.ok(packageJson.files.includes("V2-SYMBOLS.md"));
});

test("symbol stylesheet preserves currentColor, focus, touch, responsive and non-visual alternatives", async () => {
  const css = await read("src/v2/symbols.css");
  assert.match(css, /\.hara-v2-symbol\s*\{/);
  assert.match(css, /stroke:\s*currentColor/);
  assert.match(css, /\.hara-v2-symbol-button[\s\S]*min-width:\s*44px[\s\S]*min-height:\s*44px/);
  assert.match(css, /\.hara-v2-symbol-button:focus-visible/);
  assert.match(css, /\.hara-v2-symbol-state/);
  assert.match(css, /\.hara-v2-symbol-grid/);
  assert.match(css, /@media \(max-width: 680px\)/);
  assert.match(css, /@media \(max-width: 390px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /@media \(forced-colors: active\)/);
  assert.match(css, /@media print/);
  assert.doesNotMatch(css, /@font-face|font-family:\s*["']?(?:material|fontawesome|icon)/i);
  assert.doesNotMatch(css, /url\(/i, "essential symbols must not depend on external or raster assets");
  assert.doesNotMatch(css, /--hara-[A-Za-z0-9_-]+\s*:/, "symbols may consume but not redefine protected Hara tokens");
});

test("written contract covers semantics, accessibility, optical sizing, authority and compatibility adoption", async () => {
  const document = await read("V2-SYMBOLS.md");
  for (const phrase of [
    "Meaning before glyph",
    "Navigation and location",
    "Runtime capabilities",
    "Authority and evidence",
    "0 0 24 24",
    "16, 20, 24 and 32",
    "currentColor",
    "Icon-only controls",
    "Forced colours and print",
    "Ownership boundary",
    "v2-symbols.css",
    "merged Visual Language revision"
  ]) assert.match(document, new RegExp(phrase, "i"));
  assert.match(document, /`?Unavailable`? is not a synonym for `error`/);
  assert.match(document, /Product symbols (?:do not|never) replace the protected Hara block-H identity/i);
});

test("the Astro Symbol primitive compiles to a parseable module", async () => {
  const [{ transform: compileAstro }, { transform: parseWithEsbuild }] = await Promise.all([
    import("@astrojs/compiler"),
    import("esbuild")
  ]);
  const filename = resolve(root, "src/astro/v2/Symbol.astro");
  const source = await read("src/astro/v2/Symbol.astro");
  const compiled = await compileAstro(source, {
    filename,
    internalURL: "astro/runtime/server/index.js",
    sourcemap: "external"
  });
  await parseWithEsbuild(compiled.code, { loader: "ts", format: "esm", sourcemap: false });
});
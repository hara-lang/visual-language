import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { publicComponentInventory } from "../site/src/lib/v2-component-inventory.mjs";
import { ensureSymbolComponentInventory } from "../site/src/lib/v2-symbol-component-inventory.mjs";
import { componentShowcaseGroups, showcasedComponentNames } from "../site/src/lib/v2-component-showcase.mjs";

ensureSymbolComponentInventory();

const galleryPath = new URL("../site/src/components/v2-catalogue/RenderedComponentGallery.astro", import.meta.url);
const entryPath = new URL("../site/src/components/v2-catalogue/RenderedComponentGalleryEntry.astro", import.meta.url);
const symbolSpecimenPath = new URL("../site/src/components/v2-catalogue/RenderedSymbolSpecimen.astro", import.meta.url);
const headerPath = new URL("../site/src/components/v2-catalogue/CatalogueHeader.astro", import.meta.url);
const stylesheetPath = new URL("../site/src/styles/v2-component-showcase.css", import.meta.url);
const supportStylesheetPath = new URL("../site/src/styles/v2-component-showcase-support.css", import.meta.url);

const normalise = (values) => [...values].sort((left, right) => left.localeCompare(right));

test("the rendered gallery covers every public Astro export exactly once", () => {
  assert.equal(componentShowcaseGroups.length, 7);
  assert.equal(new Set(showcasedComponentNames).size, showcasedComponentNames.length, "showcase coverage contains duplicate exports");
  assert.deepEqual(normalise(showcasedComponentNames), normalise(publicComponentInventory.map((component) => component.name)));
});

test("the gallery imports and renders the public component implementations", async () => {
  const [gallery, entry, symbolSpecimen] = await Promise.all([
    readFile(galleryPath, "utf8"),
    readFile(entryPath, "utf8"),
    readFile(symbolSpecimenPath, "utf8")
  ]);
  const source = [gallery, entry, symbolSpecimen].join("\n");

  for (const component of publicComponentInventory) {
    assert.match(source, new RegExp(`import\\s+${component.name}\\s+from\\s+[\"'][^\"']*${component.name}\\.astro[\"']`), `${component.name} must be imported from its Astro implementation`);
    assert.ok(source.includes(`<${component.name}`), `${component.name} must be visibly rendered in the gallery`);
  }

  assert.match(gallery, /data-rendered-component-gallery/);
  assert.match(gallery, /These are the components\./);
  assert.match(entry, /RenderedSymbolSpecimen/);
  assert.match(entry, /const componentCount = 41/);
  assert.match(entry, /\$\{componentCount\} public exports/);
  assert.match(symbolSpecimen, /data-component-specimen=\{symbolGroup\.id\}/);
  assert.doesNotMatch(source, /components-mini-/i, "the gallery must not fall back to catalogue-only component lookalikes");
});

test("the components route mounts the rendered gallery directly after its hero", async () => {
  const source = await readFile(headerPath, "utf8");

  assert.match(source, /RenderedComponentGallery/);
  assert.match(source, /ensureSymbolComponentInventory/);
  assert.match(source, /resolvedActivePath.*v2\/components/s);
  assert.match(source, /data-components-showcase-mount/);
  assert.match(source, /hero\.after\(showcase\)/);
  assert.match(source, /setAttribute\(["']href["'],\s*["']#rendered-components["']\)/);
});

test("the rendered gallery has bounded responsive canvases and focus treatment", async () => {
  const [source, support] = await Promise.all([
    readFile(stylesheetPath, "utf8"),
    readFile(supportStylesheetPath, "utf8")
  ]);

  for (const selector of [
    ".v2-component-showcase-section",
    ".v2-component-specimen__canvas--identity",
    ".v2-component-specimen__canvas--shell",
    ".v2-component-specimen__canvas--controls",
    ".v2-component-specimen__canvas--workbench",
    ".v2-component-specimen__canvas--environment",
    ".v2-component-specimen__canvas--runtime"
  ]) assert.ok(source.includes(selector), `missing ${selector}`);

  assert.match(support, /\.v2-component-specimen__canvas--symbols/);
  assert.match(support, /@import "\.\.\/\.\.\/\.\.\/src\/v2\/symbols\.css"/);
  assert.match(source, /:focus-visible/);
  assert.match(source, /@media \(max-width: 720px\)/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(source, /--hara-(?:ink|paper|signal|line|surface)\s*:/, "the package-backed gallery stylesheet must consume protected tokens rather than redefine them");
  assert.doesNotMatch(support, /:root\s*\{/i, "route-local compatibility aliases must not become global token definitions");
  for (const alias of ["--hara-text-soft", "--hara-ink", "--hara-canvas", "--hara-background"])
    assert.match(support, new RegExp(`${alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*:\\s*var\\(--hara-v2-`));
});

const compileAstroSource = async (path) => {
  const [{ transform: compileAstro }, { transform: parseWithEsbuild }, { fileURLToPath }] = await Promise.all([
    import("@astrojs/compiler"),
    import("esbuild"),
    import("node:url")
  ]);
  const source = await readFile(path, "utf8");
  const filename = fileURLToPath(path);
  const compiled = await compileAstro(source, {
    filename,
    internalURL: "astro/runtime/server/index.js",
    sourcemap: "external"
  });

  try {
    await parseWithEsbuild(compiled.code, { loader: "ts", format: "esm", sourcemap: false });
  } catch (error) {
    const diagnostic = error?.errors?.[0];
    const line = diagnostic?.location?.line;
    const lines = compiled.code.split("\n");
    const start = Math.max(0, (line ?? 1) - 5);
    const end = Math.min(lines.length, (line ?? 1) + 4);
    const context = lines.slice(start, end).map((value, index) => `${start + index + 1}: ${value}`).join("\n");
    assert.fail(`${diagnostic?.text ?? error?.message ?? error}\n${context}`);
  }
};

test("the rendered gallery compiles to parseable Astro modules", async () => {
  await compileAstroSource(galleryPath);
  await compileAstroSource(entryPath);
  await compileAstroSource(symbolSpecimenPath);
});

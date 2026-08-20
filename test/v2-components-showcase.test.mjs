import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { publicComponentInventory } from "../site/src/lib/v2-component-inventory.mjs";
import { componentShowcaseGroups, showcasedComponentNames } from "../site/src/lib/v2-component-showcase.mjs";

const galleryPath = new URL("../site/src/components/v2-catalogue/RenderedComponentGallery.astro", import.meta.url);
const headerPath = new URL("../site/src/components/v2-catalogue/CatalogueHeader.astro", import.meta.url);
const stylesheetPath = new URL("../site/src/styles/v2-component-showcase.css", import.meta.url);

const normalise = (values) => [...values].sort((left, right) => left.localeCompare(right));

test("the rendered gallery covers every public Astro export exactly once", () => {
  assert.equal(componentShowcaseGroups.length, 6);
  assert.equal(new Set(showcasedComponentNames).size, showcasedComponentNames.length, "showcase coverage contains duplicate exports");
  assert.deepEqual(normalise(showcasedComponentNames), normalise(publicComponentInventory.map((component) => component.name)));
});

test("the gallery imports and renders the public component implementations", async () => {
  const source = await readFile(galleryPath, "utf8");

  for (const component of publicComponentInventory) {
    assert.match(source, new RegExp(`import\\s+${component.name}\\s+from\\s+[\"'][^\"']*${component.name}\\.astro[\"']`), `${component.name} must be imported from its Astro implementation`);
    assert.ok(source.includes(`<${component.name}`), `${component.name} must be visibly rendered in the gallery`);
  }

  assert.match(source, /data-rendered-component-gallery/);
  assert.match(source, /These are the components\./);
  assert.doesNotMatch(source, /components-mini-/i, "the gallery must not fall back to catalogue-only component lookalikes");
});

test("the components route mounts the rendered gallery directly after its hero", async () => {
  const source = await readFile(headerPath, "utf8");

  assert.match(source, /RenderedComponentGallery/);
  assert.match(source, /resolvedActivePath.*v2\/components/s);
  assert.match(source, /data-components-showcase-mount/);
  assert.match(source, /hero\.after\(showcase\)/);
  assert.match(source, /setAttribute\(["']href["'],\s*["']#rendered-components["']\)/);
});

test("the rendered gallery has bounded responsive canvases and focus treatment", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  for (const selector of [
    ".v2-component-showcase-section",
    ".v2-component-specimen__canvas--identity",
    ".v2-component-specimen__canvas--shell",
    ".v2-component-specimen__canvas--controls",
    ".v2-component-specimen__canvas--workbench",
    ".v2-component-specimen__canvas--environment",
    ".v2-component-specimen__canvas--runtime"
  ]) assert.ok(source.includes(selector), `missing ${selector}`);

  assert.match(source, /:focus-visible/);
  assert.match(source, /@media \(max-width: 720px\)/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(source, /--hara-(?:ink|paper|signal|line|surface)\s*:/, "the gallery must consume protected tokens rather than redefine them");
});

// Compile the specimen with the same parser boundary used by Astro's Vite plugin.
test("the rendered gallery compiles to a parseable Astro module", async () => {
  const [{ transform: compileAstro }, { transform: parseWithEsbuild }, { fileURLToPath }] = await Promise.all([
    import("@astrojs/compiler"),
    import("esbuild"),
    import("node:url")
  ]);
  const source = await readFile(galleryPath, "utf8");
  const filename = fileURLToPath(galleryPath);
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
});

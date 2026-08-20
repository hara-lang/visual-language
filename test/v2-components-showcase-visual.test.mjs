import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const headerPath = "../site/src/components/v2-catalogue/CatalogueHeader.astro";
const entryPath = "../site/src/components/v2-catalogue/RenderedComponentGalleryEntry.astro";
const galleryPath = "../site/src/components/v2-catalogue/RenderedComponentGallery.astro";
const galleryCssPath = "../site/src/styles/v2-component-showcase.css";
const supportCssPath = "../site/src/styles/v2-component-showcase-support.css";

test("the component catalogue loads a route-scoped visual gallery entrypoint", async () => {
  const [header, entry] = await Promise.all([read(headerPath), read(entryPath)]);

  assert.match(header, /import\("\.\/RenderedComponentGalleryEntry\.astro"\)/);
  assert.match(entry, /import "\.\.\/\.\.\/styles\/v2-component-showcase-support\.css"/);
  assert.match(entry, /import RenderedComponentGallery from "\.\/RenderedComponentGallery\.astro"/);
  assert.match(entry, /<RenderedComponentGallery \/>/);
});

test("the rendered support specimen loads every component style contract it uses", async () => {
  const [support, effects, motifs, graphics] = await Promise.all([
    read(supportCssPath),
    read("../src/effects.css"),
    read("../src/motifs.css"),
    read("../src/v2/graphics.css")
  ]);

  for (const dependency of [
    "../../../src/effects.css",
    "../../../src/motifs.css",
    "../../../src/v2/graphics.css"
  ]) assert.ok(support.includes(`@import "${dependency}";`), `missing ${dependency}`);

  assert.match(effects, /\.hara-backdrop\s*\{/);
  assert.match(motifs, /\.hara-motif\s*\{/);
  assert.match(graphics, /\.hara-v2-shader-field\s*\{/);
  assert.match(graphics, /--hara-graphics-ground/);
});

test("all showcase presentation tokens resolve to the authoritative v2 theme", async () => {
  const [gallery, support] = await Promise.all([read(galleryCssPath), read(supportCssPath)]);
  const presentationTokens = [
    "--hara-text-soft",
    "--hara-ink",
    "--hara-canvas",
    "--hara-background"
  ];

  for (const token of presentationTokens) {
    assert.ok(gallery.includes(`var(${token}`), `${token} is no longer referenced by the showcase`);
    assert.match(support, new RegExp(`${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*:\\s*var\\(--hara-v2-`), `${token} must resolve to v2`);
  }

  assert.doesNotMatch(support, /:root\s*\{/i, "showcase aliases must remain route-scoped");
});

test("ShaderField retains a visible signal-bearing fallback in dark mode", async () => {
  const [gallery, support] = await Promise.all([read(galleryPath), read(supportCssPath)]);

  assert.match(gallery, /<ShaderField[^>]*atmosphere="nocturne"/s);
  assert.match(support, /\.v2-component-showcase__shader\s*\{/);
  assert.match(support, /--hara-shader-fallback/);
  assert.match(support, /var\(--hara-v2-signal\)/);
  assert.match(support, /var\(--hara-graphics-ground\)/);
  assert.match(support, /var\(--hara-graphics-plate\)/);
});

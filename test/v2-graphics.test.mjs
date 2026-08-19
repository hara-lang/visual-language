import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("cinematic manifest exposes twelve fields, eight textures, six themes, and six shaders", async () => {
  const manifest = JSON.parse(await read("assets/cinematic/manifest.json"));
  assert.equal(manifest.canvas, "4096 x 2304");
  assert.equal(manifest.assets.length, 12);
  assert.equal(manifest.textures.length, 8);
  assert.equal(manifest.themes.length, 6);
  assert.equal(manifest.shaders.length, 6);
  assert.equal(new Set(manifest.assets.map(({ id }) => id)).size, 12);
  assert.equal(new Set(manifest.textures).size, 8);
});

test("every cinematic field is adaptive, accessible, theme-aware, and text-free", async () => {
  const manifest = JSON.parse(await read("assets/cinematic/manifest.json"));
  for (const asset of manifest.assets) {
    const path = `assets/cinematic/${asset.id}.svg`;
    await access(new URL(path, root));
    const source = await read(path);
    assert.match(source, /viewBox="0 0 4096 2304"/);
    assert.match(source, /role="img"/);
    assert.match(source, /aria-labelledby="title desc"/);
    assert.match(source, /<title id="title">[^<]+<\/title>/);
    assert.match(source, /<desc id="desc">[^<]+<\/desc>/);
    assert.match(source, /prefers-color-scheme:\s*dark/);
    assert.match(source, /#2f7cff/i);
    assert.match(source, /feTurbulence/);
    assert.doesNotMatch(source, /<text\b/i);
    assert.doesNotMatch(source, /#7957D5|#27B8B0/i);
  }
});

test("repeatable texture primitives are present and theme-aware", async () => {
  const manifest = JSON.parse(await read("assets/cinematic/manifest.json"));
  for (const texture of manifest.textures) {
    const path = `assets/cinematic/textures/${texture}.svg`;
    await access(new URL(path, root));
    const source = await read(path);
    assert.match(source, /viewBox="0 0 512 512"/);
    assert.match(source, /role="img"/);
    assert.match(source, /prefers-color-scheme:\s*dark/);
    assert.match(source, /#2f7cff/i);
  }
});

test("ShaderField is real WebGL progressive enhancement", async () => {
  const component = await read("src/astro/v2/ShaderField.astro");
  const styles = await read("src/v2/graphics.css");
  for (const mode of ["strata", "ink", "monolith", "lattice", "shimmer", "field"])
    assert.match(component, new RegExp(`\\"${mode}\\"`));
  for (const atmosphere of ["monolith", "silica", "foundry", "nocturne", "reliquary", "storm"])
    assert.match(component, new RegExp(`\\"${atmosphere}\\"`));
  assert.match(component, /getContext\("webgl"/);
  assert.match(component, /gl\.FRAGMENT_SHADER/);
  assert.match(component, /gl\.drawArrays\(gl\.TRIANGLES/);
  assert.match(component, /motion = false/);
  assert.match(component, /interactive = false/);
  assert.match(component, /IntersectionObserver/);
  assert.match(component, /ResizeObserver/);
  assert.match(component, /prefers-reduced-motion:\s*reduce/);
  assert.match(component, /webglcontextlost/);
  assert.match(component, /Math\.min\(window\.devicePixelRatio\|\|1,1\.75\)/);
  assert.match(styles, /data-atmosphere="storm"/);
  assert.match(styles, /data-state="fallback"/);
});

test("v2 publishes a dedicated graphics laboratory", async () => {
  const page = await read("site/src/pages/v2/graphics/index.astro");
  const docs = await read("V2-GRAPHICS.md");
  assert.match(page, /Twelve adaptive 4K fields/);
  assert.match(page, /Six real WebGL shader fields/);
  assert.match(page, /cinematic\.assets\.map/);
  assert.match(page, /cinematic\.textures\.map/);
  assert.match(page, /<ShaderField/);
  assert.match(docs, /Static imagery carries meaning/);
  assert.match(docs, /motion.*default to `false`/s);
  assert.doesNotMatch(docs, /Arcane|Dune/);
});

test("package and catalogue expose the graphics layer", async () => {
  const pkg = JSON.parse(await read("package.json"));
  const catalogue = await read("site/src/lib/v2-catalogue.mjs");
  assert.equal(pkg.exports["./v2-graphics.css"], "./src/v2/graphics.css");
  assert.equal(pkg.exports["./astro/v2/ShaderField.astro"], "./src/astro/v2/ShaderField.astro");
  assert.ok(pkg.files.includes("V2-GRAPHICS.md"));
  assert.match(catalogue, /id: "graphics"/);
  assert.match(catalogue, /href: "\/v2\/graphics\/"/);
});

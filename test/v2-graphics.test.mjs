import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const verifyRaster = async (path, dimensions, minimumSize) => {
  await access(new URL(path, root));
  const [metadata, file] = await Promise.all([
    sharp(new URL(path, root).pathname).metadata(),
    stat(new URL(path, root))
  ]);
  assert.equal(metadata.format, "webp");
  assert.equal(metadata.width, dimensions.width);
  assert.equal(metadata.height, dimensions.height);
  assert.ok(file.size > minimumSize, `${path} is unexpectedly small`);
};

test("cinematic manifest exposes ten max-resolution raster graphics", async () => {
  const manifest = JSON.parse(await read("assets/cinematic/manifest.json"));
  assert.equal(manifest.version, 2);
  assert.equal(manifest.raster.format, "WebP");
  assert.equal(manifest.raster.backgroundCanvas, "4096 x 2304");
  assert.equal(manifest.raster.textureCanvas, "4096 x 4096");
  assert.equal(manifest.raster.backgrounds.length, 6);
  assert.equal(manifest.raster.textures.length, 4);
  assert.equal(new Set(manifest.raster.backgrounds.map(({ id }) => id)).size, 6);
  assert.equal(new Set(manifest.raster.textures.map(({ id }) => id)).size, 4);
  assert.equal(manifest.themes.length, 6);
  assert.equal(manifest.shaders.length, 6);
});

test("all raster backgrounds are genuine 4096 by 2304 WebP masters", async () => {
  const manifest = JSON.parse(await read("assets/cinematic/manifest.json"));
  for (const asset of manifest.raster.backgrounds) {
    await verifyRaster(`assets/cinematic/${asset.file}`, { width: 4096, height: 2304 }, 70_000);
    await verifyRaster(`assets/cinematic/${asset.seed}`, { width: 384, height: 216 }, 2_000);
    assert.ok(asset.alt.length > 40, `${asset.id} needs useful alternative text`);
  }
});

test("all raster textures are genuine 4096 square WebP masters", async () => {
  const manifest = JSON.parse(await read("assets/cinematic/manifest.json"));
  for (const texture of manifest.raster.textures) {
    await verifyRaster(`assets/cinematic/${texture.file}`, { width: 4096, height: 4096 }, 200_000);
    await verifyRaster(`assets/cinematic/${texture.seed}`, { width: 256, height: 256 }, 2_000);
    assert.ok(texture.alt.length > 40, `${texture.id} needs useful alternative text`);
  }
});

test("the raster generator is deterministic, max-resolution, and texture-aware", async () => {
  const generator = await read("scripts/build-raster-graphics.mjs");
  assert.match(generator, /import sharp from "sharp"/);
  assert.match(generator, /4096, 2304/);
  assert.match(generator, /4096, 4096/);
  assert.match(generator, /mirroredTextureSeed/);
  assert.match(generator, /metadata\.format === "webp"/);
  assert.match(generator, /FORCE_RASTER/);
});

test("ShaderField remains real WebGL progressive enhancement", async () => {
  const component = await read("src/astro/v2/ShaderField.astro");
  const styles = await read("src/v2/graphics.css");
  for (const mode of ["strata", "ink", "monolith", "lattice", "shimmer", "field"])
    assert.match(component, new RegExp(`\\"${mode}\\"`));
  assert.match(component, /getContext\("webgl"/);
  assert.match(component, /gl\.FRAGMENT_SHADER/);
  assert.match(component, /gl\.drawArrays\(gl\.TRIANGLES/);
  assert.match(component, /motion = false/);
  assert.match(component, /interactive = false/);
  assert.match(component, /IntersectionObserver/);
  assert.match(component, /ResizeObserver/);
  assert.match(component, /prefers-reduced-motion:\s*reduce/);
  assert.match(component, /webglcontextlost/);
  assert.match(styles, /data-atmosphere="storm"/);
});

test("v2 publishes a raster-first graphics laboratory", async () => {
  const page = await read("site/src/pages/v2/graphics/index.astro");
  const docs = await read("V2-GRAPHICS.md");
  assert.match(page, /Six 4K cinematic backgrounds/);
  assert.match(page, /Four 4K material textures/);
  assert.match(page, /cinematic\.raster\.backgrounds/);
  assert.match(page, /cinematic\.raster\.textures/);
  assert.match(page, /4096 × 2304/);
  assert.match(page, /4096 × 4096/);
  assert.match(page, /\.webp/);
  assert.match(page, /<ShaderField/);
  assert.doesNotMatch(page, /Twelve adaptive 4K fields/);
  assert.doesNotMatch(page, /Open SVG/);
  assert.match(docs, /Raster delivery library/);
  assert.match(docs, /motion.*default to `false`/s);
  assert.doesNotMatch(docs, /Arcane|Dune/);
});

test("package and catalogue expose the graphics layer", async () => {
  const pkg = JSON.parse(await read("package.json"));
  const catalogue = await read("site/src/lib/v2-catalogue.mjs");
  assert.equal(pkg.scripts["assets:raster"], "node scripts/build-raster-graphics.mjs");
  assert.equal(pkg.exports["./v2-graphics.css"], "./src/v2/graphics.css");
  assert.equal(pkg.exports["./astro/v2/ShaderField.astro"], "./src/astro/v2/ShaderField.astro");
  assert.ok(pkg.files.includes("V2-GRAPHICS.md"));
  assert.ok(pkg.files.includes("assets"));
  assert.match(catalogue, /id: "graphics"/);
  assert.match(catalogue, /href: "\/v2\/graphics\/"/);
});

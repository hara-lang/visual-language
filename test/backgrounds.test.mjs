import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const backgrounds = [
  "evaluation-field.svg",
  "ast-field.svg",
  "symbol-lattice.svg",
  "dataflow-orbit.svg",
  "kernel-depth.svg",
];

test("material field system is exported from the package", async () => {
  const pkg = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
  assert.equal(pkg.homepage, "https://ui.hara-lang.org/");
  assert.equal(pkg.exports["./effects.css"], "./src/effects.css");
  assert.equal(
    pkg.exports["./astro/Backdrop.astro"],
    "./src/astro/Backdrop.astro",
  );
});

test("backgrounds are adaptive maximum-resolution material assets", async () => {
  for (const name of backgrounds) {
    const source = await readFile(
      new URL(`assets/backgrounds/${name}`, root),
      "utf8",
    );

    assert.match(source, /viewBox="0 0 4096 2304"/);
    assert.match(source, /role="img"/);
    assert.match(source, /<title id="title">/);
    assert.match(source, /<desc id="desc">/);
    assert.match(source, /prefers-color-scheme:\s*dark/);
    assert.match(source, /#2F7CFF/i);
    assert.doesNotMatch(source, /#7957D5|#27B8B0/i);
  }
});

test("live effects are restrained and motion is opt-in", async () => {
  const effects = await readFile(new URL("src/effects.css", root), "utf8");
  const component = await readFile(
    new URL("src/astro/Backdrop.astro", root),
    "utf8",
  );

  for (const effect of ["evaluation", "syntax", "lattice", "flow", "kernel"])
    assert.match(component, new RegExp(`\\"${effect}\\"`));

  assert.match(component, /motion = false/);
  assert.match(effects, /prefers-reduced-motion:\s*reduce/);
  assert.match(effects, /data-intensity="dense"/);
  assert.match(effects, /data-motion="on"/);
  assert.doesNotMatch(effects, /rotate\(1turn\)|field-breathe|radial-gradient\(circle at 14% 72%/);
});

test("material direction preserves the benchmark reference", async () => {
  const readme = await readFile(new URL("README.md", root), "utf8");
  const direction = await readFile(
    new URL("HARA-IMAGERY.md", root),
    "utf8",
  );
  const motifs = await readFile(new URL("src/motifs.css", root), "utf8");

  assert.match(readme, /Hara benchmarks hero/);
  assert.match(direction, /Rack.*benchmark page/s);
  assert.match(direction, /Do not replace them with biological reinterpretations/);
  assert.match(motifs, /rack-dark-2560\.avif/);
  assert.doesNotMatch(direction, /cyan → blue → violet/);
});

test("README links to the published Pages site", async () => {
  const readme = await readFile(new URL("README.md", root), "utf8");
  assert.match(readme, /https:\/\/ui\.hara-lang\.org\//);
});

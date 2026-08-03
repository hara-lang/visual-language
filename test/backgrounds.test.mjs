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

test("field system is exported from the package", async () => {
  const pkg = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
  assert.equal(pkg.homepage, "https://hara-lang.github.io/visual-language/");
  assert.equal(pkg.exports["./effects.css"], "./src/effects.css");
  assert.equal(pkg.exports["./astro/Backdrop.astro"], "./src/astro/Backdrop.astro");
});

test("backgrounds are accessible maximum-resolution vector assets", async () => {
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
  }
});

test("live effects expose variants and reduced-motion behavior", async () => {
  const effects = await readFile(new URL("src/effects.css", root), "utf8");
  const component = await readFile(
    new URL("src/astro/Backdrop.astro", root),
    "utf8",
  );

  for (const effect of ["evaluation", "syntax", "lattice", "flow", "kernel"])
    assert.match(component, new RegExp(`\\"${effect}\\"`));

  assert.match(effects, /prefers-reduced-motion:\s*reduce/);
  assert.match(effects, /data-intensity="dense"/);
  assert.match(effects, /data-motion="on"/);
});

test("README links to the published Pages site", async () => {
  const readme = await readFile(new URL("README.md", root), "utf8");
  assert.match(readme, /https:\/\/hara-lang\.github\.io\/visual-language\//);
});

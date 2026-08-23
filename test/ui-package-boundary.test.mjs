import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the visual-language repository is a private catalogue over independent UI packages", async () => {
  const packageJson = JSON.parse(await read("package.json"));
  assert.equal(packageJson.private, true);
  assert.equal(packageJson.exports, undefined);
  assert.equal(packageJson.dependencies["@hara-lang/ui"], "file:../../technology/hara-ui");
  assert.equal(packageJson.dependencies["@hara-lang/ui-astro"], "file:../../technology/hara-ui/packages/ui-astro");
  assert.equal(packageJson.dependencies["@hara-lang/ui-tool"], "file:../../technology/hara-ui/packages/ui-tool");
});

test("the catalogue entrypoints consume published package names", async () => {
  const [home, catalogue, tools] = await Promise.all([
    read("site/src/pages/index.astro"),
    read("site/src/pages/index.astro"),
    read("site/src/pages/tool/index.astro")
  ]);
  assert.match(home, /@hara-lang\/ui-astro\/astro\/v2\/FleetField\.astro/);
  assert.match(catalogue, /@hara-lang\/ui-astro\/astro\/v2\/FleetField\.astro/);
  assert.match(catalogue, /@hara-lang\/ui\/v2\.css/);
  assert.match(tools, /@hara-lang\/ui-tool\/v2-tool\.css/);
});

import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const readV2Css = async () => (await Promise.all([
  "../src/v2.css",
  "../src/v2/tokens.css",
  "../src/v2/shell.css",
  "../src/v2/components.css",
  "../src/v2/content.css",
  "../src/v2/responsive.css"
].map(read))).join("\n");

test("v2 is additive and preserves the Hara identity contract", async () => {
  const [css, mark] = await Promise.all([
    readV2Css(),
    read("../src/astro/HaraMark.astro")
  ]);

  assert.match(css, /@import "\.\/theme\.css"/);
  assert.match(css, /--hara-v2-font-heading:\s*var\(--hara-font-sans\)/);
  assert.match(css, /--hara-v2-signal:\s*#4d9cff/);
  assert.match(mark, /M10 8h13v18h18V8h13v48H41V38H23v18H10z/);
  assert.match(mark, /fill="var\(--hara-signal\)"/);
});

test("v2 exposes the shell and interface primitives needed by every site family", async () => {
  const css = await readV2Css();
  for (const name of [
    "hara-v2-header", "hara-v2-context-nav", "hara-v2-sidebar", "hara-v2-inspector",
    "hara-v2-page-header", "hara-v2-panel", "hara-v2-tabs", "hara-v2-table",
    "hara-v2-matrix", "hara-v2-prose", "hara-v2-feed", "hara-v2-profile-list"
  ]) assert.match(css, new RegExp(`\\.${name}\\b`), `missing .${name}`);

  for (const component of ["Shell", "Header", "ContextNav", "Sidebar", "PageHeader", "FleetField"])
    await access(new URL(`../src/astro/v2/${component}.astro`, import.meta.url));
});

test("the shell accounts for optional context and illustration slots", async () => {
  const [shell, pageHeader] = await Promise.all([
    read("../src/astro/v2/Shell.astro"),
    read("../src/astro/v2/PageHeader.astro")
  ]);
  assert.match(shell, /Astro\.slots\.has\("context"\)/);
  assert.match(shell, /data-context=/);
  assert.match(pageHeader, /Astro\.slots\.has\("illustration"\)/);
  assert.match(pageHeader, /data-illustrated=/);
});

test("the v2 laboratory covers WWW, Docs, Specs, Benchmarks, and World", async () => {
  const page = await read("../site/src/pages/v2/index.astro");
  const specimens = (await Promise.all([
    "WwwSpecimen", "DocsSpecimen", "SpecsSpecimen", "BenchmarksSpecimen", "WorldSpecimen"
  ].map((name) => read(`../site/src/components/v2/${name}.astro`)))).join("\n");

  for (const [name, id] of [
    ["WwwSpecimen", "www"],
    ["DocsSpecimen", "docs"],
    ["SpecsSpecimen", "specs"],
    ["BenchmarksSpecimen", "benchmarks"],
    ["WorldSpecimen", "world"]
  ]) {
    assert.match(page, new RegExp(`<${name}\\s*/>`), `missing ${name} composition`);
    assert.match(specimens, new RegExp(`id="${id}"`), `missing ${id} layout`);
  }
  assert.match(page, /FleetField/);
  assert.match(specimens, /data-layout="benchmarks"/);
  assert.match(specimens, /data-layout="world"/);
});

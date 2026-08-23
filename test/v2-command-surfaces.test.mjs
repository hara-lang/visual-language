import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("v2 publishes the command-surface retune after content and before responsive rules", async () => {
  const entry = await read("../src/v2.css");
  const content = entry.indexOf('./content.css');
  const commands = entry.indexOf('./command-surfaces.css');
  const responsive = entry.indexOf('./responsive.css');
  assert.ok(content >= 0 && commands > content && responsive > commands);
});

test("the retune strengthens operational seams without importing tool-only tokens", async () => {
  const css = await read("../src/v2/command-surfaces.css");
  for (const selector of [
    "hara-v2-header", "hara-v2-context-nav", "hara-v2-sidebar-link",
    "hara-v2-command-bar", "hara-v2-button", "hara-v2-panel",
    "hara-v2-card-grid", "hara-v2-tabs", "hara-v2-table-wrap",
    "hara-v2-feed", "hara-v2-profile-list"
  ]) assert.match(css, new RegExp(`\\.${selector}\\b`), `missing .${selector}`);
  assert.match(css, /aria-current="page"/);
  assert.match(css, /aria-selected="true"/);
  assert.doesNotMatch(css, /--hara-tool-/);
});

test("four catalogue references and the Learn World example use the retuned reference frame", async () => {
  const [page, learn, lab] = await Promise.all([
    read("../site/src/pages/index.astro"),
    read("../site/src/pages/learn/index.astro"),
    read("../site/src/styles/v2-command-retune.css")
  ]);

  assert.match(page, /v2-command-retune\.css/);
  assert.match(learn, /v2-command-retune\.css/);

  for (const name of ["WwwSpecimen", "DocsSpecimen", "SpecsSpecimen", "BenchmarksSpecimen"])
    assert.match(page, new RegExp(`<${name}\\s*/>`), `missing ${name}`);

  assert.doesNotMatch(page, /<WorldSpecimen\s*\/>/);
  assert.match(learn, /<WorldSpecimen\s*\/>/);

  for (const selector of ["v2-lab-canvas", "v2-lab-index", "v2-lab-notes"])
    assert.match(lab, new RegExp(`\\.${selector}\\b`), `missing .${selector}`);
});

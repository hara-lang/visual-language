import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const readToolCss = async () => (await Promise.all([
  "../src/v2-tool.css",
  "../src/v2/tool-tokens.css",
  "../src/v2/tool-surfaces.css"
].map(read))).join("\n");

test("the tool layer is additive to v2 and exported independently", async () => {
  const [entry, packageJson] = await Promise.all([
    read("../src/v2-tool.css"),
    read("../package.json")
  ]);
  assert.match(entry, /@import "\.\/v2\.css"/);
  assert.equal(JSON.parse(packageJson).exports["./v2-tool.css"], "./src/v2-tool.css");
});

test("tool themes expose the complete material contract", async () => {
  const css = await readToolCss();
  for (const token of [
    "bg", "bg-raised", "bg-recessed", "edge", "edge-strong", "glint",
    "shadow", "shadow-inset", "highlight", "noise", "signal", "warning", "danger"
  ]) assert.match(css, new RegExp(`--hara-tool-${token}:`), `missing --hara-tool-${token}`);
  assert.match(css, /:root\[data-theme="dark"\]/);
  assert.match(css, /prefers-color-scheme:\s*dark/);
});

test("tool surfaces cover raised, recessed, framed, clipped, and state variants", async () => {
  const css = await readToolCss();
  for (const name of [
    "hara-tool-surface", "hara-tool-surface--raised", "hara-tool-surface--recessed",
    "hara-tool-surface--framed", "hara-tool-surface--cut", "hara-tool-seam"
  ]) assert.match(css, new RegExp(`\\.${name}\\b`), `missing .${name}`);
  assert.match(css, /data-state="selected"/);
  assert.match(css, /data-state="warning"/);
  assert.match(css, /data-state="danger"/);
  assert.match(css, /focus-visible/);
});

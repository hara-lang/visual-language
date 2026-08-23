import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("document v2 loads the calm refinement after the structural layers", async () => {
  const entry = await read("../src/v2.css");
  const command = entry.indexOf('@import "./command-surfaces.css"');
  const responsive = entry.indexOf('@import "./responsive.css"');
  const calm = entry.indexOf('@import "./calm-surfaces.css"');

  assert.ok(command >= 0);
  assert.ok(responsive > command);
  assert.ok(calm > responsive);
});

test("the calm document layer reduces hard chrome without weakening state", async () => {
  const css = await read("../src/v2/calm-surfaces.css");

  assert.match(css, /--hara-v2-radius:\s*7px/);
  assert.match(css, /--hara-v2-motion:\s*190ms/);
  assert.match(css, /\.hara-v2-page-header[\s\S]*clip-path:\s*none/);
  assert.match(css, /\.hara-v2-button,[\s\S]*text-transform:\s*none/);
  assert.match(css, /\.hara-v2-context-items a\[aria-current="page"\]/);
  assert.match(css, /focus[\s\S]*0 0 0 3px/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test("the tool layer becomes roomier, quieter, and continuous", async () => {
  const [entry, css] = await Promise.all([
    read("../src/v2-tool.css"),
    read("../src/v2/tool-calm.css")
  ]);

  assert.ok(entry.indexOf('@import "./tool-calm.css"') > entry.indexOf('@import "./tool-shell.css"'));
  assert.match(css, /--hara-tool-control-dense:\s*30px/);
  assert.match(css, /--hara-tool-motion:\s*180ms/);
  assert.match(css, /--hara-tool-noise:\s*none/);
  assert.match(css, /\.hara-tool-workbench[\s\S]*border-radius:\s*12px/);
  assert.match(css, /\.hara-tool-panel-title[\s\S]*text-transform:\s*none/);
  assert.match(css, /\.hara-tool-surface--cut,[\s\S]*clip-path:\s*none/);
});

test("both references load the calm presentation and describe the refinement", async () => {
  const [documentLab, toolLab, labCss] = await Promise.all([
    read("../site/src/pages/index.astro"),
    read("../site/src/pages/tool/index.astro"),
    read("../site/src/styles/v2-calm-lab.css")
  ]);

  assert.match(documentLab, /v2-calm-lab\.css/);
  assert.match(toolLab, /v2-calm-lab\.css/);
  assert.match(documentLab, /Precision, with room to breathe\./);
  assert.match(toolLab, /Precision tools, made calm\./);
  assert.match(labCss, /\.v2-lab-canvas[\s\S]*border-radius:\s*14px/);
  assert.match(labCss, /\.tool-lab-index[\s\S]*gap:\s*\.7rem/);
});


test("the public contract records precision without armour", async () => {
  const [readme, contract] = await Promise.all([
    read("../README.md"),
    read("../V2-THEME.md")
  ]);

  assert.match(readme, /precision without armour/i);
  assert.match(contract, /## Surface rhythm/);
  assert.match(contract, /34px regular tool controls and 30px dense controls/);
  assert.match(contract, /clipped or chamfered geometry is\s+reserved for rare identity and hero moments/);
});

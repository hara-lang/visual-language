import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("v2 tool surfaces respond to their own inline size", async () => {
  const [entry, css] = await Promise.all([
    read("../src/v2-tool.css"),
    read("../src/v2/tool-responsive.css")
  ]);

  const runtimeImport = entry.indexOf('@import "./v2/tool-runtime.css";');
  const responsiveImport = entry.indexOf('@import "./v2/tool-responsive.css";');
  assert.ok(runtimeImport >= 0, "runtime styles must remain in the tool bundle");
  assert.ok(responsiveImport > runtimeImport, "responsive overrides must load last");

  for (const [selector, name] of [
    [".hara-tool-workbench", "hara-workbench"],
    [".hara-tool-environment", "hara-environment"],
    [".hara-tool-toolbar", "hara-toolbar"],
    [".hara-tool-status-bar", "hara-status"]
  ]) {
    assert.match(css, new RegExp(`${selector.replaceAll(".", "\\.")}\\s*\\{[\\s\\S]*?container-name:\\s*${name};`));
  }

  assert.match(css, /\.hara-tool-toolbar:not\(\[data-orientation="vertical"\]\)\s*\{[\s\S]*?flex-wrap:\s*wrap;[\s\S]*?overflow:\s*clip;/);
  assert.match(css, /@container hara-toolbar \(max-width: 720px\)[\s\S]*?\.hara-tool-group:not\(\[data-orientation="vertical"\]\)[\s\S]*?flex:\s*1 1 100%;/);
  assert.match(css, /@container hara-workbench \(max-width: 1120px\)[\s\S]*?\.hara-tool-workbench-right\s*\{[\s\S]*?display:\s*none;/);
  assert.match(css, /@container hara-workbench \(max-width: 820px\)[\s\S]*?\.hara-tool-workbench-left\s*\{[\s\S]*?display:\s*none;/);
  assert.match(css, /@container hara-environment \(max-width: 760px\)[\s\S]*?\.hara-tool-environment-top\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\);/);
  assert.match(css, /@container hara-status \(max-width: 460px\)[\s\S]*?flex:\s*1 1 100%;/);
});

test("the rendered catalogue keeps standalone environment panels in flow", async () => {
  const [entry, css] = await Promise.all([
    read("../site/src/components/v2-catalogue/RenderedComponentGalleryEntry.astro"),
    read("../site/src/styles/v2-component-showcase-responsive.css")
  ]);

  assert.match(entry, /import "\.\.\/\.\.\/styles\/v2-component-showcase-responsive\.css";/);
  assert.match(css, /\.v2-component-showcase__environment-primitives\s*\{[\s\S]*?repeat\(auto-fit, minmax\(min\(280px, 100%\), 1fr\)\);/);
  assert.match(css, /> \.hara-tool-environment-section\s*\{[\s\S]*?position:\s*relative;[\s\S]*?inset:\s*auto;/);
  assert.match(css, /> \.hara-tool-capability-pane\s*\{[\s\S]*?height:\s*auto;[\s\S]*?min-height:\s*260px;/);
  assert.match(css, /@container v2-showcase-controls \(max-width: 720px\)[\s\S]*?\.v2-component-showcase__control-body\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\);/);
  assert.match(css, /@container v2-showcase-environment \(max-width: 720px\)[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\);/);
});

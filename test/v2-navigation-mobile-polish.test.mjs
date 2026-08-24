import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("on-page navigation names its purpose and exposes the compact current-section control at every width", async () => {
  const sectionNav = await read("../site/src/components/v2-catalogue/CatalogueSectionNav.astro");

  assert.match(sectionNav, /label = "On this page"/);
  assert.match(sectionNav, /v2-catalogue-section-trigger-label/);
  assert.match(sectionNav, /v2-catalogue-section-trigger-current/);
  assert.match(sectionNav, /v2-catalogue-section-trigger-chevron/);
  assert.match(sectionNav, /data-catalogue-section-label/);
  assert.match(sectionNav, /Show \$\{label\.toLowerCase\(\)\} navigation/);
  assert.match(sectionNav, /const open = Boolean\(requestedOpen\)/);
  assert.doesNotMatch(sectionNav, /window\.matchMedia\("\(min-width: 841px\)"\)/);
  assert.doesNotMatch(sectionNav, /label = "Sections"/);
});

test("lower navigation typography is explicit and the mobile section control is not a large card", async () => {
  const [header, polish] = await Promise.all([
    read("../site/src/components/v2-catalogue/CatalogueHeader.astro"),
    read("../site/src/styles/v2-navigation-mobile-polish.css")
  ]);

  assert.match(header, /v2-navigation-mobile-polish\.css/);
  assert.match(polish, /\.v2-catalogue-family-tabs a[\s\S]*font: 600 13px\/1\.1 var\(--hara-v2-font-body\)/);
  assert.match(polish, /\.v2-catalogue-parent-link[\s\S]*font: 560 12px\/1\.2 var\(--hara-v2-font-body\)/);
  assert.match(polish, /\.v2-catalogue-section-links::before[\s\S]*content: "On this page"/);
  assert.match(polish, /\.v2-catalogue-section-trigger \{[\s\S]*min-height: 42px;[\s\S]*border: 0;[\s\S]*background: transparent;/);
  assert.match(polish, /@media \(max-width: 840px\)[\s\S]*\.v2-catalogue-section-trigger \{ display: grid; \}/);
  assert.match(polish, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(polish, /@media \(max-width: 560px\)[\s\S]*grid-template-columns: minmax\(0, 1fr\)/);
  assert.doesNotMatch(polish, /--hara-[A-Za-z0-9_-]+\s*:/);
});

test("historical studies use the same lower-menu type scale", async () => {
  const [entry, legacy] = await Promise.all([
    read("../src/v2.css"),
    read("../src/v2/catalogue-bridge-polish.css")
  ]);

  assert.match(entry, /catalogue-bridge-polish\.css/);
  assert.match(legacy, /\.v2-legacy-family-tabs a[\s\S]*font: 600 13px\/1\.1 var\(--hara-v2-font-body\)/);
  assert.match(legacy, /content: "On this page"/);
  assert.match(legacy, /font: 600 12px\/1\.2 var\(--hara-v2-font-body\)/);
  assert.doesNotMatch(legacy, /--hara-[A-Za-z0-9_-]+\s*:/);
});

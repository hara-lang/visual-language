#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const fixes = new Map([
  ["site/src/lib/v2-component-showcase.mjs", [
    [
      '{ name: "HaraMark", description: "Protected block-H identity mark.", anatomy: ["Signal square", "Positive cut-out", "Monogram body"] },\n      { name: "Motif",',
      '{ name: "HaraMark", description: "Protected block-H identity mark.", anatomy: ["Signal square", "Positive cut-out", "Monogram body"] },\n      { name: "HaraIcon", description: "Semantic icon wrapper for the shared Hara icon inventory.", anatomy: ["Named geometry", "Optical size", "Accessible label"] },\n      { name: "HaraGlyph", description: "Compact named glyph rendered from shared Hara vector geometry.", anatomy: ["Named geometry", "Current colour", "Accessible title"] },\n      { name: "Motif",'
    ]
  ]],
  ["site/src/components/v2-catalogue/RenderedComponentGallery.astro", [
    [
      'import HaraMark from "../../../../src/astro/HaraMark.astro";\n',
      'import HaraMark from "../../../../src/astro/HaraMark.astro";\nimport HaraIcon from "../../../../src/astro/HaraIcon.astro";\nimport HaraGlyph from "../../../../src/astro/HaraGlyph.astro";\n'
    ],
    ["38 rendered components", "40 rendered components"],
    [
      '<HaraMark size={52} title="Hara" /></div></article>',
      '<HaraMark size={52} title="Hara" /></div></article>\n          <article class="component-live-card"><header><span>HaraIcon</span><code>semantic icon</code></header><div class="component-live-preview"><HaraIcon name="run" size={32} label="Run" /></div></article>\n          <article class="component-live-card"><header><span>HaraGlyph</span><code>named glyph</code></header><div class="component-live-preview"><HaraGlyph name="session" size={32} title="Session" /></div></article>'
    ]
  ]],
  ["site/src/components/v2-catalogue/RenderedComponentGalleryEntry.astro", [
    ["componentCount={39}", "componentCount={41}"]
  ]],
  ["test/v2-components-catalogue.test.mjs", [
    ["assert.equal(publicComponentInventory.length, 39);", "assert.equal(publicComponentInventory.length, 41);"],
    ["assert.equal(componentFamilies.find(({ id }) => id === \"support\")?.components.length, 5);", "assert.equal(componentFamilies.find(({ id }) => id === \"support\")?.components.length, 7);"],
    [
      '["ThemeToggle", "HaraMark", "Motif", "Backdrop", "Surface"]',
      '["ThemeToggle", "HaraMark", "HaraIcon", "HaraGlyph", "Motif", "Backdrop", "Surface"]'
    ]
  ]],
  ["test/v2-components-showcase.test.mjs", [
    ["assert.equal(showcaseComponents.length, 38);", "assert.equal(showcaseComponents.length, 40);"],
    ["assert.equal(showcaseGroups.find(({ id }) => id === \"identity-atmosphere\")?.components.length, 5);", "assert.equal(showcaseGroups.find(({ id }) => id === \"identity-atmosphere\")?.components.length, 7);"],
    ["assert.match(gallery, /38 rendered components/);", "assert.match(gallery, /40 rendered components/);"]
  ]]
]);

for (const [relative, replacements] of fixes) {
  const file = path.join(root, relative);
  let source = await fs.readFile(file, "utf8");
  let changed = false;

  for (const [from, to] of replacements) {
    if (source.includes(to)) continue;
    if (!source.includes(from)) throw new Error(`${relative}: expected source fragment not found: ${from.slice(0, 120)}`);
    source = source.replace(from, to);
    changed = true;
  }

  if (changed) {
    await fs.writeFile(file, source);
    console.log(`aligned ${relative}`);
  }
}

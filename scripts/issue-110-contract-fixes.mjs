#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const fixes = new Map([
  ["site/src/lib/v2-component-showcase.mjs", [
    [
      '      showcase("HaraMark", "Identity", "Protected block-H mark, minimum size and signal-square use.", ["24px minimum", "Light/dark", "No lock-up distortion"]),\n      showcase("Motif",',
      '      showcase("HaraMark", "Identity", "Protected block-H mark, minimum size and signal-square use.", ["24px minimum", "Light/dark", "No lock-up distortion"]),\n      showcase("HaraIcon", "Identity", "Semantic icon wrapper for the shared Hara icon inventory.", ["16/20/24/32px", "Decorative or labelled", "currentColor"]),\n      showcase("HaraGlyph", "Identity", "Compact named glyph rendered from shared Hara vector geometry.", ["16/20/24/32px", "Decorative or labelled", "currentColor"]),\n      showcase("Motif",'
    ]
  ]],
  ["site/src/components/v2-catalogue/RenderedComponentGallery.astro", [
    [
      'import HaraMark from "../../../../src/astro/HaraMark.astro";\nimport Motif',
      'import HaraMark from "../../../../src/astro/HaraMark.astro";\nimport HaraIcon from "../../../../src/astro/HaraIcon.astro";\nimport HaraGlyph from "../../../../src/astro/HaraGlyph.astro";\nimport Motif'
    ],
    [
      '<span class="component-rendered-count">38 rendered components · public package exports</span>',
      '<span class="component-rendered-count">40 rendered components · public package exports</span>'
    ],
    [
      '<article class="component-live-card"><header><span>HaraMark</span><code>identity</code></header><div class="component-live-preview"><HaraMark size={52} title="Hara" /></div></article>\n          <article class="component-live-card component-live-card--wide"><header><span>Motif',
      '<article class="component-live-card"><header><span>HaraMark</span><code>identity</code></header><div class="component-live-preview"><HaraMark size={52} title="Hara" /></div></article>\n          <article class="component-live-card"><header><span>HaraIcon</span><code>semantic icon</code></header><div class="component-live-preview"><HaraIcon name="run" size={32} label="Run" /></div></article>\n          <article class="component-live-card"><header><span>HaraGlyph</span><code>named glyph</code></header><div class="component-live-preview"><HaraGlyph name="session" size={32} title="Session" /></div></article>\n          <article class="component-live-card component-live-card--wide"><header><span>Motif'
    ]
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
    ["assert.equal(showcaseGroups.find(({ id }) => id === \"identity\")?.components.length, 5);", "assert.equal(showcaseGroups.find(({ id }) => id === \"identity\")?.components.length, 7);"],
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

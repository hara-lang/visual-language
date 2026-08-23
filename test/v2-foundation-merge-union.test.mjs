import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  catalogueGroups,
  catalogueItemById,
  catalogueRouteContext
} from "../site/src/lib/v2-catalogue.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFile(resolve(root, path), "utf8");

const mergedRoutes = [
  "site/src/pages/diagrams/index.astro",
  "site/src/pages/symbols/index.astro",
  "site/src/pages/icons/index.astro",
  "site/src/pages/media/index.astro"
];

const mergedDocuments = [
  "V2-DIAGRAMS.md",
  "V2-SYMBOLS.md",
  "V2-ICONS.md",
  "V2-MEDIA.md"
];

test("concurrent foundation merges preserve the stable global menu groups", () => {
  assert.deepEqual(catalogueGroups.map(({ id }) => id), ["foundations", "library", "applications"]);
  assert.deepEqual(catalogueGroups.map(({ label }) => label), ["Foundations", "Library", "Applications"]);
});

test("Iconography is primary, Semantic Symbols is compatible, and Delivery Media is active", () => {
  const foundations = catalogueGroups.find(({ id }) => id === "foundations");
  assert.ok(foundations);

  const topLevelIds = foundations.items.map(({ id }) => id);
  assert.ok(topLevelIds.includes("icons"));
  assert.ok(topLevelIds.includes("media"));
  assert.equal(topLevelIds.includes("symbols"), false, "Semantic Symbols must not become a duplicate permanent top-level destination");

  const icons = catalogueItemById("icons");
  const symbols = catalogueItemById("symbols");
  const media = catalogueItemById("media");
  assert.ok(icons && symbols && media);
  assert.equal(icons.status, "active");
  assert.deepEqual(icons.children?.map(({ id }) => id), ["symbols"]);
  assert.equal(symbols.parentId, "icons");
  assert.equal(symbols.kind, "compatibility");
  assert.equal(symbols.status, "settled");
  assert.equal(media.status, "active");
  assert.equal(media.issue, 108);

  const symbolsContext = catalogueRouteContext("/symbols/");
  assert.equal(symbolsContext?.family.id, "icons");
  assert.equal(symbolsContext?.parent?.id, "icons");
  assert.equal(symbolsContext?.statusLabel, "Compatibility route");
  assert.deepEqual(symbolsContext?.siblings.map(({ id }) => id), ["icons", "symbols"]);
});

test("the package exports the complete merged additive union", async () => {
  const packageJson = JSON.parse(await read("package.json"));

  const expectedFiles = [
    "V2-DIAGRAMS.md",
    "V2-SYMBOLS.md",
    "V2-ICONS.md",
    "V2-MEDIA.md"
  ];
  for (const file of expectedFiles) assert.ok(packageJson.files.includes(file), `${file} is not packaged`);

  const expectedExports = {
    "./v2-diagrams.css": "./src/v2-diagrams.css",
    "./v2-symbols.css": "./src/v2/symbols.css",
    "./v2-icons.css": "./src/v2-icons.css",
    "./v2-media.css": "./src/v2-media.css",
    "./symbols.js": "./src/v2/symbols.mjs",
    "./icons.js": "./src/icons.mjs",
    "./astro/v2/Symbol.astro": "./src/astro/v2/Symbol.astro",
    "./astro/HaraIcon.astro": "./src/astro/HaraIcon.astro",
    "./astro/HaraGlyph.astro": "./src/astro/HaraGlyph.astro",
    "./astro/v2/DeliveryFrame.astro": "./src/astro/v2/DeliveryFrame.astro",
    "./astro/v2/ArtifactProvenance.astro": "./src/astro/v2/ArtifactProvenance.astro"
  };

  for (const [name, target] of Object.entries(expectedExports))
    assert.equal(packageJson.exports[name], target, `${name} drifted`);
});

test("all merged routes, public wrappers, components and written contracts remain present", async () => {
  for (const path of [...mergedRoutes, ...mergedDocuments]) await access(resolve(root, path));

  const expectedFiles = [
    "src/v2-diagrams.css",
    "src/v2/diagrams-accessibility.css",
    "src/v2/symbols.css",
    "src/v2-icons.css",
    "src/v2-media.css",
    "src/astro/v2/Symbol.astro",
    "src/astro/HaraIcon.astro",
    "src/astro/HaraGlyph.astro",
    "src/astro/v2/DeliveryFrame.astro",
    "src/astro/v2/ArtifactProvenance.astro"
  ];
  for (const path of expectedFiles) await access(resolve(root, path));

  const diagramsEntry = await read("src/v2-diagrams.css");
  assert.match(diagramsEntry, /@import "\.\/v2\/diagrams\.css"/);
  assert.match(diagramsEntry, /@import "\.\/v2\/diagrams-accessibility\.css"/);
});

test("README and catalogue guide explain the merged hierarchy without removing compatibility exports", async () => {
  const [readme, guide] = await Promise.all([
    read("README.md"),
    read("V2-GUIDE.md")
  ]);

  for (const phrase of [
    "v2-icons.css",
    "v2-symbols.css",
    "v2-media.css",
    "/icons/",
    "/symbols/",
    "/media/",
    "compatibility"
  ]) {
    assert.match(readme, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
    assert.match(guide, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }

  assert.match(readme, /primary current iconography/i);
  assert.match(readme, /Semantic symbols guide[\s\S]*compatibility surface/i);
  assert.match(guide, /Iconography[\s\S]*primary current/i);
  assert.match(guide, /Semantic Symbols[\s\S]*compatibility/i);
  assert.match(guide, /shared motion choreography[\s\S]*next unimplemented slice/i);
});

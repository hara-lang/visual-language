import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  haraGlyphCatalog,
  haraGlyphCategories,
  haraGlyphDefinition,
  haraGlyphNames,
  haraGlyphsInCategory,
  haraIconCatalog,
  haraIconCategories,
  haraIconDefinition,
  haraIconNames,
  haraIconsInCategory
} from "../src/icons.mjs";
import {
  capabilityExamples,
  capabilityStates,
  compositionExamples,
  evidenceExamples,
  iconFixtureNotice,
  iconGroups,
  iconPrinciples,
  iconSizeScale,
  iconSummary,
  productGlyphs,
  stateExamples
} from "../site/src/lib/v2-icons.mjs";
import {
  catalogueHref,
  catalogueItemById,
  catalogueItemIsCurrent
} from "../site/src/lib/v2-catalogue.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFile(resolve(root, path), "utf8");
const pagePath = "site/src/pages/v2/icons/index.astro";
const componentPaths = [
  "site/src/components/v2-icons/IconLibrary.astro",
  "site/src/components/v2-icons/IconStates.astro",
  "site/src/components/v2-icons/IconCapabilities.astro",
  "site/src/components/v2-icons/IconSemantics.astro"
];

const geometryKey = (definition) => JSON.stringify({
  paths: definition.paths,
  circles: definition.circles,
  rects: definition.rects,
  accentPaths: definition.accentPaths
});

const allDefinitions = [
  ...haraIconNames.map((name) => [name, haraIconCatalog[name]]),
  ...haraGlyphNames.map((name) => [name, haraGlyphCatalog[name]])
];

test("the public catalogue has stable interface, capability and product families", () => {
  assert.equal(haraIconNames.length, 41);
  assert.equal(haraGlyphNames.length, 22);
  assert.deepEqual(haraIconCategories.map(({ id }) => id), ["navigation", "action", "state", "evidence"]);
  assert.deepEqual(haraGlyphCategories.map(({ id }) => id), ["capability", "product"]);
  assert.equal(haraIconsInCategory("navigation").length, 12);
  assert.equal(haraIconsInCategory("action").length, 15);
  assert.equal(haraIconsInCategory("state").length, 11);
  assert.equal(haraIconsInCategory("evidence").length, 3);
  assert.equal(haraGlyphsInCategory("capability").length, 16);
  assert.equal(haraGlyphsInCategory("product").length, 6);
  assert.equal(haraIconDefinition("search")?.label, "Search");
  assert.equal(haraGlyphDefinition("product-world")?.label, "World");
  assert.equal(haraIconDefinition("not-an-icon"), null);
  assert.equal(haraGlyphDefinition("not-a-glyph"), null);
});

test("all public names and aliases are unique and product glyphs have distinct geometry", () => {
  const names = [...haraIconNames, ...haraGlyphNames];
  assert.equal(new Set(names).size, names.length);

  const aliases = allDefinitions.flatMap(([, definition]) => definition.aliases);
  assert.equal(new Set(aliases).size, aliases.length);
  for (const alias of aliases) assert.equal(names.includes(alias), false, `${alias} collides with a primary name`);

  const products = haraGlyphNames.filter((name) => haraGlyphCatalog[name].category === "product");
  assert.deepEqual(products, [
    "product-www",
    "product-playground",
    "product-specs",
    "product-packages",
    "product-world",
    "product-learn"
  ]);
  const productGeometry = products.map((name) => geometryKey(haraGlyphCatalog[name]));
  assert.equal(new Set(productGeometry).size, productGeometry.length, "product glyph geometry must remain distinct");
});

test("every icon and glyph has deterministic original SVG geometry", () => {
  for (const [name, definition] of allDefinitions) {
    const geometryCount = definition.paths.length + definition.circles.length + definition.rects.length + definition.accentPaths.length;
    assert.ok(geometryCount > 0, `${name} needs geometry`);
    assert.match(definition.label, /\S/);
    assert.match(definition.category, /^(navigation|action|state|evidence|capability|product)$/);
    for (const path of [...definition.paths, ...definition.accentPaths]) {
      assert.match(path, /^[Mm]/, `${name} paths must start with a move command`);
      assert.doesNotMatch(path, /<|>|javascript:|url\(/i);
    }
    for (const circle of definition.circles) {
      assert.ok(Number.isFinite(circle.cx) && Number.isFinite(circle.cy) && circle.r > 0, `${name} circle is invalid`);
    }
    for (const rect of definition.rects) {
      assert.ok(Number.isFinite(rect.x) && Number.isFinite(rect.y) && rect.width > 0 && rect.height > 0, `${name} rectangle is invalid`);
    }
  }

  const source = JSON.stringify({ haraIconCatalog, haraGlyphCatalog }).toLowerCase();
  for (const dependency of ["material icons", "lucide", "heroicons", "font awesome", "iconify"])
    assert.doesNotMatch(source, new RegExp(dependency));
});

test("directional navigation is explicit and state, evidence, capability and product geometry stays fixed", () => {
  assert.deepEqual(
    haraIconNames.filter((name) => haraIconCatalog[name].directional),
    ["back", "forward", "up"]
  );
  for (const name of haraIconNames.filter((name) => ["state", "evidence"].includes(haraIconCatalog[name].category)))
    assert.notEqual(haraIconCatalog[name].directional, true);
  for (const name of haraGlyphNames) assert.notEqual(haraGlyphCatalog[name].directional, true);
});

test("guide fixtures distinguish state evidence and capability lifecycle without becoming production authority", () => {
  assert.equal(iconFixtureNotice.productionAuthority, false);
  assert.match(iconFixtureNotice.summary, /products and runtimes remain authoritative/i);
  assert.match(iconFixtureNotice.revision, /^icons:[a-f0-9]{8}$/);
  assert.deepEqual(iconSizeScale, [16, 20, 24, 32, 48]);
  assert.deepEqual(iconGroups.map(({ id }) => id), ["navigation", "action", "state", "evidence"]);
  assert.equal(stateExamples.length, 11);
  assert.deepEqual(evidenceExamples.map(({ state }) => state), ["missing", "zero", "unsupported", "unavailable", "error"]);
  assert.deepEqual(capabilityStates.map(({ id }) => id), ["available", "requested", "attached", "degraded", "denied", "unavailable"]);
  assert.equal(capabilityExamples.length, 16);
  assert.equal(productGlyphs.length, 6);
  assert.equal(iconSummary.interfaceIcons, 41);
  assert.equal(iconSummary.capabilityGlyphs, 16);
  assert.equal(iconSummary.productGlyphs, 6);
});

test("product glyphs identify destinations and never appear in the action catalogue", () => {
  assert.deepEqual(productGlyphs.map(({ id }) => id), ["www", "playground", "specs", "packages", "world", "learn"]);
  for (const product of productGlyphs) {
    assert.equal(haraGlyphCatalog[product.glyph].category, "product");
    assert.match(product.route, /hara-lang\.org$/);
    assert.match(product.function, /\S/);
    assert.equal(haraIconCatalog[product.glyph], undefined);
  }
  assert.ok(iconPrinciples.some((principle) => /Product glyphs identify surfaces/i.test(principle)));
});

test("public Astro renderers enforce decorative and meaningful accessibility defaults", async () => {
  const [icon, glyph] = await Promise.all([
    read("src/astro/HaraIcon.astro"),
    read("src/astro/HaraGlyph.astro")
  ]);

  for (const component of [icon, glyph]) {
    assert.match(component, /decorative = !label/);
    assert.match(component, /role=\{decorative \? undefined : "img"\}/);
    assert.match(component, /aria-hidden=\{decorative \? "true" : undefined\}/);
    assert.match(component, /aria-label=\{decorative \? undefined : label\}/);
    assert.match(component, /focusable="false"/);
    assert.match(component, /requires a label/);
    assert.match(component, /Unknown Hara/);
    assert.match(component, /style=\{`width:\$\{size\}px;height:\$\{size\}px`\}/);
    assert.doesNotMatch(component, /tabindex|tabIndex/);
  }

  assert.match(icon, /viewBox="0 0 24 24"/);
  assert.match(glyph, /viewBox="0 0 32 32"/);
  assert.match(glyph, /class="hara-glyph-signal"/);
});

test("the iconography route is active in Foundations and composes all detailed guide surfaces", async () => {
  const route = catalogueItemById("icons");
  assert.ok(route);
  assert.equal(route.path, "/v2/icons/");
  assert.equal(route.href, "/v2/icons/");
  assert.equal(route.status, "active");
  assert.equal(route.issue, 106);
  assert.equal(catalogueHref(route, "/visual-language/"), "/visual-language/v2/icons/");
  assert.equal(catalogueItemIsCurrent(route, "/v2/icons/"), true);

  await access(resolve(root, pagePath));
  const page = await read(pagePath);
  assert.match(page, /import CatalogueHeader/);
  assert.match(page, /activePath="\/v2\/icons\/"/);
  assert.match(page, /src\/v2-icons\.css/);
  assert.match(page, /initialiseIconGuide/);
  for (const component of ["IconLibrary", "IconStates", "IconCapabilities", "IconSemantics"]) {
    assert.match(page, new RegExp(`import ${component} from`));
    assert.match(page, new RegExp(`<${component}\\s*/>`));
  }

  const combined = (await Promise.all(componentPaths.map(read))).join("\n");
  for (const id of ["library", "states", "capabilities", "products", "semantics", "adoption"])
    assert.match(combined, new RegExp(`id=\\"${id}\\"`));
  assert.match(combined, /Missing, zero, unsupported, unavailable and failed evidence/);
  assert.match(combined, /Availability, request and attachment are separate facts/);
  assert.match(combined, /Six products, one family, no borrowed logos/);
  assert.match(combined, /The SVG is never the keyboard target/);
});

test("review interactions filter and resize without persistence or authority mutation", async () => {
  const script = await read("site/src/scripts/v2-icons.js");
  for (const marker of ["data-icon-filter", "data-icon-scale", "data-icon-preview", "data-capability-filter", "data-capability-card"])
    assert.match(script, new RegExp(marker));
  assert.match(script, /setSvgSize/);
  assert.match(script, /style\.width/);
  assert.match(script, /export function initialiseIconGuide/);
  assert.doesNotMatch(script, /localStorage|sessionStorage|document\.cookie|fetch\(/);
});

test("the public CSS provides currentColor, RTL, 44px controls, forced colours and reduced motion", async () => {
  const [entry, css] = await Promise.all([
    read("src/v2-icons.css"),
    read("src/v2/icons.css")
  ]);
  assert.match(entry, /@import "\.\/v2\/icons\.css"/);
  assert.match(css, /\.hara-icon/);
  assert.match(css, /\.hara-glyph/);
  assert.match(css, /stroke:\s*currentColor/);
  assert.match(css, /\[dir="rtl"\] \.hara-icon\[data-directional="true"\]/);
  assert.match(css, /\.hara-icon-button[\s\S]*min-width:\s*44px[\s\S]*min-height:\s*44px/);
  assert.match(css, /\.hara-state-symbol/);
  assert.match(css, /\.hara-capability-card/);
  assert.match(css, /\.hara-product-launcher/);
  assert.match(css, /@media \(forced-colors: active\)/);
  assert.match(css, /HighlightText/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(`${entry}\n${css}`, /--hara-[A-Za-z0-9_-]+\s*:/, "icon styles must consume protected Hara tokens rather than redefine them");
});

test("route composition contains responsive, high-contrast and focus-visible contracts", async () => {
  const css = await read("site/src/styles/v2-icons-guide.css");
  for (const selector of [
    ".icon-library-grid",
    ".icon-state-layout",
    ".icon-capability-grid",
    ".icon-product-launcher-grid",
    ".icon-semantic-grid",
    ".icon-ownership-grid"
  ]) assert.match(css, new RegExp(selector.replace(".", "\\.")));
  assert.match(css, /:focus-visible/);
  assert.match(css, /overflow-x:\s*auto/);
  assert.match(css, /@media \(max-width: 680px\)/);
  assert.match(css, /@media \(max-width: 440px\)/);
  assert.match(css, /@media \(forced-colors: active\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /--hara-[A-Za-z0-9_-]+\s*:/);
});

test("package exports and written contract expose the complete additive iconography surface", async () => {
  const [packageJson, document] = await Promise.all([
    read("package.json").then(JSON.parse),
    read("V2-ICONS.md")
  ]);
  assert.equal(packageJson.exports["./icons.js"], "./src/icons.mjs");
  assert.equal(packageJson.exports["./v2-icons.css"], "./src/v2-icons.css");
  assert.equal(packageJson.exports["./astro/HaraIcon.astro"], "./src/astro/HaraIcon.astro");
  assert.equal(packageJson.exports["./astro/HaraGlyph.astro"], "./src/astro/HaraGlyph.astro");
  assert.ok(packageJson.files.includes("V2-ICONS.md"));

  for (const phrase of [
    "Originality contract",
    "Naming contract",
    "State and evidence vocabulary",
    "Runtime capability glyphs",
    "Product glyphs",
    "Accessibility contract",
    "RTL contract",
    "Ownership boundary",
    "Adding an icon or glyph",
    "must not become production state"
  ]) assert.match(document, new RegExp(phrase, "i"));
});

test("semantic examples cover decorative, parent-labelled and standalone meaningful composition", () => {
  assert.deepEqual(compositionExamples.map(({ id }) => id), ["visible-label", "icon-only", "standalone-meaning", "state-row", "product-link"]);
  const rules = compositionExamples.map(({ rule }) => rule).join(" ");
  assert.match(rules, /decorative/);
  assert.match(rules, /accessible name/);
  assert.match(rules, /role=img/);
  assert.match(rules, /written state/);
  assert.match(rules, /product name/);
});

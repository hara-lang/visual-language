import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import {
  catalogueGroups,
  catalogueHref,
  catalogueItemById,
  catalogueItemIsCurrent,
  catalogueItems,
  catalogueLinkIsExternal,
  catalogueStatusLabels
} from "../site/src/lib/v2-catalogue.mjs";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("the catalogue has three scalable groups and the complete top-level application family", () => {
  assert.deepEqual(catalogueGroups.map(({ id }) => id), ["foundations", "library", "applications"]);

  const applications = catalogueGroups.find(({ id }) => id === "applications");
  assert.ok(applications);
  assert.deepEqual(applications.items.map(({ label }) => label), [
    "WWW", "Playground", "Specs", "Packages", "World", "Learn"
  ]);

  const www = catalogueItemById("www");
  assert.deepEqual(www?.children?.map(({ label }) => label), ["Docs", "Benchmarks"]);

  const world = catalogueItemById("world");
  assert.deepEqual(world?.children?.map(({ label }) => label), [
    "Focused discussion", "Around Hara"
  ]);

  const learn = catalogueItemById("learn");
  assert.deepEqual(learn?.children?.map(({ label }) => label), [
    "Start here", "World interface examples", "Community reader study", "Programmer onboarding study"
  ]);
});

test("catalogue identifiers and canonical paths are unique", () => {
  const ids = catalogueItems.map(({ id }) => id);
  const paths = catalogueItems.map(({ path }) => path);
  assert.equal(new Set(ids).size, ids.length, "catalogue IDs must be unique");
  assert.equal(new Set(paths).size, paths.length, "catalogue paths must be unique");
});

test("planned routes resolve to implementation issues while current routes use the Pages base path", () => {
  const foundations = catalogueItemById("design-system");
  const tool = catalogueItemById("tool-workbenches");
  const world = catalogueItemById("world");
  const around = catalogueItemById("world-around");
  const learn = catalogueItemById("learn");

  assert.ok(foundations && tool && world && around && learn);
  assert.equal(catalogueHref(foundations, "/visual-language/"), "/visual-language/v2/foundations/");
  assert.equal(catalogueHref(tool, "/visual-language/"), "/visual-language/v2/tool/");
  assert.equal(catalogueHref(world, "/visual-language/"), "/visual-language/v2/world/");
  assert.equal(catalogueHref(around, "/visual-language/"), "/visual-language/v2/world/around/");
  assert.equal(catalogueHref(learn, "/visual-language/"), "/visual-language/v2/learn/");
  assert.equal(catalogueLinkIsExternal(foundations), false);
  assert.equal(catalogueLinkIsExternal(tool), false);
  assert.equal(catalogueLinkIsExternal(learn), false);
  assert.equal(catalogueItemIsCurrent(foundations, "/v2/foundations/"), true);
  assert.equal(catalogueItemIsCurrent(world, "/v2/world/discussion/"), true);
  assert.equal(catalogueItemIsCurrent(learn, "/v2/learn/#world-examples"), true);

  for (const item of catalogueItems.filter(({ status }) => status === "planned")) {
    assert.equal(typeof item.issue, "number", `${item.id} needs an implementation issue`);
    assert.equal(item.href, undefined, `${item.id} must not advertise an unbuilt route`);
  }

  assert.deepEqual(Object.keys(catalogueStatusLabels), ["planned", "active", "settled"]);
});

test("every implemented laboratory advertised by the manifest exists", async () => {
  for (const path of [
    "../site/src/pages/v2/foundations/index.astro",
    "../site/src/pages/v2/tool/index.astro",
    "../site/src/pages/v2/world/index.astro",
    "../site/src/pages/v2/world/discussion/index.astro",
    "../site/src/pages/v2/world/around/index.astro",
    "../site/src/pages/v2/world/community/index.astro",
    "../site/src/pages/v2/world/onboarding/index.astro",
    "../site/src/pages/v2/learn/index.astro"
  ]) await access(new URL(path, import.meta.url));
});

test("the shared header composes grouped button disclosures from small components", async () => {
  const [header, group, item, child, fallback] = await Promise.all([
    read("../site/src/components/v2-catalogue/CatalogueHeader.astro"),
    read("../site/src/components/v2-catalogue/CatalogueGroup.astro"),
    read("../site/src/components/v2-catalogue/CatalogueMenuItem.astro"),
    read("../site/src/components/v2-catalogue/CatalogueChildLink.astro"),
    read("../site/src/components/v2-catalogue/CatalogueFallback.astro")
  ]);

  assert.match(header, /import CatalogueGroup/);
  assert.match(header, /<CatalogueGroup group=\{foundations\}/);
  assert.match(header, /<CatalogueGroup group=\{library\}/);
  assert.match(header, /<CatalogueGroup group=\{applications\}/);
  assert.match(header, /data-catalogue-menu-button/);
  assert.match(header, /aria-controls="v2-catalogue-navigation"/);
  assert.match(header, /event\.key !== "Escape"/);
  assert.match(header, /header\.contains\(event\.target\)/);
  assert.match(header, /document\.addEventListener\("astro:page-load"/);
  assert.match(header, /v2-mobile-polish\.css/);

  assert.match(group, /data-catalogue-group-trigger/);
  assert.match(group, /aria-controls={`v2-catalogue-panel-\$\{group\.id\}`}/);
  assert.match(group, /items\.map\(\(item\) => <CatalogueMenuItem/);
  assert.match(item, /item\.children\.map\(\(child\) => <CatalogueChildLink/);
  assert.match(child, /catalogueStatusLabels\[child\.status\]/);
  assert.match(fallback, /fallbackMarkup = `<noscript>/);
  assert.match(fallback, /catalogueHref\(item, basePath\)/);
  assert.match(fallback, /<Fragment set:html=\{fallbackMarkup\}/);
});

test("the catalogue home preserves four references and Learn owns the guided World specimen", async () => {
  const [page, learn] = await Promise.all([
    read("../site/src/pages/v2/index.astro"),
    read("../site/src/pages/v2/learn/index.astro")
  ]);

  assert.match(page, /import CatalogueHeader/);
  assert.match(page, /catalogueGroups\.map/);
  assert.match(page, /Shared foundations first\. Product detail where it belongs\./);
  assert.match(page, /Planned routes lead to their implementation issue/);
  assert.doesNotMatch(page, /const ecosystem = \[/);

  for (const name of ["WwwSpecimen", "DocsSpecimen", "SpecsSpecimen", "BenchmarksSpecimen"])
    assert.match(page, new RegExp(`<${name}\\s*/>`), `missing ${name}`);

  assert.doesNotMatch(page, /<WorldSpecimen\s*\/>/);
  assert.match(learn, /import WorldSpecimen/);
  assert.match(learn, /<WorldSpecimen\s*\/>/);

  assert.match(page, /const learnLab = `\$\{basePath\}v2\/learn\/`/);
  assert.match(page, /const worldDiscussionLab = `\$\{basePath\}v2\/world\/discussion\/`/);
  assert.match(page, /const worldAroundLab = `\$\{basePath\}v2\/world\/around\/`/);
  assert.match(page, /Open Learn/);
  assert.match(page, /Focused World discussion/);
  assert.match(page, /Around Hara feed explorer/);
});

test("catalogue styling includes focus, compact mobile disclosure, and reduced-motion contracts", async () => {
  const [css, disclosure, mobile] = await Promise.all([
    read("../site/src/styles/v2-catalogue.css"),
    read("../site/src/styles/v2-catalogue-disclosure.css"),
    read("../site/src/styles/v2-mobile-polish.css")
  ]);
  const combined = `${css}\n${disclosure}\n${mobile}`;

  for (const selector of [
    ".v2-catalogue-header",
    ".v2-catalogue-menu-button",
    ".v2-catalogue-group-trigger",
    ".v2-catalogue-panel",
    ".v2-catalogue-card-grid",
    ".v2-catalogue-children",
    ".v2-lab-quick-links"
  ]) assert.match(combined, new RegExp(selector.replace(".", "\\.")));

  assert.match(combined, /:focus-visible/);
  assert.match(combined, /data-menu-open="false"/);
  assert.match(combined, /data-open="true"/);
  assert.match(combined, /@media \(max-width: 840px\)/);
  assert.match(combined, /@media \(max-width: 820px\)/);
  assert.match(combined, /@media \(max-width: 560px\)/);
  assert.match(combined, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(combined, /--hara-[A-Za-z0-9_-]+\s*:/);
});

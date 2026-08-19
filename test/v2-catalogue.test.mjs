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
    "Discussion", "Around Hara"
  ]);

  const learn = catalogueItemById("learn");
  assert.deepEqual(learn?.children?.map(({ label }) => label), [
    "Start here", "Agent-first Start", "World interface examples", "Community reader study", "Programmer onboarding study"
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
  const components = catalogueItemById("components");
  const tool = catalogueItemById("tool-workbenches");
  const world = catalogueItemById("world");
  const around = catalogueItemById("world-around");
  const learn = catalogueItemById("learn");
  const start = catalogueItemById("start");

  assert.ok(foundations && components && tool && world && around && learn && start);
  assert.equal(catalogueHref(foundations, "/visual-language/"), "/visual-language/v2/foundations/");
  assert.equal(catalogueHref(components, "/visual-language/"), "/visual-language/v2/components/");
  assert.equal(catalogueHref(tool, "/visual-language/"), "/visual-language/v2/tool/");
  assert.equal(catalogueHref(world, "/visual-language/"), "/visual-language/v2/world/");
  assert.equal(catalogueHref(around, "/visual-language/"), "/visual-language/v2/world/around/");
  assert.equal(catalogueHref(learn, "/visual-language/"), "/visual-language/v2/learn/");
  assert.equal(catalogueHref(start, "/visual-language/"), "/visual-language/v2/start/");
  assert.equal(catalogueLinkIsExternal(foundations), false);
  assert.equal(catalogueLinkIsExternal(components), false);
  assert.equal(catalogueLinkIsExternal(tool), false);
  assert.equal(catalogueLinkIsExternal(learn), false);
  assert.equal(catalogueLinkIsExternal(start), false);
  assert.equal(catalogueItemIsCurrent(foundations, "/v2/foundations/"), true);
  assert.equal(catalogueItemIsCurrent(components, "/v2/components/"), true);
  assert.equal(catalogueItemIsCurrent(world, "/v2/world/discussion/"), true);
  assert.equal(catalogueItemIsCurrent(learn, "/v2/learn/#world-examples"), true);
  assert.equal(catalogueItemIsCurrent(start, "/v2/start/"), true);

  for (const item of catalogueItems.filter(({ status }) => status === "planned")) {
    assert.equal(typeof item.issue, "number", `${item.id} needs an implementation issue`);
    assert.equal(item.href, undefined, `${item.id} must not advertise an unbuilt route`);
  }

  assert.deepEqual(Object.keys(catalogueStatusLabels), ["planned", "active", "settled"]);
});

test("every implemented laboratory advertised by the manifest exists", async () => {
  for (const path of [
    "../site/src/pages/v2/foundations/index.astro",
    "../site/src/pages/v2/components/index.astro",
    "../site/src/pages/v2/tool/index.astro",
    "../site/src/pages/v2/world/index.astro",
    "../site/src/pages/v2/world/discussion/index.astro",
    "../site/src/pages/v2/world/around/index.astro",
    "../site/src/pages/v2/world/community/index.astro",
    "../site/src/pages/v2/world/onboarding/index.astro",
    "../site/src/pages/v2/learn/index.astro",
    "../site/src/pages/v2/start/index.astro"
  ]) await access(new URL(path, import.meta.url));
});

test("the shared shell keeps the global catalogue inside one app launcher", async () => {
  const [header, masthead, launcher, fallback] = await Promise.all([
    read("../site/src/components/v2-catalogue/CatalogueHeader.astro"),
    read("../site/src/components/v2-catalogue/CatalogueMasthead.astro"),
    read("../site/src/components/v2-catalogue/CatalogueLauncher.astro"),
    read("../site/src/components/v2-catalogue/CatalogueFallback.astro")
  ]);

  assert.match(header, /import CatalogueMasthead/);
  assert.match(header, /CatalogueRouteBar/);
  assert.match(header, /CatalogueSectionNav/);
  assert.match(header, /CataloguePageFooter/);
  assert.match(header, /slot name="route-actions"/);
  assert.doesNotMatch(header, /CatalogueGroup/);

  assert.match(masthead, /data-catalogue-launcher-trigger/);
  assert.match(masthead, /aria-controls="v2-catalogue-launcher"/);
  assert.match(masthead, /CatalogueLauncher/);
  assert.match(masthead, /CatalogueFallback/);
  assert.match(masthead, /event\.key === "Escape"/);
  assert.match(masthead, /document\.addEventListener\("astro:page-load"/);

  assert.match(launcher, /catalogueGroups\.map/);
  assert.match(launcher, /v2-catalogue-launcher-grid/);
  assert.match(launcher, /catalogueStatusLabels\[item\.status\]/);
  assert.match(launcher, /item\.children\.map/);
  assert.match(launcher, /aria-current=\{item\.current/);

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

test("catalogue styling includes the launcher, compact layers and responsive contracts", async () => {
  const [css, disclosure, mobile, tighten] = await Promise.all([
    read("../site/src/styles/v2-catalogue.css"),
    read("../site/src/styles/v2-catalogue-disclosure.css"),
    read("../site/src/styles/v2-mobile-polish.css"),
    read("../site/src/styles/v2-navigation-tighten.css")
  ]);
  const combined = `${css}\n${disclosure}\n${mobile}\n${tighten}`;

  for (const selector of [
    ".v2-catalogue-masthead",
    ".v2-catalogue-launcher-trigger",
    ".v2-catalogue-launcher",
    ".v2-catalogue-launcher-grid",
    ".v2-catalogue-route-bar",
    ".v2-catalogue-section-nav",
    ".v2-catalogue-card-grid",
    ".v2-lab-quick-links"
  ]) assert.match(combined, new RegExp(selector.replace(".", "\\.")));

  assert.match(combined, /:focus-visible/);
  assert.match(combined, /data-catalogue-launcher-open/);
  assert.match(combined, /@media \(max-width: 840px\)/);
  assert.match(combined, /@media \(max-width: 820px\)/);
  assert.match(combined, /@media \(max-width: 560px\)/);
  assert.match(combined, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(combined, /--hara-[A-Za-z0-9_-]+\s*:/);
});

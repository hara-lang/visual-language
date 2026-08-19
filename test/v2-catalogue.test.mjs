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
    "Focused discussion", "Around Hara", "Community study", "Onboarding study"
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

  assert.ok(foundations && tool && world && around);
  assert.equal(catalogueHref(foundations, "/visual-language/"), "https://github.com/hara-lang/visual-language/issues/34");
  assert.equal(catalogueHref(tool, "/visual-language/"), "/visual-language/v2/tool/");
  assert.equal(catalogueHref(world, "/visual-language/"), "/visual-language/v2/world/");
  assert.equal(catalogueHref(around, "/visual-language/"), "/visual-language/v2/world/around/");
  assert.equal(catalogueLinkIsExternal(foundations), true);
  assert.equal(catalogueLinkIsExternal(tool), false);
  assert.equal(catalogueItemIsCurrent(world, "/v2/world/discussion/"), true);

  for (const item of catalogueItems.filter(({ status }) => status === "planned")) {
    assert.equal(typeof item.issue, "number", `${item.id} needs an implementation issue`);
    assert.equal(item.href, undefined, `${item.id} must not advertise an unbuilt route`);
  }

  assert.deepEqual(Object.keys(catalogueStatusLabels), ["planned", "active", "settled"]);
});

test("every implemented laboratory advertised by the manifest exists", async () => {
  for (const path of [
    "../site/src/pages/v2/tool/index.astro",
    "../site/src/pages/v2/world/index.astro",
    "../site/src/pages/v2/world/discussion/index.astro",
    "../site/src/pages/v2/world/around/index.astro",
    "../site/src/pages/v2/world/community/index.astro",
    "../site/src/pages/v2/world/onboarding/index.astro"
  ]) await access(new URL(path, import.meta.url));
});

test("the shared header renders grouped disclosures from the manifest", async () => {
  const component = await read("../site/src/components/v2-catalogue/CatalogueHeader.astro");

  assert.match(component, /catalogueGroups\.map/);
  assert.match(component, /<details class="v2-catalogue-group"/);
  assert.match(component, /<summary>/);
  assert.match(component, /data-catalogue-menu-button/);
  assert.match(component, /aria-controls="v2-catalogue-navigation"/);
  assert.match(component, /catalogueHref\(item, basePath\)/);
  assert.match(component, /catalogueHref\(child, basePath\)/);
  assert.match(component, /event\.key !== "Escape"/);
  assert.match(component, /header\.contains\(event\.target\)/);
  assert.match(component, /document\.addEventListener\("astro:page-load"/);
});

test("the catalogue home is manifest-driven and preserves the existing reference specimens", async () => {
  const page = await read("../site/src/pages/v2/index.astro");

  assert.match(page, /import CatalogueHeader/);
  assert.match(page, /catalogueGroups\.map/);
  assert.match(page, /Shared foundations first\. Product detail where it belongs\./);
  assert.match(page, /Planned routes lead to their implementation issue/);
  assert.doesNotMatch(page, /const ecosystem = \[/);

  for (const name of ["WwwSpecimen", "DocsSpecimen", "SpecsSpecimen", "BenchmarksSpecimen", "WorldSpecimen"])
    assert.match(page, new RegExp(`<${name}\\s*/>`), `missing ${name}`);

  // Preserve links protected by the earlier World study contracts.
  assert.match(page, /const worldLab = `\$\{basePath\}v2\/world\/`/);
  assert.match(page, /const worldFocusedLab = `\$\{basePath\}v2\/world\/community\/`/);
  assert.match(page, /const worldDiscussionLab = `\$\{basePath\}v2\/world\/discussion\/`/);
  assert.match(page, /const worldAroundLab = `\$\{basePath\}v2\/world\/around\/`/);
  assert.match(page, /World community laboratory/);
  assert.match(page, /Open the focused World community/);
  assert.match(page, /Focused World discussion laboratory/);
  assert.match(page, /Open the Around Hara feed explorer/);
});

test("catalogue styling includes focus, mobile disclosure, and reduced-motion contracts without protected token overrides", async () => {
  const css = await read("../site/src/styles/v2-catalogue.css");

  for (const selector of [
    ".v2-catalogue-header",
    ".v2-catalogue-menu-button",
    ".v2-catalogue-panel",
    ".v2-catalogue-card-grid",
    ".v2-catalogue-children"
  ]) assert.match(css, new RegExp(selector.replace(".", "\\.")));

  assert.match(css, /:focus-visible/);
  assert.match(css, /data-menu-open="false"/);
  assert.match(css, /@media \(max-width: 840px\)/);
  assert.match(css, /@media \(max-width: 560px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /--hara-[A-Za-z0-9_-]+\s*:/);
});

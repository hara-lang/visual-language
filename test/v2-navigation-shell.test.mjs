import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  catalogueItemById,
  catalogueKindLabels,
  catalogueRouteContext,
  catalogueRoutePaths,
  normalizeCataloguePath
} from "../site/src/lib/v2-catalogue.mjs";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("deep catalogue routes resolve breadcrumbs, family tabs and neighbours from the manifest", () => {
  const context = catalogueRouteContext("/world/discussion/");
  assert.ok(context);
  assert.equal(context.group.id, "applications");
  assert.equal(context.family.id, "world");
  assert.equal(context.parent?.id, "world");
  assert.deepEqual(context.crumbs.map(({ label }) => label), ["V2 reference", "Language and community", "World", "Discussion"]);
  assert.deepEqual(context.siblings.map(({ id }) => id), ["world", "world-discussion", "world-around"]);
  assert.equal(context.previous?.id, "world");
  assert.equal(context.next?.id, "world-around");
  assert.equal(context.statusLabel, "Implemented");
});

test("Learn owns Start and historical teaching studies even while compatibility paths remain", () => {
  const start = catalogueRouteContext("/start/");
  assert.ok(start);
  assert.equal(start.item.id, "start");
  assert.equal(start.family.id, "learn");
  assert.equal(start.parent?.id, "learn");
  assert.equal(start.isAlias, true);
  assert.equal(start.canonicalPath, "/learn/start/agent-first/");
  assert.deepEqual(start.crumbs.map(({ label }) => label), ["V2 reference", "Language and community", "Learn", "Repository-guided start"]);

  const community = catalogueRouteContext("/world/community/");
  assert.ok(community);
  assert.equal(community.item.id, "learn-community-study");
  assert.equal(community.family.id, "learn");
  assert.equal(community.statusLabel, catalogueKindLabels.historical);
  assert.equal(community.item.kind, "historical");

  const startItem = catalogueItemById("start");
  assert.ok(startItem);
  assert.deepEqual(catalogueRoutePaths(startItem), [
    "/start/",
    "/learn/start/agent-first/"
  ]);
  assert.equal(normalizeCataloguePath("https://example.test/world/around/?view=wide#relay"), "/world/around/");
});

test("the global shell composes a compact masthead, secondary route header, sections and footer", async () => {
  const [header, masthead, routeBar, sectionNav, footer, prototype, wwwHeader, tighten] = await Promise.all([
    read("../site/src/components/v2-catalogue/CatalogueHeader.astro"),
    read("../site/src/components/v2-catalogue/CatalogueMasthead.astro"),
    read("../site/src/components/v2-catalogue/CatalogueRouteBar.astro"),
    read("../site/src/components/v2-catalogue/CatalogueSectionNav.astro"),
    read("../site/src/components/v2-catalogue/CataloguePageFooter.astro"),
    read("../site/src/components/v2-catalogue/PrototypeFrame.astro"),
    read("../site/src/components/v2-www/WwwFamilyHeader.astro"),
    read("../site/src/styles/v2-navigation-tighten.css")
  ]);

  assert.match(header, /CatalogueMasthead/);
  assert.match(header, /CatalogueRouteBar/);
  assert.match(header, /CatalogueSectionNav/);
  assert.match(header, /CataloguePageFooter/);
  assert.match(header, /resolvedActivePath/);
  assert.match(header, /slot name="route-actions"/);

  assert.match(masthead, /data-catalogue-launcher-trigger/);
  assert.match(masthead, /@hara-lang\/ui-astro\/astro\/v2\/Header\.astro/);
  assert.match(masthead, /section="Visual language"/);
  assert.match(masthead, /account="logged-out"/);
  assert.match(masthead, /www\/docs/);
  assert.match(masthead, /CatalogueLauncher/);
  assert.match(masthead, /event\.key === "Escape"/);

  assert.match(routeBar, /v2-catalogue-breadcrumbs/);
  assert.match(routeBar, /v2-catalogue-family-tabs/);
  assert.match(routeBar, /v2-catalogue-parent-link/);
  assert.match(routeBar, /v2-catalogue-route-tools/);
  assert.match(routeBar, /slot name="actions"/);

  assert.match(sectionNav, /IntersectionObserver/);
  assert.match(sectionNav, /data-catalogue-section-current/);
  assert.match(sectionNav, /labelCandidates/);
  assert.match(sectionNav, /titleCaseId/);
  assert.match(sectionNav, /event\.key !== "Escape"/);

  assert.match(footer, /data-catalogue-footer-template/);
  assert.match(footer, /Previous/);
  assert.match(footer, /Next/);
  assert.match(prototype, /data-prototype-frame/);
  assert.match(prototype, /Navigation inside this frame belongs to the demonstrated product/);

  assert.match(wwwHeader, /CatalogueHeader/);
  assert.match(wwwHeader, /activeFamilyRoute\.path/);
  assert.match(wwwHeader, /slot="route-actions"/);
  assert.doesNotMatch(wwwHeader, /ThemeToggle|HaraMark|familyRoutes\.map/);

  assert.match(tighten, /--v2-catalogue-masthead-height: var\(--hara-v2-header-height\)/);
  assert.match(tighten, /\.v2-catalogue-shell/);
  assert.match(tighten, /--v2-catalogue-route-height: 48px/);
  assert.match(tighten, /--v2-catalogue-section-height: 38px/);
  assert.match(tighten, /\.ui-pattern-page main\.ui-main/);
  assert.match(tighten, /width: min\(1440px, calc\(100% - 2 \* var\(--hara-v2-page\)\)\)/);
});

test("the v2 catalogue is the root site and v1 is archived under an explicit compatibility route", async () => {
  const [root, v1, manifest, masthead] = await Promise.all([
    read("../site/src/pages/index.astro"),
    read("../site/src/pages/v1/index.astro"),
    read("../site/src/lib/v2-catalogue.mjs"),
    read("../site/src/components/v2-catalogue/CatalogueMasthead.astro")
  ]);

  assert.match(root, /Hara visual language v2/);
  assert.match(root, /<CatalogueHeader basePath=\{basePath\} activePath="\/" \/>/);
  assert.match(v1, /V1|Version 1|v1/i);
  assert.doesNotMatch(manifest, /["'`]\/v2\//);
  assert.doesNotMatch(root, /\$\{basePath\}v2\//);
  assert.doesNotMatch(masthead, /v2-catalogue-masthead/);
});

test("legacy studies expose the same launcher, secondary header and local section layer", async () => {
  const [bridge, bridgeCss, navigationCss, entry] = await Promise.all([
    read("../src/v2/catalogue-bridge.js"),
    read("../src/v2/catalogue-bridge.css"),
    read("../src/v2/catalogue-navigation.css"),
    read("../src/v2.css")
  ]);

  assert.match(bridge, /header\.v2-lab-header/);
  assert.match(bridge, /Back to the Hara visual-language catalogue/);
  assert.match(bridge, /createLauncher/);
  assert.match(bridge, /Foundations/);
  assert.match(bridge, /Library/);
  assert.match(bridge, /Applications/);
  assert.match(bridge, /v2-legacy-route-bar/);
  assert.match(bridge, /v2-legacy-family-tabs/);
  assert.match(bridge, /dataset\.legacySectionNav/);

  assert.match(bridgeCss, /v2-legacy-launcher-trigger/);
  assert.match(bridgeCss, /v2-legacy-launcher-grid/);
  assert.match(bridgeCss, /v2-legacy-route-bar/);
  assert.match(bridgeCss, /v2-legacy-family-tabs/);
  assert.match(bridgeCss, /v2-legacy-section-nav/);

  assert.match(navigationCss, /v2-catalogue-route-bar/);
  assert.match(navigationCss, /v2-catalogue-section-nav/);
  assert.match(navigationCss, /v2-catalogue-page-footer/);
  assert.match(navigationCss, /v2-prototype-frame/);
  assert.match(navigationCss, /@media \(max-width: 840px\)/);
  assert.match(navigationCss, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(entry, /catalogue-navigation\.css/);
  assert.match(entry, /catalogue-bridge\.css/);
});

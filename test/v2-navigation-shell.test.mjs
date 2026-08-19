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
  const context = catalogueRouteContext("/v2/world/discussion/");
  assert.ok(context);
  assert.equal(context.group.id, "applications");
  assert.equal(context.family.id, "world");
  assert.equal(context.parent?.id, "world");
  assert.deepEqual(context.crumbs.map(({ label }) => label), ["Catalogue", "Applications", "World", "Discussion"]);
  assert.deepEqual(context.siblings.map(({ id }) => id), ["world", "world-discussion", "world-around"]);
  assert.equal(context.previous?.id, "world");
  assert.equal(context.next?.id, "world-around");
  assert.equal(context.statusLabel, "Active study");
});

test("Learn owns Start and historical teaching studies even while compatibility paths remain", () => {
  const start = catalogueRouteContext("/v2/start/");
  assert.ok(start);
  assert.equal(start.item.id, "start");
  assert.equal(start.family.id, "learn");
  assert.equal(start.parent?.id, "learn");
  assert.equal(start.isAlias, true);
  assert.equal(start.canonicalPath, "/v2/learn/start/agent-first/");
  assert.deepEqual(start.crumbs.map(({ label }) => label), ["Catalogue", "Applications", "Learn", "Agent-first Start"]);

  const community = catalogueRouteContext("/v2/world/community/");
  assert.ok(community);
  assert.equal(community.item.id, "learn-community-study");
  assert.equal(community.family.id, "learn");
  assert.equal(community.statusLabel, catalogueKindLabels.historical);
  assert.equal(community.item.kind, "historical");

  const startItem = catalogueItemById("start");
  assert.ok(startItem);
  assert.deepEqual(catalogueRoutePaths(startItem), [
    "/v2/start/",
    "/v2/learn/start/agent-first/"
  ]);
  assert.equal(normalizeCataloguePath("https://example.test/v2/world/around/?view=wide#relay"), "/v2/world/around/");
});

test("the global shell composes location, page sections and predictable footer navigation", async () => {
  const [header, routeBar, sectionNav, footer, prototype, wwwHeader] = await Promise.all([
    read("../site/src/components/v2-catalogue/CatalogueHeader.astro"),
    read("../site/src/components/v2-catalogue/CatalogueRouteBar.astro"),
    read("../site/src/components/v2-catalogue/CatalogueSectionNav.astro"),
    read("../site/src/components/v2-catalogue/CataloguePageFooter.astro"),
    read("../site/src/components/v2-catalogue/PrototypeFrame.astro"),
    read("../site/src/components/v2-www/WwwFamilyHeader.astro")
  ]);

  assert.match(header, /CatalogueRouteBar/);
  assert.match(header, /CatalogueSectionNav/);
  assert.match(header, /CataloguePageFooter/);
  assert.match(header, /resolvedActivePath/);
  assert.match(routeBar, /v2-catalogue-breadcrumbs/);
  assert.match(routeBar, /v2-catalogue-family-tabs/);
  assert.match(routeBar, /Back to/);
  assert.match(sectionNav, /IntersectionObserver/);
  assert.match(sectionNav, /data-catalogue-section-current/);
  assert.match(sectionNav, /event\.key !== "Escape"/);
  assert.match(footer, /data-catalogue-footer-template/);
  assert.match(footer, /Previous/);
  assert.match(footer, /Next/);
  assert.match(prototype, /data-prototype-frame/);
  assert.match(prototype, /Navigation inside this frame belongs to the demonstrated product/);
  assert.match(wwwHeader, /GlobalMasthead/);
  assert.match(wwwHeader, /activeFamilyRoute\.path/);
});

test("legacy studies expose catalogue groups, a parent action and explicitly local section navigation", async () => {
  const [bridge, bridgeCss, navigationCss, entry] = await Promise.all([
    read("../src/v2/catalogue-bridge.js"),
    read("../src/v2/catalogue-bridge.css"),
    read("../src/v2/catalogue-navigation.css"),
    read("../src/v2.css")
  ]);

  assert.match(bridge, /header\.v2-lab-header/);
  assert.match(bridge, /Back to the Hara visual-language catalogue/);
  assert.match(bridge, /Foundations/);
  assert.match(bridge, /Library/);
  assert.match(bridge, /Applications/);
  assert.match(bridge, /dataset\.legacySectionNav/);
  assert.match(bridgeCss, /v2-legacy-catalogue-groups/);
  assert.match(bridgeCss, /v2-legacy-parent-link/);
  assert.match(navigationCss, /v2-catalogue-route-bar/);
  assert.match(navigationCss, /v2-catalogue-section-nav/);
  assert.match(navigationCss, /v2-catalogue-page-footer/);
  assert.match(navigationCss, /v2-prototype-frame/);
  assert.match(navigationCss, /@media \(max-width: 840px\)/);
  assert.match(navigationCss, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(entry, /catalogue-navigation\.css/);
  assert.match(entry, /catalogue-bridge\.css/);
});

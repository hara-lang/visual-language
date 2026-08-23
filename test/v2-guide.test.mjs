import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  adoptionTargets,
  filterReviewRoutes,
  guideFixtureNotice,
  guideSummary,
  historicalReviewRoutes,
  navigationLayers,
  newApplicationSteps,
  ownershipLayers,
  requiredReviewRoutes,
  reviewCell,
  reviewChecks,
  reviewRouteById,
  reviewRouteByPath,
  reviewThemes,
  reviewViewports,
  routeLifecycle,
  screenshotProcedure,
  stateCoverageForRoute,
  supplementaryReviewRoutes,
  themeById,
  viewportById
} from "../site/src/lib/v2-guide.mjs";
import {
  catalogueHref,
  catalogueItemById,
  catalogueItemIsCurrent
} from "../site/src/lib/v2-catalogue.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFile(resolve(root, path), "utf8");
const pagePath = "site/src/pages/guide/index.astro";
const componentPaths = [
  "site/src/components/v2-guide/GuideRouteMatrix.astro",
  "site/src/components/v2-guide/GuideReviewDeck.astro",
  "site/src/components/v2-guide/GuideArchitecture.astro",
  "site/src/components/v2-guide/GuideAdoption.astro"
];
const stylePaths = [
  "site/src/styles/v2-guide.css",
  "site/src/styles/v2-guide-base.css",
  "site/src/styles/v2-guide-review.css",
  "site/src/styles/v2-guide-responsive.css"
];

test("guide fixture is explicit and the closeout route inventory is exact", () => {
  assert.equal(guideFixtureNotice.productionAudit, false);
  assert.match(guideFixtureNotice.summary, /not an external accessibility certification/i);
  assert.deepEqual(requiredReviewRoutes.map(({ path }) => path), [
    "/",
    "/foundations/",
    "/components/",
    "/ui/",
    "/frontmatter/",
    "/tool/",
    "/www/",
    "/www/docs/",
    "/www/benchmarks/",
    "/playground/",
    "/specs/",
    "/packages/",
    "/world/",
    "/learn/"
  ]);
  assert.equal(new Set(requiredReviewRoutes.map(({ id }) => id)).size, requiredReviewRoutes.length);
  assert.equal(new Set(requiredReviewRoutes.map(({ path }) => path)).size, requiredReviewRoutes.length);
  assert.equal(guideSummary.requiredRoutes, 14);
});

test("every non-root required review route resolves to a current manifest item", () => {
  for (const route of requiredReviewRoutes.filter(({ id }) => id !== "catalogue")) {
    const item = catalogueItemById(route.id);
    assert.ok(item, `${route.id} must exist in the catalogue manifest`);
    assert.equal(item.path, route.path);
    assert.equal(item.status === "active" || item.status === "settled", true);
    assert.equal(catalogueItemIsCurrent(item, route.path), true);
  }
  assert.equal(guideSummary.manifestBackedRequiredRoutes, requiredReviewRoutes.length);
});

test("the guide is an active internal Foundations route", () => {
  const guide = catalogueItemById("catalogue-guide");
  assert.ok(guide);
  assert.equal(guide.path, "/guide/");
  assert.equal(guide.href, "/guide/");
  assert.equal(guide.status, "active");
  assert.equal(guide.issue, 90);
  assert.equal(catalogueHref(guide, "/visual-language/"), "/visual-language/guide/");
  assert.equal(catalogueItemIsCurrent(guide, "/guide/"), true);
});

test("review matrix has two themes, five exact viewports and deterministic cells", () => {
  assert.deepEqual(reviewThemes.map(({ id }) => id), ["light", "dark"]);
  assert.deepEqual(reviewViewports.map(({ width }) => width), [1440, 1024, 680, 390, 320]);
  assert.equal(guideSummary.matrixCells, 140);
  assert.equal(viewportById("phone").width, 390);
  assert.equal(viewportById("unknown").id, "desktop");
  assert.equal(themeById("dark").label, "Dark");
  assert.equal(themeById("unknown").id, "light");
  const cell = reviewCell("playground", "phone", "dark");
  assert.equal(cell?.id, "playground:phone:dark");
  assert.equal(cell?.status, "review-required");
  assert.equal(reviewCell("missing", "phone", "dark"), null);
});

test("required routes expose common states plus realistic domain states and provenance", () => {
  for (const route of requiredReviewRoutes) {
    for (const state of ["loading", "empty", "error", "disabled", "success"])
      assert.ok(route.states.includes(state), `${route.id} is missing ${state}`);
    assert.ok(route.provenance.length > 25);
    assert.ok(route.primaryTask.length > 25);
    assert.ok(route.downstream.length > 2);
  }
  assert.ok(stateCoverageForRoute("playground").includes("backend-unavailable"));
  assert.ok(stateCoverageForRoute("specs").includes("unsupported"));
  assert.ok(stateCoverageForRoute("packages").includes("revoked"));
  assert.ok(stateCoverageForRoute("world").includes("owner-away"));
  assert.ok(stateCoverageForRoute("learn").includes("version-changed"));
  assert.deepEqual(stateCoverageForRoute("missing"), []);
});

test("route search is deterministic across labels, states, groups and downstream targets", () => {
  assert.deepEqual(filterReviewRoutes("", "all"), requiredReviewRoutes);
  assert.deepEqual(filterReviewRoutes("backend-unavailable").map(({ id }) => id), ["playground"]);
  assert.deepEqual(filterReviewRoutes("hara-specs").map(({ id }) => id), ["specs"]);
  assert.deepEqual(filterReviewRoutes("", "Library").map(({ id }) => id), ["components", "ui-patterns", "tool-workbenches"]);
  assert.equal(reviewRouteById("packages")?.path, "/packages/");
  assert.equal(reviewRouteByPath("https://example.test/learn/?x=1")?.id, "learn");
});

test("current extensions and historical studies remain visibly separate", () => {
  assert.ok(supplementaryReviewRoutes.some(({ id }) => id === "graphics"));
  assert.ok(supplementaryReviewRoutes.some(({ id }) => id === "hara-chrome"));
  assert.deepEqual(historicalReviewRoutes.map(({ id }) => id), ["learn-community-study", "learn-onboarding-study", "world-feed-study"]);
  assert.ok(historicalReviewRoutes.every(({ canonicalPath }) => canonicalPath.startsWith("/learn/")));
  assert.ok(historicalReviewRoutes.every(({ summary }) => /retained/i.test(summary)));
});

test("navigation, ownership and lifecycle contracts are complete and non-overlapping", () => {
  assert.deepEqual(navigationLayers.map(({ id }) => id), ["global", "route", "local", "prototype"]);
  assert.deepEqual(ownershipLayers.map(({ id }) => id), ["package", "catalogue", "product", "authority"]);
  assert.deepEqual(routeLifecycle.map(({ id }) => id), ["planned", "active", "settled", "historical", "deprecated"]);
  assert.equal(newApplicationSteps.length, 7);
  assert.match(navigationLayers[0].rule, /never absorbs product workflows/i);
  assert.match(ownershipLayers[3].owns, /canonical identities.*receipts/i);
});

test("the review procedure, checks and adoption map cover the complete closeout contract", () => {
  assert.equal(reviewChecks.length, 11);
  assert.deepEqual(reviewChecks.map(({ id }) => id), ["route", "navigation", "theme", "responsive", "keyboard", "hover", "overflow", "motion", "contrast", "states", "provenance"]);
  assert.equal(screenshotProcedure.length, 8);
  assert.match(screenshotProcedure.join(" "), /1440.*1024.*680.*390.*320/);
  assert.deepEqual(adoptionTargets.map(({ id }) => id), ["www", "docs", "benchmarks", "playground", "specs", "packages", "world", "learn"]);
  assert.ok(adoptionTargets.every(({ route }) => route.startsWith("/")));
});

test("the page composes the complete route, review, architecture and adoption guide", async () => {
  const page = await read(pagePath);
  for (const component of ["GuideRouteMatrix", "GuideReviewDeck", "GuideArchitecture", "GuideAdoption"]) {
    assert.match(page, new RegExp(`import ${component} from`));
    assert.match(page, new RegExp(`<${component}(?:\\s|\\/|>)`));
  }
  for (const id of ["overview", "routes", "review", "architecture", "lifecycle", "adding", "procedure", "adoption"])
    assert.match([page, ...(await Promise.all(componentPaths.map(read)))].join("\n"), new RegExp(`id=\\"${id}\\"`));
  assert.match(page, /One catalogue\. Many products\. One review grammar\./);
  assert.match(page, /activePath="\/v2\/guide\/"/);
  assert.match(page, /initialiseGuide/);
});

test("the live deck exposes route, theme, viewport, local decision and checklist controls", async () => {
  const component = await read(componentPaths[1]);
  for (const marker of ["data-guide-review-route", "data-guide-theme", "data-guide-viewport", "data-guide-frame", "data-guide-mark", "data-guide-check", "data-guide-copy-target", "data-guide-reload"])
    assert.match(component, new RegExp(marker));
  assert.match(component, /sandbox="allow-scripts allow-same-origin allow-forms allow-popups"/);
  assert.match(component, /Review required/);
  assert.match(component, /Fixture, not certification|local to this browser session/i);
});

test("interaction script applies same-origin themes without changing persistent preference", async () => {
  const script = await read("site/src/scripts/v2-guide.js");
  for (const marker of ["data-guide-route-query", "data-guide-review-route", "data-guide-theme", "data-guide-viewport", "data-guide-mark", "data-guide-check", "navigator.clipboard"])
    assert.match(script, new RegExp(marker));
  assert.match(script, /documentElement\.dataset\.theme = theme/);
  assert.match(script, /documentElement\.dataset\.themePreference = theme/);
  assert.match(script, /hara:theme-change/);
  assert.doesNotMatch(script, /localStorage\.setItem|document\.cookie|setThemePreference/);
  assert.match(script, /export function initialiseGuide/);
});

test("guide styling is modular, focus-visible, contained, touch-safe, responsive and reduced-motion aware", async () => {
  const sources = await Promise.all(stylePaths.map(read));
  const css = sources.join("\n");
  assert.match(sources[0], /@import "\.\/v2-guide-base\.css"/);
  assert.match(sources[0], /@import "\.\/v2-guide-review\.css"/);
  assert.match(sources[0], /@import "\.\/v2-guide-responsive\.css"/);
  for (const selector of [".guide-route-table-wrap", ".guide-review-deck", ".guide-frame-stage", ".guide-frame-shell", ".guide-layer-map", ".guide-adoption-map"])
    assert.match(css, new RegExp(selector.replace(".", "\\.")));
  assert.match(css, /:focus-visible/);
  assert.match(css, /overflow:\s*auto|overflow-x:\s*auto/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /@media \(max-width: 1040px\)/);
  assert.match(css, /@media \(max-width: 560px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /--hara-[A-Za-z0-9_-]+\s*:/, "guide CSS must consume protected Hara tokens");
});

test("documentation is packaged and linked from the README and catalogue footer", async () => {
  await access(resolve(root, "V2-GUIDE.md"));
  const [document, packageJson, readme, footer] = await Promise.all([
    read("V2-GUIDE.md"),
    read("package.json").then(JSON.parse),
    read("README.md"),
    read("site/src/components/v2-catalogue/CataloguePageFooter.astro")
  ]);
  assert.ok(packageJson.files.includes("V2-GUIDE.md"));
  for (const phrase of ["Route manifest contract", "Navigation ownership", "Screenshot and accessibility review procedure", "Adding a new application reference", "Downstream adoption map", "Expansion beyond the initial catalogue"])
    assert.match(document, new RegExp(phrase, "i"));
  assert.match(readme, /v2 catalogue guide/i);
  assert.match(footer, /Catalogue guide/);
  assert.match(footer, /v2\/guide\//);
});

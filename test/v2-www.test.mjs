import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import {
  adoptionNotes,
  benchmarkColumns,
  benchmarkHistory,
  benchmarkInsights,
  benchmarkReport,
  benchmarkResultStates,
  benchmarkRows,
  benchmarkSourceRows,
  benchmarkStateCounts,
  capabilitySections,
  docsArticle,
  docsSearchResults,
  docsTaskMap,
  ecosystemMap,
  familyRouteById,
  familyRoutes,
  gettingStartedChoices,
  homeNarrative,
  projectProof,
  runtimeStateSpecimens,
  selectedBenchmark,
  sharedOwnership,
  withBasePath,
  wwwAdoptionContract,
  wwwContracts
} from "../site/src/lib/v2-www.mjs";
import {
  catalogueHref,
  catalogueItemById,
  catalogueLinkIsExternal
} from "../site/src/lib/v2-catalogue.mjs";
import {
  applicationContractMap,
  contentContractById
} from "../site/src/lib/v2-frontmatter.mjs";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const homePath = "../site/src/pages/www/index.astro";
const docsPath = "../site/src/pages/www/docs/index.astro";
const benchmarksPath = "../site/src/pages/www/benchmarks/index.astro";
const cssPaths = [
  "../site/src/styles/v2-www.css",
  "../site/src/styles/v2-www/core.css",
  "../site/src/styles/v2-www/home.css",
  "../site/src/styles/v2-www/docs.css",
  "../site/src/styles/v2-www/benchmarks.css",
  "../site/src/styles/v2-www/responsive.css"
];
const guidePath = "../V2-WWW.md";
const familyHeaderPath = "../site/src/components/v2-www/WwwFamilyHeader.astro";
const liveExamplePath = "../site/src/components/v2-www/LiveHaraExample.astro";

const routeIds = ["home", "docs", "benchmarks"];
const catalogueIds = ["www", "www-docs", "www-benchmarks"];

test("the WWW, Docs, and Benchmarks routes are active internal catalogue destinations", async () => {
  for (const path of [homePath, docsPath, benchmarksPath]) await access(new URL(path, import.meta.url));

  for (const id of catalogueIds) {
    const item = catalogueItemById(id);
    assert.ok(item, `missing catalogue item ${id}`);
    assert.equal(item.status, "active");
    assert.equal(item.issue, 38);
    assert.equal(catalogueLinkIsExternal(item), false);
    assert.match(catalogueHref(item, "/visual-language/"), /^\/visual-language\/v2\/www\//);
  }

  assert.equal(catalogueHref(catalogueItemById("www"), "/visual-language/"), "/visual-language/www/");
  assert.equal(catalogueHref(catalogueItemById("www-docs"), "/visual-language/"), "/visual-language/www/docs/");
  assert.equal(catalogueHref(catalogueItemById("www-benchmarks"), "/visual-language/"), "/visual-language/www/benchmarks/");
});

test("the family consumes the shared hara.www, hara.docs, and hara.benchmarks contracts by identity", () => {
  assert.deepEqual(familyRoutes.map(({ id }) => id), routeIds);
  assert.strictEqual(wwwContracts.www, contentContractById("www"));
  assert.strictEqual(wwwContracts.docs, contentContractById("docs"));
  assert.strictEqual(wwwContracts.benchmarks, contentContractById("benchmarks"));
  assert.equal(wwwContracts.www.schemaNamespace, "hara.www");
  assert.equal(wwwContracts.docs.schemaNamespace, "hara.docs");
  assert.equal(wwwContracts.benchmarks.schemaNamespace, "hara.benchmarks");

  const issueContract = applicationContractMap.find(({ issue }) => issue === 38);
  assert.strictEqual(wwwAdoptionContract, issueContract);
  assert.deepEqual(wwwAdoptionContract.families, ["www", "docs", "benchmarks"]);
  assert.equal(familyRouteById("docs")?.path, "/www/docs/");
  assert.equal(withBasePath("/visual-language", "/www/benchmarks/"), "/visual-language/www/benchmarks/");
});

test("the WWW family puts search and account actions into the shared secondary header", async () => {
  const header = await read(familyHeaderPath);
  assert.match(header, /CatalogueHeader/);
  assert.match(header, /activeRoute/);
  assert.match(header, /activeFamilyRoute\.path/);
  assert.match(header, /slot="route-actions"/);
  assert.match(header, /slot="secondary-nav"/);
  assert.match(header, /Search Home, Docs, and Benchmarks/);
  assert.match(header, /accountLabel/);
  assert.match(header, /data-www-search-trigger/);
  assert.match(header, /data-www-search-panel/);
  assert.doesNotMatch(header, /ThemeToggle|HaraMark|familyRoutes\.map|Visual language catalogue/);
});

test("the homepage is a detailed language narrative with proof, ecosystem, releases, starts, states, and adoption", async () => {
  const page = await read(homePath);
  assert.match(page, /WwwFamilyHeader/);
  assert.match(page, /activeRoute="home"/);
  assert.match(page, /Read the form, inspect its boundary, then run it/);
  assert.match(page, /Explanation, proof, action/);
  assert.match(page, /Language capabilities/);
  assert.match(page, /Ecosystem map and project proof/);
  assert.match(page, /Release and change summary/);
  assert.match(page, /Download, install, and start/);
  assert.match(page, /Live demo unavailable/);
  assert.match(page, /Low-bandwidth arrival/);
  assert.match(page, /Anonymous first arrival/);
  assert.match(page, /Desktop, tablet, and mobile specimens/);
  assert.match(page, /Ownership and downstream adoption/);
  assert.match(page, /wwwContracts\.www/);
  assert.doesNotMatch(page, /CatalogueHeader/);
  assert.doesNotMatch(page, /<style(?:\s|>)/i);

  assert.equal(homeNarrative.contentType, "www.narrative-page");
  assert.equal(capabilitySections.length, 4);
  assert.deepEqual(capabilitySections.map(({ id }) => id), ["portability", "tooling", "runtimes", "interop"]);
  assert.equal(ecosystemMap.length, 5);
  assert.ok(projectProof.length >= 4);
  assert.deepEqual(gettingStartedChoices.map(({ id }) => id), ["browser", "brew", "agent"]);
});

test("the live Hara surface separates static source from executable runtime state and exposes all required actions", async () => {
  const component = await read(liveExamplePath);
  for (const state of ["ready", "unavailable", "error", "stale"])
    assert.match(component, new RegExp(`${state}: \\{`));

  for (const phrase of [
    "Runtime",
    "Session",
    "Generation",
    "Revision",
    "Capabilities",
    "Static source",
    "Run",
    "Copy",
    "Open in Playground",
    "Exact revision",
    "Sessions",
    "Files",
    "Canvas",
    "3D"
  ]) assert.match(component, new RegExp(phrase));

  assert.match(component, /disabled=\{!currentState\.executable\}/);
  assert.match(component, /data-live-expected/);
  assert.match(component, /navigator\.clipboard/);
  assert.match(component, /Execution complete · receipt/);
});

test("Docs includes a task map, persistent reading shell, reference, filtered search, live controls, and degraded states", async () => {
  const page = await read(docsPath);
  assert.match(page, /activeRoute="docs"/);
  assert.match(page, /Task-oriented landing/);
  assert.match(page, /Guide and article layout/);
  assert.match(page, /www-docs-sidebar/);
  assert.match(page, /www-docs-outline/);
  assert.match(page, /Version/);
  assert.match(page, /Runtime/);
  assert.match(page, /Static documentation boundary/);
  assert.match(page, /Executable example · optional runtime surface/);
  assert.match(page, /controls=\{\["Sessions", "Files", "Canvas", "3D"\]\}/);
  assert.match(page, /API and namespace reference/);
  assert.match(page, /Search results and filters/);
  assert.match(page, /Unavailable runtime specimen/);
  assert.match(page, /Compile error specimen/);
  assert.match(page, /Stale version specimen/);
  assert.match(page, /Narrow and mobile reading behaviour/);
  assert.match(page, /wwwContracts\.docs/);
  assert.match(page, /sectionNav \/>/);
  assert.match(page, /www-docs-page-controls/);
  assert.match(page, /data-section-label="Start map"/);
  assert.doesNotMatch(page, /WwwSubnav/);
  const docsStyles = await read("../site/src/styles/v2-www/docs.css");
  assert.match(docsStyles, /body\.www-docs-page \.www-section/);
  assert.doesNotMatch(docsStyles, /grid-template-rows: 48px 48px/);
  assert.match(docsStyles, /\.www-docs-page-controls/);
  assert.doesNotMatch(page, /CatalogueHeader/);
  assert.doesNotMatch(page, /<style(?:\s|>)/i);

  assert.equal(docsArticle.contentType, "docs.guide");
  assert.ok(docsTaskMap.length >= 6);
  assert.ok(docsSearchResults.some(({ type }) => type === "Guide"));
  assert.ok(docsSearchResults.some(({ type }) => type === "Reference"));
  assert.ok(docsSearchResults.some(({ type }) => type === "Live example"));
  assert.deepEqual(runtimeStateSpecimens.map(({ id }) => id), ["runtime-unavailable", "compile-error", "stale-version"]);
});

test("Benchmarks leads with insights and keeps exact evidence, methodology, history, and result states adjacent", async () => {
  const page = await read(benchmarksPath);
  const insightIndex = page.indexOf('id="insights"');
  const matrixIndex = page.indexOf('id="matrix"');
  const selectedIndex = page.indexOf('id="selected-result"');
  const sourceIndex = page.indexOf('id="source-table"');

  assert.ok(insightIndex > 0 && insightIndex < matrixIndex, "insights must precede matrix");
  assert.ok(matrixIndex < selectedIndex, "matrix must lead into selected evidence");
  assert.ok(selectedIndex < sourceIndex, "compact source table must follow interpretation");
  assert.match(page, /Interface fixture/);
  assert.match(page, /not published Hara performance claims/);
  assert.match(page, /Shareable state/);
  assert.match(page, /Copy filtered view/);
  assert.match(page, /<table class="www-benchmark-matrix">/);
  assert.match(page, /<caption>/);
  assert.match(page, /Missing/);
  assert.match(page, /Incomparable/);
  assert.match(page, /Low confidence/);
  assert.match(page, /Exact environment/);
  assert.match(page, /Named baseline/);
  assert.match(page, /Methodology beside result/);
  assert.match(page, /Regression and improvement history/);
  assert.match(page, /www-benchmark-mobile-cards/);
  assert.match(page, /Compact source table later/);
  assert.match(page, /wwwContracts\.benchmarks/);
  assert.doesNotMatch(page, /CatalogueHeader/);
  assert.doesNotMatch(page, /<style(?:\s|>)/i);

  assert.equal(benchmarkReport.contentType, "benchmarks.report");
  assert.equal(benchmarkInsights.length, 3);
  assert.equal(benchmarkColumns.length, 4);
  assert.ok(benchmarkRows.length >= 5);
  assert.equal(selectedBenchmark.samples, 30);
  assert.ok(selectedBenchmark.environment.length >= 4);
  assert.ok(selectedBenchmark.baselineConfig.length >= 4);
  assert.ok(selectedBenchmark.method.length >= 4);
  assert.ok(benchmarkHistory.length >= 4);
  assert.deepEqual(benchmarkResultStates.map(({ id }) => id), ["missing", "incomparable", "low-confidence"]);
  assert.equal(benchmarkSourceRows.length, benchmarkRows.length);
  assert.ok(benchmarkStateCounts.missing >= 1);
  assert.ok(benchmarkStateCounts.incomparable >= 1);
  assert.ok(benchmarkStateCounts["low-confidence"] >= 1);
});

test("desktop, tablet, mobile, reduced-motion, low-bandwidth, and accessible-table contracts are styled", async () => {
  const css = (await Promise.all(cssPaths.map(read))).join("\n");
  for (const selector of [
    ".www-family-header",
    ".www-subnav",
    ".www-live-example",
    ".www-docs-shell",
    ".www-benchmark-matrix",
    ".www-benchmark-mobile-cards",
    ".www-state-specimen",
    ".www-viewport-specimen"
  ]) assert.match(css, new RegExp(selector.replaceAll(".", "\\.")));

  assert.match(css, /@media \(max-width: 1220px\)/);
  assert.match(css, /@media \(max-width: 960px\)/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /@media \(max-width: 460px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.www-benchmark-matrix-wrap \{ max-height: 1px/);
  assert.match(css, /\.www-benchmark-mobile-cards \{ display: grid/);
  assert.match(css, /backdrop-filter/);
});

test("ownership and adoption guidance names the shared and downstream boundaries", async () => {
  const guide = await read(guidePath);
  assert.equal(sharedOwnership.length, 4);
  assert.deepEqual(adoptionNotes.map(({ product }) => product), ["hara-www", "hara-docs", "hara-benchmarks"]);

  for (const phrase of [
    "Shared visual-language ownership",
    "WWW-family ownership",
    "hara-www",
    "hara-docs",
    "hara-benchmarks",
    "hara.www",
    "hara.docs",
    "hara.benchmarks",
    "fixture data",
    "production data",
    "npm test",
    "npm run site:build"
  ]) assert.match(guide, new RegExp(phrase, "i"));
});

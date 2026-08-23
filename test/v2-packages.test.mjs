import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

import {
  discoveryStates,
  filterPackages,
  maintainerFixture,
  namespaceDetail,
  packageById,
  packageCards,
  packageContentTypes,
  packageDetail,
  packagesFixtureNotice,
  packagesSummary,
  provenanceChecklist,
  publishFixture,
  publishState,
  publishStates,
  releaseScenario,
  releaseScenarios
} from "../site/src/lib/v2-packages.mjs";
import { catalogueHref, catalogueItemById } from "../site/src/lib/v2-catalogue.mjs";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const pagePath = "../site/src/pages/packages/index.astro";
const componentPaths = [
  "../site/src/components/v2-packages/PackagesDiscovery.astro",
  "../site/src/components/v2-packages/PackageDetail.astro",
  "../site/src/components/v2-packages/NamespaceDetail.astro",
  "../site/src/components/v2-packages/PackagePublish.astro",
  "../site/src/components/v2-packages/PackageMaintainer.astro",
  "../site/src/components/v2-packages/PackageTrust.astro"
];
const stylePaths = [
  "../site/src/styles/v2-packages.css",
  "../site/src/styles/v2-packages-base.css",
  "../site/src/styles/v2-packages-discovery.css",
  "../site/src/styles/v2-packages-detail.css",
  "../site/src/styles/v2-packages-detail-core.css",
  "../site/src/styles/v2-packages-detail-shell.css",
  "../site/src/styles/v2-packages-detail-content.css",
  "../site/src/styles/v2-packages-detail-inspector.css",
  "../site/src/styles/v2-packages-namespace-trust.css",
  "../site/src/styles/v2-packages-workflow.css",
  "../site/src/styles/v2-packages-publish.css",
  "../site/src/styles/v2-packages-maintainer.css",
  "../site/src/styles/v2-packages-responsive.css",
  "../site/src/styles/v2-packages-responsive-wide.css",
  "../site/src/styles/v2-packages-responsive-narrow.css"
];

test("Packages fixture is explicit, deterministic, and consumes the complete hara.packages family", () => {
  assert.equal(packagesFixtureNotice.productionData, false);
  assert.match(packagesFixtureNotice.summary, /not live registry records/i);
  assert.deepEqual(packageContentTypes.map(({ id }) => id), [
    "packages.package",
    "packages.release",
    "packages.namespace",
    "packages.maintainer",
    "packages.compatibility"
  ]);
  assert.ok(packageContentTypes.every(({ version }) => version === "2.2.0"));
  assert.equal(packagesSummary.contentTypes, packageContentTypes.length);
});

test("package coordinates and namespace references remain distinct and unique", () => {
  assert.equal(new Set(packageCards.map(({ coordinate }) => coordinate)).size, packageCards.length);
  const namespaceNames = packageCards.flatMap(({ namespaces }) => namespaces);
  assert.equal(new Set(namespaceNames).size, namespaceNames.length);
  assert.ok(packageCards.every(({ coordinate }) => coordinate.includes("/")));
  assert.ok(namespaceNames.every((name) => name.includes(".")));
  assert.equal(packageById("hara/std.typed")?.id, "package-hara-std-typed");
  assert.equal(packageById("missing"), null);
});

test("discovery filtering and ordering are deterministic across exact package facts", () => {
  assert.equal(filterPackages().length, packageCards.length);
  assert.deepEqual(filterPackages({ query: "std.typed" }).map(({ coordinate }) => coordinate), ["hara/std.typed"]);
  assert.deepEqual(filterPackages({ runtime: "wasm", compatibility: "verified" }).map(({ coordinate }) => coordinate), ["hara/std.typed"]);
  assert.deepEqual(filterPackages({ stability: "deprecated" }).map(({ coordinate }) => coordinate), ["hara/legacy.stream"]);
  assert.equal(filterPackages({ license: "MIT" })[0].coordinate, "hara/ui.canvas");
  assert.equal(filterPackages({ view: "widely-used" })[0].coordinate, "hara/code.maven");
  assert.equal(filterPackages({ view: "new" })[0].coordinate, "greenways/hestia-client");
});

test("discovery includes honest empty, stale, and degraded service states", () => {
  assert.deepEqual(discoveryStates.map(({ id }) => id), ["ready", "empty-query", "no-results", "stale-index", "registry-degraded"]);
  assert.match(discoveryStates.find(({ id }) => id === "stale-index")?.summary ?? "", /indexed-at fence/i);
  assert.match(discoveryStates.find(({ id }) => id === "registry-degraded")?.summary ?? "", /disabled/i);
});

test("package detail answers release, namespace, maintainer, compatibility, dependency, migration, and reproduction questions", () => {
  assert.equal(packageDetail.contentType, "packages.package");
  assert.equal(packageDetail.releaseContentType, "packages.release");
  assert.equal(packageDetail.schemaVersion, "2.2.0");
  assert.match(packageDetail.exactReleaseRevision, /^release:/);
  assert.match(packageDetail.artifactDigest, /^sha256:[a-f0-9]{64}$/);
  assert.match(packageDetail.installCommand, /hara\/std\.typed@2\.4\.1/);
  assert.ok(packageDetail.namespaceInventory.length >= 4);
  assert.ok(packageDetail.maintainers.some(({ role }) => role === "owned release bot"));
  assert.deepEqual(new Set(packageDetail.compatibility.map(({ state }) => state)), new Set(["verified", "partial"]));
  assert.ok(packageDetail.dependencies.length > 0);
  assert.ok(packageDetail.reverseDependencies.length > 0);
  assert.match(packageDetail.migration.receipt, /^migration:/);
});

test("release presentation distinguishes availability, resolver failure, deprecation, supersession, withdrawal, and revocation", () => {
  assert.deepEqual(releaseScenarios.map(({ state }) => state), ["available", "install-failure", "deprecated", "superseded", "withdrawn", "revoked"]);
  assert.equal(releaseScenario("available").installAllowed, true);
  assert.equal(releaseScenario("withdrawn").installAllowed, false);
  assert.equal(releaseScenario("revoked").installAllowed, false);
  assert.match(releaseScenario("install-failure").findings[0].code, /^PKG-/);
  assert.equal(releaseScenario("unknown").state, "available");
  assert.deepEqual(new Set(packageDetail.releases.map(({ state }) => state)), new Set(["current", "superseded", "deprecated", "revoked"]));
});

test("namespace detail exposes stewardship, API versions, runtime availability, conflicts, aliases, migrations, and contributions", () => {
  assert.equal(namespaceDetail.contentType, "packages.namespace");
  assert.equal(namespaceDetail.namespaceRef, "namespace:std.typed");
  assert.equal(namespaceDetail.packageRef, "package:hara/std.typed");
  assert.ok(namespaceDetail.categories.flatMap(({ forms }) => forms).some(({ deprecated }) => deprecated));
  assert.ok(namespaceDetail.availability.some(({ state }) => state === "partial"));
  assert.ok(namespaceDetail.aliases.some(({ state }) => state === "migration"));
  assert.ok(namespaceDetail.conflicts.length >= 2);
  assert.ok(namespaceDetail.migrations.every(({ receipt }) => receipt.includes("migration")));
  assert.ok(namespaceDetail.contributions.every(({ evidence }) => evidence.includes(":")));
});

test("publish workflow separates author intent from registry-controlled release facts", () => {
  assert.deepEqual(publishStates.map(({ state }) => state), ["draft", "checks-failing", "review-pending", "published", "superseded", "revoked"]);
  assert.equal(publishState("draft").editable, true);
  assert.equal(publishState("published").editable, false);
  assert.equal(publishState("unknown").state, "draft");
  assert.ok(publishFixture.authorFields.includes("releaseNotes"));
  assert.ok(publishFixture.authorFields.includes("migrationNotes"));
  assert.ok(publishFixture.controlledFields.includes("artifactDigest"));
  assert.ok(publishFixture.controlledFields.includes("publicationReceipt"));
  assert.equal(new Set([...publishFixture.authorFields, ...publishFixture.controlledFields]).size, publishFixture.authorFields.length + publishFixture.controlledFields.length);
  assert.ok(publishFixture.artifacts.every(({ digest }) => digest.startsWith("sha256:")));
  assert.ok(publishFixture.checks.some(({ state }) => state === "warning"));
});

test("maintainer dashboard covers release, ownership, migration, dependency, contribution, review, and accountable bots", () => {
  assert.deepEqual(new Set(maintainerFixture.queues.map(({ kind }) => kind)), new Set(["release", "namespace ownership", "migration", "dependency"]));
  assert.ok(maintainerFixture.activity.some(({ result }) => result === "accepted"));
  assert.equal(maintainerFixture.bots.length, 2);
  assert.ok(maintainerFixture.bots.every(({ owner, purpose, capabilities, receipt }) => owner && purpose && capabilities.length && receipt));
  assert.equal(maintainerFixture.bots.find(({ ownerPresent }) => !ownerPresent)?.state, "paused-owner-away");
});

test("provenance inventory answers all six required trust questions through named authorities and evidence", () => {
  assert.deepEqual(provenanceChecklist.map(({ id }) => id), ["publisher", "revision", "namespaces", "targets", "change", "reproduce"]);
  assert.ok(provenanceChecklist.every(({ question, answer, authority, evidence }) => question && answer && authority && evidence));
  assert.equal(packagesSummary.provenanceQuestions, 6);
});

test("the Packages page composes discovery, package, namespace, publish, maintainer, trust, and adoption surfaces", async () => {
  const [page, ...components] = await Promise.all([read(pagePath), ...componentPaths.map(read)]);
  for (const component of ["PackagesDiscovery", "PackageDetail", "NamespaceDetail", "PackagePublish", "PackageMaintainer", "PackageTrust"]) {
    assert.match(page, new RegExp(`import ${component} from`));
    assert.match(page, new RegExp(`<${component}(?:\\s|\\/|>)`));
  }
  const combined = [page, ...components].join("\n");
  for (const id of ["discover", "package", "namespace", "publish", "maintain", "trust", "adoption"]) assert.match(combined, new RegExp(`id=\\"${id}\\"`));
  for (const type of packageContentTypes.map(({ id }) => id)) assert.match(page, new RegExp(type.replace(".", "\\.")));
  assert.match(combined, /Find the exact thing you can trust/);
  assert.match(combined, /A namespace is stewardship/);
  assert.match(combined, /User-owned release bots/);
});

test("package and namespace screens reuse shared Shell while preserving distinct identity treatments", async () => {
  const sources = await Promise.all(componentPaths.map(read));
  assert.match(sources[1], /import Shell from/);
  assert.match(sources[2], /import Shell from/);
  assert.match(sources[3], /import Shell from/);
  assert.match(sources[4], /import Shell from/);
  assert.match(sources.join("\n"), /data-identity-kind="package"/);
  assert.match(sources.join("\n"), /data-identity-kind="namespace"/);
  for (const source of sources) assert.doesNotMatch(source, /<style(?:\s|>)/i);
});

test("install and example projections link cleanly into Docs, Playground, Specs, and World without claiming runtime ownership", async () => {
  const [page, detail, namespace] = await Promise.all([read(pagePath), read(componentPaths[1]), read(componentPaths[2])]);
  assert.match(page, /const docsUrl = `\$\{basePath\}v2\/www\/docs\//);
  assert.match(page, /const playgroundUrl = `\$\{basePath\}v2\/playground\//);
  assert.match(page, /const specsUrl = `\$\{basePath\}v2\/specs\//);
  assert.match(page, /const worldUrl = `\$\{basePath\}v2\/world\/discussion\//);
  assert.match(detail, /installProjectionNote/);
  assert.match(detail, /Open install guide/);
  assert.match(namespace, /Run in Playground/);
});

test("interaction script covers discovery, saved and followed packages, release states, namespace search, publishing, maintenance, and copy feedback", async () => {
  const script = await read("../site/src/scripts/v2-packages.js");
  for (const marker of ["data-package-query", "data-package-filter", "data-package-view", "data-package-save", "data-package-follow", "data-release-scenario", "data-namespace-query", "data-publish-state", "data-maintainer-filter", "navigator.clipboard"]) assert.match(script, new RegExp(marker));
  assert.match(script, /filterPackages\(options\)/);
  assert.match(script, /export function initialisePackages/);
});

test("Packages CSS is modular, focus-visible, contained, touch-safe, responsive, and reduced-motion aware", async () => {
  const sources = await Promise.all(stylePaths.map(read));
  const css = sources.join("\n");
  assert.match(sources[0], /@import "\.\/v2-packages-base\.css"/);
  assert.match(sources[0], /@import "\.\/v2-packages-responsive\.css"/);
  for (const selector of [".packages-local-nav", ".packages-card-grid", ".packages-detail-shell", ".packages-namespace-shell", ".packages-publish-shell", ".packages-maintainer-shell", ".packages-trust-questions", ".packages-adoption-grid"]) assert.match(css, new RegExp(selector.replace(".", "\\.")));
  assert.match(css, /:focus-visible/);
  assert.match(css, /overflow-x:\s*auto/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /@media \(max-width: 860px\)/);
  assert.match(css, /@media \(max-width: 620px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /--hara-[A-Za-z0-9_-]+\s*:/, "Packages CSS must consume, not redefine, protected Hara tokens");
});

test("the catalogue activates the internal Packages route", async () => {
  const packages = catalogueItemById("packages");
  assert.ok(packages);
  assert.equal(packages.status, "active");
  assert.equal(packages.href, "/packages/");
  assert.equal(catalogueHref(packages, "/visual-language/"), "/visual-language/packages/");
  await access(new URL(pagePath, import.meta.url));
});

test("the packaged adoption contract documents authority, states, downstream ownership, and verification", async () => {
  const [document, manifest] = await Promise.all([read("../V2-PACKAGES.md"), read("../package.json")]);
  for (const phrase of ["hara.packages@2.2.0", "Package identity and namespace identity", "Install failure is not release revocation", "User-owned release bots", "Trust and provenance", "Adoption checklist", "Verification contract", "packages/registry product"]) assert.match(document, new RegExp(phrase.replaceAll(".", "\\."), "i"));
  assert.match(manifest, /"V2-PACKAGES\.md"/);
});

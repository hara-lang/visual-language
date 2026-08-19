import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import {
  applicationContractMap,
  browserEditableFields,
  contentContractById,
  contentContracts,
  contentTypeById,
  contentTypeInventory,
  controlledFields,
  derivedFields,
  fieldInventoryForContract,
  frontmatterRepresentations,
  lifecycleStates,
  previewFromSpecimen,
  registryStats,
  relationships,
  requiredFieldsForType,
  sharedFields,
  specimenValidation,
  specimens,
  validateSpecimen
} from "../site/src/lib/v2-frontmatter.mjs";
import {
  catalogueHref,
  catalogueItemById,
  catalogueLinkIsExternal
} from "../site/src/lib/v2-catalogue.mjs";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const pagePath = "../site/src/pages/v2/frontmatter/index.astro";
const cssPath = "../site/src/styles/v2-frontmatter.css";

const requiredSections = [
  "schema-registry",
  "relationships",
  "authoring",
  "representations",
  "preview",
  "lifecycle",
  "provenance",
  "adoption"
];

const familyIds = ["www", "docs", "benchmarks", "specs", "packages", "world", "learn"];
const lifecycleIds = ["draft", "proposed", "reviewed", "published", "superseded", "withdrawn"];

test("the front matter route is active, internal, and discoverable from Foundations", async () => {
  await access(new URL(pagePath, import.meta.url));
  const frontmatter = catalogueItemById("frontmatter");

  assert.ok(frontmatter);
  assert.equal(frontmatter.status, "active");
  assert.equal(frontmatter.issue, 37);
  assert.equal(catalogueHref(frontmatter, "/visual-language/"), "/visual-language/v2/frontmatter/");
  assert.equal(catalogueLinkIsExternal(frontmatter), false);
});

test("one typed registry covers every required application family and concrete content type", () => {
  assert.deepEqual(contentContracts.map(({ id }) => id), familyIds);
  assert.equal(registryStats.families, 7);
  assert.equal(registryStats.types, 30);
  assert.equal(registryStats.sharedFields, 18);
  assert.equal(registryStats.lifecycleStates, 6);
  assert.ok(registryStats.controlledFields > registryStats.sharedFields);

  const typeIds = contentTypeInventory.map(({ id }) => id);
  assert.equal(new Set(typeIds).size, typeIds.length, "content type IDs must be unique");

  for (const contract of contentContracts) {
    assert.match(contract.schemaNamespace, /^hara\./);
    assert.match(contract.schemaVersion, /^\d+\.\d+\.\d+$/);
    assert.equal(contract.publicationPaths.length, 2);
    assert.ok(contract.types.length >= 2);
    assert.ok(contract.registryOwner.length > 3);
  }

  for (const id of [
    "www.narrative-page",
    "www.capability",
    "docs.guide",
    "docs.reference",
    "docs.version",
    "docs.live-example",
    "benchmarks.report",
    "benchmarks.workload",
    "benchmarks.baseline",
    "benchmarks.methodology",
    "benchmarks.evidence",
    "specs.proposal",
    "specs.version",
    "specs.conformance",
    "specs.publication-receipt",
    "packages.package",
    "packages.release",
    "packages.namespace",
    "packages.maintainer",
    "packages.compatibility",
    "world.article",
    "world.clipping",
    "world.feed",
    "world.profile",
    "world.bot",
    "learn.lesson",
    "learn.concept",
    "learn.exercise",
    "learn.project",
    "learn.progress"
  ]) assert.ok(contentTypeById(id), `missing ${id}`);
});

test("required fields resolve through shared and product-specific inventories", () => {
  const sharedIds = new Set(sharedFields.map(({ id }) => id));
  assert.equal(sharedIds.size, sharedFields.length, "shared field IDs must be unique");

  for (const contract of contentContracts) {
    const inventory = fieldInventoryForContract(contract.id);
    const inventoryIds = inventory.map(({ id }) => id);
    assert.equal(new Set(inventoryIds).size, inventoryIds.length, `${contract.id} field IDs must be unique`);

    for (const entry of contract.types) {
      const required = requiredFieldsForType(entry.id);
      assert.ok(required.length >= entry.required.length);
      assert.ok(required.every(Boolean));
      for (const field of [...entry.required, ...entry.optional]) {
        assert.ok(inventoryIds.includes(field), `${entry.id} references unknown field ${field}`);
      }
    }
  }
});

test("browser-editable, controlled, derived, deprecated, and registry-owned fields remain distinct", () => {
  for (const entry of contentTypeInventory) {
    const editable = browserEditableFields(entry.id);
    const controlled = controlledFields(entry.id);
    const derived = derivedFields(entry.id);

    assert.ok(editable.length > 0 || entry.id.endsWith(".progress"));
    assert.ok(editable.every((field) => field.control === "author" && field.requirement !== "deprecated"));
    assert.ok(controlled.every((field) => !["author", "derived"].includes(field.control)));
    assert.ok(derived.every((field) => field.control === "derived" && field.source && field.derivedFrom?.length));
  }

  const legacy = sharedFields.find(({ id }) => id === "legacyPermalink");
  assert.equal(legacy?.requirement, "deprecated");
  assert.equal(legacy?.replacement, "canonicalUrl");

  for (const id of ["contentId", "authors", "createdAt", "updatedAt", "revision"])
    assert.equal(sharedFields.find((field) => field.id === id)?.registryOwned, true);
});

test("valid, imported, invalid/deprecated, and migrated specimens exercise the complete validation boundary", () => {
  const valid = specimens.find(({ id }) => id === "valid-docs-guide");
  const imported = specimens.find(({ id }) => id === "imported-world-clipping");
  const invalid = specimens.find(({ id }) => id === "invalid-spec-proposal");
  const migrated = specimens.find(({ id }) => id === "migrated-package-release");
  assert.ok(valid && imported && invalid && migrated);

  assert.deepEqual(validateSpecimen(valid).map(({ code }) => code), ["valid"]);
  assert.ok(validateSpecimen(imported).some(({ code }) => code === "provenance-attached"));
  assert.equal(validateSpecimen(imported).some(({ level }) => level === "error"), false);

  const invalidCodes = new Set(validateSpecimen(invalid).map(({ code }) => code));
  for (const code of [
    "required-field-missing",
    "deprecated-field",
    "controlled-field",
    "registry-owned-field",
    "schema-migration-required"
  ]) assert.ok(invalidCodes.has(code), `invalid specimen must expose ${code}`);

  const migratedMessages = validateSpecimen(migrated);
  assert.ok(migratedMessages.some(({ code }) => code === "migration-receipt-attached"));
  assert.equal(migratedMessages.some(({ level }) => level === "error"), false);
  assert.equal(migrated.migration?.generator, "content.migrate@2.2.0");
  assert.ok(migrated.migration?.inputRevision);
  assert.ok(migrated.migration?.outputRevision);
  assert.ok(migrated.migration?.receipt);

  assert.deepEqual(Object.keys(specimenValidation), specimens.map(({ id }) => id));
});

test("YAML, JSON, Hara, Markdown, and Hara publication forms resolve from one specimen", () => {
  const specimen = specimens.find(({ id }) => id === "valid-docs-guide");
  assert.ok(specimen);
  const representations = frontmatterRepresentations(specimen);

  assert.match(representations.yaml, /contentType: docs\.guide/);
  assert.match(representations.yaml, /canonicalUrl:/);
  assert.equal(JSON.parse(representations.json).contentType, "docs.guide");
  assert.match(representations.hara, /^\(content\/frontmatter/);
  assert.match(representations.markdown, /^---/);
  assert.match(representations.haraPublication, /^\(content\/publish/);
});

test("metadata drives route, card, feed, search, social, and machine previews", () => {
  const specimen = specimens.find(({ id }) => id === "valid-docs-guide");
  assert.ok(specimen);
  const preview = previewFromSpecimen(specimen);

  assert.equal(preview.route.path, "/docs/guides/durable-work-pipeline");
  assert.equal(preview.card.title, "Build a durable work pipeline");
  assert.equal(preview.search.type, "docs.guide");
  assert.equal(preview.social.url, "https://hara-lang.org/docs/guides/durable-work-pipeline");
  assert.equal(preview.machine["@type"], "docs.guide");
  assert.equal(preview.machine.revision, "sha256:72a194a3");
});

test("the laboratory contains every required screen, family, and ownership boundary", async () => {
  const page = await read(pagePath);

  assert.match(page, /import CatalogueHeader/);
  assert.match(page, /activePath="\/v2\/frontmatter\/"/);
  assert.match(page, /import HaraMark/);
  assert.match(page, /import FleetField/);
  assert.match(page, /src\/v2\.css/);
  assert.match(page, /v2-frontmatter\.css/);
  assert.doesNotMatch(page, /<style(?:\s|>)/i);

  for (const id of requiredSections)
    assert.match(page, new RegExp(`id="${id}"`), `missing ${id} section`);

  for (const phrase of [
    "Front matter is a public interface, not a hidden preamble",
    "Shared metadata stays common. Product semantics stay precise",
    "Reference the owner of truth. Do not copy its record",
    "Editable intent is visibly separated from controlled fact",
    "One canonical object. Multiple inspectable authoring paths",
    "The same facts must visibly drive every surface",
    "Status changes are durable relations, not coloured labels",
    "A clipping never pretends to be the original",
    "Applications consume the contract; they do not fork it"
  ]) assert.match(page, new RegExp(phrase, "i"));

  assert.match(page, /contentContracts\.map/);
  assert.match(page, /data-family=\{contract\.id\}/);
  assert.match(page, /data-content-type=\{entry\.id\}/);
  assert.match(page, /Required/);
  assert.match(page, /Optional/);
  assert.match(page, /Deprecated field remains inspectable/);
});

test("authoring visibly separates editable, controlled, derived, invalid, and migrated facts", async () => {
  const page = await read(pagePath);

  assert.match(page, /Browser editable/);
  assert.match(page, /Server \/ reviewer controlled/);
  assert.match(page, /Generated with provenance/);
  assert.match(page, /readonly/);
  assert.doesNotMatch(page, /disabled value=/);
  assert.match(page, /Source: \{field\.source\}/);
  assert.match(page, /Inputs: \{field\.derivedFrom/);
  assert.match(page, /role="alert"/);
  assert.match(page, /Invalid \+ deprecated specimen/);
  assert.match(page, /Migrated specimen/);
  assert.match(page, /Local draft · not yet a durable revision/);
});

test("representations, previews, lifecycle, migration, and provenance are all inspectable", async () => {
  const page = await read(pagePath);

  for (const label of [
    "YAML front matter",
    "Canonical JSON",
    "Hara form",
    "Markdown publication path",
    "Hara publication path",
    "Canonical route",
    "Card · light",
    "Feed · dark",
    "Search · narrow",
    "Social metadata",
    "Machine endpoint"
  ]) assert.match(page, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.deepEqual(lifecycleStates.map(({ id }) => id), lifecycleIds);
  for (const id of lifecycleIds)
    assert.match(page, new RegExp(`data-lifecycle-state=\\{state\\.id\\}|${id}`));

  assert.match(page, /Exact publication receipt/);
  assert.match(page, /Deterministic regeneration/);
  assert.match(page, /Same inputs → same revision/);
  assert.match(page, /Migration notice/);
  assert.match(page, /Original source/);
  assert.match(page, /Transformations/);
  assert.match(page, /Import receipt/);
  assert.match(page, /World discussion object/);
});

test("every application issue is mapped to the content contracts it consumes", async () => {
  assert.deepEqual(applicationContractMap.map(({ issue }) => issue), [38, 39, 40, 41, 42, 43]);
  assert.deepEqual(applicationContractMap[0].families, ["www", "docs", "benchmarks"]);
  assert.deepEqual(applicationContractMap[2].families, ["specs"]);
  assert.deepEqual(applicationContractMap[3].families, ["packages"]);
  assert.deepEqual(applicationContractMap[4].families, ["world"]);
  assert.deepEqual(applicationContractMap[5].families, ["learn"]);

  const page = await read(pagePath);
  assert.match(page, /Shared content contract owns/);
  assert.match(page, /Application owns/);
  assert.match(page, /Catalogue-only annotation/);
  assert.match(page, /field identity, requirement, version, control, and source/);
  assert.match(page, /who may submit, review, publish, moderate, or withdraw/);
  assert.match(page, /applicationContractMap\.map/);
});

test("responsive, keyboard, narrow-width, theme-parity, and reduced-motion contracts are stylesheet-backed", async () => {
  const [page, css] = await Promise.all([read(pagePath), read(cssPath)]);

  assert.match(page, /data-preview-theme="light"/);
  assert.match(page, /data-preview-theme="dark"/);
  assert.match(page, /data-preview-width="narrow"/);
  assert.match(page, /aria-label="Content lifecycle"/);
  assert.match(page, /aria-label="Provenance chain"/);
  assert.match(page, /aria-label="Content contract families"/);

  assert.match(css, /:focus-visible/);
  assert.match(css, /min-height: 44px/);
  assert.match(css, /@media \(max-width: 1180px\)/);
  assert.match(css, /@media \(max-width: 960px\)/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /@media \(max-width: 440px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /data-preview-theme="light"/);
  assert.match(css, /data-preview-theme="dark"/);
  assert.match(css, /data-preview-width="narrow"/);
  assert.doesNotMatch(css, /--hara-[A-Za-z0-9_-]+\s*:/, "laboratory CSS must not redefine protected Hara tokens");
});

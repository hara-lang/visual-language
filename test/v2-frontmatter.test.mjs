import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import {
  allContentFields,
  contentSchemaById,
  contentSchemas,
  controlledOwners,
  lifecycleStates,
  migrationExamples,
  ownerLabels,
  provenanceExample,
  relationshipKinds,
  representationExamples,
  requirementLabels,
  schemaFieldCounts,
  sharedFields
} from "../site/src/lib/v2-frontmatter.mjs";
import {
  catalogueHref,
  catalogueItemById,
  catalogueItemIsCurrent,
  catalogueLinkIsExternal
} from "../site/src/lib/v2-catalogue.mjs";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const unique = (items) => new Set(items).size === items.length;

test("the content registry defines all seven Hara product families", () => {
  assert.deepEqual(contentSchemas.map(({ id }) => id), [
    "www-page",
    "docs-guide",
    "benchmark-report",
    "spec-proposal",
    "package-release",
    "world-article",
    "learn-lesson"
  ]);

  assert.deepEqual(contentSchemas.map(({ product }) => product), [
    "WWW",
    "WWW / Docs",
    "WWW / Benchmarks",
    "Specs",
    "Packages",
    "World",
    "Learn"
  ]);

  assert.ok(unique(contentSchemas.map(({ id }) => id)));
  assert.ok(unique(contentSchemas.map(({ version }) => version)));
  assert.ok(unique(contentSchemas.map(({ routePattern }) => routePattern)));

  for (const schema of contentSchemas) {
    assert.ok(schema.summary.length > 100, `${schema.id} needs a meaningful boundary`);
    assert.ok(schema.fields.length >= sharedFields.length + 5, `${schema.id} needs product fields`);
    assert.ok(schema.relationships.length >= 4, `${schema.id} needs governed relationships`);
    assert.ok(schema.endpoints.length >= 4, `${schema.id} needs visible and machine outputs`);
    assert.ok(unique(schema.fields.map(({ id }) => id)), `${schema.id} field IDs must be unique`);
  }
});

test("every schema contains the shared identity, lifecycle, route, and revision base", () => {
  const sharedIds = sharedFields.map(({ id }) => id);
  assert.deepEqual(sharedIds, [
    "id",
    "title",
    "summary",
    "authors",
    "status",
    "canonical",
    "source-revision",
    "published-at",
    "tags"
  ]);

  for (const schema of contentSchemas) {
    const ids = schema.fields.map(({ id }) => id);
    for (const id of sharedIds) assert.ok(ids.includes(id), `${schema.id} is missing shared field ${id}`);
    const counts = schemaFieldCounts(schema);
    assert.ok(counts.required >= 7, `${schema.id} needs a durable required base`);
    assert.ok(counts.controlled >= 5, `${schema.id} must expose controlled facts`);
  }
});

test("field authority distinguishes editable intent from governed facts", () => {
  assert.deepEqual(Object.keys(ownerLabels), [
    "author",
    "identity",
    "registry",
    "reviewer",
    "source",
    "derived",
    "runtime"
  ]);
  assert.deepEqual(Object.keys(requirementLabels), ["required", "optional", "deprecated"]);

  for (const item of allContentFields) {
    assert.ok(item.description.length > 35, `${item.schemaId}:${item.id} needs a contract description`);
    if (controlledOwners.has(item.owner)) {
      assert.equal(item.editable, false, `${item.schemaId}:${item.id} is governed and cannot be browser-editable`);
    }
    if (!item.editable) {
      assert.ok(
        controlledOwners.has(item.owner) || item.requirement === "deprecated",
        `${item.schemaId}:${item.id} must be controlled or explicitly deprecated`
      );
    }
  }

  const title = sharedFields.find(({ id }) => id === "title");
  const authors = sharedFields.find(({ id }) => id === "authors");
  const canonical = sharedFields.find(({ id }) => id === "canonical");
  assert.equal(title?.owner, "author");
  assert.equal(title?.editable, true);
  assert.equal(authors?.owner, "identity");
  assert.equal(authors?.editable, false);
  assert.equal(canonical?.owner, "derived");
  assert.match(canonical?.source ?? "", /route manifest/i);
});

test("product schemas reference their registries instead of duplicating governed data", () => {
  const www = contentSchemaById("www-page");
  const docs = contentSchemaById("docs-guide");
  const benchmark = contentSchemaById("benchmark-report");
  const spec = contentSchemaById("spec-proposal");
  const pkg = contentSchemaById("package-release");
  const world = contentSchemaById("world-article");
  const learn = contentSchemaById("learn-lesson");

  assert.match(www?.fields.find(({ id }) => id === "capabilities")?.source ?? "", /package\/spec registry/i);
  assert.equal(docs?.fields.find(({ id }) => id === "namespaces")?.owner, "registry");
  assert.equal(benchmark?.fields.find(({ id }) => id === "evidence")?.owner, "runtime");
  assert.equal(spec?.fields.find(({ id }) => id === "reviewers")?.owner, "reviewer");
  assert.equal(pkg?.fields.find(({ id }) => id === "maintainers")?.owner, "registry");
  assert.equal(world?.fields.find(({ id }) => id === "source")?.owner, "source");
  assert.equal(world?.fields.find(({ id }) => id === "submitted-by")?.owner, "identity");
  assert.equal(learn?.fields.find(({ id }) => id === "verification")?.owner, "runtime");
  assert.match(learn?.fields.find(({ id }) => id === "progress-key")?.description ?? "", /account data/i);
});

test("deprecated fields and migrations are deterministic and stop on ambiguous ownership", () => {
  const docs = contentSchemaById("docs-guide");
  const deprecated = docs?.fields.find(({ id }) => id === "description");
  assert.equal(deprecated?.requirement, "deprecated");
  assert.equal(deprecated?.replacement, "summary");

  assert.equal(migrationExamples.length, 2);
  assert.deepEqual(migrationExamples.map(({ schema }) => schema), ["hara.docs/guide", "hara.world/item"]);
  assert.match(migrationExamples[0].transform, /summary is absent/i);
  assert.match(migrationExamples[0].receipt, /2→3/);
  assert.match(migrationExamples[1].transform, /reject ambiguous ownership/i);
  assert.match(migrationExamples[1].replacement, /authors \+ source/);
});

test("lifecycle states separate author intent from durable acknowledgement", () => {
  assert.deepEqual(lifecycleStates.map(({ id }) => id), [
    "draft",
    "proposed",
    "reviewed",
    "published",
    "superseded",
    "withdrawn"
  ]);

  for (const state of lifecycleStates) {
    assert.ok(state.mutation.length > 55, `${state.id} needs transition semantics`);
    assert.ok(state.receipt.length > 5, `${state.id} needs evidence`);
  }

  assert.match(lifecycleStates.find(({ id }) => id === "draft")?.mutation ?? "", /no public canonical route/i);
  assert.match(lifecycleStates.find(({ id }) => id === "published")?.mutation ?? "", /generated deterministically/i);
  assert.match(lifecycleStates.find(({ id }) => id === "superseded")?.mutation ?? "", /old canonical evidence remains readable/i);
  assert.match(lifecycleStates.find(({ id }) => id === "withdrawn")?.mutation ?? "", /without erasing history/i);
});

test("syndicated provenance keeps source, submitter, review, cluster, digest, and import revision distinct", () => {
  assert.deepEqual(Object.keys(provenanceExample), [
    "item",
    "kind",
    "title",
    "source",
    "sourceUrl",
    "feedUrl",
    "sourcePublishedAt",
    "fetchedAt",
    "submittedBy",
    "canonicalCluster",
    "moderation",
    "contentDigest",
    "importRevision"
  ]);
  assert.match(provenanceExample.source, /source\//);
  assert.match(provenanceExample.submittedBy, /identity\//);
  assert.notEqual(provenanceExample.source, provenanceExample.submittedBy);
  assert.match(provenanceExample.contentDigest, /^sha256:/);
  assert.match(provenanceExample.importRevision, /world-import/);
});

test("relationship authorities cover identity, package, spec, source, evidence, and content", () => {
  assert.deepEqual(relationshipKinds.map(({ id }) => id), [
    "identity",
    "package",
    "spec",
    "source",
    "evidence",
    "content"
  ]);
  for (const relationship of relationshipKinds) {
    assert.ok(relationship.owns.length > 45, `${relationship.id} needs an ownership boundary`);
    assert.ok(relationship.referencedBy.length > 35, `${relationship.id} needs consumers`);
  }
});

test("Markdown, Hara-form, and JSON representations describe the same guide identity", () => {
  assert.match(representationExamples.yaml, /schema: hara\.docs\/guide@3/);
  assert.match(representationExamples.yaml, /id: guide\/schema-values/);
  assert.match(representationExamples.hara, /\(content\/guide/);
  assert.match(representationExamples.hara, /:schema :hara\.docs\/guide@3/);
  assert.match(representationExamples.json, /"schema": "hara\.docs\/guide@3"/);
  assert.match(representationExamples.json, /"id": "guide\/schema-values"/);
  assert.match(representationExamples.json, /"sourceRevision": "637c14a"/);
});

test("the front matter route composes shared catalogue and document primitives", async () => {
  const page = await read("../site/src/pages/v2/frontmatter/index.astro");

  for (const component of [
    "CatalogueHeader",
    "FieldLedger",
    "LifecycleRail",
    "HaraMark",
    "FleetField",
    "Shell",
    "Header",
    "ContextNav",
    "Sidebar",
    "PageHeader"
  ]) assert.match(page, new RegExp(`import ${component} from`), `missing ${component}`);

  assert.match(page, /<CatalogueHeader basePath=\{basePath\} activePath="\/v2\/frontmatter\/"/);
  assert.match(page, /Metadata should explain itself\./);
  assert.match(page, /Reference facts\. Do not duplicate their owners\./);
  assert.match(page, /Publication is a sequence of receipts\./);
  assert.match(page, /World can index a source without becoming it\./);
  assert.match(page, /Issue #37/);

  for (const id of ["contract", "registry", "authoring", "preview", "lifecycle", "provenance", "relationships", "adoption"])
    assert.match(page, new RegExp(`id="${id}"`), `missing ${id} section`);
});

test("the registry renders every schema, requirement, owner, relationship, and endpoint", async () => {
  const [page, ledger] = await Promise.all([
    read("../site/src/pages/v2/frontmatter/index.astro"),
    read("../site/src/components/v2-frontmatter/FieldLedger.astro")
  ]);

  assert.match(page, /contentSchemas\.map/);
  assert.match(page, /data-schema-select=\{schema\.id\}/);
  assert.match(page, /data-schema-panel=\{schema\.id\}/);
  assert.match(page, /<FieldLedger schema=\{schema\}/);
  assert.match(page, /schema\.relationships\.map/);
  assert.match(page, /schema\.endpoints\.map/);

  assert.match(ledger, /requirementLabels\[item\.requirement\]/);
  assert.match(ledger, /ownerLabels\[item\.owner\]/);
  assert.match(ledger, /data-editable=\{item\.editable/);
  assert.match(ledger, /item\.replacement/);
  assert.match(ledger, /Source: \{item\.source\}/);
});

test("authoring separates editable fields from controlled facts and shows invalid, deprecated, and generated states", async () => {
  const page = await read("../site/src/pages/v2/frontmatter/index.astro");

  assert.match(page, /Browser-editable fields/);
  assert.match(page, /Controlled and generated facts/);
  assert.match(page, /data-controlled-field=\{id\}/);
  assert.match(page, /Identity registry/);
  assert.match(page, /Package registry/);
  assert.match(page, /Reviewer workflow/);
  assert.match(page, /data-validation-mode="deprecated"/);
  assert.match(page, /data-validation-mode="invalid"/);
  assert.match(page, /data-validation-summary/);
  assert.match(page, /Generated publication diff/);
  assert.match(page, /deprecated field removed/);

  for (const representation of ["yaml", "hara", "json"])
    assert.match(page, new RegExp(`data-representation(?:-panel)?="${representation}"`), `missing ${representation} representation`);
});

test("previews cover route, search, feed, social, and machine surfaces across theme and viewport", async () => {
  const page = await read("../site/src/pages/v2/frontmatter/index.astro");

  for (const type of ["route", "search", "feed", "social", "machine"])
    assert.match(page, new RegExp(`data-preview-(?:type|panel)="${type}"`), `missing ${type} preview`);

  assert.match(page, /data-preview-theme="light"/);
  assert.match(page, /data-preview-theme="dark"/);
  assert.match(page, /data-preview-viewport="desktop"/);
  assert.match(page, /data-preview-viewport="mobile"/);
  assert.match(page, /Preview identity/);
  assert.match(page, /guide\/schema-values · hara\.docs\/guide@3 · source 637c14a/);
  assert.match(page, /data-copy-preview-receipt/);
});

test("lifecycle, migration, and provenance surfaces expose exact receipts", async () => {
  const [page, rail] = await Promise.all([
    read("../site/src/pages/v2/frontmatter/index.astro"),
    read("../site/src/components/v2-frontmatter/LifecycleRail.astro")
  ]);

  assert.match(page, /<LifecycleRail states=\{lifecycleStates\}/);
  assert.match(page, /data-lifecycle-select=\{state\.id\}/);
  assert.match(page, /publication:guide:9d21/);
  assert.match(page, /source revision/iu);
  assert.match(page, /migrationExamples\.map/);
  assert.match(page, /Rejected migration/);
  assert.match(page, /migration-error:identity-unresolved/);
  assert.match(page, /Object\.entries\(provenanceExample\)/);
  assert.match(page, /world-import-18c2/);
  assert.match(page, /Submitter is not publisher/);

  assert.match(rail, /states\.map/);
  assert.match(rail, /state\.receipt/);
  assert.match(rail, /State changes are ledger facts/);
});

test("the relationship and adoption screens link every downstream product to the shared contract", async () => {
  const page = await read("../site/src/pages/v2/frontmatter/index.astro");

  assert.match(page, /relationshipKinds\.map/);
  assert.match(page, /Content registry/);
  assert.match(page, /Identity/);
  assert.match(page, /Package registry/);
  assert.match(page, /Specs registry/);
  assert.match(page, /Source registry/);
  assert.match(page, /Evidence ledger/);

  for (const issue of [38, 39, 40, 41, 42, 43])
    assert.match(page, new RegExp(`\\[${issue},`), `missing adoption issue ${issue}`);

  assert.match(page, /Author in Markdown or Hara\. Publish through one contract\./);
});

test("the catalogue activates Front matter as an internal route", () => {
  const frontmatter = catalogueItemById("frontmatter");
  assert.ok(frontmatter);
  assert.equal(frontmatter.status, "active");
  assert.equal(frontmatter.href, "/v2/frontmatter/");
  assert.equal(catalogueHref(frontmatter, "/visual-language/"), "/visual-language/v2/frontmatter/");
  assert.equal(catalogueLinkIsExternal(frontmatter), false);
  assert.equal(catalogueItemIsCurrent(frontmatter, "/v2/frontmatter/"), true);
});

test("laboratory interactions cover schema selection, authoring validation, preview state, and lifecycle state", async () => {
  const page = await read("../site/src/pages/v2/frontmatter/index.astro");

  assert.match(page, /const initialiseFrontmatterLab =/);
  assert.match(page, /data-schema-select/);
  assert.match(page, /panel\.focus\(\)/);
  assert.match(page, /const setValidation = \(mode\) =>/);
  assert.match(page, /setView\("diff"\)/);
  assert.match(page, /data-copy-representation/);
  assert.match(page, /data-preview-theme/);
  assert.match(page, /data-preview-viewport/);
  assert.match(page, /Copied.*preview.*revision 637c14a/);
  assert.match(page, /data-lifecycle-select/);
  assert.match(page, /receipt instanceof HTMLElement.*receipt\.focus\(\)/s);
  assert.match(page, /document\.addEventListener\("astro:page-load"/);
});

test("front matter styling is responsive, focus-visible, reduced-motion aware, and token-safe", async () => {
  const css = await read("../site/src/styles/v2-frontmatter.css");

  for (const selector of [
    ".frontmatter-contract-grid",
    ".frontmatter-registry-canvas",
    ".frontmatter-field-ledger",
    ".frontmatter-authoring-board",
    ".frontmatter-preview-board",
    ".frontmatter-lifecycle-rail",
    ".frontmatter-provenance-board",
    ".frontmatter-relationship-map",
    ".frontmatter-adoption-grid"
  ]) assert.match(css, new RegExp(selector.replace(".", "\\.")), `missing ${selector}`);

  assert.match(css, /:focus-visible/);
  assert.match(css, /@media \(max-width: 1320px\)/);
  assert.match(css, /@media \(max-width: 1100px\)/);
  assert.match(css, /@media \(max-width: 900px\)/);
  assert.match(css, /@media \(max-width: 680px\)/);
  assert.match(css, /@media \(max-width: 430px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /min-height: 44px/);
  assert.doesNotMatch(css, /--hara-[A-Za-z0-9_-]+\s*:/);
});

test("the written contract records authority, previews, lifecycle, migration, provenance, receipts, and adoption", async () => {
  const contract = await read("../V2-CONTENT.md");

  for (const heading of [
    "## Shared fields",
    "## Field authority",
    "## Product schemas",
    "## Authoring representations",
    "## Validation",
    "## Preview contract",
    "## Lifecycle",
    "## Migration and deprecation",
    "## Syndicated provenance",
    "## Deterministic publication receipt",
    "## Application adoption"
  ]) assert.match(contract, new RegExp(heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.match(contract, /Front matter stores stable references and presentation intent/);
  assert.match(contract, /Read-only controlled fields remain selectable and inspectable/);
  assert.match(contract, /A preview is not publication/);
  assert.match(contract, /rejects ambiguous ownership/);
  assert.match(contract, /World owns the index object and discussion\. The source owns the article\./);
  assert.match(contract, /A green toast is not a publication receipt/);
  assert.match(contract, /#38.*#39.*#40.*#41.*#42.*#43/s);
});

test("all front matter laboratory files exist", async () => {
  for (const path of [
    "../V2-CONTENT.md",
    "../site/src/lib/v2-frontmatter.mjs",
    "../site/src/components/v2-frontmatter/FieldLedger.astro",
    "../site/src/components/v2-frontmatter/LifecycleRail.astro",
    "../site/src/pages/v2/frontmatter/index.astro",
    "../site/src/styles/v2-frontmatter.css"
  ]) await access(new URL(path, import.meta.url));
});

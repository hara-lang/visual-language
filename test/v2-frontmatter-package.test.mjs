import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import * as packageContract from "../src/v2/frontmatter.mjs";
import * as siteContract from "../site/src/lib/v2-frontmatter.mjs";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("the package publishes the accepted front matter contract and written guide", async () => {
  const pkg = JSON.parse(await read("../package.json"));

  assert.equal(pkg.exports["./v2/frontmatter.js"], "./src/v2/frontmatter.mjs");
  assert.ok(pkg.files.includes("V2-FRONTMATTER.md"));
  await access(new URL("../src/v2/frontmatter.mjs", import.meta.url));
  await access(new URL("../V2-FRONTMATTER.md", import.meta.url));
});

test("the site compatibility entrypoint exposes exactly the package API", async () => {
  const packageNames = Object.keys(packageContract).sort();
  const siteNames = Object.keys(siteContract).sort();

  assert.deepEqual(siteNames, packageNames);
  for (const name of packageNames) {
    assert.strictEqual(siteContract[name], packageContract[name], `${name} must be one shared binding`);
  }

  const compatibility = await read("../site/src/lib/v2-frontmatter.mjs");
  assert.match(compatibility, /export \* from "\.\.\/\.\.\/\.\.\/src\/v2\/frontmatter\.mjs"/);
  assert.doesNotMatch(compatibility, /export const|contentContracts\s*=|sharedFields\s*=/);
});

test("the public API preserves every accepted registry and query surface", () => {
  for (const name of [
    "applicationContractMap",
    "browserEditableFields",
    "combinedSpecimenValues",
    "contentContractById",
    "contentContracts",
    "contentTypeById",
    "contentTypeInventory",
    "controlLabels",
    "controlledFields",
    "derivedFields",
    "fieldInventoryForContract",
    "fieldInventoryForType",
    "frontmatterRepresentations",
    "lifecycleStates",
    "previewFromSpecimen",
    "registryStats",
    "relationships",
    "requiredFieldsForType",
    "sharedFields",
    "specimenValidation",
    "specimens",
    "validateSpecimen"
  ]) assert.ok(name in packageContract, `missing public export ${name}`);

  assert.deepEqual(packageContract.contentContracts.map(({ id }) => id), [
    "www", "docs", "benchmarks", "specs", "packages", "world", "learn"
  ]);
  assert.deepEqual(packageContract.lifecycleStates.map(({ id }) => id), [
    "draft", "proposed", "reviewed", "published", "superseded", "withdrawn"
  ]);
  assert.equal(packageContract.registryStats.families, 7);
  assert.equal(packageContract.registryStats.types, 30);
  assert.equal(packageContract.registryStats.sharedFields, 18);
});

test("representative downstream use works through the package path", () => {
  const docs = packageContract.contentContractById("docs");
  const guide = packageContract.contentTypeById("docs.guide");
  const specimen = packageContract.specimens.find(({ state }) => state === "valid");

  assert.equal(docs?.schemaNamespace, "hara.docs");
  assert.equal(guide?.family, "docs");
  assert.ok(specimen);

  const editable = packageContract.browserEditableFields("docs.guide");
  const controlled = packageContract.controlledFields("docs.guide");
  const derived = packageContract.derivedFields("docs.guide");
  assert.ok(editable.length > 0);
  assert.ok(controlled.length > 0);
  assert.ok(derived.length > 0);
  assert.ok(editable.every(({ control, requirement }) => control === "author" && requirement !== "deprecated"));
  assert.ok(controlled.every(({ control }) => !["author", "derived"].includes(control)));
  assert.ok(derived.every(({ control, derivedFrom }) => control === "derived" && derivedFrom?.length));

  const validation = packageContract.validateSpecimen(specimen);
  assert.equal(validation.some(({ level }) => level === "error"), false);

  const representations = packageContract.frontmatterRepresentations(specimen);
  for (const name of ["yaml", "json", "hara", "markdown", "haraPublication"])
    assert.equal(typeof representations[name], "string", `missing ${name} representation`);

  const preview = packageContract.previewFromSpecimen(specimen);
  assert.deepEqual(Object.keys(preview), ["route", "card", "feed", "search", "social", "machine"]);
  assert.match(preview.route.canonicalUrl, /^https?:\/\//);
});

test("the written contract documents adoption, ownership, compatibility, and validation", async () => {
  const contract = await read("../V2-FRONTMATTER.md");

  for (const heading of [
    "## What the contract contains",
    "## Public data",
    "## Public queries",
    "## Validation",
    "## Representations",
    "## Previews",
    "## Product boundaries",
    "## Adoption rule",
    "## Compatibility entrypoint",
    "## Validation requirements"
  ]) assert.match(contract, new RegExp(heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.match(contract, /@hara-lang\/visual-language\/v2\/frontmatter\.js/);
  assert.match(contract, /site\/src\/lib\/v2-frontmatter\.mjs/);
  assert.match(contract, /npm test/);
  assert.match(contract, /npm run site:build/);
});

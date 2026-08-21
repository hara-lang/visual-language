import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  catalogueGroups,
  catalogueHref,
  catalogueItemById,
  catalogueItemIsCurrent,
  catalogueRouteContext
} from "../site/src/lib/v2-catalogue.mjs";
import {
  ensureSymbolsCatalogueRoute,
  symbolsCatalogueItem
} from "../site/src/lib/v2-symbols-catalogue.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFile(resolve(root, path), "utf8");

test("symbols route is registered once with the shared catalogue arrays", () => {
  const before = catalogueGroups.find(({ id }) => id === "foundations")?.items.filter(({ id }) => id === "symbols").length ?? 0;
  const first = ensureSymbolsCatalogueRoute();
  const second = ensureSymbolsCatalogueRoute();
  const foundations = catalogueGroups.find(({ id }) => id === "foundations");
  assert.equal(first, symbolsCatalogueItem);
  assert.equal(second, symbolsCatalogueItem);
  assert.equal(foundations?.items.filter(({ id }) => id === "symbols").length, 1);
  assert.ok(before === 0 || before === 1);
  assert.equal(catalogueItemById("symbols")?.path, "/v2/symbols/");
  assert.equal(catalogueItemById("symbols")?.status, "active");
  assert.equal(catalogueItemById("symbols")?.issue, 102);
});

test("symbols route resolves through standard catalogue href, current and route-context APIs", () => {
  const route = ensureSymbolsCatalogueRoute();
  assert.equal(catalogueHref(route, "/visual-language/"), "/visual-language/v2/symbols/");
  assert.equal(catalogueItemIsCurrent(route, "/v2/symbols/"), true);
  const context = catalogueRouteContext("/v2/symbols/");
  assert.equal(context?.item.id, "symbols");
  assert.equal(context?.group.id, "foundations");
  assert.equal(context?.family.id, "symbols");
});

test("every shared CatalogueHeader registers the additive symbols route before rendering navigation", async () => {
  const header = await read("site/src/components/v2-catalogue/CatalogueHeader.astro");
  assert.match(header, /import \{ ensureSymbolsCatalogueRoute \} from "\.\.\/\.\.\/lib\/v2-symbols-catalogue\.mjs"/);
  const importIndex = header.indexOf("ensureSymbolsCatalogueRoute");
  const callIndex = header.indexOf("ensureSymbolsCatalogueRoute();");
  const renderIndex = header.indexOf("<CatalogueMasthead");
  assert.ok(importIndex >= 0 && callIndex > importIndex && renderIndex > callIndex);
});

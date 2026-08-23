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

test("symbols route is registered once beneath the primary Iconography route", () => {
  const first = ensureSymbolsCatalogueRoute();
  const second = ensureSymbolsCatalogueRoute();
  const foundations = catalogueGroups.find(({ id }) => id === "foundations");
  const icons = foundations?.items.find(({ id }) => id === "icons");

  assert.equal(first, symbolsCatalogueItem);
  assert.equal(second, symbolsCatalogueItem);
  assert.equal(foundations?.items.filter(({ id }) => id === "symbols").length, 0);
  assert.equal(icons?.children?.filter(({ id }) => id === "symbols").length, 1);

  const symbols = catalogueItemById("symbols");
  assert.equal(symbols?.path, "/symbols/");
  assert.equal(symbols?.status, "settled");
  assert.equal(symbols?.kind, "compatibility");
  assert.equal(symbols?.issue, 102);
  assert.equal(symbols?.parentId, "icons");
  assert.equal(symbols?.parentLabel, "Iconography");
});

test("symbols route resolves through standard href, current and family-context APIs", () => {
  const route = ensureSymbolsCatalogueRoute();
  assert.equal(catalogueHref(route, "/visual-language/"), "/visual-language/symbols/");
  assert.equal(catalogueItemIsCurrent(route, "/symbols/"), true);

  const context = catalogueRouteContext("/symbols/");
  assert.equal(context?.item.id, "symbols");
  assert.equal(context?.group.id, "foundations");
  assert.equal(context?.family.id, "icons");
  assert.equal(context?.parent?.id, "icons");
  assert.equal(context?.statusLabel, "Compatibility route");
  assert.deepEqual(context?.siblings.map(({ id }) => id), ["icons", "symbols"]);
});

test("every shared CatalogueHeader reconciles the Symbols route before rendering navigation", async () => {
  const header = await read("site/src/components/v2-catalogue/CatalogueHeader.astro");
  assert.match(header, /import \{ ensureSymbolsCatalogueRoute \} from "\.\.\/\.\.\/lib\/v2-symbols-catalogue\.mjs"/);
  const importIndex = header.indexOf("ensureSymbolsCatalogueRoute");
  const callIndex = header.indexOf("ensureSymbolsCatalogueRoute();");
  const renderIndex = header.indexOf("<CatalogueMasthead");
  assert.ok(importIndex >= 0 && callIndex > importIndex && renderIndex > callIndex);
});
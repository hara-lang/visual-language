import {
  catalogueGroups,
  catalogueItems
} from "./v2-catalogue.mjs";

export const symbolsCatalogueItem = Object.freeze({
  id: "symbols",
  label: "Semantic symbols",
  path: "/v2/symbols/",
  href: "/v2/symbols/",
  summary: "The merged 24 × 24 semantic symbol inventory retained as a compatibility surface while Iconography remains the primary current destination.",
  status: "settled",
  issue: 102,
  kind: "compatibility",
  tabLabel: "Semantic symbols"
});

/**
 * Register the Symbols compatibility route beneath Iconography without adding
 * a duplicate permanent Foundations destination. The mutation remains
 * idempotent for pages that load CatalogueHeader from independent route trees.
 */
export function ensureSymbolsCatalogueRoute() {
  const foundations = catalogueGroups.find(({ id }) => id === "foundations");
  if (!foundations) throw new Error("Hara v2 catalogue is missing the Foundations group");
  const icons = foundations.items.find(({ id }) => id === "icons");
  if (!icons) throw new Error("Hara v2 catalogue is missing the Iconography route");

  // Remove a legacy top-level registration left by the independent Symbols
  // branch before the catalogue relationship was reconciled.
  foundations.items = foundations.items.filter(({ id }) => id !== symbolsCatalogueItem.id);

  if (!icons.children) icons.children = [];
  const existingChildIndex = icons.children.findIndex(({ id }) => id === symbolsCatalogueItem.id);
  if (existingChildIndex < 0) icons.children.push(symbolsCatalogueItem);
  else icons.children[existingChildIndex] = { ...icons.children[existingChildIndex], ...symbolsCatalogueItem };

  const existingItemIndex = catalogueItems.findIndex(({ id }) => id === symbolsCatalogueItem.id);
  const flattened = {
    ...symbolsCatalogueItem,
    groupId: foundations.id,
    groupLabel: foundations.label,
    parentId: icons.id,
    parentLabel: icons.label
  };
  if (existingItemIndex < 0) catalogueItems.push(flattened);
  else catalogueItems[existingItemIndex] = flattened;

  return symbolsCatalogueItem;
}
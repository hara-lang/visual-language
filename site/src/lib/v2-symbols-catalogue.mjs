import {
  catalogueGroups,
  catalogueItems
} from "./v2-catalogue.mjs";

export const symbolsCatalogueItem = Object.freeze({
  id: "symbols",
  label: "Symbols",
  path: "/v2/symbols/",
  href: "/v2/symbols/",
  summary: "Semantic navigation, action, state, runtime capability, product and evidence symbols with optical sizing and accessible text boundaries.",
  status: "active",
  issue: 102,
  eyebrow: "Iconography and capabilities"
});

/**
 * Register the additive symbols guide with the settled catalogue arrays.
 *
 * `catalogueGroups` and `catalogueItems` are exported mutable arrays even
 * though their bindings are constant. This bounded extension keeps issue #102
 * independent from unrelated catalogue-file churn while preserving the same
 * route-context and navigation APIs for every consumer of CatalogueHeader.
 */
export function ensureSymbolsCatalogueRoute() {
  const foundations = catalogueGroups.find(({ id }) => id === "foundations");
  if (!foundations) throw new Error("Hara v2 catalogue is missing the Foundations group");

  if (!foundations.items.some(({ id }) => id === symbolsCatalogueItem.id)) {
    foundations.items.push(symbolsCatalogueItem);
  }

  if (!catalogueItems.some(({ id }) => id === symbolsCatalogueItem.id)) {
    catalogueItems.push({
      ...symbolsCatalogueItem,
      groupId: foundations.id,
      groupLabel: foundations.label,
      parentId: null,
      parentLabel: null
    });
  }

  return symbolsCatalogueItem;
}

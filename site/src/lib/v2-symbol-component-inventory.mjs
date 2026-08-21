import {
  componentGroups,
  publicComponentInventory,
  v2ComponentInventory
} from "./v2-component-inventory.mjs";
import {
  componentShowcaseGroups,
  showcasedComponentNames
} from "./v2-component-showcase.mjs";

export const symbolComponentRecord = Object.freeze({
  name: "Symbol",
  exportPath: "./astro/v2/Symbol.astro",
  sourcePath: "src/astro/v2/Symbol.astro",
  role: "Renders one stable semantic symbol by public identifier with decorative or labelled SVG accessibility.",
  states: ["decorative", "informative", "six semantic tones"],
  densities: ["16px", "20px", "24px", "32px"],
  responsive: "Retains its optical geometry while the containing labelled control or evidence record yields.",
  accessibility: "Decorative use is hidden; informative use requires a concise label and icon-only controls name the containing action.",
  owner: "shared",
  groupId: "shell",
  groupLabel: "Shell and navigation"
});

export const symbolShowcaseRecord = Object.freeze({
  name: "Symbol",
  path: "src/astro/v2/Symbol.astro"
});

export const symbolShowcaseGroup = Object.freeze({
  id: "semantic-symbol",
  eyebrow: "Semantic layer",
  title: "Symbols and iconography",
  description: "A public semantic identifier, currentColor geometry, optical sizing, text support, and accessible decorative or informative SVG output.",
  components: [symbolShowcaseRecord]
});

/**
 * Register issue #102's additive public Astro export with the settled component
 * catalogue without duplicating or reordering the existing six inventory
 * groups. Arrays are exported as mutable registries even though their bindings
 * are constant, so the extension remains idempotent and visible to every
 * existing inventory/query helper.
 */
export function ensureSymbolComponentInventory() {
  const shellGroup = componentGroups.find(({ id }) => id === "shell");
  if (!shellGroup) throw new Error("Hara v2 component inventory is missing the shell group");

  if (!shellGroup.components.some(({ name }) => name === symbolComponentRecord.name)) {
    const { groupId: _groupId, groupLabel: _groupLabel, ...groupComponent } = symbolComponentRecord;
    shellGroup.components.push(groupComponent);
  }

  if (!publicComponentInventory.some(({ name }) => name === symbolComponentRecord.name)) {
    publicComponentInventory.push(symbolComponentRecord);
  }

  if (!v2ComponentInventory.some(({ name }) => name === symbolComponentRecord.name)) {
    v2ComponentInventory.push(symbolComponentRecord);
  }

  if (!componentShowcaseGroups.some(({ id }) => id === symbolShowcaseGroup.id)) {
    componentShowcaseGroups.push(symbolShowcaseGroup);
  }

  if (!showcasedComponentNames.includes(symbolShowcaseRecord.name)) {
    showcasedComponentNames.push(symbolShowcaseRecord.name);
  }

  return symbolComponentRecord;
}

import {
  componentGroups,
  publicComponentInventory,
  supportComponentInventory,
  v2ComponentInventory
} from "./v2-component-inventory.mjs";
import {
  componentShowcaseGroups,
  showcasedComponentNames
} from "./v2-component-showcase.mjs";

const records = Object.freeze([
  Object.freeze({
    name: "HaraIcon",
    exportPath: "./astro/HaraIcon.astro",
    sourcePath: "src/astro/HaraIcon.astro",
    role: "Renders one original 24 × 24 Hara interface, action, state, or evidence icon by semantic name.",
    states: ["decorative", "informative", "directional", "five optical sizes"],
    densities: ["16px", "20px", "24px", "32px", "48px"],
    responsive: "Retains optical geometry while its labelled parent control owns layout and the 44-pixel interaction target.",
    accessibility: "Decorative output is hidden; informative standalone output requires a label and the SVG never receives focus.",
    owner: "support",
    groupId: "support",
    groupLabel: "Identity and support"
  }),
  Object.freeze({
    name: "HaraGlyph",
    exportPath: "./astro/HaraGlyph.astro",
    sourcePath: "src/astro/HaraGlyph.astro",
    role: "Renders one original 32 × 32 Hara runtime-capability or product-identity glyph.",
    states: ["decorative", "informative", "capability", "product"],
    densities: ["16px", "24px", "32px", "48px"],
    responsive: "Scales inside product launchers and capability records without becoming a generic action icon.",
    accessibility: "Product and capability meaning remains written; standalone meaningful output requires an explicit label.",
    owner: "support",
    groupId: "support",
    groupLabel: "Identity and support"
  }),
  Object.freeze({
    name: "DeliveryFrame",
    exportPath: "./astro/v2/DeliveryFrame.astro",
    sourcePath: "src/astro/v2/DeliveryFrame.astro",
    role: "Frames one email, print, social, text, or static artifact projection with explicit format and lifecycle state.",
    states: ["current", "stale", "unavailable", "failed", "eight formats"],
    densities: ["email column", "print page", "social ratio", "plain text"],
    responsive: "Preserves the artifact reading order while each delivery format owns bounded local geometry.",
    accessibility: "Requires an accessible label, language, direction, and a text-equivalent artifact composition.",
    owner: "shared",
    groupId: "shell",
    groupLabel: "Shell and navigation"
  }),
  Object.freeze({
    name: "ArtifactProvenance",
    exportPath: "./astro/v2/ArtifactProvenance.astro",
    sourcePath: "src/astro/v2/ArtifactProvenance.astro",
    role: "Renders the canonical source, exact revision, authority, status, locale, generated time, and destination of an exported artifact.",
    states: ["current", "accepted", "review", "stale", "unavailable", "failed", "compact"],
    densities: ["regular", "compact"],
    responsive: "Description-list fields reflow to one column while source, revision, authority, and canonical destination remain visible.",
    accessibility: "Uses a labelled semantic region, description list, machine-readable time, and ordinary canonical link.",
    owner: "shared",
    groupId: "shell",
    groupLabel: "Shell and navigation"
  })
]);

export const foundationComponentRecords = records;

export const foundationComponentShowcaseGroup = Object.freeze({
  id: "foundation-extensions",
  eyebrow: "Merged foundation layer",
  title: "Iconography and delivery primitives",
  description: "Original interface/product symbols and the artifact frame/provenance boundary rendered from their public Astro implementations.",
  components: records.map(({ name, sourcePath: path }) => Object.freeze({ name, path }))
});

function appendGroupComponent(groupId, record) {
  const group = componentGroups.find(({ id }) => id === groupId);
  if (!group) throw new Error(`Hara v2 component inventory is missing the ${groupId} group`);
  if (!group.components.some(({ name }) => name === record.name)) {
    const { groupId: _groupId, groupLabel: _groupLabel, ...component } = record;
    group.components.push(component);
  }
}

function appendRecord(target, record) {
  if (!target.some(({ name }) => name === record.name)) target.push(record);
}

/**
 * Restore the component catalogue union after independent public foundation
 * domains add Astro exports. The registration is idempotent and preserves the
 * existing support/shell/tool/runtime group ordering.
 */
export function ensureFoundationComponentInventory() {
  for (const record of records) {
    appendGroupComponent(record.groupId, record);
    appendRecord(publicComponentInventory, record);
    if (record.owner === "support") appendRecord(supportComponentInventory, record);
    if (record.exportPath.startsWith("./astro/v2/")) appendRecord(v2ComponentInventory, record);
  }

  if (!componentShowcaseGroups.some(({ id }) => id === foundationComponentShowcaseGroup.id)) {
    componentShowcaseGroups.push(foundationComponentShowcaseGroup);
  }
  for (const { name } of foundationComponentShowcaseGroup.components) {
    if (!showcasedComponentNames.includes(name)) showcasedComponentNames.push(name);
  }

  return records;
}

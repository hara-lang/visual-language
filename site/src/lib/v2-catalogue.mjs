// @ts-check

/** @typedef {"planned" | "active" | "settled"} CatalogueStatus */
/** @typedef {"current" | "historical" | "compatibility"} CatalogueKind */

/**
 * @typedef {object} CatalogueItem
 * @property {string} id
 * @property {string} label
 * @property {string} path
 * @property {string} summary
 * @property {CatalogueStatus} status
 * @property {string=} href
 * @property {number=} issue
 * @property {string=} eyebrow
 * @property {string=} canonicalPath
 * @property {string[]=} aliases
 * @property {CatalogueKind=} kind
 * @property {string=} tabLabel
 * @property {CatalogueItem[]=} children
 */

/**
 * @typedef {object} CatalogueGroup
 * @property {string} id
 * @property {string} label
 * @property {string} summary
 * @property {CatalogueItem[]} items
 */

const issueUrl = (number) => `https://github.com/hara-lang/visual-language/issues/${number}`;

/** @type {CatalogueGroup[]} */
export const catalogueGroups = [
  {
    id: "foundations",
    label: "Foundations",
    summary: "Shared visual, content, accessibility, evidence, and diagram conventions.",
    items: [
      {
        id: "design-system",
        label: "Design system",
        path: "/v2/foundations/",
        href: "/v2/foundations/",
        summary: "Reference values for identity, colour, typography, spacing, geometry, imagery, motion, and accessibility.",
        status: "active",
        issue: 34,
        eyebrow: "Shared interface rules"
      },
      {
        id: "graphics",
        label: "Graphics",
        path: "/v2/graphics/",
        href: "/v2/graphics/",
        summary: "Background, texture, field, and shader specimens with fallback and reduced-motion states.",
        status: "active",
        eyebrow: "Images and shaders"
      },
      {
        id: "frontmatter",
        label: "Front matter",
        path: "/v2/frontmatter/",
        href: "/v2/frontmatter/",
        summary: "Typed content metadata, controlled fields, lifecycle states, previews, revisions, and provenance.",
        status: "active",
        issue: 37,
        eyebrow: "Content metadata"
      },
      {
        id: "catalogue-guide",
        label: "Catalogue guide",
        path: "/v2/guide/",
        href: "/v2/guide/",
        summary: "Route structure, theme and viewport review, state coverage, validation, lifecycle, and adoption notes.",
        status: "active",
        issue: 90,
        eyebrow: "Architecture and review"
      },
      {
        id: "data-visualisation",
        label: "Data visualisation",
        path: "/v2/data/",
        href: "/v2/data/",
        summary: "Benchmark comparisons, uncertainty, compatibility matrices, runtime telemetry, and missing-data states.",
        status: "active",
        issue: 91,
        eyebrow: "Measurements and evidence"
      },
      {
        id: "diagrams",
        label: "Diagrams",
        path: "/v2/diagrams/",
        href: "/v2/diagrams/",
        summary: "Architecture, runtime flow, sequence, lifecycle, package, and namespace diagrams with complete text alternatives.",
        status: "active",
        issue: 100,
        eyebrow: "Systems and relationships"
      },
      {
        id: "icons",
        label: "Iconography",
        path: "/v2/icons/",
        href: "/v2/icons/",
        summary: "Interface symbols for actions, state, evidence, runtime capabilities, and the public Hara route families.",
        status: "active",
        issue: 106,
        eyebrow: "Symbols and route identity"
      }
    ]
  },
  {
    id: "library",
    label: "Library",
    summary: "Reusable interface specimens, interaction states, and workbench structures.",
    items: [
      {
        id: "components",
        label: "Components",
        path: "/v2/components/",
        href: "/v2/components/",
        summary: "Primitive, compound, document, data, profile, feed, form, tool, environment, and runtime specimens.",
        status: "active",
        issue: 35,
        eyebrow: "Component reference"
      },
      {
        id: "ui-patterns",
        label: "UI patterns",
        path: "/v2/ui/",
        href: "/v2/ui/",
        summary: "Navigation, workflow, loading, empty, error, permission, responsive, and input-state references.",
        status: "active",
        issue: 36,
        eyebrow: "Behaviour and state"
      },
      {
        id: "tool-workbenches",
        label: "Tool workbenches",
        path: "/v2/tool/",
        href: "/v2/tool/",
        summary: "Reference compositions for 3D, node, material, animation, dock, inspector, toolbar, overlay, and status surfaces.",
        status: "settled",
        eyebrow: "Workbench reference"
      }
    ]
  },
  {
    id: "applications",
    label: "Language and community",
    summary: "Public language, documentation, learning, package, specification, playground, and community routes.",
    items: [
      {
        id: "www",
        label: "Hara overview",
        path: "/v2/www/",
        href: "/v2/www/",
        summary: "A plain-language introduction to Hara forms, runtimes, libraries, source, documentation, and benchmark evidence.",
        status: "active",
        issue: 38,
        eyebrow: "Programming language",
        children: [
          {
            id: "www-docs",
            label: "Docs",
            path: "/v2/www/docs/",
            href: "/v2/www/docs/",
            summary: "Task guides, reference material, search, versions, examples, and explicit runtime states.",
            status: "active",
            issue: 38
          },
          {
            id: "www-benchmarks",
            label: "Benchmarks",
            path: "/v2/www/benchmarks/",
            href: "/v2/www/benchmarks/",
            summary: "Workload results with method, runtime, revision, uncertainty, history, and source tables.",
            status: "active",
            issue: 38
          }
        ]
      },
      {
        id: "playground",
        label: "Playground",
        path: "/v2/playground/",
        href: "/v2/playground/",
        summary: "Editor, sample, runtime-session, control-pane, embed, sharing, and mobile execution references.",
        status: "active",
        issue: 39,
        eyebrow: "Runnable examples"
      },
      {
        id: "specs",
        label: "Specifications",
        path: "/v2/specs/",
        href: "/v2/specs/",
        summary: "Versioned specifications, conformance results, proposals, reviews, publication records, and change history.",
        status: "active",
        issue: 40,
        eyebrow: "Required behaviour"
      },
      {
        id: "packages",
        label: "Packages",
        path: "/v2/packages/",
        href: "/v2/packages/",
        summary: "Package and namespace records covering ownership, versions, compatibility, artifacts, provenance, and maintenance.",
        status: "active",
        issue: 41,
        eyebrow: "Distribution and stewardship"
      },
      {
        id: "world",
        label: "World",
        path: "/v2/world/",
        href: "/v2/world/",
        summary: "Articles, discussions, external references, contributor profiles, package activity, presence, and owner-attributed bot comments.",
        status: "active",
        issue: 42,
        eyebrow: "Hara community",
        children: [
          {
            id: "world-discussion",
            label: "Discussion",
            path: "/v2/world/discussion/",
            href: "/v2/world/discussion/",
            summary: "Articles, clippings, comments, contributor identity, presence, attribution, and moderation states.",
            status: "active",
            issue: 42,
            tabLabel: "Discussion"
          },
          {
            id: "world-around",
            label: "Around Hara",
            path: "/v2/world/around/",
            href: "/v2/world/around/",
            summary: "External project and article references with source provenance, curation, moderation, and relay review.",
            status: "active",
            issue: 42
          }
        ]
      },
      {
        id: "learn",
        label: "Learn",
        path: "/v2/learn/",
        href: "/v2/learn/",
        summary: "Introductory explanations, runnable lessons, exercises, projects, progress records, and teaching guidance.",
        status: "active",
        issue: 43,
        eyebrow: "Learning Hara",
        children: [
          {
            id: "learn-start",
            label: "Start here",
            path: "/v2/learn/start/",
            href: "/v2/learn/#start",
            summary: "Read and run a first Hara form, then change it and inspect the result.",
            status: "active",
            issue: 43
          },
          {
            id: "start",
            label: "Repository-guided start",
            path: "/v2/start/",
            href: "/v2/start/",
            canonicalPath: "/v2/learn/start/agent-first/",
            aliases: ["/v2/start/"],
            summary: "Use an agent or inspect the repository directly to choose a verified example, run it, and make one visible change.",
            status: "active",
            tabLabel: "Repository guide"
          },
          {
            id: "learn-world-examples",
            label: "World interface examples",
            path: "/v2/learn/world-examples/",
            href: "/v2/learn/#world-examples",
            summary: "Guided readings of World screens, attribution, discussion, presence, and source handling.",
            status: "active",
            issue: 43,
            tabLabel: "World examples"
          },
          {
            id: "learn-community-study",
            label: "Community reader study",
            path: "/v2/world/community/",
            href: "/v2/world/community/",
            canonicalPath: "/v2/learn/studies/world-community/",
            aliases: ["/v2/world/community/"],
            summary: "An earlier community interface retained as a historical Learn example rather than a current World destination.",
            status: "settled",
            kind: "historical",
            tabLabel: "Community study"
          },
          {
            id: "learn-onboarding-study",
            label: "Programmer onboarding study",
            path: "/v2/world/onboarding/",
            href: "/v2/world/onboarding/",
            canonicalPath: "/v2/learn/studies/programmer-onboarding/",
            aliases: ["/v2/world/onboarding/"],
            summary: "An earlier executable-feed onboarding study retained for comparison and teaching.",
            status: "settled",
            kind: "historical",
            tabLabel: "Onboarding study"
          }
        ]
      }
    ]
  }
];

export const catalogueStatusLabels = {
  planned: "Planned",
  active: "Implemented",
  settled: "Reference"
};

export const catalogueKindLabels = {
  current: "Current route",
  historical: "Historical",
  compatibility: "Compatibility route"
};

/**
 * Flatten the route inventory while preserving parent relationships.
 * @param {CatalogueGroup[]=} groups
 */
export function flattenCatalogueItems(groups = catalogueGroups) {
  return groups.flatMap((group) => group.items.flatMap((item) => [
    { ...item, groupId: group.id, groupLabel: group.label, parentId: null, parentLabel: null },
    ...(item.children ?? []).map((child) => ({
      ...child,
      groupId: group.id,
      groupLabel: group.label,
      parentId: item.id,
      parentLabel: item.label
    }))
  ]));
}

export const catalogueItems = flattenCatalogueItems();

/** @param {string} id */
export function catalogueItemById(id) {
  return catalogueItems.find((item) => item.id === id);
}

/** @param {string} value */
export function normalizeCataloguePath(value) {
  if (!value) return "/";
  let path = String(value).trim();
  try {
    if (/^[a-z][a-z\d+.-]*:\/\//i.test(path)) path = new URL(path).pathname;
  } catch {}
  path = path.split(/[?#]/, 1)[0] || "/";
  if (!path.startsWith("/")) path = `/${path}`;
  return path === "/" || path.endsWith("/") ? path : `${path}/`;
}

/** @param {CatalogueItem} item */
export function catalogueRoutePaths(item) {
  return [...new Set([
    item.path,
    item.canonicalPath,
    ...(item.aliases ?? [])
  ].filter(Boolean).map(normalizeCataloguePath))];
}

/**
 * Resolve implemented routes through the Pages base path and planned routes to their issue.
 * @param {CatalogueItem} item
 * @param {string} basePath
 */
export function catalogueHref(item, basePath) {
  if (item.href) {
    const base = basePath.endsWith("/") ? basePath : `${basePath}/`;
    return `${base}${item.href.replace(/^\/+/, "")}`;
  }
  if (item.issue) return issueUrl(item.issue);
  return "#";
}

/** @param {string} path @param {string} basePath */
export function cataloguePathHref(path, basePath) {
  const base = basePath.endsWith("/") ? basePath : `${basePath}/`;
  return `${base}${normalizeCataloguePath(path).replace(/^\/+/, "")}`;
}

/** @param {CatalogueItem} item */
export function catalogueLinkIsExternal(item) {
  return !item.href && Boolean(item.issue);
}

/**
 * @param {CatalogueItem} item
 * @param {string} activePath
 */
export function catalogueItemIsCurrent(item, activePath) {
  const active = normalizeCataloguePath(activePath);
  return catalogueRoutePaths(item).some((path) => active === path || active.startsWith(path));
}

/** @param {CatalogueGroup} group @param {string} activePath */
export function catalogueGroupIsCurrent(group, activePath) {
  return group.items.some((item) => catalogueItemIsCurrent(item, activePath) || (item.children ?? []).some((child) => catalogueItemIsCurrent(child, activePath)));
}

/** @param {CatalogueItem} item @param {string} activePath */
function catalogueMatchLength(item, activePath) {
  const active = normalizeCataloguePath(activePath);
  return Math.max(0, ...catalogueRoutePaths(item)
    .filter((path) => active === path || active.startsWith(path))
    .map((path) => path.length));
}

/**
 * Resolve the catalogue location, family tabs and predictable parent/previous/next
 * navigation for a deep route. The manifest remains the only source of route
 * relationships; pages supply only their own in-page section anchors.
 * @param {string} activePath
 */
export function catalogueRouteContext(activePath) {
  const active = normalizeCataloguePath(activePath);
  if (active === "/v2/") return null;

  const item = [...catalogueItems]
    .filter((candidate) => catalogueItemIsCurrent(candidate, active))
    .sort((left, right) => catalogueMatchLength(right, active) - catalogueMatchLength(left, active))[0];
  if (!item) return null;

  const group = catalogueGroups.find(({ id }) => id === item.groupId);
  if (!group) return null;

  const parent = item.parentId ? catalogueItemById(item.parentId) : null;
  const family = parent ?? item;
  const familyChildren = family.children ?? [];
  const siblings = parent || familyChildren.length > 0
    ? [family, ...familyChildren]
    : group.items;
  const currentIndex = siblings.findIndex(({ id }) => id === item.id);
  const canonicalPath = normalizeCataloguePath(item.canonicalPath ?? item.path);
  const isAlias = active !== canonicalPath && catalogueRoutePaths(item).includes(active);
  const statusLabel = item.kind === "historical"
    ? catalogueKindLabels.historical
    : catalogueStatusLabels[item.status];

  const crumbs = [
    { id: "catalogue", label: "V2 reference", path: "/v2/" },
    { id: group.id, label: group.label, path: `/v2/#catalogue-${group.id}` }
  ];
  if (parent) crumbs.push({ id: family.id, label: family.label, path: family.path });
  crumbs.push({ id: item.id, label: item.label, path: item.path, current: true });

  return {
    activePath: active,
    item,
    group,
    family,
    parent,
    siblings,
    previous: currentIndex > 0 ? siblings[currentIndex - 1] : null,
    next: currentIndex >= 0 && currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null,
    parentTarget: parent ?? { id: "catalogue", label: "V2 reference", path: "/v2/", href: "/v2/", status: "active" },
    crumbs,
    canonicalPath,
    isAlias,
    statusLabel
  };
}

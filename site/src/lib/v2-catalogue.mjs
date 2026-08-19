// @ts-check

/** @typedef {"planned" | "active" | "settled"} CatalogueStatus */

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
    summary: "Identity, materials, tokens, typography, imagery, motion, and content contracts.",
    items: [
      {
        id: "design-system",
        label: "Design system",
        path: "/v2/foundations/",
        href: "/v2/foundations/",
        summary: "Identity, colour, material, typography, geometry, imagery, motion, and accessibility foundations.",
        status: "active",
        issue: 34,
        eyebrow: "Shared language"
      },
      {
        id: "graphics",
        label: "Graphics",
        path: "/v2/graphics/",
        href: "/v2/graphics/",
        summary: "Cinematic material atmospheres, adaptive fields, repeatable textures, and progressive WebGL shader surfaces.",
        status: "active",
        eyebrow: "Imagery and shaders"
      },
      {
        id: "frontmatter",
        label: "Front matter",
        path: "/v2/frontmatter/",
        href: "/v2/frontmatter/",
        summary: "Cross-product content metadata, controlled fields, lifecycle states, previews, and provenance.",
        status: "active",
        issue: 37,
        eyebrow: "Content contract"
      }
    ]
  },
  {
    id: "library",
    label: "Library",
    summary: "Reusable components, complete interaction patterns, and operational workbench chrome.",
    items: [
      {
        id: "components",
        label: "Components",
        path: "/v2/components/",
        href: "/v2/components/",
        summary: "Primitive, compound, document, data, profile, feed, form, tool, environment, and runtime component specimens.",
        status: "active",
        issue: 35,
        eyebrow: "Reusable inventory"
      },
      {
        id: "ui-patterns",
        label: "UI patterns",
        path: "/v2/ui/",
        href: "/v2/ui/",
        summary: "Navigation, workflows, loading, empty, error, permission, responsive, and input states.",
        status: "active",
        issue: 36,
        eyebrow: "Behaviour over time"
      },
      {
        id: "tool-workbenches",
        label: "Tool workbenches",
        path: "/v2/tool/",
        href: "/v2/tool/",
        summary: "3D, node/material, animation, dock, inspector, toolbar, overlay, and status surfaces.",
        status: "settled",
        eyebrow: "Operational chrome"
      }
    ]
  },
  {
    id: "applications",
    label: "Applications",
    summary: "Focused product laboratories with distinct information architecture and complete workflow states.",
    items: [
      {
        id: "www",
        label: "WWW",
        path: "/v2/www/",
        href: "/v2/www/",
        summary: "The public language site family: narrative, proof, executable examples, Docs, and Benchmarks.",
        status: "active",
        issue: 38,
        eyebrow: "Public language family",
        children: [
          {
            id: "www-docs",
            label: "Docs",
            path: "/v2/www/docs/",
            href: "/v2/www/docs/",
            summary: "Guides, reference, search, live examples, version selection, and embedded runtime states.",
            status: "active",
            issue: 38
          },
          {
            id: "www-benchmarks",
            label: "Benchmarks",
            path: "/v2/www/benchmarks/",
            href: "/v2/www/benchmarks/",
            summary: "Overview, insights, workload matrix, selected evidence, exact context, and methodology.",
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
        summary: "Samples, studio editor, live sessions, optional control panes, embeds, sharing, and mobile execution.",
        status: "active",
        issue: 39,
        eyebrow: "Executable workspace"
      },
      {
        id: "specs",
        label: "Specs",
        path: "/v2/specs/",
        summary: "Registry, detail, checker, conformance, proposal, review, publication, and change digest.",
        status: "planned",
        issue: 40,
        eyebrow: "Standards and checking"
      },
      {
        id: "packages",
        label: "Packages",
        path: "/v2/packages/",
        summary: "Package discovery, namespace stewardship, compatibility, publishing, provenance, and maintenance.",
        status: "planned",
        issue: 41,
        eyebrow: "Distribution and ownership"
      },
      {
        id: "world",
        label: "World",
        path: "/v2/world/",
        href: "/v2/world/",
        summary: "Cross-source feeds, clippings, comments, external signals, presence, contributor profiles, packages, and accountable bots.",
        status: "active",
        issue: 42,
        eyebrow: "Community reader",
        children: [
          {
            id: "world-discussion",
            label: "Focused discussion",
            path: "/v2/world/discussion/",
            href: "/v2/world/discussion/",
            summary: "Articles, feeds, clippings, comments, presence, contributor identity, and the World/Learn boundary.",
            status: "active",
            issue: 42
          },
          {
            id: "world-around",
            label: "Around Hara",
            path: "/v2/world/around/",
            href: "/v2/world/around/",
            summary: "External signal discovery, curation, source provenance, moderation, and review-first relay workflows.",
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
        summary: "Curriculum, runnable lessons, guided product examples, projects, progress, and teaching contracts.",
        status: "active",
        issue: 43,
        eyebrow: "Structured learning",
        children: [
          {
            id: "learn-start",
            label: "Start here",
            path: "/v2/learn/start/",
            href: "/v2/learn/#start",
            summary: "A short path from the first runnable form to a useful Hara project.",
            status: "active",
            issue: 43
          },
          {
            id: "start",
            label: "Agent-first Start",
            path: "/v2/start/",
            href: "/v2/start/",
            summary: "Point an agent at Hara, inspect the evidence behind its recommendation, build a living Habitat, and make one visible mutation.",
            status: "active"
          },
          {
            id: "learn-world-examples",
            label: "World interface examples",
            path: "/v2/learn/world-examples/",
            href: "/v2/learn/#world-examples",
            summary: "Guided readings of World screens, attribution, discussion, presence, and source handling.",
            status: "active",
            issue: 43
          },
          {
            id: "learn-community-study",
            label: "Community reader study",
            path: "/v2/world/community/",
            href: "/v2/world/community/",
            summary: "The earlier focused community interface retained as a Learn example rather than a World menu destination.",
            status: "settled"
          },
          {
            id: "learn-onboarding-study",
            label: "Programmer onboarding study",
            path: "/v2/world/onboarding/",
            href: "/v2/world/onboarding/",
            summary: "The executable-feed acquisition study retained under Learn for comparison and teaching.",
            status: "settled"
          }
        ]
      }
    ]
  }
];

export const catalogueStatusLabels = {
  planned: "Planned buildout",
  active: "Active study",
  settled: "Settled contract"
};

/**
 * Flatten the route inventory while preserving parent relationships.
 * @param {CatalogueGroup[]=} groups
 */
export function flattenCatalogueItems(groups = catalogueGroups) {
  return groups.flatMap((group) => group.items.flatMap((item) => [
    { ...item, groupId: group.id, parentId: null },
    ...(item.children ?? []).map((child) => ({ ...child, groupId: group.id, parentId: item.id }))
  ]));
}

export const catalogueItems = flattenCatalogueItems();

/** @param {string} id */
export function catalogueItemById(id) {
  return catalogueItems.find((item) => item.id === id);
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

/** @param {CatalogueItem} item */
export function catalogueLinkIsExternal(item) {
  return !item.href && Boolean(item.issue);
}

/**
 * @param {CatalogueItem} item
 * @param {string} activePath
 */
export function catalogueItemIsCurrent(item, activePath) {
  return activePath === item.path || activePath.startsWith(item.path.endsWith("/") ? item.path : `${item.path}/`);
}

/** @param {CatalogueGroup} group @param {string} activePath */
export function catalogueGroupIsCurrent(group, activePath) {
  return group.items.some((item) => catalogueItemIsCurrent(item, activePath) || (item.children ?? []).some((child) => catalogueItemIsCurrent(child, activePath)));
}

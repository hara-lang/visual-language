# Hara visual language v2 — catalogue guide and review contract

## Status

The executable guide lives at `/v2/guide/`. It is the architecture, validation and adoption surface for the complete v2 catalogue. It does not replace product laboratories, external accessibility testing, durable screenshot evidence or downstream integration tests.

The guide is part of issue #44 through focused issue #90. Follow-on expansion domains are tracked by #89. The merged-union reconciliation of Diagrams, Semantic Symbols, Iconography and Delivery Media is tracked by #112.

## Why the catalogue exists

Hara v2 has two kinds of material:

1. **Shared interface language** — identity, tokens, typography, material, components, UI patterns, content contracts, evidence graphics, diagrams, symbols/iconography, delivery media, workbench geometry, responsive behavior and accessibility.
2. **Focused application laboratories** — WWW, Docs, Benchmarks, Playground, Specs, Packages, World and Learn, each with its own information architecture and complete states.

The catalogue makes those contracts reviewable together without pretending they are one product.

## Route manifest contract

`site/src/lib/v2-catalogue.mjs` is the single source of route relationships. It owns:

- Foundations, Library and Applications groups;
- canonical route identity;
- parent/child relationships;
- active, planned and settled status;
- historical and compatibility labels;
- route breadcrumbs, family tabs, neighbours and parent targets;
- issue-backed links for routes that are not yet implemented.

A page owns only its local section anchors and demonstrated product navigation. It must not duplicate the global catalogue array.

The issue #44 closeout inventory is:

```text
/v2/
/v2/foundations/
/v2/components/
/v2/ui/
/v2/frontmatter/
/v2/tool/
/v2/www/
/v2/www/docs/
/v2/www/benchmarks/
/v2/playground/
/v2/specs/
/v2/packages/
/v2/world/
/v2/learn/
```

Current extension routes such as Graphics, Data visualisation, Diagrams, Iconography, Delivery Media, Agent-first Start, Around Hara, World Discussion and Hara Chrome remain inspectable alongside the closeout matrix. `/v2/symbols/` remains discoverable beneath Iconography as a compatibility surface. Historical World community, onboarding and feed studies remain secondary and must not compete with the current product route.

## Navigation ownership

### Global catalogue

Visual Language owns the block-H masthead, Browse launcher, Source and theme controls. It knows the complete catalogue but no product workflow.

The permanent masthead does not gain a new item for every shared domain. Foundations, Library and Applications remain the stable global groups; Data, Diagrams, Iconography, Delivery Media and future domains appear inside the app launcher and route context.

### Route and family

The manifest owns breadcrumb/location, family sibling tabs, route status, parent, previous/next and the catalogue page footer.

### Product-local navigation

Each application owns its own task structure: Registry, Checker, Feed, Lesson, Practice, Workspace, Publish, Maintainer or equivalent. Product-local navigation does not become another catalogue group.

### Demonstrated product chrome

Embedded toolbars, tabs, inspectors and commands belong to the product specimen. They must be framed so reviewers can distinguish them from Visual Language navigation.

## Ownership layers

### Shared package

Owns semantic tokens, typography, material, focus, state grammar, stateless Astro components, evidence/diagram presentation, icon and symbol geometry, delivery projection and workbench geometry.

Does not own product data, runtime behavior, registry decisions, identity facts, review outcomes, artifact truth or business rules.

### Catalogue composition

Owns route relationships, representative fixtures, visual comparison, fixture disclosure and acceptance guidance.

Does not own production accounts, authoritative content, moderation, evaluation, package publication, artifact generation authority or learner progress.

### Product application

Owns information architecture, commands, preferences, local forms, local navigation, export workflows and product-specific composition.

Does not own facts controlled by identity, source, registry, reviewer or runtime authorities.

### Registry and runtime authority

Owns canonical identities, exact revisions, capabilities, checks, decisions, artifacts, observations and receipts.

A Visual Language fixture may demonstrate those facts but cannot generate or certify them.

## Live review matrix

The guide reviews each required route through:

- explicit light and dark themes;
- 1440 × 900 desktop;
- 1024 × 900 tablet;
- 680 × 860 compact;
- 390 × 844 phone;
- 320 × 720 minimum width;
- route, navigation, theme, responsive, keyboard, no-hover, overflow, reduced-motion, contrast, state and provenance checks.

The embedded frame is same-origin so the guide can apply an explicit theme to the reviewed document without changing the parent page preference. The frame uses the exact route and viewport dimensions and owns its own horizontal overflow.

Local “Accepted” and “Needs work” buttons are review aids only. They do not persist and are not an accessibility certification.

## Screenshot and accessibility review procedure

1. Build and serve the exact branch. Record the branch SHA and route revision.
2. Open each required route in explicit light and dark themes.
3. Capture 1440 × 900, 1024 × 900, 680 × 860, 390 × 844 and 320 × 720 frames.
4. Exercise keyboard navigation, focus visibility, disclosures, local overflow and one representative product mutation.
5. Capture loading, empty, error, disabled and success plus all route-specific degraded and lifecycle states.
6. Record contrast, reduced-motion, no-hover and source/provenance observations beside the image.
7. Store screenshots as review evidence linked to the exact issue or pull request, not as package assets.
8. Invalidate affected evidence whenever a route, shared token, shell or state contract changes.

A durable record should include:

```text
repository
pull request
exact head SHA
route
route revision or fixture revision
theme
viewport
product state
review checks performed
result
reviewer
screenshot or recording reference
```

## Common state contract

Every current route must expose, where relevant:

- loading;
- empty;
- recoverable and fatal error;
- disabled or unavailable action;
- success or accepted state;
- product-specific lifecycle and degraded states;
- exact authority and provenance for claims.

Unavailable must not silently become failure. Missing must not become zero. Historical must not become current. A fixture must not become a production claim. An artifact-generation failure must not silently become failure of the source object being reported.

## Route lifecycle

### Planned

A typed manifest record links to an executable issue. Do not publish a shallow placeholder route.

### Active

A detailed internal route exists on `main`, has focused contract tests and is a primary catalogue destination.

### Settled

The shared contract is stable enough for downstream pinning. Changes require compatibility review.

### Compatibility

An already-published route or package surface remains supported while a newer primary destination is established. Compatibility routes are visibly secondary, retain their public exports and name a future migration decision rather than disappearing from navigation silently.

### Historical

A replaced study remains useful for comparison or teaching. It is clearly labelled, secondary and points to the current product relationship.

### Deprecated

The route or contract names a replacement, migration path, compatibility period and eventual removal release.

## Symbols and Iconography compatibility

Concurrent accepted work produced two useful but overlapping public surfaces:

- `/v2/icons/`, `icons.js`, `HaraIcon.astro`, `HaraGlyph.astro` and `v2-icons.css` are the primary current iconography and product/capability-glyph direction;
- `/v2/symbols/`, `v2/symbols.js`, `Symbol.astro` and `v2-symbols.css` remain a settled 24 × 24 semantic-symbol compatibility surface.

Both package exports remain additive. The catalogue nests Semantic Symbols beneath Iconography so the permanent Foundations list does not present two unrelated primary symbol directions. A later focused compatibility issue may define one-to-one migration after downstream usage is known; #112 does not remove or rewrite either geometry system.

## Adding a new application buildout

1. Create an executable issue with Outcome, Scope, Acceptance criteria, Validation, Relationships, Readiness and Delivery.
2. Add one typed manifest record. A planned route points to the issue until the detailed route exists.
3. Declare the product boundary, local information architecture, authoritative sources and downstream target.
4. Consume shared components, UI patterns and content contracts without redefining protected tokens.
5. Build realistic landing, deep-work, degraded, responsive, light/dark, keyboard and reduced-motion states.
6. Add focused tests, package-documentation impact and downstream adoption notes.
7. Validate the exact branch with repository-wide tests, static build and the live review matrix before merge.

## CSS and component boundaries

The package owns:

- `v2.css` for document and product shells;
- `v2-tool.css` for viewport-first workbenches;
- `v2-data.css` for accessible evidence graphics;
- the public `v2-diagrams.css` wrapper for architecture, flow, sequence, lifecycle and relationship grammar;
- `v2-icons.css`, `icons.js`, `HaraIcon.astro` and `HaraGlyph.astro` for primary iconography and product/capability glyphs;
- `v2-symbols.css`, `v2/symbols.js` and `Symbol.astro` for the compatibility semantic-symbol surface;
- `v2-media.css`, `DeliveryFrame.astro` and `ArtifactProvenance.astro` for email, print, social, static and artifact-provenance composition;
- exported stateless Astro components;
- protected `--hara-*` semantic tokens;
- responsive and focus-visible base behavior.

A product may own composition, local layout, realistic fixtures and business-rule presentation. Product CSS consumes protected tokens and must not redefine them.

The guide route owns only guide composition and local review interactions. Shared-domain routes may publish stateless components only when they remove repeated semantic or accessibility mistakes.

## Downstream adoption map

| Visual route | Intended target | Guide |
| --- | --- | --- |
| `/v2/data/` | Evidence-bearing surfaces across Hara products | `V2-DATA-VISUALISATION.md` |
| `/v2/diagrams/` | Architecture, runtime, package and explanatory surfaces across Hara products | `V2-DIAGRAMS.md` |
| `/v2/icons/` | Current navigation, action, state, capability and product identity | `V2-ICONS.md` |
| `/v2/symbols/` | Existing semantic-symbol adopters during compatibility period | `V2-SYMBOLS.md` |
| `/v2/media/` | Email, print/PDF, social, plain-text and low-bandwidth artifacts | `V2-MEDIA.md` |
| `/v2/www/` | `hara-www` | `V2-WWW.md` |
| `/v2/www/docs/` | `hara-docs` | `V2-WWW.md` |
| `/v2/www/benchmarks/` | `hara-benchmarks` | `V2-WWW.md` |
| `/v2/playground/` | Playground and live-component repositories | `V2-PLAYGROUND.md` |
| `/v2/specs/` | `hara-specs` | `V2-SPECS.md` |
| `/v2/packages/` | package and namespace registry product | `V2-PACKAGES.md` |
| `/v2/world/` | `hara-world` | World adoption notes in the route and front-matter contract |
| `/v2/learn/` | `learn.hara-lang.org` | `V2-LEARN.md` |

Downstream pull requests are independent and pin only merged Visual Language revisions. They keep product behavior and authoritative data in the product repository.

## Release impact

The catalogue guide is additive:

- `/v2/guide/` remains the closeout and adoption review route;
- `V2-GUIDE.md` remains part of the published documentation set;
- current shared-domain routes `/v2/data/`, `/v2/diagrams/`, `/v2/icons/` and `/v2/media/` consume the same review grammar;
- `/v2/symbols/` remains available and discoverable as a compatibility route;
- v1 and all existing v2 imports and routes remain available;
- historical studies remain available;
- every current route retains a Catalogue guide relationship in its footer or route context.

## Expansion beyond the initial catalogue

Issue #89 tracks the next shared visual-language domains:

- data visualisation and evidence graphics — active at `/v2/data/`;
- architecture and explanatory diagrams — active at `/v2/diagrams/`;
- iconography and product/capability symbols — active at `/v2/icons/`, with `/v2/symbols/` retained for compatibility;
- email, print, social and low-bandwidth delivery media — active at `/v2/media/`;
- shared motion choreography and reduced-motion equivalents — next unimplemented slice.

Those slices use this route, ownership and review contract rather than inventing separate acceptance processes.

## Verification contract

Focused tests cover:

- exact required-route inventory and uniqueness;
- manifest relationships and active guide route;
- merged shared-domain package and catalogue union;
- primary Iconography versus compatibility Semantic Symbols hierarchy;
- active Delivery Media route and package exports;
- public Diagrams wrapper retention;
- light/dark and five-width matrix dimensions;
- complete common and product-specific state inventories;
- current extension versus compatibility and historical route labels;
- navigation and ownership layers;
- route lifecycle and new-application procedure;
- live frame, theme injection, local review decisions and checklist behavior;
- focus, contained overflow, 44-pixel touch controls, responsive breakpoints and reduced motion;
- protected-token ownership;
- packaged documentation and cross-links;
- repository-wide `npm test` and `npm run site:build` on the exact pull-request head.

# Hara visual language v2 — iconography and product glyph contract

## Status

The executable guide lives at `/v2/icons/`. It is the shared iconography, state-symbol, runtime-capability and product-glyph contract tracked by issue #106 under expansion epic #89.

Import the public surface with:

```astro
---
import HaraIcon from "@hara-lang/visual-language/astro/HaraIcon.astro";
import HaraGlyph from "@hara-lang/visual-language/astro/HaraGlyph.astro";
import { haraIconNames, haraGlyphNames } from "@hara-lang/visual-language/icons.js";
import "@hara-lang/visual-language/v2.css";
import "@hara-lang/visual-language/v2-icons.css";
---
```

The catalogue and components are dependency-free. Downstream products do not copy SVG path data; they select a stable semantic name from the shared catalogue.

## Purpose

Hara products need one coherent symbol language for:

- navigation and disclosure;
- editing and operational commands;
- state and evidence distinctions;
- runtime capability identity;
- product-family identity;
- dense tool and browser-extension chrome;
- email, print and low-bandwidth projections.

Without a shared contract, products drift into emoji, arbitrary Unicode, copied icon-library silhouettes, colour-only states and different meanings for the same shape. This guide gives the Hara ecosystem original geometry, stable names and safe rendering defaults while keeping product commands and authoritative state in the product repository.

## Geometry families

### Interface icons

Interface, action, state and evidence symbols use a `24 × 24` monoline grid.

Defaults:

```text
stroke width: 1.75
line cap: round
line join: round
fill: none
colour: currentColor
focusable child: false
```

Supported review scales are 16, 20, 24, 32 and 48 pixels. The `size` prop is authoritative and renders explicit pixel dimensions.

### Capability and product glyphs

Capability and product identity use a `32 × 32` grid with a default stroke width of `1.6`.

Glyphs may use one Hara signal aperture through `.hara-glyph-signal`. The accent is a family cue only. It does not encode live availability, success or selection.

The signal yields to `currentColor` in forced-colour mode.

## Originality contract

All geometry is original to Hara Visual Language.

Do not:

- trace or adapt Apple, Microsoft, Google, GitHub, Material, Lucide, Heroicons or other icon-library silhouettes;
- copy franchise or entertainment symbols;
- use vendor product marks as Hara capability icons;
- replace settled chrome with emoji or arbitrary Unicode;
- embed third-party icon fonts or runtimes;
- paste public catalogue path data into downstream product components.

External vendors and platforms retain their written name and, where necessary, a neutral external-authority symbol. Their logo is not recreated as a Hara glyph.

## Naming contract

Names are lowercase semantic identifiers:

```text
home
search
run
publish
success
unavailable
session
scene-3d
product-world
```

Rules:

- name the user or system concept, not the geometry;
- use one primary name and a small documented alias set;
- product identities use the `product-` prefix;
- external authority state uses `external-state` so it cannot collide with the navigation action `external`;
- breaking name changes require an alias and migration period;
- aliases resolve to a catalogue concept and do not create duplicate geometry exports.

## Public interface icon families

### Navigation and disclosure

- `home`
- `back`
- `forward`
- `up`
- `menu`
- `close`
- `search`
- `filter`
- `expand`
- `collapse`
- `external`
- `more`

Directional icons carry `data-directional="true"` and mirror automatically beneath `[dir="rtl"]`.

### Actions and editing

- `add`
- `remove`
- `edit`
- `copy`
- `save`
- `share`
- `run`
- `stop`
- `retry`
- `refresh`
- `download`
- `upload`
- `publish`
- `inspect`
- `compare`

A symbol does not decide whether an action is destructive, disabled or permitted. The parent product control supplies wording, state, confirmation and authority.

## State and evidence vocabulary

### Shared state symbols

- `success` / alias `current`
- `pending`
- `warning`
- `error` / alias `failed`
- `unavailable`
- `partial`
- `stale`
- `external-state`
- `proposed`
- `historical`
- `locked`

State is always written. Colour, enclosing shape and line treatment reinforce the text.

Examples:

```astro
<span class="hara-state-symbol" data-state="partial">
  <HaraIcon name="partial" size={16} decorative />
  Partial
</span>
```

### Evidence distinctions

`missing`, `zero`, `unsupported`, `unavailable` and `error` are not interchangeable.

| State | Example value | Meaning |
| --- | --- | --- |
| Missing | `—` | No measurement or fact was supplied |
| Measured zero | `0` | A valid measurement exists and equals zero |
| Unsupported | `N/A` | The target does not implement the comparison or capability |
| Unavailable | `offline` | The fact may exist but cannot be obtained now |
| Failed | `error` | The attempt reached a terminal failure |

A compact table must preserve those words even when it uses the symbol.

## Runtime capability glyphs

The public capability names are:

- `session`
- `code` / alias `source`
- `files`
- `storage`
- `canvas`
- `scene-3d`
- `audio`
- `network`
- `timer`
- `queue`
- `database`
- `native`
- `wasm`
- `package`
- `namespace`
- `agent`

The glyph identifies the capability type. Runtime/provider authority supplies its state.

Required capability states are:

- available;
- requested;
- attached;
- degraded;
- denied;
- unavailable.

Availability, request and attachment are separate facts. A product must not infer attachment merely because the host advertises availability.

Capability cards pair the glyph with written state and an exact revision or receipt:

```text
Files
Requested
filesystem:pending
```

## Product glyphs

The Hara family has six primary product glyphs:

- `product-www`
- `product-playground`
- `product-specs`
- `product-packages`
- `product-world`
- `product-learn`

Product glyphs identify destinations in launchers, catalogue cards, favicons/app icons and compact product navigation.

They must not be reused as:

- generic actions;
- evidence state;
- capability availability;
- arbitrary decorative motifs.

The visible product name remains present or becomes the accessible name of a standalone glyph link.

## Accessibility contract

### Decorative icon inside labelled control

When visible text names the command, the icon is decorative:

```astro
<button class="hara-v2-button hara-icon-label">
  <HaraIcon name="run" size={20} decorative />
  <span>Run source</span>
</button>
```

The SVG uses `aria-hidden="true"` and `focusable="false"`.

### Icon-only control

The parent control requires the accessible name; the SVG remains decorative:

```astro
<button class="hara-icon-button" aria-label="Search Hara">
  <HaraIcon name="search" size={20} decorative />
</button>
```

### Meaningful standalone symbol

A standalone meaningful icon uses `role="img"` and an explicit label:

```astro
<HaraIcon name="warning" size={24} label="Warning" decorative={false} />
```

`HaraIcon` and `HaraGlyph` reject a meaningful use without a label.

### Focus

The SVG never receives keyboard focus. Focus belongs to the parent button, link, row or card. There is no required information in a hover tooltip.

### Touch targets

Icon-only interactive controls use at least 44 × 44 pixels. Compact desktop toolbars may visually present denser groups only when an equivalent 44px touch/mobile composition exists.

### Forced colours

The public CSS uses system colours for controls, focus and selected state. The signal accent becomes `currentColor`. Dashed and double border treatments survive without colour.

### Reduced motion

No animation is required to identify an icon or glyph. Product-launcher transitions are removed under `prefers-reduced-motion: reduce`.

## Composition classes

### `.hara-icon-label`

Aligns an icon and visible label while allowing the text to own the accessible name.

### `.hara-icon-button`

Provides a 44px icon-only control with hover, selected, disabled, focus and forced-colour behavior.

### `.hara-icon-badge`

Positions a short textual count or marker beside an icon. The parent accessible name includes the count where it affects meaning.

### `.hara-state-symbol`

Pairs state icon and written state with non-colour enclosing treatment.

### `.hara-capability-card`

Composes capability glyph, label, description, exact revision and written capability state.

### `.hara-product-launcher`

Composes product glyph, product name, summary and destination. It is a destination pattern, not a command button.

## RTL contract

Only direction-sensitive interface icons mirror beneath `[dir="rtl"]`:

- back;
- forward;
- up where product direction semantics require it.

Fixed-orientation state, evidence, capability and product glyphs do not mirror automatically.

Products remain responsible for choosing the correct visible label and route direction.

## Ownership boundary

### Visual Language owns

- semantic names and aliases;
- original SVG geometry;
- 24px and 32px grids;
- optical weight, caps and joins;
- decorative versus meaningful rendering defaults;
- shared state-symbol and composition classes;
- RTL marker behavior;
- forced-colour and reduced-motion treatment;
- product-family visual relationship.

### Product applications own

- where an icon appears;
- visible labels and accessible names;
- command dispatch and shortcuts;
- selected, disabled and destructive behavior;
- product-local composition;
- whether a glyph is the correct identity for a destination.

### Runtimes, registries and identity authorities own

- capability availability and attachment;
- runtime and provider state;
- package, namespace and proposal status;
- permissions and locks;
- exact revisions and receipts;
- publication and moderation decisions.

Visual Language fixtures demonstrate presentation only and must not become production state.

## Downstream adoption

| Product | Primary uses |
| --- | --- |
| WWW and Docs | Navigation, external links, evidence state and product-family wayfinding |
| Playground | Run/stop/retry, session/files/canvas/3D capability and host state |
| Specs | Checker outcomes, proposal/current/historical state and publication actions |
| Packages | Package/namespace identity, compatibility state, publishing and stewardship |
| World | Feed actions, source/external state, comments, presence and accountable bots |
| Learn | Lesson navigation, practice actions, progress state and product examples |
| Tool workbenches | Dense icon controls with visible labels, shortcuts and touch alternatives |
| Hara Chrome | Compact extension chrome, runtime capabilities and host identity |

Adoption steps:

1. Pin a merged Visual Language revision.
2. Import `icons.js`, `v2-icons.css`, `HaraIcon.astro` and `HaraGlyph.astro`.
3. Select a stable semantic name rather than copying path data.
4. Write the visible or accessible label before choosing decorative/meaningful rendering.
5. Obtain current state and capability facts from the relevant authority.
6. Review 16, 20, 24, 32 and 48px scales in light/dark, keyboard, RTL, forced-colour and reduced-motion modes.
7. Keep local commands, receipts and product state in the downstream repository.

## Adding an icon or glyph

A new public symbol requires:

- an executable issue describing the missing semantic concept;
- proof that an existing public name cannot represent it;
- original 24px or 32px geometry;
- review at all supported scales;
- category and stable primary name;
- aliases only where migration or strong convention requires them;
- decorative and meaningful accessibility examples;
- forced-colour and RTL review where relevant;
- focused tests and catalogue documentation;
- no duplicate geometry under another name.

## Release impact

This additive release:

- adds `/v2/icons/`;
- exports `@hara-lang/visual-language/icons.js`;
- exports `@hara-lang/visual-language/v2-icons.css`;
- exports `HaraIcon.astro` and `HaraGlyph.astro`;
- publishes `V2-ICONS.md`;
- adds an active Foundations catalogue route;
- preserves v1 and all existing v2 routes and exports;
- adds no icon runtime, command dispatcher or capability service.

## Verification contract

Focused tests cover:

- exact public names and categories;
- unique names, aliases and product geometry;
- valid deterministic geometry for every symbol;
- no external icon-library dependency;
- component rejection of unknown names;
- decorative and meaningful ARIA behavior;
- authoritative pixel sizing;
- route sections and shared catalogue shell;
- state/evidence distinctions and capability lifecycle;
- six product glyphs and their destination-only rule;
- package exports and documentation;
- 44px controls, RTL mirroring, forced colours and reduced motion;
- protected-token ownership;
- repository-wide `npm test` and `npm run site:build` on the exact pull-request head.

# Hara visual language v2 — iconography and capability symbols

## Status

The public semantic inventory lives in `src/v2/symbols.mjs`, the stateless Astro renderer is exported as `astro/v2/Symbol.astro`, and the additive presentation layer is `v2-symbols.css`.

The executable catalogue reference is delivered through `/v2/symbols/` under issue #102 and parent expansion epic #89. It follows the review grammar in `V2-GUIDE.md`, the evidence distinctions in `V2-DATA-VISUALISATION.md`, and the authority and annotation boundaries in `V2-DIAGRAMS.md`.

The inventory owns stable semantic names and geometry. Products, runtimes, registries, identity services and repositories remain authoritative for commands, capabilities, state, ownership, revisions and receipts.

## Public entry points

```css
@import "@hara-lang/visual-language/v2.css";
@import "@hara-lang/visual-language/v2-symbols.css";
```

```astro
---
import Symbol from "@hara-lang/visual-language/astro/v2/Symbol.astro";
---

<button class="hara-v2-symbol-button" type="button" aria-label="Run example">
  <Symbol name="action-run" size={20} />
</button>

<span class="hara-v2-symbol-state" data-state="ready">
  <Symbol name="state-ready" size={16} />
  Ready
</span>
```

For framework-free consumers:

```js
import {
  symbolInventory,
  symbolById,
  symbolsByFamily,
  symbolOpticalSizes
} from "@hara-lang/visual-language/v2/symbols.js";
```

The package does not ship an icon font, runtime command map, capability detector, permission system, product router or state machine.

## Core rule

**Meaning before glyph.** Every public symbol has:

- one stable semantic identifier;
- one human-readable label;
- one family;
- one usage boundary;
- one text-support rule;
- one currentColor-compatible shape on the shared 24 × 24 viewBox;
- explicit interaction, destructive-action and recommended-tone metadata where relevant.

The same identifier never changes meaning across products. A product may choose a different visible label when context requires it, but it must not repurpose the glyph for an unrelated command or state.

## Naming contract

Identifiers use `family-semantic-name`:

```text
nav-home
action-evaluate
state-unavailable
capability-filesystem
product-playground
evidence-revision
```

Family prefixes are part of the public contract. They prevent a generic glyph such as a triangle, square or document outline from silently acquiring conflicting meanings.

Do not name symbols after their shape alone (`triangle`, `circle`, `bolt`) when the public meaning is an action, state, capability or evidence fact.

## Families

### Navigation and location

Navigation symbols describe movement or hierarchy: home, back, forward, menu, section, external destination, search and breadcrumb context.

Familiar navigation symbols may be icon-only when:

- the containing control has an accessible name;
- the scope is unambiguous;
- the target is at least 44 × 44 CSS pixels where interactive;
- keyboard focus remains visible;
- the meaning does not rely on hover.

External destinations retain a visible label or adjacent external-destination text because control and trust boundaries matter.

### Actions

Actions describe immediate commands: run, stop, restart, evaluate, edit, save, copy, inspect, attach, detach, publish, approve, reject and revoke.

Visible text is required for:

- unfamiliar commands;
- destructive commands;
- commands whose product meaning differs from the generic symbol label;
- attach, detach, publish, approve, reject and revoke;
- commands whose requested and actual outcome may differ.

An action symbol does not claim success. The command result is represented separately with state and evidence.

### State

State symbols describe ready, busy, connecting, connected, warning, error, unavailable, disabled, stale, partial, missing, incomparable, deprecated and superseded.

State meaning always includes:

- a visible word or sentence;
- a non-colour cue in the glyph;
- the named subject of the state;
- evidence or recovery detail when the state affects a workflow.

`Unavailable` is not a synonym for `error`. `Missing` is not zero. `Partial` is not success. `Incomparable` is not failure. `Deprecated` remains available for compatibility; `superseded` names a replacement identity.

### Runtime capabilities

Capability symbols describe session, filesystem, network, process, timer, message, transaction, canvas, audio, 3D, camera, microphone and external provider boundaries.

A capability symbol never proves the capability is available. The surrounding product must show:

- requested versus actual capability state;
- provider or host identity;
- capability revision or fence;
- permissions or restrictions;
- recovery or fallback where applicable.

Capabilities remain text-supported because similar hardware or host shapes may have different authority and privacy consequences.

### Products

Product symbols identify WWW, Docs, Benchmarks, Playground, Specs, Packages, World and Learn.

They are labelled product marks, not standalone logos. The visible product name remains present in navigation, onboarding, external links and accessibility text. Product symbols do not replace the protected Hara block-H identity.

### Authority and evidence

Evidence symbols identify source, exact revision, registry, runtime observation, receipt, external authority, user-owned bot and verified maintainer facts.

They remain adjacent to exact text such as:

```text
source: hara-lang/hara
revision: ce4139f1e7a7b0fd
authority: hara-specs-registry
session: session-01J…
generation: 7
receipt: receipt-0184
owner: @maintainer
```

A verification or maintainer symbol does not create trust. It reflects evidence controlled by the named authority.

## Geometry

All public symbols use:

- a `0 0 24 24` viewBox;
- open, rounded line geometry;
- `currentColor` for stroke;
- no essential raster layer;
- no fixed background;
- no perspective, faux depth or ornamental material effect;
- optical stroke adjustments at 16, 20, 24 and 32 pixels.

The renderer supports only those four public optical sizes. Consumers needing a larger illustration should compose a labelled symbol with text and layout rather than scaling a compact control glyph into a brand mark.

## Colour and tone

Symbols are monochrome by default and inherit current text colour.

Optional tones map to existing v2 state tokens:

- `signal` — current selection, active command or in-progress state;
- `success` — ready, connected or completed fact;
- `warning` — attention, stale, partial or deprecated fact;
- `danger` — error, rejection, revocation or destructive consequence;
- `muted` — low-priority supporting information.

Tone supplements meaning. The glyph and visible label remain complete without colour. Products do not assign arbitrary brand colours to semantic state symbols.

## Accessibility

### Decorative symbols

A symbol adjacent to equivalent visible text is decorative by default. `Symbol.astro` emits `aria-hidden="true"` unless a label is supplied or `decorative={false}` is requested.

### Informative symbols

An informative standalone symbol receives `role="img"` and an accessible label:

```astro
<Symbol name="evidence-receipt" label="Publication receipt" decorative={false} />
```

Use this sparingly. A visible label usually serves more readers.

### Icon-only controls

The containing button or link owns the accessible name:

```astro
<button type="button" aria-label="Copy exact revision" class="hara-v2-symbol-button">
  <Symbol name="action-copy" />
</button>
```

Do not put competing labels on both the button and decorative SVG.

### State and destructive actions

State and destructive symbols retain visible text. Colour, position, animation and the SVG alone are insufficient.

### Forced colours and print

The stylesheet resolves symbols to the current system text colour in forced-colour mode. Borders, focus and selected states remain visible. Print output removes decorative backgrounds and retains symbols, labels, evidence and state text.

## Interaction boundary

`Symbol.astro` is stateless. It renders geometry and accessibility attributes only.

The product owns:

- click, keyboard and command handling;
- selected, pressed and current state;
- tooltips and help disclosure;
- authorization and confirmation;
- requested versus actual runtime state;
- capability discovery;
- persistence;
- analytics;
- destructive-action recovery.

The shared `.hara-v2-symbol-button` class provides a 44-pixel target and visible focus, but it does not attach behavior.

## Product guidance

### WWW and Docs

Use navigation, external destination, source and revision symbols sparingly. Search and copy may be icon-only with accessible names. Evidence and external authority remain text-supported.

### Benchmarks

Use source, revision, observation, missing, partial and incomparable symbols alongside exact measurement context. Symbols do not replace units, direction, sample counts, confidence or methodology.

### Playground

Use run, stop, evaluate, edit, inspect and capability symbols. Requested commands remain separate from ready, busy, connecting, connected, unavailable and error state.

### Specs

Use registry, revision, source, approve, reject, publish, deprecated and superseded symbols. Conformance state remains a word and evidence record, not a coloured badge alone.

### Packages

Use package, namespace-adjacent evidence, maintainer, compatibility and publication actions. The product-packages mark does not replace exact coordinates or namespace identity.

### World

Use source, external authority, owned bot, maintainer, message and presence-related product composition. Bot ownership remains visibly linked to the present owner.

### Learn

Use run, edit, ready, partial and progress-adjacent compositions with visible teaching labels. Do not turn symbols into engagement rewards.

## Responsive contract

### 1440 and 1024 pixels

- show symbol, label and supporting usage together;
- preserve evidence and product labels;
- compare 16, 20, 24 and 32 pixel optical sizes;
- keep the semantic inventory and selected inspector adjacent where space permits.

### 680 pixels

- stack the inspector below the inventory;
- keep two-column symbol grids where labels remain readable;
- retain 44-pixel controls;
- allow local overflow only for explicit comparison rows.

### 390 and 320 pixels

- use one-column labelled records;
- never hide required text to preserve an icon grid;
- keep state and capability evidence in normal document flow;
- avoid horizontal page scrolling;
- do not require hover.

## Motion

Symbols do not animate by default. Busy, connecting and data-update motion belongs to the surrounding component and must have a complete static state.

Under `prefers-reduced-motion: reduce`, symbol controls remove non-essential transitions. No meaning depends on rotation, pulsing, drawing or morphing.

## Ownership boundary

Visual Language owns:

- stable semantic identifiers;
- family classification;
- line geometry and optical sizing;
- currentColor and tone behavior;
- accessibility defaults;
- shared labelled, state, button, grid and evidence presentation;
- responsive, forced-colour, print and reduced-motion rules;
- the deterministic reference inventory.

Products own:

- available commands and capabilities;
- application-local labels and information architecture;
- command dispatch and lifecycle transitions;
- authorization, moderation and publication rules;
- identity and ownership facts;
- runtime, registry and source evidence;
- interaction persistence and telemetry.

## Adoption checklist

A downstream symbol adoption is ready when:

- the product pins a merged Visual Language revision;
- every used symbol exists in the public inventory;
- the semantic identifier matches the actual command, state, capability, product or evidence fact;
- unfamiliar, destructive, product, capability and evidence symbols retain visible text;
- icon-only controls have accessible names and 44-pixel targets;
- decorative SVGs are hidden from assistive technology;
- state does not rely on colour;
- requested and actual state remain separate;
- 16, 20, 24 and 32 pixel sizes are reviewed in light and dark themes;
- 1440, 1024, 680, 390 and 320 pixel layouts are reviewed;
- keyboard, focus, no-hover, forced-colour, print and reduced-motion behavior is checked;
- product authority and behavior remain downstream.

## Verification

Focused tests verify:

- public inventory and shape parity;
- unique semantic identifiers and shape identifiers;
- complete family coverage;
- the shared 24 × 24 viewBox and optical sizes;
- state, capability, product and evidence text rules;
- destructive-action treatment;
- Astro component accessibility output and supported size/tone checks;
- package exports and written contract;
- currentColor, forced-colour, print, 44-pixel control, responsive and reduced-motion CSS;
- no protected-token redefinition, icon font or copied external asset dependency;
- repository-wide `npm test` and `npm run site:build` on the exact pull-request head.

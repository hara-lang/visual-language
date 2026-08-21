# Hara visual language v2 — delivery-media contract

## Status

The executable guide lives at `/v2/media/`. It is the shared Hara v2 contract for email, print/PDF, social-card, plain-text, feed and low-bandwidth/static projections tracked by issue #108 under expansion epic #89.

Import the public preview and static-composition surface with:

```astro
---
import DeliveryFrame from "@hara-lang/visual-language/astro/v2/DeliveryFrame.astro";
import ArtifactProvenance from "@hara-lang/visual-language/astro/v2/ArtifactProvenance.astro";
import "@hara-lang/visual-language/v2.css";
import "@hara-lang/visual-language/v2-media.css";
---
```

The package controls presentation and provenance layout. Products, registries, runtimes and reviewers control the source facts exported into an artifact.

## Purpose

Hara interfaces leave the live application through:

- editorial and transactional email;
- print and PDF;
- Open Graph and campaign images;
- plain text, Markdown and open feeds;
- static/no-JavaScript pages;
- low-bandwidth and image-disabled views;
- downloadable evidence and diagnostic packets.

Those channels remove assumptions that are normal on the live web: CSS variables, modern layout, custom fonts, JavaScript, hover, motion, background ink, wide viewports and reliable image display. A Hara artifact remains useful because the semantic content, source revision, authority, state and canonical destination survive every projection.

## Artifact envelope

Every exportable artifact declares:

```text
artifact type
template
canonical URL
source identity
source revision
authority
status
locale
direction
generated at
stale-after boundary where relevant
plain-text or alt-text equivalent
```

The package component `ArtifactProvenance.astro` renders this envelope consistently. It validates required fields but does not decide their values.

### Source truth

One semantic story may project into many formats. The format may shorten the title, change hierarchy or remove imagery, but it must not change:

- source identity;
- source revision;
- authority;
- canonical URL;
- measured proof;
- artifact state;
- locale and direction;
- text equivalent.

A delivery artifact can become stale or fail to generate without changing the underlying package, specification, benchmark or runtime result.

## Public components

### `DeliveryFrame.astro`

A stateless wrapper for previewing or composing one artifact projection.

Props:

```text
format: email | print | og | square | portrait | story | text | static
label: required accessible label
title: optional visible caption
state: current | stale | unavailable | failed
language: BCP 47 language tag
direction: ltr | rtl | auto
class: optional local class
```

The component validates format, state and label, then exposes:

```text
data-delivery-format
data-artifact-state
lang
dir
```

It supplies no generation, export, email-send, print or image-rendering behavior.

### `ArtifactProvenance.astro`

Renders the complete artifact envelope as a semantic description list.

Required fields:

```text
artifactType
template
canonicalUrl
sourceIdentity
sourceRevision
authority
status
locale
direction
generatedAt
```

Optional fields:

```text
staleAfter
textEquivalent
```

The compact mode hides secondary preview fields but retains source, revision, authority and canonical destination.

## Email contract

### Structural limits

Production email must remain usable when clients:

- strip JavaScript;
- ignore CSS variables;
- remove external stylesheets;
- block images;
- replace custom fonts;
- invert colours unpredictably;
- restrict width to a narrow viewport.

The reference composition uses a single 600px-safe column, table-based structural fallback, system fonts and ordinary links.

### Editorial email

A digest contains:

- meaningful subject;
- hidden preheader with useful non-duplicated summary;
- written product identity;
- short ordered entries;
- canonical source and revision for each item;
- one public web archive link;
- preferences and unsubscribe links;
- editorial/source authority;
- plain-text companion in the same reading order.

### Transactional email

A receipt or alert contains:

- exact outcome word;
- object identity and revision;
- receipt identifier;
- authoritative checks or facts;
- canonical record link;
- source/registry/runtime authority;
- no marketing content that obscures the result;
- plain-text companion.

### Styling

The guide preview uses `.hara-media-email`, but production email resolves layout and colours into client-compatible inline/static values. It does not ship `var(--hara-*)` into an inbox and assume the live-site cascade exists.

Decorative image blocks may be added by a product. Their absence must not remove title, proof, status, source, action or unsubscribe controls.

## Print and PDF contract

### Page formats

The shared contract targets:

- A4;
- US Letter;
- 17–20mm equivalent margins;
- body text that remains legible without page scaling;
- running title, source revision and page number;
- controlled breaks, widows and orphans;
- repeating table headers where supported.

### Evidence continuity

Every evidence-bearing print artifact includes:

- source revision;
- authority;
- status;
- canonical URL;
- uncertainty or interpretation boundary where relevant;
- written evidence state;
- diagram/table textual equivalent.

Unsupported, unavailable and missing values are not printed as zero.

### Links

Links required for comprehension expand their URL in print. Decorative or redundant navigation links may remain unexpanded.

### Colour and imagery

Print meaning survives:

- grayscale;
- background suppression;
- missing images;
- page copying/scanning;
- PDF text extraction.

Words, borders, line style and table structure carry state. Large dark backgrounds are not required.

### Diagrams and data graphics

A diagram travels with its equivalent relation list, event table, transition table or adjacency table. A chart travels with data/evidence context, uncertainty and missing-state wording.

## Social and campaign-card contract

### Aspect families

| Format | Canvas | Default safe inset |
| --- | ---: | ---: |
| Open Graph | 1200 × 630 | 72px horizontal, 60px vertical |
| Square | 1080 × 1080 | 84px horizontal and vertical |
| Portrait | 1080 × 1350 | 84px horizontal, 108px vertical |
| Story | 1080 × 1920 | 96px horizontal, 240px vertical |

Safe zones are data and review overlays. They are not baked into the final export.

### Semantic content

A card contains:

- source/product identity;
- short title;
- one proof fact or useful descriptor;
- canonical destination;
- exact source or template revision in the artifact manifest;
- alt text generated from the same semantic content.

Avoid:

- long body copy;
- unreadable code blocks;
- multiple competing proof facts;
- essential text near crop boundaries;
- platform UI assumptions outside the safe zone;
- unexplained decorative product marks.

### Product family

WWW, Playground, Specs, Packages, World and Learn share one Hara card structure while retaining written product names and distinct product identity.

This delivery-media issue is independent of the iconography branch. Once the iconography revision merges, products may consume settled `product-*` glyphs rather than copying temporary guide marks.

### Alt text

Every meaningful social card has a text equivalent containing:

- product/source;
- title;
- proof or summary;
- destination.

Decorative atmosphere is omitted from alt text.

## Plain-text, feed and low-bandwidth contract

### Semantic HTML first

Static output begins with headings, paragraphs, lists, tables, details and ordinary links. Enhancement may add imagery or interaction but cannot be required to reveal essential content.

### Plain text

Plain-text ordering is:

1. product/source identity;
2. title;
3. short summary;
4. proof or result;
5. status;
6. source revision;
7. authority;
8. canonical URL;
9. preferences/unsubscribe where relevant.

### Open feeds

RSS, Atom or JSON Feed items retain:

- stable item ID;
- canonical URL;
- title and content text;
- publication/update time;
- source identity and revision;
- authority/status extension facts where the product supports them.

A feed reader may simplify presentation but must not collapse distinct evidence states or discard the canonical source.

### Low-bandwidth mode

Low-bandwidth/image-disabled mode removes:

- decorative images;
- video;
- canvas/WebGL;
- decorative SVG;
- non-essential motion and effects.

It retains:

- written product/source identity;
- title and summary;
- state and proof;
- source revision and authority;
- canonical URL;
- semantic table/code/list structure.

## Artifact state contract

### Current

The artifact reflects the cited current source revision.

### Stale

The artifact was valid for an older source revision and should be regenerated. It links to the newer canonical source where known.

### Unavailable

The requested projection cannot currently be generated or retrieved. A plain-text or simpler static projection should remain available where possible.

### Failed

Generation reached a terminal failure with an exact receipt. This is an artifact-generation failure, not automatically a failure of the source object or operation being reported.

State uses written wording plus line treatment:

```text
current      solid
stale        dotted
unavailable  dashed/broken
failed       double
```

Colour only reinforces this contract.

## Accessibility contract

- one meaningful reading order exists in email and static output;
- headings and landmarks remain semantic;
- meaningful images have useful alt text;
- decorative images are explicitly decorative;
- social-card meaning has a text equivalent;
- colour and imagery never carry the only state/evidence cue;
- print contrast remains legible without background ink;
- essential URLs survive print;
- tables remain understandable linearly and repeat headers where supported;
- no interaction is required to reveal essential content;
- forced-colour output uses system colours;
- language and direction are explicit;
- email preferences/unsubscribe controls remain ordinary links;
- no animation is required to understand an artifact.

## Internationalisation

Every artifact declares locale and direction. Products own translation and pluralisation. Visual Language owns layout behavior for:

- longer headings and buttons;
- RTL direction;
- local date/number formatting supplied by the product;
- CJK line breaking and font fallback;
- plain-text order;
- crop-safe social composition.

A translated artifact does not silently reuse alt text from another locale.

## Ownership boundary

### Visual Language owns

- format geometry;
- hierarchy and spacing;
- safe-zone conventions;
- print pagination and URL expansion patterns;
- email/static fallback structure;
- provenance/footer treatment;
- artifact-state presentation;
- forced-colour, print and reduced-motion rules;
- stateless preview/composition components.

### Products own

- which artifact is generated;
- editorial selection;
- visible wording and translated content;
- recipient workflow;
- export/send/download commands;
- subscription preferences;
- local template composition;
- artifact storage and audit trail.

### Source, registry, runtime and review authorities own

- canonical identities;
- source revisions;
- measurements and uncertainty;
- package/spec/proposal state;
- runtime results and receipts;
- reviewer decisions;
- publication permissions;
- expiry/staleness boundaries;
- recipient authorization.

Visual Language fixtures demonstrate projection only and must never be treated as current product facts.

## Downstream adoption

| Product | Delivery artifacts |
| --- | --- |
| WWW / Docs | Article print, PDF guide, link card and release email |
| Benchmarks | Evidence report, comparison card and downloadable packet |
| Playground | Session/share receipt, static runnable excerpt and failure packet |
| Specs | Proposal/review PDF, decision alert and conformance packet |
| Packages | Release receipt, package sheet and compatibility digest |
| World | What’s new/hot email, feed item and article card |
| Learn | Lesson printout, project brief and progress receipt |
| Hara Chrome | Diagnostics export, capability receipt and static issue packet |

Adoption steps:

1. Resolve one semantic artifact and authoritative envelope.
2. Select a channel template without changing source truth.
3. Inline or flatten deliberately for the target channel.
4. Generate alt/plain text from the same semantic object.
5. Review inbox clients, A4/Letter, social crops, image-disabled, no-JS, forced-colour and reduced-motion modes.
6. Store artifact revision, generator revision and source/authority receipts.
7. Pin only a merged Visual Language revision.

## Public CSS classes

- `.hara-delivery-frame`
- `.hara-delivery-frame-content`
- `.hara-artifact-provenance`
- `.hara-media-safe-zone`
- `.hara-media-social-card`
- `.hara-media-social-proof`
- `.hara-media-email`
- `.hara-media-email-shell`
- `.hara-media-email-preheader`
- `.hara-media-email-button`
- `.hara-media-print-page`
- `.hara-media-print-running-header`
- `.hara-media-print-running-footer`
- `.hara-media-print-evidence`
- `.hara-media-print-url`
- `.hara-media-plain-text`
- `.hara-media-low-bandwidth`

Products may extend composition with product-owned classes but do not redefine protected `--hara-*` tokens.

## Release impact

This additive release:

- adds `/v2/media/`;
- exports `@hara-lang/visual-language/v2-media.css`;
- exports `DeliveryFrame.astro` and `ArtifactProvenance.astro`;
- publishes `V2-MEDIA.md`;
- adds an active Foundations catalogue route;
- preserves v1 and all existing v2 imports and routes;
- adds no email sender, PDF renderer, screenshot service, social API, feed publisher or artifact storage service.

## Verification contract

Focused tests cover:

- deterministic fixture and artifact envelopes;
- exact format, safe-zone and artifact-state inventory;
- one semantic story across seven projections;
- email preheader, web link, preferences/unsubscribe and text companion;
- package receipt checks and exact revision;
- A4/Letter/print evidence conventions;
- benchmark missing/unsupported distinction;
- four social aspect families and six product cards;
- alt-text and plain-text equivalents;
- semantic no-JS/low-bandwidth projection;
- public component validation;
- package exports and catalogue route;
- print, forced-colour, responsive and reduced-motion CSS;
- protected-token ownership;
- repository-wide `npm test` and `npm run site:build` on the exact pull-request head.

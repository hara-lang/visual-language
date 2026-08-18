# Hara interface language v2

Version 2 is an opt-in interface layer for Hara's public sites and tools. It
keeps the existing identity and theme machinery while changing the spatial
language from soft material cards to flat fleet-command surfaces.

The reference mood is military space opera seen through an illustrator's
technical notebook: matte hull panels, command rails, sparse telemetry, and
slightly imperfect construction lines. It must remain recognisably Hara rather
than reproduce any franchise symbol, ship, type treatment, or control panel.

## Identity invariants

- Keep the current `HaraMark`: the block H and its single signal-colour dot.
- Keep the current heading family. `--hara-v2-font-heading` aliases
  `--hara-font-sans`; v2 changes hierarchy and spacing, not the wordmark.
- Use one primary blue signal. Orange, green, and red are state colours, not
  decoration.
- Light and dark modes are equal products. Light mode is pale steel and paper,
  not a washed-out dark mode.
- Structure comes from one-pixel seams, compact rails, and clipped corners.
  Shadows are ambient only; controls do not imitate thick physical hardware.
- Hand-drawn character is a quiet second line, grid drift, and original
  technical illustration. It must never reduce text contrast or data density.

## Public contract

Import the v2 layer after the shared theme and place `hara-v2` at the interface
root. The exported Astro shell already adds the class.

```astro
---
import Shell from "@hara-lang/visual-language/astro/v2/Shell.astro";
import Header from "@hara-lang/visual-language/astro/v2/Header.astro";
import "@hara-lang/visual-language/v2.css";
---

<Shell sidebar={false}>
  <Header slot="header" section="Specs" nav={ecosystemNav} />
  <section class="hara-v2-panel">...</section>
</Shell>
```

The initial component contract is deliberately small:

- `Shell` owns header, context, rail, main, inspector, and footer slots.
- `Header` owns the persistent Hara identity and ecosystem navigation.
- `ContextNav` owns product-local navigation and command actions.
- `Sidebar` owns grouped, count-aware navigation.
- `PageHeader` owns page title, actions, metadata, and optional illustration.
- `FleetField` is an original monochrome command-deck illustration that follows
  the current theme through `currentColor` and the Hara signal token.

Everything else is a class-level primitive in `v2.css`. This lets Starlight,
Astro pages, and framework-free surfaces use the same geometry without forcing
one component model on every repository.

## Layout families

### WWW

The public site uses a broad single-column shell: ecosystem header, large page
header, proof strip, three-column capability decks, executable code surface,
and a restrained closing command. There is no permanent rail. Illustration may
occupy half of the hero, but product copy remains the first reading order.

### Docs

Documentation uses the full information shell: ecosystem header, product
context row, grouped left rail, prose main column, and a quiet right outline.
Search, version selection, REPL controls, and canvas state are command controls,
not rounded marketing pills. Code remains dark in both themes so syntax and
selection behaviour stay stable.

### Specs

Specifications use an application shell: ecosystem header, local workflow tabs,
registry or form main area, and a validation inspector. Tables, status badges,
publication checks, and digest values use compact rows and monospace labels.
The inspector disappears first as the viewport narrows.

### Benchmarks

Benchmark evidence uses a dense command board: evidence header, dataset tabs,
metric strip, comparison matrix, and selected-cell inspector. The visual signal
must indicate selection or a measured win, never simply add colour. Method and
raw-data links remain adjacent to the result they qualify.

### World

World uses an editorial command shell: ecosystem header, community section row,
optional feed filters, story stream, and right-side lesson/community modules.
Profiles and agents share one card grammar. Posting is the clear command action,
while reading surfaces keep the paper-like lightness of the theme.

## Responsive order

1. Remove the inspector below `1120px`.
2. Collapse the rail below `820px`; products provide a drawer trigger in the
   header or context row.
3. Preserve horizontal context navigation as a scrollable row.
4. Stack illustrated page headers and data cards below `820px`.
5. At phone widths, keep controls at least 34px high and make primary page
   actions full-width.

## Adoption sequence

1. Ship the opt-in package contract and the five-layout laboratory.
2. Move `hara-www` onto the header, page-header, proof, card, and code primitives.
3. Map Starlight variables and documentation rails to v2 without changing REPL
   behaviour.
4. Move Specs and Benchmarks, which exercise tables, tabs, badges, and inspectors.
5. Move World last, after feed, profile, form, and account states are covered.
6. Promote v2 from experimental only after screenshots, keyboard navigation,
   reduced-motion behaviour, and both themes are verified across all five sites.

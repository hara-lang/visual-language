# Hara v2 graphics contract

The v2 graphics layer adds original monumental, painterly-industrial technology to Hara without turning the interface language into entertainment artwork or generic science-fiction UI.

Published laboratory:

**https://hara-lang.github.io/visual-language/v2/graphics/**

## Invariants

The atmospheric layer may increase scale, texture, pressure, and optical depth, but it does not alter the Hara identity contract:

- the block H and signal dot remain fixed;
- signal blue remains functional and visually sparse;
- light and dark modes are equivalent presentations of the same material;
- surfaces remain inspectable and compatible with working tools;
- still imagery carries the complete composition before motion is enabled;
- motion is progressive enhancement and never communicates required state by itself.

Avoid franchise imitation, recognisable characters, costumes, logos, signature props, decorative particle clouds, rainbow light, glass-card styling, biological apertures, and continuous movement that does not reveal structure.

## Static field library

`assets/cinematic/manifest.json` is the catalogue for twelve adaptive `4096 × 2304` SVG fields:

1. `monolith-gate`
2. `silica-drift`
3. `ink-foundry`
4. `signal-canyon`
5. `vault-storm`
6. `machine-sun`
7. `fracture-vault`
8. `conduit-horizon`
9. `carbon-ridge`
10. `phase-loom`
11. `pressure-well`
12. `night-aperture`

Each file includes an accessible title and description, an internal light/dark palette, resolution-independent geometry, procedural grain, and restrained signal blue.

## Repeatable textures

The texture primitives live under `assets/cinematic/textures/`:

- `etched-copper`
- `silt-grain`
- `circuit-weave`
- `glass-fissure`
- `ritual-grid`
- `dust-field`
- `prism-noise`
- `archival-paper`

They are scalable SVG material fields, not screenshots or fixed-resolution noise maps.

## Material atmospheres

Atmospheres change apparent material and environmental pressure rather than identity:

| Atmosphere | Character |
| --- | --- |
| `monolith` | graphite mass, hard thresholds, isolated signal |
| `silica` | dry mineral light, long horizons, optical heat |
| `foundry` | inked carbon, rough process, machined containment |
| `nocturne` | operational night, structural ribs, sparse telemetry |
| `reliquary` | pale ceramic armour, archival seams, protected core |
| `storm` | directional pressure, vault geometry, charged atmosphere |

Import `@hara-lang/visual-language/v2-graphics.css`, then apply `hara-v2-graphics` and `data-atmosphere` to a page or contained surface.

## WebGL shader fields

`ShaderField.astro` compiles real vertex and fragment shaders in the browser. Available modes are:

- `strata`
- `ink`
- `monolith`
- `lattice`
- `shimmer`
- `field`

```astro
---
import ShaderField from "@hara-lang/visual-language/astro/v2/ShaderField.astro";
import "@hara-lang/visual-language/v2.css";
import "@hara-lang/visual-language/v2-graphics.css";
---

<ShaderField
  mode="strata"
  atmosphere="silica"
  motion={true}
  interactive={true}
  fallback="/cinematic/silica-drift.svg"
  label="Dry Hara strata moving across a calibrated execution route"
/>
```

`motion` and `interactive` default to `false`.

The component:

- renders a deterministic still frame when motion is off;
- honours `prefers-reduced-motion` even when motion was requested;
- pauses animation while off screen;
- caps device pixel ratio to limit GPU cost;
- updates uniforms when the Hara light/dark theme changes;
- uses pointer input only on explicitly interactive fields;
- retains a matched static SVG when WebGL is unavailable or its context is lost;
- supports multiple independent fields on one page.

## Composition

Prefer one dominant field per viewport. Leave broad quiet zones around headings, prose, code, and controls. Align gates, seams, apertures, and ridges to the page or editor grid. Signal blue should occupy less than five percent of most frames.

Static imagery carries meaning. Shader motion may deepen the field, but must never be required to understand navigation, selection, runtime state, or content.

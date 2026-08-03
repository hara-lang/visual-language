# Hara imagery and field system

Hara imagery makes computation visible without turning the interface into generic cyberpunk decoration. The visual language stays precise, material, and quiet: structure first, signal second, atmosphere last.

## Live laboratory

The published visual language is available at:

**https://hara-lang.github.io/visual-language/**

The Pages site is rebuilt from `main` by `.github/workflows/pages.yml`.

## Identity anchors

The existing Hara mark remains the primary identity. The field system extends it with a restrained directional spectrum:

- **Cyan** `#27B8B0` — live state and entry
- **Blue** `#2F7CFF` — evaluation and movement
- **Violet** `#7957D5` — expansion and emergence
- **Void** `#050608` — dark computational ground
- **Frost** `#F4F6F8` — light on the dark ground

Use cyan → blue → violet as a semantic progression, not as a decorative rainbow. Most interface chrome should remain neutral; the spectrum belongs in state, focus, paths, and large atmospheric fields.

## Static backgrounds

Every background is an adaptive SVG on a `4096 × 2304` design canvas. SVG is resolution-independent, so the same source can be exported at 4K, 8K, print, or smaller responsive sizes without losing sharpness.

| Asset | Purpose |
| --- | --- |
| `assets/backgrounds/evaluation-field.svg` | Hero, launch, and evaluation state |
| `assets/backgrounds/ast-field.svg` | Compiler, AST, and macroexpansion material |
| `assets/backgrounds/symbol-lattice.svg` | Section texture, covers, and repeated symbolic fields |
| `assets/backgrounds/dataflow-orbit.svg` | State, agents, events, and orchestration |
| `assets/backgrounds/kernel-depth.svg` | Runtime, VM, WASM, and execution-stack depth |

The files use `prefers-color-scheme` internally, include accessible titles and descriptions, and contain no embedded text that would interfere with localisation or responsive cropping.

## Live effects

Import the effect layer and component:

```astro
---
import Backdrop from "@hara-lang/visual-language/astro/Backdrop.astro";
import "@hara-lang/visual-language/theme.css";
import "@hara-lang/visual-language/effects.css";
---

<section class="hero">
  <Backdrop effect="syntax" intensity="balanced" />
  <div class="hero__content">
    <h1>Inspect the whole evaluation path.</h1>
  </div>
</section>

<style>
  .hero {
    position: relative;
    isolation: isolate;
    min-height: 42rem;
    overflow: hidden;
  }

  .hero__content {
    position: relative;
    z-index: 1;
  }
</style>
```

Available effects are `evaluation`, `syntax`, `lattice`, `flow`, and `kernel`. Intensity may be `quiet`, `balanced`, or `dense`. Motion is enabled by default and stops under `prefers-reduced-motion`.

For a meaningful illustration rather than a decorative field, provide a label:

```astro
<Backdrop
  effect="flow"
  label="Live state moving through Hara evaluation paths"
/>
```

## Composition rules

Use one dominant field per viewport and no more than two supporting effects. Keep primary text above the effect layer. For dense backgrounds, place content on `var(--hara-surface)` or use the `quiet` intensity.

Do not recolour the spectrum into unrelated project palettes, add random particle noise, place text inside the SVG files, or use effects that compete with code, diagrams, and documentation.

The intended character is **inspectable computation with calm agency**.

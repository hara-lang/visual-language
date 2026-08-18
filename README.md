# @hara-lang/visual-language

Hara's shared precision-material design system. It contains brand tokens,
cross-domain light/dark theme handling, responsive motifs, maximum-resolution
vector backgrounds, restrained field effects, and small Astro primitives.
Interactive editors and workbenches remain in `@hara-lang/ui`.

**[View the published visual language laboratory](https://hara-lang.github.io/visual-language/)**

Consumers should pin a release tag exactly:

```json
"@hara-lang/visual-language": "github:hara-lang/visual-language#v1.0.0"
```

Import `theme.css`, `motifs.css`, and `theme.js` before using the existing Astro
components. Edge, Aperture, and Rack use the original restored 4096px masters
and responsive AVIF/WebP delivery assets. Rack is the material reference used by
the Hara benchmarks hero. Run `npm run assets:build` after a master changes.

The Hara material field system adds five adaptive SVG backgrounds on a
`4096 × 2304` canvas and five reusable effects. It uses frost, graphite,
brushed-metal structure, gothic vault geometry, and one functional blue signal;
there are no decorative multi-colour fields. Import it with:

```astro
---
import Backdrop from "@hara-lang/visual-language/astro/Backdrop.astro";
import "@hara-lang/visual-language/theme.css";
import "@hara-lang/visual-language/effects.css";
---

<section class="hero">
  <Backdrop effect="kernel" intensity="quiet" />
  <h1>Precision under load.</h1>
</section>
```

Motion is off by default. See [`HARA-IMAGERY.md`](./HARA-IMAGERY.md) for the
complete material, motion, accessibility, and composition rules.

## Experimental interface language v2

The v2 layer is an opt-in interface system for Hara WWW, Docs, Specs,
Benchmarks, and World. It keeps the current block-H mark, signal dot, theme
storage, and header font while moving application structure toward flatter
fleet-command surfaces: one-pixel hull seams, compact rails, clipped controls,
monochrome technical illustration, and a restrained hand-drawn second line.

```astro
---
import Shell from "@hara-lang/visual-language/astro/v2/Shell.astro";
import Header from "@hara-lang/visual-language/astro/v2/Header.astro";
import ContextNav from "@hara-lang/visual-language/astro/v2/ContextNav.astro";
import "@hara-lang/visual-language/v2.css";
---

<Shell sidebar={false}>
  <Header slot="header" section="Specs" nav={ecosystemNav} />
  <ContextNav slot="context" items={workflowNav} />
  <section class="hara-v2-panel">...</section>
</Shell>
```

The contract is intentionally additive: v1 tokens and motifs are unchanged, so
sites can migrate layout family by layout family. See
[`V2-THEME.md`](./V2-THEME.md) for identity invariants, site anatomy, responsive
behaviour, and the proposed adoption sequence.

The shared Open Graph system adds six `3840 × 2016` material masters and twelve
site-specific cards with deterministic typography. See
[`OG-IMAGERY.md`](./OG-IMAGERY.md) and rebuild them with `npm run assets:og`.

The theme script stores `system`, `light`, or `dark` in the `hara-theme` cookie
on `hara-lang.org` and uses local storage on local hosts.

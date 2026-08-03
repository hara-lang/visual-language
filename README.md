# @hara-lang/visual-language

Hara's shared precision-material design system. It contains brand tokens,
cross-domain light/dark theme handling, responsive motifs, maximum-resolution
vector backgrounds, live field effects, and small Astro primitives. Interactive
editors and workbenches remain in `@hara-lang/ui`.

**[View the published visual language laboratory](https://hara-lang.github.io/visual-language/)**

Consumers should pin a release tag exactly:

```json
"@hara-lang/visual-language": "github:hara-lang/visual-language#v1.0.0"
```

Import `theme.css`, `motifs.css`, and `theme.js` before using the existing Astro
components. Edge, Aperture, and Rack use faithful restored artwork with 4096px
masters and responsive AVIF/WebP delivery assets; the original contact sheet is
retained as the art-direction reference. Run `npm run assets:build` after a
master changes.

The Hara field system adds five adaptive SVG backgrounds on a `4096 × 2304`
canvas and five reusable live effects. The SVG sources remain sharp at 4K, 8K,
print, and smaller responsive sizes. Import it with:

```astro
---
import Backdrop from "@hara-lang/visual-language/astro/Backdrop.astro";
import "@hara-lang/visual-language/theme.css";
import "@hara-lang/visual-language/effects.css";
---

<section class="hero">
  <Backdrop effect="evaluation" intensity="quiet" />
  <h1>Inspectable computation.</h1>
</section>
```

See [`HARA-IMAGERY.md`](./HARA-IMAGERY.md) for the complete identity, asset,
motion, accessibility, and composition rules.

The theme script stores `system`, `light`, or `dark` in the `hara-theme` cookie
on `hara-lang.org` and uses local storage on local hosts.

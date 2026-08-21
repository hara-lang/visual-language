# @hara-lang/visual-language

This repository contains the shared interface rules used by Hara sites and
tools. It publishes theme tokens, light and dark themes, motifs, vector
backgrounds, optional field effects, document shells, data and diagram styles,
semantic symbols, and stateless Astro components for workbench and runtime
surfaces.

The package owns **presentation and semantic interface contracts**. An
application continues to own its language and domain data, commands, focus
movement, persistence, docking, graph manipulation, drag and drop, runtime
providers, permissions, and other behaviour. Those concerns may also belong in
`@hara-lang/ui` or the relevant Hara application.

**[Open the published reference](https://hara-lang.github.io/visual-language/)**  
**[Open the v2 catalogue](https://hara-lang.github.io/visual-language/v2/)**

Public copy follows [`V2-EDITORIAL.md`](./V2-EDITORIAL.md): describe before
evaluating, define Hara terms on introductory pages, state implementation status
plainly, and point claims to source, revisions, specifications, or evidence.

Consumers should pin a release tag exactly:

```json
"@hara-lang/visual-language": "github:hara-lang/visual-language#v1.0.0"
```

## Version 1 themes, motifs, and backgrounds

Import `theme.css`, `motifs.css`, and `theme.js` before using the version 1 Astro
components. Edge, Aperture, and Rack use the retained 4096-pixel masters and
responsive AVIF/WebP delivery assets. Run `npm run assets:build` after a master
changes.

The field layer adds five adaptive SVG backgrounds on a `4096 × 2304` canvas and
five reusable effects for evaluation, syntax, symbols, dataflow, and runtime
contexts. Motion is disabled by default. When enabled, it is limited to
calibration scans and stepped indicators and must respect reduced-motion
preferences.

```astro
---
import Backdrop from "@hara-lang/visual-language/astro/Backdrop.astro";
import "@hara-lang/visual-language/theme.css";
import "@hara-lang/visual-language/effects.css";
---

<section class="runtime-status">
  <Backdrop effect="kernel" intensity="quiet" />
  <h1>Runtime session states</h1>
</section>
```

See [`HARA-IMAGERY.md`](./HARA-IMAGERY.md) for the material, motion,
accessibility, and composition rules.

## Visual Language v2

Version 2 adds shared document, application, tool, data, diagram, and symbol
contracts while preserving the existing Hara mark, signal colour, theme
storage, and heading family. Common controls use readable labels, consistent
focus treatment, restrained borders and rounding, and explicit state language.
Strong material effects remain secondary to content.

**[Open the v2 catalogue guide and review matrix](https://hara-lang.github.io/visual-language/v2/guide/)**

The guide records the route manifest, global and route-local navigation, shared
and application-owned boundaries, route lifecycle, viewport and accessibility
review procedure, and downstream adoption map. See
[`V2-GUIDE.md`](./V2-GUIDE.md) for the written contract.

| Entry point | Use it for | Contract |
| --- | --- | --- |
| `v2.css` | Language overview, Docs, Specifications, Benchmarks, World, data products, and content-heavy application shells | [`V2-THEME.md`](./V2-THEME.md) |
| `v2-tool.css` | Toolbars, docks, inspectors, palettes, viewports, timelines, consoles, editor workbenches, and compact browser-runtime chrome | [`V2-TOOL.md`](./V2-TOOL.md), [`V2-RUNTIME.md`](./V2-RUNTIME.md) |
| `v2-data.css` | Benchmark measurements, uncertainty, compatibility, telemetry, and missing or incomparable values | [`V2-DATA-VISUALISATION.md`](./V2-DATA-VISUALISATION.md) |
| `v2-diagrams.css` | Architecture, runtime flow, sequence, lifecycle, package graphs, and complete text alternatives | [`V2-DIAGRAMS.md`](./V2-DIAGRAMS.md) |
| `v2-symbols.css` | Navigation, action, state, capability, route, authority, and evidence symbols | [`V2-SYMBOLS.md`](./V2-SYMBOLS.md) |

`v2-tool.css` imports `v2.css`, so a workbench consumer imports only the tool
entry point and places both `hara-v2` and `hara-v2-tool` on its interface root.
The additive data, diagram, and symbol layers share identity, state colours,
typography, and responsive priorities while applications retain authority over
facts and behaviour.

### Data visualisation and system diagrams

The document layer has two additive explanation grammars:

- **[Data visualisation](https://hara-lang.github.io/visual-language/v2/data/)** — benchmark comparisons, uncertainty, compatibility, runtime telemetry, and evidence states through `v2-data.css` and [`V2-DATA-VISUALISATION.md`](./V2-DATA-VISUALISATION.md).
- **[Diagrams and system maps](https://hara-lang.github.io/visual-language/v2/diagrams/)** — architecture, runtime flow, exact sequence, lifecycle, and package or namespace relationships through `v2-diagrams.css` and [`V2-DIAGRAMS.md`](./V2-DIAGRAMS.md).

Both are presentation contracts. Downstream applications provide the
authoritative measurements, identities, revisions, events, transitions,
dependencies, and receipts. Every diagram has a relation list, event table,
transition table, or adjacency table that remains complete without the visual.

```astro
---
import "@hara-lang/visual-language/v2.css";
import "@hara-lang/visual-language/v2-diagrams.css";
---

<figure class="diagram-figure">
  <figcaption>Session lifecycle · source revision 4f31d2c8</figcaption>
  <!-- application-owned diagram data and composition -->
</figure>
```

### Semantic symbols and capability iconography

**[Open the v2 symbols and iconography reference](https://hara-lang.github.io/visual-language/v2/symbols/)**

The public symbol layer provides 65 stable semantic identifiers across
navigation, actions, state, runtime capabilities, Hara routes, authority, and
evidence. Symbols use one `0 0 24 24` geometry system, `currentColor`, and
16/20/24/32-pixel optical sizes. They do not depend on an icon font or raster
asset. Unfamiliar, destructive, capability, route, and evidence meanings remain
supported by text.

```astro
---
import Symbol from "@hara-lang/visual-language/astro/v2/Symbol.astro";
import "@hara-lang/visual-language/v2.css";
import "@hara-lang/visual-language/v2-symbols.css";
---

<button class="hara-v2-symbol-button" type="button" aria-label="Run example">
  <Symbol name="action-run" size={20} />
</button>

<span class="hara-v2-symbol-state" data-state="unavailable">
  <Symbol name="state-unavailable" size={16} />
  Network unavailable
</span>
```

Framework-free consumers may import the inventory from
`@hara-lang/visual-language/v2/symbols.js`. The package owns names, geometry,
optical sizing, and accessibility defaults; applications still own commands,
capability availability, state, permissions, ownership, revisions, and receipts.
See [`V2-SYMBOLS.md`](./V2-SYMBOLS.md).

### Document and application shells

**[Open the v2 route and layout reference](https://hara-lang.github.io/visual-language/v2/)**

```astro
---
import Shell from "@hara-lang/visual-language/astro/v2/Shell.astro";
import Header from "@hara-lang/visual-language/astro/v2/Header.astro";
import ContextNav from "@hara-lang/visual-language/astro/v2/ContextNav.astro";
import "@hara-lang/visual-language/v2.css";
---

<Shell sidebar={false}>
  <Header slot="header" section="Specifications" nav={ecosystemNav} />
  <ContextNav slot="context" items={workflowNav} />
  <section class="hara-v2-panel">...</section>
</Shell>
```

The document contract is additive: version 1 tokens and motifs remain unchanged,
so sites can migrate one layout family at a time. See [`V2-THEME.md`](./V2-THEME.md)
for identity invariants, surface rhythm, site anatomy, responsive behaviour, and
adoption order.

### Tool, editor, environment, and browser-runtime workbenches

**[Open the environment, 3D, node, and animation workbench reference](https://hara-lang.github.io/visual-language/v2/tool/)**

```astro
---
import WorkbenchShell from "@hara-lang/visual-language/astro/v2/tool/WorkbenchShell.astro";
import Toolbar from "@hara-lang/visual-language/astro/v2/tool/Toolbar.astro";
import ToolGroup from "@hara-lang/visual-language/astro/v2/tool/ToolGroup.astro";
import ToolButton from "@hara-lang/visual-language/astro/v2/tool/ToolButton.astro";
import DockPanel from "@hara-lang/visual-language/astro/v2/tool/DockPanel.astro";
import StatusBar from "@hara-lang/visual-language/astro/v2/tool/StatusBar.astro";
import "@hara-lang/visual-language/v2-tool.css";
---

<div class="hara-v2 hara-v2-tool">
  <WorkbenchShell label="Scene editor">
    <Toolbar slot="top" label="Scene commands" density="dense">
      <ToolGroup label="Transform">
        <ToolButton label="Move" active />
        <ToolButton label="Rotate" />
      </ToolGroup>
    </Toolbar>
    <main slot="viewport">...</main>
    <DockPanel slot="right" label="Inspector">...</DockPanel>
    <StatusBar slot="status">Ready</StatusBar>
  </WorkbenchShell>
</div>
```

The package exports twenty-six stateless Astro primitives and composites plus
the public `Symbol` primitive:

- controls: `Toolbar`, `ToolGroup`, `ToolButton`, `ToolToggle`, `ToolSelect`,
  `ToolNumberField`, `TabStrip`, `IconRail`, and `StatusBar`;
- structure: `WorkbenchShell`, `DockPanel`, `FloatingPalette`,
  `ViewportOverlay`, `InspectorSection`, and `PanelHeader`;
- environment: `SectionNavigator`, `EnvironmentSection`, `FrontmatterGrid`,
  `ResourceList`, `CapabilityPane`, and `EnvironmentWorkbench`;
- browser runtime: `StatusLamp`, `RuntimeSwitch`, `ConnectionRow`,
  `CompactRuntimeShell`, and `RuntimeAppShell`;
- semantics: `Symbol`, with its public `v2/symbols.js` inventory.

The environment layer supplies the standard **Nav / Frontmatter / Graphics /
Code** content series and capability-aware **Sessions / Files / Canvas / 3D**
control pane. Only slots supplied by the host are rendered. See
[`V2-ENVIRONMENT.md`](./V2-ENVIRONMENT.md) for the complete composition, slot,
state, responsive, and adoption contract.

The browser-runtime layer separates requested switch state from actual runtime
state and adds compact popup and application-shell geometry for extension
toolbars, REPL hosts, diagnostics, and site-specific browser tools. It contains
no browser APIs or application behaviour. See [`V2-RUNTIME.md`](./V2-RUNTIME.md).

All v2 tool components provide geometry, theme, semantic roles, and initial
state markers. Applications still own event handling, focus movement,
persistence, drag and dock behaviour, command execution, provider discovery,
and domain data. See [`V2-TOOL.md`](./V2-TOOL.md) for the complete token
reference, component inventory, composition patterns, accessibility
requirements, and responsive collapse order.

The shared Open Graph system adds six `3840 × 2016` masters and twelve
site-specific cards with deterministic typography. See
[`OG-IMAGERY.md`](./OG-IMAGERY.md) and rebuild them with `npm run assets:og`.

The theme script stores `system`, `light`, or `dark` in the `hara-theme` cookie
on `hara-lang.org` and uses local storage on local hosts.

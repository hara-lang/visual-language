# Hara visual language v2 — matrix review results

## Review run

- Review ID: `v2-matrix-review-2026-08-21-01`
- Base revision: `9a88bddd7a539d7aa790e316ee169e8cc81886a4`
- Required routes: 14
- Explicit themes: light and dark
- Exact viewports: 1440×900, 1024×900, 680×860, 390×844 and 320×720
- Enumerated targets: 140
- Common checks per target: 11

This is the first structural and interaction review pass for issue #44. It is not an external accessibility certification and it does not claim that all 140 targets have completed manual pixel or assistive-technology inspection.

## Defects recorded and resolved in this pull request

### A11Y-001 — no shared skip path

The catalogue masthead, route bar and section navigation preceded route-owned content on every detailed page, but there was no direct keyboard skip path. The shared masthead now exposes **Skip to route content**, and the shared catalogue header supplies one stable focus target before route-owned content.

### TOUCH-001 — undersized touch navigation

At compact and phone widths, shared family tabs, parent links, section disclosure and section links used minimum heights between 34 and 42 pixels. The review contract requires at least 44 pixels for touch controls. A shared responsive override now raises those targets without changing desktop density.

### ANCHOR-001 — sticky navigation could cover fragment targets

Deep route headings selected through product-local links could settle beneath the stacked sticky catalogue and section navigation. Shared route-owned section and article IDs now receive a scroll margin, with a smaller compact-width offset.

### EVIDENCE-001 — review decisions were not exportable

The guide could mark checks and a local decision but could not generate a durable handoff record. The live review route now supports a local JSON download containing:

- exact route, theme and viewport;
- primary task and authority text;
- local decision;
- all eleven check states;
- issue or pull-request reference;
- reviewer and observation notes;
- exact guide revision;
- explicit non-certification and local-download-only boundaries.

No review evidence is uploaded or persisted by the guide.

## Remaining manual closeout

Every one of the 140 targets remains `review-required` for manual observation until an evidence record is attached to issue #44 or an associated repair pull request. The manual pass must still verify:

1. light and dark hierarchy;
2. keyboard order and visible focus;
3. touch and pointer access without hover-only controls;
4. 200% zoom and reflow;
5. no document-level horizontal overflow;
6. contrast and non-colour state cues;
7. reduced-motion behavior;
8. loading, empty, error, disabled, success and product-specific states;
9. exact source, revision, authority and receipt claims;
10. assistive-technology names and announced state where applicable.

## Closure rule

Issue #44 should close only when each required route has evidence for both themes and all five widths, or a clearly named accepted deferral. Automated contract coverage and a green site build are necessary but not sufficient for visual acceptance.

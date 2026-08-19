# Hara v2 UI workflow contract

The Hara v2 component catalogue describes reusable interface parts. This document describes how those parts behave over time: how a person enters a task, how state changes are communicated, how work survives failure, and how a successful action produces inspectable evidence.

The visual laboratory is published at `/v2/ui/` and implemented under issue #36.

## Boundary

The shared UI contract owns:

- semantic selected, pressed, disabled, busy and invalid states;
- visible focus and focus-return behavior;
- inline and summary validation placement;
- reversible drafts and explicit mutation boundaries;
- loading, empty, partial, stale, success, warning, failure, read-only and offline vocabulary;
- success receipts and exact-view receipts;
- responsive collapse order and touch-target minimums;
- keyboard equivalence and reduced-motion substitutions;
- attribution of user-owned automation.

The shared UI contract does **not** own:

- package, specification or source-registry policy;
- ranking and moderation rules;
- reviewer or maintainer authority;
- curriculum and progress semantics;
- runtime capabilities or execution truth;
- exact revisions, publication status or durable receipts.

Those facts belong to the relevant product, registry, runtime or server. A client must not invent them to make a specimen appear successful.

## Five reusable workflow studies

### Search → filter → select → inspect

Used by Docs, Specs, Packages, World and Learn.

The query and active filters remain visible throughout the flow. A filtered-empty state is distinct from an empty product. Results retain enough source, type, status and exact identity to support selection before opening detail. On wide screens detail may appear in an inspector; on narrow screens it becomes the next view and returns focus to the selected result when closed.

Required states: initial, loading, empty, partial, success and failure.

### Create draft → validate → preview → submit → receipt

Used by specification proposals, package publishing, World feed submission and lesson authoring.

Editable fields are visually separated from generated and reviewer-controlled facts. Validation preserves input and provides both inline messages and a linked summary. Preview shows the public rendering, machine representation, route and consequence. The mutation action names what it creates. Success returns an exact immutable receipt rather than only a transient toast.

Required states: initial, active, warning, failure and success.

### Load session → edit → run → observe → recover

Used by Playground and embedded Hara examples in Docs and Learn.

The lifecycle exposes session, generation, source revision, backend and capabilities. Run requests are fenced by those facts. A compile or connection failure preserves source and the last successful result without relabelling it as current output. Recovery may restart, reconnect, reset or continue read-only according to declared capabilities.

Required states: loading, active, success, failure, offline and read-only.

### Browse feed → open thread → comment → published state

Used by World.

Feed items retain canonical source, age, type, ranking and moderation state. The article remains at its canonical destination while World owns the durable discussion. The composer shows the acting user or owned bot. Preview is local. Publication is acknowledged only after the server returns identity, timestamp, moderation state and permalink.

Required states: loading, empty, partial, active, success and failure.

### Compare evidence → change tab → share exact view

Used by Benchmarks, Specs and Packages.

Selection and filters survive movement among summary, samples, methodology, compatibility and history views. Incomparable data remains visible and labelled rather than silently excluded. Sharing encodes filters, selected records, view mode and exact revision in an inspectable URL.

Required states: initial, loading, partial, success, warning and failure.

## State vocabulary

### Loading

Reserve expected geometry, name the object being loaded, report meaningful progress and keep cancellation available when safe. A spinner without object context is insufficient.

### First-use empty

Explain what belongs in the region and provide one safe starting action. Do not make a new account look like a failed query.

### Filtered empty

Preserve the query and expose the filters responsible for removing results. Clearing filters must be reversible.

### Partial data

Render trustworthy available data while identifying omitted sources and coverage. Partial evidence must never be presented as a complete pass.

### Stale data

Keep the last known result readable, show its age and exact revision, and distinguish refresh from destructive replacement.

### Success receipt

Name what changed, resulting status, exact revision or identifier, next actor and stable actions. A green colour or disappearing toast is not a receipt.

### Recoverable failure

Preserve input and selection, state what failed and provide the narrowest safe retry.

### Fatal failure

Stop unsafe mutation, retain a copyable diagnostic receipt and provide a route back to a stable surface.

### Degraded read-only

Keep inspection available when mutation or execution is unavailable. Name the missing capability.

### Offline and reconnecting

Distinguish local queued work from acknowledged durable state. Reconnection does not imply that queued work was accepted.

## Identity and authority

Identity is visible at every durable mutation boundary.

- **Anonymous** users may read, run and draft locally where product policy permits.
- **Signed-in** users may perform account-scoped mutations.
- **Account switching** pauses mutation until an acting identity is selected; unsaved local work is preserved.
- **Contributors**, **reviewers**, **maintainers** and **owners** expose scope-backed authority rather than prestige labels.
- **Insufficient permission** states explain the required role and a proposal or review path.
- **Suspended or revoked** states become read-only and expose reason, effective time and recovery path where appropriate.
- **User-owned bots** expose bot identity, accountable owner, purpose, sources, receipts and governing policy.

Automation never appears as an unattributed independent community member. Product policy decides whether owner presence is required, but attribution is always required.

## Validation

Validation should contain both:

1. a message adjacent to the affected field; and
2. a summary linking to every blocking issue.

On an attempted submit, focus moves to the summary or first blocking field. The form remains populated. Error text, iconography and structure carry meaning in addition to colour.

Browser-editable fields, generated values and server/reviewer-controlled facts must look different. Read-only controls are not disabled controls: read-only facts remain selectable and inspectable.

## Focus contract

- Opening a dialog or disclosure moves focus only when the action is explicit.
- Dialog focus starts at the heading or first safe action according to the workflow.
- Escape closes the highest active transient surface.
- Closing returns focus to the initiating control.
- Selecting a result and opening a narrow-screen detail view moves focus to the detail heading.
- Closing detail returns focus to the selected result.
- Publishing or creating a durable object moves focus to its receipt or newly published object.
- Optional keyboard shortcuts supplement labelled controls; they never replace them.

## Touch and mobile

Primary touch actions are at least 44px high on narrow screens. High-frequency tablet controls should be at least 40px high.

The primary task survives responsive collapse in this order:

1. optional inspector becomes a drawer, next view or below-content section;
2. secondary rail becomes a labelled disclosure;
3. context actions wrap or move into a local action menu;
4. the main task remains first and full width.

Editors do not receive focus on arrival, Run, sample selection or mode change. Mobile text input begins only after an explicit **Edit** action. Transport and recovery controls remain reachable when the virtual keyboard is visible.

## Reduced motion

Functional transitions use the shared v2 motion contract. With `prefers-reduced-motion: reduce`:

- ambient fields become static;
- spinners may become static progress text or discrete steps;
- state changes remain immediate and textual;
- focus, selected and pressed states remain persistent;
- no meaning depends on trajectory, pulse or animation duration.

## Success and evidence

A mutation is not successful merely because the client updated optimistically. Durable success requires server or runtime acknowledgement appropriate to the product.

Receipts should expose the facts needed to understand or reproduce the result, such as:

- object or proposal identifier;
- exact source revision;
- acting identity;
- status and next actor;
- selected filters and view mode;
- runtime session, generation and event sequence;
- canonical source or publication link.

Optimistic interfaces may show a pending object, but pending and acknowledged states must remain distinguishable.

## Product adoption

The following application issues consume this contract:

- #38 — WWW, Docs and Benchmarks
- #39 — Playground and embedded live components
- #40 — Specs registry, checker and proposal workflow
- #41 — Packages discovery, publishing and maintainer workflows
- #42 — World feeds, comments, moderation and presence
- #43 — Learn lessons, practice, projects and progress

Each application adds realistic domain objects, business rules and evidence. Product CSS may compose shared components but must not redefine protected Hara tokens or copy laboratory annotation styles into production.

## Review checklist

For each workflow verify:

- initial, active, success, empty and failure states are represented where relevant;
- user work and selection survive recoverable failure;
- identity and authority are visible before mutation;
- loading names the object and exposes cancellation when meaningful;
- empty-first-use and empty-filtered states are distinct;
- partial and stale data expose coverage and age;
- success has a stable receipt;
- keyboard, touch and narrow-screen behavior are described;
- focus is visible and returns correctly;
- reduced motion preserves meaning;
- no state depends on colour alone;
- product business rules remain outside the shared contract.

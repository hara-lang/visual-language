# Hara visual language v2 — diagrams and system-mapping contract

## Status

The executable guide lives at `/v2/diagrams/`. It is an additive shared visual-language domain tracked by issue #100 under expansion epic #89.

Import the public grammar with:

```css
@import "@hara-lang/visual-language/v2.css";
@import "@hara-lang/visual-language/v2-diagrams.css";
```

The stylesheet owns diagram presentation, responsive transformation, focus treatment, print behavior and reduced-motion equivalents. It does not supply architecture facts, runtime events, state transitions, package dependencies or publication authority.

## Purpose

Hara products repeatedly need to explain:

- architecture and trust boundaries;
- runtime values, commands, observations, receipts and handoffs;
- exact actor/provider/runtime sequences;
- lifecycle states, guards, terminality and recovery;
- package, namespace, runtime-target and maintainer relationships.

Without one shared grammar, every product invents a different meaning for arrows, dashed lines, boxes, colours and selected states. This contract keeps those visual roles stable while products retain ownership of their information architecture and authoritative facts.

## Evidence before shape

Every diagram starts with four facts:

1. a plain-language title;
2. the exact source or fixture revision;
3. the authority controlling the relationships or states;
4. an equivalent textual representation.

A diagram must not present current architecture, compatibility or lifecycle claims without that fence. Visual Language fixtures are deterministic design-review data and must not be interpreted as current product facts.

## Boundary and confidence vocabulary

| State | Symbol | Line treatment | Meaning |
| --- | --- | --- | --- |
| Current | `●` | solid | Implemented and evidenced by the cited source revision |
| Proposed | `◇` | dashed | Planned relationship; not current behavior |
| External | `↗` | double | Identity or fact is controlled by another authority |
| Unavailable | `×` | broken/dashed | The path cannot currently complete; not the same as failure |
| Degraded | `!` | dotted | The path remains usable with explicitly reduced guarantees |

Words, symbols and line treatment reinforce one another. Colour is only a supporting cue. Products may add domain-specific states, but they must define them in a visible legend and provide the same distinction in the textual alternative.

## Node contract

Every node has:

- stable machine-readable `id`;
- human label;
- semantic kind;
- current/proposed/external/unavailable/degraded status where relevant;
- exact identity or revision;
- authority or owner;
- short description suitable for an inspector and textual equivalent.

Common node kinds include artifact, service, boundary, host, authority, actor, product, provider, runtime, registry, package, namespace, runtime target and maintainer.

Node shape may reinforce kind but cannot be the only accessible label. Selected nodes expose their evidence in ordinary text and retain visible focus.

## Edge and relation contract

Every edge has:

- stable `id`;
- `from` and `to` identities;
- explicit direction;
- relation kind;
- visible verb or short label;
- current/proposed/external/unavailable/degraded state when applicable;
- evidence or revision context.

Arrows are required when direction matters. A generic undirected line must not stand in for dependency, ownership, migration or message flow.

Common relation kinds include:

- calls, sends, returns and appends;
- contains and exports;
- directly depends on, transitively depends on and optionally depends on;
- compatible, partial and incompatible;
- maintains and delegates;
- supersedes and migrates to;
- observes, checkpoints and hands off.

## Architecture and boundary maps

Architecture diagrams explain product and system ownership rather than merely arranging components.

They must distinguish:

- source artifacts from services and hosts;
- shared interfaces from implementations;
- current paths from proposals;
- internal product control from external registry or identity authority;
- transport, storage and capability boundaries;
- unavailable or degraded integrations.

A selected-node inspector should expose exact owner, revision and adjacent evidence. The equivalent relation list states every connection as a sentence such as:

```text
Direct callable catalog — capability-fenced call → Browser / Wasm
state: current
proof: browser receipt
```

## Runtime and data-flow diagrams

Runtime flows use distinct visual and textual roles for:

- value or artifact;
- command;
- observation;
- receipt;
- durable state;
- cross-product handoff.

The diagram carries the exact session fence where relevant:

```text
session
session generation
source revision
requested backend
actual backend
capability revision
monotonic event range
```

An unavailable downstream handoff does not rewrite a successful execution as failed. Missing, partial, stale, unsupported and unavailable remain separate evidence states.

At narrow widths, the ordered flow becomes primary:

```text
1. Load source — exact source value
2. Attach capabilities — capability fence
3. Run form — command 147
4. Observe result — value [2 3 4]
5. Checkpoint boundary — receipt 148
6. Publish share — unavailable offline
```

## Sequence diagrams

Sequence diagrams define lanes for people, products, providers, runtimes, registries and external systems.

Every event exposes:

- monotonic sequence number;
- from and to lane;
- event class;
- event label;
- exact revision or receipt;
- current, unavailable or degraded state.

The shared event classes are:

- synchronous call;
- asynchronous message;
- returned fact;
- durable receipt;
- timeout or unavailable handoff.

The event table is an equal representation, not a reduced fallback. It must preserve the same event order and evidence fence as the visual lanes.

## State-machine diagrams

State diagrams distinguish:

- initial states;
- active states;
- degraded or recovery states;
- terminal states;
- disposed or permanently unavailable identities.

Every allowed transition has:

- `from` state;
- action or cause;
- `to` state;
- guard;
- evidence or receipt.

Forbidden transitions are recorded explicitly when they protect an identity or lifecycle invariant. A UI reset must not imply that a terminal generation can become active again. Replacement identity, restart and retry remain different operations.

Reduced motion removes animated travel along transitions. It does not remove current-state focus, transition feedback or terminal-state distinction.

## Package and namespace graphs

Package graphs must keep these node types distinct:

- package coordinate/release;
- namespace identity/stewardship;
- runtime target;
- maintainer or publisher identity.

Required edge distinctions include:

- direct dependency;
- transitive dependency;
- optional provider;
- reverse dependency;
- runtime compatibility;
- incompatibility;
- supersession and migration;
- maintainer ownership or delegated stewardship.

Selected nodes expose exact release or namespace revision, owner and all adjacent relations. An adjacency table provides the complete accessible equivalent.

Do not render a dense force graph when the user’s task is to inspect a small dependency chain. Prefer bounded clusters, progressive detail and explicit direction.

## Annotation stack

A complete diagram contains:

1. **Title** — what relationship or lifecycle is being explained.
2. **Caption** — how to read it and what not to infer.
3. **Legend** — node, edge, symbol and state vocabulary.
4. **Evidence fence** — source, revision, authority and generated-at context.
5. **Numbered callouts** — bounded exceptions, risks or handoffs.
6. **Textual alternative** — complete relations, events, transitions or adjacency.

Callouts must link to exact evidence when they make a current claim. Annotation text remains selectable and readable; it is not baked into a raster image.

## Accessibility contract

Every diagram must satisfy all of the following:

- visual relationships have a complete relation list, ordered event list, transition table or adjacency table;
- direction is communicated by words and arrows;
- state is communicated by words, symbols and line treatment in addition to colour;
- nodes and selectable relations are keyboard reachable;
- focus is visible in light and dark themes;
- selection updates an ordinary text inspector;
- no required detail exists only in a hover tooltip;
- tables have captions and header cells;
- reading order remains meaningful without CSS;
- reduced motion preserves state and feedback;
- zoom and reflow do not introduce document-level horizontal overflow.

## Responsive contract

### Wide screen

Show the overview visual, selected evidence inspector and textual equivalent together.

### Tablet and 680 px

Simplify layout, move inspectors below the diagram and keep labels outside crowded edges. Local diagram/table regions may scroll without widening the document.

### 390 px and 320 px

The ordered relation, event, transition or adjacency representation becomes primary. A complex visual may be omitted rather than shrunk into illegibility.

The exact title, caption and evidence fence remain visible.

## Print, PDF and low-bandwidth delivery

Print and PDF versions use:

- static line treatment;
- numbered callouts;
- title, caption and legend on the same page;
- source revision and authority on the same page;
- textual alternative immediately following or adjacent to the visual;
- no dependency on animation, hover or WebGL.

Low-bandwidth/static projections prefer HTML and CSS with text tables. They must not fall back to a screenshot containing unreadable labels.

## Motion contract

Motion may demonstrate selection, progressive disclosure or a transition path. It must not imply that an architectural edge continuously carries traffic unless the product has authoritative live telemetry.

With `prefers-reduced-motion: reduce`:

- edge travel animation is removed;
- layout does not slide between states;
- selection changes immediately;
- live/current state remains obvious;
- status feedback is preserved in text.

## Ownership boundary

### Visual Language owns

- node and edge visual roles;
- line, symbol and state vocabulary;
- title, caption, legend, evidence-fence and callout hierarchy;
- focus and selected-state treatment;
- responsive transformation;
- print and reduced-motion behavior;
- accessible alternative layout.

### Product applications own

- which diagram belongs in a workflow;
- application-local navigation and commands;
- selection and progressive disclosure behavior;
- user preferences;
- handoffs to source, Specs, Packages, Playground, World or Learn.

### Registries, runtimes, repositories and specifications own

- canonical identities;
- architecture and dependency facts;
- exact source and release revisions;
- runtime events and observations;
- allowed and forbidden transitions;
- capability and compatibility claims;
- maintainers and stewardship;
- receipts and publication decisions.

Visual Language must not fabricate those facts for production use.

## Downstream adoption

| Product | Primary uses |
| --- | --- |
| WWW and Docs | Architecture explanations, concept maps and static low-bandwidth alternatives |
| Playground | Session flow, runtime sequence, lifecycle and capability maps |
| Specs | Normative state machines, conformance flow and proposal lifecycle |
| Packages | Dependency, namespace, compatibility and stewardship graphs |
| World | Source, relay, moderation, ownership and accountable-bot maps |
| Learn | Concept and prerequisite maps with explicit curriculum authority |

Adoption steps:

1. Pin a merged Visual Language revision.
2. Import `v2.css` and `v2-diagrams.css`.
3. Model stable node, edge, lane and state identities.
4. Obtain exact facts and revisions from the relevant authority.
5. Build the visual and textual equivalent from the same data.
6. Review light/dark and 1440, 1024, 680, 390 and 320 pixel behavior through `/v2/guide/`.
7. Keep production fixtures and receipts in the downstream product repository.

Downstream products must not copy the guide fixtures as production architecture, runtime, package or compatibility data.

## Release impact

This additive release:

- adds `/v2/diagrams/`;
- exports `@hara-lang/visual-language/v2-diagrams.css`;
- publishes `V2-DIAGRAMS.md`;
- adds an active Foundations catalogue route;
- preserves v1 and all existing v2 exports and routes;
- adds no runtime, registry or authoritative data service.

## Verification contract

Focused tests cover:

- deterministic non-production fixtures;
- current, proposed, external, unavailable and degraded relation states;
- exact architecture revisions and equivalent relation lists;
- runtime fence and ordered flow;
- monotonic sequence events and event table;
- allowed and forbidden state transitions;
- package, namespace, runtime and maintainer graph semantics;
- adjacency evidence;
- public export and packaged documentation;
- active catalogue route;
- keyboard focus, local overflow and narrow-width textual priority;
- print and reduced-motion rules;
- protected-token ownership;
- repository-wide `npm test` and `npm run site:build` on the exact pull-request head.

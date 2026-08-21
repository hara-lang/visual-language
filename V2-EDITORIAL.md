# Hara v2 editorial contract

This document defines the public voice for the Hara Visual Language site and the
language, documentation, learning, package, specification, and community
surfaces represented by it.

The site is not a sales surface. Hara does not need a feature pitch. The site
should help a reader understand the language, inspect what exists, run a small
example, and find the people and records responsible for the work.

## Audience

Write first for a programmer who is curious about Hara but does not yet know its
terminology. Experienced contributors should still be able to find exact names,
versions, source revisions, specifications, and implementation status without
reading around introductory prose.

A page should normally answer these questions in order:

1. What is this page about?
2. What Hara concept or interface does it describe?
3. Which terms does a new reader need before continuing?
4. What is implemented, experimental, historical, or planned?
5. What can the reader inspect or run?
6. Where are the source, specification, package, issue, or evidence records?

## Voice

### Describe before evaluating

State what a system does and how its boundaries are represented. Do not begin
with a claim about superiority, elegance, scale, speed, or inevitability.

Prefer:

> A Hara form is a data structure that can be read, transformed, evaluated, or
> lowered by an explicit runtime.

Avoid:

> One compact language model changes everything.

### Use exact nouns and restrained verbs

Prefer `read`, `run`, `inspect`, `compare`, `edit`, `check`, `open source`, and
`view revision` for actions. Use the name of the object being acted on.

Avoid generic calls such as `discover`, `unlock`, `experience`, `transform your
workflow`, `see the future`, or `get started in seconds`.

### Explain terms once, then use them consistently

The first use of a Hara-specific term on an introductory page should include a
short definition. Deep reference pages may assume terms established by their
parent route, but should still link or point back to the relevant definition.

### Separate observation from intention

Use factual status language:

- **Implemented** — the route, component, example, or behaviour exists and can
  be inspected.
- **Reference** — a stable contract or retained example used for comparison.
- **Prototype** — a working study whose API or behaviour may change.
- **Planned** — recorded work with no implemented public route yet.
- **Historical** — retained to explain an earlier decision or interface.

Do not use `production-ready`, `complete`, `settled`, or `proven` unless the page
names the acceptance evidence that supports the statement.

### Name evidence without turning the page into a pitch deck

Benchmarks, conformance results, receipts, source revisions, and package records
are useful when they answer a concrete question. Present the method, context,
result, and limitations. Do not use evidence as decorative proof of a broad
marketing claim.

## Core terminology

Use these plain-language definitions on introductory surfaces.

| Term | Introductory definition |
| --- | --- |
| **Form** | A Hara data structure that represents code or data and can be inspected before evaluation. |
| **Value** | A runtime value produced or consumed by a Hara form. |
| **Namespace** | A named collection of Vars and public symbols. |
| **Runtime** | The host that evaluates or lowers Hara forms, such as the JVM, Rust, or browser Wasm runtime. |
| **Session** | One identifiable runtime context with its own state, generation, and capabilities. |
| **Capability** | An explicitly granted operation or resource, such as filesystem, network, clock, or host interop access. |
| **Package** | A versioned distribution unit that records namespaces, artifacts, ownership, compatibility, and provenance. |
| **Specification** | A versioned statement of required language or interface behaviour. |
| **Receipt** | A durable record of an operation, its inputs, revision, result, and relevant boundaries. |

Do not introduce an internal architecture term merely to make a sentence sound
more technical. Prefer ordinary words where they are accurate.

## Page patterns

### Language overview

Begin with a direct description of Hara and a small readable form. Follow with
the language model, runtime choices, library organisation, and links to source,
specifications, packages, documentation, and benchmarks. Claims should narrow
into inspectable examples.

### Documentation

Organise around tasks and reference questions. State required version and
runtime assumptions. Keep static source readable when an embedded runtime is
unavailable. Show errors and unavailable states as ordinary documentation, not
as interruptions to a product experience.

### Learn and Start

Teach one concept at a time. Explain the expected result before asking the
reader to run something. Prefer a small program that can be changed over a
showcase whose purpose is mainly visual. Label agent-assisted paths as one way
to navigate the repository, not as the definition of learning Hara.

### Packages and specifications

Describe ownership, version, compatibility, conformance, provenance, and change
history. Avoid marketplace, acquisition, growth, or launch language. A package
page serves users and maintainers; a specification page serves implementers and
reviewers.

### Community and World

Describe articles, discussions, examples, package changes, maintainers, and
contributor activity. Avoid engagement funnels, audience capture, social proof,
or growth language. Presence indicators should communicate availability, not
status or popularity. Bot contributions must name their owner and provenance.

### Visual Language reference

Call these pages `references`, `specimens`, `examples`, or `interface studies`.
The repository records how Hara interfaces are represented; it is not itself a
product catalogue. Explain which parts are shared contracts and which are
application-specific examples.

## Headings and metadata

A title or first heading should identify the subject. A restrained secondary
line may explain the boundary, but should not carry a slogan.

Prefer:

- `Hara language overview`
- `Run a first Hara form`
- `Package ownership and compatibility`
- `Runtime session states`
- `World: articles and discussion`

Avoid:

- `Precision, with room to breathe`
- `The whole system, still visible`
- `Where ideas become living systems`
- `A new way to build`

Descriptions used for HTML metadata and social cards follow the same rule. They
should identify the page and its contents in one sentence.

## Actions

Primary actions should describe the destination or operation:

- `Read the language overview`
- `Run the example`
- `View source`
- `Open the specification`
- `Compare benchmark results`
- `Read the discussion`
- `View package history`

Do not create urgency. Do not use exclamation marks in interface copy.

## Review checklist

Before merging public copy, verify that:

- the first paragraph describes the page rather than praising it;
- unfamiliar Hara terms are defined or linked;
- implementation status is explicit and supportable;
- examples show expected input, output, runtime, and capability boundaries;
- evidence includes method or context rather than a broad conclusion alone;
- community copy describes contribution and stewardship;
- calls to action name their destination;
- metadata uses the same voice as the visible page;
- the page still makes sense when animation and embedded execution are absent;
- visual-language specimens are not presented as products that need to be sold.

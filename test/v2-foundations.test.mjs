import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import {
  catalogueHref,
  catalogueItemById,
  catalogueLinkIsExternal
} from "../site/src/lib/v2-catalogue.mjs";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const pagePath = "../site/src/pages/v2/foundations/index.astro";

const requiredSections = [
  "identity",
  "colour-material",
  "typography",
  "geometry-rhythm",
  "imagery-motifs",
  "motion-state",
  "composed-examples",
  "ownership"
];

const protectedTokenFamilies = [
  "--hara-v2-font-heading",
  "--hara-v2-font-body",
  "--hara-v2-font-code",
  "--hara-v2-header-height",
  "--hara-v2-context-height",
  "--hara-v2-context-offset",
  "--hara-v2-rail-width",
  "--hara-v2-inspector-width",
  "--hara-v2-page",
  "--hara-v2-column",
  "--hara-v2-prose",
  "--hara-v2-cut",
  "--hara-v2-cut-small",
  "--hara-v2-radius",
  "--hara-v2-radius-large",
  "--hara-v2-row",
  "--hara-v2-control",
  "--hara-v2-signal",
  "--hara-v2-signal-soft",
  "--hara-v2-canvas",
  "--hara-v2-canvas-clean",
  "--hara-v2-panel",
  "--hara-v2-panel-raised",
  "--hara-v2-panel-recess",
  "--hara-v2-ink",
  "--hara-v2-muted",
  "--hara-v2-faint",
  "--hara-v2-line",
  "--hara-v2-line-strong",
  "--hara-v2-grid",
  "--hara-v2-sketch",
  "--hara-v2-hover",
  "--hara-v2-shadow",
  "--hara-v2-paper",
  "--hara-v2-success",
  "--hara-v2-warning",
  "--hara-v2-danger",
  "--hara-v2-motion",
  "--hara-v2-ease",
  "--hara-v2-calm-line",
  "--hara-v2-calm-line-strong",
  "--hara-v2-calm-grid",
  "--hara-v2-calm-sketch",
  "--hara-v2-calm-hover",
  "--hara-v2-calm-shadow"
];

test("the foundations route is current, internal, and discoverable from the catalogue", async () => {
  await access(new URL(pagePath, import.meta.url));
  const foundations = catalogueItemById("design-system");

  assert.ok(foundations);
  assert.equal(foundations.status, "active");
  assert.equal(foundations.issue, 34);
  assert.equal(catalogueHref(foundations, "/visual-language/"), "/visual-language/v2/foundations/");
  assert.equal(catalogueLinkIsExternal(foundations), false);
});

test("the route covers every required foundation family through the shared catalogue header", async () => {
  const page = await read(pagePath);

  assert.match(page, /import CatalogueHeader/);
  assert.match(page, /activePath="\/v2\/foundations\/"/);
  assert.match(page, /import HaraMark/);
  assert.match(page, /import FleetField/);
  assert.match(page, /import Motif/);
  assert.match(page, /v2-foundations\.css/);
  assert.doesNotMatch(page, /<style(?:\s|>)/i);

  for (const id of requiredSections)
    assert.match(page, new RegExp(`id="${id}"`), `missing ${id} foundation section`);
});

test("identity specimens preserve the exact block-H and single-signal contract", async () => {
  const [page, mark] = await Promise.all([
    read(pagePath),
    read("../src/astro/HaraMark.astro")
  ]);

  assert.match(mark, /d="M10 8h13v18h18V8h13v48H41V38H23v18H10z"/);
  assert.match(mark, /fill="var\(--hara-signal\)" d="M27 8h10v10H27z"/);
  assert.match(page, /label: "Primary"/);
  assert.match(page, /\{item\.label\} · \{item\.size\}px/);
  assert.match(page, /Minimum · 24px|Smallest supported interface mark/);
  assert.match(page, /Clear space/);
  assert.match(page, /Avoid · stretch/);
  assert.match(page, /Avoid · rotate/);
  assert.match(page, /Avoid · outline/);
  assert.match(page, /Hara remains the parent signal/);
});

test("every protected v2 token family is visible with a semantic explanation", async () => {
  const [page, tokens, calm] = await Promise.all([
    read(pagePath),
    read("../src/v2/tokens.css"),
    read("../src/v2/calm-surfaces.css")
  ]);

  for (const token of protectedTokenFamilies) {
    assert.ok(page.includes(token), `foundations page does not expose ${token}`);
    assert.ok(tokens.includes(token) || calm.includes(token), `${token} is not backed by the public v2 sources`);
  }

  for (const phrase of [
    "Every token belongs to a semantic family",
    "State, not decoration",
    "One primary blue signal",
    "Shared package contract",
    "Catalogue-only framing"
  ]) assert.match(page, new RegExp(phrase, "i"));
});

test("light and dark parity, surface hierarchy, state colour, and contrast rules are explicit", async () => {
  const page = await read(pagePath);

  assert.match(page, /data-foundation-theme="light"/);
  assert.match(page, /data-foundation-theme="dark"/);
  assert.match(page, /Pale steel and paper/);
  assert.match(page, /Graphite and cool ink/);

  for (const seam of ["strong", "line", "grid", "sketch", "shadow"])
    assert.match(page, new RegExp(`data-seam="${seam}"`));

  for (const state of ["signal", "success", "warning", "danger"])
    assert.match(page, new RegExp(`data-state="${state}"`));

  assert.match(page, /Primary ink on ordinary panel/);
  assert.match(page, /State plus text and shape/);
  assert.match(page, /Faint text as body copy/);
  assert.match(page, /Colour-only selection/);
});

test("typography and geometry specimens cover reading, telemetry, density, and responsive collapse", async () => {
  const page = await read(pagePath);

  for (const type of ["display", "section", "title", "body", "meta"])
    assert.match(page, new RegExp(`data-type="${type}"`));

  assert.match(page, /Editorial prose/);
  assert.match(page, /Telemetry and data/);
  assert.match(page, /Wrap naturally/);
  assert.match(page, /Truncate identifiers deliberately/);
  assert.match(page, /Never compress body copy/);
  assert.match(page, /34px regular/);
  assert.match(page, /30px dense/);
  assert.match(page, /38px data row/);
  assert.match(page, /Remove the inspector below 1120px/);
  assert.match(page, /Collapse the rail below 820px/);
});

test("imagery, motion, state, and reduced-motion guidance remain functional", async () => {
  const [page, motifs] = await Promise.all([
    read(pagePath),
    read("../src/motifs.css")
  ]);

  for (const motif of ["edge", "aperture", "rack"])
    assert.match(page, new RegExp(`<Motif kind="${motif}"`));

  for (const asset of ["edge-light-1280", "aperture-light-1280", "rack-light-1280", "edge-dark-1280", "aperture-dark-1280", "rack-dark-1280"])
    assert.ok(motifs.includes(asset), `missing ${asset} motif source`);

  for (const state of ["default", "selected", "pressed", "loading", "success", "warning", "danger", "disabled"])
    assert.match(page, new RegExp(`data-state="${state}"`));

  assert.match(page, /190ms · cubic-bezier\(\.2, \.8, \.2, 1\)/);
  assert.match(page, /Reduced motion/);
  assert.match(page, /State is never encoded by colour alone/);
  assert.match(page, /Touch controls retain a minimum 34px height/);
});

test("foundations are proven through realistic compositions and explicit ownership boundaries", async () => {
  const page = await read(pagePath);

  for (const id of [
    "composition-navigation",
    "composition-editorial",
    "composition-data",
    "composition-code",
    "composition-workbench",
    "composition-community"
  ]) assert.match(page, new RegExp(`id="${id}"`), `missing ${id}`);

  assert.match(page, /Consume the contract\. Do not copy the reference\./);
  assert.match(page, /Downstream products import `v2\.css`/);
  assert.match(page, /View the v1 historical reference/);
  assert.match(page, /Product-owned composition/);
  assert.match(page, /Catalogue-only framing/);
});

test("foundations styling is responsive, keyboard-visible, motion-safe, and does not redefine protected tokens", async () => {
  const css = await read("../site/src/styles/v2-foundations.css");

  for (const selector of [
    ".foundations-hero",
    ".foundations-section-nav",
    ".foundations-theme-pair",
    ".foundations-token-ledger",
    ".foundations-type-scale",
    ".foundations-responsive-order",
    ".foundations-motif-grid",
    ".foundations-state-grid",
    ".foundations-composition-grid",
    ".foundations-ownership-grid"
  ]) assert.match(css, new RegExp(selector.replace(".", "\\.")));

  assert.match(css, /:focus-visible/);
  assert.match(css, /@keyframes foundations-spin/);
  assert.match(css, /@media \(max-width: 1180px\)/);
  assert.match(css, /@media \(max-width: 900px\)/);
  assert.match(css, /@media \(max-width: 680px\)/);
  assert.match(css, /@media \(max-width: 420px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /--hara-[A-Za-z0-9_-]+\s*:/);
});

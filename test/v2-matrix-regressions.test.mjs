import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  matrixRegressionFindings,
  matrixReviewCells,
  matrixReviewRun,
  matrixReviewSummary
} from "../site/src/lib/v2-review-results.mjs";
import {
  requiredReviewRoutes,
  reviewChecks,
  reviewThemes,
  reviewViewports
} from "../site/src/lib/v2-guide.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFile(resolve(root, path), "utf8");

test("the first closeout run enumerates every route, theme and viewport without claiming certification", () => {
  assert.equal(matrixReviewRun.certification, false);
  assert.equal(matrixReviewRun.visualEvidenceComplete, false);
  assert.equal(matrixReviewCells.length, requiredReviewRoutes.length * reviewThemes.length * reviewViewports.length);
  assert.equal(matrixReviewSummary.cells, 140);
  assert.equal(matrixReviewSummary.manualCellsRemaining, 140);
  assert.equal(new Set(matrixReviewCells.map(({ id }) => id)).size, matrixReviewCells.length);
  assert.ok(matrixReviewCells.every(({ checks }) => checks.length === reviewChecks.length));
});

test("the first pass records skip, touch, anchor and evidence defects as explicit resolved findings", () => {
  assert.deepEqual(matrixRegressionFindings.map(({ id }) => id), ["A11Y-001", "TOUCH-001", "ANCHOR-001", "EVIDENCE-001"]);
  assert.ok(matrixRegressionFindings.every(({ status }) => status === "resolved-in-pr"));
  assert.equal(matrixReviewSummary.resolvedInPr, 4);
});

test("the shared catalogue exposes one keyboard skip link and one stable route-content target", async () => {
  const [masthead, header] = await Promise.all([
    read("site/src/components/v2-catalogue/CatalogueMasthead.astro"),
    read("site/src/components/v2-catalogue/CatalogueHeader.astro")
  ]);
  assert.match(masthead, /class="v2-catalogue-skip-link" href="#v2-catalogue-content"/);
  assert.match(masthead, /Skip to route content/);
  assert.match(header, /id="v2-catalogue-content"/);
  assert.match(header, /tabindex="-1"/);
  assert.match(header, /v2-matrix-regression-fixes\.css/);
});

test("shared matrix fixes raise compact navigation to 44 pixels and offset sticky anchors", async () => {
  const css = await read("site/src/styles/v2-matrix-regression-fixes.css");
  assert.match(css, /\.v2-catalogue-skip-link/);
  assert.match(css, /\.v2-catalogue-skip-link:focus-visible/);
  assert.match(css, /@media \(max-width: 840px\)[\s\S]*?min-height: 44px/);
  assert.match(css, /:where\(main, section, article\)\[id\][\s\S]*?scroll-margin-top/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /--hara-[A-Za-z0-9_-]+\s*:/, "regression fixes must consume protected tokens rather than redefine them");
});

test("the guide renders a regression report before the live review deck", async () => {
  const page = await read("site/src/pages/v2/guide/index.astro");
  assert.match(page, /import GuideRegressionReport from/);
  assert.match(page, /import GuideReviewEvidence from/);
  assert.ok(page.indexOf("<GuideRegressionReport") < page.indexOf("<GuideReviewDeck"));
  assert.match(page, /href: "#regressions"/);
  assert.match(page, /Issue 44/);
});

test("the evidence export is exact, local-only and explicitly non-certifying", async () => {
  const [component, script] = await Promise.all([
    read("site/src/components/v2-guide/GuideReviewEvidence.astro"),
    read("site/src/scripts/v2-guide-review-export.js")
  ]);
  for (const marker of ["data-guide-evidence-reference", "data-guide-evidence-reviewer", "data-guide-evidence-notes", "data-guide-export-evidence"]) assert.match(component, new RegExp(marker));
  assert.match(script, /hara\.visual-language\.review-evidence/);
  assert.match(script, /schemaVersion: "1\.0\.0"/);
  assert.match(script, /guideRevision: "9a88bddd7a539d7aa790e316ee169e8cc81886a4"/);
  assert.match(script, /persistence: "local-download-only"/);
  assert.match(script, /certification: false/);
  assert.match(script, /URL\.createObjectURL/);
  assert.doesNotMatch(script, /fetch\(|localStorage|sessionStorage/);
});

test("the written result keeps automated coverage separate from manual acceptance", async () => {
  const document = await read("V2-REVIEW-RESULTS.md");
  for (const phrase of ["140", "A11Y-001", "TOUCH-001", "ANCHOR-001", "EVIDENCE-001", "Remaining manual closeout", "necessary but not sufficient"]) assert.match(document, new RegExp(phrase, "i"));
});

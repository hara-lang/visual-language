// @ts-check

import {
  requiredReviewRoutes,
  reviewChecks,
  reviewThemes,
  reviewViewports
} from "./v2-guide.mjs";

export const matrixReviewRun = {
  id: "v2-matrix-review-2026-08-21-01",
  baseRevision: "9a88bddd7a539d7aa790e316ee169e8cc81886a4",
  scope: "Structural and interaction review of the complete issue #44 route/theme/viewport matrix.",
  certification: false,
  visualEvidenceComplete: false,
  summary: "Every matrix cell is structurally enumerable and contract-testable. Manual pixel and assistive-technology observations remain required before issue #44 closes."
};

export const matrixReviewCells = requiredReviewRoutes.flatMap((route) =>
  reviewThemes.flatMap((theme) =>
    reviewViewports.map((viewport) => ({
      id: `${route.id}:${viewport.id}:${theme.id}`,
      routeId: route.id,
      route: route.path,
      theme: theme.id,
      viewport: viewport.id,
      width: viewport.width,
      height: viewport.height,
      structuralStatus: "covered",
      manualStatus: "review-required",
      checks: reviewChecks.map(({ id }) => id)
    }))
  )
);

export const matrixRegressionFindings = [
  {
    id: "A11Y-001",
    severity: "high",
    check: "keyboard",
    scope: "All catalogue routes",
    status: "resolved-in-pr",
    finding: "The shared catalogue masthead had no direct skip path past global, family and on-page navigation.",
    resolution: "Add one keyboard-visible skip link and one stable focus target immediately before route-owned content.",
    evidence: "CatalogueMasthead.astro + CatalogueHeader.astro"
  },
  {
    id: "TOUCH-001",
    severity: "high",
    check: "responsive",
    scope: "840 px, 560 px and minimum-width navigation",
    status: "resolved-in-pr",
    finding: "Shared family tabs, parent links and section links used 34–42 px targets at touch widths.",
    resolution: "Raise shared touch navigation targets to at least 44 px without changing desktop density.",
    evidence: "v2-matrix-regression-fixes.css"
  },
  {
    id: "ANCHOR-001",
    severity: "medium",
    check: "navigation",
    scope: "Deep route section anchors",
    status: "resolved-in-pr",
    finding: "Sticky catalogue and section navigation could cover the heading selected by an in-page fragment.",
    resolution: "Apply shared scroll margin for route-owned section and article anchors with a narrower mobile offset.",
    evidence: "v2-matrix-regression-fixes.css"
  },
  {
    id: "EVIDENCE-001",
    severity: "medium",
    check: "provenance",
    scope: "Live guide review deck",
    status: "resolved-in-pr",
    finding: "A reviewer could mark checks locally but could not export an exact route/theme/viewport evidence record.",
    resolution: "Add a non-persistent JSON evidence export containing target, decision, checked contract items, issue reference, notes and guide revision.",
    evidence: "GuideReviewEvidence.astro + v2-guide-review-export.js"
  }
];

export const matrixReviewSummary = {
  routes: requiredReviewRoutes.length,
  themes: reviewThemes.length,
  viewports: reviewViewports.length,
  cells: matrixReviewCells.length,
  commonChecks: reviewChecks.length,
  findings: matrixRegressionFindings.length,
  resolvedInPr: matrixRegressionFindings.filter(({ status }) => status === "resolved-in-pr").length,
  manualCellsRemaining: matrixReviewCells.filter(({ manualStatus }) => manualStatus === "review-required").length
};

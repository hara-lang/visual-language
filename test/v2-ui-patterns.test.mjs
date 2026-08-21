import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import {
  catalogueHref,
  catalogueItemById,
  catalogueLinkIsExternal
} from "../site/src/lib/v2-catalogue.mjs";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const pagePath = "../site/src/pages/v2/ui/index.astro";
const cssPath = "../site/src/styles/v2-ui-patterns.css";

const requiredSections = [
  "navigation-discovery",
  "forms-mutation",
  "data-content-states",
  "identity-permission",
  "responsive-input",
  "workflow-studies",
  "ownership"
];

const dataStates = [
  "loading",
  "empty-first-use",
  "empty-filtered",
  "partial",
  "stale",
  "success",
  "warning",
  "recoverable-failure",
  "fatal",
  "read-only",
  "offline",
  "reconnecting"
];

const workflowIds = [
  "search-filter-select-inspect",
  "draft-validate-preview-submit",
  "session-edit-run-observe-recover",
  "feed-thread-comment-publish",
  "compare-tab-share-view"
];

const workflowStates = ["initial", "active", "success", "empty", "failure"];

test("the UI pattern route is active, internal, and discoverable from the catalogue", async () => {
  await access(new URL(pagePath, import.meta.url));
  const ui = catalogueItemById("ui-patterns");

  assert.ok(ui);
  assert.equal(ui.status, "active");
  assert.equal(ui.issue, 36);
  assert.equal(catalogueHref(ui, "/visual-language/"), "/visual-language/v2/ui/");
  assert.equal(catalogueLinkIsExternal(ui), false);
});

test("the reference covers every required interaction family using shared v2 framing", async () => {
  const page = await read(pagePath);

  assert.match(page, /import CatalogueHeader/);
  assert.match(page, /activePath="\/v2\/ui\/"/);
  assert.match(page, /import HaraMark/);
  assert.match(page, /import FleetField/);
  assert.match(page, /src\/v2\.css/);
  assert.match(page, /v2-ui-patterns\.css/);
  assert.doesNotMatch(page, /<style(?:\s|>)/i);

  for (const id of requiredSections)
    assert.match(page, new RegExp(`id="${id}"`), `missing ${id} interaction section`);

  for (const phrase of [
    "Patterns are contracts between states, not screenshots",
    "Never trade recoverability for speed",
    "Degraded truth is labelled, not polished away",
    "Authority is explicit at the point of action",
    "Collapse supporting context before primary work"
  ]) assert.match(page, new RegExp(phrase, "i"));
});

test("navigation and discovery expose search, filters, selection, tabs, breadcrumbs, pagination, and focus return", async () => {
  const page = await read(pagePath);

  assert.match(page, /role="search"/);
  assert.match(page, /Runtime filter/);
  assert.match(page, /aria-current="page"/);
  assert.match(page, /aria-label="Breadcrumb"/);
  assert.match(page, /role="tablist"/);
  assert.match(page, /Command palette example/);
  assert.match(page, /Search pagination/);
  assert.match(page, /Focus return:/);
  assert.match(page, /Keyboard users can traverse the same hierarchy without hover-only controls/);
});

test("mutation patterns preserve drafts and make validation, rollback, destructive scope, and receipts explicit", async () => {
  const page = await read(pagePath);

  assert.match(page, /Unsaved changes/);
  assert.match(page, /role="alert"/);
  assert.match(page, /aria-invalid="true"/);
  assert.match(page, /Identity-controlled · not browser editable/);
  assert.match(page, /Autosave paused until validation passes/);
  assert.match(page, /data-mutation-state="optimistic"/);
  assert.match(page, /data-mutation-state="rollback"/);
  assert.match(page, /Destructive confirmation · revoke release/);
  assert.match(page, /Existing receipts remain in history/);
  assert.match(page, /preview precedes publication/i);
});

test("data and degraded states include the complete reusable envelope without colour-only meaning", async () => {
  const page = await read(pagePath);

  for (const state of dataStates)
    assert.match(page, new RegExp(`data-state=\\{state\\}|data-state="${state}"|\\["${state}"`), `missing ${state} data state`);

  for (const phrase of [
    "No saved views yet",
    "3 of 5 sources available",
    "Published · receipt gw_8421",
    "Registry unavailable",
    "Working from local snapshot",
    "preserving edits",
    "Colour is supplementary"
  ]) assert.match(page, new RegExp(phrase, "i"));
});

test("identity and permission specimens distinguish roles and attribute user-owned automation", async () => {
  const page = await read(pagePath);

  for (const role of ["anonymous", "signed-in", "owner", "maintainer", "reviewer", "contributor", "insufficient", "revoked"])
    assert.match(page, new RegExp(`\\["${role}"`), `missing ${role} role state`);

  assert.match(page, /BOT/);
  assert.match(page, /release-notes-bot/);
  assert.match(page, /owned by hoebat/);
  assert.match(page, /User-owned automation is attributed to an accountable owner/);
  assert.match(page, /Capability/);
  assert.match(page, /Receipt/);
});

test("all five representative workflows include initial, active, success, empty, and failure states", async () => {
  const page = await read(pagePath);

  for (const id of workflowIds)
    assert.match(page, new RegExp(`id: "${id}"`), `missing workflow ${id}`);

  for (const state of workflowStates) {
    const occurrences = page.match(new RegExp(`\\["${state}"`, "g")) ?? [];
    assert.ok(occurrences.length >= workflowIds.length, `${state} must appear in every workflow`);
  }

  assert.match(page, /without editor autofocus/);
  assert.match(page, /monotonic event sequence/);
  assert.match(page, /exact, reproducible view URL/);
  assert.match(page, /local comment remains available to retry/);
  assert.match(page, /draft, validation results, and preview are preserved/);
});

test("responsive, keyboard, touch, and reduced-motion contracts are visible and stylesheet-backed", async () => {
  const [page, css] = await Promise.all([read(pagePath), read(cssPath)]);

  assert.match(page, /Desktop · 1280\+/);
  assert.match(page, /Tablet · ≤ 1120/);
  assert.match(page, /Compact · ≤ 820/);
  assert.match(page, /Mobile · 390 \/ 320/);
  assert.match(page, /no editor autofocus/);
  assert.match(page, /minimum 44px target/);
  assert.match(page, /Reduced motion/);
  assert.match(page, /Escape to close disclosures/);

  assert.match(css, /:focus-visible/);
  assert.match(css, /@media \(max-width: 1180px\)/);
  assert.match(css, /@media \(max-width: 900px\)/);
  assert.match(css, /@media \(max-width: 680px\)/);
  assert.match(css, /@media \(max-width: 420px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /min-height: 44px/);
  assert.doesNotMatch(css, /--hara-[A-Za-z0-9_-]+\s*:/, "reference CSS must not redefine protected Hara tokens");
});

test("the ownership boundary keeps shared interaction grammar separate from product business rules", async () => {
  const page = await read(pagePath);

  assert.match(page, /Shared interaction contract/);
  assert.match(page, /Product-owned business rules/);
  assert.match(page, /focus and keyboard behaviour/);
  assert.match(page, /responsive collapse order/);
  assert.match(page, /which actions a role may perform/);
  assert.match(page, /moderation and publication policy/);
  assert.match(page, /do not turn a application-specific state machine into a new global primitive/i);
});

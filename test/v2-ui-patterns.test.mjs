import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import {
  allWorkflowStages,
  identityStates,
  interfaceStates,
  ownershipBoundaries,
  responsiveContracts,
  uiPatternFamilies,
  workflowById,
  workflowStudies
} from "../site/src/lib/v2-ui-patterns.mjs";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const unique = (items) => new Set(items).size === items.length;

test("the UI contract defines five complete pattern families", () => {
  assert.deepEqual(uiPatternFamilies.map(({ id }) => id), [
    "navigation",
    "mutation",
    "content-state",
    "identity",
    "responsive-input"
  ]);

  for (const family of uiPatternFamilies) {
    assert.ok(family.summary.length > 70, `${family.id} needs a meaningful summary`);
    assert.ok(family.patterns.length >= 8, `${family.id} needs a representative inventory`);
    assert.ok(family.nonNegotiables.length >= 3, `${family.id} needs explicit invariants`);
  }
});

test("the workflow inventory covers five complete cross-product journeys", () => {
  assert.deepEqual(workflowStudies.map(({ id }) => id), [
    "search-inspect",
    "draft-publish",
    "session-recovery",
    "feed-comment",
    "evidence-share"
  ]);

  assert.equal(workflowById("draft-publish")?.stages.at(-1)?.id, "receipt");
  assert.equal(workflowById("session-recovery")?.stages.at(-1)?.id, "recover");
  assert.equal(workflowById("feed-comment")?.stages.at(-1)?.id, "published");
  assert.ok(unique(workflowStudies.map(({ id }) => id)));
  assert.ok(unique(allWorkflowStages.map(({ workflowId, id }) => `${workflowId}:${id}`)));

  for (const workflow of workflowStudies) {
    assert.ok(workflow.products.length > 0, `${workflow.id} needs adoption targets`);
    assert.ok(workflow.stages.length >= 3, `${workflow.id} needs a full transition`);
    assert.ok(workflow.requiredStates.includes("success"), `${workflow.id} needs success`);
    assert.ok(workflow.requiredStates.includes("error"), `${workflow.id} needs failure`);
    for (const stage of workflow.stages) {
      assert.ok(stage.description.length > 55, `${workflow.id}:${stage.id} needs detail`);
      assert.ok(stage.keyboard.length > 20, `${workflow.id}:${stage.id} needs keyboard behavior`);
      assert.ok(stage.touch.length > 20, `${workflow.id}:${stage.id} needs touch behavior`);
    }
  }
});

test("state, identity, responsive, and ownership vocabularies are complete", () => {
  assert.deepEqual(interfaceStates.map(({ id }) => id), [
    "loading",
    "empty-first-use",
    "empty-filtered",
    "partial",
    "stale",
    "success",
    "recoverable",
    "fatal",
    "readonly",
    "offline"
  ]);

  assert.deepEqual(identityStates.map(({ id }) => id), [
    "anonymous",
    "signed-in",
    "switching",
    "contributor",
    "reviewer",
    "maintainer",
    "owner",
    "insufficient",
    "suspended",
    "owned-bot"
  ]);

  assert.deepEqual(responsiveContracts.map(({ id }) => id), [
    "desktop",
    "tablet",
    "mobile",
    "keyboard",
    "reduced-motion"
  ]);

  assert.deepEqual(ownershipBoundaries.map(({ layer }) => layer), [
    "Shared UI contract",
    "Product composition",
    "Runtime or server",
    "Laboratory framing"
  ]);

  for (const state of interfaceStates) {
    assert.ok(state.cue.includes("+"), `${state.id} needs a non-colour cue pair`);
    assert.ok(state.summary.length > 80, `${state.id} needs semantic guidance`);
    assert.ok(state.action.length > 4, `${state.id} needs a safe next action`);
  }

  const mobile = responsiveContracts.find(({ id }) => id === "mobile");
  assert.match(mobile?.collapse ?? "", /Inspector.*sidebar.*context/i);
  assert.match(mobile?.targets ?? "", /44px/);
  assert.match(mobile?.targets ?? "", /no autofocus/i);

  const keyboard = responsiveContracts.find(({ id }) => id === "keyboard");
  assert.match(keyboard?.targets ?? "", /Visible focus/i);
  assert.match(keyboard?.targets ?? "", /Escape closes and returns focus/i);

  const bot = identityStates.find(({ id }) => id === "owned-bot");
  assert.match(bot?.authority ?? "", /owner policy/i);
  assert.match(bot?.evidence ?? "", /owner/i);

  const shared = ownershipBoundaries[0];
  assert.match(shared.owns, /focus/);
  assert.match(shared.owns, /receipts/);
  assert.match(shared.doesNotOwn, /ranking/);
  assert.match(shared.doesNotOwn, /runtime capability truth/);

  const runtime = ownershipBoundaries.find(({ layer }) => layer === "Runtime or server");
  assert.match(runtime?.owns ?? "", /permissions/);
  assert.match(runtime?.owns ?? "", /exact revision/);
  assert.match(runtime?.doesNotOwn ?? "", /invented client-side success/);
});

test("the UI route composes the shared catalogue, document, and tool layers", async () => {
  const page = await read("../site/src/pages/v2/ui/index.astro");

  for (const component of [
    "CatalogueHeader",
    "PatternStateCard",
    "WorkflowRail",
    "Shell",
    "Header",
    "ContextNav",
    "Sidebar",
    "PageHeader"
  ]) assert.match(page, new RegExp(`import ${component} from`), `missing ${component}`);

  assert.match(page, /<CatalogueHeader basePath=\{basePath\} activePath="\/v2\/ui\/"/);
  assert.match(page, /Interfaces are stories, not screenshots\./);
  assert.match(page, /Products share behavior, not business rules\./);
  assert.match(page, /Shared behavior stops before product truth\./);
  assert.match(page, /Issue #36/);

  for (const id of [
    "contract",
    "discovery",
    "mutation",
    "states",
    "identity",
    "runtime",
    "community",
    "evidence",
    "responsive",
    "ownership"
  ]) assert.match(page, new RegExp(`id="${id}"`), `missing ${id} section`);

  for (const workflow of [
    "searchWorkflow",
    "publishWorkflow",
    "runtimeWorkflow",
    "feedWorkflow",
    "evidenceWorkflow"
  ]) assert.match(page, new RegExp(`<WorkflowRail workflow=\\{${workflow}\\}`), `missing ${workflow}`);
});

test("discovery distinguishes complete, loading, filtered-empty, partial, and exact failure states", async () => {
  const page = await read("../site/src/pages/v2/ui/index.astro");
  const inspect = workflowById("search-inspect")?.stages.find(({ id }) => id === "inspect");

  for (const mode of ["success", "loading", "empty", "partial", "error"])
    assert.match(page, new RegExp(`data-search-(?:mode|panel)="${mode}"`), `missing ${mode} search state`);

  assert.match(page, /No current packages match “schema” with runtime “Truffle”/);
  assert.match(page, /Partial result set/);
  assert.match(page, /could not establish a consistent revision/);
  assert.match(page, /last complete result set.*read-only/i);
  assert.match(page, /On wide screens selection updates this inspector/);
  assert.match(page, /returns focus to the selected row/);
  assert.match(inspect?.keyboard ?? "", /Focus moves to the inspector heading and returns on close/);
});

test("mutation preserves drafts through validation, preview, submission, and a durable receipt", async () => {
  const page = await read("../site/src/pages/v2/ui/index.astro");

  for (const phase of ["draft", "validate", "preview", "submit", "receipt"])
    assert.match(page, new RegExp(`data-publish-(?:step|panel|action)="${phase}"`), `missing ${phase} mutation phase`);

  assert.match(page, /Identity-controlled from the signed-in subject/);
  assert.match(page, /Server\/reviewer-controlled generated fact/);
  assert.match(page, /1 blocking issue/);
  assert.match(page, /Submit proposal/);
  assert.match(page, /Proposal created/);
  assert.match(page, /pkg-proposal-042/);
  assert.match(page, /data-destructive-dialog/);
  assert.match(page, /I understand this draft cannot be recovered/);
});

test("runtime recovery preserves source, previous output, fencing facts, and capability truth", async () => {
  const page = await read("../site/src/pages/v2/ui/index.astro");

  for (const state of ["ready", "running", "failed", "offline", "recovered"])
    assert.match(page, new RegExp(`data-runtime-panel="${state}"`), `missing ${state} runtime panel`);

  for (const action of ["run", "stop", "recover", "fail", "offline"])
    assert.match(page, new RegExp(`data-runtime-action="${action}"`), `missing ${action} runtime action`);

  assert.match(page, /session <code>s-42<\/code>/);
  assert.match(page, /generation <code data-runtime-generation>7<\/code>/);
  assert.match(page, /source <code>rev-19<\/code>/);
  assert.match(page, /3D unavailable/);
  assert.match(page, /previous successful canvas is not relabelled as the new result/i);
  assert.match(page, /Continue read-only/);
  assert.match(page, /event sequence resumed at 119/);
});

test("community publication and exact evidence sharing distinguish local and acknowledged states", async () => {
  const page = await read("../site/src/pages/v2/ui/index.astro");

  for (const stage of ["browse", "thread", "comment", "published"])
    assert.match(page, new RegExp(`data-stage="${stage}"`), `missing ${stage} community stage`);

  assert.match(page, /canonical source visible/);
  assert.match(page, /owned by @mina · owner present/);
  assert.match(page, /Automated fact · receipt build-18c2/);
  assert.match(page, /Comment not yet published/);
  assert.match(page, /data-comment-publish/);
  assert.match(page, /comment-7f3a/);
  assert.match(page, /Publication receives focus, permalink, timestamp, identity, and moderation state/);

  for (const tab of ["summary", "samples", "methodology", "history"])
    assert.match(page, new RegExp(`data-evidence-(?:tab|panel)="${tab}"`), `missing ${tab} evidence view`);

  assert.match(page, /data-incomparable="true"/);
  assert.match(page, /different warmup policy/);
  assert.match(page, /revision=637c14a/);
  assert.match(page, /data-copy-exact-view/);
  assert.match(page, /Copied exact.*view · revision 637c14a/);
});

test("keyboard, touch, focus return, explicit mobile edit, and reduced motion are visible contracts", async () => {
  const page = await read("../site/src/pages/v2/ui/index.astro");
  const keyboard = responsiveContracts.find(({ id }) => id === "keyboard");

  assert.match(page, /Keyboard traversal/);
  assert.match(page, /Close disclosure\/dialog/);
  assert.match(page, /Focus returns to the initiating control/);
  assert.match(keyboard?.targets ?? "", /Escape closes and returns focus/);
  assert.match(page, /No surprise keyboard/);
  assert.match(page, /data-editing="false"/);
  assert.match(page, /data-enter-edit/);
  assert.match(page, /Editor is read-only until Edit is pressed/);
  assert.match(page, /data-open-focus-dialog/);
  assert.match(page, /Focus returned to the trigger/);
  assert.match(page, /Reduced motion/);
  assert.match(page, /immediate state \+ textual cue/);
  assert.doesNotMatch(page, /autofocus/);
});

test("laboratory interactions cover every reviewable transition", async () => {
  const page = await read("../site/src/pages/v2/ui/index.astro");

  assert.match(page, /const initialiseUiPatterns =/);
  assert.match(page, /setMode\("loading"\)/);
  assert.match(page, /const validate = \(\) =>/);
  assert.match(page, /setPhase\("submit"\)/);
  assert.match(page, /dialog\.showModal\(\)/);
  assert.match(page, /setAccount\(button\)/);
  assert.match(page, /setState\("failed"\)/);
  assert.match(page, /published\.focus\(\)/);
  assert.match(page, /setView\(tab\.getAttribute/);
  assert.match(page, /button\.focus\(\)/);
  assert.match(page, /document\.addEventListener\("astro:page-load"/);
});

test("the UI stylesheet is stateful, responsive, reduced-motion aware, and token-safe", async () => {
  const css = await read("../site/src/styles/v2-ui-patterns.css");

  for (const selector of [
    ".ui-workflow-rail",
    ".ui-pattern-canvas",
    ".ui-mutation-board",
    ".ui-state-atlas",
    ".ui-identity-demo",
    ".ui-runtime-demo",
    ".ui-community-flow",
    ".ui-evidence-board",
    ".ui-responsive-grid",
    ".ui-adoption-grid"
  ]) assert.match(css, new RegExp(selector.replace(".", "\\.")), `missing ${selector}`);

  assert.match(css, /:focus-visible/);
  assert.match(css, /@media \(max-width: 1320px\)/);
  assert.match(css, /@media \(max-width: 1100px\)/);
  assert.match(css, /@media \(max-width: 900px\)/);
  assert.match(css, /@media \(max-width: 680px\)/);
  assert.match(css, /@media \(max-width: 430px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /min-height: 44px/);
  assert.doesNotMatch(css, /--hara-[A-Za-z0-9_-]+\s*:/);
});

test("the written contract records state, focus, mobile, evidence, and adoption boundaries", async () => {
  const contract = await read("../V2-UI.md");

  for (const heading of [
    "## Five reusable workflow studies",
    "## State vocabulary",
    "## Identity and authority",
    "## Focus contract",
    "## Touch and mobile",
    "## Reduced motion",
    "## Success and evidence",
    "## Product adoption"
  ]) assert.match(contract, new RegExp(heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.match(contract, /Editors do not receive focus on arrival, Run, sample selection or mode change/);
  assert.match(contract, /A mutation is not successful merely because the client updated optimistically/);
  assert.match(contract, /User-owned bots.*accountable owner/is);
  assert.match(contract, /#38.*#39.*#40.*#41.*#42.*#43/s);
});

test("all new UI laboratory files exist", async () => {
  for (const path of [
    "../V2-UI.md",
    "../site/src/lib/v2-ui-patterns.mjs",
    "../site/src/components/v2-ui/PatternStateCard.astro",
    "../site/src/components/v2-ui/WorkflowRail.astro",
    "../site/src/pages/v2/ui/index.astro",
    "../site/src/styles/v2-ui-patterns.css"
  ]) await access(new URL(path, import.meta.url));
});

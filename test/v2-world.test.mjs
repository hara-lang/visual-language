import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  articleThread,
  botReplyState,
  clippingProvenance,
  clippingWorkflow,
  contributorProfile,
  createClippingProvenance,
  feedDirectory,
  haraWorldAdoption,
  historicalWorldStudies,
  ownedBot,
  ownedBotReply,
  presenceModel,
  worldContentContract,
  worldDigest,
  worldInventory,
  worldPrimaryNavigation,
  worldProductBoundary,
  worldSections,
  worldStateCoverage,
  worldTypeIds
} from "../site/src/lib/v2-world.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFile(resolve(root, path), "utf8");

const pagePath = "site/src/pages/v2/world/index.astro";
const stylePaths = [
  "site/src/styles/v2-world-application.css",
  "site/src/styles/v2-world-application-shell.css",
  "site/src/styles/v2-world-application-reader.css",
  "site/src/styles/v2-world-application-workflows.css",
  "site/src/styles/v2-world-application-presence-digest.css",
  "site/src/styles/v2-world-application-governance.css"
];
const readStyles = () => Promise.all(stylePaths.map(read)).then((parts) => parts.join("\n"));
const componentPaths = {
  WorldFrontPage: "site/src/components/v2-world/WorldFrontPage.astro",
  WorldThread: "site/src/components/v2-world/WorldThread.astro",
  WorldBotComment: "site/src/components/v2-world/WorldBotComment.astro",
  WorldClipping: "site/src/components/v2-world/WorldClipping.astro",
  WorldFeedDirectory: "site/src/components/v2-world/WorldFeedDirectory.astro",
  WorldProfile: "site/src/components/v2-world/WorldProfile.astro",
  WorldPresence: "site/src/components/v2-world/WorldPresence.astro",
  WorldDigest: "site/src/components/v2-world/WorldDigest.astro"
};

test("World consumes the shared hara.world 2.0.0 content contract", () => {
  assert.equal(worldContentContract.schemaNamespace, "hara.world");
  assert.equal(worldContentContract.schemaVersion, "2.0.0");
  assert.equal(worldContentContract.registryOwner, "World content and source registries");
  assert.deepEqual(worldTypeIds, [
    "world.article",
    "world.clipping",
    "world.feed",
    "world.profile",
    "world.bot"
  ]);
  assert.equal(worldInventory.contentTypes, 5);
});

test("the primary World route is the seven-screen application acceptance surface", async () => {
  const page = await read(pagePath);

  assert.match(page, /import CatalogueHeader/);
  assert.match(page, /activePath="\/v2\/world\/"/);
  assert.match(page, /v2-world-application\.css/);
  assert.match(page, /worldContentContract/);

  for (const [component, path] of Object.entries(componentPaths)) {
    if (component === "WorldBotComment") continue;
    assert.match(page, new RegExp(`import ${component} from`));
    assert.match(page, new RegExp(`<${component}\\s*\\/>`));
    assert.ok((await read(path)).length > 1_000, `${component} should be a detailed specimen`);
  }

  assert.deepEqual(worldSections.map(({ id }) => id), [
    "front-page",
    "article-thread",
    "clipping",
    "feeds",
    "profile",
    "presence",
    "digest"
  ]);

  for (const { id } of worldSections) assert.match(page, new RegExp(`id=\\"${id}\\"`));
  assert.match(page, /The comment body can disappear\. Its state and receipt cannot\./);
  assert.match(page, /One reviewed edition, three portable projections\./);
});

test("World navigation stays focused and routes structured teaching to Learn", async () => {
  assert.deepEqual(worldPrimaryNavigation.map(({ label }) => label), ["Hot", "New", "Following", "Clippings"]);
  assert.doesNotMatch(worldPrimaryNavigation.map(({ label }) => label).join(" "), /Learn|Lessons|Exercises/);
  assert.equal(worldProductBoundary.excludes.find(({ owner }) => owner === "Learn")?.destination, "/v2/learn/");

  const frontPage = await read(componentPaths.WorldFrontPage);
  assert.match(frontPage, /data-world-primary-nav/);
  assert.doesNotMatch(frontPage, />\s*Learn\s*</);
  assert.doesNotMatch(frontPage, /New programmer journey/);
});

test("front page attribution distinguishes source, original author, submitter, score, comments, age, and evidence", async () => {
  const frontPage = await read(componentPaths.WorldFrontPage);

  for (const phrase of [
    "Original author",
    "Submitted by",
    "canonical",
    "comments",
    "ago",
    "Contribution evidence still resolving",
    "Snippet of the Day",
    "Reviewed sources",
    "What’s New"
  ]) assert.match(frontPage, new RegExp(phrase.replace(/[’*+?^${}()|[\]\\]/g, "\\$&")));

  assert.match(frontPage, /data-content-type=\{story\.contentType\}/);
  assert.match(frontPage, /title=\{item\.receipt\}/);
  assert.match(frontPage, /data-state="empty"/);
  assert.match(frontPage, /data-state="stale"/);
  assert.match(frontPage, /data-state="partial"/);
  assert.match(frontPage, /data-state="moderated"/);
});

test("thread covers durable comment states and full bot accountability", async () => {
  const [thread, botComponent] = await Promise.all([
    read(componentPaths.WorldThread),
    read(componentPaths.WorldBotComment)
  ]);

  assert.deepEqual(articleThread.comments.map(({ state }) => state), [
    "published",
    "collapsed",
    "moderated",
    "deleted"
  ]);
  assert.match(thread, /data-state="offline-composer"/);
  assert.match(thread, /<details>/);
  assert.match(thread, /Read moderation decision/);
  assert.match(thread, /preserved reply/);
  assert.match(thread, /<WorldBotComment bot=\{ownedBot\} reply=\{ownedBotReply\}/);

  assert.equal(ownedBot.label, "BOT");
  assert.match(botComponent, /\{bot\.label\}/);
  for (const phrase of ["Owner", "Presence", "Purpose", "Sources", "Policy", "receipt"])
    assert.match(botComponent, new RegExp(phrase));

  assert.match(botComponent, /disabled=\{!reply\.canReply\}/);
  assert.match(botComponent, /data-bot-owner=\{bot\.owner\.handle\}/);
  assert.equal(ownedBot.owner.presence, "away");
  assert.equal(ownedBotReply.id, "paused-owner-absent");
  assert.equal(ownedBotReply.canReply, false);
});

test("bot replies require both active policy and an online accountable owner", () => {
  assert.deepEqual(botReplyState({ ownerPresence: "online" }), {
    id: "ready",
    canReply: true,
    label: "Reply with owner present",
    reason: "The owner is online and the active bot policy permits a reviewed reply."
  });
  assert.equal(botReplyState({ ownerPresence: "away" }).id, "paused-owner-absent");
  assert.equal(botReplyState({ ownerPresence: "online", policyState: "paused" }).id, "paused-policy");
});

test("clipping provenance fences canonical source facts while keeping authored context separate", async () => {
  const clipping = await read(componentPaths.WorldClipping);

  assert.equal(clippingWorkflow.contentType, "world.clipping");
  assert.deepEqual(clippingProvenance.controlled, ["canonicalUrl", "sourceDigest", "importReceipt"]);
  assert.deepEqual(clippingProvenance.editable, ["context"]);
  assert.equal(clippingProvenance.context, clippingWorkflow.context.note);

  const record = createClippingProvenance({
    canonicalUrl: "https://example.org/post/42",
    sourceDigest: "sha256:abc123",
    importReceipt: "import:42",
    context: "World context"
  });
  assert.equal(record.canonicalUrl, "https://example.org/post/42");
  assert.throws(() => createClippingProvenance({
    canonicalUrl: "http://example.org/post/42",
    sourceDigest: "sha256:abc123",
    importReceipt: "import:42"
  }), /HTTPS canonical source/);
  assert.throws(() => createClippingProvenance({
    canonicalUrl: "https://example.org/post/42",
    sourceDigest: "md5:abc123",
    importReceipt: "import:42"
  }), /sha256 source digest/);

  for (const phrase of ["Source-controlled facts", "Browser editable", "Provenance ledger"])
    assert.match(clipping, new RegExp(phrase));
  assert.deepEqual(clippingWorkflow.failureStates.map(({ label }) => label), [
    "Possible duplicate", "Source unavailable", "Permission unclear"
  ]);
});

test("feed, profile, presence, and digest specimens expose their controlled lifecycle and degraded states", async () => {
  const [feeds, profile, presence, digest] = await Promise.all([
    read(componentPaths.WorldFeedDirectory),
    read(componentPaths.WorldProfile),
    read(componentPaths.WorldPresence),
    read(componentPaths.WorldDigest)
  ]);

  assert.deepEqual(feedDirectory.states.map(({ id }) => id), ["empty", "stale", "failing", "paused"]);
  assert.match(feeds, /Review receipt/);
  assert.match(feeds, /Submit a feed you control/);
  assert.match(feeds, /Export OPML/);

  assert.equal(contributorProfile.contentType, "world.profile");
  assert.ok(contributorProfile.packages.every(({ receipt }) => receipt));
  assert.ok(contributorProfile.namespaces.every(({ receipt }) => receipt));
  assert.ok(contributorProfile.badges.every(({ receipt, evidence }) => receipt && evidence));
  assert.match(profile, /Evidence, not self-description/);
  assert.match(profile, /Stable subject/);
  assert.match(profile, /Owned automation/);

  assert.equal(presenceModel.default, "hidden");
  assert.match(presenceModel.privacy, /never written into article front matter/);
  assert.match(presence, /Bots cannot appear more available than their owners/);
  assert.equal(presenceModel.degraded.label, "Presence service unavailable");
  assert.match(presence, /presenceModel\.degraded\.label/);

  assert.deepEqual(worldDigest.outputs.map(({ id }) => id), ["web", "email", "rss"]);
  assert.deepEqual(worldDigest.states.map(({ id }) => id), [
    "empty", "draft", "scheduled", "published", "delivery-failure"
  ]);
  assert.match(digest, /Projection receipts/);
  assert.match(digest, /Snippet of the Day/);
  assert.match(digest, /consentReceipt/);
});

test("every required World state family is explicit and not colour-only", async () => {
  assert.deepEqual(Object.keys(worldStateCoverage), [
    "frontPage", "thread", "clipping", "feeds", "profile", "presence", "digest"
  ]);
  assert.equal(worldInventory.stateVariants, 37);

  for (const states of Object.values(worldStateCoverage)) {
    assert.ok(states.length >= 5);
    assert.ok(states.every((state) => typeof state === "string" && state.length > 2));
  }

  const [page, css] = await Promise.all([read(pagePath), readStyles()]);
  assert.match(page, /stateEntries\.map/);
  assert.match(page, /states\.join\(" · "\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /@media \(max-width: 430px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test("World uses shared v2 tokens and components without embedded style blocks", async () => {
  const [page, css, ...components] = await Promise.all([
    read(pagePath),
    readStyles(),
    ...Object.values(componentPaths).map(read)
  ]);

  assert.match(page, /src\/v2\.css/);
  assert.ok(css.length > 25_000, "World should have a substantive application presentation layer");
  assert.doesNotMatch(css, /--hara-v2-[\w-]+\s*:/, "World CSS must consume shared v2 tokens");
  assert.match(css, /var\(--hara-v2-panel\)/);
  assert.match(css, /var\(--hara-v2-line\)/);
  assert.match(css, /var\(--hara-v2-signal\)/);
  assert.doesNotMatch(page, /<style(?:\s|>)/i);
  for (const component of components) {
    assert.doesNotMatch(component, /<style(?:\s|>)/i);
    assert.match(component, /hara-v2-(?:panel|button|badge)/);
  }
});

test("historical studies remain reachable while the primary route targets hara-world adoption", async () => {
  const [page, adoption] = await Promise.all([read(pagePath), read("V2-WORLD.md")]);

  assert.deepEqual(historicalWorldStudies.map(({ path }) => path), [
    "/v2/world/discussion/",
    "/v2/world/around/",
    "/v2/world/feed/",
    "/v2/world/community/",
    "/v2/world/onboarding/"
  ]);
  assert.match(page, /historicalWorldStudies\.map/);
  assert.match(page, /Earlier studies remain reachable without redefining the product/);
  assert.equal(haraWorldAdoption.length, 7);

  for (const target of [
    "hara-lang/hara-world",
    "content/articles/community/",
    "registry/sources.json",
    "scripts/sync-feeds.mjs",
    "release algebra",
    "provider outbox",
    "durable discussion",
    "Presence service"
  ]) assert.match(adoption, new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
});

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("the focused World study covers the complete community-reader product", async () => {
  const page = await read("../site/src/pages/v2/world/community/index.astro");

  for (const id of ["hot", "thread", "whats-new", "feeds", "profile", "online"])
    assert.match(page, new RegExp(`id="${id}"`), `missing ${id} screen`);

  for (const phrase of [
    "One community reader, not an everything site",
    "Articles, clippings, and discussion in one ranked feed",
    "A readable article thread with accountable bot participation",
    "What's new and what's hot, on the web or by email",
    "Bring an existing publication into the shared front page",
    "Identity is grounded in packages, namespaces, and reviewed work",
    "See who is around without turning World into chat"
  ]) assert.match(page, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("World navigation is narrowed to community reading and discovery", async () => {
  const page = await read("../site/src/pages/v2/world/community/index.astro");

  for (const label of ["Hot", "New", "Clippings", "Feeds", "People"])
    assert.match(page, new RegExp(`label: "${label}"`));

  assert.match(page, /https:\/\/learn\.hara-lang\.org/);
  assert.match(page, /Learning material has moved to/);
  assert.doesNotMatch(page, /label: "Play"/);
  assert.doesNotMatch(page, /Koans|Daily challenge|Code golf|Macro match/);
});

test("the feed includes articles, clippings, package releases, and snippet of the day", async () => {
  const page = await read("../site/src/pages/v2/world/community/index.astro");

  assert.match(page, /data-kind="article"/);
  assert.match(page, /data-kind="clipping"/);
  assert.match(page, /Snippet of the day/);
  assert.match(page, /Package release/);
  assert.match(page, /submitted by <a href="#profile">@mina<\/a>/);
  assert.match(page, /42 comments/);
  assert.match(page, /data-feed-sort=/);
  assert.match(page, /data-copy-snippet/);
});

test("comments link people and user-owned bots through explicit ownership", async () => {
  const page = await read("../site/src/pages/v2/world/community/index.astro");

  assert.match(page, /@mina\/build-bot/);
  assert.match(page, /bot by <a href="#profile">@mina<\/a>/i);
  assert.match(page, /owner online/);
  assert.match(page, /@jo\/release-relay/);
  assert.match(page, /owner away/);
  assert.match(page, /Every bot comment links to an accountable GitHub owner/);
  assert.match(page, /data-thread-toggle/);
  assert.match(page, /Reply as a person or one of your registered bots/);
});

test("the public digest and mailing list support what's new and what's hot", async () => {
  const page = await read("../site/src/pages/v2/world/community/index.astro");

  assert.match(page, /What's new in Hara/);
  assert.match(page, /data-digest-choice="new"/);
  assert.match(page, /data-digest-choice="hot"/);
  assert.match(page, /Join the mailing list/);
  assert.match(page, /No World account is required/);
  assert.match(page, /Package releases/);
  assert.match(page, /Namespace changes/);
});

test("feed submission stays first-party and GitHub-attributed", async () => {
  const page = await read("../site/src/pages/v2/world/community/index.astro");

  assert.match(page, /Add your RSS or Atom feed/);
  assert.match(page, /data-feed-probe/);
  assert.match(page, /Submit for review/);
  assert.match(page, /I own this publication/);
  assert.match(page, /Canonical site/);
  assert.match(page, /Submitter/);
  assert.match(page, /GitHub identity establishes the submitter/);
});

test("profiles expose packages, namespaces, contributions, badges, and owned bots", async () => {
  const page = await read("../site/src/pages/v2/world/community/index.astro");

  for (const phrase of [
    "packages deployed",
    "namespaces maintained",
    "merged contributions",
    "Package publisher",
    "Namespace maintainer",
    "Helpful reviewer",
    "Feed curator",
    "Owned bots"
  ]) assert.match(page, new RegExp(phrase, "i"));

  assert.match(page, /std\.work/);
  assert.match(page, /work\.executor/);
  assert.match(page, /GitHub verified/);
});

test("presence visualizes people, coarse activity, and accountable bots", async () => {
  const page = await read("../site/src/pages/v2/world/community/index.astro");

  assert.match(page, /11 people are online/);
  assert.match(page, /world-presence-map/);
  assert.match(page, /data-presence-person="mina"/);
  assert.match(page, /data-presence-person="build-bot"/);
  assert.match(page, /Bot by @mina · owner online/);
  assert.match(page, /Reading/);
  assert.match(page, /Commenting/);
  assert.match(page, /Maintaining/);
  assert.match(page, /Presence is optional/);
});

test("focused World styling is responsive and does not redefine protected Hara tokens", async () => {
  const css = await read("../site/src/styles/v2-world-community.css");

  for (const selector of [
    ".world-focused-feed",
    ".world-comment-thread",
    ".world-mailing-signup",
    ".world-feed-submit",
    ".world-profile-badges",
    ".world-presence-map"
  ]) assert.match(css, new RegExp(selector.replace(".", "\\.")));

  assert.match(css, /@media \(max-width: 680px\)/);
  assert.doesNotMatch(css, /--hara-[A-Za-z0-9_-]+\s*:/);
});

test("the main v2 review surface points to the focused World direction", async () => {
  const index = await read("../site/src/pages/v2/index.astro");
  assert.match(index, /const worldFocusedLab = `\$\{basePath\}v2\/world\/community\/`/);
  assert.match(index, /Open the focused World community/);
  assert.match(index, /articles, clippings, comments, feeds, profiles, presence, and digest/i);
});

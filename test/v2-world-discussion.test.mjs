import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

test("the focused World reference is linked from the v2 review surface", async () => {
  const [index, page] = await Promise.all([
    read("../site/src/pages/index.astro"),
    read("../site/src/pages/world/discussion/index.astro")
  ]);

  assert.match(index, /const worldDiscussionLab = `\$\{basePath\}v2\/world\/discussion\/`/);
  assert.match(index, /<strong>Focused World discussion<\/strong>/);
  assert.match(page, /Community reader · World v2/);
});

test("the focused route covers front page, thread, clipping, presence, profile, and scope", async () => {
  const page = await read("../site/src/pages/world/discussion/index.astro");

  for (const id of ["front-page", "thread", "clipping", "presence", "profile", "scope"])
    assert.match(page, new RegExp(`id="${id}"`), `missing ${id} screen`);

  for (const component of ["Shell", "Header", "ContextNav", "Sidebar"])
    assert.match(page, new RegExp(`import ${component} from .*astro\\/v2\\/${component}\\.astro`));
});

test("World local navigation is discussion-focused and Learn is an external ecosystem destination", async () => {
  const page = await read("../site/src/pages/world/discussion/index.astro");
  const nav = page.match(/const worldNav = \(current\) => \[[\s\S]*?\n\];/)?.[0] ?? "";

  for (const label of ["Hot", "New", "Following", "Clippings", "Profiles"])
    assert.match(nav, new RegExp(`label: "${label}"`));

  assert.doesNotMatch(nav, /label: "Play"/);
  assert.doesNotMatch(nav, /label: "Learn"/);
  assert.match(page, /const learnUrl = "https:\/\/learn\.hara-lang\.org\/"/);
  assert.match(page, /\{ href: learnUrl, label: "Learn", external: true \}/);
});

test("the front page centers articles, feeds, clippings, comments, presence, and the daily snippet", async () => {
  const page = await read("../site/src/pages/world/discussion/index.astro");

  for (const phrase of [
    "Article and discussion index",
    "Package feed",
    "Snippet of the day",
    "Online now",
    "34 comments",
    "Create clipping",
    "RSS, Atom, JSON Feed"
  ]) assert.match(page, new RegExp(escapeRegex(phrase)));

  assert.match(page, /data-vote="up"/);
  assert.match(page, /data-vote-score/);
});

test("comments link users and bots remain visibly accountable to present owners", async () => {
  const page = await read("../site/src/pages/world/discussion/index.astro");

  assert.match(page, /class="world-comment world-comment--bot"/);
  assert.match(page, /data-bot-owner="@mina"/);
  assert.match(page, /owned by <a href="#profile">@mina<\/a>/);
  assert.match(page, /Owner present/);
  assert.match(page, /Bot replies pause when the accountable owner leaves\./);
  assert.match(page, /@release-notes replies paused/);
  assert.match(page, /<a href="#profile">@chris<\/a>/);
  assert.match(page, /data-comment-toggle/);
});

test("presence visualizes active threads, people, maintainers, and owner-linked bots", async () => {
  const page = await read("../site/src/pages/world/discussion/index.astro");

  for (const phrase of ["22 people across 9 discussions", "7 commenting", "8 reading", "3 maintaining", "4 bots"])
    assert.match(page, new RegExp(escapeRegex(phrase)));

  assert.match(page, /world-presence-link--mina-bot/);
  assert.match(page, /data-presence-state="bot"/);
  assert.match(page, /data-presence-filter="maintaining"/);
  assert.match(page, /Presence reveals activity mode, never physical location/);
});

test("profiles center packages, contributions, evidence-linked badges, comments, clippings, and owned bots", async () => {
  const page = await read("../site/src/pages/world/discussion/index.astro");

  for (const phrase of [
    "Contribution badges",
    "Package maintainer",
    "Core contributor",
    "Helpful reviewer",
    "Feed publisher",
    "Accountable bot owner",
    "137 merged contributions",
    "Owned bots"
  ]) assert.match(page, new RegExp(escapeRegex(phrase)));

  assert.match(page, /data-evidence="packages"/);
  assert.match(page, /class="hara-v2-table world-package-table"/);
});

test("the route boundary moves structured learning to learn.hara-lang.org", async () => {
  const page = await read("../site/src/pages/world/discussion/index.astro");

  assert.match(page, /All learning materials live at learn\.hara-lang\.org\./);
  assert.match(page, /World discusses Hara\. Learn teaches it\./);
  assert.match(page, /Structured learning/);
  assert.match(page, /Getting-started paths and tutorials/);
  assert.match(page, /Koans and guided exercises/);
  assert.match(page, /No duplicated course state/);
  assert.match(page, /Snippet of the day stays social/);
});

test("the review prototype includes voting, comment collapse, presence filtering, clipping preview, and snippet feedback", async () => {
  const page = await read("../site/src/pages/world/discussion/index.astro");

  assert.match(page, /initWorldDiscussionPrototype/);
  assert.match(page, /data-comment-toggle/);
  assert.match(page, /data-presence-filter/);
  assert.match(page, /data-clip-preview/);
  assert.match(page, /data-copy-snippet/);
});

test("focused World styling is responsive and does not redefine protected Hara tokens", async () => {
  const css = await read("../site/src/styles/v2-world-discussion.css");

  for (const selector of [
    ".world-post-list",
    ".world-comment-tree",
    ".world-clipping-layout",
    ".world-presence-map",
    ".world-contribution-badges",
    ".world-boundary-grid"
  ]) assert.match(css, new RegExp(selector.replace(".", "\\.")));

  assert.match(css, /@media \(max-width: 680px\)/);
  assert.doesNotMatch(css, /--hara-[A-Za-z0-9_-]+\s*:/);
});

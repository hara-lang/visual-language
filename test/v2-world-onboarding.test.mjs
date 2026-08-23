import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("the World onboarding journey covers the complete first-session funnel", async () => {
  const page = await read("../site/src/pages/world/onboarding/index.astro");

  for (const id of ["arrival", "first-run", "interests", "for-you", "newcomer", "community-path"])
    assert.match(page, new RegExp(`id="${id}"`), `missing ${id} onboarding screen`);

  for (const phrase of [
    "The first feed item is a program, not a pitch",
    "You just ran Hara",
    "What do you want to make",
    "Answer with code",
    "You're part of Hara World",
    "Good first contribution"
  ]) assert.match(page, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("onboarding preserves the run-change-save identity boundary", async () => {
  const page = await read("../site/src/pages/world/onboarding/index.astro");

  assert.match(page, /No account needed/);
  assert.match(page, /data-onboarding-run="arrival"/);
  assert.match(page, /data-prototype-edit/);
  assert.match(page, /data-save-trigger="arrival"/);
  assert.match(page, /Continue with GitHub only when you have something worth saving/);
  assert.match(page, /Nothing is stored until you choose to save/);
});

test("feed interactions are programming-native rather than generic social actions", async () => {
  const page = await read("../site/src/pages/world/onboarding/index.astro");

  for (const action of ["Run demo", "View Hara", "Remix", "Answer with code", "Run reproduction", "Open project"])
    assert.match(page, new RegExp(action));

  assert.match(page, /312 tried · 41 remixed/);
  assert.match(page, /84 tried · 17 remixed · 9 saved/);
  assert.doesNotMatch(page, />Like</);
});

test("community discovery is organized around work and newcomer participation", async () => {
  const page = await read("../site/src/pages/world/onboarding/index.astro");

  for (const phrase of ["Projects first", "Help wanted", "New programmers", "First Hara program complete", "I'm interested", "Follow work, not celebrities"])
    assert.match(page, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("the onboarding prototype has lightweight review interactions", async () => {
  const page = await read("../site/src/pages/world/onboarding/index.astro");

  assert.match(page, /data-interest=/);
  assert.match(page, /data-experience=/);
  assert.match(page, /data-follow-button/);
  assert.match(page, /revealRunResult/);
  assert.match(page, /updateInterestSummary/);
});

test("World onboarding styling remains product-owned and responsive", async () => {
  const css = await read("../site/src/styles/v2-world-onboarding.css");

  for (const selector of [
    ".world-executable-post",
    ".world-intent-choices",
    ".world-programming-feed",
    ".world-follow-suggestions",
    ".world-community-project-grid",
    ".world-help-wanted"
  ]) assert.match(css, new RegExp(selector.replace(".", "\\.")));

  assert.match(css, /@media \(max-width: 680px\)/);
  assert.doesNotMatch(css, /--hara-[A-Za-z0-9_-]+\s*:/);
});

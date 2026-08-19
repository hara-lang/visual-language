import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const screenFiles = [
  "RadarScreen",
  "StoryScreen",
  "SignalScreen",
  "ClipScreen",
  "SubmitSourceScreen",
  "SourceProfileScreen",
  "ModerationScreen",
  "RelayScreen"
];
const cssFiles = [
  "shell",
  "primitives",
  "content",
  "workflows",
  "operations",
  "responsive"
];

test("Around Hara is linked from both the v2 review surface and World specimen", async () => {
  const [index, world] = await Promise.all([
    read("../site/src/pages/v2/index.astro"),
    read("../site/src/components/v2/WorldSpecimen.astro")
  ]);

  assert.match(index, /const worldAroundLab = `\$\{basePath\}v2\/world\/around\/`/);
  assert.match(index, /Open the Around Hara feed explorer/);
  assert.match(world, /label: "Around Hara"/);
  assert.match(world, /External signal · Hacker News/);
  assert.match(world, /Open signal radar/);
});

test("Around Hara composes eight screens through the shared v2 shell", async () => {
  const [page, screen] = await Promise.all([
    read("../site/src/pages/v2/world/around/index.astro"),
    read("../site/src/components/v2-world-around/AroundScreen.astro")
  ]);

  for (const component of screenFiles) {
    assert.match(page, new RegExp(`import ${component} from .*v2-world-around\\/${component}\\.astro`));
    assert.match(page, new RegExp(`<${component} home=\\{documentLab\\} world=\\{worldLab\\} \\/>`));
  }

  for (const component of ["Shell", "Header", "ContextNav", "Sidebar"])
    assert.match(screen, new RegExp(`import ${component} from .*astro\\/v2\\/${component}\\.astro`));

  assert.match(screen, /<slot name="actions"/);
  assert.match(screen, /<slot name="aside"/);
  assert.match(page, /import "\.\.\/\.\.\/\.\.\/\.\.\/styles\/v2-world-around\.css"/);
  assert.doesNotMatch(page, /<style>/);
});

test("Around Hara visualizes the full discovery, curation, and relay journey", async () => {
  const [page, ...screens] = await Promise.all([
    read("../site/src/pages/v2/world/around/index.astro"),
    ...screenFiles.map((name) => read(`../site/src/components/v2-world-around/${name}.astro`))
  ]);
  const experience = [page, ...screens].join("\n");

  for (const id of ["radar", "story", "signal", "clip", "submit", "source", "moderation", "relay"])
    assert.match(experience, new RegExp(`id="${id}"`), `missing ${id} screen`);

  for (const source of ["X", "Reddit", "Hacker News", "Substack", "GitHub"])
    assert.match(experience, new RegExp(source), `missing ${source} source experience`);

  assert.match(experience, /Original platform owns the post/);
  assert.match(experience, /Hara World discussion/);
  assert.match(experience, /Why this appeared/);
  assert.match(experience, /External identity · not yet claimed/);
  assert.match(experience, /Human-approved, channel-specific outbound drafts/);
  assert.match(experience, /Human approval required/);
  assert.match(experience, /prototype data only/i);
});

test("Around Hara components keep source provenance and matching evidence explicit", async () => {
  const [signal, badge, reason, data] = await Promise.all([
    read("../site/src/components/v2-world-around/SignalCard.astro"),
    read("../site/src/components/v2-world-around/SourceBadge.astro"),
    read("../site/src/components/v2-world-around/MatchReason.astro"),
    read("../site/src/components/v2-world-around/data.ts")
  ]);

  assert.match(signal, /External signal/);
  assert.match(signal, /Open original/);
  assert.match(signal, /Clip/);
  assert.match(signal, /Discuss/);
  assert.match(badge, /data-source=\{source\}/);
  assert.match(reason, /around-match-reason/);
  assert.match(data, /export const radarSignals/);
  assert.match(data, /export const coverage/);
});

test("Around Hara styling is modular, responsive, and does not redefine shared tokens", async () => {
  const [entry, ...parts] = await Promise.all([
    read("../site/src/styles/v2-world-around.css"),
    ...cssFiles.map((name) => read(`../site/src/styles/v2-world-around-${name}.css`))
  ]);
  const css = parts.join("\n");

  for (const name of cssFiles)
    assert.match(entry, new RegExp(`@import "\\./v2-world-around-${name}\\.css"`));

  for (const selector of [
    ".around-radar-art",
    ".around-signal-card",
    ".around-story-grid",
    ".around-composer",
    ".around-source-grid",
    ".around-review-grid",
    ".around-relay-grid"
  ]) assert.match(css, new RegExp(selector.replace(".", "\\.")));

  assert.match(css, /@media \(max-width: 680px\)/);
  assert.doesNotMatch(css, /--hara-[A-Za-z0-9_-]+\s*:/);
});

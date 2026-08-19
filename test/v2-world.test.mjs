import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("the expanded World laboratory is linked from the v2 review surface", async () => {
  const [index, world] = await Promise.all([
    read("../site/src/pages/v2/index.astro"),
    read("../site/src/pages/v2/world/index.astro")
  ]);

  assert.match(index, /const worldLab = `\$\{basePath\}v2\/world\/`/);
  assert.match(index, /World community laboratory/);
  assert.match(world, /World community study · Version 2/);
});

test("World uses shared v2 shell primitives instead of defining a parallel shell", async () => {
  const world = await read("../site/src/pages/v2/world/index.astro");

  for (const component of ["Shell", "Header", "ContextNav", "Sidebar"])
    assert.match(world, new RegExp(`import ${component} from .*astro\\/v2\\/${component}\\.astro`));

  assert.match(world, /import "\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/src\/v2\.css"/);
  assert.doesNotMatch(world, /<style>/);
});

test("World visualizes the feed, Play, challenge, and community loops", async () => {
  const world = await read("../site/src/pages/v2/world/index.astro");

  for (const id of ["feed", "play", "challenge", "community"])
    assert.match(world, new RegExp(`id="${id}"`), `missing ${id} screen`);

  for (const label of ["Feed", "Play", "People", "Agents", "Learn", "Sources"])
    assert.match(world, new RegExp(`label: "${label}"`), `missing ${label} navigation`);

  assert.match(world, /Daily challenge/);
  assert.match(world, /Code golf/);
  assert.match(world, /Macro match/);
  assert.match(world, /capability-free browser session/);
  assert.match(world, /Reveal peer solutions/);
  assert.match(world, /Following/);
  assert.match(world, /Projects and agents/);
});

test("World-specific styling remains product-owned and does not redefine Hara tokens", async () => {
  const css = await read("../site/src/styles/v2-world-lab.css");

  assert.match(css, /\.world-lab-hero/);
  assert.match(css, /\.world-play-feature/);
  assert.match(css, /\.world-challenge-workspace/);
  assert.match(css, /\.world-people-grid/);
  assert.match(css, /@media \(max-width: 680px\)/);
  assert.doesNotMatch(css, /--hara-[A-Za-z0-9_-]+\s*:/);
});

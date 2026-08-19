import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("Learn owns runnable onboarding and guided World examples", async () => {
  const [page, specimen] = await Promise.all([
    read("../site/src/pages/v2/learn/index.astro"),
    read("../site/src/components/v2/WorldSpecimen.astro")
  ]);

  assert.match(page, /Application buildout · Learn/);
  assert.match(page, /Learn by running something real/);
  assert.match(page, /id="start"/);
  assert.match(page, /id="tracks"/);
  assert.match(page, /id="world-examples"/);
  assert.match(page, /Programmer onboarding/);
  assert.match(page, /Community reader study/);
  assert.match(page, /<WorldSpecimen\s*\/>/);

  assert.match(specimen, /section="Learn"/);
  assert.match(specimen, /label: "Learn", current: true/);
  assert.match(specimen, /const worldDiscussionLab = `\$\{basePath\}v2\/world\/discussion\/`/);
  assert.match(specimen, /Learn owns the explanation/);
  assert.match(specimen, /Return to Learn/);
  assert.doesNotMatch(specimen, /section="World"/);
});

test("the shared theme control is a direct light-dark switch with a readable mobile label", async () => {
  const [toggle, theme, responsive] = await Promise.all([
    read("../src/astro/ThemeToggle.astro"),
    read("../src/theme.js"),
    read("../src/v2/responsive.css")
  ]);

  assert.match(toggle, /import \{ getThemePreference, resolvedTheme, toggleTheme \}/);
  assert.match(toggle, /data-hara-theme-label/);
  assert.match(toggle, /button\.addEventListener\("click", \(\) => toggleTheme\(\)\)/);
  assert.doesNotMatch(toggle, /cycleTheme/);
  assert.match(theme, /export function toggleTheme\(\)/);
  assert.match(theme, /resolvedTheme\(\) === "dark" \? "light" : "dark"/);
  assert.match(responsive, /\.hara-v2 \.hara-theme-toggle \[data-hara-theme-label\] \{ display: inline; \}/);
});

test("mobile catalogue and laboratory spacing is compact and motion-safe", async () => {
  const css = await read("../site/src/styles/v2-mobile-polish.css");

  assert.match(css, /\.v2-lab-quick-links/);
  assert.match(css, /@media \(max-width: 820px\)/);
  assert.match(css, /@media \(max-width: 560px\)/);
  assert.match(css, /\.v2-catalogue-summary/);
  assert.match(css, /\.v2-catalogue-card-grid/);
  assert.match(css, /font-size: clamp\(2\.55rem, 11\.5vw, 3\.35rem\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /--hara-[A-Za-z0-9_-]+\s*:/);
});

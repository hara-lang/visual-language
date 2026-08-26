import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the shared hamburger owns the Visual Language catalogue launcher", async () => {
  const masthead = await read("site/src/components/v2-catalogue/CatalogueMasthead.astro");

  assert.match(masthead, /menuMode="product"/);
  assert.match(masthead, /menuControls="v2-catalogue-launcher"/);
  assert.match(masthead, /menuLabel="Open catalogue"/);
  assert.match(masthead, /setHaraHeaderMenuState/);
  assert.match(masthead, /hara:header-menu-request/);
  assert.match(masthead, /data-hara-header-menu/);
  assert.match(masthead, /stopImmediatePropagation/);
  assert.match(masthead, /data-catalogue-launcher/);
  assert.match(masthead, /data-catalogue-launcher-backdrop/);
  assert.doesNotMatch(masthead, /class="v2-catalogue-launcher-trigger"/);
  assert.doesNotMatch(masthead, /data-catalogue-launcher-trigger/);
});

test("route navigation uses one all-width secondary shell without a third row", async () => {
  const [header, route, section, css] = await Promise.all([
    read("site/src/components/v2-catalogue/CatalogueHeader.astro"),
    read("site/src/components/v2-catalogue/CatalogueRouteBar.astro"),
    read("site/src/components/v2-catalogue/CatalogueSectionNav.astro"),
    read("site/src/styles/v2-catalogue-secondary-one-line.css")
  ]);

  assert.match(header, /class="v2-catalogue-secondary-shell" data-catalogue-secondary-shell/);
  assert.match(header, /v2-catalogue-secondary-one-line\.css/);
  assert.match(header, /CatalogueSectionNav/);
  assert.match(header, /sectionNav/);
  assert.match(header, /slot name="secondary-nav"/);
  assert.match(route, /data-catalogue-family-trigger/);
  assert.match(route, /data-catalogue-family-tabs/);
  assert.match(route, /data-family-open="false"/);
  assert.match(route, /aria-label=\{`Back to \$\{parentLabel\}`\}/);
  assert.match(route, /v2-catalogue-parent-icon/);
  assert.match(route, /data-tooltip=\{`Back to \$\{parentLabel\}`\}/);
  assert.match(route, /catalogueStatusLabels/);
  assert.match(route, /<small>\{stateLabel\}<\/small>/);
  assert.doesNotMatch(route, /<small>\{context\.statusLabel\}<\/small>/);
  assert.match(section, /data-catalogue-section-trigger/);
  assert.match(section, /data-catalogue-section-links/);
  assert.match(section, /data-catalogue-section-progress/);
  assert.match(section, /data-section-progress/);
  assert.match(section, /data-v2-scroll-progress/);
  assert.match(section, /Page scroll progress/);
  assert.match(`${route}\n${section}`, /hara:catalogue-secondary-disclosure/);
  assert.match(route, /kind: "family"/);
  assert.match(section, /kind: "section"/);
  assert.match(`${route}\n${section}`, /event\.key (?:===|!==) "Escape"/);
  assert.doesNotMatch(`${route}\n${section}`, /matchMedia\("\(max-width: 840px\)"\)/);

  const firstResponsiveRule = css.indexOf("@media (max-width: 840px)");
  const shellRule = css.indexOf(".v2-catalogue-secondary-shell {");
  const shellDisplay = css.indexOf("display: flex;", shellRule);
  assert.ok(shellRule >= 0 && shellDisplay > shellRule, "the canonical shell must render as flex before responsive overrides");
  assert.ok(firstResponsiveRule > shellDisplay, "the one-line shell must not depend on the compact breakpoint");
  assert.match(css, /min-height: 48px/);
  assert.match(css, /max-height: 48px/);
  assert.match(css, /white-space: nowrap/);
  assert.match(css, /left: clamp\(12px, 2vw, 28px\) !important/);
  assert.match(css, /width: min\(360px, calc\(100vw - 56px\)\) !important/);
  assert.match(css, /\.v2-catalogue-route-bar\[data-family-open="true"\][\s\S]*?display: grid !important/);
  assert.match(css, /\.v2-catalogue-section-nav\[data-open="true"\][\s\S]*?display: grid !important/);
  assert.match(css, /\.v2-catalogue-secondary-shell > \.www-subnav/);
  assert.match(css, /\.www-selector \.hara-v2-select/);
  assert.match(css, /\.v2-catalogue-family-tabs a small/);
  assert.match(css, /min-height: 44px/);
  assert.match(css, /body\.hara-v2 :is\([\s\S]*?display: none !important;/);
  assert.doesNotMatch(css, /body\[data-catalogue-section-ready="true"\]/);
  for (const selector of [
    "icon-guide-local-nav", "symbol-guide-local-nav", "media-guide-local-nav",
    "diagram-guide-local-nav", "data-guide-local-nav", "guide-local-nav",
    "specs-local-nav", "frontmatter-section-nav", "packages-local-nav", "learn-local-nav"
  ]) assert.match(css, new RegExp(`\\.${selector}`));

  assert.match(css, /\.v2-catalogue-parent-icon\s*\{/);
  assert.match(css, /\.v2-catalogue-parent-link::after\s*\{/);
  assert.match(css, /\.v2-catalogue-parent-link:hover::after/);
  assert.match(css, /width: 48px/);

  assert.doesNotMatch(css, /--hara-v2-[A-Za-z0-9_-]+\s*:/, "the product stylesheet may consume but not redefine protected v2 tokens");
});

test("the secondary shell stays docked below the primary header while content scrolls", async () => {
  const css = await read("site/src/styles/v2-catalogue-secondary-one-line.css");
  const shellRule = css.match(/\.v2-catalogue-secondary-shell \{([\s\S]*?)\}/)?.[1] ?? "";

  assert.match(shellRule, /position:\s*sticky/);
  assert.match(shellRule, /top:\s*var\(--v2-catalogue-masthead-height\)/);
  assert.match(shellRule, /z-index:\s*110/);
  assert.match(shellRule, /isolation:\s*isolate/);
  assert.match(shellRule, /background:\s*var\(--hara-v2-panel-raised\)/);
  assert.doesNotMatch(shellRule, /backdrop-filter/);
  assert.doesNotMatch(shellRule, /box-shadow/);

  assert.match(css, /\.v2-catalogue-secondary-shell :is\([\s\S]*?font-family:\s*var\(--hara-v2-font-body\);[\s\S]*?font-size:\s*13px;[\s\S]*?font-weight:\s*650;[\s\S]*?line-height:\s*1;/);
  assert.match(css, /body\.hara-v2\s*\{[\s\S]*?background-color:\s*color-mix\(in srgb, var\(--hara-v2-panel\) 92%, var\(--hara-v2-canvas\)\);[\s\S]*?background-image:\s*none;/);

  assert.match(css, /\.v2-catalogue-route-bar \.v2-catalogue-family-tabs \{[\s\S]*?position: absolute !important;[\s\S]*?top: 100%/);
  assert.match(css, /\.v2-catalogue-section-links \{[\s\S]*?position: absolute !important;[\s\S]*?top: 100%/);
});

test("route and section panels stay mutually exclusive without viewport mode switching", async () => {
  const [route, section] = await Promise.all([
    read("site/src/components/v2-catalogue/CatalogueRouteBar.astro"),
    read("site/src/components/v2-catalogue/CatalogueSectionNav.astro")
  ]);

  assert.match(route, /event\.detail\?\.kind === "family"/);
  assert.match(section, /event\.detail\?\.kind === "section"/);
  assert.match(route, /event\.detail\?\.kind === "family" \|\| !event\.detail\?\.open/);
  assert.match(section, /event\.detail\?\.kind === "section" \|\| !event\.detail\?\.open/);
  assert.match(route, /const open = Boolean\(requestedOpen\)/);
  assert.match(section, /const open = Boolean\(requestedOpen\)/);
  assert.doesNotMatch(`${route}\n${section}`, /addEventListener\("change", onViewportChange\)/);
  assert.doesNotMatch(section, /scrollIntoView/);
});

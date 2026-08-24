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
  assert.match(masthead, /data-catalogue-launcher/);
  assert.match(masthead, /data-catalogue-launcher-backdrop/);
  assert.doesNotMatch(masthead, /class="v2-catalogue-launcher-trigger"/);
  assert.doesNotMatch(masthead, /data-catalogue-launcher-trigger/);
});

test("route and on-page navigation share one all-width secondary shell", async () => {
  const [header, route, section, css] = await Promise.all([
    read("site/src/components/v2-catalogue/CatalogueHeader.astro"),
    read("site/src/components/v2-catalogue/CatalogueRouteBar.astro"),
    read("site/src/components/v2-catalogue/CatalogueSectionNav.astro"),
    read("site/src/styles/v2-catalogue-secondary-one-line.css")
  ]);

  assert.match(header, /class="v2-catalogue-secondary-shell" data-catalogue-secondary-shell/);
  assert.match(header, /v2-catalogue-secondary-one-line\.css/);
  assert.match(route, /data-catalogue-family-trigger/);
  assert.match(route, /data-catalogue-family-tabs/);
  assert.match(route, /data-family-open="false"/);
  assert.match(route, /aria-label=\{`Back to \$\{parentLabel\}`\}/);
  assert.match(route, /catalogueStatusLabels/);
  assert.match(route, /<small>\{stateLabel\}<\/small>/);
  assert.doesNotMatch(route, /<small>\{context\.statusLabel\}<\/small>/);
  assert.match(section, /data-catalogue-section-trigger/);
  assert.match(section, /data-catalogue-section-links/);
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
  assert.match(css, /\.v2-catalogue-family-tabs a small/);
  assert.match(css, /min-height: 44px/);

  const mediumBreakpoint = css.indexOf("@media (max-width: 420px)");
  const narrowBreakpoint = css.indexOf("@media (max-width: 340px)");
  const hiddenParentText = css.indexOf(".v2-catalogue-parent-link span:last-child { display: none; }");
  assert.ok(mediumBreakpoint >= 0, "the 390px layout needs its own compact sizing block");
  assert.ok(narrowBreakpoint > mediumBreakpoint, "arrow-only reduction must begin below the 390px layout");
  assert.ok(hiddenParentText > narrowBreakpoint, "the visible parent label must remain through 390px and 360px");

  assert.doesNotMatch(css, /--hara-v2-[A-Za-z0-9_-]+\s*:/, "the product stylesheet may consume but not redefine protected v2 tokens");
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
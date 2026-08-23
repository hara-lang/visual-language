import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  artifactEnvelope,
  artifactIsStale,
  artifactStates,
  benchmarkReport,
  deliveryFixtureNotice,
  deliveryFormats,
  deliverySummary,
  packageReceipt,
  plainTextProjection,
  productSocialCards,
  releaseStory,
  safeZones,
  specsPacket,
  worldDigest
} from "../site/src/lib/v2-media.mjs";
import {
  catalogueHref,
  catalogueItemById,
  catalogueItemIsCurrent
} from "../site/src/lib/v2-catalogue.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFile(resolve(root, path), "utf8");
const pagePath = "site/src/pages/media/index.astro";
const componentPaths = [
  "site/src/components/v2-media/MediaProjectionLab.astro",
  "site/src/components/v2-media/MediaEmail.astro",
  "site/src/components/v2-media/MediaPrint.astro",
  "site/src/components/v2-media/MediaSocial.astro",
  "site/src/components/v2-media/MediaStatic.astro"
];

test("delivery fixtures are deterministic and explicitly non-authoritative", () => {
  assert.equal(deliveryFixtureNotice.productionAuthority, false);
  assert.match(deliveryFixtureNotice.summary, /products, registries, runtimes and reviewers remain authoritative/i);
  assert.match(releaseStory.fixtureRevision, /^media-fixture:[a-f0-9]{16}$/);
  assert.equal(releaseStory.sourceRevision, "package:std.work@0.4.2+sha.8bd2c741");
  assert.equal(releaseStory.authority, "Hara package registry");
});

test("the format inventory covers email, print, four social ratios and plain text", () => {
  assert.deepEqual(deliveryFormats.map(({ id }) => id), ["email", "print", "og", "square", "portrait", "story", "text"]);
  assert.ok(deliveryFormats.every(({ interactive }) => interactive === false));
  assert.deepEqual(deliveryFormats.filter(({ channel }) => channel === "social").map(({ ratio }) => ratio), ["40:21", "1:1", "4:5", "9:16"]);
  assert.equal(deliverySummary.formats, 7);
});

test("artifact envelopes preserve source truth and staleness remains an artifact fact", () => {
  const envelope = artifactEnvelope(releaseStory);
  assert.deepEqual(Object.keys(envelope), [
    "artifactType",
    "template",
    "canonicalUrl",
    "sourceIdentity",
    "sourceRevision",
    "authority",
    "status",
    "locale",
    "direction",
    "generatedAt",
    "staleAfter",
    "textEquivalent"
  ]);
  assert.equal(envelope.sourceIdentity, releaseStory.sourceIdentity);
  assert.equal(envelope.sourceRevision, releaseStory.sourceRevision);
  assert.equal(envelope.authority, releaseStory.authority);
  assert.equal(envelope.canonicalUrl, releaseStory.canonicalUrl);
  assert.equal(artifactIsStale(releaseStory, "2026-09-01T00:00:00+10:00"), false);
  assert.equal(artifactIsStale(releaseStory, "2026-10-01T00:00:00+10:00"), true);
  assert.equal(artifactIsStale(packageReceipt, "2030-01-01T00:00:00Z"), false);
});

test("artifact lifecycle distinguishes current, stale, unavailable and failed", () => {
  assert.deepEqual(artifactStates.map(({ id }) => id), ["current", "stale", "unavailable", "failed"]);
  assert.equal(new Set(artifactStates.map(({ symbol }) => symbol)).size, artifactStates.length);
  assert.equal(new Set(artifactStates.map(({ line }) => line)).size, artifactStates.length);
  assert.match(artifactStates.find(({ id }) => id === "failed")?.meaning ?? "", /generation reached a terminal failure/i);
  assert.match(artifactStates.find(({ id }) => id === "unavailable")?.meaning ?? "", /cannot currently be generated or retrieved/i);
});

test("email fixtures include editorial, transactional and plain-text requirements", () => {
  assert.match(worldDigest.subject, /What’s new in Hara/);
  assert.match(worldDigest.preheader, /canonical links and package revisions/i);
  assert.match(worldDigest.preferencesUrl, /preferences\/email/);
  assert.match(worldDigest.unsubscribeUrl, /unsubscribe/);
  assert.equal(worldDigest.items.length, 5);
  assert.ok(worldDigest.items.every(({ title, summary, source, revision }) => title && summary && source && revision));
  assert.equal(packageReceipt.receipt, "receipt:pkg:204");
  assert.equal(packageReceipt.checks.length, 4);
  assert.ok(packageReceipt.checks.every(([label, status, evidence]) => label && status === "accepted" && evidence));
  const digestText = plainTextProjection(worldDigest);
  const receiptText = plainTextProjection(packageReceipt);
  assert.match(digestText, /Status: current/);
  assert.match(digestText, /Canonical: https:\/\/world\.hara-lang\.org/);
  assert.match(receiptText, /Package publication accepted/);
  assert.match(receiptText, /Authority: Hara package registry/);
});

test("print fixtures preserve proposal evidence and benchmark uncertainty", () => {
  assert.equal(specsPacket.proposal, "HAL-27");
  assert.equal(specsPacket.sections.length, 4);
  assert.match(specsPacket.sourceRevision, /^proposal:27@3/);
  assert.match(specsPacket.canonicalUrl, /specs\.hara-lang\.org\/proposals\/HAL-27/);
  assert.equal(benchmarkReport.rows.length, 6);
  assert.match(benchmarkReport.uncertainty, /95% bootstrap interval/);
  assert.match(benchmarkReport.uncertainty, /Missing and unsupported targets are not plotted as zero/);
  assert.deepEqual(benchmarkReport.rows.at(-1), ["Java host", "N/A", "unsupported", "unsupported"]);
});

test("social safe zones and product-family cards are complete and text-equivalent", () => {
  assert.deepEqual(Object.keys(safeZones), ["og", "square", "portrait", "story"]);
  assert.deepEqual(
    Object.values(safeZones).map(({ width, height }) => `${width}:${height}`),
    ["1200:630", "1080:1080", "1080:1350", "1080:1920"]
  );
  for (const zone of Object.values(safeZones)) {
    assert.ok(zone.insetX > 0 && zone.insetY > 0);
    assert.ok(zone.insetX * 2 < zone.width && zone.insetY * 2 < zone.height);
  }
  assert.deepEqual(productSocialCards.map(({ id }) => id), ["www", "playground", "specs", "packages", "world", "learn"]);
  assert.equal(productSocialCards.length, 6);
  assert.ok(productSocialCards.every(({ label, title, summary, destination, sourceRevision, altText }) => label && title && summary && destination && sourceRevision && altText.includes(destination)));
  assert.match(releaseStory.altText, /five hosts/i);
});

test("plain text and feed projection retain canonical source and exact revision", () => {
  const text = plainTextProjection(releaseStory);
  assert.match(text, /STD\.WORK 0\.4\.2/);
  assert.match(text, /Source: package:std\.work@0\.4\.2\+sha\.8bd2c741/);
  assert.match(text, /Authority: Hara package registry/);
  assert.match(text, /Canonical: https:\/\/packages\.hara-lang\.org/);
  assert.equal(deliverySummary.emailItems, worldDigest.items.length);
  assert.equal(deliverySummary.receiptChecks, packageReceipt.checks.length);
  assert.equal(deliverySummary.specSections, specsPacket.sections.length);
  assert.equal(deliverySummary.benchmarkRows, benchmarkReport.rows.length);
  assert.equal(deliverySummary.productCards, productSocialCards.length);
  assert.equal(deliverySummary.safeZones, Object.keys(safeZones).length);
});

test("public media components validate format, state, label and provenance fields", async () => {
  const [frame, provenance] = await Promise.all([
    read("src/astro/v2/DeliveryFrame.astro"),
    read("src/astro/v2/ArtifactProvenance.astro")
  ]);
  assert.match(frame, /Unknown Hara delivery format/);
  assert.match(frame, /Unknown Hara artifact state/);
  assert.match(frame, /requires an accessible label/);
  assert.match(frame, /data-delivery-format=\{format\}/);
  assert.match(frame, /data-artifact-state=\{state\}/);
  assert.match(frame, /lang=\{language\}/);
  assert.match(frame, /dir=\{direction\}/);
  assert.match(frame, /aria-label=\{label\}/);
  assert.match(provenance, /ArtifactProvenance requires envelope/);
  assert.match(provenance, /<dl>/);
  assert.match(provenance, /Source/);
  assert.match(provenance, /Revision/);
  assert.match(provenance, /Authority/);
  assert.match(provenance, /Canonical/);
  assert.match(provenance, /datetime=\{envelope\.generatedAt\}/);
});

test("the media route is active in Foundations and composes every detailed specimen", async () => {
  const route = catalogueItemById("media");
  assert.ok(route);
  assert.equal(route.path, "/media/");
  assert.equal(route.href, "/media/");
  assert.equal(route.status, "active");
  assert.equal(route.issue, 108);
  assert.equal(catalogueHref(route, "/visual-language/"), "/visual-language/media/");
  assert.equal(catalogueItemIsCurrent(route, "/media/"), true);
  await access(resolve(root, pagePath));
  const page = await read(pagePath);
  assert.match(page, /import CatalogueHeader/);
  assert.match(page, /activePath="\/v2\/media\/"/);
  assert.match(page, /src\/v2-media\.css/);
  assert.match(page, /initialiseMediaGuide/);
  for (const component of ["MediaProjectionLab", "MediaEmail", "MediaPrint", "MediaSocial", "MediaStatic"]) {
    assert.match(page, new RegExp(`import ${component} from`));
    assert.match(page, new RegExp(`<${component}\\s*/>`));
  }

  const combined = (await Promise.all(componentPaths.map(read))).join("\n");
  for (const id of ["projection", "email", "print", "social", "static", "states", "contract"])
    assert.match(combined, new RegExp(`id=\\"${id}\\"`));
  assert.match(combined, /One release story\. Seven delivery shapes\. One source revision\./);
  assert.match(combined, /Useful in a hostile client, complete without images\./);
  assert.match(combined, /Paginated evidence without background ink or hidden controls\./);
  assert.match(combined, /Short title, one proof, safe crop, complete alt text\./);
  assert.match(combined, /No JavaScript and no image must still produce the useful artifact\./);
});

test("email and print specimens include required structural and evidence controls", async () => {
  const [email, print] = await Promise.all([
    read(componentPaths[1]),
    read(componentPaths[2])
  ]);
  assert.ok((email.match(/role="presentation"/g) ?? []).length >= 6);
  assert.match(email, /hara-media-email-preheader/);
  assert.match(email, /Preferences/);
  assert.match(email, /Unsubscribe/);
  assert.match(email, /Open the public digest/);
  assert.match(email, /plainTextProjection/);
  assert.match(email, /receipt:pkg:204|packageReceipt\.receipt/);
  assert.match(print, /Page 1 of 2/);
  assert.match(print, /Page 1 of 3/);
  assert.match(print, /hara-media-print-url/);
  assert.match(print, /Unsupported is not zero/);
  assert.match(print, /relation list, event table, transition table or adjacency table/);
});

test("social specimens expose all aspect families, safe-zone review and alt text", async () => {
  const social = await read(componentPaths[3]);
  for (const format of ["og", "square", "portrait", "story"])
    assert.match(social, new RegExp(`format=\\{format\\}|format=\\"${format}\\"`));
  assert.match(social, /data-safe-zone-toggle/);
  assert.match(social, /data-social-text-only/);
  assert.match(social, /hara-media-safe-zone/);
  assert.match(social, /Alt text/);
  assert.match(social, /productSocialCards\.map/);
  assert.match(social, /once the iconography revision merges/i);
});

test("static specimens remain semantic and open without JavaScript", async () => {
  const staticPage = await read(componentPaths[4]);
  assert.match(staticPage, /hara-media-low-bandwidth/);
  assert.match(staticPage, /<h1>/);
  assert.match(staticPage, /<dl>/);
  assert.match(staticPage, /<details open>/);
  assert.match(staticPage, /<ol>/);
  assert.match(staticPage, /JSON\.stringify\(feedItem, null, 2\)/);
  assert.match(staticPage, /data-artifact-state=\{state\.id\}/);
  assert.match(staticPage, /Required delivery artifact envelope/);
  assert.doesNotMatch(staticPage, /canvas|WebGL/i);
});

test("review interactions switch projections and overlays without persistence or network authority", async () => {
  const script = await read("site/src/scripts/v2-media.js");
  for (const marker of ["data-media-format", "data-format-panel", "data-media-state", "data-safe-zone-toggle", "data-social-text-only", "data-artifact-state"])
    assert.match(script, new RegExp(marker));
  assert.match(script, /setPressed/);
  assert.match(script, /hidden = panel\.dataset\.formatPanel !== format/);
  assert.match(script, /dataset\.artifactState = select\.value/);
  assert.doesNotMatch(script, /localStorage|sessionStorage|document\.cookie|fetch\(/);
});

test("public media CSS covers formats, state, email, print, social, static, forced colours and print output", async () => {
  const [entry, css] = await Promise.all([
    read("src/v2-media.css"),
    read("src/v2/media.css")
  ]);
  assert.match(entry, /@import "\.\/v2\/media\.css"/);
  for (const selector of [
    ".hara-delivery-frame",
    ".hara-artifact-provenance",
    ".hara-media-safe-zone",
    ".hara-media-social-card",
    ".hara-media-email",
    ".hara-media-print-page",
    ".hara-media-plain-text",
    ".hara-media-low-bandwidth"
  ]) assert.match(css, new RegExp(selector.replace(".", "\\.")));
  assert.match(css, /aspect-ratio:\s*40 \/ 21/);
  assert.match(css, /aspect-ratio:\s*1/);
  assert.match(css, /aspect-ratio:\s*4 \/ 5/);
  assert.match(css, /aspect-ratio:\s*9 \/ 16/);
  assert.match(css, /max-width:\s*600px/);
  assert.match(css, /@page/);
  assert.match(css, /size:\s*A4/);
  assert.match(css, /display:\s*table-header-group/);
  assert.match(css, /attr\(href\)/);
  assert.match(css, /@media \(forced-colors: active\)/);
  assert.match(css, /@media print/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(`${entry}\n${css}`, /--hara-[A-Za-z0-9_-]+\s*:/, "media CSS must consume protected Hara tokens rather than redefine them");
});

test("guide CSS is responsive, overflow-safe and print-aware", async () => {
  const css = await read("site/src/styles/v2-media-guide.css");
  for (const selector of [
    ".media-projection-workbench",
    ".media-email-layout",
    ".media-print-layout",
    ".media-social-format-grid",
    ".media-static-layout",
    ".media-artifact-states",
    ".media-ownership-grid"
  ]) assert.match(css, new RegExp(selector.replace(".", "\\.")));
  assert.match(css, /overflow-x:\s*auto/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media \(max-width: 680px\)/);
  assert.match(css, /@media \(max-width: 440px\)/);
  assert.match(css, /@media \(forced-colors: active\)/);
  assert.match(css, /@media print/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /--hara-[A-Za-z0-9_-]+\s*:/);
});

test("package exports and written contract expose the complete additive media surface", async () => {
  const [packageJson, document] = await Promise.all([
    read("package.json").then(JSON.parse),
    read("V2-MEDIA.md")
  ]);
  assert.equal(packageJson.exports["./v2-media.css"], "./src/v2-media.css");
  assert.equal(packageJson.exports["./astro/v2/DeliveryFrame.astro"], "./src/astro/v2/DeliveryFrame.astro");
  assert.equal(packageJson.exports["./astro/v2/ArtifactProvenance.astro"], "./src/astro/v2/ArtifactProvenance.astro");
  assert.ok(packageJson.files.includes("V2-MEDIA.md"));
  for (const phrase of [
    "Artifact envelope",
    "Email contract",
    "Print and PDF contract",
    "Social and campaign-card contract",
    "Plain-text, feed and low-bandwidth contract",
    "Artifact state contract",
    "Accessibility contract",
    "Internationalisation",
    "Ownership boundary",
    "must never be treated as current product facts"
  ]) assert.match(document, new RegExp(phrase, "i"));
});

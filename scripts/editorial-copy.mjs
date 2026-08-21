#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apply = process.argv.includes("--apply");
const extensions = new Set([".astro", ".mjs"]);
const sourceRoots = [
  path.join(root, "site", "src", "pages"),
  path.join(root, "site", "src", "components"),
  path.join(root, "site", "src", "lib"),
  path.join(root, "test")
];

const replacements = [
  // Remove the recurring sales/design-showcase vocabulary without touching CSS
  // class names such as `v2-lab-*`.
  ["Laboratories", "References"],
  ["laboratories", "references"],
  ["Laboratory", "Reference"],
  ["laboratory", "reference"],
  ["Focused product studies", "Focused interface studies"],
  ["focused product studies", "focused interface studies"],
  ["Focused product study", "Focused interface study"],
  ["focused product study", "focused interface study"],
  ["Product study", "Interface study"],
  ["product study", "interface study"],
  ["Application buildout", "Application reference"],
  ["application buildout", "application reference"],
  ["Product buildout", "Route reference"],
  ["product buildout", "route reference"],
  ["Product-specific", "Application-specific"],
  ["product-specific", "application-specific"],
  ["Product-local", "Application-local"],
  ["product-local", "application-local"],
  ["Product context", "Application context"],
  ["product context", "application context"],
  ["Product repositories", "Application repositories"],
  ["product repositories", "application repositories"],
  ["Product information architecture", "Application information architecture"],
  ["product information architecture", "application information architecture"],
  ["Product states", "Route states"],
  ["product states", "route states"],
  ["Product semantics", "Route semantics"],
  ["product semantics", "route semantics"],
  ["Product navigation", "Route navigation"],
  ["product navigation", "route navigation"],
  ["Product boundary", "Route boundary"],
  ["product boundary", "route boundary"],
  ["Product families", "Route families"],
  ["product families", "route families"],
  ["Product glyphs", "Route glyphs"],
  ["product glyphs", "route glyphs"],
  ["Product use", "Route use"],
  ["product use", "route use"],
  ["Product compositions", "Route compositions"],
  ["product compositions", "route compositions"],
  ["Product contract", "Route contract"],
  ["product contract", "route contract"],
  ["Product surfaces", "Application surfaces"],
  ["product surfaces", "application surfaces"],
  ["Product fit", "Maintenance context"],
  ["product fit", "maintenance context"],
  ["Separate product", "Separate route"],
  ["separate product", "separate route"],
  ["its own product", "its own route"],
  ["The products remain connected", "The routes remain connected"],
  ["the products remain connected", "the routes remain connected"],
  ["focused products", "focused routes"],
  ["Hara products need", "Hara sites and tools need"],
  ["Hara products may", "Hara sites and tools may"],
  ["every Hara product", "every Hara site and tool"],
  ["Hara products, tools and documentation", "Hara sites, tools and documentation"],
  ["Hara products and tools", "Hara sites and tools"],
  ["Products retain behaviour", "Applications retain behaviour"],

  // Replace the most visible slogan-led openings with descriptive headings.
  ["Precision, with room to breathe.", "Shared interface rules for Hara."],
  ["The interface before the interface.", "Shared interface foundations."],
  ["The reusable parts, with their boundaries intact.", "Reusable components and their ownership boundaries."],
  ["Patterns are contracts between states, not screenshots.", "Interaction patterns define transitions between interface states."],
  ["Precision tools, made calm.", "Shared workbench structures for Hara tools."],
  ["Technology with scale, grain, and consequence.", "Raster backgrounds, material textures, and WebGL fields."],
  ["One catalogue. Many products. One review grammar.", "One route catalogue and one review procedure."],
  ["A front page for the Hara community.", "Articles, discussions, and contributor records for Hara."],
  ["One language · two focused products", "One language · two route families"],
  ["The whole system, still visible.", "Language, runtime, libraries, and records."],
  ["Get a living thing back before reading a framework tour.", "Run a small verified example before reading the wider repository."],
  ["Find the exact thing you can trust.", "Find an exact package or namespace record."],

  // Direct World discussion route.
  ["Focused Hara World v2 discussion reference for articles, clippings, comments, GitHub-backed profiles, presence, package contribution, badges, notifications, and community newsletters.", "Hara World community reference for attributed articles, clippings, comments, GitHub-backed profiles, presence, package maintenance, notifications, and community newsletters."],
  ["Hara World v2 discussion and presence reference", "Hara World community discussion and presence"],
  ["The public Hara community reader, package discussion index, and presence reference.", "Attributed Hara articles, package discussions, contributor profiles, presence, and source records."],
  ["Hara World v2 focused discussion reference", "Hara World community discussion reference"],
  ["Focused World field test", "World community reference"],
  ["World application specification", "World route specification"],
  ["World interaction audit", "World interaction reference"],
  ["Focused interface study · World v2", "Community reader · World v2"],
  ["World becomes deliberately smaller: a public Hara discussion product for articles, clippings, comments, packages, people, feeds, and accountable bot participation. Learning moves out to its own route.", "World is a public reader for attributed Hara articles, clippings, comments, package changes, people, feeds, and owner-attributed bot participation. Structured lessons, exercises, and progress remain in Learn."],
  ["Browse what is active", "Read current articles"],
  ["Inspect the product boundary", "Inspect the route boundary"],
  ["Presence / live", "Presence / availability"],
  ["Weekly readers", "Subscribed feeds"],
  ["14.8k", "128"],
  ["Ranked community index", "Article and discussion index"],
  ["World rank combines freshness, discussion, package impact, and declared relevance. It remains an inspectable ordering signal rather than a claim about authority.", "Article ordering combines freshness, discussion, package relevance, and declared topic matches. It remains inspectable and does not determine technical authority."],
  ["Rank model, visible.", "Article ordering is explained."],
  ["World rank + package impact", "Freshness + discussion + package relevance"],
  ["World owns public discussion and attributable community context. Learn owns structured teaching, exercises, progress, and guided examples.", "World records public discussion and attributed community context. Learn records structured explanations, exercises, projects, and progress."],
  ["Community identity, package contribution, clippings, and discussion can meet in World without turning World into a course platform or Learn into a social feed.", "Contributor identity, package maintenance, clippings, and discussion meet in World without turning discussion into a progress score or lessons into a popularity feed."],
  ["World and Learn share identity and links, not information architecture.", "World and Learn may share identity and links while retaining separate records and navigation."],
  ["The routes remain connected by identity, package records, and canonical links, but each keeps its own route, navigation, content contract, and success criteria.", "The routes remain connected by identity, package records, and canonical links, but each keeps its own navigation, content contract, and authoritative records."],
  ["Hara World v2 focused interface reference", "Hara World community reference"],

  // Foundations, components, UI and front matter openings.
  ["A visual source of truth for the shared interface language beneath every Hara product.", "Shared identity, colour, typography, geometry, imagery, motion, and accessibility rules for Hara sites and tools."],
  ["Hara sites and tools may have different information architectures, but they should feel related before a user reads a label. This catalogue makes the protected identity, material, rhythm, image, state, and accessibility contracts visible in one place.", "Hara sites and tools may have different information architectures while sharing identity, typography, colour, geometry, state, motion, and accessibility rules. This page records those rules and their source tokens."],
  ["This catalogue answers four questions for every component: what it means, where it is exported, which states it owns, and where application-specific composition begins. The visual framing belongs to this reference; the component geometry and behaviour remain in the package.", "For each component, this catalogue records its semantic role, export path, owned states, accessibility contract, responsive behaviour, and the point where application-specific composition begins."],
  ["Open tool reference", "Inspect tool workbenches"],
  ["Global catalogue, application context, local work.", "Global reference, application context, and local work remain distinct."],
  ["This reference shows how shared Hara interfaces move through search, mutation, loading, permission, failure, recovery, and responsive collapse. Application repositories own their business rules; this route owns the reusable interaction grammar.", "This reference records how shared Hara interfaces move through search, mutation, loading, permission, failure, recovery, and responsive collapse. Application repositories retain their domain rules and authoritative state."],
  ["UI reference scope", "UI pattern scope"],
  ["Front matter reference specimens are incomplete.", "Front matter reference specimens are incomplete."],
  ["Hara v2 front matter and content-contract reference", "Hara v2 front matter and content contracts"],
  ["Front matter reference sections", "Front matter reference sections"],
  ["Front matter is a public interface, not a hidden preamble.", "Front matter is typed content metadata."],
  ["One typed registry drives authoring boundaries, route identity, cards, feeds, search, social metadata,\n            machine endpoints, migrations, and publication receipts across every Hara application family.", "One typed registry records author-editable, controlled, and derived fields for route identity, cards, feeds, search, social metadata, machine endpoints, migrations, and publication receipts."],
  ["Shared metadata stays common. Route semantics stay precise.", "Shared metadata stays common while each route keeps its own semantics."],

  // Guide, tool, graphics, data and diagram wording.
  ["Review every Hara v2 route against one theme, viewport, state, provenance and adoption grammar.", "Review each Hara v2 route against the same theme, viewport, state, provenance, and adoption procedure."],
  ["The guide makes route relationships, navigation ownership, route states, provenance, themes, responsive behavior and downstream responsibility reviewable from one place—without flattening every Hara product into the same information architecture.", "The guide records route relationships, navigation ownership, implementation states, provenance, themes, responsive behaviour, validation, and downstream responsibility without imposing one information architecture on every route."],
  ["Hara v2 tool workbench reference", "Hara v2 tool workbench reference"],
  ["Browser runtime, live environment, 3D, node/material, and animation workbenches built from one calm precision-tool language.", "Browser runtime, environment, 3D, node/material, and animation workbenches built from shared controls and layout contracts."],
  ["V2 tool field test", "V2 workbench reference"],
  ["Editor structure remains dense and capable, but the surfaces now settle into one continuous frame: reusable browser-runtime and environment sections, capability-aware controls, softer seams, restrained depth, clear selection, and quieter telemetry that stays out of the work.", "This page compares browser-runtime, environment, 3D, node/material, and animation workbenches. Each specimen identifies its toolbar, docks, inspector, viewport, capabilities, status, and responsive collapse order."],
  ["← Return to WWW, Docs, Specs, Benchmarks, and World", "← Return to the v2 reference"],
  ["Experimental v2 tool contract · Hara visual language", "Hara v2 workbench reference"],
  ["Document reference", "V2 reference"],
  ["Hara v2 graphics reference: six original 4K raster backgrounds, four 4K raster textures, six material atmospheres, and six live WebGL shaders.", "Hara v2 graphics reference: six 4K raster backgrounds, four 4K raster textures, six material atmospheres, and six WebGL shader fields."],
  ["Monumental painterly-industrial raster backgrounds, tactile 4K materials, and live shader fields within the Hara identity.", "Raster backgrounds, material textures, and WebGL fields with documented fallbacks, motion, and theme behaviour."],
  ["Cinematic raster material layer · Version 2", "Raster and shader reference · Version 2"],
  ["Ten real image assets combine monumental spatial pressure, dry mineral atmosphere, painterly industrial texture, weathered machinery, and restrained functional signal. The masters are delivered as high-resolution WebP files for heroes, editor canvases, covers, documentation, and long-running tools.", "The reference contains six 4096 × 2304 WebP backgrounds and four 4096 × 4096 material textures for page headers, editor canvases, covers, documentation, fallbacks, and long-running tools."],
  ["Wide cinematic WebP masters for heroes, application surfaces, and editorial imagery.", "Wide WebP masters for page headers, application surfaces, and documentation imagery."],
  ["Raster imagery carries meaning. Motion deepens it.", "Raster imagery remains primary; motion is optional."],
  ["Benchmark, compatibility and runtime evidence patterns for Hara products.", "Benchmark, compatibility, and runtime evidence patterns for Hara sites and tools."],
  ["Hara sites and tools need one accessible visual grammar for benchmark evidence, package compatibility and runtime observations. The guide keeps scales, units, baselines, confidence, source revision and methodology visible while products retain authority over the underlying facts.", "The guide records accessible patterns for benchmark evidence, package compatibility, and runtime observations. Scales, units, baselines, confidence, source revision, and methodology remain visible while each source system retains authority over its facts."],
  ["A shared diagram grammar for Hara products, documentation and operational surfaces.", "A shared diagram grammar for Hara sites, documentation, and operational surfaces."],
  ["Hara sites and tools need one visual grammar for architecture, runtime flow, sequence, lifecycle and package relationships. The guide combines direction, line style, symbols and words, then pairs every visual with an equivalent relation list, event table, transition table or adjacency table.", "The guide records a shared grammar for architecture, runtime flow, sequence, lifecycle, and package relationships. Every visual is paired with an equivalent relation list, event table, transition table, or adjacency table."],

  // Route icon and symbol terminology.
  ["Hara v2 iconography and route glyphs", "Hara v2 iconography and route glyphs"],
  ["Original Hara geometry for interface controls, evidence states, runtime capabilities and the six route families.", "Original Hara geometry for interface controls, evidence states, runtime capabilities, and six public route families."],
  ["A stable, accessible symbol language for Hara routes and tools.", "A stable, accessible symbol language for Hara routes and tools."],
  ["Iconography and route glyph guide", "Iconography and route glyph guide"],
  ["A symbol language for every Hara surface.", "Symbols for Hara actions, states, capabilities, evidence, and routes."],
  ["Interface icons describe navigation and commands. State symbols reinforce written evidence. Capability glyphs identify runtime boundaries. Route glyphs distinguish WWW, Playground, Specs, Packages, World and Learn without borrowing another system’s visual vocabulary.", "Interface icons identify navigation and commands. State symbols accompany written evidence. Capability glyphs identify runtime boundaries. Route glyphs distinguish WWW, Playground, Specifications, Packages, World, and Learn."],
  ["Compare route family", "Compare route glyphs"],
  ["Hara route glyph family", "Hara route glyph family"],
  ["Hara v2 iconography and route/capability glyph guide", "Hara v2 iconography and route/capability glyph guide"],
  ["The Hara v2 semantic iconography and capability-symbol guide: stable names, optical sizing, currentColor SVG, accessibility, route use and authority boundaries.", "The Hara v2 semantic symbol guide: stable names, optical sizing, currentColor SVG, accessibility, route use, and authority boundaries."],
  ["Navigation, action, state, capability, route and evidence symbols with explicit text and authority boundaries.", "Navigation, action, state, capability, route, and evidence symbols with explicit text and authority boundaries."],
  ["A shared semantic symbol contract for Hara routes, tools and documentation.", "A shared semantic symbol contract for Hara routes, tools, and documentation."],
  ["Hara symbols identify navigation, commands, state, runtime capabilities, routes and evidence. They stay monochrome by default, inherit current colour, and keep unfamiliar, destructive, capability and authority meaning supported by ordinary text.", "Hara symbols identify navigation, commands, state, runtime capabilities, routes, and evidence. They remain monochrome by default, inherit current colour, and keep unfamiliar, destructive, capability, and authority meanings supported by text."],
  ["Review route compositions", "Review route compositions"],
  ["Applications retain behaviour", "Applications retain behaviour"],
  ["Large illustrations should compose symbols with labels and evidence rather than stretching a compact control glyph into a route logo.", "Large illustrations should compose symbols with labels and evidence rather than stretching a compact control glyph into a route mark."],
  ["A glyph cannot silently acquire a second job.", "Each symbol has one recorded semantic role."],
  ["Every symbol has a stable family-prefixed identifier, label, usage boundary and text rule. Select a specimen to inspect the exact public metadata; the product still decides whether that command, capability or state actually exists.", "Every symbol has a stable family-prefixed identifier, label, usage boundary, and text rule. Select a specimen to inspect its public metadata; the application still decides whether a command, capability, or state exists."],
  ["Symbols reinforce the route contract; they do not replace it.", "Symbols accompany route labels and state; they do not replace them."],
  ["These compositions use realistic Hara actions, capabilities, states, routes and evidence. The visible words remain authoritative for the reader, while products continue to own commands, permissions, lifecycle, data and moderation.", "These compositions use realistic Hara actions, capabilities, states, routes, and evidence. Visible text remains authoritative, while applications retain commands, permissions, lifecycle, data, and moderation."],

  // Earlier v2 catalogue phrases retained in components or support data.
  ["language proposition", "language overview"],
  ["product-discovery", "repository-guided"],
  ["focused product references", "focused route references"],
  ["Application reference", "Application reference"]
];

const bannedPhrases = [
  "Precision, with room to breathe",
  "language proposition",
  "product-discovery",
  "focused product laboratories",
  "Get a living thing back",
  "Find the exact thing you can trust",
  "Application laboratory",
  "Application buildout",
  "Focused product study",
  "product laboratory",
  "The interface before the interface",
  "The reusable parts, with their boundaries intact",
  "Precision tools, made calm",
  "Technology with scale, grain, and consequence",
  "One catalogue. Many products",
  "One language · two focused products"
];

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(target));
    else if (extensions.has(path.extname(entry.name))) files.push(target);
  }
  return files;
}

const rootMarkdownFiles = (await fs.readdir(root, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && !["AGENTS.md", "V2-EDITORIAL.md"].includes(entry.name))
  .map((entry) => path.join(root, entry.name));
const files = [...(await Promise.all(sourceRoots.map(walk))).flat(), ...rootMarkdownFiles]
  .filter((file) => !file.endsWith("v2-editorial.test.mjs"));
let changedFiles = 0;
let replacementCount = 0;

if (apply) {
  for (const file of files) {
    const source = await fs.readFile(file, "utf8");
    let next = source;
    let fileCount = 0;
    for (const [from, to] of replacements) {
      if (from === to || !next.includes(from)) continue;
      const count = next.split(from).length - 1;
      next = next.split(from).join(to);
      fileCount += count;
    }
    if (next !== source) {
      await fs.writeFile(file, next);
      changedFiles += 1;
      replacementCount += fileCount;
      console.log(`updated ${path.relative(root, file)} (${fileCount} replacements)`);
    }
  }
}

const violations = [];
for (const file of files.filter((file) => !file.includes(`${path.sep}test${path.sep}`))) {
  const source = await fs.readFile(file, "utf8");
  for (const phrase of bannedPhrases) {
    if (!source.includes(phrase)) continue;
    const lines = source.split("\n");
    lines.forEach((line, index) => {
      if (line.includes(phrase)) violations.push(`${path.relative(root, file)}:${index + 1}: ${phrase}`);
    });
  }
}

if (apply) console.log(`editorial migration: ${replacementCount} replacements across ${changedFiles} files`);
else console.log(`editorial audit: ${files.length} public source files checked`);

if (violations.length > 0) {
  console.error("Promotional phrases remain in public source:");
  for (const violation of violations) console.error(`- ${violation}`);
  process.exitCode = 1;
} else {
  console.log("editorial audit: no banned promotional phrases remain");
}

import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

test("the agent-first Start route covers the point-read-choose-change-grow journey", async () => {
  const [page, handoff, habitat] = await Promise.all([
    read("../site/src/pages/v2/start/index.astro"),
    read("../site/src/components/v2-start/AgentHandoff.astro"),
    read("../site/src/components/v2-start/HabitatWorkbench.astro")
  ]);
  const journey = `${page}\n${handoff}\n${habitat}`;

  for (const id of ["handoff", "scan", "choose", "habitat", "graduate"])
    assert.match(journey, new RegExp(`id=\\"${id}\\"`), `missing ${id} Start screen`);

  for (const phrase of [
    "Point your agent at Hara. Leave with a living system",
    "Show the evidence behind the recommendation",
    "What do you want to happen",
    "Hara Habitat: change a living rule",
    "Turn the toy into a tool"
  ]) assert.match(journey, new RegExp(escape(phrase)));
});

test("the copied agent brief is outcome-first and evidence fenced", async () => {
  const [page, handoff] = await Promise.all([
    read("../site/src/pages/v2/start/index.astro"),
    read("../site/src/components/v2-start/AgentHandoff.astro")
  ]);

  assert.match(page, /https:\/\/github\.com\/hara-lang\/hara/);
  assert.match(page, /Do not begin with language history, installation, runtime architecture, or a generic tutorial/);
  assert.match(page, /What would you like to see move, automate, inspect, transform, or publish/);
  assert.match(page, /Never invent a capability, command, runtime, package, or example/);
  assert.match(handoff, /data-copy-agent-prompt/);
  assert.match(handoff, /Repository evidence only/);
  assert.match(handoff, /BUILD_WITH_HARA\.md/);
});

test("the scan distinguishes present repository evidence from proposed discovery product work", async () => {
  const page = await read("../site/src/pages/v2/start/index.astro");

  for (const current of ["README.md", "GETTING_STARTED.md", "AGENTS.md", "core/lib/examples"])
    assert.match(page, new RegExp(escape(current)));

  for (const proposed of ["BUILD_WITH_HARA.md", "examples/catalog.edn", "hara discover --json"])
    assert.match(page, new RegExp(escape(proposed)));

  assert.match(page, /data-scan-state="found"/);
  assert.match(page, /data-scan-state="proposed"/);
  assert.match(page, /Hara evaluator not attached/);
});

test("the chooser returns concrete outcome-shaped project recommendations", async () => {
  const page = await read("../site/src/pages/v2/start/index.astro");

  for (const intent of ["move", "automate", "inspect", "transform", "publish"])
    assert.match(page, new RegExp(`data-start-intent=\\"${intent}\\"`));

  for (const project of [
    "Hara Habitat",
    "Work receipt runner",
    "Live state inspector",
    "Migration ledger",
    "Verified package starter"
  ]) assert.match(page, new RegExp(escape(project)));

  assert.match(page, /renderIntent/);
  assert.match(page, /Interactive prototype/);
  assert.match(page, /Catalogue candidate/);
});

test("Habitat composes the v2 environment contract without inventing a 3D provider", async () => {
  const specimen = await read("../site/src/components/v2-start/HabitatWorkbench.astro");

  assert.match(specimen, /EnvironmentWorkbench/);
  for (const slot of ["nav", "frontmatter", "graphics", "code", "commands", "sessions", "files", "canvas", "overlay", "status"])
    assert.match(specimen, new RegExp(`slot=\\"${slot}\\"`), `missing ${slot} environment slot`);

  assert.doesNotMatch(specimen, /slot="threeD"/);
  assert.match(specimen, /3D, audio, network, persistence/);
  assert.match(specimen, /Visual prototype host/);
  assert.match(specimen, /Hara evaluation<\/dt><dd>Not connected/);
});

test("Habitat provides a functional visible mutation loop with generation and revision fencing", async () => {
  const specimen = await read("../site/src/components/v2-start/HabitatWorkbench.astro");

  for (const contract of [
    "data-habitat-canvas",
    "data-habitat-source",
    "data-habitat-apply-source",
    "data-habitat-fear-range",
    "data-habitat-receipt",
    "data-habitat-status-generation"
  ]) assert.match(specimen, new RegExp(contract));

  assert.match(specimen, /setFearRadius/);
  assert.match(specimen, /world\.revision \+= 1/);
  assert.match(specimen, /world\.generation \+= 1/);
  assert.match(specimen, /:fear-radius\\s\+\\d\+/);
  assert.match(specimen, /requestAnimationFrame\(frame\)/);
  assert.match(specimen, /ResizeObserver/);
  assert.match(specimen, /prefersReducedMotion/);
  assert.match(specimen, /Moths begin evasive movement farther from the bat/);
  assert.match(specimen, /scrollIntoView/);
  assert.match(specimen, /role="img"/);
  assert.doesNotMatch(specimen, /\beval\s*\(/);
});

test("Start styling is responsive, motion-aware, and consumes rather than redefines Hara tokens", async () => {
  const css = await read("../site/src/styles/v2-start.css");

  for (const selector of [
    ".start-agent-brief",
    ".start-repository-scan",
    ".start-intent-switcher",
    ".habitat-graphics",
    ".habitat-receipt",
    ".start-capability-ladder"
  ]) assert.match(css, new RegExp(escape(selector)));

  assert.match(css, /:focus-visible/);
  assert.match(css, /@media \(max-width: 820px\)/);
  assert.match(css, /@media \(max-width: 620px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /--hara-[A-Za-z0-9_-]+\s*:/);
});

test("Start is a first-class catalogue route and uses the shared scalable header", async () => {
  const [page, catalogue] = await Promise.all([
    read("../site/src/pages/v2/start/index.astro"),
    read("../site/src/lib/v2-catalogue.mjs")
  ]);

  assert.match(page, /import CatalogueHeader/);
  assert.match(page, /<CatalogueHeader basePath=\{basePath\} activePath="\/v2\/start\/"/);
  assert.doesNotMatch(page, /<header class="v2-lab-header">/);
  assert.match(catalogue, /id: "start"[\s\S]*href: "\/v2\/start\/"[\s\S]*status: "active"/);
  await access(new URL("../site/src/pages/v2/start/index.astro", import.meta.url));
});

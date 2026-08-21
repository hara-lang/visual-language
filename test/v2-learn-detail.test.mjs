import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  conceptGraph,
  courseFixture,
  courseUnitsByState,
  experienceEntrances,
  filterTracks,
  learnContentTypes,
  learnerStates,
  learnFixtureNotice,
  learnSummary,
  lessonFixture,
  outcomeTracks,
  practiceScenario,
  practiceScenarios,
  progressFixture,
  projectFixture,
  recommendedNextUnit,
  teachingFixture
} from "../site/src/lib/v2-learn.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFile(resolve(root, path), "utf8");
const pagePath = "site/src/pages/v2/learn/index.astro";
const componentPaths = [
  "site/src/components/v2-learn/LearnLanding.astro",
  "site/src/components/v2-learn/LearnCourse.astro",
  "site/src/components/v2-learn/LearnLesson.astro",
  "site/src/components/v2-learn/LearnPractice.astro",
  "site/src/components/v2-learn/LearnProject.astro",
  "site/src/components/v2-learn/LearnProgress.astro",
  "site/src/components/v2-learn/LearnTeaching.astro"
];
const stylePaths = [
  "site/src/styles/v2-learn.css",
  "site/src/styles/v2-learn-base.css",
  "site/src/styles/v2-learn-curriculum.css",
  "site/src/styles/v2-learn-runtime.css",
  "site/src/styles/v2-learn-progress.css",
  "site/src/styles/v2-learn-responsive.css"
];

test("Learn fixture is explicit, deterministic, and consumes the complete hara.learn family", () => {
  assert.equal(learnFixtureNotice.productionData, false);
  assert.match(learnFixtureNotice.summary, /not a live learner record/i);
  assert.equal(learnFixtureNotice.sourceRevision.length, 16);
  assert.deepEqual(learnContentTypes.map(({ id }) => id), ["learn.lesson", "learn.concept", "learn.exercise", "learn.project", "learn.progress"]);
  assert.ok(learnContentTypes.every(({ version }) => version === "2.0.0"));
  assert.equal(learnSummary.contentTypes, learnContentTypes.length);
});

test("all three experience entrances and six outcome tracks are represented", () => {
  assert.deepEqual(experienceEntrances.map(({ id }) => id), ["new-programmer", "programmed-before", "lisp-experience"]);
  assert.deepEqual(outcomeTracks.map(({ id }) => id), ["web", "agents", "graphics", "games", "music", "language-tools"]);
  assert.deepEqual(new Set(outcomeTracks.map(({ status }) => status)), new Set(["available", "preview"]));
  assert.deepEqual(learnerStates.map(({ id }) => id), ["anonymous", "new-account", "returning"]);
  assert.match(learnerStates[0].summary, /without signing in/i);
});

test("track filtering is deterministic and outcome-led", () => {
  assert.deepEqual(filterTracks(""), outcomeTracks);
  assert.deepEqual(filterTracks("agent").map(({ id }) => id), ["agents"]);
  assert.deepEqual(filterTracks("source").map(({ id }) => id), ["graphics", "language-tools"]);
  assert.deepEqual(filterTracks("preview").map(({ id }) => id), ["games", "music"]);
});

test("course graph exposes exact revision and complete, current, locked, and optional units", () => {
  assert.match(courseFixture.exactRevision, /^[a-f0-9]{16}$/);
  assert.match(courseFixture.downloadableManifest, /^hara:learn:/);
  assert.deepEqual(new Set(courseFixture.units.map(({ state }) => state)), new Set(["complete", "current", "locked", "optional"]));
  assert.equal(courseUnitsByState("complete").length, 3);
  assert.equal(recommendedNextUnit()?.id, "namespaces");
  assert.equal(conceptGraph.nodes.length, conceptGraph.edges.length + 1);
  assert.ok(conceptGraph.nodes.some(({ state }) => state === "optional"));
});

test("lesson fixture keeps source, runtime, curriculum, objectives, glossary, and degraded states fenced", () => {
  assert.equal(lessonFixture.contentType, "learn.lesson");
  assert.equal(lessonFixture.schemaVersion, "2.0.0");
  assert.match(lessonFixture.runtime.sourceRevision, /^lesson-source:/);
  assert.equal(lessonFixture.runtime.capabilities.includes("observations"), true);
  assert.ok(lessonFixture.objectives.length >= 3);
  assert.ok(lessonFixture.glossary.length >= 3);
  assert.deepEqual(lessonFixture.degradedStates.map(({ id }) => id), ["stale-lesson", "runtime-unavailable"]);
});

test("practice distinguishes local and durable evidence without conflating unavailable with failure", () => {
  assert.deepEqual(practiceScenarios.map(({ state }) => state), ["initial", "checking", "failure", "local-pass", "server-verified", "version-changed", "runtime-unavailable"]);
  assert.equal(practiceScenario("local-pass").saveAllowed, true);
  assert.equal(practiceScenario("server-verified").receipt?.startsWith("completion:"), true);
  assert.equal(practiceScenario("runtime-unavailable").receipt, null);
  assert.equal(practiceScenario("runtime-unavailable").state === practiceScenario("failure").state, false);
  assert.equal(practiceScenario("unknown").state, "initial");
});

test("project reuses exact runtime, file, capability, milestone, and cross-product handoff facts", () => {
  assert.equal(projectFixture.contentType, "learn.project");
  assert.deepEqual(projectFixture.runtime.capabilities, ["eval", "files", "canvas", "observations"]);
  assert.ok(projectFixture.files.some(({ state }) => state === "changed"));
  assert.deepEqual(new Set(projectFixture.milestones.map(({ state }) => state)), new Set(["complete", "current", "locked"]));
  assert.ok(projectFixture.handoffs.includes("Open in Playground"));
  assert.ok(projectFixture.handoffs.includes("Discuss on World"));
  assert.match(projectFixture.boundary, /Learn owns milestones.*Playground owns execution.*World owns/i);
});

test("progress records meaningful revision-aware facts and explicitly excludes engagement mechanics", () => {
  assert.equal(progressFixture.contentType, "learn.progress");
  assert.equal(progressFixture.visibility, "private-by-default");
  assert.deepEqual(progressFixture.milestones.map(({ id }) => id), ["first-run", "first-change", "first-solved-problem", "first-project"]);
  assert.ok(progressFixture.pathProgress.every(({ revision }) => /^[a-f0-9]{8}$/.test(revision)));
  assert.deepEqual(progressFixture.excludedMechanics, ["XP", "leaderboards", "required streaks", "engagement penalties"]);
});

test("teaching separates author fields from controlled curriculum and progress facts", () => {
  assert.equal(teachingFixture.contentType, "learn.lesson");
  assert.ok(teachingFixture.authorFields.includes("learningObjectives"));
  assert.ok(teachingFixture.authorFields.includes("exerciseSpec"));
  assert.ok(teachingFixture.controlledFields.includes("conceptGraph"));
  assert.ok(teachingFixture.controlledFields.includes("progress"));
  assert.equal(new Set([...teachingFixture.authorFields, ...teachingFixture.controlledFields]).size, teachingFixture.authorFields.length + teachingFixture.controlledFields.length);
  assert.match(teachingFixture.migrationNotice.summary, /exact source, backend, capability/i);
});

test("the detailed page composes landing, course, lesson, practice, project, progress, teaching, World boundary, and adoption", async () => {
  const page = await read(pagePath);
  for (const component of ["LearnLanding", "LearnCourse", "LearnLesson", "LearnPractice", "LearnProject", "LearnProgress", "LearnTeaching"]) {
    assert.match(page, new RegExp(`import ${component} from`));
    assert.match(page, new RegExp(`<${component}(?:\\s|\\/|>)`));
  }
  const all = [page, ...(await Promise.all(componentPaths.map(read)))].join("\n");
  for (const id of ["start", "tracks", "course", "lesson", "practice", "project", "progress", "teaching", "world-examples", "adoption"]) assert.match(all, new RegExp(`id=\\"${id}\\"`));
  for (const type of learnContentTypes.map(({ id }) => id)) assert.match(page, new RegExp(type.replace(".", "\\.")));
  assert.match(all, /Application reference · Learn/);
  assert.match(all, /Learn by running something real/);
  assert.match(page, /Programmer onboarding/);
  assert.match(page, /Earlier community reader/);
  assert.match(page, /<WorldSpecimen\s*\/>/);
});

test("components reuse shared shells and the Playground environment contract without embedded style blocks", async () => {
  const sources = await Promise.all(componentPaths.map(read));
  assert.match(sources[1], /import Shell from/);
  assert.match(sources[2], /import Shell from/);
  assert.match(sources[3], /import Shell from/);
  assert.match(sources[5], /import Shell from/);
  assert.match(sources[4], /import EnvironmentWorkbench from/);
  assert.match(sources[4], /<EnvironmentWorkbench/);
  assert.match(sources[4], /slot="sessions"/);
  assert.match(sources[4], /slot="files"/);
  assert.match(sources[4], /slot="canvas"/);
  for (const source of sources) assert.doesNotMatch(source, /<style(?:\s|>)/i);
});

test("Run paths never focus an editor while explicit Edit owns mobile focus", async () => {
  const [landing, lesson, script] = await Promise.all([read(componentPaths[0]), read(componentPaths[2]), read("site/src/scripts/v2-learn.js")]);
  assert.doesNotMatch(landing, /autofocus/i);
  assert.doesNotMatch(lesson, /autofocus/i);
  assert.match(lesson, /data-lesson-run/);
  assert.match(lesson, /data-lesson-edit/);
  assert.match(lesson, /textarea rows="12" readonly data-lesson-editor/);
  const firstRunFunction = script.split("function initialiseFirstRun")[1].split("function initialiseEntrances")[0];
  const firstRunHandler = firstRunFunction.split('edit?.addEventListener')[0];
  assert.doesNotMatch(firstRunHandler, /\.focus\(/);
  const lessonFunction = script.split("function initialiseLesson")[1].split("function initialisePractice")[0];
  const lessonRunHandler = lessonFunction.split('edit?.addEventListener')[0];
  assert.doesNotMatch(lessonRunHandler, /\.focus\(/);
  assert.match(lessonFunction, /edit\?\.addEventListener\("click"[\s\S]*?editor\.focus\(\)/);
});

test("interaction script covers entrance selection, track filtering, practice states, project choice, and copy feedback", async () => {
  const script = await read("site/src/scripts/v2-learn.js");
  for (const marker of ["data-learn-entrance", "data-track-query", "data-course-unit", "data-understanding-choice", "data-practice-scenario", "data-practice-panel", "data-project-choice", "navigator.clipboard"]) assert.match(script, new RegExp(marker));
  assert.match(script, /render\("checking"\)/);
  assert.match(script, /render\("local-pass"\)/);
  assert.match(script, /export function initialiseLearn/);
});

test("Learn CSS provides focus, contained overflow, touch, responsive, and reduced-motion contracts without protected token redefinitions", async () => {
  const sources = await Promise.all(stylePaths.map(read));
  const css = sources.join("\n");
  assert.match(sources[0], /@import "\.\/v2-learn-base\.css"/);
  assert.match(sources[0], /@import "\.\/v2-learn-responsive\.css"/);
  for (const selector of [".learn-local-nav", ".learn-track-grid", ".learn-course-shell", ".learn-lesson-shell", ".learn-practice-shell", ".learn-project-workbench", ".learn-progress-shell", ".learn-teaching-layout", ".learn-world-boundary-grid", ".learn-adoption-grid"]) assert.match(css, new RegExp(selector.replace(".", "\\.")));
  assert.match(css, /:focus-visible/);
  assert.match(css, /overflow-x:\s*auto/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /@media \(max-width: 860px\)/);
  assert.match(css, /@media \(max-width: 620px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /--hara-[A-Za-z0-9_-]+\s*:/, "Learn CSS must consume, not redefine, protected Hara tokens");
});

test("adoption documentation names contracts, ownership, World separation, fixtures, and verification", async () => {
  await access(resolve(root, "V2-LEARN.md"));
  const document = await read("V2-LEARN.md");
  for (const phrase of ["hara.learn@2.0.0", "Progress is never authored as front matter", "Run must never focus the editor", "Runtime unavailable is not failure", "World popularity never unlocks Learn content", "Fixture contract", "Adoption checklist", "Verification contract", "learn.hara-lang.org"]) assert.match(document, new RegExp(phrase.replaceAll(".", "\\."), "i"));
});

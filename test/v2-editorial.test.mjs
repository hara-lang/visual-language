import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => readFile(path.join(root, relative), "utf8");

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(target));
    else if ([".astro", ".mjs"].includes(path.extname(entry.name))) files.push(target);
  }
  return files;
}

test("the editorial contract defines audience, terminology, status and review rules", async () => {
  const contract = await read("V2-EDITORIAL.md");

  assert.match(contract, /The site is not a sales surface\./);
  assert.match(contract, /Describe before evaluating/);
  assert.match(contract, /A Hara data structure that represents code or data/);
  assert.match(contract, /Implemented.*the route, component, example, or behaviour exists/s);
  assert.match(contract, /Run the example/);
  assert.match(contract, /the first paragraph describes the page rather than praising it/);
});

test("primary language and community routes begin with definitions or concrete boundaries", async () => {
  const expectations = new Map([
    ["site/src/pages/v2/index.astro", "Application pages are specimens for review; they are not product pitches."],
    ["site/src/pages/v2/www/index.astro", "Hara is a programming language built from readable forms."],
    ["site/src/pages/v2/www/docs/index.astro", "Hara documentation is organised by the kind of answer required."],
    ["site/src/pages/v2/www/benchmarks/index.astro", "A benchmark result is meaningful only within its workload, method, and environment."],
    ["site/src/components/v2-learn/LearnLanding.astro", "Learn the language one form at a time."],
    ["site/src/components/v2-packages/PackagesDiscovery.astro", "Packages and namespaces are versioned registry records."],
    ["site/src/pages/v2/specs/index.astro", "A specification states what an implementation must, should, or may do."],
    ["site/src/pages/v2/playground/index.astro", "Run an exact Hara source revision in a named session."],
    ["site/src/pages/v2/start/index.astro", "Use an agent to inspect Hara before choosing an example."],
    ["site/src/pages/v2/world/index.astro", "World collects attributed articles, discussions, package changes, and external references."],
    ["site/src/pages/v2/world/discussion/index.astro", "Articles, discussions, and contributor records for Hara."],
    ["site/src/pages/v2/world/around/index.astro", "External Hara material retains its original source and authorship."]
  ]);

  for (const [file, phrase] of expectations) {
    const source = await read(file);
    assert.ok(source.includes(phrase), `${file} must include: ${phrase}`);
  }
});

test("public source excludes the retired promotional vocabulary", async () => {
  const roots = [
    path.join(root, "site", "src", "pages"),
    path.join(root, "site", "src", "components"),
    path.join(root, "site", "src", "lib")
  ];
  const files = (await Promise.all(roots.map(walk))).flat();
  const retired = [
    /\blaboratory\b/i,
    /Precision, with room to breathe/i,
    /language proposition/i,
    /product-discovery/i,
    /focused product laboratories/i,
    /Get a living thing back/i,
    /Find the exact thing you can trust/i,
    /Application buildout/i,
    /Focused product study/i,
    /product laboratory/i,
    /The interface before the interface/i,
    /The reusable parts, with their boundaries intact/i,
    /Precision tools, made calm/i,
    /Technology with scale, grain, and consequence/i,
    /One catalogue\. Many products/i,
    /One language · two focused products/i
  ];

  const violations = [];
  for (const file of files) {
    const source = await readFile(file, "utf8");
    for (const pattern of retired) {
      if (pattern.test(source)) violations.push(`${path.relative(root, file)}: ${pattern}`);
    }
  }

  assert.deepEqual(violations, []);
});

test("status labels are factual rather than promotional", async () => {
  const catalogue = await read("site/src/lib/v2-catalogue.mjs");

  assert.match(catalogue, /planned: "Planned"/);
  assert.match(catalogue, /active: "Implemented"/);
  assert.match(catalogue, /settled: "Reference"/);
  assert.match(catalogue, /historical: "Historical"/);
  assert.doesNotMatch(catalogue, /In the lab|Settled pattern|Design language/i);
});

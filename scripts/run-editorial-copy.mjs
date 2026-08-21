#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scripts = path.dirname(fileURLToPath(import.meta.url));
const migration = path.join(scripts, "editorial-copy.mjs");
let source = await fs.readFile(migration, "utf8");

// The migration is intentionally phrase-based. Do not replace the bare words
// `product` or `products`: they may occur in class names, fragment identifiers,
// and public symbol IDs whose CSS and runtime contracts must remain stable.
source = source
  .replace('  ["Products", "Routes"],\n', "")
  .replace('  ["products", "routes"],\n', "");

await fs.writeFile(migration, source);
process.argv.push("--apply");
await import(`${pathToFileURL(migration).href}?run=${Date.now()}`);

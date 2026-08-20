import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("theme and tool contracts link to the catalogue guide and written review procedure", async () => {
  const [theme, tool] = await Promise.all([
    read("../V2-THEME.md"),
    read("../V2-TOOL.md")
  ]);

  for (const source of [theme, tool]) {
    assert.match(source, /v2\/guide\//);
    assert.match(source, /V2-GUIDE\.md/);
  }
});

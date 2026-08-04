import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const manifest = JSON.parse(readFileSync(new URL("../assets/og/manifest.json", import.meta.url), "utf8"));

function jpegDimensions(buffer) {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if ([0xc0, 0xc1, 0xc2, 0xc3].includes(marker)) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7)
      };
    }
    offset += 2 + length;
  }
  throw new Error("JPEG dimensions not found");
}

test("OG manifest exposes six semantic masters", () => {
  assert.equal(manifest.canvas, "3840 x 2016");
  assert.equal(manifest.aspectRatio, "40:21");
  assert.deepEqual(manifest.masters.map((master) => master.id), [
    "evaluation", "syntax", "workbench", "registry", "measure", "materials"
  ]);
});

test("every delivery card is a maximum-resolution 40:21 JPEG", () => {
  assert.equal(manifest.cards.length, 12);
  for (const card of manifest.cards) {
    const bytes = readFileSync(new URL(`../assets/og/cards/${card}.jpg`, import.meta.url));
    assert.deepEqual(jpegDimensions(bytes), { width: 3840, height: 2016 }, card);
  }
});

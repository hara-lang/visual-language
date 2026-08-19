import { access, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const rasterRoot = path.join(root, "assets", "cinematic", "raster");
const seedRoot = path.join(rasterRoot, "seeds");
const backgroundsDir = path.join(rasterRoot, "backgrounds");
const texturesDir = path.join(rasterRoot, "textures");

const backgrounds = [
  "monolith-gate",
  "desert-foundry",
  "nocturne-lattice",
  "reliquary-engine",
  "storm-archive",
  "ink-conduit"
];

const textures = [
  "silica-drift",
  "oxide-patina",
  "carbon-weave",
  "phase-glass"
];

async function isMaster(pathname, width, height) {
  if (process.env.FORCE_RASTER === "1") return false;
  try {
    await access(pathname);
    const metadata = await sharp(pathname).metadata();
    return metadata.width === width && metadata.height === height && metadata.format === "webp";
  } catch {
    return false;
  }
}

async function renderBackground(id) {
  const source = path.join(seedRoot, `${id}.webp`);
  const output = path.join(backgroundsDir, `${id}.webp`);
  if (await isMaster(output, 4096, 2304)) {
    console.log(`kept ${id} 4096x2304`);
    return;
  }

  await sharp(source)
    .resize(4096, 2304, { fit: "cover", kernel: "lanczos3" })
    .modulate({ saturation: 1.025, brightness: 1.005 })
    .webp({ quality: 82, effort: 0, smartSubsample: true })
    .toFile(output);

  console.log(`rendered ${id} 4096x2304`);
}

async function mirroredTextureSeed(source) {
  const original = await sharp(source).resize(512, 512, { fit: "cover", kernel: "lanczos3" }).toBuffer();
  const horizontal = await sharp(original).flop().toBuffer();
  const vertical = await sharp(original).flip().toBuffer();
  const both = await sharp(original).flip().flop().toBuffer();

  return sharp({ create: { width: 1024, height: 1024, channels: 3, background: "#111315" } })
    .composite([
      { input: original, left: 0, top: 0 },
      { input: horizontal, left: 512, top: 0 },
      { input: vertical, left: 0, top: 512 },
      { input: both, left: 512, top: 512 }
    ])
    .jpeg({ quality: 96, chromaSubsampling: "4:4:4" })
    .toBuffer();
}

async function renderTexture(id) {
  const source = path.join(seedRoot, `${id}.webp`);
  const output = path.join(texturesDir, `${id}.webp`);
  if (await isMaster(output, 4096, 4096)) {
    console.log(`kept ${id} 4096x4096`);
    return;
  }

  const tiled = await mirroredTextureSeed(source);
  await sharp(tiled)
    .resize(4096, 4096, { fit: "fill", kernel: "lanczos3" })
    .modulate({ saturation: 1.02, brightness: 1.0 })
    .webp({ quality: 84, effort: 0, smartSubsample: true })
    .toFile(output);

  console.log(`rendered ${id} 4096x4096`);
}

await mkdir(backgroundsDir, { recursive: true });
await mkdir(texturesDir, { recursive: true });

for (const id of backgrounds) await renderBackground(id);
for (const id of textures) await renderTexture(id);

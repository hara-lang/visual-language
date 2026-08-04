import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const width = 3840;
const height = 2016;

const cards = [
  {
    id: "hara",
    scene: "evaluation",
    eyebrow: "HARA LANGUAGE",
    title: ["Hara"],
    tagline: ["Simple to pick up.", "Fast enough to keep."],
    domain: "www.hara-lang.org"
  },
  {
    id: "docs",
    scene: "syntax",
    eyebrow: "HARA / DOCS",
    title: ["Learn Hara."],
    tagline: ["Build live, across every host."],
    domain: "www.hara-lang.org/docs"
  },
  {
    id: "playground",
    scene: "workbench",
    eyebrow: "HARA / PLAYGROUND",
    title: ["Work live."],
    tagline: ["Code, see, change, repeat."],
    domain: "playground.hara-lang.org"
  },
  {
    id: "specs",
    scene: "syntax",
    eyebrow: "HARA / SPECIFICATIONS",
    title: ["Executable", "standards."],
    tagline: ["Inspect. Verify. Conform."],
    domain: "specs.hara-lang.org"
  },
  {
    id: "packages",
    scene: "registry",
    eyebrow: "HARA / PACKAGES",
    title: ["Reviewed", "packages."],
    tagline: ["The reviewed registry for Hara."],
    domain: "packages.hara-lang.org"
  },
  {
    id: "api",
    scene: "registry",
    eyebrow: "HARA / REGISTRY API",
    title: ["Discovery,", "not authority."],
    tagline: ["Read-only access to verifiable sources."],
    domain: "api.hara-lang.org"
  },
  {
    id: "identity",
    scene: "registry",
    eyebrow: "HARA / PACKAGE IDENTITY",
    title: ["Trust you", "can inspect."],
    tagline: ["The public trust policy for Hara packages."],
    domain: "id.hara-lang.org"
  },
  {
    id: "status",
    scene: "measure",
    eyebrow: "HARA / STATUS",
    title: ["Public", "build health."],
    tagline: ["Live deployment and workflow health."],
    domain: "status.hara-lang.org"
  },
  {
    id: "benchmarks",
    scene: "measure",
    eyebrow: "HARA / BENCHMARKS",
    title: ["Measured", "in the open."],
    tagline: ["Reproducible performance evidence."],
    domain: "www.hara-lang.org/benchmarks"
  },
  {
    id: "ui",
    scene: "materials",
    eyebrow: "HARA / UI",
    title: ["One interface", "system."],
    tagline: ["Canonical components", "for every Hara surface."],
    domain: "ui.hara-lang.org"
  },
  {
    id: "cli",
    scene: "workbench",
    eyebrow: "HARA / CLI",
    title: ["Install Hara."],
    tagline: ["One command. Your choice of runtime."],
    domain: "cli.hara-lang.org"
  },
  {
    id: "visual-language",
    scene: "materials",
    eyebrow: "HARA / VISUAL LANGUAGE",
    title: ["Inspectable", "computation."],
    tagline: ["Precision materials. Calm agency."],
    domain: "hara-lang.github.io/visual-language"
  }
];

const xml = (value) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

const titleMarkup = (lines) => {
  const size = lines.length === 1 ? 254 : 218;
  const lineHeight = lines.length === 1 ? 268 : 224;
  const start = lines.length === 1 ? 980 : 890;
  return lines.map((line, index) =>
    `<text x="320" y="${start + index * lineHeight}" class="title" font-size="${size}">${xml(line)}</text>`
  ).join("\n");
};

const taglineMarkup = (lines, titleLines) => {
  const start = titleLines.length === 1 ? 1248 : 1420;
  return lines.map((line, index) =>
    `<text x="326" y="${start + index * 112}" class="tagline">${xml(line)}</text>`
  ).join("\n");
};

const overlay = (card) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#050608" stop-opacity="0.88"/>
      <stop offset="0.34" stop-color="#050608" stop-opacity="0.55"/>
      <stop offset="0.52" stop-color="#050608" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="signal" x1="92" y1="68" x2="420" y2="444" gradientUnits="userSpaceOnUse">
      <stop stop-color="#36F1DE"/>
      <stop offset="0.48" stop-color="#35A8FF"/>
      <stop offset="1" stop-color="#A23CFF"/>
    </linearGradient>
    <filter id="mark-shadow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="15" result="blur"/>
      <feFlood flood-color="#2F7CFF" flood-opacity="0.22" result="color"/>
      <feComposite in="color" in2="blur" operator="in" result="shadow"/>
      <feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <style>
      text { font-family: "Nimbus Sans", "DejaVu Sans", sans-serif; }
      .eyebrow { fill: #82D9E8; font-size: 54px; font-weight: 700; letter-spacing: 12px; }
      .title { fill: #F4F6F8; font-weight: 700; letter-spacing: -10px; }
      .tagline { fill: #C5CBD2; font-size: 84px; font-weight: 400; letter-spacing: -2px; }
      .domain { fill: #8C96A1; font-size: 45px; font-weight: 400; letter-spacing: 2px; }
    </style>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#shade)"/>
  <g transform="translate(306 228) scale(.49)" filter="url(#mark-shadow)">
    <path d="M104 72v112l304 180v76L104 260" fill="none" stroke="url(#signal)" stroke-width="36" stroke-linejoin="miter"/>
    <path d="M408 72v112L104 364v76l304-180" fill="none" stroke="url(#signal)" stroke-width="36" stroke-linejoin="miter"/>
  </g>
  <text x="320" y="646" class="eyebrow">${xml(card.eyebrow)}</text>
  ${titleMarkup(card.title)}
  ${taglineMarkup(card.tagline, card.title)}
  <rect x="320" y="1772" width="118" height="6" rx="3" fill="#27B8B0"/>
  <rect x="438" y="1772" width="118" height="6" rx="3" fill="#2F7CFF"/>
  <rect x="556" y="1772" width="118" height="6" rx="3" fill="#7957D5"/>
  <text x="320" y="1872" class="domain">${xml(card.domain)}</text>
</svg>`;

const outputDirectory = join(root, "assets", "og", "cards");
mkdirSync(outputDirectory, { recursive: true });
const temporaryDirectory = mkdtempSync(join(tmpdir(), "hara-og-"));
const runtimeDirectories = {
  config: join(temporaryDirectory, "config"),
  cache: join(temporaryDirectory, "cache"),
  data: join(temporaryDirectory, "data")
};
Object.values(runtimeDirectories).forEach((directory) => mkdirSync(directory, { recursive: true }));
const renderEnvironment = {
  ...process.env,
  XDG_CONFIG_HOME: runtimeDirectories.config,
  XDG_CACHE_HOME: runtimeDirectories.cache,
  XDG_DATA_HOME: runtimeDirectories.data
};

try {
  for (const card of cards) {
    const master = join(root, "assets", "og", "master", `${card.scene}.webp`);
    const svg = join(temporaryDirectory, `${card.id}.svg`);
    const renderedOverlay = join(temporaryDirectory, `${card.id}.png`);
    const output = join(outputDirectory, `${card.id}.jpg`);
    writeFileSync(svg, overlay(card));
    execFileSync("inkscape", [
      svg,
      "--export-type=png",
      `--export-filename=${renderedOverlay}`,
      `--export-width=${width}`,
      `--export-height=${height}`
    ], { stdio: "inherit", env: renderEnvironment });
    execFileSync("convert", [
      master,
      renderedOverlay,
      "-composite",
      "-sampling-factor", "4:2:0",
      "-interlace", "Plane",
      "-quality", "91",
      "-strip",
      output
    ], { stdio: "inherit" });
    process.stdout.write(`Built ${output}\n`);
  }
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}

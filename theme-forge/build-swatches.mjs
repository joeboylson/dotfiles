// Draws the palette as an SVG swatch sheet for the README. Self-contained: no
// web fonts, no scripts, so GitHub renders it as a plain image.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadPalette, slug } from "./resolve.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const { palette, c, ansi } = await loadPalette();

// The 16 terminal slots, laid out the way the Alacritty theme fills them:
// normal takes the ansi block, bright takes the syntax/status tones.
const normal = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"].map(
  (name) => [name, ansi[name]],
);
const bright = [
  ["black", ansi.brightBlack],
  ["red", c.deleted],
  ["green", c.added],
  ["yellow", c.modified],
  ["blue", c.info],
  ["magenta", c.number],
  ["cyan", c.func],
  ["white", ansi.brightWhite],
];

const sections = [
  ["Base", ["surface", "border", "fg", "fgMuted", "accent", "onAccent"].map((k) => [k, c[k]])],
  ["Syntax", ["comment", "string", "number", "keyword", "func", "type", "punctuation"].map((k) => [k, c[k]])],
  ["Status", ["added", "modified", "deleted", "error", "warning", "info"].map((k) => [k, c[k]])],
  ["ANSI normal", normal],
  ["ANSI bright", bright],
];

const PAD = 32;
const COLS = 8;
const GAP = 8;
const WIDTH = 760;
const CHIP_W = (WIDTH - PAD * 2 - GAP * (COLS - 1)) / COLS;
const CHIP_H = 44;
const PITCH = 112; // one section, top of heading to top of the next
const HEAD = 76; // room for the title above the first section

const font = `${palette.font.family}, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
const height = HEAD + sections.length * PITCH + PAD - 8;

const parts = sections.map(([title, items], s) => {
  const y = HEAD + s * PITCH;
  const chips = items
    .map(([name, hex], i) => {
      const x = PAD + i * (CHIP_W + GAP);
      return [
        // The hairline is what keeps a chip visible when it matches the sheet.
        `<rect x="${x}" y="${y + 14}" width="${CHIP_W}" height="${CHIP_H}" rx="4" fill="${hex}" stroke="${c.border}"/>`,
        `<text x="${x}" y="${y + 14 + CHIP_H + 16}" fill="${c.fg}" font-size="11">${name}</text>`,
        `<text x="${x}" y="${y + 14 + CHIP_H + 30}" fill="${c.fgMuted}" font-size="10">${hex}</text>`,
      ].join("\n  ");
    })
    .join("\n  ");
  return `<text x="${PAD}" y="${y + 4}" fill="${c.fgMuted}" font-size="11" letter-spacing="1">${title.toUpperCase()}</text>\n  ${chips}`;
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${height}" viewBox="0 0 ${WIDTH} ${height}" font-family="${font}" role="img" aria-label="${palette.name} color palette">
  <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${height - 1}" rx="8" fill="${c.surface}" stroke="${c.border}"/>
  <text x="${PAD}" y="${PAD + 12}" fill="${c.fg}" font-size="20" font-weight="500">${palette.name}</text>
  <text x="${WIDTH - PAD}" y="${PAD + 12}" fill="${c.accent}" font-size="11" text-anchor="end">${palette.type}</text>
  ${parts.join("\n  ")}
</svg>
`;

const out = path.join(ROOT, "dist/swatches", `${slug(palette.name)}.svg`);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, svg);
console.log(`built ${path.relative(ROOT, out)}`);

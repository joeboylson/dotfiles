// Expands the palette into a Ghostty theme file.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadPalette, slug } from "./resolve.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const { palette, c, ansi, flatten } = await loadPalette();

// Same 16 colors as the Alacritty build: normal gets the darker half of each
// gruvbox pair, bright gets the syntax/status tone.
const colors = [
  ansi.black, ansi.red, ansi.green, ansi.yellow,
  ansi.blue, ansi.magenta, ansi.cyan, ansi.white,
  ansi.brightBlack, c.deleted, c.added, c.modified,
  c.info, c.number, c.func, ansi.brightWhite,
];

const theme = `# ${palette.name} — generated from palette.mjs, do not edit by hand.
#
# Use from your ghostty config:
#   theme = light:slag-light,dark:slag

background = ${c.surface}
foreground = ${c.fg}

cursor-color = ${c.accent}
cursor-text = ${c.onAccent}

# Ghostty has no alpha per color, so the selection layer is composited down.
selection-background = ${flatten("accent/30")}
selection-foreground = cell-foreground

search-background = ${c.accent}
search-foreground = ${c.onAccent}
search-selected-background = ${c.modified}
search-selected-foreground = ${c.onAccent}

split-divider-color = ${flatten("fg/14")}

${colors.map((hex, i) => `palette = ${i}=${hex}`).join("\n")}
`;

const out = path.join(ROOT, "dist/ghostty", slug(palette.name));
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, theme);
console.log(`built ${path.relative(ROOT, out)}`);

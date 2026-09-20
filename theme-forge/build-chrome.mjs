// Expands the palette into a Chrome (and Chromium-family) theme.
//
// Chrome themes are unpacked extensions: a folder with a manifest.json. Colors
// are [r, g, b] arrays, and Chrome can't do partial alpha on most of them, so
// anything layered is composited down first.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadPalette, slug } from "./resolve.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const { palette, c, flatten } = await loadPalette();

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

// One surface for the whole frame, like every other target: the tab strip,
// toolbar and new-tab page are all the same gray, and only hairlines and the
// active tab's lift tell them apart.
const colors = {
  frame: rgb(c.surface),
  frame_inactive: rgb(c.surface),
  frame_incognito: rgb(c.surface),
  frame_incognito_inactive: rgb(c.surface),

  toolbar: rgb(flatten("fg/10")), // the selected tab and toolbar lift slightly
  tab_text: rgb(c.fg),
  tab_background_text: rgb(c.fgMuted),
  bookmark_text: rgb(c.fg),

  omnibox_background: rgb(c.surface),
  omnibox_text: rgb(c.fg),

  ntp_background: rgb(c.surface),
  ntp_text: rgb(c.fg),
  ntp_link: rgb(c.accent),
  ntp_section: rgb(c.border),
  ntp_section_text: rgb(c.fg),
  ntp_section_link: rgb(c.accent),

  button_background: [0, 0, 0, 0],
};

const manifest = {
  manifest_version: 3,
  name: palette.name,
  version: "0.1.0",
  description: "One gray, hard seams, and heat where it counts.",
  theme: {
    colors,
    // Toolbar icons default to dark gray, which vanishes on a dark frame. Push
    // their lightness up on dark; a light theme keeps Chrome's own icons.
    ...(palette.type === "dark" ? { tints: { buttons: [-1, -1, 0.85] } } : {}),
  },
};

const out = path.join(ROOT, "dist/chrome", slug(palette.name), "manifest.json");
fs.mkdirSync(path.dirname(out), { recursive: true });
// Keep each [r, g, b] on one line; the default pretty-print spends five.
const json = JSON.stringify(manifest, null, 2).replace(/\[([^\[\]{}"]*?)\]/g, (_, inner) =>
  `[${inner.split(",").map((n) => n.trim()).join(", ")}]`,
);
fs.writeFileSync(out, json + "\n");
console.log(`built ${path.relative(ROOT, out)}`);

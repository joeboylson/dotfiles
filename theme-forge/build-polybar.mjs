// Expands the palette into a Polybar [colors] section.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadPalette, slug } from "./resolve.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const { palette, c, ansi, color } = await loadPalette();

// The active workspace pill is orange, not the accent, so it stands apart from
// the amber highlights elsewhere. The palette has no orange role, so pick the
// ramp's orange by palette type: the bright one on dark, the faded one on light.
const workspace = palette.type === "light" ? c.warning : color("#fe8019");

// Polybar wants #AARRGGBB, alpha first — the opposite of the CSS order the
// rest of the palette uses.
const argb = (hex, alpha) => `#${alpha}${hex.slice(1)}`;

const ini = `; ${palette.name} — generated from palette.mjs, do not edit by hand.
;
; Include from your config.ini, before any [section]:
;   include-file = ~/.config/polybar/${slug(palette.name)}.ini

[colors]
background = ${argb(c.surface, "FF")}
background-alt = ${argb(c.border, "DD")}
foreground = ${c.fg}
foreground-alt = ${c.fgMuted}

; Active workspace and highlights, plus the text that sits on top of them.
primary = ${c.accent}
on-primary = ${c.onAccent}

; The active workspace pill. Text on it is the surface color, which clears
; contrast on both the bright orange (dark) and the faded one (light).
workspace = ${workspace}
on-workspace = ${c.surface}

; Warnings and urgent workspaces. Red is the only alarm color.
secondary = ${c.error}
alert = ${ansi.red}

border = ${c.border}

; Meters: volume and similar bars step through these, low to high.
ok = ${c.added}
warn = ${c.modified}
crit = ${c.deleted}

; The one non-status hue, for things that shouldn't read as good or bad.
accent-alt = ${c.number}
`;

const out = path.join(ROOT, "dist/polybar", `${slug(palette.name)}.ini`);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, ini);
console.log(`built ${path.relative(ROOT, out)}`);

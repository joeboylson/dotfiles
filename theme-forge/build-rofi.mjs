// Expands the palette into a Rofi theme. Colors and font only — the layout
// (centered, 600 wide, 15 rows, square-ish corners) is the launcher's own.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadPalette, slug } from "./resolve.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const { palette, c, flatten } = await loadPalette();

// A launcher is a floating panel, so it keeps a hair of see-through (0xf6)
// that a fully solid editor surface doesn't need. Rofi takes #rrggbbaa.
const window = `${c.surface}f6`;

// Rofi can't layer alpha, so the input bar's lift is composited down, the same
// way Alacritty's footer bar is.
const inputbar = flatten("fg/10");

const rasi = `/* ${palette.name} — generated from palette.mjs, do not edit by hand.
 *
 * Use from your config.rasi:
 *   @theme "~/.config/rofi/themes/${slug(palette.name)}.rasi"
 */

* {
    font:   "${palette.font.family} 10";

    bg0:     ${window};
    bg1:     ${inputbar};
    fg0:     ${c.fg};

    accent-color:     ${c.accent};
    on-accent-color:  ${c.onAccent};
    urgent-color:     ${c.error};

    background-color:   transparent;
    text-color:         @fg0;

    margin:     0;
    padding:    0;
    spacing:    0;
}

window {
    location:   center;
    width:      600;
    background-color:   @bg0;

    anchor: north;
    y-offset: -25%;

    border-radius: 4px;
}

inputbar {
    spacing:    8px;
    padding:    8px;

    background-color:   @bg1;
}

prompt, entry, element-icon, element-text {
    vertical-align: 0.5;
}

prompt {
    text-color: @accent-color;
}

textbox {
    padding:            8px;
    background-color:   @bg1;
}

listview {
    padding:    4px 0;
    lines:      15;
    columns:    1;
    spacing: 0px;
    fixed-height:   false;
}

element {
    padding:    4px 8px;
    spacing:    2px;
}

element normal normal {
    text-color: @fg0;
}

element normal urgent {
    text-color: @urgent-color;
}

element normal active {
    text-color: @accent-color;
}

element alternate active {
    text-color: @accent-color;
}

element selected {
    text-color: @on-accent-color;
}

element selected normal, element selected active {
    background-color:   @accent-color;
}

element selected urgent {
    background-color:   @urgent-color;
}

element-icon {
    size:   0.8em;
}

element-text {
    text-color: inherit;
}
`;

const out = path.join(ROOT, "dist/rofi", `${slug(palette.name)}.rasi`);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, rasi);
console.log(`built ${path.relative(ROOT, out)}`);

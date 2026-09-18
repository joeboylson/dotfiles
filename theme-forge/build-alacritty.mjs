// Expands the palette into an Alacritty color config.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadPalette, slug } from "./resolve.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const { palette, c, ansi, flatten } = await loadPalette();

// Alacritty has no alpha per color, so the selection layer is composited down.
const selection = flatten("accent/30");

const toml = `# ${palette.name} — generated from palette.mjs, do not edit by hand.
#
# Import from your alacritty.toml:
#   general.import = ["~/.config/alacritty/${slug(palette.name)}.toml"]

[colors.primary]
background = "${c.surface}"
foreground = "${c.fg}"
dim_foreground = "${c.fgMuted}"
bright_foreground = "${c.fg}"

[colors.cursor]
text = "${c.onAccent}"
cursor = "${c.accent}"

[colors.vi_mode_cursor]
text = "${c.surface}"
cursor = "${c.info}"

[colors.selection]
text = "CellForeground"
background = "${selection}"

[colors.search.matches]
foreground = "${c.onAccent}"
background = "${c.accent}"

[colors.search.focused_match]
foreground = "${c.onAccent}"
background = "${c.modified}"

[colors.footer_bar]
foreground = "${c.fg}"
background = "${flatten("fg/10")}"

[colors.hints.start]
foreground = "${c.onAccent}"
background = "${c.accent}"

[colors.hints.end]
foreground = "${c.fg}"
background = "${flatten("fg/14")}"

# The same 16 colors the editor terminal uses. Normal gets the darker half of
# each gruvbox pair, bright gets the syntax/status tone, so the two blocks are
# actually distinguishable — that split is what lets a program shade one hue.
[colors.normal]
black = "${ansi.black}"
red = "${ansi.red}"
green = "${ansi.green}"
yellow = "${ansi.yellow}"
blue = "${ansi.blue}"
magenta = "${ansi.magenta}"
cyan = "${ansi.cyan}"
white = "${ansi.white}"

[colors.bright]
black = "${ansi.brightBlack}"
red = "${c.deleted}"
green = "${c.added}"
yellow = "${c.modified}"
blue = "${c.info}"
magenta = "${c.number}"
cyan = "${c.func}"
white = "${ansi.brightWhite}"

# SGR 2. Alacritty only reaches for this block on an explicit dim, so it can
# track normal without costing anything elsewhere.
[colors.dim]
black = "${ansi.black}"
red = "${ansi.red}"
green = "${ansi.green}"
yellow = "${ansi.yellow}"
blue = "${ansi.blue}"
magenta = "${ansi.magenta}"
cyan = "${ansi.cyan}"
white = "${ansi.white}"
`;

const out = path.join(ROOT, "dist/alacritty", `${slug(palette.name)}.toml`);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, toml);
console.log(`built ${path.relative(ROOT, out)}`);

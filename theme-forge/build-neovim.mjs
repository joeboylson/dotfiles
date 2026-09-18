// Expands the palette into a Neovim colorscheme.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadPalette, slug } from "./resolve.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const { palette, c, ansi, flatten } = await loadPalette();

// Neovim takes solid colors only, so the layers get composited here the same
// way the terminal target does.
const L1 = flatten("fg/6"); // current line
const L2 = flatten("fg/10"); // visual selection, floats
const L3 = flatten("fg/14"); // selected row
const sel = flatten("accent/30");

const italic = palette.italicComments ? ", italic = true" : "";

const lua = `-- ${palette.name} — generated from palette.mjs, do not edit by hand.
--
-- Install:
--   cp ${slug(palette.name)}.lua ~/.config/nvim/colors/
--   :colorscheme ${slug(palette.name)}

vim.cmd("highlight clear")
if vim.fn.exists("syntax_on") == 1 then
  vim.cmd("syntax reset")
end

vim.o.background = "${palette.type}"
vim.o.termguicolors = true
vim.g.colors_name = "${slug(palette.name)}"

local c = {
  surface = "${c.surface}",
  border = "${c.border}",
  fg = "${c.fg}",
  muted = "${c.fgMuted}",
  accent = "${c.accent}",
  on_accent = "${c.onAccent}",

  comment = "${c.comment}",
  string = "${c.string}",
  number = "${c.number}",
  keyword = "${c.keyword}",
  func = "${c.func}",
  type = "${c.type}",
  punct = "${c.punctuation}",

  added = "${c.added}",
  modified = "${c.modified}",
  deleted = "${c.deleted}",
  error = "${c.error}",
  warning = "${c.warning}",
  info = "${c.info}",

  layer1 = "${L1}",
  layer2 = "${L2}",
  layer3 = "${L3}",
  selection = "${sel}",
}

local function hl(group, opts)
  vim.api.nvim_set_hl(0, group, opts)
end

-- Editor surface: one background everywhere, same as the editor theme.
hl("Normal", { fg = c.fg, bg = c.surface })
hl("NormalFloat", { fg = c.fg, bg = c.surface })
hl("FloatBorder", { fg = c.border, bg = c.surface })
hl("FloatTitle", { fg = c.accent, bg = c.surface })
hl("Cursor", { fg = c.on_accent, bg = c.accent })
hl("CursorLine", { bg = c.layer1 })
hl("CursorColumn", { bg = c.layer1 })
hl("CursorLineNr", { fg = c.fg, bold = true })
hl("LineNr", { fg = c.muted })
hl("SignColumn", { bg = c.surface })
hl("ColorColumn", { bg = c.layer1 })
hl("Visual", { bg = c.selection })
hl("VisualNOS", { bg = c.selection })
hl("Search", { fg = c.on_accent, bg = c.accent })
hl("IncSearch", { fg = c.on_accent, bg = c.modified })
hl("CurSearch", { fg = c.on_accent, bg = c.modified })
hl("MatchParen", { fg = c.accent, bold = true })
hl("Whitespace", { fg = c.border })
hl("NonText", { fg = c.border })
hl("EndOfBuffer", { fg = c.surface })
hl("Folded", { fg = c.muted, bg = c.layer1 })
hl("FoldColumn", { fg = c.muted, bg = c.surface })

-- Chrome: hairline seams, no second background.
hl("StatusLine", { fg = c.muted, bg = c.surface })
hl("StatusLineNC", { fg = c.muted, bg = c.surface })
hl("WinSeparator", { fg = c.border, bg = c.surface })
hl("VertSplit", { fg = c.border, bg = c.surface })
hl("TabLine", { fg = c.muted, bg = c.surface })
hl("TabLineSel", { fg = c.fg, bg = c.surface, bold = true })
hl("TabLineFill", { bg = c.surface })
hl("Title", { fg = c.fg, bold = true })
hl("Directory", { fg = c.accent })
hl("Pmenu", { fg = c.fg, bg = c.surface })
hl("PmenuSel", { fg = c.fg, bg = c.layer3 })
hl("PmenuSbar", { bg = c.surface })
hl("PmenuThumb", { bg = c.border })
hl("WildMenu", { fg = c.on_accent, bg = c.accent })
hl("QuickFixLine", { bg = c.layer2 })
hl("ModeMsg", { fg = c.accent, bold = true })
hl("MoreMsg", { fg = c.accent })
hl("Question", { fg = c.accent })
hl("ErrorMsg", { fg = c.error })
hl("WarningMsg", { fg = c.warning })

-- Syntax: the same seven roles the editor theme uses.
hl("Comment", { fg = c.comment${italic} })
hl("String", { fg = c.string })
hl("Character", { fg = c.string })
hl("Number", { fg = c.number })
hl("Float", { fg = c.number })
hl("Boolean", { fg = c.number })
hl("Constant", { fg = c.number })
hl("Keyword", { fg = c.keyword })
hl("Statement", { fg = c.keyword })
hl("Conditional", { fg = c.keyword })
hl("Repeat", { fg = c.keyword })
hl("Operator", { fg = c.punct })
hl("Delimiter", { fg = c.punct })
hl("Exception", { fg = c.keyword })
hl("PreProc", { fg = c.keyword })
hl("Include", { fg = c.keyword })
hl("Define", { fg = c.keyword })
hl("Macro", { fg = c.keyword })
hl("StorageClass", { fg = c.keyword })
hl("Structure", { fg = c.type })
hl("Typedef", { fg = c.type })
hl("Type", { fg = c.type })
hl("Function", { fg = c.func })
hl("Identifier", { fg = c.fg })
hl("Special", { fg = c.accent })
hl("SpecialKey", { fg = c.border })
hl("Todo", { fg = c.on_accent, bg = c.modified, bold = true })
hl("Error", { fg = c.error })
hl("Underlined", { fg = c.info, underline = true })

-- Treesitter
hl("@comment", { link = "Comment" })
hl("@string", { link = "String" })
hl("@number", { link = "Number" })
hl("@boolean", { link = "Boolean" })
hl("@keyword", { link = "Keyword" })
hl("@keyword.function", { link = "Keyword" })
hl("@keyword.return", { link = "Keyword" })
hl("@function", { link = "Function" })
hl("@function.call", { link = "Function" })
hl("@function.builtin", { link = "Function" })
hl("@method", { link = "Function" })
hl("@type", { link = "Type" })
hl("@type.builtin", { link = "Type" })
hl("@constructor", { link = "Type" })
hl("@variable", { fg = c.fg })
hl("@variable.builtin", { fg = c.fg })
hl("@parameter", { fg = c.fg })
hl("@property", { fg = c.fg })
hl("@field", { fg = c.fg })
hl("@punctuation.delimiter", { fg = c.punct })
hl("@punctuation.bracket", { fg = c.punct })
hl("@punctuation.special", { fg = c.punct })
hl("@operator", { fg = c.punct })
hl("@tag", { fg = c.keyword })
hl("@tag.attribute", { fg = c.keyword })
hl("@constant", { link = "Constant" })

-- Diagnostics
hl("DiagnosticError", { fg = c.error })
hl("DiagnosticWarn", { fg = c.warning })
hl("DiagnosticInfo", { fg = c.info })
hl("DiagnosticHint", { fg = c.muted })
hl("DiagnosticUnderlineError", { sp = c.error, undercurl = true })
hl("DiagnosticUnderlineWarn", { sp = c.warning, undercurl = true })
hl("DiagnosticUnderlineInfo", { sp = c.info, undercurl = true })
hl("DiagnosticUnderlineHint", { sp = c.muted, undercurl = true })

-- Diff and git
hl("DiffAdd", { fg = c.added, bg = c.layer1 })
hl("DiffChange", { fg = c.modified, bg = c.layer1 })
hl("DiffDelete", { fg = c.deleted, bg = c.layer1 })
hl("DiffText", { fg = c.modified, bg = c.layer2 })
hl("Added", { fg = c.added })
hl("Changed", { fg = c.modified })
hl("Removed", { fg = c.deleted })
hl("GitSignsAdd", { fg = c.added })
hl("GitSignsChange", { fg = c.modified })
hl("GitSignsDelete", { fg = c.deleted })

-- Built-in terminal gets the same 16 colors as Alacritty: 0-7 are the darker
-- half of each gruvbox pair, 8-15 the syntax/status tone.
vim.g.terminal_color_0 = "${ansi.black}"
vim.g.terminal_color_1 = "${ansi.red}"
vim.g.terminal_color_2 = "${ansi.green}"
vim.g.terminal_color_3 = "${ansi.yellow}"
vim.g.terminal_color_4 = "${ansi.blue}"
vim.g.terminal_color_5 = "${ansi.magenta}"
vim.g.terminal_color_6 = "${ansi.cyan}"
vim.g.terminal_color_7 = "${ansi.white}"
vim.g.terminal_color_8 = "${ansi.brightBlack}"
vim.g.terminal_color_9 = c.deleted
vim.g.terminal_color_10 = c.added
vim.g.terminal_color_11 = c.modified
vim.g.terminal_color_12 = c.info
vim.g.terminal_color_13 = c.number
vim.g.terminal_color_14 = c.func
vim.g.terminal_color_15 = "${ansi.brightWhite}"
`;

const out = path.join(ROOT, "dist/nvim/colors", `${slug(palette.name)}.lua`);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, lua);
console.log(`built ${path.relative(ROOT, out)}`);

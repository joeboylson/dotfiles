// Expands palette.mjs into the VS Code color theme JSON.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadPalette, slug } from "./resolve.mjs";
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const { palette, ramp, color, c, ansi } = await loadPalette();

// Depth comes from translucent layers of the foreground, not from a second
// gray. One surface color underneath all of it.
const L1 = color("fg/6"); // current line
const L2 = color("fg/10"); // hover
const L3 = color("fg/14"); // selected row

const colors = {
  // Editor
  "editor.background": c.surface,
  "editor.foreground": c.fg,
  "editorLineNumber.foreground": c.fgFaint,
  "editorLineNumber.activeForeground": c.fg,
  "editor.lineHighlightBackground": L1,
  "editor.selectionBackground": color("accent/30"),
  "editor.selectionHighlightBackground": color("accent/18"),
  "editor.wordHighlightBackground": color("accent/18"),
  "editor.findMatchBackground": color("accent/45"),
  "editor.findMatchHighlightBackground": color("accent/22"),
  "editorCursor.foreground": c.accent,
  "editorWhitespace.foreground": color("fg/16"),
  "editorIndentGuide.background1": color("fg/10"),
  "editorIndentGuide.activeBackground1": color("fg/25"),
  "editorBracketMatch.background": color("accent/22"),
  "editorBracketMatch.border": color("accent/0"),
  "editorRuler.foreground": c.border,
  "editorOverviewRuler.border": color("surface/0"),
  "editorGutter.addedBackground": c.added,
  "editorGutter.modifiedBackground": c.modified,
  "editorGutter.deletedBackground": c.deleted,
  "editorError.foreground": c.error,
  "editorWarning.foreground": c.warning,
  "editorInfo.foreground": c.info,

  // Diff
  "diffEditor.insertedTextBackground": color("added/12"),
  "diffEditor.removedTextBackground": color("deleted/12"),
  "diffEditor.border": c.border,

  // Workbench chrome — all one surface, with hairline seams so you can still
  // read where one pane ends and the next begins.
  "activityBar.background": c.surface,
  "activityBar.foreground": c.fg,
  "activityBar.inactiveForeground": c.fgFaint,
  "activityBar.border": c.border,
  "activityBarBadge.background": c.accent,
  "activityBarBadge.foreground": c.onAccent,

  "sideBar.background": c.surface,
  "sideBar.foreground": c.fgMuted,
  "sideBar.border": c.border,
  "sideBarTitle.foreground": c.fgFaint,
  "sideBarSectionHeader.background": color("surface/0"),
  "sideBarSectionHeader.foreground": c.fgMuted,
  "sideBarSectionHeader.border": c.border,

  "titleBar.activeBackground": c.surface,
  "titleBar.activeForeground": c.fgMuted,
  "titleBar.inactiveBackground": c.surface,
  "titleBar.inactiveForeground": c.fgFaint,
  "titleBar.border": c.border,

  "statusBar.background": c.surface,
  "statusBar.foreground": c.fgMuted,
  "statusBar.border": c.border,
  "statusBar.noFolderBackground": c.surface,
  "statusBar.debuggingBackground": c.accent,
  "statusBar.debuggingForeground": c.onAccent,
  "statusBarItem.remoteBackground": L2,
  "statusBarItem.remoteForeground": c.fg,
  "statusBarItem.hoverBackground": L2,

  // Tabs read as active by their accent edge, not by a different fill
  "tab.activeBackground": c.surface,
  "tab.activeForeground": c.fg,
  "tab.inactiveBackground": c.surface,
  "tab.inactiveForeground": c.fgFaint,
  "tab.border": c.border,
  "tab.activeBorder": color("surface/0"),
  "tab.activeBorderTop": c.accent,
  "tab.hoverBackground": L2,
  "editorGroupHeader.tabsBackground": c.surface,
  "editorGroupHeader.tabsBorder": c.border,
  "editorGroupHeader.noTabsBackground": c.surface,
  "editorGroup.border": c.border,
  "breadcrumb.background": c.surface,
  "breadcrumb.foreground": c.fgFaint,
  "breadcrumb.focusForeground": c.fg,

  "panel.background": c.surface,
  "panel.border": c.border,
  "panelTitle.activeForeground": c.fg,
  "panelTitle.inactiveForeground": c.fgFaint,
  "panelTitle.activeBorder": c.accent,
  "terminal.background": c.surface,
  "terminal.foreground": c.fg,
  "terminalCursor.foreground": c.accent,

  // Lists, inputs, popups
  "list.activeSelectionBackground": L3,
  "list.activeSelectionForeground": c.fg,
  "list.inactiveSelectionBackground": L2,
  "list.hoverBackground": L2,
  "list.focusBackground": L3,
  "list.highlightForeground": c.accent,
  "list.errorForeground": c.error,
  "list.warningForeground": c.warning,
  "tree.indentGuidesStroke": color("fg/14"),

  "input.background": L1,
  "input.foreground": c.fg,
  "input.border": c.border,
  "input.placeholderForeground": c.fgFaint,
  "inputOption.activeBorder": c.accent,
  "dropdown.background": c.surface,
  "dropdown.foreground": c.fg,
  "dropdown.border": c.border,

  "quickInput.background": c.surface,
  "quickInput.foreground": c.fg,
  "quickInputList.focusBackground": L3,
  "editorWidget.background": c.surface,
  "editorWidget.border": c.border,
  "editorSuggestWidget.background": c.surface,
  "editorSuggestWidget.border": c.border,
  "editorSuggestWidget.selectedBackground": L3,
  "editorHoverWidget.background": c.surface,
  "editorHoverWidget.border": c.border,
  "menu.background": c.surface,
  "menu.foreground": c.fg,
  "menu.selectionBackground": L3,
  "menu.border": c.border,
  "peekViewEditor.background": c.surface,
  "peekViewResult.background": c.surface,

  "button.background": c.accent,
  "button.foreground": c.onAccent,
  "button.hoverBackground": c.accent,
  "badge.background": c.accent,
  "badge.foreground": c.onAccent,
  "progressBar.background": c.accent,
  "focusBorder": c.accent,
  "contrastBorder": color("border/0"),
  "scrollbarSlider.background": color("fg/12"),
  "scrollbarSlider.hoverBackground": color("fg/20"),
  "scrollbarSlider.activeBackground": color("fg/28"),
  "widget.shadow": color("surface/0"),
  "textLink.foreground": c.info,
  "textLink.activeForeground": c.accent,

  // Git decorations reuse the status colors
  "gitDecoration.addedResourceForeground": c.added,
  "gitDecoration.modifiedResourceForeground": c.modified,
  "gitDecoration.deletedResourceForeground": c.deleted,
  "gitDecoration.untrackedResourceForeground": c.added,
  "gitDecoration.ignoredResourceForeground": c.fgFaint,
  "gitDecoration.conflictingResourceForeground": c.error,

  // Terminal ANSI, drawn from the same handful of colors. The plain slots take
  // the darker half of each gruvbox pair so they stay distinct from the bright
  // ones below.
  "terminal.ansiBlack": ansi.black,
  "terminal.ansiRed": ansi.red,
  "terminal.ansiGreen": ansi.green,
  "terminal.ansiYellow": ansi.yellow,
  "terminal.ansiBlue": ansi.blue,
  "terminal.ansiMagenta": ansi.magenta,
  "terminal.ansiCyan": ansi.cyan,
  "terminal.ansiWhite": ansi.white,
  "terminal.ansiBrightBlack": ansi.brightBlack,
  "terminal.ansiBrightRed": c.deleted,
  "terminal.ansiBrightGreen": c.added,
  "terminal.ansiBrightYellow": c.modified,
  "terminal.ansiBrightBlue": c.info,
  "terminal.ansiBrightMagenta": c.number,
  "terminal.ansiBrightCyan": c.func,
  "terminal.ansiBrightWhite": ansi.brightWhite,
};

const tokenColors = [
  {
    scope: ["comment", "punctuation.definition.comment"],
    settings: { foreground: c.comment, ...(palette.italicComments ? { fontStyle: "italic" } : {}) },
  },
  { scope: ["string", "constant.other.symbol", "markup.inline.raw"], settings: { foreground: c.string } },
  { scope: ["constant.numeric", "constant.language", "constant.character"], settings: { foreground: c.number } },
  {
    scope: ["keyword", "storage", "storage.type", "storage.modifier", "keyword.operator.new", "keyword.control"],
    settings: { foreground: c.keyword },
  },
  { scope: ["entity.name.function", "support.function", "meta.function-call"], settings: { foreground: c.func } },
  {
    scope: ["entity.name.type", "entity.name.class", "support.type", "support.class", "entity.other.inherited-class"],
    settings: { foreground: c.type },
  },
  {
    scope: ["punctuation", "meta.brace", "keyword.operator", "meta.delimiter"],
    settings: { foreground: c.punctuation },
  },
  { scope: ["variable", "variable.parameter", "variable.other", "meta.object-literal.key"], settings: { foreground: c.fg } },
  { scope: ["entity.name.tag", "entity.other.attribute-name"], settings: { foreground: c.keyword } },
  { scope: ["invalid", "invalid.illegal"], settings: { foreground: c.error } },
  { scope: ["markup.heading"], settings: { foreground: c.func, fontStyle: "bold" } },
  { scope: ["markup.bold"], settings: { fontStyle: "bold" } },
  { scope: ["markup.italic"], settings: { fontStyle: "italic" } },
  { scope: ["markup.inserted"], settings: { foreground: c.added } },
  { scope: ["markup.deleted"], settings: { foreground: c.deleted } },
];

const theme = {
  name: palette.name,
  type: palette.type,
  semanticHighlighting: true,
  colors,
  tokenColors,
};

const themeFile = `themes/${slug(palette.name)}-color-theme.json`;
fs.mkdirSync(path.join(ROOT, "theme/themes"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "theme", themeFile), JSON.stringify(theme, null, 2) + "\n");

const manifestPath = path.join(ROOT, "theme/package.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
manifest.contributes.themes = [
  { label: palette.name, uiTheme: palette.type === "light" ? "vs" : "vs-dark", path: `./${themeFile}` },
];
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

// The preview page reads the same generated values, so it can't drift.
fs.mkdirSync(path.join(ROOT, "preview"), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, "preview/theme.json"),
  JSON.stringify({ palette, ramp, resolved: c, colors, tokenColors }, null, 2) + "\n",
);

const used = new Set(Object.values(c).map((h) => h.toLowerCase()));
console.log(
  `built ${themeFile} — ${Object.keys(colors).length} ui keys from ` +
    `${Object.keys(c).length} source colors (${used.size}/${ramp.length} of the ramp)`,
);

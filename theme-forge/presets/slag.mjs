// The whole theme comes from this file. Everything else is generated.
//
// Rule: every color must be one of the `ramp` values below. The build fails
// if it isn't. To vary a color, use an alpha suffix ("accent/40" = 40%),
// or reference another entry by name instead of writing a new hex.

// Nothing outside this list is allowed anywhere in the theme.
//
// Two families, and only two. Gruvbox's grays and creams all lean brown
// (#928374, #a89984, #ebdbb2), so they're gone — surfaces and text run on a
// neutral scale instead, stepped to match the gruvbox lightness values they
// replaced. All the warmth in the theme now comes from syntax color, nothing
// else.
export const ramp = [
  // Neutral grayscale — surfaces, borders, and all text
  "#1f1f1f", "#282828", "#303030", "#393939", "#4a4a4a", "#5e5e5e", "#717171",
  "#9a9a9a", "#b0b0b0", "#c8c8c8", "#e4e4e4", "#f5f5f5",

  // Gruvbox hues — syntax and status only
  "#cc241d", "#fb4934", "#d65d0e", "#fe8019", "#d79921", "#fabd2f",
  "#98971a", "#b8bb26", "#689d6a", "#8ec07c", "#458588", "#83a598",
  "#b16286", "#d3869b",
];

export const palette = {
  name: "Slag",
  type: "dark", // "dark" or "light"

  base: {
    // One background gray, everywhere: editor, sidebar, activity bar, tabs,
    // panel, title bar, status bar, popups. Nothing is a second shade.
    surface: "#282828",

    // Hairlines only, never a fill.
    border: "#393939",

    fg: "#e4e4e4", // body text and plain code
    // One dim level, not two: #858585 and #9a9a9a sat 1.3:1 apart, which the
    // eye reads as the same gray. Everything secondary shares this now.
    fgMuted: "#9a9a9a", // labels, punctuation, comments, line numbers
    fgFaint: "fgMuted", // kept as a name so roles still read clearly

    accent: "#fabd2f", // cursor, focus ring, badges, active markers

    // What sits on top of accent (badge text, button labels). On a dark theme
    // that's the surface; a light theme needs something dark instead.
    onAccent: "surface",
  },

  // Seven roles cover normal code. Resist adding an eighth.
  syntax: {
    comment: "fgFaint",
    string: "#b8bb26",
    number: "#d3869b",
    keyword: "#fb4934",
    func: "#8ec07c",
    type: "#fabd2f",
    punctuation: "fgMuted",
  },

  // Reused for git decorations, diffs, squiggles, and badges.
  status: {
    added: "#b8bb26",
    modified: "#fabd2f",
    deleted: "#fb4934",
    error: "#fb4934",
    warning: "#fabd2f",
    info: "#83a598",
  },

  font: {
    family: "Geist Mono",
    size: 14,
    ligatures: false, // Geist Mono ships without programming ligatures
  },

  // The ANSI slots. Black and white are the neutrals; the six hues below are
  // the *normal* half of each pair. Gruvbox draws every hue twice, and syntax
  // and status both reach for the bright half, so without these the terminal
  // would hand out one tone per hue and programs that rank two shades of the
  // same color (tmux tabs, ls, diff) would have nothing to rank with.
  ansi: {
    black: "surface",
    brightBlack: "fgMuted",
    white: "fgMuted",
    brightWhite: "fg",

    red: "#cc241d",
    green: "#98971a",
    yellow: "#d79921",
    blue: "#458588",
    magenta: "#b16286",
    cyan: "#689d6a",
  },

  // Terminal gets the syntax + status colors, not a separate 16-color set.
  italicComments: true,
};

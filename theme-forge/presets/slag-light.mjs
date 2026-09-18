// Slag Light — the same structure inverted. One surface, hairline seams,
// heat on the accent. The hues are gruvbox's "faded" set, which is drawn for
// light backgrounds; the bright ones from the dark build wash out on paper.

export const ramp = [
  // Neutral grayscale, light end first — surfaces, edges, and all text
  "#ffffff", "#f7f7f7", "#f0f0f0", "#e6e6e6", "#d9d9d9", "#c4c4c4",
  "#a8a8a8", "#8a8a8a", "#666666", "#4a4a4a", "#2a2a2a", "#1a1a1a",

  // Gruvbox faded hues, darkened where they missed 4.5:1 on this surface.
  // Light is where contrast actually gets tight — the dark build had slack.
  "#9d0006", "#af3a03", "#b57614", "#8f5d0f", "#6b670d", "#36684a", "#076678", "#8f3f71",
];

export const palette = {
  name: "Slag Light",
  type: "light",

  base: {
    // One background gray, everywhere. Off-white rather than pure white so
    // the hairlines have something to sit against.
    surface: "#f0f0f0",

    border: "#d9d9d9",

    fg: "#2a2a2a", // body text and plain code
    fgMuted: "#666666", // labels, punctuation, comments, line numbers
    fgFaint: "fgMuted",

    accent: "#b57614", // cursor, focus ring, badges, active markers

    // Dark, because the accent is a mid-tone here — light text on it would
    // be unreadable.
    onAccent: "#1a1a1a",
  },

  syntax: {
    comment: "fgMuted",
    string: "#6b670d",
    number: "#8f3f71",
    keyword: "#9d0006",
    func: "#36684a",
    type: "#8f5d0f", // darker than accent; the accent tone fails as text
    punctuation: "fgMuted",
  },

  status: {
    added: "#6b670d",
    modified: "#b57614",
    deleted: "#9d0006",
    error: "#9d0006",
    warning: "#af3a03",
    info: "#076678",
  },

  // Inverted from the dark build: "black" is the darkest text, "white" the
  // palest gray that still reads.
  ansi: {
    black: "fg",
    brightBlack: "fgMuted",
    white: "#a8a8a8",
    brightWhite: "#c4c4c4",

    // The dark build splits each hue into a normal and a bright tone. Light
    // can't: the ramp is gruvbox's faded set, which has no second tone, and
    // the obvious direction to move (lighter) is the one that washes out on
    // this surface. So normal and bright stay the same color here until the
    // ramp grows a darker half that still clears 4.5:1.
    red: "deleted",
    green: "added",
    yellow: "modified",
    blue: "info",
    magenta: "number",
    cyan: "func",
  },

  font: {
    family: "Geist Mono",
    size: 14,
    ligatures: false,
  },

  italicComments: true,
};

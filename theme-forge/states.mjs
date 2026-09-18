// Each state: open some UI, then we screenshot it.
// `cmd` runs a command-palette command by its exact title.

export const states = [
  {
    name: "explorer-open",
    async run(vs) {
      await vs.cmd("View: Show Explorer");
      await vs.open("src/app.ts");
    },
  },
  {
    name: "search-open",
    async run(vs) {
      await vs.cmd("View: Show Search");
      await vs.type("function");
    },
  },
  {
    name: "source-control",
    async run(vs) {
      await vs.cmd(["View: Show Source Control", "Source Control: Focus on Changes View"]);
    },
  },
  {
    name: "terminal-open",
    async run(vs) {
      await vs.open("src/app.ts");
      await vs.cmd("View: Toggle Terminal");
    },
  },
  {
    name: "command-palette",
    async run(vs) {
      await vs.open("src/app.ts");
      await vs.press("F1");
    },
  },
  {
    name: "editor-markdown",
    async run(vs) {
      await vs.open("README.md");
    },
  },
  {
    name: "editor-json",
    async run(vs) {
      await vs.open("package.json");
    },
  },
  {
    // Dirty the buffer so the diff has something real to show. The workspace
    // is mounted read-only, so this never touches disk.
    name: "diff-view",
    async run(vs) {
      await vs.open("src/app.ts");
      await vs.press("Control+Home");
      await vs.type('const CHANGED = "edited but not saved";\n');
      await vs.cmd("File: Compare Active File with Saved");
      await vs.press("Escape");
    },
  },
];

// Assembles the shipped themes into a stow-ready tree under dist/dotfiles.
//
// Each top-level folder mirrors ~, so `stow -t ~ alacritty` from the dotfiles
// repo symlinks the files into place.
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { slug } from "./resolve.mjs";
import { renderIcon } from "./icon.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, "dist/dotfiles");

// Which palettes ship. Experiments stay out until they earn a place.
const SHIP = ["./presets/slag.mjs", "./presets/slag-light.mjs"];

const EXT_ID = "slag";
const PUBLISHER = "joeboylson";
const REPO = "https://github.com/joeboylson/dotfiles";
// The listing pulls images over the network, so they need absolute URLs —
// relative paths render as broken images on the marketplace.
const RAW = `https://raw.githubusercontent.com/joeboylson/dotfiles/main/vscode/.vscode/extensions/${EXT_ID}`;

// Which screenshots make the listing, in order. The rest stay in shots/.
const LISTING_SHOTS = [
  ["editor-json.png", "Editor"],
  ["diff-view.png", "Diffs"],
  ["terminal-open.png", "Integrated terminal"],
  ["ansi-colors.png", "Terminal colors"],
];
const EXT_DIR = path.join(OUT, "vscode/.vscode/extensions", EXT_ID);

await fsp.rm(OUT, { recursive: true, force: true });
for (const d of [
  path.join(OUT, "alacritty/.config/alacritty"),
  path.join(OUT, "nvim/.config/nvim/colors"),
  path.join(EXT_DIR, "themes"),
]) {
  await fsp.mkdir(d, { recursive: true });
}

const themes = [];
const shipped = [];
// Keyed by palette type, so the icon and banner can ask for the dark one.
const palettes = {};
let ramp = [];

for (const preset of SHIP) {
  const r = spawnSync(process.execPath, ["build.mjs"], {
    cwd: ROOT,
    env: { ...process.env, PALETTE: preset },
    encoding: "utf8",
  });
  if (r.status !== 0) {
    process.stderr.write(r.stderr || "");
    process.exit(r.status ?? 1);
  }

  const { palette, ramp: presetRamp } = await import(preset);
  palettes[palette.type] = palette;
  if (palette.type === "dark") ramp = presetRamp ?? [];
  const id = slug(palette.name);

  await fsp.copyFile(
    path.join(ROOT, "dist/alacritty", `${id}.toml`),
    path.join(OUT, "alacritty/.config/alacritty", `${id}.toml`),
  );
  await fsp.copyFile(
    path.join(ROOT, "dist/nvim/colors", `${id}.lua`),
    path.join(OUT, "nvim/.config/nvim/colors", `${id}.lua`),
  );

  const themeFile = `${id}-color-theme.json`;
  await fsp.copyFile(
    path.join(ROOT, "theme/themes", themeFile),
    path.join(EXT_DIR, "themes", themeFile),
  );

  themes.push({
    label: palette.name,
    uiTheme: palette.type === "light" ? "vs" : "vs-dark",
    path: `./themes/${themeFile}`,
  });

  shipped.push({ id, palette });
  console.log(`packaged ${palette.name}`);
}

const DESCRIPTION = "One gray, hard seams, and heat where it counts.";

// One extension contributing every shipped theme, rather than one each.
await fsp.writeFile(
  path.join(EXT_DIR, "package.json"),
  JSON.stringify(
    {
      name: EXT_ID,
      displayName: "Slag",
      description: DESCRIPTION,
      version: "0.1.0",
      publisher: PUBLISHER,
      license: "MIT",
      engines: { vscode: "^1.80.0" },
      categories: ["Themes"],
      keywords: ["theme", "color-theme", "dark", "light", "gruvbox", "minimal"],
      icon: "icon.png",
      // A dark chip behind the title, matching the theme's one background gray.
      galleryBanner: { color: palettes.dark.base.surface, theme: "dark" },
      repository: { type: "git", url: `${REPO}.git` },
      homepage: `${REPO}#slag-theme`,
      bugs: { url: `${REPO}/issues` },
      contributes: { themes },
    },
    null,
    2,
  ) + "\n",
);

// The listing page. Images must be absolute, so they point at the repo's raw
// URLs rather than the copies shipped inside the extension.
const shotTable = (id) =>
  LISTING_SHOTS.map(
    ([file, label]) => `### ${label}\n\n![${label} — ${id}](${RAW}/shots/${id}/${file})`,
  ).join("\n\n");

await fsp.writeFile(
  path.join(EXT_DIR, "README.md"),
  `# Slag

${DESCRIPTION}

One background gray everywhere — editor, sidebar, tabs, panel, status bar.
Nothing is a second shade. Borders are hairlines, never fills. All the warmth
comes from syntax color and nothing else.

Ships in dark and light:

${shipped.map((t) => `- **${t.palette.name}** (\`${t.palette.type}\`)`).join("\n")}

## Install

Open the Extensions view, search for **Slag**, then pick it from the theme
picker (\`Cmd+K Cmd+T\` / \`Ctrl+K Ctrl+T\`).

## Dark

${shotTable("slag")}

## Light

${shotTable("slag-light")}

## Also for your terminal and editor

The same palette is built for Alacritty and Neovim in the same repo:

- [Alacritty](${REPO}/tree/main/alacritty/.config/alacritty)
- [Neovim](${REPO}/tree/main/nvim/.config/nvim/colors)

## How it's built

Every color comes from one short list in a single palette file, and the build
fails if a color appears that isn't on it. Seven syntax roles cover normal
code. The themes here are generated — edit the palette, not these files.

## License

MIT © Joe Boylson
`,
);

await fsp.writeFile(
  path.join(EXT_DIR, "LICENSE"),
  `MIT License

Copyright (c) ${new Date().getFullYear()} Joe Boylson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`,
);

// The shots live in the repo for the listing; no need to ship them to users.
await fsp.writeFile(
  path.join(EXT_DIR, ".vscodeignore"),
  ["shots/**", ".vscodeignore", ""].join("\n"),
);

// Drawn from the palette so the icon can never drift from the theme.
const hot = ramp.find((c) => c === "#fe8019") ?? palettes.dark.base.accent;
await fsp.writeFile(
  path.join(EXT_DIR, "icon.png"),
  renderIcon({
    surface: palettes.dark.base.surface,
    border: "#4a4a4a",
    accent: palettes.dark.base.accent,
    hot,
  }),
);

for (const { id } of shipped) {
  await fsp.mkdir(path.join(EXT_DIR, "shots", id), { recursive: true });
  for (const [file] of LISTING_SHOTS) {
    const src = path.join(ROOT, "shots", id, file);
    if (fs.existsSync(src)) {
      await fsp.copyFile(src, path.join(EXT_DIR, "shots", id, file));
    } else {
      console.warn(`missing shot: shots/${id}/${file}`);
    }
  }
}

// Alacritty picks one at a time; leave a commented line to swap.
await fsp.writeFile(
  path.join(OUT, "alacritty/.config/alacritty/README.md"),
  `# Slag for Alacritty

Add one of these to your \`alacritty.toml\`:

\`\`\`toml
general.import = ["~/.config/alacritty/slag.toml"]
# general.import = ["~/.config/alacritty/slag-light.toml"]
\`\`\`

Generated from the theme project — edit the palette there, not these files.
`,
);

// Slack has no theme file to import — you paste four hex values into its
// settings — so the palette ships as a doc rather than a generated artifact.
// Written from the palettes so the numbers can't drift from the real theme.
const SLACK_SLOTS = [
  ["System navigation", "the sidebar, which is the one background gray", (p) => p.base.surface],
  ["Selected items", "the active channel, matching the editor's accent", (p) => p.base.accent],
  ["Presence indication", "the online dot, same green as a git addition", (p) => p.status.added],
  ["Notifications", "the unread badge, same red as a deletion", (p) => p.status.deleted],
];

await fsp.writeFile(
  path.join(ROOT, "SLACK.md"),
  `# Slag for Slack

Generated by \`package.mjs\` — edit the palette, not this file.

Slack only exposes four colors, so this is a hand-entered theme rather than
something you install. In Slack: **Preferences → Themes → Custom theme**, set
the color mode to match, then paste each value below.

Leave **Window gradient** off. It blends the background toward the accent,
which breaks the one-background-gray rule the rest of the theme runs on.

${shipped
  .map(
    ({ palette: pal }) => `## ${pal.name}

Set the color mode to **${pal.type === "light" ? "Light" : "Dark"}**.

| Slack setting | Color | What it is |
| ------------- | ----- | ---------- |
${SLACK_SLOTS.map(([label, note, pick]) => `| ${label} | \`${pick(pal)}\` | ${note} |`).join("\n")}`,
  )
  .join("\n\n")}
`,
);

console.log(`\nstow tree at ${path.relative(ROOT, OUT)}`);

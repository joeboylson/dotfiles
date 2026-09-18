# joeboylson_dotfiles

My **personal** dotfiles. Managed with [GNU Stow](https://www.gnu.org/software/stow/).
Works on **macOS** and **Linux**.

## Required packages

- **stow**
  - macOS: `brew install stow`
  - Debian/Ubuntu: `sudo apt install stow`
  - Fedora: `sudo dnf install stow`
  - Arch: `sudo pacman -S stow`

## Usage

Each top-level folder is a stow package that mirrors `~`, with one exception:
`theme-forge` is source, not dotfiles, so never stow it. Run stow from the repo
root with the target set to your home directory (portable across macOS/Linux):

```bash
stow -t ~ tmux      # symlink this package into ~
stow -t ~ -D tmux   # remove the symlinks
stow -t ~ -R tmux   # restow after changes
```

Use `--no-folding` for the `claude` package:

```bash
stow --no-folding -t ~ claude
```

Without it, stow links whole directories when it can, so `~/.claude/skills`
would become a single symlink into this repo and nothing else could add a skill
there. `--no-folding` makes stow create real directories and link each file, so
other repos can drop their own skills alongside these.

## Packages

| Package     | Links |
| ----------- | ----- |
| `tmux`      | `~/.tmux.conf` |
| `claude`    | `~/.claude/commands/`, `~/.claude/skills/slag-design-system/` |
| `alacritty` | `~/.config/alacritty/slag.toml`, `slag-light.toml` |
| `nvim`      | `~/.config/nvim/colors/slag.lua`, `slag-light.lua` |
| `vscode`    | `~/.vscode/extensions/slag/` |

`theme-forge` is not in this table on purpose — it is the palette source that
generates `alacritty`, `nvim` and `vscode`, and nothing in it belongs in `~`.

## Slag theme

`alacritty`, `nvim` and `vscode` all carry the same theme, in dark and light.
They are generated from a single palette in `theme-forge`, so never edit those
files by hand — the next build overwrites them. To change the theme:

```bash
cd theme-forge
$EDITOR presets/slag.mjs        # or palette.mjs, the default preset
node package.mjs                # writes theme-forge/dist/dotfiles
cp -R dist/dotfiles/* ..        # sync into the stow packages
```

`theme-forge/dist` and the other build output are gitignored; only the synced
copies in the stow packages are tracked.

After stowing:

- **Alacritty** — add to `alacritty.toml`:
  `general.import = ["~/.config/alacritty/slag.toml"]`
- **Neovim** — `:colorscheme slag` (or `slag-light`)
- **VS Code** — reload the window, then pick "Slag" in the theme picker

## Publishing the VS Code theme

Tagging is the whole release. CI packages the extension and pushes it to the
VS Code Marketplace and Open VSX:

```bash
git tag slag-v0.1.0 && git push origin slag-v0.1.0
```

The tag only triggers the run — `vscode/.vscode/extensions/slag/package.json`
holds the real version, and CI fails the release if the two disagree. Bump it in
`theme-forge/package.mjs`, regenerate, sync, commit, then tag.

To test the packaging without shipping, run the workflow manually from the
Actions tab; it builds the `.vsix` and attaches it as an artifact.

`VSCE_PAT` (Azure DevOps, Marketplace > Manage) is required. `OVSX_PAT`
(open-vsx.org) is optional — without it the release goes to the VS Code
Marketplace only, and Cursor and VSCodium users won't find the theme.

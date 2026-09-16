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

Each top-level folder is a stow package that mirrors `~`. Run stow from the repo
root with the target set to your home directory (portable across macOS/Linux):

```bash
stow -t ~ tmux      # symlink this package into ~
stow -t ~ -D tmux   # remove the symlinks
stow -t ~ -R tmux   # restow after changes
```

## Packages

| Package     | Links |
| ----------- | ----- |
| `tmux`      | `~/.tmux.conf` |
| `claude`    | `~/.claude/commands/` |
| `alacritty` | `~/.config/alacritty/slag.toml`, `slag-light.toml` |
| `nvim`      | `~/.config/nvim/colors/slag.lua`, `slag-light.lua` |
| `vscode`    | `~/.vscode/extensions/slag/` |

## Slag theme

`alacritty`, `nvim` and `vscode` all carry the same theme, in dark and light.
They are generated from a single palette — the source lives in
`~/@/1_Projects/misc/theme`, so edit the palette there and re-run `node
package.mjs`, rather than editing these files by hand.

After stowing:

- **Alacritty** — add to `alacritty.toml`:
  `general.import = ["~/.config/alacritty/slag.toml"]`
- **Neovim** — `:colorscheme slag` (or `slag-light`)
- **VS Code** — reload the window, then pick "Slag" in the theme picker

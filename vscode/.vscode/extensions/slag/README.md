# Slag

One gray, hard seams, and heat where it counts.

One background gray everywhere — editor, sidebar, tabs, panel, status bar.
Nothing is a second shade. Borders are hairlines, never fills. All the warmth
comes from syntax color and nothing else.

Ships in dark and light:

- **Slag** (`dark`)
- **Slag Light** (`light`)

## Install

Open the Extensions view, search for **Slag**, then pick it from the theme
picker (`Cmd+K Cmd+T` / `Ctrl+K Ctrl+T`).

## Dark

### Editor

![Editor — slag](https://raw.githubusercontent.com/joeboylson/dotfiles/main/vscode/.vscode/extensions/slag/shots/slag/editor-json.png)

### Diffs

![Diffs — slag](https://raw.githubusercontent.com/joeboylson/dotfiles/main/vscode/.vscode/extensions/slag/shots/slag/diff-view.png)

### Integrated terminal

![Integrated terminal — slag](https://raw.githubusercontent.com/joeboylson/dotfiles/main/vscode/.vscode/extensions/slag/shots/slag/terminal-open.png)

### Terminal colors

![Terminal colors — slag](https://raw.githubusercontent.com/joeboylson/dotfiles/main/vscode/.vscode/extensions/slag/shots/slag/ansi-colors.png)

## Light

### Editor

![Editor — slag-light](https://raw.githubusercontent.com/joeboylson/dotfiles/main/vscode/.vscode/extensions/slag/shots/slag-light/editor-json.png)

### Diffs

![Diffs — slag-light](https://raw.githubusercontent.com/joeboylson/dotfiles/main/vscode/.vscode/extensions/slag/shots/slag-light/diff-view.png)

### Integrated terminal

![Integrated terminal — slag-light](https://raw.githubusercontent.com/joeboylson/dotfiles/main/vscode/.vscode/extensions/slag/shots/slag-light/terminal-open.png)

### Terminal colors

![Terminal colors — slag-light](https://raw.githubusercontent.com/joeboylson/dotfiles/main/vscode/.vscode/extensions/slag/shots/slag-light/ansi-colors.png)

## Also for your terminal and editor

The same palette is built for Alacritty and Neovim in the same repo:

- [Alacritty](https://github.com/joeboylson/dotfiles/tree/main/alacritty/.config/alacritty)
- [Neovim](https://github.com/joeboylson/dotfiles/tree/main/nvim/.config/nvim/colors)

## How it's built

Every color comes from one short list in a single palette file, and the build
fails if a color appears that isn't on it. Seven syntax roles cover normal
code. The themes here are generated — edit the palette, not these files.

## License

MIT © Joe Boylson

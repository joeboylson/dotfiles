#!/usr/bin/env bash
# Screenshots Alacritty running the generated theme. Each state runs a command,
# waits for it to settle, then grabs the terminal window itself (not the whole
# screen) so there's no black padding around it.
set -euo pipefail

THEME_TOML=${THEME_TOML:-/conf-alacritty/${NAME:-slag}.toml}
NVIM_COLORS=${NVIM_COLORS:-/conf/nvim}
OUT_DIR=${OUT_DIR:-/shots}
NAME=${NAME:-slag}
FONT=${FONT:-Geist Mono}
FONT_SIZE=${FONT_SIZE:-13}

Xvfb :99 -screen 0 1800x1100x24 -nolisten tcp &
for _ in $(seq 1 50); do xdpyinfo -display :99 >/dev/null 2>&1 && break; sleep 0.1; done

mkdir -p "$OUT_DIR/$NAME"

# Neovim config that loads the generated colorscheme.
mkdir -p /root/.config/nvim
cp -r "$NVIM_COLORS" /root/.config/nvim/colors 2>/dev/null || true
cat > /root/.config/nvim/init.lua <<LUA
vim.opt.number = true
vim.opt.termguicolors = true
vim.opt.laststatus = 2
vim.opt.signcolumn = "yes"
vim.cmd("colorscheme $NAME")
LUA

shoot() {
  local state=$1 cols=$2 lines=$3 settle=$4
  shift 4

  alacritty \
    --config-file "$THEME_TOML" \
    -o "font.normal.family=\"$FONT\"" \
    -o "font.size=$FONT_SIZE" \
    -o "window.dimensions.columns=$cols" \
    -o "window.dimensions.lines=$lines" \
    -o "window.padding.x=14" \
    -o "window.padding.y=10" \
    -e "$@" &
  local pid=$!

  sleep "$settle"

  local win
  win=$(xdotool search --class Alacritty | head -1 || true)
  if [ -z "$win" ]; then
    echo "FAIL  $NAME/$state: no window"
    kill "$pid" 2>/dev/null || true
    return
  fi

  import -window "$win" "$OUT_DIR/$NAME/$state.png"
  echo "shot  $NAME/$state.png"

  kill "$pid" 2>/dev/null || true
  wait "$pid" 2>/dev/null || true
  sleep 0.4
}

# With no arguments every state runs; otherwise only the ones named.
wanted=("$@")
filter() {
  [ ${#wanted[@]} -eq 0 ] && return 0
  printf '%s\n' "${wanted[@]}" | grep -qx "$1"
}

# fastfetch exits the moment it's done, taking the window with it.
filter fastfetch && shoot fastfetch 110 30 4 bash -c 'fastfetch --logo-type small; sleep 60' 
filter ansi-colors && shoot ansi-colors 100 26 2.5 bash -c '
  printf "\n  ANSI 16\n\n"
  for i in $(seq 0 7);  do printf "  \033[4%sm      \033[0m" "$i"; done; printf "\n"
  for i in $(seq 0 7);  do printf "  \033[10%sm      \033[0m" "$i"; done; printf "\n\n"
  for i in $(seq 30 37); do printf "  \033[%sm normal \033[0m" "$i"; done; printf "\n"
  for i in $(seq 90 97); do printf "  \033[%sm bright \033[0m" "$i"; done; printf "\n\n"
  printf "  \033[1mbold\033[0m   \033[3mitalic\033[0m   \033[4munderline\033[0m   \033[7mreverse\033[0m   \033[2mdim\033[0m\n"
  sleep 60'
filter nvim && shoot nvim 120 34 4 nvim /src/app.ts
filter nvim-lua && shoot nvim-lua 120 34 4 nvim /root/.config/nvim/colors/"$NAME".lua
filter git-log && shoot git-log 110 28 3 bash -c '
  cd /src && git -c color.ui=always log --oneline --graph --decorate -12 2>/dev/null \
    || ls --color=always -la
  sleep 60'

echo done

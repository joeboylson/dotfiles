#!/bin/bash
# Claude Code statusline: model id, dir, context bar, 5h bar, weekly %.
input=$(cat)

MODEL_ID=$(echo "$input" | jq -r '.model.id // "?"')
DIR=$(echo "$input" | jq -r '.workspace.current_dir // "" | split("/") | last')
CTX=$(echo "$input" | jq -r '.context_window.used_percentage // 0 | floor')
FIVEH=$(echo "$input" | jq -r '.rate_limits.five_hour.used_percentage // 0 | floor')
WEEK=$(echo "$input" | jq -r '.rate_limits.seven_day.used_percentage // 0 | floor')
FIVEH_RESET=$(echo "$input" | jq -r '.rate_limits.five_hour.resets_at // 0 | floor')

RESET=$'\033[0m'

# format a unix-epoch reset time as a local clock time (e.g. "3:45pm")
reset_at() {
  [ "$1" -le 0 ] && { printf '—'; return; }
  # BSD date (macOS) takes -r for an epoch; GNU date wants -d @.
  date -r "$1" '+%-I:%M%p' 2>/dev/null || date -d "@$1" '+%-I:%M%p'
}

# pick a color for a percentage: green <70, yellow >=70, red >=90
color_for() {
  if [ "$1" -ge 90 ]; then printf '\033[31m'
  elif [ "$1" -ge 70 ]; then printf '\033[33m'
  else printf '\033[32m'; fi
}

# render a 10-cell bar for a percentage
bar_for() {
  local pct=$1 cells=10 filled empty out="" i=0
  filled=$((pct * cells / 100)); [ "$filled" -gt $cells ] && filled=$cells
  empty=$((cells - filled))
  while [ $i -lt $filled ]; do out="${out}▓"; i=$((i+1)); done
  i=0; while [ $i -lt $empty ]; do out="${out}░"; i=$((i+1)); done
  printf '%s' "$out"
}

CTX_SEG="$(color_for "$CTX")$(bar_for "$CTX") ${CTX}%${RESET}"
FIVEH_SEG="$(color_for "$FIVEH")$(bar_for "$FIVEH") ${FIVEH}%${RESET} (-> $(reset_at "$FIVEH_RESET"))"
WEEK_SEG="$(color_for "$WEEK")${WEEK}%${RESET}"

echo "$MODEL_ID | DIR: $DIR | CONTEXT: $CTX_SEG | 5H $FIVEH_SEG | WEEK: $WEEK_SEG"

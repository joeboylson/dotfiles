#!/usr/bin/env bash
# Build the image once, then shoot the theme. Pass state names to shoot a subset:
#   ./run.sh                 -> every state
#   ./run.sh explorer-open   -> just that one
set -euo pipefail
cd "$(dirname "$0")"

IMAGE=theme-shots
SCREEN=${SCREEN:-1600x1000x24}

docker build -q -t "$IMAGE" . >/dev/null

docker run --rm \
  -e "SCREEN=$SCREEN" \
  -v "$PWD/theme:/theme:ro" \
  -v "$PWD/workspace:/workspace:ro" \
  -v "$PWD/shots:/shots" \
  "$IMAGE" "$@"

echo
echo "Screenshots in ./shots"
find shots -name '*.png' | sort

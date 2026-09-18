#!/usr/bin/env bash
set -euo pipefail
Xvfb :99 -screen 0 "${SCREEN:-1600x1000x24}" -nolisten tcp &
for _ in $(seq 1 50); do xdpyinfo -display :99 >/dev/null 2>&1 && break; sleep 0.1; done
exec node shoot.mjs "$@"

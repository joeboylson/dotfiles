// Builds every target from the one palette.
import { spawnSync } from "node:child_process";

for (const target of ["build-theme.mjs", "build-alacritty.mjs", "build-neovim.mjs"]) {
  const r = spawnSync(process.execPath, [target], { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

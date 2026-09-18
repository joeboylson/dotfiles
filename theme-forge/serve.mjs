// Serves the preview page, rebuilds the theme whenever palette.mjs changes,
// and lists whatever screenshots are on disk.
import http from "node:http";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 4321);
let version = 0;

function build() {
  const r = spawnSync(process.execPath, ["build.mjs"], { cwd: ROOT, encoding: "utf8" });
  process.stdout.write(r.stdout || "");
  if (r.status !== 0) process.stderr.write(r.stderr || "");
  version++;
}

build();
// Debounced because editors fire several events per save.
let pending;
fs.watch(path.join(ROOT, "palette.mjs"), () => {
  clearTimeout(pending);
  pending = setTimeout(build, 120);
});
try {
  fs.watch(path.join(ROOT, "shots"), { recursive: true }, () => version++);
} catch {
  // No screenshots yet, or the platform won't watch recursively. The
  // Screenshots tab refetches on click either way.
}

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".css": "text/css", ".png": "image/png", ".svg": "image/svg+xml" };

async function listShots() {
  const out = {};
  for (const theme of await fsp.readdir(path.join(ROOT, "shots")).catch(() => [])) {
    const dir = path.join(ROOT, "shots", theme);
    if (!(await fsp.stat(dir)).isDirectory()) continue;
    const files = (await fsp.readdir(dir)).filter((f) => f.endsWith(".png")).sort();
    out[theme] = await Promise.all(
      files.map(async (f) => ({
        name: f.replace(/\.png$/, ""),
        url: `/shots/${theme}/${f}`,
        mtime: (await fsp.stat(path.join(dir, f))).mtimeMs,
      })),
    );
  }
  return out;
}

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, "http://x");
    const send = (code, type, body) => res.writeHead(code, { "content-type": type, "cache-control": "no-store" }).end(body);

    if (url.pathname === "/api/version") return send(200, "application/json", JSON.stringify({ version }));
    if (url.pathname === "/api/shots") return send(200, "application/json", JSON.stringify(await listShots()));

    const rel = url.pathname === "/" ? "preview/index.html" : url.pathname.slice(1);
    const file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT)) return send(403, "text/plain", "nope");

    try {
      const body = await fsp.readFile(file);
      send(200, TYPES[path.extname(file)] || "application/octet-stream", body);
    } catch {
      send(404, "text/plain", "not found");
    }
  })
  .listen(PORT, () => console.log(`preview -> http://localhost:${PORT}`));

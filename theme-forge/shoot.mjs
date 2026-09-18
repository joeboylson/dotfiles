import { _electron as electron } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { states } from "./states.mjs";
const { palette } = await import(process.env.PALETTE ?? "./palette.mjs");

const THEME_DIR = process.env.THEME_DIR || "/theme";
const WORKSPACE = process.env.WORKSPACE || "/workspace";
const OUT_DIR = process.env.OUT_DIR || "/shots";
const CODE_BIN = "/usr/share/code/code";
const [W, H] = (process.env.SCREEN || "1600x1000x24").split("x").map(Number);

const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Every color theme the extension contributes.
const manifest = JSON.parse(fs.readFileSync(path.join(THEME_DIR, "package.json"), "utf8"));
const themes = (manifest.contributes?.themes ?? []).map((t) => t.label || t.id);
if (!themes.length) throw new Error(`No themes declared in ${THEME_DIR}/package.json`);

// Fresh profile per run so nothing leaks between runs.
function makeProfile(themeLabel) {
  const dir = fs.mkdtempSync("/tmp/vscode-profile-");
  fs.mkdirSync(path.join(dir, "User"), { recursive: true });
  fs.writeFileSync(
    path.join(dir, "User", "settings.json"),
    JSON.stringify(
      {
        "workbench.colorTheme": themeLabel,
        "workbench.startupEditor": "none",
        "workbench.tips.enabled": false,
        "window.titleBarStyle": "custom",
        "window.commandCenter": false,
        "telemetry.telemetryLevel": "off",
        "update.mode": "none",
        "extensions.autoUpdate": false,
        "editor.fontFamily": `"${palette.font.family}", monospace`,
        "editor.fontSize": palette.font.size,
        "editor.fontLigatures": palette.font.ligatures,
        "terminal.integrated.fontFamily": `"${palette.font.family}", monospace`,
        "terminal.integrated.fontSize": palette.font.size - 1,
        "editor.minimap.enabled": true,
        "workbench.editor.enablePreview": false,
        "security.workspace.trust.enabled": false,
        "workbench.secondarySideBar.defaultVisibility": "hidden",
        "chat.commandCenter.enabled": false,
        "workbench.statusBar.visible": true,
        "git.openRepositoryInParentFolders": "never",
        "workbench.activityBar.location": "default",
      },
      null,
      2,
    ),
  );
  return dir;
}

async function launch(themeLabel) {
  const userDataDir = makeProfile(themeLabel);
  const app = await electron.launch({
    executablePath: CODE_BIN,
    args: [
      "--no-sandbox",
      "--disable-gpu-sandbox",
      "--disable-dev-shm-usage",
      "--disable-updates",
      "--skip-welcome",
      "--skip-release-notes",
      "--disable-workspace-trust",
      "--disable-telemetry",
      `--user-data-dir=${userDataDir}`,
      `--extensions-dir=${path.join(userDataDir, "extensions")}`,
      `--extensionDevelopmentPath=${THEME_DIR}`,
      WORKSPACE,
    ],
    env: { ...process.env, DISPLAY: process.env.DISPLAY || ":99" },
  });

  const page = await app.firstWindow();
  await page.waitForSelector(".monaco-workbench", { timeout: 60_000 });

  const win = await app.browserWindow(page);
  await win.evaluate((w, size) => w.setBounds({ x: 0, y: 0, ...size }), { width: W, height: H });
  await page.waitForTimeout(1500); // let the theme paint

  return { app, page };
}

// Small driver so states.mjs stays readable.
function driver(page) {
  const settle = () => page.waitForTimeout(500);
  return {
    page,
    async press(keys) {
      await page.keyboard.press(keys);
      await settle();
    },
    async type(text) {
      await page.keyboard.type(text, { delay: 25 });
      await settle();
    },
    // Fuzzy search will happily hand back a different command than the one
    // asked for ("Close Panel" -> "Toggle Panel Visibility"), so click the row
    // whose label matches exactly and fail loudly when there isn't one.
    async cmd(title) {
      // Titles drift between VS Code versions, so a state may offer several
      // spellings; take the first that actually exists.
      const candidates = Array.isArray(title) ? title : [title];
      let seen = [];

      for (const name of candidates) {
        await page.keyboard.press("F1");
        await page.waitForSelector(".quick-input-widget", { state: "visible" });
        await page.keyboard.type(name, { delay: 15 });
        await page.waitForTimeout(500);

        // Fuzzy search will happily return a different command than the one
        // asked for ("Close Panel" -> "Toggle Panel Visibility"), so match the
        // label exactly rather than trusting the top row.
        const row = page
          .locator(".quick-input-list .monaco-list-row")
          .filter({ has: page.locator(`.label-name >> text="${name}"`) })
          .first();

        if (await row.count()) {
          await row.click();
          await settle();
          return;
        }
        seen = await page.locator(".quick-input-list .label-name").allInnerTexts();
        await page.keyboard.press("Escape");
        await page.waitForTimeout(200);
      }
      throw new Error(
        `No command titled exactly: ${candidates.join(" | ")}. ` +
          `Palette offered: ${seen.slice(0, 6).join(" / ") || "nothing"}`,
      );
    },
    async open(relPath) {
      await this.cmd("Go to File...");
      await page.keyboard.type(relPath, { delay: 15 });
      await page.waitForTimeout(400);
      await page.keyboard.press("Enter");
      await page.waitForTimeout(800);
    },
    // Put the window back to a known baseline so one state can't bleed
    // into the next: no editors, no panel, Explorer showing.
    async reset() {
      await page.keyboard.press("Escape");
      await this.cmd("View: Close All Editors");
      if (await page.locator(".part.panel").isVisible()) {
        await this.cmd("View: Toggle Panel Visibility");
      }
      await this.cmd("View: Show Explorer");
      await page.keyboard.press("Escape");
      await settle();
    },
  };
}

for (const themeLabel of themes) {
  const outDir = path.join(OUT_DIR, slug(themeLabel));
  fs.mkdirSync(outDir, { recursive: true });

  const { app, page } = await launch(themeLabel);
  const vs = driver(page);

  for (const state of states) {
    if (only.length && !only.includes(state.name)) continue;
    try {
      await vs.reset();
      await state.run(vs);
      const file = path.join(outDir, `${state.name}.png`);
      await page.screenshot({ path: file });
      console.log(`shot  ${slug(themeLabel)}/${state.name}.png`);
    } catch (err) {
      console.error(`FAIL  ${slug(themeLabel)}/${state.name}: ${err.message}`);
    }
  }

  await app.close();
}

console.log("done");

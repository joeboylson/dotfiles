import { readFile } from "node:fs/promises";

// Load a config file and fall back to defaults when it is missing.
export interface Config {
  name: string;
  retries: number;
  verbose: boolean;
}

const DEFAULTS: Config = { name: "untitled", retries: 3, verbose: false };

export async function loadConfig(path: string): Promise<Config> {
  try {
    const raw = await readFile(path, "utf8");
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    return DEFAULTS;
  }
}

export class Runner {
  #attempts = 0;

  constructor(private readonly config: Config) {}

  async run<T>(task: () => Promise<T>): Promise<T> {
    while (true) {
      try {
        return await task();
      } catch (err) {
        if (++this.#attempts >= this.config.retries) throw err;
        await new Promise((r) => setTimeout(r, 2 ** this.#attempts * 100));
      }
    }
  }
}

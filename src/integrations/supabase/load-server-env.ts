import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

let hydrated = false;

/**
 * Vite / Lovable only inject VITE_* vars. Server secrets in .env.local
 * are copied onto process.env so supabaseAdmin can read them.
 */
export function hydrateServerEnv() {
  if (hydrated) return;
  hydrated = true;

  if (typeof process === "undefined" || typeof process.cwd !== "function") return;

  try {
    for (const file of [".env.local", ".env"]) {
      const path = resolve(process.cwd(), file);
      if (!existsSync(path)) continue;
      const text = readFileSync(path, "utf8").replace(/^\uFEFF/, "");
      for (const rawLine of text.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith("#")) continue;
        const eq = line.indexOf("=");
        if (eq <= 0) continue;
        const key = line.slice(0, eq).trim();
        let value = line.slice(eq + 1).trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        if (process.env[key] === undefined || process.env[key] === "") {
          process.env[key] = value;
        }
      }
    }
  } catch {
    // Cloudflare / workers have no filesystem; env bindings stay as-is.
  }
}

// Shared color resolution. Every target builds from this, so the three
// outputs can't drift apart.

export async function loadPalette() {
  const { palette, ramp } = await import(process.env.PALETTE ?? "./palette.mjs");
  const ALLOWED = new Set(ramp.map((h) => h.toLowerCase()));

  // "accent" -> hex, "accent/40" -> hex with 40% alpha, "#abc123" -> itself.
  // A name may point at another name, so follow the chain until it lands on a hex.
  function color(ref) {
    const [name, alpha] = String(ref).split("/");

    let hex = name;
    for (let hops = 0; !hex.startsWith("#"); hops++) {
      if (hops > 8) throw new Error(`Color reference loops: ${ref}`);
      const next =
        palette.base[hex] ?? palette.syntax[hex] ?? palette.status[hex] ?? palette.ansi?.[hex];
      if (!next) throw new Error(`Unknown color: ${ref}`);
      hex = next;
    }
    if (!ALLOWED.has(hex.toLowerCase())) {
      throw new Error(`${ref} resolves to ${hex}, which is not in the ramp`);
    }
    if (!alpha) return hex;
    const a = Math.round((Number(alpha) / 100) * 255).toString(16).padStart(2, "0");
    return hex + a;
  }

  // Terminals and Neovim can't do partial transparency, so the layered
  // surfaces have to be composited down to a solid color first.
  function flatten(ref, over = "surface") {
    const [name, alpha] = String(ref).split("/");
    if (!alpha) return color(name);

    const top = color(name);
    const bottom = color(over);
    const mix = (i) => {
      const t = parseInt(top.slice(1 + i * 2, 3 + i * 2), 16);
      const b = parseInt(bottom.slice(1 + i * 2, 3 + i * 2), 16);
      const a = Number(alpha) / 100;
      return Math.round(t * a + b * (1 - a)).toString(16).padStart(2, "0");
    };
    return `#${mix(0)}${mix(1)}${mix(2)}`;
  }

  const c = Object.fromEntries(
    [
      ...Object.entries(palette.base),
      ...Object.entries(palette.syntax),
      ...Object.entries(palette.status),
    ].map(([k]) => [k, color(k)]),
  );

  // ANSI slots are namespaced so "black" can't collide with a base role.
  const ansi = Object.fromEntries(Object.entries(palette.ansi ?? {}).map(([k]) => [k, color(k)]));

  return { palette, ramp, color, flatten, c, ansi };
}

export const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

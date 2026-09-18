// Draws the marketplace icon straight from the palette — no image deps.
//
// The picture is the theme's own pitch: two plates of the one background gray,
// split by a hard diagonal seam with heat coming up through it.
import zlib from "node:zlib";

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};

const hex = (h) => {
  const s = h.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
};

const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

// Smooth 0..1 ramp, used for both antialiasing and the heat falloff.
const smooth = (edge0, edge1, x) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

export function renderIcon({ surface, border, accent, hot, size = 128 }) {
  const bg = hex(surface);
  const seamEdge = hex(border);
  const warm = hex(accent);
  const core = hex(hot);

  const px = Buffer.alloc(size * size * 3);

  // The seam runs corner to corner; distance to it drives everything.
  // Every width below is in 128px units, scaled so any size looks the same.
  const half = size / 2;
  const u = size / 128;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Signed perpendicular distance to the y = x diagonal.
      const d = (x - y) / Math.SQRT2;
      const ad = Math.abs(d);

      // Plates sit flat; a hairline marks where each one is cut.
      let rgb = bg;

      // Heat bleeds out of the gap and dies fast — nothing glows for free.
      const glow = 1 - smooth(3 * u, 13 * u, ad);
      if (glow > 0) rgb = mix(rgb, warm, glow * 0.22);

      // The cut itself: hard amber core, hotter at the middle of the run.
      const along = 1 - Math.abs((x + y) / (2 * half) - 1);
      const gap = (1.6 + 2.4 * along) * u;
      const inSeam = 1 - smooth(gap, gap + 1.1 * u, ad);
      if (inSeam > 0) rgb = mix(rgb, mix(warm, core, along * 0.85), inSeam);

      // A hairline lip on each plate edge, so the seam reads as cut, not drawn.
      const lip = smooth(gap + 0.5 * u, gap + 1.3 * u, ad) * (1 - smooth(gap + 1.3 * u, gap + 3 * u, ad));
      if (lip > 0) rgb = mix(rgb, seamEdge, lip * 0.9);

      const i = (y * size + x) * 3;
      px[i] = rgb[0];
      px[i + 1] = rgb[1];
      px[i + 2] = rgb[2];
    }
  }

  // PNG wants a filter byte in front of every scanline; 0 means "raw".
  const raw = Buffer.alloc(size * (size * 3 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0;
    px.copy(raw, y * (size * 3 + 1) + 1, y * size * 3, (y + 1) * size * 3);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // truecolor

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

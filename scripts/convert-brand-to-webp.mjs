// One-shot brand asset converter. Run with: node scripts/convert-brand-to-webp.mjs
//
// Reads the source PNGs in /public, encodes them as high-quality WebP, and
// writes the result alongside. Quality 92 is the sweet spot for logos that
// have hard edges and gradients — visually lossless but ~70% smaller than PNG.

import sharp from "sharp";
import { stat } from "node:fs/promises";
import path from "node:path";

const files = ["repliqo-logo", "repliqo-icon"];
const pub = path.join(process.cwd(), "public");

for (const name of files) {
  const input = path.join(pub, `${name}.png`);
  const output = path.join(pub, `${name}.webp`);

  const before = (await stat(input)).size;
  await sharp(input).webp({ quality: 92, effort: 6 }).toFile(output);
  const after = (await stat(output)).size;

  const saved = (((before - after) / before) * 100).toFixed(1);
  console.log(
    `${name}: ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB  (saved ${saved}%)`
  );
}

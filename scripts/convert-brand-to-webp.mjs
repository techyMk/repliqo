// Bulk PNG → WebP converter for /public assets.
//
//   node scripts/convert-brand-to-webp.mjs
//
// Each entry can optionally cap the longest edge (helpful for avatars or
// photographs that arrive at camera resolution). WebP quality 92 is the sweet
// spot — visually lossless on gradients and photos, but typically 70–95%
// smaller than PNG.

import sharp from "sharp";
import { stat, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

/** @type {Array<{ src: string; maxEdge?: number; deleteSource?: boolean }>} */
const tasks = [
  // Brand assets
  { src: "public/repliqo-logo.png" },
  { src: "public/repliqo-icon.png" },
  // Profile avatars — cap at 512 since we render at most 64px (retina = 128px)
  { src: "public/avatars/techymk.png", maxEdge: 512, deleteSource: true },
  // Post images — Instagram 4:5 portrait standard
  { src: "public/posts/drop.png", maxEdge: 1080, deleteSource: true },
];

for (const t of tasks) {
  const input = path.join(process.cwd(), t.src);
  if (!existsSync(input)) {
    console.log(`skip   ${t.src} (not found)`);
    continue;
  }
  const output = input.replace(/\.png$/i, ".webp");
  const before = (await stat(input)).size;

  let pipeline = sharp(input);
  if (t.maxEdge) {
    pipeline = pipeline.resize(t.maxEdge, t.maxEdge, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }
  await pipeline.webp({ quality: 92, effort: 6 }).toFile(output);

  const after = (await stat(output)).size;
  const saved = (((before - after) / before) * 100).toFixed(1);
  const baseName = path.basename(t.src);
  console.log(
    `${baseName.padEnd(24)} ${(before / 1024).toFixed(0).padStart(6)} KB  →  ${(
      after / 1024
    )
      .toFixed(0)
      .padStart(5)} KB  (saved ${saved}%)`
  );

  if (t.deleteSource) {
    await unlink(input);
    console.log(`  removed source ${t.src}`);
  }
}

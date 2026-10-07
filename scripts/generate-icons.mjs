import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const publicDirectory = new URL('../public/', import.meta.url);
const source = await readFile(new URL('favicon.svg', publicDirectory));
const png = (size, opaque = false) => {
  const image = sharp(source, { density: 384 }).resize(size, size);
  if (opaque) image.flatten({ background: '#f8f5ef' });
  return image.png().toBuffer();
};

await Promise.all(
  [
    ['favicon-16x16.png', 16, false],
    ['favicon-32x32.png', 32, false],
    ['apple-touch-icon.png', 180, true],
    ['android-chrome-192x192.png', 192, true],
    ['android-chrome-512x512.png', 512, true],
  ].map(async ([name, size, opaque]) => {
    await writeFile(new URL(name, publicDirectory), await png(size, opaque));
  }),
);

// PNG frames in an ICO container provide the legacy browser fallback.
const sizes = [16, 32, 48];
const frames = await Promise.all(sizes.map((size) => png(size)));
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
frames.forEach((frame, index) => {
  const entry = 6 + index * 16;
  header[entry] = sizes[index];
  header[entry + 1] = sizes[index];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(frame.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += frame.length;
});
await writeFile(
  new URL('favicon.ico', publicDirectory),
  Buffer.concat([header, ...frames]),
);

console.log('Generated browser and touch icons from public/favicon.svg.');

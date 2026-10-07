import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const sourceDirectory = join(root, 'public/images/drawings/4x');
const outputDirectory = join(root, 'public/images/optimized');
const manifestPath = join(root, 'src/generated/image-assets.json');
const check = process.argv.includes('--check');
const settings = {
  thumbnailHeights: [96, 192, 288],
  displayWidths: [384, 768, 1152, 1536, 2304, 3072],
  webpQuality: 82,
  jpegQuality: 85,
  enlargementQuality: 90,
};
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');

if (!check) {
  await mkdir(outputDirectory, { recursive: true });
  await mkdir(dirname(manifestPath), { recursive: true });
}

const manifest = { settings, images: {} };
for (const name of (await readdir(sourceDirectory))
  .filter((name) => name.endsWith('.jpg'))
  .sort()) {
  const source = await readFile(join(sourceDirectory, name));
  const metadata = await sharp(source).autoOrient().metadata();
  const { width, height } = metadata.autoOrient;
  const image = {
    sourceHash: hash(source),
    width,
    height,
    thumbnail: {},
    display: {},
  };
  for (const variant of ['thumbnail', 'display']) {
    const sizes =
      variant === 'thumbnail'
        ? settings.thumbnailHeights.map((height) => ({ height }))
        : [
            ...new Set([
              ...settings.displayWidths.filter((size) => size < width),
              width,
            ]),
          ].map((width) => ({ width }));
    for (const format of ['webp', 'jpg']) {
      image[variant][format] = [];
      for (const size of sizes) {
        const fullSize = variant === 'display' && size.width === width;
        const pipeline = sharp(source)
          .autoOrient()
          .toColourspace('srgb')
          .resize({ ...size, withoutEnlargement: true });
        if (format === 'webp') {
          pipeline.webp({
            quality: fullSize
              ? settings.enlargementQuality
              : settings.webpQuality,
            effort: 6,
          });
        } else {
          pipeline.jpeg({
            quality: fullSize
              ? settings.enlargementQuality
              : settings.jpegQuality,
            progressive: true,
            mozjpeg: true,
          });
        }
        const { data, info } = await pipeline.toBuffer({
          resolveWithObject: true,
        });
        const filename = `${name.slice(0, -4)}-${variant}-${info.width}w-${hash(data).slice(0, 16)}.${format}`;
        if (check) {
          const existing = await readFile(join(outputDirectory, filename));
          if (!existing.equals(data))
            throw new Error(`Image differs: ${filename}`);
        } else {
          await writeFile(join(outputDirectory, filename), data);
        }
        image[variant][format].push({
          url: `/images/optimized/${filename}`,
          width: info.width,
          height: info.height,
        });
      }
    }
  }
  manifest.images[name] = image;
}
const json = `${JSON.stringify(manifest, null, 2)}\n`;
if (check) {
  if ((await readFile(manifestPath, 'utf8')) !== json)
    throw new Error('Image manifest is stale. Run npm run images:optimize.');
} else {
  await writeFile(manifestPath, json);
}
console.log(
  `${check ? 'Verified' : 'Generated'} WebP/JPEG variants for ${Object.keys(manifest.images).length} artworks.`,
);

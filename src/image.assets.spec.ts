import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { imageFilenames } from './db.images';
import { drawingSources } from './image.assets';

describe('generated artwork assets', () => {
  it('provides equivalent, correctly measured and content-versioned WebP/JPEG files', async () => {
    for (const image of imageFilenames) {
      const original = await readFile(
        join(process.cwd(), 'public/images/drawings/4x', image.name),
      );
      expect(image.assets.sourceHash).toBe(
        createHash('sha256').update(original).digest('hex'),
      );
      const metadata = await sharp(original).metadata();
      expect(image.dimension).toEqual({
        w: metadata.autoOrient.width,
        h: metadata.autoOrient.height,
      });
      for (const kind of ['thumbnail', 'display'] as const) {
        const { jpg, webp } = image.assets[kind];
        expect(jpg.map(({ width, height }) => ({ width, height }))).toEqual(
          webp.map(({ width, height }) => ({ width, height })),
        );
        for (const variant of [...jpg, ...webp]) {
          const data = await readFile(
            join(process.cwd(), 'public', variant.url),
          );
          const info = await sharp(data).metadata();
          expect(info.width).toBe(variant.width);
          expect(info.height).toBe(variant.height);
          expect(variant.width).toBeLessThanOrEqual(image.assets.width);
          expect(variant.height).toBeLessThanOrEqual(image.assets.height);
          expect(variant.url).toContain(
            createHash('sha256').update(data).digest('hex').slice(0, 16),
          );
          expect(data.length).toBeLessThan(original.length);
        }
      }
    }
  });

  it('sizes landscape thumbnails to their actual aspect ratio and keeps display sources separate', () => {
    const image = imageFilenames.find(
      ({ name }) => name === 'IMG_20210820_090530.jpg',
    )!;
    const thumbnail = drawingSources(image, true);
    expect(Number.parseFloat(thumbnail.sizes)).toBeCloseTo(
      (6 * image.assets.width) / image.assets.height,
    );
    expect(thumbnail.jpegSrcset).toContain('-thumbnail-');
    expect(thumbnail.displayJpegSrcset).toContain('-display-');
    expect(thumbnail.jpegSrcset).not.toContain('-display-');
  });
});

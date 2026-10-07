import manifest from './generated/image-assets.json';

export interface ImageVariant {
  url: string;
  width: number;
  height: number;
}

interface ImageFormats {
  jpg: ImageVariant[];
  webp: ImageVariant[];
}

export interface ArtworkAssets {
  sourceHash: string;
  width: number;
  height: number;
  thumbnail: ImageFormats;
  display: ImageFormats;
}

export function getArtworkAssets(name: string): ArtworkAssets {
  const assets = (manifest.images as Record<string, ArtworkAssets>)[name];
  if (!assets)
    throw new Error(
      `Missing image assets for ${name}. Run npm run images:optimize.`,
    );
  return assets;
}

const srcset = (variants: ImageVariant[]) =>
  variants.map(({ url, width }) => `${url} ${width}w`).join(', ');

export function drawingSources(
  image: { assets: ArtworkAssets },
  thumbnail: boolean,
  role?: string,
) {
  const assets = image.assets;
  const variants = thumbnail === true ? assets.thumbnail : assets.display;
  const ratio = assets.width / assets.height;
  const displaySizes = `min(calc(100vw - 3rem), ${Math.min(29, 37 * ratio)}rem)`;
  // Cropped images need enough pixels for object-fit: cover in both axes.
  const coverHeight = `calc(20rem * ${ratio})`;
  const sizes =
    role === 'hero'
      ? '(min-width: 960px) min(42vw, 29rem), min(calc(100vw - 3rem), 25rem)'
      : role === 'gallery'
        ? '(min-width: 768px) min(calc((100vw - 5rem) / 3), 22rem), calc((100vw - 4rem) / 2)'
        : role === 'commission'
          ? '(min-width: 768px) 15rem, 6rem'
          : role === 'bar'
            ? `(min-width: 1200px) max(calc(100vw / 7), ${coverHeight}), (min-width: 992px) max(calc(100vw / 3), ${coverHeight}), max(50vw, ${coverHeight})`
            : displaySizes;
  return {
    width: assets.width,
    height: assets.height,
    ratio,
    src: variants.jpg[0].url,
    jpegSrcset: srcset(variants.jpg),
    webpSrcset: srcset(variants.webp),
    sizes: thumbnail === true ? `${6 * ratio}rem` : sizes,
    displaySrc: assets.display.jpg[0].url,
    fullSrc: assets.display.jpg.at(-1)!.url,
    displayJpegSrcset: srcset(assets.display.jpg),
    displayWebpSrcset: srcset(assets.display.webp),
    displaySizes,
    overlaySizes: `min(calc(100vw - 3.5rem), calc((100vh - 9rem) * ${ratio}))`,
  };
}

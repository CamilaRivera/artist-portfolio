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
  const displaySizes = `min(100vw, ${Math.min(60, 30 * ratio)}rem)`;
  // Cropped images need enough pixels for object-fit: cover in both axes.
  const coverHeight = `calc(20rem * ${ratio})`;
  const sizes =
    role === 'bar'
      ? `(min-width: 1200px) max(calc(100vw / 7), ${coverHeight}), (min-width: 992px) max(calc(100vw / 3), ${coverHeight}), max(50vw, ${coverHeight})`
      : role === 'commission'
        ? `(min-width: 960px) max(30rem, calc(35rem * ${ratio})), (min-width: 576px) max(50vw, calc(35rem * ${ratio})), max(100vw, ${coverHeight})`
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
    displayJpegSrcset: srcset(assets.display.jpg),
    displayWebpSrcset: srcset(assets.display.webp),
    displaySizes,
    overlaySizes: `min(100vw, calc(100vh * ${ratio}))`,
  };
}

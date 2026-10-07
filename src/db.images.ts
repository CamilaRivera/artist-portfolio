import { sampleSize } from 'lodash';
import { getArtworkAssets } from './image.assets';

export const imageFilenames = [
  {
    name: 'Atom.jpg',
    subjects: 1,
    alt: { en: 'Dog drawing, one subject', es: 'Dibujo perro, un sujeto' },
  },
  {
    name: 'Baco.jpg',
    subjects: 1,
    alt: { en: 'Dog drawing, one subject', es: 'Dibujo perro, un sujeto' },
  },
  {
    name: 'Bowie.jpg',
    subjects: 1,
    alt: {
      en: 'Portrait drawing of Bowie, a dog wearing a blue bandana',
      es: 'Dibujo de Bowie, un perro con un pañuelo azul',
    },
  },
  {
    name: 'Briso.jpg',
    subjects: 1,
    alt: {
      en: 'Portrait drawing of Briso, a tabby cat',
      es: 'Dibujo de Briso, un gato atigrado',
    },
  },
  {
    name: 'caballo.jpg',
    subjects: 1,
    alt: { en: 'Horse drawing, one subject', es: 'Dibujo caballo, un sujeto' },
  },
  {
    name: 'Cano.jpg',
    subjects: 1,
    alt: { en: 'Dog drawing, one subject', es: 'Dibujo perro, un sujeto' },
  },
  {
    name: 'Coca.jpg',
    subjects: 1,
    alt: { en: 'Dog drawing, one subject', es: 'Dibujo perro, un sujeto' },
  },
  {
    name: 'IMG_20210820_090530.jpg',
    subjects: 2,
    alt: {
      en: 'Dog and Cat drawing, two subjects',
      es: 'Dibujo perro and gato, dos sujetos',
    },
  },
  {
    name: 'img019.jpg',
    subjects: 1,
    alt: { en: 'Cat drawing, one subject', es: 'Dibujo gato, un sujeto' },
  },
  {
    name: 'img025.jpg',
    subjects: 2,
    alt: {
      en: 'Two cats drawing, two subjects',
      es: 'Dibujo de dos gatos, dos sujetos',
    },
  },
  {
    name: 'img035.jpg',
    subjects: 1,
    alt: { en: 'Dog drawing, one subject', es: 'Dibujo perro, un sujeto' },
  },
  {
    name: 'img038.jpg',
    subjects: 1,
    alt: { en: 'Dog drawing, one subject', es: 'Dibujo perro, un sujeto' },
  },
  {
    name: 'img039.jpg',
    subjects: 1,
    alt: { en: 'Dog drawing, one subject', es: 'Dibujo perro, un sujeto' },
  },
  {
    name: 'img041.jpg',
    subjects: 1,
    alt: { en: 'Dog drawing, one subject', es: 'Dibujo perro, un sujeto' },
  },
  {
    name: 'img048.jpg',
    subjects: 1,
    alt: { en: 'Dog drawing, one subject', es: 'Dibujo perro, un sujeto' },
  },
  {
    name: 'img054.jpg',
    subjects: 1,
    alt: { en: 'Dog drawing, one subject', es: 'Dibujo perro, un sujeto' },
  },
  {
    name: 'img091.jpg',
    subjects: 1,
    alt: { en: 'Cat drawing, one subject', es: 'Dibujo gato, un sujeto' },
  },
  {
    name: 'img094.jpg',
    subjects: 1,
    alt: { en: 'Cat drawing, one subject', es: 'Dibujo gato, un sujeto' },
  },
  {
    name: 'img095.jpg',
    subjects: 1,
    alt: { en: 'Dog drawing, one subject', es: 'Dibujo perro, un sujeto' },
  },
  {
    name: 'jack.jpg',
    subjects: 1,
    alt: { en: 'Dog drawing, one subject', es: 'Dibujo perro, un sujeto' },
  },
  {
    name: 'Komatsu.jpg',
    subjects: 1,
    alt: { en: 'Dog drawing, one subject', es: 'Dibujo perro, un sujeto' },
  },
  {
    name: 'lukas2.jpg',
    subjects: 1,
    alt: { en: 'Cat drawing, one subject', es: 'Dibujo gato, un sujeto' },
  },
  {
    name: 'Malu.jpg',
    subjects: 1,
    alt: { en: 'Dog portrait drawing of Malu', es: 'Dibujo de Malu, un perro' },
  },
  {
    name: 'Negrita.jpg',
    subjects: 1,
    alt: { en: 'Dog drawing, one subject', es: 'Dibujo perro, un sujeto' },
  },
  {
    name: 'sammy_y_benito_tiny.jpg',
    subjects: 2,
    alt: {
      en: 'Portrait drawing of Sammy and Benito, two white dogs',
      es: 'Dibujo de Sammy y Benito, dos perros blancos',
    },
  },
  {
    name: 'Valentin.jpg',
    subjects: 1,
    alt: { en: 'Dog drawing, one subject', es: 'Dibujo perro, un sujeto' },
  },
].map((image) => {
  const assets = getArtworkAssets(image.name);
  return { ...image, assets, dimension: { w: assets.width, h: assets.height } };
});

export const getRandomDrawings = (count = 7, subjects?: number) => {
  const imagesToUse = subjects
    ? imageFilenames.filter((image) => image.subjects === subjects)
    : imageFilenames;
  return sampleSize(imagesToUse, count);
};

export const featuredDrawings = [
  'Bowie.jpg',
  'Briso.jpg',
  'caballo.jpg',
  'sammy_y_benito_tiny.jpg',
  'Malu.jpg',
  'Baco.jpg',
].map((name) => imageFilenames.find((image) => image.name === name)!);

export const remainingDrawings = imageFilenames.filter(
  (image) => !featuredDrawings.includes(image),
);

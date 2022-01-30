import { sampleSize } from 'lodash';

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
    alt: { en: 'Dog drawing, one subject', es: 'Dibujo perro, un sujeto' },
  },
  {
    name: 'Briso.jpg',
    subjects: 1,
    alt: { en: 'Cat drawing, one subject', es: 'Dibujo gato, un sujeto' },
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
    alt: { en: 'Dog drawing, one subject', es: 'Dibujo perro, un sujeto' },
  },
  {
    name: 'Negrita.jpg',
    subjects: 1,
    alt: { en: 'Dog drawing, one subject', es: 'Dibujo perro, un sujeto' },
  },
  {
    name: 'sammy y benito tiny.jpg',
    subjects: 2,
    alt: {
      en: 'Two dogs drawing, two subjects',
      es: 'Dibujo de dos perros, dos sujetos',
    },
  },
  {
    name: 'Valentin.jpg',
    subjects: 1,
    alt: { en: 'Dog drawing, one subject', es: 'Dibujo perro, un sujeto' },
  },
];

export const getRandomDrawings = (count = 7, subjects = undefined) => {
  const imagesToUse = subjects
    ? imageFilenames.filter((image) => image.subjects === subjects)
    : imageFilenames;
  return sampleSize(imagesToUse, count);
};

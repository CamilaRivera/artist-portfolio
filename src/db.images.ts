import { sampleSize } from 'lodash';

export const imageFilenames = [
  {
    name: 'Atom.jpg',
    subjects: 1,
    alt: { en: 'sample english alt text', es: 'ejemplo alt espanol' },
  },
  {
    name: 'Baco.jpg',
    subjects: 1,
    alt: { en: 'sample english alt text', es: 'ejemplo alt espanol' },
  },
  {
    name: 'Bowie.jpg',
    subjects: 1,
    alt: { en: 'sample english alt text', es: 'ejemplo alt espanol' },
  },
  {
    name: 'Briso.jpg',
    subjects: 1,
    alt: { en: 'sample english alt text', es: 'ejemplo alt espanol' },
  },
  {
    name: 'caballo.jpg',
    subjects: 1,
    alt: { en: 'Horse drawing', es: 'Dibujo caballo' },
  },
  {
    name: 'Cano.jpg',
    subjects: 1,
    alt: { en: 'sample english alt text', es: 'ejemplo alt espanol' },
  },
  {
    name: 'Coca.jpg',
    subjects: 1,
    alt: { en: 'sample english alt text', es: 'ejemplo alt espanol' },
  },
  {
    name: 'IMG_20210820_090530.jpg',
    subjects: 2,
    alt: { en: 'sample english alt text', es: 'ejemplo alt espanol' },
  },
  {
    name: 'img019.jpg',
    subjects: 1,
    alt: { en: 'sample english alt text', es: 'ejemplo alt espanol' },
  },
  {
    name: 'img025.jpg',
    subjects: 2,
    alt: { en: 'sample english alt text', es: 'ejemplo alt espanol' },
  },
  {
    name: 'img035.jpg',
    subjects: 1,
    alt: { en: 'sample english alt text', es: 'ejemplo alt espanol' },
  },
  {
    name: 'img038.jpg',
    subjects: 1,
    alt: { en: 'sample english alt text', es: 'ejemplo alt espanol' },
  },
  {
    name: 'img039.jpg',
    subjects: 1,
    alt: { en: 'sample english alt text', es: 'ejemplo alt espanol' },
  },
  {
    name: 'img041.jpg',
    subjects: 1,
    alt: { en: 'sample english alt text', es: 'ejemplo alt espanol' },
  },
  {
    name: 'img048.jpg',
    subjects: 1,
    alt: { en: 'sample english alt text', es: 'ejemplo alt espanol' },
  },
  {
    name: 'img054.jpg',
    subjects: 1,
    alt: { en: 'sample english alt text', es: 'ejemplo alt espanol' },
  },
  {
    name: 'img091.jpg',
    subjects: 1,
    alt: { en: 'sample english alt text', es: 'ejemplo alt espanol' },
  },
  {
    name: 'img094.jpg',
    subjects: 1,
    alt: { en: 'sample english alt text', es: 'ejemplo alt espanol' },
  },
  {
    name: 'img095.jpg',
    subjects: 1,
    alt: { en: 'sample english alt text', es: 'ejemplo alt espanol' },
  },
  {
    name: 'jack.jpg',
    subjects: 1,
    alt: { en: 'sample english alt text', es: 'ejemplo alt espanol' },
  },
  {
    name: 'Komatsu.jpg',
    subjects: 1,
    alt: { en: 'sample english alt text', es: 'ejemplo alt espanol' },
  },
  {
    name: 'lukas2.jpg',
    subjects: 1,
    alt: { en: 'sample english alt text', es: 'ejemplo alt espanol' },
  },
  {
    name: 'Malu.jpg',
    subjects: 1,
    alt: { en: 'sample english alt text', es: 'ejemplo alt espanol' },
  },
  {
    name: 'Negrita.jpg',
    subjects: 1,
    alt: { en: 'sample english alt text', es: 'ejemplo alt espanol' },
  },
  {
    name: 'sammy y benito tiny.jpg',
    subjects: 2,
    alt: { en: 'sample english alt text', es: 'ejemplo alt espanol' },
  },
  {
    name: 'Valentin.jpg',
    subjects: 1,
    alt: { en: 'sample english alt text', es: 'ejemplo alt espanol' },
  },
];

export const getRandomDrawings = (count = 4, subjects = undefined) => {
  const imagesToUse = subjects
    ? imageFilenames.filter((image) => image.subjects === subjects)
    : imageFilenames;
  return sampleSize(imagesToUse, count);
};

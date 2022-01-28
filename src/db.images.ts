import { sampleSize } from 'lodash';

export const imageFilenames = [
  { name: 'Atom.jpg', subjects: 1, alt: { en: '', es: '' } },
  { name: 'Baco.jpg', subjects: 1, alt: { en: '', es: '' } },
  { name: 'Bowie.jpg', subjects: 1, alt: { en: '', es: '' } },
  { name: 'Briso.jpg', subjects: 1, alt: { en: '', es: '' } },
  {
    name: 'caballo.jpg',
    subjects: 1,
    alt: { en: 'Horse drawing', es: 'Dibujo caballo' },
  },
  { name: 'Cano.jpg', subjects: 1, alt: { en: '', es: '' } },
  { name: 'Coca.jpg', subjects: 1, alt: { en: '', es: '' } },
  { name: 'IMG_20210820_090530.jpg', subjects: 2, alt: { en: '', es: '' } },
  { name: 'img019.jpg', subjects: 1, alt: { en: '', es: '' } },
  { name: 'img025.jpg', subjects: 2, alt: { en: '', es: '' } },
  { name: 'img035.jpg', subjects: 1, alt: { en: '', es: '' } },
  { name: 'img038.jpg', subjects: 1, alt: { en: '', es: '' } },
  { name: 'img039.jpg', subjects: 1, alt: { en: '', es: '' } },
  { name: 'img041.jpg', subjects: 1, alt: { en: '', es: '' } },
  { name: 'img048.jpg', subjects: 1, alt: { en: '', es: '' } },
  { name: 'img054.jpg', subjects: 1, alt: { en: '', es: '' } },
  { name: 'img091.jpg', subjects: 1, alt: { en: '', es: '' } },
  { name: 'img094.jpg', subjects: 1, alt: { en: '', es: '' } },
  { name: 'img095.jpg', subjects: 1, alt: { en: '', es: '' } },
  { name: 'jack.jpg', subjects: 1, alt: { en: '', es: '' } },
  { name: 'Komatsu.jpg', subjects: 1, alt: { en: '', es: '' } },
  { name: 'lukas2.jpg', subjects: 1, alt: { en: '', es: '' } },
  { name: 'Malu.jpg', subjects: 1, alt: { en: '', es: '' } },
  { name: 'Negrita.jpg', subjects: 1, alt: { en: '', es: '' } },
  { name: 'sammy y benito tiny.jpg', subjects: 2, alt: { en: '', es: '' } },
  { name: 'Valentin.jpg', subjects: 1, alt: { en: '', es: '' } },
];

export const getRandomDrawings = (count = 4, subjects = undefined) => {
  const imagesToUse = subjects
    ? imageFilenames.filter((image) => image.subjects === subjects)
    : imageFilenames;
  return sampleSize(imagesToUse, count);
};

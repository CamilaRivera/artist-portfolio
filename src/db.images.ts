import { sampleSize } from 'lodash';

export const imageFilenames = [
  { name: 'Atom.jpg', alt: '' },
  { name: 'Baco.jpg', alt: '' },
  { name: 'Bowie.jpg', alt: '' },
  { name: 'Briso.jpg', alt: '' },
  { name: 'caballo.jpg', alt: '' },
  { name: 'Cano.jpg', alt: '' },
  { name: 'Coca.jpg', alt: '' },
  { name: 'IMG_20210820_090530.jpg', alt: '' },
  { name: 'img019.jpg', alt: '' },
  { name: 'img025.jpg', alt: '' },
  { name: 'img035.jpg', alt: '' },
  { name: 'img038.jpg', alt: '' },
  { name: 'img039.jpg', alt: '' },
  { name: 'img041.jpg', alt: '' },
  { name: 'img048.jpg', alt: '' },
  { name: 'img054.jpg', alt: '' },
  { name: 'img091.jpg', alt: '' },
  { name: 'img094.jpg', alt: '' },
  { name: 'img095.jpg', alt: '' },
  { name: 'jack.jpg', alt: '' },
  { name: 'Komatsu.jpg', alt: '' },
  { name: 'lukas2.jpg', alt: '' },
  { name: 'Malu.jpg', alt: '' },
  { name: 'Negrita.jpg', alt: '' },
  { name: 'sammy y benito tiny.jpg', alt: '' },
  { name: 'Valentin.jpg', alt: '' },
];

export const getRandomDrawings = () => {
  return sampleSize(imageFilenames, 4);
};

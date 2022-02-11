import { getRandomDrawings } from 'src/db.images';

export const getCommisionsPriceOptions = () => {
  return [
    {
      subjects: 1,
      image: getRandomDrawings(1, 1)[0],
      prefix: 'singleSubjectBox',
      sizes: [
        {
          size: { width: 18, height: 24 },
          price: { es: 70000, en: 110 },
        },
        {
          size: { width: 20, height: 34 },
          price: { es: 110000, en: 140 },
        },
        {
          size: { width: 30, height: 40 },
          price: { es: 150000, en: 180 },
        },
        {
          size: { width: 50, height: 70 },
          price: { es: 270000, en: 350 },
        },
      ],
    },
    {
      subjects: 2,
      image: getRandomDrawings(1, 2)[0],
      prefix: 'doubleSubjectBox',
      sizes: [
        {
          size: { width: 20, height: 34 },
          price: { es: 150000, en: 180 },
        },
        {
          size: { width: 30, height: 40 },
          price: { es: 200000, en: 250 },
        },
        {
          size: { width: 50, height: 70 },
          price: { es: 330000, en: 300 },
        },
      ],
    },
  ];
};

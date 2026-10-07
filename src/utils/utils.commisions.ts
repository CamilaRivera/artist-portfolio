import { featuredDrawings } from '../db.images';
import { getLanguage, translate } from '../app.internationalization';

export const getCommisionsPriceOptions = () => {
  return [
    {
      subjects: 1,
      image: featuredDrawings[0],
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
      image: featuredDrawings[3],
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
  ].map((group) => ({
    ...group,
    sizes: group.sizes.map((option) => ({
      ...option,
      id: `${group.subjects}-${option.size.width}x${option.size.height}`,
      label: `${translate('contactForm', group.prefix)} · ${option.size.width} × ${option.size.height} cm · $${new Intl.NumberFormat(getLanguage() === 'es' ? 'es-CL' : 'en-US').format(option.price[getLanguage()])} ${getLanguage() === 'es' ? 'CLP' : 'USD'}`,
    })),
  }));
};

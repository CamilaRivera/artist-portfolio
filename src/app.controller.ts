import { Controller, Get, Render } from '@nestjs/common';
import { getRandomDrawings } from './db.images';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {
    const headSlug = {
      title: 'index.head.title',
      description: 'index.head.description',
      keywords: 'index.head.keywords',
    };
    const imagesBar = getRandomDrawings(16);
    return { headSlug, imagesBar };
  }

  @Get('/about')
  @Render('about')
  about() {
    const headSlug = {
      title: 'about.head.title',
      description: 'about.head.description',
      keywords: 'about.head.keywords',
    };
    const imagesBar = getRandomDrawings();
    return { headSlug, imagesBar };
  }

  @Get('/faq')
  @Render('FAQ')
  FAQ() {
    const headSlug = {
      title: 'faq.head.title',
      description: 'faq.head.description',
      keywords: 'faq.head.keywords',
    };
    const imagesBar = getRandomDrawings();
    return { headSlug, imagesBar };
  }

  @Get('/commission-portrait')
  @Render('commissions')
  commissionsPortrait() {
    const headSlug = {
      title: 'commissions.head.title',
      description: 'commissions.head.description',
      keywords: 'commissions.head.keywords',
    };
    const priceBoxes = [
      {
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
    const imagesBar = getRandomDrawings();
    return { headSlug, priceBoxes, imagesBar };
  }
}

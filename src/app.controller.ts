import { Controller, Get, Render, Res } from '@nestjs/common';
import { translate } from './app.internationalization';
import { getRandomDrawings } from './db.images';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {
    const imagesBar = getRandomDrawings(16);
    return { message: translate('Hello world'), imagesBar };
  }

  @Get('/about')
  @Render('about')
  about() {
    const imagesBar = getRandomDrawings();
    return { title: 'About Page', imagesBar };
  }

  @Get('/faq')
  @Render('FAQ')
  FAQ() {
    const imagesBar = getRandomDrawings();
    return { title: 'FAQ Page', imagesBar };
  }

  @Get('/commissions-portrait')
  @Render('commissions')
  commissionsPortrait(@Res() res: Response) {
    const lang = res.locals.lang.language;
    const priceBoxes = [
      {
        image: getRandomDrawings(1, 1)[0],
        prefix: 'singleSubjectBox',
        sizes: [
          {
            size: { width: 18, height: 24 },
            price: { es: 70000, en: 110 }[lang],
          },
          {
            size: { width: 20, height: 34 },
            price: { es: 110000, en: 140 }[lang],
          },
          {
            size: { width: 30, height: 40 },
            price: { es: 150000, en: 180 }[lang],
          },
          {
            size: { width: 50, height: 70 },
            price: { es: 270000, en: 350 }[lang],
          },
        ],
      },
      {
        image: getRandomDrawings(1, 2)[0],
        prefix: 'doubleSubjectBox',
        sizes: [
          {
            size: { width: 20, height: 34 },
            price: { es: 150000, en: 180 }[lang],
          },
          {
            size: { width: 30, height: 40 },
            price: { es: 200000, en: 250 }[lang],
          },
          {
            size: { width: 50, height: 70 },
            price: { es: 330000, en: 300 }[lang],
          },
        ],
      },
    ];
    const imagesBar = getRandomDrawings();
    return { title: 'Commissions Portrait', priceBoxes, imagesBar };
  }
}

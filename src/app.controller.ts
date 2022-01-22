import { Controller, Get, Render, Req } from '@nestjs/common';
import { translate } from './app.internationalization';
import { getRandomDrawings } from './db.images';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {
    const imagesBar = getRandomDrawings();
    console.log('imagesBar', imagesBar);
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
  commissionsPortrait() {
    const priceBoxes = [
      {
        image: '/images/cat-portrait2.jpeg',
        prefix: 'singleSubjectBox',
        sizes: [
          { size: { width: 18, height: 24 }, price: 70000 },
          { size: { width: 20, height: 34 }, price: 110000 },
          { size: { width: 30, height: 40 }, price: 150000 },
          { size: { width: 50, height: 70 }, price: 270000 },
        ],
      },
      {
        image: '/images/dog-portrait.jpeg',
        prefix: 'doubleSubjectBox',
        sizes: [
          { size: { width: 21, height: 14 }, price: 350 },
          { size: { width: 30, height: 24 }, price: 420 },
          { size: { width: 30, height: 24 }, price: 420 },
          { size: { width: 30, height: 24 }, price: 420 },
          { size: { width: 30, height: 24 }, price: 420 },
        ],
      },
    ];

    const imagesBar = getRandomDrawings();
    return { title: 'Commissions Portrait', priceBoxes, imagesBar };
  }
}

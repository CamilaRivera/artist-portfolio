import { Controller, Get, Render, Req } from '@nestjs/common';
import { translate } from './app.internationalization';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {
    return { message: translate('Hello world') };
  }

  @Get('/about')
  @Render('about')
  about() {
    return { title: 'About Page' };
  }

  @Get('/FAQ')
  @Render('FAQ')
  FAQ() {
    return { title: 'FAQ Page' };
  }

  @Get('/commissions-portrait')
  @Render('commissions-portrait')
  commissionsPortrait() {
    const priceBoxes = [
      {
        title: translate('1 Subject'),
        image: '/images/cat-portrait.jpeg',
        sizes: [
          { size: { width: 21, height: 14 }, price: 350 },
          { size: { width: 30, height: 24 }, price: 420 },
        ],
      },
      {
        title: translate('2 Subject'),
        image: '/images/dog-portrait.jpeg',
        sizes: [
          { size: { width: 21, height: 14 }, price: 350 },
          { size: { width: 30, height: 24 }, price: 420 },
          { size: { width: 30, height: 24 }, price: 420 },
          { size: { width: 30, height: 24 }, price: 420 },
          { size: { width: 30, height: 24 }, price: 420 },
        ],
      },
    ];

    return { title: 'Commissions Portrait', priceBoxes };
  }
}

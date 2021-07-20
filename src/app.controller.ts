import { Controller, Get, Render, Req } from '@nestjs/common';
import { translate } from './app.internationalization';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {
    const imagesBar = [
      { url: '/images/image-1.jpg' },
      { url: '/images/image-2.jpg' },
      { url: '/images/image-3.jpg' },
      { url: '/images/cat-portrait3.jpeg' },
    ];
    return { message: translate('Hello world'), imagesBar };
  }

  @Get('/about')
  @Render('about')
  about() {
    const imagesBar = [
      { url: '/images/image-1.jpg' },
      { url: '/images/image-2.jpg' },
      { url: '/images/image-3.jpg' },
      { url: '/images/cat-portrait3.jpeg' },
    ];
    return { title: 'About Page', imagesBar };
  }

  @Get('/FAQ')
  @Render('FAQ')
  FAQ() {
    const imagesBar = [
      { url: '/images/image-1.jpg' },
      { url: '/images/image-2.jpg' },
      { url: '/images/image-3.jpg' },
      { url: '/images/cat-portrait3.jpeg' },
    ];
    return { title: 'FAQ Page', imagesBar };
  }

  @Get('/commissions-portrait')
  @Render('commissions')
  commissionsPortrait() {
    const priceBoxes = [
      {
        title: translate('1 Subject'),
        image: '/images/cat-portrait2.jpeg',
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

    const imagesBar = [
      { url: '/images/image-2.jpg' },
      { url: '/images/cat-portrait2.jpeg' },
      { url: '/images/dog-portrait.jpeg' },
      { url: '/images/dog-portrait2.jpeg' },
    ];

    return { title: 'Commissions Portrait', priceBoxes, imagesBar };
  }
}

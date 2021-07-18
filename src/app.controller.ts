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

  @Get('/commissions-portrait')
  @Render('commissions-portrait')
  commissionsPortrait() {
    return { title: 'Commissions Portrait' };
  }
}

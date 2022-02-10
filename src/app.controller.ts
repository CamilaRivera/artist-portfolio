import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { getRandomDrawings } from './db.images';
import { AppService } from './app.service';
import { getCommisionsPriceOptions } from './utils/utils.commisions';
import { ContactForm } from './types/ContactForm';
import { getContactFormContext, validateFormData } from './utils/utils.contactForm';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
    const priceBoxes = getCommisionsPriceOptions();
    const imagesBar = getRandomDrawings();
    return { headSlug, priceBoxes, imagesBar };
  }

  @Get('/contact')
  @Render('contact')
  contact() {
    return getContactFormContext();
  }

  @Post('/contact')
  @Render('contact')
  contactProcess(@Body() formData: ContactForm) {
    console.log('formData', formData);
    const errors = validateFormData(formData);
    if (Object.keys(errors).length === 0) {
      this.appService.sendContactEmail(formData);
      return { success: true };
    }
    return { errors, ...getContactFormContext() };
  }
}

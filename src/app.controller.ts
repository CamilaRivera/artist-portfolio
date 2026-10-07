import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Render,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { featuredDrawings, remainingDrawings } from './db.images';
import { AppService } from './app.service';
import { getCommisionsPriceOptions } from './utils/utils.commisions';
import { ContactForm } from './types/ContactForm';
import {
  getContactFormContext,
  getContactFormData,
  validateFormData,
} from './utils/utils.contactForm';
import { RecaptchaGuard } from './guard.recaptcha';
import { ContactVerificationFilter } from './contact-verification.filter';

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
    return {
      headSlug,
      heroImage: featuredDrawings[0],
      featuredImages: featuredDrawings,
      moreImages: remainingDrawings,
      priceBoxes: getCommisionsPriceOptions(),
    };
  }

  @Get('/about')
  @Render('about')
  about() {
    const headSlug = {
      title: 'about.head.title',
      description: 'about.head.description',
      keywords: 'about.head.keywords',
    };
    return { headSlug, artwork: featuredDrawings[1] };
  }

  @Get('/faq')
  @Render('FAQ')
  FAQ() {
    const headSlug = {
      title: 'faq.head.title',
      description: 'faq.head.description',
      keywords: 'faq.head.keywords',
    };
    return { headSlug };
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
    return { headSlug, priceBoxes };
  }

  @Get('/contact')
  @Render('contact')
  contact(@Query('option') option?: string) {
    return getContactFormContext(option);
  }

  @Post('/contact')
  @Render('contact')
  @UseGuards(RecaptchaGuard)
  @UseFilters(ContactVerificationFilter)
  async contactProcess(
    @Body() formData: ContactForm,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = getContactFormData(formData);
    const page = getContactFormContext(undefined, data);
    const errors = validateFormData(data);
    if (Object.keys(errors).length) return { ...page, errors };
    try {
      await this.appService.sendContactEmail(data);
      return { ...page, success: true };
    } catch {
      response.status(503);
      return { ...page, formError: 'contact.deliveryError' };
    }
  }
}

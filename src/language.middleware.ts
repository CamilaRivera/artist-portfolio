import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { setLanguage } from './app.internationalization';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const language = req.query.lang || 'en';
    console.log(`Request... language middleware ${language}`);
    setLanguage(language);
    next();
  }
}

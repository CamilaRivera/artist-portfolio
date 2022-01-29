import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getChangeLanguageLink, setLanguage } from './app.internationalization';

function findLanguage(req: Request) {
  // return req.query.lang || 'en';
  if (req.headers.host.startsWith('en.')) {
    return 'en';
  }
  return 'es'; // default language
}

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const language = findLanguage(req);
    const url = `${req.headers.host}${req.originalUrl}`;
    console.log(`Request... language middleware "${language}", url: ${url}`);
    setLanguage(language);
    res.locals = {
      lang: {
        language,
        esUrl: getChangeLanguageLink(req.protocol, url, 'es'),
        enUrl: getChangeLanguageLink(req.protocol, url, 'en'),
        originalUrl: url,
      },
      queryPath: req.originalUrl,
    };
    next();
  }
}

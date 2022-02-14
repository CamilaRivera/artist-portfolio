import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getChangeLanguageLink, setLanguage } from './app.internationalization';

function findLanguage(req: Request) {
  // return req.query.lang || 'en';
  const host = req.headers.host;
  if (host === process.env.EN_HOST || host.startsWith('en.')) {
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
        esUrl: getChangeLanguageLink(req.protocol, req.originalUrl, 'es'),
        enUrl: getChangeLanguageLink(req.protocol, req.originalUrl, 'en'),
        originalUrl: url,
        analyticsApiKey: language === 'es' ? 'G-KXMWQ1GY5T' : 'G-DTD3L7R127',
      },
      queryPath: req.originalUrl,
    };
    next();
  }
}

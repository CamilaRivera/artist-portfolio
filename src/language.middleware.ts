import { Injectable } from '@nestjs/common';
import type { NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { withLanguage } from './app.internationalization';
import {
  getHostLanguage,
  getPageUrl,
  getSiteConfig,
  normalizePagePath,
  pagePaths,
} from './site.config';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  private readonly config = getSiteConfig();

  use(req: Request, res: Response, next: NextFunction) {
    const host = req.headers.host || '';
    const detectedLanguage = getHostLanguage(this.config, host);
    if (this.config.production && !detectedLanguage) {
      res.status(400).send('Unknown site host');
      return;
    }
    const language = detectedLanguage || 'es';
    // Nest mounts wildcard middleware on a router, where req.path can be '/'.
    // originalUrl retains the complete public page path.
    const requestedPath = req.originalUrl.split('?', 1)[0];
    const path = normalizePagePath(requestedPath);
    const canonicalUrl = getPageUrl(this.config, language, path);
    const isPageRequest =
      ['GET', 'HEAD'].includes(req.method) && pagePaths.includes(path);
    if (
      isPageRequest &&
      (requestedPath !== path ||
        (this.config.production &&
          (host.toLowerCase() !== this.config.hosts[language] || !req.secure)))
    ) {
      const queryIndex = req.originalUrl.indexOf('?');
      const query = queryIndex === -1 ? '' : req.originalUrl.slice(queryIndex);
      const destination = this.config.production ? canonicalUrl : path;
      res.redirect(301, `${destination}${query}`);
      return;
    }

    res.locals.lang = {
      language,
      esUrl: getPageUrl(this.config, 'es', path),
      enUrl: getPageUrl(this.config, 'en', path),
      canonicalUrl,
      analyticsApiKey: language === 'es' ? 'G-KXMWQ1GY5T' : 'G-DTD3L7R127',
    };
    res.locals.queryPath = path;
    withLanguage(language, next);
  }
}

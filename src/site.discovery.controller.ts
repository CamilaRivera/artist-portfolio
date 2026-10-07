import { Controller, Get, Header } from '@nestjs/common';
import { getLanguage } from './app.internationalization';
import { getPageUrl, getSiteConfig, pagePaths } from './site.config';

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

@Controller()
export class SiteDiscoveryController {
  private readonly config = getSiteConfig();

  @Get('/robots.txt')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  robots() {
    const origin = this.config.origins[getLanguage()];
    return `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;
  }

  @Get('/sitemap.xml')
  @Header('Content-Type', 'application/xml; charset=utf-8')
  sitemap() {
    const language = getLanguage();
    const entries = pagePaths.map((path) => {
      const url = escapeXml(getPageUrl(this.config, language, path));
      return `  <url><loc>${url}</loc></url>`;
    });
    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...entries,
      '</urlset>',
      '',
    ].join('\n');
  }
}

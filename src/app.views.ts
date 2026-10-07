import type { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import hbs from 'hbs';
import { getLanguage, translate } from './app.internationalization';
import { configureStylesheet } from './app.styles';
import { drawingSources } from './image.assets';
import { featuredDrawings } from './db.images';

export async function configureApplication(app: NestExpressApplication) {
  // The default supports a local reverse proxy. Set exact proxy IPs/subnets for
  // other deployments; do not trust arbitrary forwarded headers.
  app.set('trust proxy', process.env.TRUST_PROXY || 'loopback');
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.set('view options', { layout: 'layouts/layout' });
  app.setViewEngine('hbs');
  configureStylesheet(app);
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    setHeaders: (response, path) => {
      if (
        process.env.NODE_ENV === 'production' &&
        /[/\\]images[/\\]optimized[/\\][^/\\]+-[a-f0-9]{16}\.(?:webp|jpg)$/.test(
          path,
        )
      ) {
        response.setHeader(
          'Cache-Control',
          'public, max-age=31536000, immutable',
        );
      }
    },
  });
  await new Promise<void>((resolve, reject) =>
    hbs.registerPartials(
      join(__dirname, '..', 'views', 'partials'),
      (error?: Error) => (error ? reject(error) : resolve()),
    ),
  );
  hbs.registerHelper('i18n', translate);
  hbs.registerHelper('drawingSources', drawingSources);
  hbs.registerHelper('cmToInches', (value) => (0.393701 * value).toFixed(1));
  hbs.registerHelper('equals', (value1, value2) => value1 === value2);
  hbs.registerHelper('pluralize', (word, quantity) =>
    quantity <= 1 ? word : `${word}s`,
  );
  hbs.registerHelper('formatCurrency', (value) =>
    value
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, getLanguage() === 'es' ? '.' : ','),
  );
  hbs.registerHelper('multiply', (value1, value2) => value1 * value2);
  hbs.registerHelper(
    'createFunctionCall',
    (functionName, ...value) =>
      `${functionName}(${value.slice(0, -1).join(', ')})`,
  );
  hbs.registerHelper('env', (key) => process.env[key]);
  hbs.registerHelper('year', () => new Date().getFullYear());
  hbs.registerHelper('previewImageUrl', (canonicalUrl: string) => {
    const image = featuredDrawings[0].assets.display.jpg;
    const preview =
      image.find((variant) => variant.width >= 1152) || image.at(-1)!;
    return new URL(preview.url, canonicalUrl).href;
  });
}

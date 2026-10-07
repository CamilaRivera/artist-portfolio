import type { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import hbs from 'hbs';
import { getLanguage, translate } from './app.internationalization';
import { configureStylesheet } from './app.styles';

export async function configureApplication(app: NestExpressApplication) {
  // The default supports a local reverse proxy. Set exact proxy IPs/subnets for
  // other deployments; do not trust arbitrary forwarded headers.
  app.set('trust proxy', process.env.TRUST_PROXY || 'loopback');
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.set('view options', { layout: 'layouts/layout' });
  app.setViewEngine('hbs');
  configureStylesheet(app);
  await new Promise<void>((resolve, reject) =>
    hbs.registerPartials(
      join(__dirname, '..', 'views', 'partials'),
      (error?: Error) => (error ? reject(error) : resolve()),
    ),
  );
  hbs.registerHelper('i18n', translate);
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
}

import * as dotenv from 'dotenv';

dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? 'config/production.env'
      : 'config/development.env',
});

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as sassMiddleware from 'node-sass-middleware';
import hbs = require('hbs');
import hbsutilsLib = require('hbs-utils');
import { getLanguage, translate } from './app.internationalization';

const hbsutils = hbsutilsLib(hbs);

const partialsDirectory = join(__dirname, '..', 'views', 'partials');
const publicDirectory = join(__dirname, '..', 'public');
const cssDirectory = join(__dirname, '..', 'public', 'stylesheets');
const scssDirectory = join(__dirname, '..', 'scss');

hbsutils.registerPartials(partialsDirectory);
hbsutils.registerWatchedPartials(partialsDirectory);

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.set('view options', {
    layout: 'layouts/layout',
  });
  app.setViewEngine('hbs');

  hbs.registerPartials(partialsDirectory);
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

  app.use(
    sassMiddleware({
      src: scssDirectory,
      dest: cssDirectory,
      debug: true,
      prefix: '/stylesheets',
      force: true,
    }),
  );
  app.useStaticAssets(publicDirectory);

  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as sassMiddleware from 'node-sass-middleware';
import hbs = require('hbs');
import hbsutilsLib = require('hbs-utils');
import { translate } from './app.internationalization';

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
  hbs.registerHelper('cmToInches', (value) => {
    return (0.393701 * value).toFixed(1);
  });

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

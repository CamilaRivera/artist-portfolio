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
import { configureApplication } from './app.views';
import { getSiteConfig } from './site.config';

const hbsutils = hbsutilsLib(hbs);

const partialsDirectory = join(__dirname, '..', 'views', 'partials');
const publicDirectory = join(__dirname, '..', 'public');
const cssDirectory = join(__dirname, '..', 'public', 'stylesheets');
const scssDirectory = join(__dirname, '..', 'scss');

hbsutils.registerPartials(partialsDirectory);
hbsutils.registerWatchedPartials(partialsDirectory);

declare const module: any;

async function bootstrap() {
  getSiteConfig();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await configureApplication(app);

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

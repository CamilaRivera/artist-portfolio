import * as dotenv from 'dotenv';

dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? 'config/production.env'
      : 'config/development.env',
  quiet: true,
});

import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { watch } from 'node:fs';
import { AppModule } from './app.module';
import hbs from 'hbs';
import { configureApplication } from './app.views';
import { getSiteConfig } from './site.config';

const partialsDirectory = join(__dirname, '..', 'views', 'partials');

async function bootstrap() {
  getSiteConfig();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await configureApplication(app);

  if (process.env.NODE_ENV !== 'production') {
    watch(partialsDirectory, { persistent: false }, (_event, filename) => {
      if (filename?.endsWith('.hbs')) {
        hbs.registerPartials(partialsDirectory, (error?: Error) => {
          if (error) console.error('Unable to reload template partials', error);
        });
      }
    });
  }

  app.enableShutdownHooks();
  await app.listen(3000);
}
bootstrap();

import { Module } from '@nestjs/common';
import type { MiddlewareConsumer } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LanguageMiddleware } from './language.middleware';
import { SiteDiscoveryController } from './site.discovery.controller';
import { getMailerOptions } from './mail.config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => getMailerOptions(),
    }),
  ],
  controllers: [AppController, SiteDiscoveryController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LanguageMiddleware).forRoutes('{*path}');
  }
}

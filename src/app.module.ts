import { MiddlewareConsumer, Module, HttpModule } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LanguageMiddleware } from './language.middleware';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    HttpModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, // upgrade later with STARTTLS
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASS,
          },
        },
        defaults: {
          from: process.env.SMTP_EMAIL,
        },
        template: {
          dir: process.cwd() + '/views/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LanguageMiddleware).forRoutes('*');
  }
}

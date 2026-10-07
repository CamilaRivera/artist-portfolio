import { Test } from '@nestjs/testing';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'node:path';
import { AppService } from './app.service';

describe('contact email template and transport', () => {
  it('renders the real template through the upgraded mailer without SMTP delivery', async () => {
    const originalTarget = process.env.TARGET_EMAIL;
    process.env.TARGET_EMAIL = 'artist@example.com';
    const module = await Test.createTestingModule({
      imports: [
        MailerModule.forRoot({
          transport: { streamTransport: true, buffer: true, newline: 'unix' },
          defaults: { from: 'website@example.com' },
          template: {
            dir: join(__dirname, '..', 'views'),
            adapter: new HandlebarsAdapter(),
            options: { strict: true },
          },
        }),
      ],
      providers: [AppService],
    }).compile();

    try {
      const mailer = module.get(MailerService);
      const sendMail = jest.spyOn(mailer, 'sendMail');
      const log = jest
        .spyOn(console, 'log')
        .mockImplementation(() => undefined);
      const delivery = module.get(AppService).sendContactEmail({
        name: 'Test customer',
        email: 'customer@example.com',
        type: 'Single subject',
        body: 'A portrait of my cat <Luna>',
      });
      const result = await sendMail.mock.results[0].value;
      await delivery;
      expect(result.envelope.to).toEqual(['artist@example.com']);
      const email = result.message.toString();
      expect(email).toContain('Reply-To: customer@example.com');
      expect(email).toContain(
        'Subject: [Contacto retrato] - Test customer - Single subject',
      );
      expect(email).toContain('Test customer');
      // Nodemailer encodes the HTML as quoted-printable for transport.
      expect(email.replace(/=\r?\n/g, '')).toContain('&lt;Luna&gt;');
      sendMail.mockRestore();
      log.mockRestore();
    } finally {
      await module.close();
      jest.restoreAllMocks();
      if (originalTarget === undefined) delete process.env.TARGET_EMAIL;
      else process.env.TARGET_EMAIL = originalTarget;
    }
  });
});

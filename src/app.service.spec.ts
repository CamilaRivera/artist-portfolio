import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppService } from './app.service';
import { getMailerOptions } from './mail.config';

describe('contact email through Amazon SES', () => {
  const originalEnv = { ...process.env };
  const form = {
    name: 'Test customer',
    email: 'customer@example.com',
    type: 'Single subject',
    body: 'A portrait of my cat <Luna>',
  };
  let module: TestingModule;
  let sesClient: SESv2Client;
  let send: jest.SpyInstance;

  beforeEach(async () => {
    process.env.AWS_REGION = 'us-east-1';
    process.env.MAIL_FROM = 'website@flaviacanepa.cl';
    process.env.TARGET_EMAIL = 'artist@example.com';
    const options = getMailerOptions();
    sesClient = options.transport.SES.sesClient;
    send = jest.spyOn(sesClient, 'send').mockResolvedValue({
      MessageId: 'test-ses-message',
      $metadata: {},
    });
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
    module = await Test.createTestingModule({
      imports: [MailerModule.forRoot(options)],
      providers: [AppService],
    }).compile();
  });

  afterEach(async () => {
    if (module) await module.close();
    sesClient?.destroy();
    jest.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  it('sends the real template with the domain sender and visitor Reply-To', async () => {
    await module.get(AppService).sendContactEmail(form);

    expect(send).toHaveBeenCalledTimes(1);
    const command = send.mock.calls[0][0] as SendEmailCommand;
    expect(command).toBeInstanceOf(SendEmailCommand);
    expect(command.input.FromEmailAddress).toBe('website@flaviacanepa.cl');
    expect(command.input.Destination?.ToAddresses).toEqual([
      'artist@example.com',
    ]);
    const email = Buffer.from(command.input.Content!.Raw!.Data!).toString();
    expect(email).toContain('From: website@flaviacanepa.cl');
    expect(email).toContain('Reply-To: customer@example.com');
    expect(email).toContain(
      'Subject: [Contacto retrato] - Test customer - Single subject',
    );
    expect(email).toContain('Test customer');
    // Nodemailer encodes the HTML as quoted-printable for transport.
    expect(email.replace(/=\r?\n/g, '')).toContain('&lt;Luna&gt;');
  });

  it('reports SES delivery failures to the caller', async () => {
    send.mockRejectedValueOnce(new Error('SES rejected message'));

    await expect(module.get(AppService).sendContactEmail(form)).rejects.toThrow(
      'SES rejected message',
    );
  });
});

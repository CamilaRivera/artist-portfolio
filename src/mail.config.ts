import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'node:path';

export function getMailerOptions(env: NodeJS.ProcessEnv = process.env) {
  for (const key of ['AWS_REGION', 'MAIL_FROM', 'TARGET_EMAIL']) {
    if (!env[key]?.trim()) {
      throw new Error(`${key} is required for Amazon SES email delivery`);
    }
  }

  return {
    transport: {
      SES: {
        sesClient: new SESv2Client({ region: env.AWS_REGION?.trim() }),
        SendEmailCommand,
      },
    },
    defaults: {
      from: env.MAIL_FROM?.trim(),
    },
    template: {
      dir: join(process.cwd(), 'views'),
      adapter: new HandlebarsAdapter(),
      options: { strict: true },
    },
  };
}

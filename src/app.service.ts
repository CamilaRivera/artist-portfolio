import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import type { ContactForm } from './types/ContactForm';

@Injectable()
export class AppService {
  constructor(private readonly mailerService: MailerService) {}

  public getHello(): string {
    return 'Hello World!';
  }

  public async sendContactEmail(formData: ContactForm): Promise<void> {
    await this.mailerService.sendMail({
      to: process.env.TARGET_EMAIL, // List of receivers email address
      subject: `[Contacto retrato] - ${formData.name} - ${formData.type}`,
      template: 'contactEmail',
      context: formData,
      replyTo: formData.email,
    });
  }
}

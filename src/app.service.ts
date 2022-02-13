import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ContactForm } from './types/ContactForm';

@Injectable()
export class AppService {
  constructor(private readonly mailerService: MailerService) {}

  public getHello(): string {
    return 'Hello World!';
  }

  public sendContactEmail(formData: ContactForm): void {
    this.mailerService
      .sendMail({
        to: process.env.TARGET_EMAIL, // List of receivers email address
        // from: 'user@outlook.com', // Senders email address
        subject: `[Contacto retrato] - ${formData.name} - ${formData.type}`,
        template: __dirname + '/contactEmail', // The `.pug` or `.hbs` extension is appended automatically.
        context: formData,
        replyTo: formData.email,
      })
      .then((success) => {
        console.log('Success sending contact email', success);
      })
      .catch((err) => {
        console.error('Error sending contact email', err);
      });
  }
}

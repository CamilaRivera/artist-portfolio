import { Catch, ForbiddenException } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import type { Request, Response } from 'express';
import { getContactFormContext } from './utils/utils.contactForm';

@Catch(ForbiddenException)
export class ContactVerificationFilter implements ExceptionFilter {
  catch(_exception: ForbiddenException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    response.status(403).render('contact', {
      ...getContactFormContext(undefined, request.body),
      formError: 'contact.verificationError',
    });
  }
}

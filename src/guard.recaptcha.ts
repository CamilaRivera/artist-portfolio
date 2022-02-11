import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpService,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class RecaptchaGuard implements CanActivate {
  constructor(private readonly httpService: HttpService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { body } = context.switchToHttp().getRequest();
    console.log('RecaptchaGuard body', body.token);
    const { data } = await this.httpService
      .post(
        `https://www.google.com/recaptcha/api/siteverify?response=${body.token}&secret=<SECRET>`,
      )
      .toPromise();

    if (!data.success) {
      console.log(
        'Recaptcha v3 rejected! token length: ',
        (body.token || '').length,
      );
      throw new ForbiddenException();
    }

    console.log(
      'Recaptcha v3 approved! token length: ',
      (body.token || '').length,
    );
    return true;
  }
}

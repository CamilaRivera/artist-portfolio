import { Injectable, ForbiddenException } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class RecaptchaGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { body } = context.switchToHttp().getRequest();
    if (!body?.token || !process.env.RECAPTCH_V3_SECRET) {
      throw new ForbiddenException();
    }
    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        body: new URLSearchParams({
          response: body.token,
          secret: process.env.RECAPTCH_V3_SECRET,
        }),
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!response.ok) {
      throw new ForbiddenException();
    }
    const data = (await response.json()) as { success: boolean };

    if (!data.success) {
      throw new ForbiddenException();
    }

    return true;
  }
}

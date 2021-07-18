import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Language = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const language: string = request.query.lang || 'en';
    return language;
  },
);

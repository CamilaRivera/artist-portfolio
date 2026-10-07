import type { NestExpressApplication } from '@nestjs/platform-express';
import type { NextFunction, Request, Response } from 'express';
import { join } from 'node:path';
import { compileAsync } from 'sass';

export function configureStylesheet(app: NestExpressApplication) {
  let productionCss: Promise<string> | undefined;
  const compile = async () =>
    (await compileAsync(join(__dirname, '..', 'scss', 'index.scss'))).css;

  app.use(
    '/stylesheets/index.css',
    async (req: Request, res: Response, next: NextFunction) => {
      if (!['GET', 'HEAD'].includes(req.method) || req.path !== '/') {
        return next();
      }
      try {
        const css =
          process.env.NODE_ENV === 'production'
            ? await (productionCss ??= compile())
            : await compile();
        res.type('css').send(css);
      } catch (error) {
        productionCss = undefined;
        next(error);
      }
    },
  );
}

import { Test } from '@nestjs/testing';
import { Controller, Get } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { MailerService } from '@nestjs-modules/mailer';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AppService } from '../src/app.service';
import { configureApplication } from '../src/app.views';
import { RecaptchaGuard } from '../src/guard.recaptcha';
import { getLanguage, translate } from '../src/app.internationalization';
import { pagePaths } from '../src/site.config';
import type { Language } from '../src/site.config';

@Controller()
class LocaleProbeController {
  @Get('/locale-probe')
  async probe() {
    await new Promise((resolve) =>
      setTimeout(resolve, getLanguage() === 'es' ? 20 : 5),
    );
    return { language: getLanguage(), title: translate('about.title') };
  }
}

describe('language URLs and canonical pages (e2e)', () => {
  let app: NestExpressApplication;
  const originalEnv = { ...process.env };
  const sendContactEmail = jest.fn();
  const hosts = { es: 'flaviacanepa.cl', en: 'flaviacanepa.com' };
  const titles = {
    es: [
      'Flavia Canepa - Artista de Retratos',
      'Sobre Mi y mi Arte',
      'Preguntas Frecuentes',
      'Ordena tu retrato',
      'Contacto - Ordernar retrato',
    ],
    en: [
      'Flavia Canepa - Portrait artist',
      'About my Art and Me',
      'Frequently Asked Questions',
      'Commission a Portrait',
      'Contact - Commission portrait',
    ],
  };
  const cases: [Language, string][] = [];
  for (const language of ['es', 'en'] as Language[]) {
    for (const path of pagePaths) cases.push([language, path]);
  }

  beforeAll(async () => {
    process.env.NODE_ENV = 'production';
    process.env.ES_HOST = hosts.es;
    process.env.EN_HOST = hosts.en;
    process.env.TRUST_PROXY = 'loopback';
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [LocaleProbeController],
    })
      .overrideProvider(MailerService)
      .useValue({ sendMail: jest.fn() })
      .overrideProvider(AppService)
      .useValue({ sendContactEmail })
      .overrideGuard(RecaptchaGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    await configureApplication(app);
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
    process.env = originalEnv;
  });

  beforeEach(() => sendContactEmail.mockClear());

  it.each(cases)(
    '%s %s serves translated HTML with reciprocal SEO URLs',
    async (language: Language, path: string) => {
      const response = await request(app.getHttpServer())
        .get(`${path}?utm_source=test`)
        .set('Host', hosts[language])
        .set('X-Forwarded-Proto', 'https')
        .expect(200);
      const html = response.text;
      expect(html).toContain(`<html lang="${language}">`);
      expect(html).toContain(
        `<title>${titles[language][pagePaths.indexOf(path)]}</title>`,
      );
      expect(html).toContain(
        `<link rel="canonical" href="https://${hosts[language]}${path}" />`,
      );
      expect(html.match(/rel="canonical"/g)).toHaveLength(1);
      for (const alternate of ['es', 'en'] as Language[]) {
        const url = `https://${hosts[alternate]}${path}`;
        expect(html).toContain(
          `<link rel="alternate" hreflang="${alternate}" href="${url}" />`,
        );
        expect(html).toMatch(
          new RegExp(
            `href="${url}"[^>]*>\\s*${alternate.toUpperCase()}\\s*</a>`,
          ),
        );
      }
      expect(html).toContain(language === 'es' ? 'Pedidos' : 'Commissions');
      expect(html).not.toContain('localhost');
      expect(html).not.toContain('utm_source');
    },
  );

  it.each(cases)(
    '%s %s normalizes HTTP, www, and trailing slashes together',
    async (language: Language, path: string) => {
      await request(app.getHttpServer())
        .get(`${path === '/' ? '/' : `${path}/`}?utm_source=test&value=a%2Fb`)
        .set('Host', `www.${hosts[language]}`)
        .set('X-Forwarded-Proto', 'http')
        .expect(301)
        .expect(
          'Location',
          `https://${hosts[language]}${path}?utm_source=test&value=a%2Fb`,
        );
    },
  );

  it.each(cases.filter(([, path]) => path !== '/'))(
    '%s %s redirects HTTPS trailing-slash duplicates',
    async (language: Language, path: string) => {
      await request(app.getHttpServer())
        .get(`${path}/`)
        .set('Host', hosts[language])
        .set('X-Forwarded-Proto', 'https')
        .expect(301)
        .expect('Location', `https://${hosts[language]}${path}`);
    },
  );

  it('redirects uppercase page paths and HEAD requests', async () => {
    await request(app.getHttpServer())
      .head('/ABOUT/')
      .set('Host', hosts.en)
      .set('X-Forwarded-Proto', 'https')
      .expect(301)
      .expect('Location', 'https://flaviacanepa.com/about');
  });

  it('redirects HTTP on preferred hosts', async () => {
    await request(app.getHttpServer())
      .get('/about')
      .set('Host', hosts.es)
      .expect(301)
      .expect('Location', 'https://flaviacanepa.cl/about');
  });

  it('uses preserved Host rather than an arbitrary forwarded hostname', async () => {
    const response = await request(app.getHttpServer())
      .get('/about')
      .set('Host', hosts.es)
      .set('X-Forwarded-Host', hosts.en)
      .set('X-Forwarded-Proto', 'https')
      .expect(200);
    expect(response.text).toContain('<html lang="es">');
  });

  it('does not trust forwarded protocol from an untrusted connection', async () => {
    app.set('trust proxy', false);
    try {
      await request(app.getHttpServer())
        .get('/about')
        .set('Host', hosts.es)
        .set('X-Forwarded-Proto', 'https')
        .expect(301);
    } finally {
      app.set('trust proxy', 'loopback');
    }
  });

  it('rejects unknown production hosts', async () => {
    await request(app.getHttpServer())
      .get('/')
      .set('Host', 'unrelated.example')
      .expect(400);
  });

  it('leaves unknown paths as 404', async () => {
    await request(app.getHttpServer())
      .get('/missing/')
      .set('Host', hosts.es)
      .set('X-Forwarded-Proto', 'https')
      .expect(404);
  });

  it('does not redirect contact POST requests or send mail during this test', async () => {
    const response = await request(app.getHttpServer())
      .post('/contact/')
      .set('Host', `www.${hosts.en}`)
      .send({})
      .expect(201);
    expect(response.headers.location).toBeUndefined();
    expect(response.text).toContain('<html lang="en">');
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it.each(['es', 'en'] as Language[])(
    '%s accepts a browser-encoded contact form',
    async (language) => {
      const data = {
        name: 'Cliente de prueba',
        email: 'customer@example.com',
        type: 'single',
        body: 'Retrato de mi mascota',
      };
      const response = await request(app.getHttpServer())
        .post('/contact')
        .set('Host', hosts[language])
        .set('X-Forwarded-Proto', 'https')
        .type('form')
        .send(data)
        .expect(201);
      expect(response.text).toContain(
        language === 'es'
          ? 'Mensaje de contacto enviado!'
          : 'Contact message sent!',
      );
      expect(sendContactEmail).toHaveBeenCalledWith(data);
    },
  );

  it('serves compiled styles and supports HEAD and query strings', async () => {
    const css = await request(app.getHttpServer())
      .get('/stylesheets/index.css?v=test')
      .set('Host', hosts.es)
      .set('X-Forwarded-Proto', 'https')
      .expect(200)
      .expect('Content-Type', /text\/css/);
    expect(css.text).toContain('.homepage__action');
    const head = await request(app.getHttpServer())
      .head('/stylesheets/index.css')
      .set('Host', hosts.en)
      .set('X-Forwarded-Proto', 'https')
      .expect(200);
    expect(head.text).toBeUndefined();
  });

  it('leaves unknown stylesheet paths as 404', async () => {
    await request(app.getHttpServer())
      .get('/stylesheets/index.css/extra')
      .set('Host', hosts.es)
      .set('X-Forwarded-Proto', 'https')
      .expect(404);
  });

  it('keeps concurrent HTTP requests in their own languages', async () => {
    const responses = await Promise.all(
      (['es', 'en', 'es', 'en'] as Language[]).map((language) =>
        request(app.getHttpServer())
          .get('/locale-probe')
          .set('Host', hosts[language])
          .set('X-Forwarded-Proto', 'https')
          .expect(200),
      ),
    );
    expect(responses.map((response) => response.body)).toEqual([
      { language: 'es', title: 'Sobre Mi' },
      { language: 'en', title: 'About me' },
      { language: 'es', title: 'Sobre Mi' },
      { language: 'en', title: 'About me' },
    ]);
  });
});

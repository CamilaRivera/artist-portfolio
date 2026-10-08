import { Test } from '@nestjs/testing';
import { Controller, Get, ForbiddenException } from '@nestjs/common';
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
import { imageFilenames } from '../src/db.images';

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
  let verificationAllowed = true;
  const hosts = { es: 'flaviacanepa.cl', en: 'flaviacanepa.com' };
  const titles = {
    es: [
      'Retratos de mascotas a pedido | Flavia Canepa',
      'Sobre la artista de retratos de mascotas | Flavia Canepa',
      'Retratos de mascotas: preguntas frecuentes | Flavia Canepa',
      'Retratos de mascotas: tamaños y precios | Flavia Canepa',
      'Contacto: encarga tu retrato de mascota | Flavia Canepa',
    ],
    en: [
      'Custom Pet Portraits | Flavia Canepa',
      'About the Pet Portrait Artist | Flavia Canepa',
      'Pet Portrait Commissions: FAQ | Flavia Canepa',
      'Pet Portrait Sizes and Prices | Flavia Canepa',
      'Contact: Commission a Pet Portrait | Flavia Canepa',
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
    process.env.AWS_REGION = 'us-east-1';
    process.env.MAIL_FROM = 'website@flaviacanepa.cl';
    process.env.TARGET_EMAIL = 'artist@example.com';
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [LocaleProbeController],
    })
      .overrideProvider(MailerService)
      .useValue({ sendMail: jest.fn() })
      .overrideProvider(AppService)
      .useValue({ sendContactEmail })
      .overrideGuard(RecaptchaGuard)
      .useValue({
        canActivate: () => {
          if (!verificationAllowed) throw new ForbiddenException();
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    await configureApplication(app);
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
    process.env = originalEnv;
  });

  beforeEach(() => {
    sendContactEmail.mockReset();
    verificationAllowed = true;
  });

  it.each(['es', 'en'] as Language[])(
    '%s robots.txt allows crawling and advertises its own sitemap',
    async (language) => {
      const response = await request(app.getHttpServer())
        .get('/robots.txt')
        .set('Host', hosts[language])
        .set('X-Forwarded-Proto', 'https')
        .expect(200)
        .expect('Content-Type', /text\/plain; charset=utf-8/);
      expect(response.text).toBe(
        `User-agent: *\nAllow: /\n\nSitemap: https://${hosts[language]}/sitemap.xml\n`,
      );
      const head = await request(app.getHttpServer())
        .head('/robots.txt')
        .set('Host', hosts[language])
        .set('X-Forwarded-Proto', 'https')
        .expect(200)
        .expect('Content-Type', /text\/plain; charset=utf-8/);
      expect(head.text).toBeUndefined();
    },
  );

  it.each(['es', 'en'] as Language[])(
    '%s sitemap contains only its five canonical page URLs',
    async (language) => {
      const response = await request(app.getHttpServer())
        .get('/sitemap.xml?utm_source=test')
        .set('Host', hosts[language])
        .set('X-Forwarded-Proto', 'https')
        .expect(200)
        .expect('Content-Type', /application\/xml; charset=utf-8/);
      const xml = response.text;
      expect(xml).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>\n/);
      expect(xml).toContain(
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      );
      const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
        (match) => match[1],
      );
      expect(urls).toEqual(
        ['/', '/about', '/faq', '/commission-portrait', '/contact'].map(
          (path) => `https://${hosts[language]}${path}`,
        ),
      );
      expect(xml).toMatch(/<\/urlset>\n$/);
      expect(xml).not.toContain('localhost');
      expect(xml).not.toContain('utm_source');
      const head = await request(app.getHttpServer())
        .head('/sitemap.xml')
        .set('Host', hosts[language])
        .set('X-Forwarded-Proto', 'https')
        .expect(200)
        .expect('Content-Type', /application\/xml; charset=utf-8/);
      expect(head.text).toBeUndefined();
    },
  );

  it.each(['/robots.txt', '/sitemap.xml'])(
    '%s rejects unknown production hosts',
    async (path) => {
      await request(app.getHttpServer())
        .get(path)
        .set('Host', 'unrelated.example')
        .expect(400);
    },
  );

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
      expect(html.match(/<h1\b/g)).toHaveLength(1);
      expect(html.match(/<main\b/g)).toHaveLength(1);
      expect(html).toContain('name="color-scheme" content="light dark"');
      expect(html).toContain(
        'name="twitter:card" content="summary_large_image"',
      );
      expect(html).toContain(
        `property="og:url" content="https://${hosts[language]}${path}"`,
      );
      expect(html).toMatch(
        new RegExp(
          `property="og:image" content="https://${hosts[language]}/images/optimized/Bowie-display-`,
        ),
      );
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

  it.each(['es', 'en'] as Language[])(
    '%s renders WebP/JPEG alternatives with dimensions and a deferred enlargement',
    async (language) => {
      const { text: html } = await request(app.getHttpServer())
        .get('/')
        .set('Host', hosts[language])
        .set('X-Forwarded-Proto', 'https')
        .expect(200);
      const pictures = html.match(/<picture\b[^>]*>[\s\S]*?<\/picture>/g)!;
      expect(pictures).toHaveLength(imageFilenames.length + 2);
      for (const picture of pictures.slice(0, -1)) {
        expect(picture).toMatch(
          /<source type="image\/webp" srcset="[^"]+\.webp \d+w/,
        );
        expect(picture).toMatch(/src="\/images\/optimized\/[^"]+\.jpg"/);
        expect(picture).toMatch(/width="\d+"/);
        expect(picture).toMatch(/height="\d+"/);
        expect(picture).toContain(language === 'es' ? 'Dibujo' : 'drawing');
      }
      expect(pictures[0]).toContain('loading="eager"');
      expect(pictures[0]).toContain('fetchpriority="high"');
      for (const artwork of pictures.slice(1, -1)) {
        expect(artwork).toContain('loading="lazy"');
        expect(artwork).toMatch(/src="[^"]+-display-/);
      }
      expect(pictures.at(-1)).not.toMatch(/\b(?:src|srcset)=/);
      expect(html).toContain('<details class="gallery-more">');
      expect(html).toContain('<dialog class="artwork-dialog"');
    },
  );

  it.each(['jpg', 'webp'] as const)(
    'caches content-versioned %s images for one year in production',
    async (format) => {
      const url = imageFilenames[0].assets.thumbnail[format][0].url;
      const response = await request(app.getHttpServer())
        .get(url)
        .expect(200)
        .expect(
          'Content-Type',
          format === 'jpg' ? /image\/jpeg/ : /image\/webp/,
        )
        .expect('Cache-Control', 'public, max-age=31536000, immutable');
      await request(app.getHttpServer())
        .head(url)
        .expect(200)
        .expect('Cache-Control', 'public, max-age=31536000, immutable');
      await request(app.getHttpServer())
        .get(url)
        .set('If-None-Match', response.headers.etag)
        .expect(304);
    },
  );

  it.each(['es', 'en'] as Language[])(
    '%s commission artwork sizes are not overwritten by the price-option arrays',
    async (language) => {
      const response = await request(app.getHttpServer())
        .get('/commission-portrait')
        .set('Host', hosts[language])
        .set('X-Forwarded-Proto', 'https')
        .expect(200);
      const pictures = response.text.match(
        /<picture[^>]*commission-section__left[^>]*>[\s\S]*?<\/picture>/g,
      )!;
      expect(pictures).toHaveLength(2);
      for (const picture of pictures) {
        expect(picture).toContain('sizes="(min-width: 768px) 15rem, 6rem"');
        expect(picture).not.toContain('[object Object]');
      }
    },
  );

  it('keeps development and unversioned assets on ordinary caching', async () => {
    await request(app.getHttpServer())
      .get(`/images/drawings/1x/${imageFilenames[0].name}`)
      .expect(200)
      .expect('Cache-Control', 'public, max-age=0');
    process.env.NODE_ENV = 'development';
    try {
      await request(app.getHttpServer())
        .get(imageFilenames[0].assets.thumbnail.webp[0].url)
        .expect(200)
        .expect('Cache-Control', 'public, max-age=0');
    } finally {
      process.env.NODE_ENV = 'production';
    }
  });

  it.each(['es', 'en'] as Language[])(
    '%s carries a chosen portrait into the form without changing the canonical URL',
    async (language) => {
      const { text: html } = await request(app.getHttpServer())
        .get('/contact?option=1-18x24')
        .set('Host', hosts[language])
        .set('X-Forwarded-Proto', 'https')
        .expect(200);
      expect(html).toMatch(/<option value="[^"]*18 × 24 cm[^"]*"\s+selected/);
      expect(html).toContain(language === 'es' ? '$70.000 CLP' : '$110 USD');
      expect(html).toContain(
        `rel="canonical" href="https://${hosts[language]}/contact"`,
      );
      expect(html).not.toContain('class="mobile-actions"');
      const { text: general } = await request(app.getHttpServer())
        .get('/contact?option=unknown')
        .set('Host', hosts[language])
        .set('X-Forwarded-Proto', 'https')
        .expect(200);
      expect(general).toMatch(
        new RegExp(
          `<option value="${language === 'es' ? 'Ayúdame a elegir' : 'Help me choose'}"\\s+selected`,
        ),
      );
    },
  );

  it.each(['es', 'en'] as Language[])(
    '%s preserves form values and renders a retry message after mail failure',
    async (language) => {
      sendContactEmail.mockRejectedValueOnce(new Error('SMTP unavailable'));
      const { text: html } = await request(app.getHttpServer())
        .post('/contact')
        .set('Host', hosts[language])
        .set('X-Forwarded-Proto', 'https')
        .type('form')
        .send({
          name: 'A name with spaces',
          email: 'customer@example.com',
          type: 'Custom portrait',
          body: 'Two cats <together>',
        })
        .expect(503);
      expect(html).toContain('value="A name with spaces"');
      expect(html).toContain('Two cats &lt;together&gt;');
      expect(html).toContain('role="alert"');
      expect(html).toContain(
        language === 'es'
          ? 'No se pudo enviar tu mensaje'
          : 'Your message couldn&#x27;t be sent',
      );
      expect(html).not.toContain('form-feedback--success');
    },
  );

  it('returns a usable form after verification fails and never sends email', async () => {
    verificationAllowed = false;
    const { text: html } = await request(app.getHttpServer())
      .post('/contact')
      .set('Host', hosts.en)
      .set('X-Forwarded-Proto', 'https')
      .type('form')
      .send({
        name: 'Customer',
        email: 'customer@example.com',
        type: 'Help me choose',
        body: 'A cat portrait',
      })
      .expect(403);
    expect(html).toContain('class="contact-form"');
    expect(html).toContain('value="Customer"');
    expect(html).toContain('A cat portrait');
    expect(html).toContain('We couldn&#x27;t complete the spam check');
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it('validates email addresses and preserves safely escaped form input', async () => {
    const { text: html } = await request(app.getHttpServer())
      .post('/contact')
      .set('Host', hosts.en)
      .set('X-Forwarded-Proto', 'https')
      .type('form')
      .send({
        name: 'Someone "quoted"',
        email: 'invalid',
        type: 'Help me choose',
        body: '<script>alert(1)</script>',
      })
      .expect(201);
    expect(html).toContain('aria-describedby="email-error"');
    expect(html).toContain('value="Someone &quot;quoted&quot;"');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(sendContactEmail).not.toHaveBeenCalled();
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

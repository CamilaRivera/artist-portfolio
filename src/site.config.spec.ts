import { getHostLanguage, getPageUrl, getSiteConfig } from './site.config';

describe('site configuration', () => {
  const production = {
    NODE_ENV: 'production',
    ES_HOST: 'flaviacanepa.cl',
    EN_HOST: 'flaviacanepa.com',
  };

  it('generates HTTPS URLs without tracking queries or trailing slashes', () => {
    const config = getSiteConfig(production);
    expect(getPageUrl(config, 'es', '/about/?utm_source=test')).toBe(
      'https://flaviacanepa.cl/about',
    );
    expect(getPageUrl(config, 'en', '/')).toBe('https://flaviacanepa.com/');
  });

  it('keeps local development language origins', () => {
    const config = getSiteConfig({
      NODE_ENV: 'development',
      ES_HOST: 'es.localhost:3000',
      EN_HOST: 'en.localhost:3000',
    });
    expect(getPageUrl(config, 'en', '/about')).toBe(
      'http://en.localhost:3000/about',
    );
    expect(getHostLanguage(config, 'EN.LOCALHOST:3000')).toBe('en');
  });

  it.each([
    undefined,
    '',
    'en.localhost:3000',
    'localhost',
    '127.0.0.1',
    '[::1]',
    'https://flaviacanepa.com',
    'flaviacanepa.com/path',
    'flaviacanepa.com?query=value',
    'user@flaviacanepa.com',
    'www.flaviacanepa.com',
  ])('rejects invalid production host %s', (host) => {
    expect(() => getSiteConfig({ ...production, EN_HOST: host })).toThrow(
      'EN_HOST',
    );
  });

  it('rejects identical language hosts', () => {
    expect(() =>
      getSiteConfig({ ...production, EN_HOST: production.ES_HOST }),
    ).toThrow('different language sites');
  });

  it('recognizes aliases without accepting unrelated or missing hosts', () => {
    const config = getSiteConfig(production);
    expect(getHostLanguage(config, 'www.flaviacanepa.com:443')).toBe('en');
    expect(
      getHostLanguage(config, 'flaviacanepa.com.example.org'),
    ).toBeUndefined();
    expect(getHostLanguage(config, '')).toBeUndefined();
  });
});

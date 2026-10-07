export type Language = 'es' | 'en';

export const pagePaths = [
  '/',
  '/about',
  '/faq',
  '/commission-portrait',
  '/contact',
];

export function getSiteConfig(env: NodeJS.ProcessEnv = process.env) {
  const production = env.NODE_ENV === 'production';
  const protocol = production ? 'https:' : 'http:';
  const origins = {} as Record<Language, string>;
  const hosts = {} as Record<Language, string>;

  for (const language of ['es', 'en'] as Language[]) {
    const key = language === 'es' ? 'ES_HOST' : 'EN_HOST';
    const host = env[key];
    let url: URL;
    try {
      url = new URL(`${protocol}//${host}`);
    } catch {
      throw new Error(`${key} must be a hostname, optionally including a port`);
    }
    if (
      !host ||
      host.toLowerCase() !== url.host ||
      url.pathname !== '/' ||
      url.search ||
      url.hash ||
      url.username ||
      url.password ||
      (production &&
        (url.hostname === 'localhost' ||
          url.hostname.endsWith('.localhost') ||
          url.hostname === '127.0.0.1' ||
          url.hostname === '[::1]' ||
          url.hostname.startsWith('www.')))
    ) {
      throw new Error(
        `${key} must be a valid preferred ${
          production ? 'production ' : ''
        }hostname`,
      );
    }
    origins[language] = url.origin;
    hosts[language] = url.host;
  }
  if (hosts.es === hosts.en) {
    throw new Error(
      'ES_HOST and EN_HOST must identify different language sites',
    );
  }
  return { production, origins, hosts };
}

export type SiteConfig = ReturnType<typeof getSiteConfig>;

export function normalizePagePath(path: string) {
  return path.split(/[?#]/, 1)[0].replace(/\/+$/, '').toLowerCase() || '/';
}

export function getPageUrl(
  config: SiteConfig,
  language: Language,
  path: string,
) {
  return `${config.origins[language]}${normalizePagePath(path)}`;
}

export function getHostLanguage(
  config: SiteConfig,
  host: string,
): Language | undefined {
  let hostname: string;
  try {
    hostname = new URL(`http://${host}`).hostname;
  } catch {
    return undefined;
  }
  for (const language of ['es', 'en'] as Language[]) {
    const preferred = new URL(config.origins[language]).hostname;
    if (hostname === preferred || hostname === `www.${preferred}`) {
      return language;
    }
  }
  return undefined;
}

import {
  getLanguage,
  translate,
  withLanguage,
} from './app.internationalization';
import type { Language } from './site.config';

describe('request language context', () => {
  it('isolates translations across overlapping asynchronous requests', async () => {
    const jobs = (['es', 'en', 'es', 'en'] as Language[]).map(
      (language, index) =>
        withLanguage(language, async () => {
          await new Promise((resolve) => setTimeout(resolve, 10 - index));
          return { language: getLanguage(), title: translate('about.title') };
        }),
    );
    expect(await Promise.all(jobs)).toEqual([
      { language: 'es', title: 'Sobre Mi' },
      { language: 'en', title: 'About me' },
      { language: 'es', title: 'Sobre Mi' },
      { language: 'en', title: 'About me' },
    ]);
    expect(getLanguage()).toBe('es');
  });
});

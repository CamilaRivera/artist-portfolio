import { I18n } from 'i18n';
import { join } from 'path';
import { AsyncLocalStorage } from 'async_hooks';
import { Language } from './site.config';

const i18n = new I18n();
const languageContext = new AsyncLocalStorage<Language>();

i18n.configure({
  locales: ['en', 'es'],
  directory: join(__dirname, '..', 'locales'),
  objectNotation: true,
});

const isString = (value) =>
  typeof value === 'string' || value instanceof String;

export const translate = (...text) => {
  return i18n.__({
    phrase: text.filter(isString).join('.'),
    locale: getLanguage(),
  });
};

export const getLanguage = () => languageContext.getStore() || 'es';

export const withLanguage = <T>(language: Language, callback: () => T): T =>
  languageContext.run(language, callback);

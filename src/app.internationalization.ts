import { I18n } from 'i18n';
import { join } from 'path';

const i18n = new I18n();

i18n.configure({
  locales: ['en', 'es'],
  directory: join(__dirname, '..', 'locales'),
  objectNotation: true,
});

const isString = (value) =>
  typeof value === 'string' || value instanceof String;

export const translate = (...text) => {
  return i18n.__(text.filter(isString).join('.'));
};

export const setLanguage = (lang) => {
  i18n.setLocale(lang);
};

export const getLanguage = () => i18n.getLocale();

export const getChangeLanguageLink = (protocol, url, lang) => {
  if (url.startsWith('en') || url.startsWith('es')) {
    // Language already included
    url = url.replace(/^(es|en)[.]/i, `${lang}.`);
  } else {
    url = `${lang}.${url}`;
  }
  return `${protocol}://${url}`;
};

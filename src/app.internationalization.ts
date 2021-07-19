import { I18n } from 'i18n';
import { join } from 'path';

const i18n = new I18n();

i18n.configure({
  locales: ['en', 'es'],
  directory: join(__dirname, '..', 'locales'),
  objectNotation: true,
});

export const translate = (text) => {
  return i18n.__(text);
};

export const setLanguage = (lang) => {
  i18n.setLocale(lang);
};

export const getChangeLanguageLink = (protocol, url, lang) => {
  if (url.startsWith('en') || url.startsWith('es')) {
    // Language already included
    url = url.replace(/^(es|en)[.]/i, `${lang}.`);
  } else {
    url = `${protocol}://${lang}.${url}`;
  }
  return `${protocol}://${url}`;
};

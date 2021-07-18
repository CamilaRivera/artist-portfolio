import { I18n } from 'i18n';
import { join } from 'path';

const i18n = new I18n();

i18n.configure({
  locales: ['en', 'es'],
  directory: join(__dirname, '..', 'locales'),
});

export const translate = (text) => {
  return i18n.__(text);
};

export const setLanguage = (lang) => {
  i18n.setLocale(lang);
};

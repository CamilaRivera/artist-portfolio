import type { ContactForm } from '../types/ContactForm';
import { getCommisionsPriceOptions } from './utils.commisions';
import { translate } from '../app.internationalization';

export const getContactFormData = (formData: ContactForm): ContactForm =>
  Object.fromEntries(
    ['name', 'email', 'type', 'body'].map((key) => {
      const value = formData?.[key as keyof ContactForm];
      return [key, typeof value === 'string' ? value : ''];
    }),
  );

export const validateFormData = (formData: ContactForm) => {
  const errors: { [inputName: string]: string } = {};
  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'contactForm.errors.email';
  }
  if (!formData.name || !formData.name.trim()) {
    errors.name = 'contactForm.errors.name';
  }
  if (!formData.type || !formData.type.trim()) {
    errors.type = 'contactForm.errors.type';
  }
  return errors;
};

export const getContactFormContext = (
  option?: unknown,
  submitted?: ContactForm,
) => {
  const headSlug = {
    title: 'contact.head.title',
    description: 'contact.head.description',
    keywords: 'contact.head.keywords',
  };
  const priceBoxes = getCommisionsPriceOptions();
  const priceOptions = priceBoxes.flatMap((group) => group.sizes);
  const chosen = priceOptions.find((item) => item.id === option);
  const help = translate('contactForm.inputs.helpOption');
  const data = submitted
    ? getContactFormData(submitted)
    : { type: chosen?.label || help };
  const options = [
    ...priceOptions.map((item) => ({ value: item.label, label: item.label })),
    {
      value: translate('contactForm.inputs.otherOption'),
      label: translate('contactForm.inputs.otherOption'),
    },
    { value: help, label: help },
  ];
  // Preserve previously submitted descriptions, including existing form clients.
  if (data.type && !options.some((item) => item.value === data.type)) {
    options.unshift({ value: data.type, label: data.type });
  }
  return {
    headSlug,
    priceBoxes,
    data,
    options: options.map((item) => ({
      ...item,
      selected: item.value === data.type,
    })),
  };
};

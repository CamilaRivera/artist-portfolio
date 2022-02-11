import { ContactForm } from 'src/types/ContactForm';
import { getCommisionsPriceOptions } from './utils.commisions';

export const validateFormData = (formData: ContactForm) => {
  const errors: { [inputName: string]: string } = {};
  if (!formData.email || !formData.email.trim()) {
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

export const getContactFormContext = () => {
  const headSlug = {
    title: 'contact.head.title',
    description: 'contact.head.description',
    keywords: 'contact.head.keywords',
  };
  const priceBoxes = getCommisionsPriceOptions();
  return { headSlug, priceBoxes, data: {} };
};

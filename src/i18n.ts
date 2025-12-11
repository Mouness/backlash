import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './assets/locales/en/translation.json';
import fr from './assets/locales/fr/translation.json';
import de from './assets/locales/de/translation.json';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  de: { translation: de },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'fr',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

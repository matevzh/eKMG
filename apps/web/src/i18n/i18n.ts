import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import slTranslations from './locales/sl.json';
import deTranslations from './locales/de.json';

// Initialize i18next
i18n
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      sl: {
        translation: slTranslations,
      },
      de: {
        translation: deTranslations,
      },
    },
    lng: localStorage.getItem('language') || 'sl', // Default language from localStorage or English
    fallbackLng: 'sl', // Fallback to English if translation is missing
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    debug: false, // Set to true during development to see missing translations
  });

export default i18n;

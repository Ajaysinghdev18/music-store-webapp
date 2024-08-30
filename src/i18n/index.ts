import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import de from './de.json';
import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import nl from './nl.json';

const resources = {
  de: {
    translation: de
  },
  en: {
    translation: en
  },
  fr: {
    translation: fr
  },
  nl: {
    translation: nl
  },
  es: {
    translation: es
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',

  interpolation: {
    escapeValue: false
  }
});

export default i18n;

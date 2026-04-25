import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import tr from './locales/tr.json';
import ar from './locales/ar.json';

export type AppLanguage = 'tr' | 'en' | 'ar';

const resources = { tr: { translation: tr }, en: { translation: en }, ar: { translation: ar } } as const;

const device = Localization.getLocales()[0];
const code = device?.languageCode;
const initialLng: AppLanguage =
  code === 'ar' || code === 'en' || code === 'tr' ? code : 'tr';

i18n.use(initReactI18next).init({
  resources,
  lng: initialLng,
  fallbackLng: 'tr',
  compatibilityJSON: 'v4',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export { i18n, initialLng };

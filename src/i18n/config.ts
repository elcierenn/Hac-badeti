import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import tr from './locales/tr.json';
import ar from './locales/ar.json';
import ur from './locales/ur.json';
import id from './locales/id.json';
import bn from './locales/bn.json';
import fr from './locales/fr.json';
import fa from './locales/fa.json';

export type AppLanguage = 'tr' | 'en' | 'ar' | 'ur' | 'id' | 'bn' | 'fr' | 'fa';

export const APP_LANGUAGES: AppLanguage[] = ['tr', 'en', 'ar', 'ur', 'id', 'bn', 'fr', 'fa'];

const resources = {
  tr: { translation: tr },
  en: { translation: en },
  ar: { translation: ar },
  ur: { translation: ur },
  id: { translation: id },
  bn: { translation: bn },
  fr: { translation: fr },
  fa: { translation: fa },
} as const;

function isAppLanguage(code: string | null | undefined): code is AppLanguage {
  return !!code && (APP_LANGUAGES as string[]).includes(code);
}

const device = Localization.getLocales()[0];
const code = device?.languageCode;
const initialLng: AppLanguage = isAppLanguage(code) ? code : 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: initialLng,
  fallbackLng: 'en',
  compatibilityJSON: 'v4',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export { i18n, initialLng };

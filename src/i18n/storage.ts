import type { AppLanguage } from './config';
import { appStorage } from '../lib/mmkv';

const KEY = 'language';

function isAppLanguage(v: string | undefined): v is AppLanguage {
  return v === 'tr' || v === 'en' || v === 'ar';
}

export function getStoredLanguage(): AppLanguage | null {
  const raw = appStorage.getString(KEY);
  return isAppLanguage(raw) ? raw : null;
}

export function setStoredLanguage(lang: AppLanguage): void {
  appStorage.set(KEY, lang);
}

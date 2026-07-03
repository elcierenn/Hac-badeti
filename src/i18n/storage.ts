import AsyncStorage from '@react-native-async-storage/async-storage';

import { APP_LANGUAGES, type AppLanguage } from './config';

const KEY = 'language';

function isAppLanguage(v: string | undefined): v is AppLanguage {
  return !!v && (APP_LANGUAGES as string[]).includes(v);
}

export async function getStoredLanguage(): Promise<AppLanguage | null> {
  const raw = await AsyncStorage.getItem(KEY);
  if (raw == null) return null;
  return isAppLanguage(raw) ? raw : null;
}

export async function setStoredLanguage(lang: AppLanguage): Promise<void> {
  await AsyncStorage.setItem(KEY, lang);
}

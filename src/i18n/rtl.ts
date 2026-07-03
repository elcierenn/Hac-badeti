import { I18nManager, Platform } from 'react-native';
import * as Updates from 'expo-updates';

import type { AppLanguage } from './config';

const RTL_LANGUAGES: AppLanguage[] = ['ar', 'ur', 'fa'];

export function isLanguageRtl(lang: AppLanguage): boolean {
  return RTL_LANGUAGES.includes(lang);
}

function setWebDocumentDir(rtl: boolean) {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
}

/**
 * Arapça metin için bileğimsel düzen (writingDirection/textAlign vb.) kullanıyoruz;
 * `I18nManager.forceRTL(true)` kullanmıyoruz — küresel ayna yatay pager ana görev
 * sırasını (1→8) ve düğüm yerlerini ters çevirir; production/TestFlight’ta özellikle belirgin olur.
 *
 * Eskiden forceRTL kullanan yüklü sürümlerden yükselten kullanıcılar için: native RTL
 * açıksa bir kez reload ile normale döndürülür.
 */
export async function applyLayoutDirectionForLanguage(lang: AppLanguage): Promise<void> {
  const webRtl = isLanguageRtl(lang);
  setWebDocumentDir(webRtl);

  if (Platform.OS === 'web') return;

  const hadNativeRtlMirror = I18nManager.isRTL;

  try {
    I18nManager.swapLeftAndRightInRTL(false);
  } catch {
    //
  }

  I18nManager.allowRTL(true);
  I18nManager.forceRTL(false);

  if (!hadNativeRtlMirror) return;

  try {
    if (typeof Updates.reloadAsync === 'function') {
      await Updates.reloadAsync();
    }
  } catch {
    //
  }
}

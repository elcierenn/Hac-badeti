import { I18nManager, Platform } from 'react-native';
import * as Updates from 'expo-updates';

import type { AppLanguage } from './config';

export function isLanguageRtl(lang: AppLanguage): boolean {
  return lang === 'ar';
}

function setWebDocumentDir(rtl: boolean) {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
}

/**
 * Arapçaya (veya LTR dillerine) geçerken yerel düzende tam tutarlılık için
 * yön değişiminde uygulama yeniden yüklenir. Geliştirme modunda
 * `Updates.reloadAsync` her zaman mevcut olmayabilir; o zaman Metro ile `r` ile yenileyin.
 */
export async function applyLayoutDirectionForLanguage(lang: AppLanguage) {
  const needRtl = isLanguageRtl(lang);
  setWebDocumentDir(needRtl);

  if (I18nManager.isRTL === needRtl) return;

  I18nManager.allowRTL(needRtl);
  I18nManager.forceRTL(needRtl);

  if (Platform.OS === 'web') return;

  try {
    if (typeof Updates.reloadAsync === 'function') {
      await Updates.reloadAsync();
    }
  } catch {
    // Dev client / sınırlı ortamlar: yenileme yok, kullanıcı manuel reload yapabilir.
  }
}

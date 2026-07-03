import { isLanguageRtl } from '../i18n/rtl';
import type { AppLanguage } from '../i18n/config';

/**
 * Veri dosyalarında Türkçe alan adı temel (`baslik`), diğer diller `${alan}_${dil}`
 * suffix'iyle tutulur (örn. `baslik_en`, `baslik_ur`). Eksik çeviri varsa Türkçe'ye düşer.
 */
export function pickLang<T extends Record<string, unknown>>(
  item: T,
  baseField: string,
  lang: AppLanguage,
): string {
  const base = item[baseField] as string;
  if (lang === 'tr') return base;
  const value = item[`${baseField}_${lang}`] as string | undefined;
  return value && value.length > 0 ? value : base;
}

export { isLanguageRtl };

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ActivityIndicator, I18nManager, StyleSheet, View } from 'react-native';

import { i18n, initialLng, type AppLanguage } from '../i18n/config';
import { applyLayoutDirectionForLanguage, isLanguageRtl } from '../i18n/rtl';
import { getStoredLanguage, setStoredLanguage } from '../i18n/storage';
import { colors } from '../theme/tokens';

type Ctx = {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => Promise<void>;
  isRtl: boolean;
};

const LanguageContext = createContext<Ctx | null>(null);

type Props = { children: ReactNode };

export function LanguageProvider({ children }: Props) {
  const [ready, setReady] = useState(false);
  const [language, setLanguageState] = useState<AppLanguage>(initialLng);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const stored = getStoredLanguage();
      const next = stored ?? initialLng;
      if (cancelled) return;
      setLanguageState(next);
      await i18n.changeLanguage(next);
      if (isLanguageRtl(next) !== I18nManager.isRTL) {
        await applyLayoutDirectionForLanguage(next);
      }
      if (!cancelled) setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const setLanguage = useCallback(async (lang: AppLanguage) => {
    setLanguageState(lang);
    setStoredLanguage(lang);
    await i18n.changeLanguage(lang);
    if (isLanguageRtl(lang) !== I18nManager.isRTL) {
      await applyLayoutDirectionForLanguage(lang);
    }
  }, []);

  const isRtl = useMemo(() => isLanguageRtl(language), [language]);

  const value = useMemo(
    () => ({ language, setLanguage, isRtl }),
    [language, setLanguage, isRtl],
  );

  if (!ready) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});

export function useAppLanguage() {
  const v = useContext(LanguageContext);
  if (!v) throw new Error('useAppLanguage must be used within LanguageProvider');
  return v;
}

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppLanguage } from '../src/context/LanguageContext';
import type { AppLanguage } from '../src/i18n/config';

const GOLD = '#C9A84C';
const DARK_TEXT = '#1a1a1a';
const OVERLAY = 'rgba(0,0,0,0.55)';

const LANGS: AppLanguage[] = ['tr', 'en', 'ar'];

export default function Index() {
  const { t } = useTranslation();
  const router = useRouter();
  const { language, setLanguage, isRtl } = useAppLanguage();

  const onHacaBasla = useCallback(() => {
    router.push('/ana-gorev');
  }, [router]);

  return (
    <View style={styles.root}>
      <Image
        source={require('../assets/images/hac_ibadeti_anasayfa.jpeg')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={0}
        priority="high"
      />
      <View style={[StyleSheet.absoluteFill, styles.overlay]} />
      <StatusBar
        style="light"
        hidden
        translucent
        backgroundColor="transparent"
      />

      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.content}>
          <View style={styles.topBlock}>
            <Text style={[styles.bismillah, isRtl && styles.textRtlUi]} selectable={false}>
              {t('home.bismillah')}
            </Text>
            <Text
              style={[styles.title, isRtl && styles.textRtlUi]}
              accessibilityRole="header"
              selectable={false}
            >
              {t('common.appTitle')}
            </Text>
            <Text style={[styles.subtitle, isRtl && styles.textRtlUi]} selectable={false}>
              {t('home.subtitle')}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.bottomBlock}>
            <Pressable
              onPress={onHacaBasla}
              style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
              accessibilityLabel={t('home.startCta')}
              accessibilityRole="button"
            >
              <Text style={styles.primaryBtnText}>{t('home.startCta')}</Text>
            </Pressable>

            <View style={styles.langRow}>
              {LANGS.map((code, i) => (
                <View key={code} style={styles.langItem}>
                  {i > 0 ? <Text style={styles.langSep}>|</Text> : null}
                  <Pressable
                    onPress={() => void setLanguage(code)}
                    hitSlop={8}
                    accessibilityLabel={t('common.selectLanguage') + `: ${t(`languages.${code}`)}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: language === code }}
                  >
                    <Text
                      style={[
                        styles.langText,
                        language === code && styles.langTextActive,
                      ]}
                    >
                      {t(`languages.${code}`)}
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  overlay: { backgroundColor: OVERLAY },
  safe: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  topBlock: { alignItems: 'center' },
  bismillah: {
    color: GOLD,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 12,
    writingDirection: 'rtl',
  },
  title: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.76)',
    fontSize: 17,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  divider: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 200,
    height: 1,
    backgroundColor: GOLD,
    marginVertical: 32,
    opacity: 0.9,
  },
  bottomBlock: { width: '100%', gap: 20 },
  primaryBtn: {
    backgroundColor: GOLD,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnPressed: { opacity: 0.9 },
  primaryBtnText: {
    color: DARK_TEXT,
    fontSize: 18,
    fontWeight: '800',
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  langItem: { flexDirection: 'row', alignItems: 'center' },
  langSep: {
    color: 'rgba(255,255,255,0.5)',
    marginHorizontal: 10,
    fontSize: 14,
  },
  langText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    fontWeight: '500',
  },
  langTextActive: { color: GOLD, fontWeight: '800' },
  textRtlUi: {
    writingDirection: 'rtl',
    textAlign: 'center',
  },
});

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LanguageSwitcherModal } from '../src/components/LanguageSwitcherModal';
import { useAppLanguage } from '../src/context/LanguageContext';
import { usePurchase } from '../src/context/PurchaseContext';

const GOLD = '#C9A84C';
const DARK_TEXT = '#1a1a1a';
const OVERLAY = 'rgba(0,0,0,0.55)';

export default function Index() {
  const { t } = useTranslation();
  const router = useRouter();
  const { language, isRtl } = useAppLanguage();
  const { isAdFree } = usePurchase();
  const [langModalVisible, setLangModalVisible] = useState(false);

  const onHacaBasla = useCallback(() => {
    router.push('/ana-gorev');
  }, [router]);

  return (
    <View style={styles.root}>
      <Image
        source={require('../assets/images/hac_ibadetianasayfa.png')}
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
        {!isAdFree && (
          <Pressable
            onPress={() => router.push('/reklam-kaldir')}
            style={({ pressed }) => [
              styles.noAdsBtn,
              isRtl ? styles.noAdsBtnRtl : styles.noAdsBtnLtr,
              pressed && { opacity: 0.85 },
            ]}
            accessibilityRole="button"
            accessibilityLabel={t('homeExtra.removeAdsCta')}
          >
            <Text style={styles.noAdsIcon}>🚫</Text>
            <Text style={styles.noAdsText}>{t('homeExtra.removeAdsCta')}</Text>
          </Pressable>
        )}
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
            <Pressable
              onPress={() => router.push('/araclar')}
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.secondaryBtnPressed]}
              accessibilityLabel={t('homeExtra.toolsCta')}
              accessibilityRole="button"
            >
              <Text style={styles.secondaryBtnText}>{t('homeExtra.toolsCta')}</Text>
            </Pressable>

            <Pressable
              onPress={() => setLangModalVisible(true)}
              style={({ pressed }) => [styles.langBtn, pressed && { opacity: 0.85 }]}
              accessibilityRole="button"
              accessibilityLabel={t('common.selectLanguage') + `: ${t(`languages.${language}`)}`}
            >
              <Text style={styles.langBtnIcon}>🌐</Text>
              <Text style={styles.langBtnText}>{t(`languages.${language}`)}</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <LanguageSwitcherModal visible={langModalVisible} onClose={() => setLangModalVisible(false)} />
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
  secondaryBtn: {
    borderWidth: 1.5,
    borderColor: GOLD,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(201,168,76,0.08)',
  },
  secondaryBtnPressed: { opacity: 0.85 },
  secondaryBtnText: {
    color: GOLD,
    fontSize: 16,
    fontWeight: '700',
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.5)',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  langBtnIcon: { fontSize: 15 },
  langBtnText: { color: GOLD, fontSize: 14, fontWeight: '700' },
  textRtlUi: {
    writingDirection: 'rtl',
    textAlign: 'center',
  },
  noAdsBtn: {
    position: 'absolute',
    top: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.6)',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    zIndex: 10,
  },
  noAdsBtnLtr: { right: 16 },
  noAdsBtnRtl: { left: 16, flexDirection: 'row-reverse' },
  noAdsIcon: { fontSize: 14 },
  noAdsText: { color: GOLD, fontSize: 12, fontWeight: '700' },
});

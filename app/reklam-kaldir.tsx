import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppLanguage } from '../src/context/LanguageContext';
import { usePurchase } from '../src/context/PurchaseContext';

const BG = '#ECE6DC';
const GOLD = '#C9A84C';
const DARK_TEXT = '#1a1a1a';

const FAYDALAR = [
  { icon: '🚫', key: 'noBanner' },
  { icon: '✨', key: 'noInterstitial' },
  { icon: '🤲', key: 'support' },
  { icon: '♾️', key: 'forever' },
] as const;

export default function ReklamKaldirScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isRtl } = useAppLanguage();
  const { isAdFree, adRemovalProduct, purchasing, purchaseAdRemoval, restorePurchases } = usePurchase();

  const fiyat = adRemovalProduct?.displayPrice ?? '$2.99';

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.8 }]}
            accessibilityRole="button"
            accessibilityLabel={t('reklamKaldir.backA11y')}
          >
            <Text style={styles.backArrow}>{isRtl ? '→' : '←'}</Text>
          </Pressable>
          <Text style={[styles.headerTitle, isRtl && styles.rtlText]}>{t('reklamKaldir.title')}</Text>
          <View style={styles.spacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.heroIconWrap}>
            <Text style={styles.heroIcon}>🕊️</Text>
          </View>

          <Text style={[styles.heroTitle, isRtl && styles.rtlText]}>{t('reklamKaldir.heroTitle')}</Text>
          <Text style={[styles.heroDesc, isRtl && styles.rtlText]}>{t('reklamKaldir.heroDesc')}</Text>

          <View style={styles.kart}>
            {FAYDALAR.map(({ icon, key }) => (
              <View key={key} style={[styles.faydaRow, isRtl && styles.faydaRowRtl]}>
                <Text style={styles.faydaIcon}>{icon}</Text>
                <Text style={[styles.faydaText, isRtl && styles.rtlText]}>
                  {t(`reklamKaldir.benefits.${key}`)}
                </Text>
              </View>
            ))}
          </View>

          {isAdFree ? (
            <View style={styles.activeBanner}>
              <Text style={styles.activeBannerText}>{t('reklamKaldir.alreadyOwned')}</Text>
            </View>
          ) : (
            <>
              <Pressable
                onPress={() => void purchaseAdRemoval()}
                disabled={purchasing}
                style={({ pressed }) => [
                  styles.buyBtn,
                  pressed && styles.buyBtnPressed,
                  purchasing && styles.buyBtnDisabled,
                ]}
                accessibilityRole="button"
                accessibilityLabel={t('reklamKaldir.buyCta', { price: fiyat })}
              >
                {purchasing ? (
                  <ActivityIndicator color={DARK_TEXT} />
                ) : (
                  <Text style={styles.buyBtnText}>{t('reklamKaldir.buyCta', { price: fiyat })}</Text>
                )}
              </Pressable>

              <Pressable
                onPress={() => void restorePurchases()}
                style={({ pressed }) => [styles.restoreBtn, pressed && { opacity: 0.7 }]}
                accessibilityRole="button"
              >
                <Text style={styles.restoreBtnText}>{t('reklamKaldir.restoreCta')}</Text>
              </Pressable>
            </>
          )}

          <Text style={[styles.note, isRtl && styles.rtlText]}>{t('reklamKaldir.note')}</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  safe: { flex: 1 },
  rtlText: { textAlign: 'right', writingDirection: 'rtl' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { color: GOLD, fontSize: 24, fontWeight: '600', lineHeight: 28 },
  headerTitle: { flex: 1, color: '#5C481C', fontSize: 19, fontWeight: '800', textAlign: 'center' },
  spacer: { minWidth: 44 },
  content: { paddingHorizontal: 24, paddingBottom: 48, alignItems: 'center' },
  heroIconWrap: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: 'rgba(201,168,76,0.16)',
    alignItems: 'center', justifyContent: 'center',
    marginTop: 12, marginBottom: 20,
  },
  heroIcon: { fontSize: 44 },
  heroTitle: {
    color: '#5C481C', fontSize: 24, fontWeight: '800',
    textAlign: 'center', marginBottom: 10,
  },
  heroDesc: {
    color: '#6b5d44', fontSize: 15, lineHeight: 22,
    textAlign: 'center', marginBottom: 28,
  },
  kart: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    gap: 16,
    marginBottom: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  faydaRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  faydaRowRtl: { flexDirection: 'row-reverse' },
  faydaIcon: { fontSize: 24, width: 32, textAlign: 'center' },
  faydaText: { flex: 1, color: '#3d3322', fontSize: 15, fontWeight: '600', lineHeight: 21 },
  buyBtn: {
    width: '100%',
    backgroundColor: GOLD,
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
  },
  buyBtnPressed: { opacity: 0.9 },
  buyBtnDisabled: { opacity: 0.6 },
  buyBtnText: { color: DARK_TEXT, fontSize: 17, fontWeight: '800' },
  restoreBtn: { paddingVertical: 8, marginBottom: 18 },
  restoreBtnText: { color: GOLD, fontSize: 14, fontWeight: '700' },
  note: { color: '#9b8d75', fontSize: 12, textAlign: 'center', lineHeight: 18 },
  activeBanner: {
    width: '100%',
    backgroundColor: 'rgba(201,168,76,0.18)',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 18,
  },
  activeBannerText: { color: '#5C481C', fontSize: 15, fontWeight: '800', textAlign: 'center' },
});

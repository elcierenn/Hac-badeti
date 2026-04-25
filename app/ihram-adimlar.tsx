import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OVERLAY = 'rgba(0,0,0,0.45)';
const GOLD = '#C9A84C';
const BTN_BG = 'rgba(12, 10, 8, 0.72)';

const STEP_KEYS = [
  'ihramAdimlar.step1',
  'ihramAdimlar.step2',
  'ihramAdimlar.step3',
  'ihramAdimlar.step4',
  'ihramAdimlar.step5',
  'ihramAdimlar.step6',
  'ihramAdimlar.step7',
] as const;

export default function IhramAdimlarScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={styles.root}>
      <Image
        source={require('../assets/images/ihram_adımlarımız.jpeg')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={0}
        priority="high"
      />
      <View style={[StyleSheet.absoluteFill, styles.overlay]} />
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.topRow}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.88 }]}
            accessibilityLabel={t('ihramAdimlar.backA11y')}
            accessibilityRole="button"
          >
            <Text style={styles.backBtnArrow}>←</Text>
          </Pressable>
        </View>
        <Text style={styles.title}>{t('ihramAdimlar.title')}</Text>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {STEP_KEYS.map((key, index) => (
            <Pressable
              key={key}
              onPress={() => {
                if (index === 0) router.push('/ihram-adim-1-temizlik');
                if (index === 1) router.push('/ihram-adim-2-gusl');
                if (index === 2) router.push('/ihram-adim-3-elbise');
                if (index === 3) router.push('/ihram-adim-4-namaz');
                if (index === 4) router.push('/ihram-adim-5-niyet');
                if (index === 5) router.push('/ihram-adim-6-telbiye');
                if (index === 6) router.push('/ihram-adim-7-yasaklar');
              }}
              style={({ pressed }) => [styles.stepBtn, pressed && { opacity: 0.9 }]}
              accessibilityRole="button"
            >
              <Text style={styles.stepBtnText}>{t(key)}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  overlay: { backgroundColor: OVERLAY },
  safe: { flex: 1 },
  topRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  backBtn: {
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1.5,
    borderColor: GOLD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  backBtnArrow: {
    color: GOLD,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 28,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  stepBtn: {
    backgroundColor: BTN_BG,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: GOLD,
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 52,
    justifyContent: 'center',
  },
  stepBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
});

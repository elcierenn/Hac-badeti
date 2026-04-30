import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const GOLD = '#C9A84C';
const DARK = '#1a1a1a';
const BUBBLE = 'rgba(255, 252, 247, 0.88)';

function BulletLine({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.bodyLine}>{text}</Text>
    </View>
  );
}

export default function IhramAdim7YasaklarScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomPad = 12 + insets.bottom;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <Image
        source={require('../assets/images/ihram_ogrenmek.jpeg')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={0}
        priority="high"
      />
      <View style={styles.overlayCol} pointerEvents="box-none">
        <View style={styles.halfImage} />
        <View style={[styles.halfPanel, { marginBottom: bottomPad, paddingTop: 8 }]}>
          <View style={styles.bubbleContent}>
            <View style={styles.bubbleWrapper}>
              <View style={styles.blurBlock}>
                <ScrollView
                  style={styles.scroll}
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled
                >
                  <View style={styles.bubbleFill}>
                    <Text style={styles.h1}>{t('ihramAdim7Yasaklar.title')}</Text>

                    <Text style={styles.h2}>{t('ihramAdim7Yasaklar.maleGiyimTitle')}</Text>
                    <BulletLine text={t('ihramAdim7Yasaklar.maleGiyim1')} />
                    <BulletLine text={t('ihramAdim7Yasaklar.maleGiyim2')} />
                    <BulletLine text={t('ihramAdim7Yasaklar.maleGiyim3')} />

                    <Text style={[styles.h2, styles.h2Spaced]}>{t('ihramAdim7Yasaklar.femaleGiyimTitle')}</Text>
                    <BulletLine text={t('ihramAdim7Yasaklar.femaleGiyim1')} />
                    <BulletLine text={t('ihramAdim7Yasaklar.femaleGiyim2')} />

                    <Text style={[styles.h2, styles.h2Spaced]}>{t('ihramAdim7Yasaklar.kokuTitle')}</Text>
                    <BulletLine text={t('ihramAdim7Yasaklar.koku1')} />
                    <BulletLine text={t('ihramAdim7Yasaklar.koku2')} />
                    <Text style={styles.noteLine}>{t('ihramAdim7Yasaklar.kokuNote')}</Text>

                    <Text style={[styles.h2, styles.h2Spaced]}>{t('ihramAdim7Yasaklar.vucutTitle')}</Text>
                    <BulletLine text={t('ihramAdim7Yasaklar.vucut1')} />
                    <BulletLine text={t('ihramAdim7Yasaklar.vucut2')} />
                    <BulletLine text={t('ihramAdim7Yasaklar.vucut3')} />

                    <Text style={[styles.h2, styles.h2Spaced]}>{t('ihramAdim7Yasaklar.davranisTitle')}</Text>
                    <BulletLine text={t('ihramAdim7Yasaklar.davranis1')} />
                    <BulletLine text={t('ihramAdim7Yasaklar.davranis2')} />
                    <BulletLine text={t('ihramAdim7Yasaklar.davranis3')} />

                    <Text style={[styles.h2, styles.h2Spaced]}>{t('ihramAdim7Yasaklar.dogaTitle')}</Text>
                    <BulletLine text={t('ihramAdim7Yasaklar.doga1')} />
                    <BulletLine text={t('ihramAdim7Yasaklar.doga2')} />
                  </View>
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </View>
      <SafeAreaView style={styles.topSafe} pointerEvents="box-none" edges={['top', 'left', 'right']}>
        <View style={styles.topRow}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.88 }]}
            accessibilityLabel={t('ihramAdim7Yasaklar.backA11y')}
            accessibilityRole="button"
          >
            <Text style={styles.backBtnArrow}>←</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  overlayCol: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
  },
  halfImage: { flex: 1, minHeight: 0 },
  halfPanel: { flex: 1, minHeight: 0, marginHorizontal: 16, marginTop: 0 },
  blurBlock: {
    flex: 1,
    minHeight: 0,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: 'hidden',
  },
  topSafe: { position: 'absolute', left: 0, right: 0, top: 0, zIndex: 2 },
  topRow: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 8 },
  backBtn: {
    alignSelf: 'flex-start',
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
  bubbleContent: { flex: 1, minHeight: 0, zIndex: 1 },
  bubbleWrapper: { flex: 1, minHeight: 0, position: 'relative' },
  scroll: { flex: 1, zIndex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 12 },
  bubbleFill: {
    zIndex: 1,
    backgroundColor: BUBBLE,
    borderWidth: 1.5,
    borderColor: 'rgba(201, 168, 76, 0.5)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 14,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  h1: {
    color: DARK,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 14,
  },
  h2: { color: DARK, fontSize: 15, fontWeight: '800' },
  h2Spaced: { marginTop: 12 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 6, gap: 6 },
  bullet: { color: DARK, fontSize: 14, lineHeight: 20, fontWeight: '800', marginTop: 0 },
  bodyLine: { flex: 1, color: DARK, fontSize: 14, lineHeight: 20, fontWeight: '500' },
  noteLine: { color: DARK, fontSize: 13, lineHeight: 20, fontWeight: '500', fontStyle: 'italic', marginTop: 4, marginLeft: 18 },
});

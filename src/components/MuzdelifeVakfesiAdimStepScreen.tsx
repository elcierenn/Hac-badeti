import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const GOLD = '#C9A84C';
const DARK = '#1a1a1a';
const BUBBLE = 'rgba(255, 252, 247, 0.78)';

const MUZDELIFE_IMAGE = require('../../assets/images/muzdelife_gece.jpeg');

type StepIndex = 1 | 2 | 3 | 4 | 5 | 6;

function i18nKey(step: StepIndex) {
  return `muzdelifeVakfesiAdim${step}` as const;
}

export function MuzdelifeVakfesiAdimStepScreen({ stepIndex }: { stepIndex: StepIndex }) {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomPad = 12 + insets.bottom;
  const k = i18nKey(stepIndex);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <Image
        source={MUZDELIFE_IMAGE}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={0}
        priority="high"
      />
      <View style={styles.overlayCol} pointerEvents="box-none">
        <View style={styles.splitTop} />
        <View style={[styles.splitBottom, { marginBottom: bottomPad, paddingTop: 10 }]}>
          <View style={styles.bubbleContent}>
            <View style={styles.bubbleWrapper}>
              <View style={styles.blurBlock}>
                <View style={styles.bubble}>
                  <ScrollView
                    style={styles.textScroll}
                    contentContainerStyle={styles.textScrollContent}
                    showsVerticalScrollIndicator
                    nestedScrollEnabled
                  >
                    <Text style={styles.sectionTitle}>{t(`${k}.title`)}</Text>
                    <Text style={styles.bodyText}>{t(`${k}.body`)}</Text>
                  </ScrollView>
                </View>
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
            accessibilityLabel={t(`${k}.backA11y`)}
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
    justifyContent: 'flex-end',
  },
  splitTop: { flex: 1 },
  splitBottom: {
    flexShrink: 0,
    marginHorizontal: 16,
    minHeight: 0,
  },
  blurBlock: {
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
  bubbleContent: { zIndex: 1 },
  bubbleWrapper: { position: 'relative' },
  bubble: {
    zIndex: 1,
    backgroundColor: BUBBLE,
    borderWidth: 1.5,
    borderColor: 'rgba(201, 168, 76, 0.5)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  textScroll: {},
  textScrollContent: { paddingTop: 2, paddingBottom: 4, flexGrow: 0 },
  sectionTitle: {
    color: DARK,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '800',
  },
  bodyText: {
    color: DARK,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '500',
    marginTop: 10,
  },
});

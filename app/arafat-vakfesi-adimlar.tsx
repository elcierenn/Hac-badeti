import { Image } from 'expo-image';
import { useRouter, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { LayoutChangeEvent, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SwipeScrollHint } from '../src/components/SwipeScrollHint';

const OVERLAY = 'rgba(0,0,0,0.45)';
const GOLD = '#C9A84C';
const BTN_BG = 'rgba(12, 10, 8, 0.72)';

const STEP_KEYS = [
  'arafatVakfesiAdimlar.step1',
  'arafatVakfesiAdimlar.step2',
  'arafatVakfesiAdimlar.step3',
  'arafatVakfesiAdimlar.step4',
  'arafatVakfesiAdimlar.step5',
  'arafatVakfesiAdimlar.step6',
] as const;

const STEP_DETAIL_HREFS: (Href | null)[] = [
  '/arafat-vakfesi-adim-1-hareket',
  '/arafat-vakfesi-adim-2-gusl',
  '/arafat-vakfesi-adim-3-namaz',
  '/arafat-vakfesi-adim-4-vakf',
  '/arafat-vakfesi-adim-5-tesrik',
  '/arafat-vakfesi-adim-6-muzdelife',
];

const SCROLL_HINT_PAD = 8;

export default function ArafatVakfesiAdimlarScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [viewH, setViewH] = useState(0);
  const [contentH, setContentH] = useState(0);
  const [y, setY] = useState(0);
  const scrollable = contentH > viewH + 4;
  const atTop = y <= 2;
  const atBottom = scrollable && y + viewH >= contentH - 2;

  const onScrollV = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setY(e.nativeEvent.contentOffset.y);
  };

  return (
    <View style={styles.root}>
      <Image
        source={require('../assets/images/arafat_ovası.jpeg')}
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
        <View
          style={styles.scrollShell}
          onLayout={(e: LayoutChangeEvent) => {
            setViewH(e.nativeEvent.layout.height);
          }}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            onScroll={onScrollV}
            scrollEventThrottle={16}
            onContentSizeChange={(_, h) => setContentH(h)}
          >
            {STEP_KEYS.map((key, index) => {
              const href = STEP_DETAIL_HREFS[index];
              if (href) {
                return (
                  <Pressable
                    key={key}
                    onPress={() => router.push(href)}
                    style={({ pressed }) => [styles.stepRow, pressed && { opacity: 0.9 }]}
                    accessibilityRole="button"
                  >
                    <Text style={styles.stepText}>{t(key)}</Text>
                  </Pressable>
                );
              }
              return (
                <View key={key} style={styles.stepRow}>
                  <Text style={styles.stepText}>{t(key)}</Text>
                </View>
              );
            })}
          </ScrollView>
          {scrollable && !atTop ? (
            <View style={[styles.scrollHintV, styles.scrollHintTop]} pointerEvents="none">
              <SwipeScrollHint direction="back" axis="vertical" tintColor={GOLD} />
            </View>
          ) : null}
          {scrollable && !atBottom ? (
            <View style={[styles.scrollHintV, styles.scrollHintBottom]} pointerEvents="none">
              <SwipeScrollHint direction="forward" axis="vertical" tintColor={GOLD} />
            </View>
          ) : null}
        </View>
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
  scrollShell: { flex: 1, position: 'relative' },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  scrollHintV: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  scrollHintTop: { top: SCROLL_HINT_PAD },
  scrollHintBottom: { bottom: SCROLL_HINT_PAD },
  stepRow: {
    backgroundColor: BTN_BG,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: GOLD,
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 52,
    justifyContent: 'center',
  },
  stepText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
});

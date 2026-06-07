import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GOLD = '#C9A84C';
const DARK_TEXT = '#1a1a1a';
const CYCLE = 33;
const STORAGE_KEY = '@tesbih_counts';

type ZikirKey = 'subhanallah' | 'allahuekber' | 'elhamdulillah' | 'lailahe' | 'telbiye';

const ZIKIRLER: ZikirKey[] = ['subhanallah', 'allahuekber', 'elhamdulillah', 'lailahe', 'telbiye'];

type Counts = Record<ZikirKey, number>;

const DEFAULT_COUNTS: Counts = {
  subhanallah: 0, allahuekber: 0, elhamdulillah: 0, lailahe: 0, telbiye: 0,
};

export default function TesbihScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [active, setActive] = useState<ZikirKey>('subhanallah');
  const [counts, setCounts] = useState<Counts>(DEFAULT_COUNTS);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => raw && setCounts(JSON.parse(raw)))
      .catch(() => {});
  }, []);

  const persist = useCallback((next: Counts) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const handleTap = useCallback(() => {
    setCounts((prev) => {
      const next = { ...prev, [active]: prev[active] + 1 };
      persist(next);
      return next;
    });

    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.93, duration: 60, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();

    if ((counts[active] + 1) % CYCLE === 0) {
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 150, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [active, counts, scaleAnim, pulseAnim, persist]);

  const handleReset = useCallback(() => {
    setCounts((prev) => {
      const next = { ...prev, [active]: 0 };
      persist(next);
      return next;
    });
  }, [active, persist]);

  const current = counts[active];
  const cyclePos = current % CYCLE;
  const cycleNum = Math.floor(current / CYCLE);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.bgGradient} />
      </View>

      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.topRow}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.8 }]}
            accessibilityRole="button"
            accessibilityLabel={t('tesbih.backA11y')}
          >
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>{t('tesbih.title')}</Text>
          <Pressable
            onPress={handleReset}
            style={({ pressed }) => [styles.resetBtn, pressed && { opacity: 0.8 }]}
            accessibilityRole="button"
          >
            <Text style={styles.resetText}>{t('tesbih.reset')}</Text>
          </Pressable>
        </View>

        <Pressable style={styles.tapArea} onPress={handleTap} accessibilityRole="button">
          <Animated.View style={[styles.counterWrap, { transform: [{ scale: pulseAnim }] }]}>
            <Animated.Text style={[styles.countText, { transform: [{ scale: scaleAnim }] }]}>
              {current}
            </Animated.Text>
            <Text style={styles.zikirName}>{t(`tesbih.${active}`)}</Text>
          </Animated.View>

          <View style={styles.cycleWrap}>
            <View style={styles.cycleBar}>
              <View style={[styles.cycleProgress, { width: `${(cyclePos / CYCLE) * 100}%` }]} />
            </View>
            <Text style={styles.cycleText}>{cyclePos} {t('tesbih.cycleOf')}</Text>
          </View>

          {cycleNum > 0 && (
            <View style={styles.cycleBadge}>
              <Text style={styles.cycleBadgeText}>{cycleNum}×</Text>
            </View>
          )}

          <Text style={styles.tapHint}>{t('tesbih.tapHint')}</Text>
        </Pressable>

        <View style={styles.selectorWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.selectorContent}
          >
            {ZIKIRLER.map((z) => (
              <Pressable
                key={z}
                onPress={() => setActive(z)}
                style={({ pressed }) => [
                  styles.chip,
                  active === z && styles.chipActive,
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text style={[styles.chipText, active === z && styles.chipTextActive]}>
                  {t(`tesbih.${z}`)}
                </Text>
                {counts[z] > 0 && (
                  <View style={[styles.chipBadge, active === z && styles.chipBadgeActive]}>
                    <Text style={[styles.chipBadgeText, active === z && { color: DARK_TEXT }]}>
                      {counts[z]}
                    </Text>
                  </View>
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d0d0d' },
  bgGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#111',
  },
  safe: { flex: 1 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 4,
  },
  backBtn: {
    borderRadius: 14,
    paddingVertical: 10, paddingHorizontal: 12,
    minWidth: 44, minHeight: 44,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1.5, borderColor: GOLD,
  },
  backArrow: { color: GOLD, fontSize: 24, fontWeight: '600', lineHeight: 28 },
  headerTitle: {
    color: GOLD,
    fontSize: 17, fontWeight: '700',
    textAlign: 'center',
  },
  resetBtn: {
    borderRadius: 12,
    paddingVertical: 8, paddingHorizontal: 14,
    minHeight: 44,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'rgba(201,168,76,0.45)',
  },
  resetText: { color: 'rgba(201,168,76,0.7)', fontSize: 13, fontWeight: '600' },
  tapArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  counterWrap: { alignItems: 'center', gap: 8 },
  countText: {
    color: GOLD,
    fontSize: 96,
    fontWeight: '800',
    lineHeight: 108,
    textShadowColor: 'rgba(201,168,76,0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 24,
  },
  zikirName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  cycleWrap: { alignItems: 'center', gap: 6, width: 200 },
  cycleBar: {
    width: '100%', height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(201,168,76,0.2)',
    overflow: 'hidden',
  },
  cycleProgress: {
    height: '100%',
    backgroundColor: GOLD,
    borderRadius: 2,
  },
  cycleText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13, fontWeight: '500',
  },
  cycleBadge: {
    backgroundColor: 'rgba(201,168,76,0.18)',
    borderRadius: 20,
    paddingVertical: 4, paddingHorizontal: 14,
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.35)',
  },
  cycleBadgeText: { color: GOLD, fontSize: 16, fontWeight: '700' },
  tapHint: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 13,
    textAlign: 'center',
  },
  selectorWrap: {
    paddingBottom: 12,
  },
  selectorContent: {
    paddingHorizontal: 14,
    gap: 8,
    flexDirection: 'row',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 20,
    paddingVertical: 9, paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(201,168,76,0.2)',
  },
  chipActive: {
    backgroundColor: GOLD,
    borderColor: GOLD,
  },
  chipText: { color: 'rgba(255,255,255,0.65)', fontSize: 14, fontWeight: '600' },
  chipTextActive: { color: '#1a1a1a' },
  chipBadge: {
    backgroundColor: 'rgba(201,168,76,0.2)',
    borderRadius: 10,
    paddingHorizontal: 6, paddingVertical: 1,
  },
  chipBadgeActive: { backgroundColor: 'rgba(0,0,0,0.2)' },
  chipBadgeText: { color: GOLD, fontSize: 11, fontWeight: '700' },
});

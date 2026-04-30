import { Image } from 'expo-image';
import { useRouter, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OVERLAY = 'rgba(0,0,0,0.45)';
const GOLD = '#C9A84C';
const BTN_BG = 'rgba(12, 10, 8, 0.72)';

const K = 'seytanKurbanTirasAdimlar' as const;

type StepKey =
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'step5'
  | 'step6'
  | 'step7'
  | 'step8'
  | 'step9';

type Day2LinkKey =
  | 'day2Step1'
  | 'day2Step2'
  | 'day2Step3'
  | 'day2Step4'
  | 'day3Step1'
  | 'day3Step2'
  | 'day3Step3'
  | 'day3Step4'
  | 'day3Step5';

type DayListItem =
  | { kind: 'link'; stepKey: StepKey; href: Href }
  | { kind: 'linkDay2'; lineKey: Day2LinkKey; href: Href };

const DAY_TABS = [1, 2, 3] as const;
type DayTab = (typeof DAY_TABS)[number];

const STEPS_FOR_DAY: Record<DayTab, DayListItem[]> = {
  1: [
    { kind: 'link', stepKey: 'step1', href: '/seytan-kurban-tiras-adim-1' as Href },
    { kind: 'link', stepKey: 'step2', href: '/seytan-kurban-tiras-adim-2' as Href },
    { kind: 'link', stepKey: 'step3', href: '/seytan-kurban-tiras-adim-3' as Href },
    { kind: 'link', stepKey: 'step4', href: '/seytan-kurban-tiras-adim-4' as Href },
    { kind: 'link', stepKey: 'step5', href: '/seytan-kurban-tiras-adim-5' as Href },
    { kind: 'link', stepKey: 'step6', href: '/seytan-kurban-tiras-adim-6' as Href },
    { kind: 'link', stepKey: 'step7', href: '/seytan-kurban-tiras-adim-7' as Href },
    { kind: 'link', stepKey: 'step8', href: '/seytan-kurban-tiras-adim-8' as Href },
    { kind: 'link', stepKey: 'step9', href: '/seytan-kurban-tiras-adim-9' as Href },
  ],
  2: [
    {
      kind: 'linkDay2',
      lineKey: 'day2Step1',
      href: '/seytan-kurban-tiras-gun2-adim-1' as Href,
    },
    {
      kind: 'linkDay2',
      lineKey: 'day2Step2',
      href: '/seytan-kurban-tiras-gun2-adim-2' as Href,
    },
    {
      kind: 'linkDay2',
      lineKey: 'day2Step3',
      href: '/seytan-kurban-tiras-gun2-adim-3' as Href,
    },
    {
      kind: 'linkDay2',
      lineKey: 'day2Step4',
      href: '/seytan-kurban-tiras-gun2-adim-4' as Href,
    },
  ],
  3: [
    {
      kind: 'linkDay2',
      lineKey: 'day3Step1',
      href: '/seytan-kurban-tiras-gun2-adim-1' as Href,
    },
    {
      kind: 'linkDay2',
      lineKey: 'day3Step2',
      href: '/seytan-kurban-tiras-gun2-adim-2' as Href,
    },
    {
      kind: 'linkDay2',
      lineKey: 'day3Step3',
      href: '/seytan-kurban-tiras-gun3-adim-3' as Href,
    },
    {
      kind: 'linkDay2',
      lineKey: 'day3Step4',
      href: '/seytan-kurban-tiras-gun3-adim-4' as Href,
    },
    {
      kind: 'linkDay2',
      lineKey: 'day3Step5',
      href: '/seytan-kurban-tiras-gun3-adim-5' as Href,
    },
  ],
};

export default function SeytanKurbanTirasAdimlarScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<DayTab>(1);
  const visibleSteps = STEPS_FOR_DAY[selectedDay];

  return (
    <View style={styles.root}>
      <Image
        source={require('../assets/images/cemaat_koprusu.jpeg')}
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
            accessibilityLabel={t('seytanKurbanTirasAdimlar.backA11y')}
            accessibilityRole="button"
          >
            <Text style={styles.backBtnArrow}>←</Text>
          </Pressable>
        </View>
        <Text style={styles.title}>{t('anaGorev.mission7Heading')}</Text>
        <View style={styles.dayPickerRow}>
          {DAY_TABS.map((d) => {
            const selected = selectedDay === d;
            return (
              <Pressable
                key={d}
                onPress={() => setSelectedDay(d)}
                style={({ pressed }) => [
                  styles.dayTab,
                  selected && styles.dayTabSelected,
                  pressed && { opacity: 0.9 },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={t(`${K}.day${d}Title` as never)}
              >
                <Text style={[styles.dayTabText, selected && styles.dayTabTextSelected]}>
                  {t(`${K}.day${d}Title` as never)}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.dayStepList}>
            {visibleSteps.map((item) =>
              item.kind === 'link' ? (
                <Pressable
                  key={item.stepKey}
                  onPress={() => router.push(item.href)}
                  style={({ pressed }) => [styles.stepRow, pressed && { opacity: 0.9 }]}
                  accessibilityRole="button"
                >
                  <Text style={styles.stepText}>{t(`${K}.${item.stepKey}`)}</Text>
                </Pressable>
              ) : (
                <Pressable
                  key={item.lineKey}
                  onPress={() => router.push(item.href)}
                  style={({ pressed }) => [styles.stepRow, pressed && { opacity: 0.9 }]}
                  accessibilityRole="button"
                >
                  <Text style={styles.stepText}>{t(`${K}.${item.lineKey}`)}</Text>
                </Pressable>
              ),
            )}
          </View>
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
    marginBottom: 12,
  },
  dayPickerRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 14,
    gap: 8,
  },
  dayTab: {
    flex: 1,
    minHeight: 40,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(201, 168, 76, 0.75)',
    backgroundColor: 'rgba(12, 10, 8, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayTabSelected: {
    backgroundColor: 'rgba(201, 168, 76, 0.35)',
    borderColor: GOLD,
  },
  dayTabText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  dayTabTextSelected: {
    fontWeight: '800',
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  dayStepList: {
    gap: 12,
  },
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

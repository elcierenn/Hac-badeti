import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const BG = '#ECE6DC';
const GOLD = '#C9A84C';
const GOLD_DIM = 'rgba(201,168,76,0.18)';
const GREEN = '#27AE60';
const STORAGE_KEY = '@hazirlik_checked';

type SectionKey = 'belgeler' | 'kiyafet' | 'saglik' | 'ibadet';
type ItemKey = string;
type Section = { key: SectionKey; items: ItemKey[] };

const LISTE: Section[] = [
  {
    key: 'belgeler',
    items: ['pasaport', 'vize', 'sigorta', 'fotokopi', 'fotograf'],
  },
  {
    key: 'kiyafet',
    items: ['ihram', 'sandalet', 'kiyafet', 'sapka', 'corap', 'cantasi'],
  },
  {
    key: 'saglik',
    items: ['menenjit', 'ilaclar', 'agri', 'ishal', 'yara', 'gunes'],
  },
  {
    key: 'ibadet',
    items: ['tesbih', 'duakitabi', 'seccade', 'kuran', 'semsiye'],
  },
];

const ALL_IDS = LISTE.flatMap((s) => s.items);

export default function HazirlikListesiScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [checked, setChecked] = useState<Set<string>>(new Set());

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => raw && setChecked(new Set(JSON.parse(raw))))
      .catch(() => {});
  }, []);

  const persist = useCallback((next: Set<string>) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...next])).catch(() => {});
  }, []);

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      persist(next);
      return next;
    });
  }, [persist]);

  const handleReset = useCallback(() => {
    Alert.alert(
      t('hazirlikListesi.resetTitle'),
      t('hazirlikListesi.resetMsg'),
      [
        { text: t('hazirlikListesi.cancel'), style: 'cancel' },
        {
          text: t('hazirlikListesi.resetBtn'), style: 'destructive',
          onPress: () => {
            const empty = new Set<string>();
            setChecked(empty);
            persist(empty);
          },
        },
      ],
    );
  }, [persist, t]);

  const total = ALL_IDS.length;
  const done = ALL_IDS.filter((id) => checked.has(id)).length;
  const pct = total > 0 ? done / total : 0;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.8 }]}
            accessibilityRole="button"
          >
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>{t('hazirlikListesi.title')}</Text>
          <Pressable
            onPress={handleReset}
            style={({ pressed }) => [styles.resetBtn, pressed && { opacity: 0.8 }]}
          >
            <Text style={styles.resetText}>{t('hazirlikListesi.resetBtn')}</Text>
          </Pressable>
        </View>

        <View style={styles.progressWrap}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>{t('hazirlikListesi.progressLabel')}</Text>
            <Text style={styles.progressCount}>{done} / {total}</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: 20 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
        >
          {LISTE.map((section) => (
            <View key={section.key} style={styles.section}>
              <Text style={styles.sectionTitle}>{t(`hazirlikListesi.${section.key}`)}</Text>
              {section.items.map((itemKey) => {
                const isChecked = checked.has(itemKey);
                return (
                  <Pressable
                    key={itemKey}
                    onPress={() => toggle(itemKey)}
                    style={({ pressed }) => [styles.item, isChecked && styles.itemChecked, pressed && { opacity: 0.8 }]}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isChecked }}
                  >
                    <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                      {isChecked && <Text style={styles.checkMark}>✓</Text>}
                    </View>
                    <Text style={[styles.itemLabel, isChecked && styles.itemLabelChecked]}>
                      {t(`hazirlikListesi.items.${itemKey}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderBottomWidth: 1, borderBottomColor: GOLD_DIM,
  },
  backBtn: {
    borderRadius: 14, paddingVertical: 10, paddingHorizontal: 12,
    minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', borderWidth: 1.5, borderColor: GOLD,
  },
  backArrow: { color: GOLD, fontSize: 24, fontWeight: '600', lineHeight: 28 },
  headerTitle: { flex: 1, color: '#5C481C', fontSize: 19, fontWeight: '800', textAlign: 'center' },
  resetBtn: { paddingHorizontal: 12, paddingVertical: 8, minHeight: 44, justifyContent: 'center' },
  resetText: { color: 'rgba(201,168,76,0.8)', fontSize: 13, fontWeight: '600' },
  progressWrap: { padding: 14, paddingBottom: 10, backgroundColor: 'rgba(255,255,255,0.35)' },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { color: '#5C481C', fontSize: 13, fontWeight: '600' },
  progressCount: { color: GOLD, fontSize: 13, fontWeight: '800' },
  progressBar: { height: 6, borderRadius: 3, backgroundColor: 'rgba(201,168,76,0.2)', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: GREEN, borderRadius: 3 },
  content: { padding: 14, gap: 20 },
  section: { gap: 8 },
  sectionTitle: {
    color: GOLD, fontSize: 12, fontWeight: '800',
    textTransform: 'uppercase', letterSpacing: 0.5,
    paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.25)',
  },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFFCF7',
    borderRadius: 12, padding: 12,
    borderWidth: 1.5, borderColor: 'rgba(201,168,76,0.25)',
  },
  itemChecked: { backgroundColor: 'rgba(39,174,96,0.06)', borderColor: 'rgba(39,174,96,0.35)' },
  checkbox: {
    width: 24, height: 24, borderRadius: 6,
    borderWidth: 2, borderColor: 'rgba(201,168,76,0.5)',
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: GREEN, borderColor: GREEN },
  checkMark: { color: '#fff', fontSize: 14, fontWeight: '800' },
  itemLabel: { flex: 1, color: '#2A2218', fontSize: 14, fontWeight: '500' },
  itemLabelChecked: { color: '#7A9A7A', textDecorationLine: 'line-through' },
});

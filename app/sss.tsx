import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppLanguage } from '../src/context/LanguageContext';
import type { AppLanguage } from '../src/i18n/config';
import sssList from '../src/data/sssList.json';
import { pickLang, isLanguageRtl } from '../src/lib/multilingual';

const BG = '#ECE6DC';
const GOLD = '#C9A84C';
const GOLD_DIM = 'rgba(201,168,76,0.18)';

type SSSItem = {
  id: number;
  kategori: string;
  soru: string;
  cevap: string;
  [key: `soru_${string}`]: string | undefined;
  [key: `cevap_${string}`]: string | undefined;
};

type KategoriKey = 'all' | 'ihram' | 'tavaf' | 'say' | 'pratik';
const KATEGORILER: KategoriKey[] = ['all', 'ihram', 'tavaf', 'say', 'pratik'];
const DATA = sssList as unknown as SSSItem[];

function AkorItem({ item, lang }: { item: SSSItem; lang: AppLanguage }) {
  const [open, setOpen] = useState(false);
  const soru = pickLang(item, 'soru', lang);
  const cevap = pickLang(item, 'cevap', lang);
  const isRtl = isLanguageRtl(lang);

  return (
    <Pressable
      onPress={() => setOpen((v) => !v)}
      style={({ pressed }) => [styles.akor, pressed && { opacity: 0.9 }]}
      accessibilityRole="button"
    >
      <View style={styles.akorHeader}>
        <Text style={[styles.soru, isRtl && styles.rtlText]}>{soru}</Text>
        <Text style={styles.akorIcon}>{open ? '▲' : '▼'}</Text>
      </View>
      {open && (
        <View style={styles.cevapWrap}>
          <View style={styles.cevapDivider} />
          <Text style={[styles.cevap, isRtl && styles.rtlText]}>{cevap}</Text>
        </View>
      )}
    </Pressable>
  );
}

export default function SSSScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useAppLanguage();
  const [aktif, setAktif] = useState<KategoriKey>('all');

  const filtered = aktif === 'all' ? DATA : DATA.filter((d) => d.kategori === aktif);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.8 }]}
            accessibilityRole="button"
            accessibilityLabel={t('sss.backA11y')}
          >
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>{t('sss.title')}</Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.tabsWrap}>
          <ScrollView
            horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}
          >
            {KATEGORILER.map((k) => (
              <Pressable
                key={k}
                onPress={() => setAktif(k)}
                style={({ pressed }) => [styles.tab, aktif === k && styles.tabActive, pressed && { opacity: 0.8 }]}
              >
                <Text style={[styles.tabText, aktif === k && styles.tabTextActive]}>
                  {t(`sss.${k}`)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item }) => <AkorItem item={item} lang={language} />}
          contentContainerStyle={[styles.list, { paddingBottom: 16 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
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
  spacer: { minWidth: 44 },
  tabsWrap: { borderBottomWidth: 1, borderBottomColor: GOLD_DIM, backgroundColor: 'rgba(255,255,255,0.4)' },
  tabsContent: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  tab: {
    borderRadius: 16, paddingVertical: 6, paddingHorizontal: 14,
    borderWidth: 1.5, borderColor: 'rgba(201,168,76,0.3)',
  },
  tabActive: { backgroundColor: GOLD, borderColor: GOLD },
  tabText: { color: '#7A6A50', fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: '#1a1a1a' },
  list: { padding: 14 },
  akor: {
    borderRadius: 16,
    backgroundColor: '#FFFCF7',
    borderWidth: 1.5, borderColor: 'rgba(201,168,76,0.35)',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 5, elevation: 2,
  },
  akorHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  soru: { flex: 1, color: '#2A2218', fontSize: 15, fontWeight: '700', lineHeight: 22 },
  akorIcon: { color: GOLD, fontSize: 14, fontWeight: '700', marginTop: 3 },
  cevapWrap: { marginTop: 4 },
  cevapDivider: { height: 1, backgroundColor: 'rgba(201,168,76,0.2)', marginBottom: 10 },
  cevap: { color: '#3a3020', fontSize: 14, fontWeight: '500', lineHeight: 22 },
  rtlText: { textAlign: 'right', writingDirection: 'rtl' },
});

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppLanguage } from '../src/context/LanguageContext';
import duaRehberi from '../src/data/duaRehberi.json';

const BG = '#ECE6DC';
const GOLD = '#C9A84C';
const GOLD_DIM = 'rgba(201,168,76,0.18)';

type Dua = {
  id: number;
  kategori: string;
  baslik: string;
  baslik_en: string;
  baslik_ar: string;
  arapca: string;
  okunusu: string;
  anlami: string;
  anlami_en: string;
  anlami_ar: string;
};

type KategoriKey = 'all' | 'ihram' | 'tavaf' | 'say' | 'arafat' | 'muzdelife' | 'mina' | 'veda';
const KATEGORILER: KategoriKey[] = ['all', 'ihram', 'tavaf', 'say', 'arafat', 'muzdelife', 'mina', 'veda'];

const DATA = duaRehberi as Dua[];

function DuaKarti({ item, lang }: { item: Dua; lang: string }) {
  const baslik = lang === 'en' ? item.baslik_en : lang === 'ar' ? item.baslik_ar : item.baslik;
  const anlami = lang === 'en' ? item.anlami_en : lang === 'ar' ? item.anlami_ar : item.anlami;

  return (
    <View style={styles.kart}>
      <View style={styles.kartHeader}>
        <Text style={styles.baslik}>{baslik}</Text>
      </View>
      <Text style={styles.arapca}>{item.arapca}</Text>
      <View style={styles.divider} />
      <Text style={styles.okunusLabel}>Okunuşu</Text>
      <Text style={styles.okunusu}>{item.okunusu}</Text>
      <Text style={styles.anlamLabel}>{lang === 'ar' ? 'المعنى' : lang === 'en' ? 'Meaning' : 'Anlamı'}</Text>
      <Text style={[styles.anlami, lang === 'ar' && styles.anlamiAr]}>{anlami}</Text>
    </View>
  );
}

export default function DuaRehberiScreen() {
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
            accessibilityLabel={t('duaRehberi.backA11y')}
          >
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>{t('duaRehberi.title')}</Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.tabsWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}
          >
            {KATEGORILER.map((k) => (
              <Pressable
                key={k}
                onPress={() => setAktif(k)}
                style={({ pressed }) => [
                  styles.tab,
                  aktif === k && styles.tabActive,
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text style={[styles.tabText, aktif === k && styles.tabTextActive]}>
                  {t(`duaRehberi.${k}`)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item }) => <DuaKarti item={item} lang={language} />}
          contentContainerStyle={[styles.list, { paddingBottom: 16 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
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
    backgroundColor: 'transparent',
  },
  tabActive: { backgroundColor: GOLD, borderColor: GOLD },
  tabText: { color: '#7A6A50', fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: '#1a1a1a' },
  list: { padding: 14, gap: 14 },
  kart: {
    borderRadius: 18,
    backgroundColor: '#FFFCF7',
    borderWidth: 1.5, borderColor: 'rgba(201,168,76,0.35)',
    padding: 18,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 6,
    elevation: 2,
  },
  kartHeader: { borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.2)', paddingBottom: 8 },
  baslik: { color: '#5C481C', fontSize: 15, fontWeight: '800' },
  arapca: {
    color: '#1a1a1a', fontSize: 22, fontWeight: '600',
    lineHeight: 40, textAlign: 'right', writingDirection: 'rtl',
    marginTop: 4,
  },
  divider: { height: 1, backgroundColor: 'rgba(201,168,76,0.15)', marginVertical: 4 },
  okunusLabel: { color: GOLD, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.4 },
  okunusu: { color: '#3a3020', fontSize: 14, fontWeight: '500', lineHeight: 22, fontStyle: 'italic' },
  anlamLabel: { color: GOLD, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 4 },
  anlami: { color: '#2a2218', fontSize: 14, fontWeight: '500', lineHeight: 22 },
  anlamiAr: { textAlign: 'right', writingDirection: 'rtl' },
});

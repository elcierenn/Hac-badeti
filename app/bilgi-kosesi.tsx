import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppLanguage } from '../src/context/LanguageContext';
import bilgiKosesiItems from '../src/data/bilgiKosesiItems.json';
import bilgiKosesiItemsEn from '../src/data/bilgiKosesiItems.en.json';
import bilgiKosesiItemsAr from '../src/data/bilgiKosesiItems.ar.json';
import { kategoriBaslikRengi } from '../src/lib/bilgiKosesiKategoriColors';
import { kategoriEtiketCevir } from '../src/lib/bilgiKosesiKategoriCeviri';

const GOLD = '#C9A84C';
const OVERLAY = 'rgba(0,0,0,0.38)';

type BilgiKosesiItem = {
  id: number;
  kategori: string;
  baslik: string;
  icerik: string;
  baslik_en?: string;
  icerik_en?: string;
  baslik_ar?: string;
  icerik_ar?: string;
};

type Ceviri = { id: number; baslik: string; icerik: string };

function cevirilerleBirlestir(base: BilgiKosesiItem[], en: Ceviri[], ar: Ceviri[]): BilgiKosesiItem[] {
  const enById = new Map(en.map((c) => [c.id, c]));
  const arById = new Map(ar.map((c) => [c.id, c]));
  return base.map((item) => {
    const enCeviri = enById.get(item.id);
    const arCeviri = arById.get(item.id);
    return {
      ...item,
      baslik_en: enCeviri?.baslik,
      icerik_en: enCeviri?.icerik,
      baslik_ar: arCeviri?.baslik,
      icerik_ar: arCeviri?.icerik,
    };
  });
}

const DATA = cevirilerleBirlestir(
  bilgiKosesiItems as BilgiKosesiItem[],
  bilgiKosesiItemsEn as Ceviri[],
  bilgiKosesiItemsAr as Ceviri[],
);

function BilgiKart({ item, lang }: { item: BilgiKosesiItem; lang: string }) {
  const baslikRengi = kategoriBaslikRengi(item.kategori);
  const isRtl = lang === 'ar';
  const baslik = lang === 'en' ? item.baslik_en ?? item.baslik : lang === 'ar' ? item.baslik_ar ?? item.baslik : item.baslik;
  const icerik = lang === 'en' ? item.icerik_en ?? item.icerik : lang === 'ar' ? item.icerik_ar ?? item.icerik : item.icerik;
  return (
    <View style={styles.kart} accessibilityRole="text">
      <View style={[styles.kartSolSerit, { backgroundColor: baslikRengi }]} />
      <View style={styles.kartIcerik}>
        <Text style={[styles.kategoriEtiket, { color: baslikRengi }, isRtl && styles.metinRtl]} numberOfLines={1}>
          {kategoriEtiketCevir(item.kategori, lang)}
        </Text>
        <Text style={[styles.baslik, { color: baslikRengi }, isRtl && styles.metinRtl]}>{baslik}</Text>
        <Text style={[styles.metin, isRtl && styles.metinRtl]}>{icerik}</Text>
      </View>
    </View>
  );
}

export default function BilgiKosesiScreen() {
  const { t } = useTranslation();
  const { language } = useAppLanguage();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomPad = 16 + insets.bottom;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <Image
        source={require('../assets/images/bilgi_kosesi_background.jpeg')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={0}
        priority="high"
      />
      <View style={styles.arkaPlanOverlay} />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.topRow}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.88 }]}
            accessibilityLabel={t('bilgiKosesi.backA11y')}
            accessibilityRole="button"
          >
            <Text style={styles.backBtnArrow}>←</Text>
          </Pressable>
        </View>
        <FlatList
          style={styles.liste}
          data={DATA}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item }) => <BilgiKart item={item} lang={language} />}
          showsVerticalScrollIndicator
          contentContainerStyle={[styles.listContent, { paddingBottom: bottomPad }]}
          initialNumToRender={10}
          maxToRenderPerBatch={8}
          windowSize={7}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1a1a1a' },
  arkaPlanOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: OVERLAY },
  safe: { flex: 1 },
  topRow: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 8, zIndex: 1 },
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
  },
  backBtnArrow: { color: GOLD, fontSize: 24, fontWeight: '600', lineHeight: 28 },
  liste: { flex: 1 },
  listContent: { paddingHorizontal: 14, paddingTop: 4 },
  kart: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 252, 247, 0.95)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(201, 168, 76, 0.28)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: { elevation: 3 },
    }),
  },
  kartSolSerit: { width: 4 },
  kartIcerik: { flex: 1, paddingVertical: 12, paddingRight: 12, paddingLeft: 10 },
  kategoriEtiket: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    opacity: 0.92,
  },
  baslik: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
    marginTop: 4,
  },
  metin: {
    fontSize: 14,
    lineHeight: 22,
    color: '#2a2a2a',
    fontWeight: '500',
    marginTop: 8,
  },
  metinRtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

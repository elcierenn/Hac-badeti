import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const BG = '#1a0a0a';
const RED = '#C0392B';
const RED_DIM = 'rgba(192,57,43,0.18)';
const GOLD = '#C9A84C';

type NumaraItem = { labelKey: string; numara: string; descKey?: string };

const NUMARALAR: NumaraItem[] = [
  { labelKey: 'phone.emergency', numara: '911', descKey: 'phone.emergencyDesc' },
  { labelKey: 'phone.police', numara: '999', descKey: 'phone.policeDesc' },
  { labelKey: 'phone.ambulance', numara: '997', descKey: 'phone.ambulanceDesc' },
  { labelKey: 'phone.fire', numara: '998', descKey: 'phone.fireDesc' },
  { labelKey: 'phone.hajj', numara: '+966 920 004 814', descKey: 'phone.hajjDesc' },
  { labelKey: 'phone.civil', numara: '+966 800 244 5555', descKey: 'phone.civilDesc' },
];

type BilgiKey = { titleKey: string; bodyKey: string };

const BILGILER: BilgiKey[] = [
  { titleKey: 'info.lost', bodyKey: 'info.lostBody' },
  { titleKey: 'info.health', bodyKey: 'info.healthBody' },
  { titleKey: 'info.document', bodyKey: 'info.documentBody' },
  { titleKey: 'info.crowd', bodyKey: 'info.crowdBody' },
];

export default function AcilDurumScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const call = (numara: string) => {
    const cleaned = numara.replace(/\s/g, '');
    Linking.openURL(`tel:${cleaned}`).catch(() => {});
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.8 }]}
            accessibilityRole="button"
          >
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>{t('acilDurum.title')}</Text>
          <View style={{ minWidth: 44 }} />
        </View>

        <View style={styles.uyariBanner}>
          <Text style={styles.uyariEmoji}>🆘</Text>
          <Text style={styles.uyariText}>{t('acilDurum.banner')}</Text>
        </View>

        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: 24 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>{t('acilDurum.phoneSection')}</Text>

          {NUMARALAR.map((item, i) => (
            <Pressable
              key={i}
              onPress={() => call(item.numara)}
              style={({ pressed }) => [styles.numara, pressed && { opacity: 0.85 }]}
              accessibilityRole="button"
            >
              <View style={styles.numaraLeft}>
                <Text style={styles.numaraEtiket}>{t(`acilDurum.${item.labelKey}`)}</Text>
                {item.descKey && (
                  <Text style={styles.numaraAciklama}>{t(`acilDurum.${item.descKey}`)}</Text>
                )}
              </View>
              <View style={styles.numaraRight}>
                <Text style={styles.numaraText}>{item.numara}</Text>
                <View style={styles.araBtn}>
                  <Text style={styles.araBtnText}>{t('acilDurum.call')}</Text>
                </View>
              </View>
            </Pressable>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>{t('acilDurum.infoSection')}</Text>

          {BILGILER.map((item, i) => (
            <View key={i} style={styles.bilgiKart}>
              <Text style={styles.bilgiBaslik}>{t(`acilDurum.${item.titleKey}`)}</Text>
              <View style={styles.bilgiDivider} />
              <Text style={styles.bilgiIcerik}>{t(`acilDurum.${item.bodyKey}`)}</Text>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderBottomWidth: 1, borderBottomColor: RED_DIM,
  },
  backBtn: {
    borderRadius: 14, paddingVertical: 10, paddingHorizontal: 12,
    minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)',
  },
  backArrow: { color: '#fff', fontSize: 24, fontWeight: '600', lineHeight: 28 },
  headerTitle: { flex: 1, color: RED, fontSize: 19, fontWeight: '800', textAlign: 'center' },
  uyariBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(192,57,43,0.15)',
    borderBottomWidth: 1, borderBottomColor: RED_DIM,
    paddingHorizontal: 16, paddingVertical: 10,
  },
  uyariEmoji: { fontSize: 20 },
  uyariText: { flex: 1, color: 'rgba(255,140,120,0.9)', fontSize: 13, fontWeight: '600', lineHeight: 19 },
  content: { padding: 14, gap: 10 },
  sectionTitle: {
    color: RED, fontSize: 12, fontWeight: '800',
    textTransform: 'uppercase', letterSpacing: 0.6,
    paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: RED_DIM,
    marginBottom: 2,
  },
  numara: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14, padding: 14,
    borderWidth: 1.5, borderColor: 'rgba(192,57,43,0.3)',
    gap: 12,
  },
  numaraLeft: { flex: 1, gap: 2 },
  numaraEtiket: { color: '#fff', fontSize: 14, fontWeight: '700' },
  numaraAciklama: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '500' },
  numaraRight: { alignItems: 'flex-end', gap: 6 },
  numaraText: { color: RED, fontSize: 15, fontWeight: '800', letterSpacing: 0.3 },
  araBtn: { backgroundColor: RED, borderRadius: 10, paddingVertical: 5, paddingHorizontal: 12 },
  araBtnText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  bilgiKart: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14, padding: 14,
    borderWidth: 1.5, borderColor: 'rgba(201,168,76,0.2)',
    gap: 8,
  },
  bilgiBaslik: { color: GOLD, fontSize: 14, fontWeight: '800' },
  bilgiDivider: { height: 1, backgroundColor: 'rgba(201,168,76,0.15)' },
  bilgiIcerik: { color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: '500', lineHeight: 21 },
});

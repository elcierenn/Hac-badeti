import { useRouter, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BG = '#ECE6DC';
const GOLD = '#C9A84C';
const GOLD_DIM = 'rgba(201,168,76,0.18)';
const DANGER = '#C0392B';

type Tool = {
  key: string;
  icon: string;
  route: Href;
  danger?: boolean;
  full?: boolean;
};

const TOOLS: Tool[] = [
  { key: 'tesbih',      icon: '📿', route: '/tesbih' as Href },
  { key: 'kible',       icon: '🧭', route: '/kible-pusulasi' as Href },
  { key: 'duaRehberi',  icon: '🤲', route: '/dua-rehberi' as Href },
  { key: 'sss',         icon: '❓', route: '/sss' as Href },
  { key: 'hazirlik',    icon: '✅', route: '/hazirlik-listesi' as Href },
  { key: 'acilDurum',   icon: '🆘', route: '/acil-durum' as Href, danger: true },
  { key: 'hacNotlari',  icon: '📓', route: '/hac-notlari' as Href, full: true },
];

function AmbientBlobs() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {[
        { t: 40,  l: -30, s: 220, o: 0.07 },
        { t: 200, l: 170, s: 160, o: 0.05 },
        { t: 380, l: 20,  s: 200, o: 0.06 },
      ].map((b, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            top: b.t, left: b.l,
            width: b.s, height: b.s,
            borderRadius: b.s / 2,
            backgroundColor: `rgba(201,168,76,${b.o})`,
          }}
        />
      ))}
    </View>
  );
}

export default function AraclarScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const pairs: Tool[][] = [];
  const fullWidths: Tool[] = [];
  const regular = TOOLS.filter((t) => !t.full);
  fullWidths.push(...TOOLS.filter((t) => t.full));
  for (let i = 0; i < regular.length; i += 2) {
    pairs.push(regular.slice(i, i + 2));
  }

  return (
    <View style={styles.root}>
      <AmbientBlobs />
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.8 }]}
            accessibilityRole="button"
            accessibilityLabel={t('araclar.backA11y')}
          >
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>{t('araclar.title')}</Text>
          <View style={styles.spacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {pairs.map((pair, rowIdx) => (
            <View key={rowIdx} style={styles.row}>
              {pair.map((tool) => (
                <ToolCard key={tool.key} tool={tool} t={t} router={router} />
              ))}
              {pair.length === 1 && <View style={styles.halfPlaceholder} />}
            </View>
          ))}
          {fullWidths.map((tool) => (
            <ToolCard key={tool.key} tool={tool} t={t} router={router} full />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function ToolCard({
  tool,
  t,
  router,
  full,
}: {
  tool: Tool;
  t: (k: string) => string;
  router: ReturnType<typeof useRouter>;
  full?: boolean;
}) {
  const borderColor = tool.danger ? DANGER : GOLD;
  const iconBg = tool.danger ? 'rgba(192,57,43,0.10)' : 'rgba(201,168,76,0.14)';

  return (
    <Pressable
      onPress={() => router.push(tool.route)}
      style={({ pressed }) => [
        styles.card,
        full && styles.cardFull,
        { borderColor },
        pressed && styles.cardPressed,
      ]}
      accessibilityRole="button"
    >
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Text style={styles.icon}>{tool.icon}</Text>
      </View>
      <View style={styles.cardText}>
        <Text style={[styles.cardTitle, tool.danger && { color: DANGER }]}>
          {t(`araclar.${tool.key}`)}
        </Text>
        <Text style={styles.cardDesc}>{t(`araclar.${tool.key}Desc`)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderBottomWidth: 1,
    borderBottomColor: GOLD_DIM,
  },
  backBtn: {
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minWidth: 44, minHeight: 44,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1.5, borderColor: GOLD,
  },
  backArrow: { color: GOLD, fontSize: 24, fontWeight: '600', lineHeight: 28 },
  headerTitle: {
    flex: 1,
    color: '#5C481C',
    fontSize: 19, fontWeight: '800',
    textAlign: 'center',
  },
  spacer: { minWidth: 44 },
  content: { padding: 14, paddingBottom: 28, gap: 12 },
  row: { flexDirection: 'row', gap: 12 },
  halfPlaceholder: { flex: 1 },
  card: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1.5,
    backgroundColor: '#FFFCF7',
    padding: 16,
    gap: 10,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardFull: { flex: 0, flexDirection: 'row', alignItems: 'center', gap: 14 },
  cardPressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
  iconWrap: {
    width: 48, height: 48,
    borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  icon: { fontSize: 26 },
  cardText: { flex: 1 },
  cardTitle: {
    color: '#2A2218',
    fontSize: 15, fontWeight: '800',
    lineHeight: 20,
  },
  cardDesc: {
    color: '#7A6A50',
    fontSize: 12, fontWeight: '500',
    marginTop: 2,
  },
});

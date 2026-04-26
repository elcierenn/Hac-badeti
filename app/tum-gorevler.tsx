import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BG = '#ECE6DC';
const GOLD = '#C9A84C';
const GOLD_DIM = 'rgba(201, 168, 76, 0.18)';
const TASK_INDEXES = [1, 2, 3, 4, 5, 6, 7, 8] as const;

function AmbientBlobs() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {[
        { t: 48, l: -28, s: 220, o: 0.07 },
        { t: 220, l: 180, s: 160, o: 0.05 },
        { t: 380, l: 32, s: 200, o: 0.06 },
        { t: 100, l: 200, s: 120, o: 0.04 },
      ].map((b, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            top: b.t,
            left: b.l,
            width: b.s,
            height: b.s,
            borderRadius: b.s / 2,
            backgroundColor: `rgba(201, 168, 76, ${b.o})`,
          }}
        />
      ))}
    </View>
  );
}

function SubtleGrid() {
  const lines = 14;
  return (
    <View
      style={[StyleSheet.absoluteFill, { opacity: 0.35 }]}
      pointerEvents="none"
    >
      {Array.from({ length: lines }).map((_, i) => (
        <View
          key={`h${i}`}
          style={{
            position: 'absolute',
            top: `${(i * 100) / lines}%`,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: 'rgba(201, 168, 76, 0.06)',
          }}
        />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <View
          key={`v${i}`}
          style={{
            position: 'absolute',
            left: `${(i * 100) / 8}%`,
            top: 0,
            bottom: 0,
            width: 1,
            backgroundColor: 'rgba(201, 168, 76, 0.04)',
          }}
        />
      ))}
    </View>
  );
}

function CardInnerPattern() {
  return (
    <View style={cardPatternStyles.wrap} pointerEvents="none">
      {Array.from({ length: 12 }).map((_, i) => (
        <View
          key={i}
          style={[
            cardPatternStyles.stripe,
            {
              left: `${-5 + i * 9}%`,
              opacity: 0.03 + (i % 4) * 0.01,
            },
          ]}
        />
      ))}
      <View style={cardPatternStyles.cornerTR} />
      <View style={cardPatternStyles.cornerBL} />
    </View>
  );
}

const cardPatternStyles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: 12,
  },
  stripe: {
    position: 'absolute',
    width: 2,
    top: -32,
    bottom: -32,
    backgroundColor: GOLD,
    transform: [{ rotate: '-32deg' }],
  },
  cornerTR: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: 'rgba(201, 168, 76, 0.35)',
  },
  cornerBL: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    width: 20,
    height: 20,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderColor: 'rgba(201, 168, 76, 0.25)',
  },
});

export default function TumGorevlerScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={styles.root}>
      <AmbientBlobs />
      <SubtleGrid />
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.88 }]}
            accessibilityLabel={t('ihramAdimlar.backA11y')}
            accessibilityRole="button"
          >
            <Text style={styles.backBtnArrow}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>{t('anaGorev.allTasks')}</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.scrollShell}>
          <View style={styles.frameOuter}>
            <View style={styles.frameBevel} />
            <View style={styles.frameInner}>
              <View style={styles.innerTexture}>
                {Array.from({ length: 24 }).map((_, i) => (
                  <View
                    key={i}
                    style={{
                      position: 'absolute',
                      left: (i % 6) * 18 - 4,
                      top: Math.floor(i / 6) * 16,
                      width: 3,
                      height: 3,
                      borderRadius: 1.5,
                      backgroundColor: 'rgba(201, 168, 76, 0.12)',
                    }}
                  />
                ))}
              </View>
              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {TASK_INDEXES.map((i) => (
                  <Pressable
                    key={i}
                    onPress={() => {
                      if (i === 1) {
                        router.replace({ pathname: '/ana-gorev', params: { p: '0' } });
                      } else if (i === 2) {
                        router.replace({ pathname: '/ana-gorev', params: { p: '1' } });
                      } else if (i === 3) {
                        router.replace({ pathname: '/ana-gorev', params: { p: '2' } });
                      } else if (i === 4) {
                        router.replace({ pathname: '/ana-gorev', params: { p: '3' } });
                      } else if (i === 5) {
                        router.replace({ pathname: '/ana-gorev', params: { p: '4' } });
                      } else if (i === 6) {
                        router.replace({ pathname: '/ana-gorev', params: { p: '5' } });
                      } else if (i === 7) {
                        router.replace({ pathname: '/ana-gorev', params: { p: '6' } });
                      } else {
                        router.replace({ pathname: '/ana-gorev', params: { p: '7' } });
                      }
                    }}
                    style={({ pressed }) => [
                      styles.taskCard,
                      pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
                    ]}
                  >
                    <View style={styles.cardGoldBar} />
                    <View style={styles.cardBody}>
                      <CardInnerPattern />
                      <View style={styles.cardContent}>
                        <Text style={styles.taskText}>{t(`anaGorev.task${i}`)}</Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderBottomWidth: 1,
    borderBottomColor: GOLD_DIM,
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
  headerTitle: {
    flex: 1,
    color: '#5C481C',
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  headerSpacer: { minWidth: 44 },
  scrollShell: { flex: 1, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 8 },
  frameOuter: {
    flex: 1,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(201, 168, 76, 0.55)',
    backgroundColor: 'rgba(201, 168, 76, 0.14)',
    padding: 2,
    shadowColor: 'rgb(100, 80, 50)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  frameBevel: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(201, 168, 76, 0.28)',
    margin: 3,
  },
  frameInner: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(201, 168, 76, 0.28)',
    backgroundColor: '#FAF6EF',
    overflow: 'hidden',
  },
  innerTexture: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: 12,
    paddingBottom: 20,
    gap: 12,
  },
  taskCard: {
    flexDirection: 'row',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#FFFCF7',
    borderWidth: 1.5,
    borderColor: 'rgba(201, 168, 76, 0.45)',
    shadowColor: 'rgb(120, 100, 70)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardGoldBar: {
    width: 5,
    backgroundColor: GOLD,
    opacity: 0.9,
  },
  cardBody: { flex: 1, minHeight: 72, position: 'relative' },
  cardContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingLeft: 14,
  },
  taskText: {
    color: '#2A2218',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

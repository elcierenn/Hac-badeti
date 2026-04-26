import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter, type Href, type Router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import {
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SwipeScrollHint } from '../src/components/SwipeScrollHint';

const OVERLAY = 'rgba(0,0,0,0.5)';
const GOLD = '#C9A84C';
const DARK_TEXT = '#1a1a1a';

type PageDef = {
  image: ImageSourcePropType;
  suffix: string;
  missionKey:
    | 'anaGorev.missionHeading'
    | 'anaGorev.mission2Heading'
    | 'anaGorev.mission3Heading'
    | 'anaGorev.mission4Heading'
    | 'anaGorev.mission5Heading'
    | 'anaGorev.mission6Heading'
    | 'anaGorev.mission7Heading'
    | 'anaGorev.mission8Heading';
};

const PAGES: PageDef[] = [
  { image: require('../assets/images/hac_ibadeti_ihrama_giris.jpeg'), suffix: '1', missionKey: 'anaGorev.missionHeading' },
  { image: require('../assets/images/mekke_kudüm.jpeg'), suffix: '2', missionKey: 'anaGorev.mission2Heading' },
  { image: require(`../assets/images/sa'y_safa-merve.jpeg`), suffix: '3', missionKey: 'anaGorev.mission3Heading' },
  { image: require('../assets/images/mina_geceleme.jpeg'), suffix: '4', missionKey: 'anaGorev.mission4Heading' },
  { image: require('../assets/images/arafat_ovası.jpeg'), suffix: '5', missionKey: 'anaGorev.mission5Heading' },
  { image: require('../assets/images/müzdelife_gece.jpeg'), suffix: '6', missionKey: 'anaGorev.mission6Heading' },
  { image: require('../assets/images/cemaat_köprüsü.jpeg'), suffix: '7', missionKey: 'anaGorev.mission7Heading' },
  { image: require('../assets/images/kabe_7_tavaf.jpeg'), suffix: '8', missionKey: 'anaGorev.mission8Heading' },
];

function AnaGorevPage({
  width,
  height,
  page,
  t,
  startPress,
  router,
  swipeHint,
  totalPages,
}: {
  width: number;
  height: number;
  page: PageDef;
  t: (k: string) => string;
  startPress: () => void;
  router: Pick<Router, 'back' | 'push'>;
  swipeHint: 'forward' | 'back' | 'both' | null;
  totalPages: number;
}) {
  return (
    <View style={{ width, height, backgroundColor: '#000' }}>
      <Image
        source={page.image}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={0}
        priority="high"
      />
      <View style={[StyleSheet.absoluteFill, styles.overlay]} />
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
          <View style={styles.topRightCol}>
            <Pressable
              onPress={() => router.push('/tum-gorevler' as Href)}
              style={({ pressed }) => [styles.allTasksBtn, pressed && { opacity: 0.88 }]}
              accessibilityLabel={t('anaGorev.allTasksA11y')}
              accessibilityRole="button"
            >
              <Text style={styles.allTasksBtnText}>{t('anaGorev.allTasks')}</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/bilgi-kosesi' as Href)}
              style={({ pressed }) => [styles.allTasksBtn, pressed && { opacity: 0.88 }]}
              accessibilityLabel={t('anaGorev.infoCornerA11y')}
              accessibilityRole="button"
            >
              <Text style={styles.allTasksBtnText}>{t('anaGorev.infoCorner')}</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.middle}>
          <View style={styles.screenTitleFrame}>
            <View style={styles.titleRow}>
              <Text style={styles.screenTitle}>{t('anaGorev.screenTitle')}</Text>
              <Text style={styles.screenTitleSuffix}>{page.suffix}</Text>
            </View>
          </View>
          <Text style={styles.missionLabel}>{t(page.missionKey)}</Text>
        </View>
        <View style={styles.bottom}>
          <Pressable
            onPress={startPress}
            style={({ pressed }) => [styles.btn, pressed && { opacity: 0.9 }]}
            accessibilityLabel={t('anaGorev.start')}
            accessibilityRole="button"
          >
            <Text style={styles.btnText}>{t('anaGorev.start')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
      {swipeHint && totalPages > 1 ? (
        swipeHint === 'both' ? (
          <>
            <View style={[styles.swipeHintEdge, styles.swipeHintEdgeLeft]} pointerEvents="none">
              <SwipeScrollHint direction="back" tintColor={GOLD} />
            </View>
            <View style={styles.swipeHintEdge} pointerEvents="none">
              <SwipeScrollHint direction="forward" tintColor={GOLD} />
            </View>
          </>
        ) : (
          <View
            style={[styles.swipeHintEdge, swipeHint === 'back' && styles.swipeHintEdgeLeft]}
            pointerEvents="none"
          >
            <SwipeScrollHint direction={swipeHint} tintColor={GOLD} />
          </View>
        )
      ) : null}
    </View>
  );
}

export default function AnaGorevScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { p } = useLocalSearchParams<{ p?: string }>();
  const { width, height } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [activePage, setActivePage] = useState(0);

  const paramPage = useMemo(() => {
    const n = parseInt(p ?? '0', 10);
    if (Number.isNaN(n)) return 0;
    return Math.min(Math.max(0, n), PAGES.length - 1);
  }, [p]);

  useEffect(() => {
    if (width <= 0) return;
    const x = paramPage * width;
    scrollRef.current?.scrollTo({ x, animated: false });
  }, [paramPage, width, p]);

  useEffect(() => {
    setActivePage(paramPage);
  }, [paramPage]);

  const onScrollPagerEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    if (width <= 0) return;
    setActivePage(Math.round(x / width));
  };

  const onStart = () => {
    if (activePage === 0) {
      router.push('/ihram-adimlar' as Href);
    } else if (activePage === 1) {
      router.push('/kudum-adimlar' as Href);
    } else if (activePage === 2) {
      router.push('/say-adimlar' as Href);
    } else if (activePage === 3) {
      router.push('/mina-geceleme-adimlar' as Href);
    } else if (activePage === 4) {
      router.push('/arafat-vakfesi-adimlar' as Href);
    } else if (activePage === 5) {
      router.push('/muzdelife-vakfesi-adimlar' as Href);
    } else if (activePage === 6) {
      router.push('/seytan-kurban-tiras-adimlar' as Href);
    } else {
      router.push('/veda-tavaf-adimlar' as Href);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        bounces
        style={styles.pager}
        onMomentumScrollEnd={onScrollPagerEnd}
      >
        {PAGES.map((page, index) => (
          <AnaGorevPage
            key={page.suffix}
            width={width}
            height={height}
            page={page}
            t={t}
            startPress={onStart}
            router={router}
            totalPages={PAGES.length}
            swipeHint={
              index === 0
                ? 'forward'
                : index === PAGES.length - 1
                  ? 'back'
                  : 'both'
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  pager: { flex: 1 },
  overlay: { backgroundColor: OVERLAY },
  safe: { flex: 1 },
  swipeHintEdge: {
    position: 'absolute',
    right: 6,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingBottom: 72,
  },
  swipeHintEdgeLeft: { right: undefined, left: 6 },
  topRightCol: { alignItems: 'flex-end', gap: 8 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 4,
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
  allTasksBtn: {
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
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
  allTasksBtnText: {
    color: GOLD,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  middle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  screenTitleFrame: {
    borderWidth: 1.5,
    borderColor: GOLD,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  screenTitle: {
    color: GOLD,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  screenTitleSuffix: {
    color: GOLD,
    fontSize: 18,
    fontWeight: '700',
  },
  missionLabel: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 12,
  },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    alignItems: 'center',
  },
  btn: {
    backgroundColor: GOLD,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    minWidth: '100%',
    alignItems: 'center',
  },
  btnText: {
    color: DARK_TEXT,
    fontSize: 18,
    fontWeight: '800',
  },
});

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const GOLD = '#C9A84C';
const DARK = '#1a1a1a';
const BUBBLE = 'rgba(255, 252, 247, 0.78)';

type Gender = 'male' | 'female';

const MALE_KEYS = [
  'ihramAdim3Elbise.male1',
  'ihramAdim3Elbise.male2',
  'ihramAdim3Elbise.male3',
  'ihramAdim3Elbise.male4',
  'ihramAdim3Elbise.male5',
] as const;
const FEMALE_KEYS = [
  'ihramAdim3Elbise.female1',
  'ihramAdim3Elbise.female2',
  'ihramAdim3Elbise.female3',
  'ihramAdim3Elbise.female4',
  'ihramAdim3Elbise.female5',
] as const;

export default function IhramAdim3ElbiseScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [gender, setGender] = useState<Gender>('male');
  const lines = gender === 'male' ? MALE_KEYS : FEMALE_KEYS;
  const bottomPad = 12 + insets.bottom;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <Image
        source={require('../assets/images/ihram_elbise.jpeg')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={0}
        priority="high"
      />
      <View style={styles.overlayCol} pointerEvents="box-none">
        <View style={styles.splitTop} />
        <View style={[styles.splitBottom, { marginBottom: bottomPad, paddingTop: 10 }]}>
          <View style={styles.bubbleContent}>
            <View style={styles.bubbleWrapper}>
              <View style={styles.blurBlock}>
                <View style={styles.bubble}>
                  <Text style={styles.bubbleLabel}>{t('ihramAdim3Elbise.selectGender')}</Text>
                  <View style={styles.genderRow}>
                    <Pressable
                      onPress={() => setGender('male')}
                      style={({ pressed }) => [
                        styles.genderBtn,
                        gender === 'male' && styles.genderBtnActive,
                        pressed && { opacity: 0.9 },
                      ]}
                      accessibilityLabel={t('ihramAdim3Elbise.erkekA11y')}
                      accessibilityState={{ selected: gender === 'male' }}
                      accessibilityRole="button"
                    >
                      <Text
                        style={[
                          styles.genderBtnText,
                          gender === 'male' && styles.genderBtnTextActive,
                        ]}
                      >
                        {t('ihramAdim3Elbise.erkek')}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setGender('female')}
                      style={({ pressed }) => [
                        styles.genderBtn,
                        gender === 'female' && styles.genderBtnActive,
                        pressed && { opacity: 0.9 },
                      ]}
                      accessibilityLabel={t('ihramAdim3Elbise.kadinA11y')}
                      accessibilityState={{ selected: gender === 'female' }}
                      accessibilityRole="button"
                    >
                      <Text
                        style={[
                          styles.genderBtnText,
                          gender === 'female' && styles.genderBtnTextActive,
                        ]}
                      >
                        {t('ihramAdim3Elbise.kadin')}
                      </Text>
                    </Pressable>
                  </View>
                  <ScrollView
                    style={styles.textScroll}
                    contentContainerStyle={styles.textScrollContent}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled
                  >
                    {lines.map((key) => (
                      <View key={key} style={styles.bulletRow}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bodyLine}>{t(key)}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      <SafeAreaView style={styles.topSafe} pointerEvents="box-none" edges={['top', 'left', 'right']}>
        <View style={styles.topRow}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.88 }]}
            accessibilityLabel={t('ihramAdim3Elbise.backA11y')}
            accessibilityRole="button"
          >
            <Text style={styles.backBtnArrow}>←</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  overlayCol: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  splitTop: { flex: 1 },
  splitBottom: {
    flexShrink: 0,
    marginHorizontal: 16,
    minHeight: 0,
  },
  blurBlock: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: 'hidden',
  },
  topSafe: { position: 'absolute', left: 0, right: 0, top: 0, zIndex: 2 },
  topRow: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 8 },
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
  bubbleContent: { zIndex: 1 },
  bubbleWrapper: { position: 'relative' },
  bubble: {
    zIndex: 1,
    backgroundColor: BUBBLE,
    borderWidth: 1.5,
    borderColor: 'rgba(201, 168, 76, 0.5)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  bubbleLabel: {
    color: DARK,
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  genderRow: { flexDirection: 'row', gap: 10, marginBottom: 14, justifyContent: 'center' },
  genderBtn: {
    flex: 1,
    maxWidth: 160,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: GOLD,
    backgroundColor: 'rgba(255,252,247,0.5)',
    alignItems: 'center',
  },
  genderBtnActive: { backgroundColor: 'rgba(201, 168, 76, 0.32)' },
  genderBtnText: { color: DARK, fontSize: 16, fontWeight: '700' },
  genderBtnTextActive: { color: DARK, fontWeight: '800' },
  textScroll: {},
  textScrollContent: { paddingTop: 2, paddingBottom: 4, flexGrow: 0 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, gap: 8 },
  bullet: { color: DARK, fontSize: 16, lineHeight: 22, fontWeight: '800', marginTop: 1 },
  bodyLine: { flex: 1, color: DARK, fontSize: 15, lineHeight: 22, fontWeight: '500' },
});

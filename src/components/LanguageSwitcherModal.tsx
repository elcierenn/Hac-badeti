import { useTranslation } from 'react-i18next';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppLanguage } from '../context/LanguageContext';
import { APP_LANGUAGES, type AppLanguage } from '../i18n/config';
import { isLanguageRtl } from '../i18n/rtl';

const GOLD = '#C9A84C';

const LANG_FLAG: Record<AppLanguage, string> = {
  tr: '🇹🇷',
  en: '🇬🇧',
  ar: '🇸🇦',
  ur: '🇵🇰',
  id: '🇮🇩',
  bn: '🇧🇩',
  fr: '🇫🇷',
  fa: '🇮🇷',
};

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function LanguageSwitcherModal({ visible, onClose }: Props) {
  const { t } = useTranslation();
  const { language, setLanguage, isRtl } = useAppLanguage();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel={t('common.close')} />
        <SafeAreaView style={styles.sheet} edges={['bottom']}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={[styles.title, isRtl && styles.rtlText]}>{t('common.selectLanguage')}</Text>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.8 }]}
              accessibilityRole="button"
              accessibilityLabel={t('common.close')}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          <FlatList
            data={APP_LANGUAGES}
            keyExtractor={(code) => code}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
            renderItem={({ item: code }) => (
              <LangCard
                code={code}
                active={code === language}
                onPress={() => {
                  void setLanguage(code);
                  onClose();
                }}
              />
            )}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
}

function LangCard({
  code,
  active,
  onPress,
}: {
  code: AppLanguage;
  active: boolean;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const rtl = isLanguageRtl(code);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, active && styles.cardActive, pressed && { opacity: 0.85 }]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={styles.flag}>{LANG_FLAG[code]}</Text>
      <Text style={[styles.cardText, active && styles.cardTextActive, rtl && styles.rtlText]}>
        {t(`languages.${code}`)}
      </Text>
      {active && <Text style={styles.check}>✓</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#FFFCF7',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
    paddingTop: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: '800', color: '#2A2218' },
  closeBtn: {
    width: 32, height: 32,
    borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  closeBtnText: { fontSize: 15, fontWeight: '700', color: '#5C481C' },
  list: { paddingHorizontal: 16, paddingBottom: 24, gap: 12 },
  row: { gap: 12 },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(201,168,76,0.3)',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  cardActive: { borderColor: GOLD, backgroundColor: 'rgba(201,168,76,0.12)' },
  flag: { fontSize: 22 },
  cardText: { flex: 1, fontSize: 14, fontWeight: '700', color: '#2A2218' },
  cardTextActive: { color: '#5C481C' },
  check: { color: GOLD, fontSize: 15, fontWeight: '800' },
  rtlText: { writingDirection: 'rtl', textAlign: 'right' },
});

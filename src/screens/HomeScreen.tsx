import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAppLanguage } from '../context/LanguageContext';
import type { AppLanguage } from '../i18n/config';
import { colors, radius, space } from '../theme/tokens';

const LANGS: AppLanguage[] = ['tr', 'en', 'ar'];

const langLabelKey: Record<AppLanguage, 'langTr' | 'langEn' | 'langAr'> = {
  tr: 'langTr',
  en: 'langEn',
  ar: 'langAr',
};

export function HomeScreen() {
  const { t } = useTranslation();
  const { language, setLanguage, isRtl } = useAppLanguage();

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      style={[styles.root, { direction: isRtl ? 'rtl' : 'ltr' }]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{t('appTitle')}</Text>
        <Text style={styles.tagline}>{t('tagline')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>{t('selectLanguage')}</Text>
        <View style={styles.langRow}>
          {LANGS.map((code) => (
            <Pressable
              key={code}
              onPress={() => void setLanguage(code)}
              style={[
                styles.chip,
                language === code && styles.chipActive,
              ]}
            >
              <Text
                style={[
                styles.chipText,
                language === code && styles.chipTextActive,
              ]}
              >
                {t(langLabelKey[code])}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.imageCard}>
        <Text style={styles.imageCaption}>{t('imageDemoCaption')}</Text>
        <Image
          source={require('../../assets/splash-icon.png')}
          style={styles.heroImage}
          contentFit="contain"
          transition={200}
        />
      </View>

      <Text style={styles.body}>{t('homeBody')}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: space.lg, paddingBottom: space.xl * 2, gap: space.lg },
  header: { gap: space.sm },
  title: { fontSize: 26, fontWeight: '700', color: colors.text },
  tagline: { fontSize: 16, lineHeight: 24, color: colors.textSecondary },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: space.md,
  },
  label: { fontSize: 14, fontWeight: '600', color: colors.text },
  langRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  chip: {
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontSize: 14, fontWeight: '500' },
  chipTextActive: { color: colors.surface },
  imageCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  imageCaption: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: space.sm,
  },
  heroImage: { width: '100%', height: 160 },
  body: { fontSize: 15, lineHeight: 22, color: colors.text },
});

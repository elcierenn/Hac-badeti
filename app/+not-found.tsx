import { Link, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, space } from '../src/theme/tokens';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <>
      <Stack.Screen options={{ title: t('common.appTitle') }} />
      <View style={styles.wrap}>
        <Text style={styles.title}>{'404'}</Text>
        <Text style={styles.hint}>{t('notFound.hint')}</Text>
        <Link href="/" asChild>
          <Pressable style={styles.btn}>
            <Text style={styles.btnText}>{t('notFound.backHome')}</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.lg,
    backgroundColor: colors.background,
    gap: space.md,
  },
  title: { fontSize: 40, fontWeight: '800', color: colors.text },
  hint: { fontSize: 16, color: colors.textSecondary },
  btn: {
    marginTop: space.md,
    paddingVertical: space.sm,
    paddingHorizontal: space.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
  },
  btnText: { color: colors.surface, fontWeight: '600' },
});

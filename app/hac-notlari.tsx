import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const BG = '#ECE6DC';
const GOLD = '#C9A84C';
const GOLD_DIM = 'rgba(201,168,76,0.18)';
const STORAGE_KEY = '@hac_notlari';

type Not = { id: string; icerik: string; tarih: string };

function formatTarih(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function HacNotlariScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [notlar, setNotlar] = useState<Not[]>([]);
  const [metin, setMetin] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => raw && setNotlar(JSON.parse(raw)))
      .catch(() => {});
  }, []);

  const persist = useCallback((next: Not[]) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const ekle = useCallback(() => {
    const trimmed = metin.trim();
    if (!trimmed) return;
    const yeni: Not = {
      id: Date.now().toString(),
      icerik: trimmed,
      tarih: new Date().toISOString(),
    };
    setNotlar((prev) => {
      const next = [yeni, ...prev];
      persist(next);
      return next;
    });
    setMetin('');
    Keyboard.dismiss();
  }, [metin, persist]);

  const sil = useCallback((id: string) => {
    Alert.alert(t('hacNotlari.deleteTitle'), t('hacNotlari.deleteMsg'), [
      { text: t('hacNotlari.cancel'), style: 'cancel' },
      {
        text: t('hacNotlari.delete'), style: 'destructive',
        onPress: () => setNotlar((prev) => {
          const next = prev.filter((n) => n.id !== id);
          persist(next);
          return next;
        }),
      },
    ]);
  }, [t, persist]);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.8 }]}
            accessibilityRole="button"
          >
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>{t('hacNotlari.title')}</Text>
          <View style={{ minWidth: 44 }} />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          {notlar.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>📓</Text>
              <Text style={styles.emptyText}>{t('hacNotlari.empty')}</Text>
            </View>
          ) : (
            <FlatList
              data={notlar}
              keyExtractor={(n) => n.id}
              contentContainerStyle={[styles.list, { paddingBottom: 16 + insets.bottom }]}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              renderItem={({ item }) => (
                <View style={styles.not}>
                  <View style={styles.notHeader}>
                    <Text style={styles.tarih}>{formatTarih(item.tarih)}</Text>
                    <Pressable
                      onPress={() => sil(item.id)}
                      hitSlop={10}
                      style={({ pressed }) => [styles.silBtn, pressed && { opacity: 0.7 }]}
                      accessibilityRole="button"
                      accessibilityLabel={t('hacNotlari.delete')}
                    >
                      <Text style={styles.silText}>✕</Text>
                    </Pressable>
                  </View>
                  <Text style={styles.icerik}>{item.icerik}</Text>
                </View>
              )}
            />
          )}

          <View style={[styles.inputRow, { paddingBottom: insets.bottom || 12 }]}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={metin}
              onChangeText={setMetin}
              placeholder={t('hacNotlari.placeholder')}
              placeholderTextColor="rgba(100,80,40,0.45)"
              multiline
              maxLength={500}
              returnKeyType="default"
            />
            <Pressable
              onPress={ekle}
              disabled={!metin.trim()}
              style={({ pressed }) => [
                styles.ekleBtn,
                !metin.trim() && styles.ekleBtnDisabled,
                pressed && { opacity: 0.85 },
              ]}
              accessibilityRole="button"
              accessibilityLabel={t('hacNotlari.add')}
            >
              <Text style={styles.ekleBtnText}>{t('hacNotlari.add')}</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
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
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingBottom: 80 },
  emptyIcon: { fontSize: 48 },
  emptyText: { color: 'rgba(100,80,40,0.5)', fontSize: 15, fontWeight: '500', textAlign: 'center' },
  list: { padding: 14 },
  not: {
    backgroundColor: '#FFFCF7',
    borderRadius: 16, padding: 14,
    borderWidth: 1.5, borderColor: 'rgba(201,168,76,0.3)',
    gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 5, elevation: 2,
  },
  notHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tarih: { color: 'rgba(100,80,40,0.55)', fontSize: 12, fontWeight: '600' },
  silBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(192,57,43,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  silText: { color: '#C0392B', fontSize: 13, fontWeight: '700' },
  icerik: { color: '#2A2218', fontSize: 15, fontWeight: '500', lineHeight: 23 },
  inputRow: {
    flexDirection: 'row', gap: 10,
    paddingHorizontal: 12, paddingTop: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderTopWidth: 1, borderTopColor: GOLD_DIM,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFCF7',
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1.5, borderColor: 'rgba(201,168,76,0.35)',
    color: '#2A2218', fontSize: 15, fontWeight: '500',
    maxHeight: 120, minHeight: 48,
  },
  ekleBtn: {
    backgroundColor: GOLD,
    borderRadius: 14, paddingHorizontal: 16,
    height: 48, alignItems: 'center', justifyContent: 'center',
  },
  ekleBtnDisabled: { opacity: 0.4 },
  ekleBtnText: { color: '#1a1a1a', fontSize: 14, fontWeight: '800' },
});

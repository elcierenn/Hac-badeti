import '../src/i18n/config';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LanguageProvider } from '../src/context/LanguageContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }} />
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

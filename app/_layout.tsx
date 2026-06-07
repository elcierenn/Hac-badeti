import '../src/i18n/config';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LanguageProvider } from '../src/context/LanguageContext';
import { ProgressProvider } from '../src/context/ProgressContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <ProgressProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </ProgressProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

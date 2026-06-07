import '../src/i18n/config';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import mobileAds from 'react-native-google-mobile-ads';

import { ensureTrackingPermission } from '../src/ads/requestTrackingPermission';
import { LanguageProvider } from '../src/context/LanguageContext';
import { ProgressProvider } from '../src/context/ProgressContext';

export default function RootLayout() {
  useEffect(() => {
    ensureTrackingPermission().finally(() => {
      mobileAds()
        .initialize()
        .then((adapterStatuses) => console.log('[MobileAds] initialized', adapterStatuses))
        .catch((error) => console.warn('[MobileAds] initialize failed', error));
    });
  }, []);

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

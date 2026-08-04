import '../src/i18n/config';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { gatherAdsConsent } from '../src/ads/consent';
import { ensureMobileAdsInitialized } from '../src/ads/initializeMobileAds';
import { ensureTrackingPermission } from '../src/ads/requestTrackingPermission';
import { LanguageProvider } from '../src/context/LanguageContext';
import { ProgressProvider } from '../src/context/ProgressContext';
import { PurchaseProvider } from '../src/context/PurchaseContext';

export default function RootLayout() {
  useEffect(() => {
    // ATT first (iOS asks before any tracking), then the UMP consent form, and
    // only then the Mobile Ads SDK — Google requires consent to be settled
    // before the SDK requests its first ad.
    void (async () => {
      await ensureTrackingPermission();

      const canRequestAds = await gatherAdsConsent();
      if (!canRequestAds) {
        if (__DEV__) console.log('[MobileAds] consent withheld, skipping initialization');
        return;
      }

      await ensureMobileAdsInitialized();
    })();
  }, []);

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <ProgressProvider>
          <PurchaseProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </PurchaseProvider>
        </ProgressProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

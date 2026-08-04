import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

import { BANNER_AD_UNIT_ID } from '../ads/adUnits';
import { useCanRequestAds } from '../ads/consent';
import { usePurchase } from '../context/PurchaseContext';

/**
 * Adaptive banner that collapses to nothing if the ad fails to load,
 * so screens never show an empty gap when there's no fill.
 */
export function AdBanner() {
  const [failed, setFailed] = useState(false);
  const { isAdFree } = usePurchase();
  // Renders nothing until UMP consent is settled, so no ad request goes out
  // before the user has answered the consent form.
  const canRequestAds = useCanRequestAds();

  if (failed || isAdFree || !canRequestAds) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <BannerAd
        unitId={BANNER_AD_UNIT_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdFailedToLoad={(error) => {
          console.warn('[AdBanner] failed to load', error);
          setFailed(true);
        }}
        onAdLoaded={() => console.log('[AdBanner] loaded')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignItems: 'center',
  },
});

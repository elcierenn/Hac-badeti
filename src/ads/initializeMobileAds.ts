import mobileAds from 'react-native-google-mobile-ads';

let initialization: Promise<void> | null = null;

/**
 * Starts the Mobile Ads SDK at most once per app session. Safe to call from
 * anywhere consent has just become available — the first call does the work,
 * later ones await the same promise.
 */
export function ensureMobileAdsInitialized(): Promise<void> {
  if (!initialization) {
    initialization = mobileAds()
      .initialize()
      .then((adapterStatuses) => {
        if (__DEV__) console.log('[MobileAds] initialized', adapterStatuses);
      })
      .catch((error) => {
        console.warn('[MobileAds] initialize failed', error);
        // Allow a later attempt (e.g. after the user grants consent) to retry.
        initialization = null;
      });
  }
  return initialization;
}

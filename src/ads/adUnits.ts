import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

const PROD_BANNER_ID = Platform.select({
  ios: 'ca-app-pub-9331428503808272/3913250885',
  android: 'ca-app-pub-9331428503808272/4260205013',
});

const PROD_INTERSTITIAL_ID = Platform.select({
  ios: 'ca-app-pub-9331428503808272/1737983455',
  android: 'ca-app-pub-9331428503808272/2791740901',
});

/**
 * Falls back to Google's test IDs in development so debug builds never
 * serve (and accidentally click) real ads from the production AdMob account.
 */
export const BANNER_AD_UNIT_ID = __DEV__ ? TestIds.BANNER : PROD_BANNER_ID ?? TestIds.BANNER;
export const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : PROD_INTERSTITIAL_ID ?? TestIds.INTERSTITIAL;

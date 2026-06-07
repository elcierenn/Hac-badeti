import { TestIds } from 'react-native-google-mobile-ads';

/**
 * Production ad unit IDs go here once the AdMob account is approved.
 * Until then __DEV__ AND production both fall back to Google's test IDs
 * so the app never serves real ads from an unreviewed account.
 */
const PROD_BANNER_ID = '';
const PROD_INTERSTITIAL_ID = '';

export const BANNER_AD_UNIT_ID = PROD_BANNER_ID || TestIds.BANNER;
export const INTERSTITIAL_AD_UNIT_ID = PROD_INTERSTITIAL_ID || TestIds.INTERSTITIAL;

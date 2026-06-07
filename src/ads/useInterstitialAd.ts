import { useCallback, useEffect, useRef, useState } from 'react';
import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads';

import { INTERSTITIAL_AD_UNIT_ID } from './adUnits';

/** Show an interstitial at most this often, to keep the app from feeling ad-heavy. */
const SHOW_EVERY_N_CALLS = 3;

function loadInterstitial() {
  const ad = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID);
  ad.load();
  return ad;
}

/**
 * Returns a function that, when called, shows a pre-loaded interstitial
 * roughly every Nth call. Calls in between are no-ops so navigation never blocks.
 */
export function useInterstitialAd() {
  const adRef = useRef<InterstitialAd | null>(null);
  const [loaded, setLoaded] = useState(false);
  const callCount = useRef(0);

  useEffect(() => {
    let unsubscribers: Array<() => void> = [];

    const attach = (ad: InterstitialAd) => {
      adRef.current = ad;
      const unsubLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
        console.log('[Interstitial] loaded');
        setLoaded(true);
      });
      const unsubError = ad.addAdEventListener(AdEventType.ERROR, (error) => {
        console.warn('[Interstitial] failed to load', error);
      });
      const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
        setLoaded(false);
        unsubscribers.forEach((unsub) => unsub());
        attach(loadInterstitial());
      });
      unsubscribers = [unsubLoaded, unsubError, unsubClosed];
    };

    attach(loadInterstitial());

    return () => unsubscribers.forEach((unsub) => unsub());
  }, []);

  return useCallback(() => {
    callCount.current += 1;
    if (callCount.current % SHOW_EVERY_N_CALLS !== 0) {
      return;
    }
    if (loaded && adRef.current) {
      adRef.current.show();
    }
  }, [loaded]);
}

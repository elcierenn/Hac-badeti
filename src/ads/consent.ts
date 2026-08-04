import { useSyncExternalStore } from 'react';
import {
  AdsConsent,
  AdsConsentPrivacyOptionsRequirementStatus,
} from 'react-native-google-mobile-ads';

import { ensureMobileAdsInitialized } from './initializeMobileAds';

/**
 * Google's User Messaging Platform (UMP) consent flow. Users in the EEA, the UK
 * and Switzerland must be shown a GDPR consent form — and users in the covered
 * US states an opt-out notice — before the Mobile Ads SDK may request ads.
 * The forms themselves are authored in the AdMob console (Privacy & messaging);
 * this module only asks the SDK to gather and surface them.
 */

/**
 * Whether ads may currently be requested. Starts as `false` so no ad component
 * fires a request before consent has been settled at launch; `gatherAdsConsent`
 * flips it and notifies subscribers.
 */
let canRequestAds = false;
const listeners = new Set<() => void>();

function setCanRequestAds(next: boolean) {
  if (canRequestAds === next) return;
  canRequestAds = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Subscribes a component to the consent gate. Ad components must render nothing
 * (and load nothing) while this is `false`.
 */
export function useCanRequestAds(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => canRequestAds,
    () => false,
  );
}

/**
 * Requests consent info and presents the consent form when it's required.
 * Returns whether ads may be requested, so the caller can hold off on
 * initializing the Mobile Ads SDK until consent has been settled.
 */
export async function gatherAdsConsent(): Promise<boolean> {
  let allowed: boolean;
  try {
    const info = await AdsConsent.gatherConsent();
    allowed = info.canRequestAds;
  } catch (error) {
    console.warn('[AdsConsent] gatherConsent failed', error);
    // A transient failure (no network on first launch, form not yet published)
    // must not permanently silence ads. Fall back to the consent state stored
    // from an earlier session; the SDK itself withholds personalized ads while
    // consent is missing, so proceeding here can't leak personalized targeting.
    try {
      const cached = await AdsConsent.getConsentInfo();
      allowed = cached.canRequestAds;
    } catch (cacheError) {
      console.warn('[AdsConsent] getConsentInfo failed', cacheError);
      allowed = true;
    }
  }

  setCanRequestAds(allowed);
  return allowed;
}

/**
 * True when the user must be offered a way to reopen the consent form and
 * change their choices — required for EEA/UK users, absent elsewhere.
 */
export async function isPrivacyOptionsRequired(): Promise<boolean> {
  try {
    const info = await AdsConsent.getConsentInfo();
    return (
      info.privacyOptionsRequirementStatus ===
      AdsConsentPrivacyOptionsRequirementStatus.REQUIRED
    );
  } catch (error) {
    console.warn('[AdsConsent] privacy options lookup failed', error);
    return false;
  }
}

/**
 * Reopens the Google-rendered privacy options form so the user can withdraw or
 * change consent. Returns false when the form could not be shown.
 */
export async function showAdsPrivacyOptions(): Promise<boolean> {
  try {
    const info = await AdsConsent.showPrivacyOptionsForm();
    // Withdrawing consent must take effect immediately, without a restart —
    // and granting it after an earlier refusal has to start the SDK, which
    // launch skipped.
    setCanRequestAds(info.canRequestAds);
    if (info.canRequestAds) {
      void ensureMobileAdsInitialized();
    }
    return true;
  } catch (error) {
    console.warn('[AdsConsent] showPrivacyOptionsForm failed', error);
    return false;
  }
}

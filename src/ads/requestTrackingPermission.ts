import { AppState, type AppStateStatus, Platform } from 'react-native';
import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency';

/**
 * iOS only shows the ATT prompt while the app is in the foreground and active.
 * At launch the app is still `inactive` behind the splash screen, and a request
 * made there is dismissed silently — the prompt never appears and the status
 * comes back denied. Waiting for `active` (with a timeout so a background
 * launch can't stall the ads chain forever) is what makes the prompt reliable.
 */
const ACTIVE_WAIT_TIMEOUT_MS = 10_000;

/** Extra breathing room after `active` so the key window is fully presented. */
const POST_ACTIVE_DELAY_MS = 700;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitUntilActive(): Promise<void> {
  if (AppState.currentState === 'active') {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      subscription.remove();
      resolve();
    };

    const subscription = AppState.addEventListener(
      'change',
      (state: AppStateStatus) => {
        if (state === 'active') finish();
      },
    );

    const timeout = setTimeout(finish, ACTIVE_WAIT_TIMEOUT_MS);
  });
}

/**
 * Asks for App Tracking Transparency consent on iOS before the Google Mobile
 * Ads SDK initializes, so AdMob can serve personalized ads when allowed and
 * fall back to non-personalized ads otherwise. Android has no ATT concept —
 * this is a no-op there.
 */
export async function ensureTrackingPermission(): Promise<void> {
  if (Platform.OS !== 'ios') {
    return;
  }

  const { status } = await getTrackingPermissionsAsync();
  if (status !== 'undetermined') {
    return;
  }

  await waitUntilActive();
  await delay(POST_ACTIVE_DELAY_MS);

  // The status can change while we wait (a prompt shown by an earlier launch
  // path, or the user answering elsewhere), so re-check before asking.
  const { status: currentStatus } = await getTrackingPermissionsAsync();
  if (currentStatus !== 'undetermined') {
    return;
  }

  const result = await requestTrackingPermissionsAsync();
  if (__DEV__) console.log('[ATT] permission request result', result.status);
}

import { Platform } from 'react-native';
import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency';

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
  if (status === 'undetermined') {
    await requestTrackingPermissionsAsync();
  }
}

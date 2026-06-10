import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BG = '#ECE6DC';
const GOLD = '#C9A84C';
const GOLD_DIM = 'rgba(201,168,76,0.18)';

const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;

function qiblaBearing(lat: number, lon: number): number {
  const φ1 = (lat * Math.PI) / 180;
  const φ2 = (KAABA_LAT * Math.PI) / 180;
  const Δλ = ((KAABA_LON - lon) * Math.PI) / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function magnetometerHeading(x: number, y: number): number {
  return ((Math.atan2(-x, y) * (180 / Math.PI)) + 360) % 360;
}

type Status = 'idle' | 'loading' | 'ok' | 'denied' | 'error';

export default function KiblePusulasiScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [status, setStatus] = useState<Status>('idle');
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [distance, setDistance] = useState<number | null>(null);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const currentAngle = useRef(0);

  useEffect(() => {
    let magSub: ReturnType<typeof Magnetometer.addListener> | null = null;

    const start = async () => {
      setStatus('loading');
      const { status: perm } = await Location.requestForegroundPermissionsAsync();
      if (perm !== 'granted') { setStatus('denied'); return; }

      let pos: Location.LocationObject;
      try {
        pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      } catch {
        setStatus('error'); return;
      }

      const { latitude, longitude } = pos.coords;
      const bearing = qiblaBearing(latitude, longitude);
      setQiblaAngle(bearing);

      // Distance to Kaaba in km
      const R = 6371;
      const dLat = ((KAABA_LAT - latitude) * Math.PI) / 180;
      const dLon = ((KAABA_LON - longitude) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((latitude * Math.PI) / 180) * Math.cos((KAABA_LAT * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
      setDistance(Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))));

      const isAvail = await Magnetometer.isAvailableAsync();
      if (!isAvail) { setStatus('error'); return; }

      Magnetometer.setUpdateInterval(100);
      magSub = Magnetometer.addListener(({ x, y }) => {
        setDeviceHeading(magnetometerHeading(x, y));
      });

      setStatus('ok');
    };

    start();
    return () => { magSub?.remove(); };
  }, []);

  // Animate only the Qibla arrow — dial (N/E/S/W) stays fixed, arrow rotates
  // to show the Kaaba direction relative to the device heading.
  useEffect(() => {
    if (qiblaAngle === null) return;
    const target = (qiblaAngle - deviceHeading + 360) % 360;
    // Pick shortest path
    let diff = target - currentAngle.current;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    const next = currentAngle.current + diff;
    currentAngle.current = next;

    Animated.timing(rotateAnim, {
      toValue: next,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [deviceHeading, qiblaAngle, rotateAnim]);

  const qiblaRotate = rotateAnim.interpolate({
    inputRange: [-360, 360],
    outputRange: ['-360deg', '360deg'],
  });

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.8 }]}
            accessibilityRole="button"
          >
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>{t('kible.title')}</Text>
          <View style={{ minWidth: 44 }} />
        </View>

        <View style={styles.center}>
          {status === 'loading' && (
            <>
              <Text style={styles.statusIcon}>🔍</Text>
              <Text style={styles.statusText}>{t('kible.loading')}</Text>
            </>
          )}

          {status === 'denied' && (
            <>
              <Text style={styles.statusIcon}>📍</Text>
              <Text style={styles.statusText}>{t('kible.denied')}</Text>
            </>
          )}

          {status === 'error' && (
            <>
              <Text style={styles.statusIcon}>⚠️</Text>
              <Text style={styles.statusText}>{t('kible.error')}</Text>
            </>
          )}

          {status === 'ok' && qiblaAngle !== null && (
            <>
              <View style={styles.compassOuter}>
                <View style={styles.compassRing}>
                  {/* Fixed compass rose — N/E/S/W stay aligned with the real world */}
                  <View style={styles.dial}>
                    <Text style={[styles.cardinal, styles.cardinalN]}>N</Text>
                    <Text style={[styles.cardinal, styles.cardinalS]}>S</Text>
                    <Text style={[styles.cardinal, styles.cardinalE]}>E</Text>
                    <Text style={[styles.cardinal, styles.cardinalW]}>W</Text>
                  </View>

                  {/* Animated Qibla arrow — rotates to point toward the Kaaba */}
                  <Animated.View style={[styles.qiblaPointerWrap, { transform: [{ rotate: qiblaRotate }] }]}>
                    <View style={styles.kaabaMarker}>
                      <View style={styles.kaabaBadge}>
                        <Text style={styles.kaabaIcon}>🕋</Text>
                      </View>
                      <Text style={styles.kaabaLabel}>{t('kible.kaaba')}</Text>
                    </View>
                    <View style={styles.qiblaArrow} />
                  </Animated.View>

                  <View style={styles.compassCenter} />
                </View>
              </View>

              <Text style={styles.angleText}>
                {Math.round((qiblaAngle - deviceHeading + 360) % 360)}°
              </Text>
              <Text style={styles.angleLabel}>{t('kible.direction')}</Text>

              {distance !== null && (
                <View style={styles.distanceWrap}>
                  <Text style={styles.distanceLabel}>{t('kible.distance')}</Text>
                  <Text style={styles.distanceValue}>{distance.toLocaleString()} km</Text>
                </View>
              )}
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const COMPASS_SIZE = 260;
const NEEDLE_H = 90;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderBottomWidth: 1, borderBottomColor: GOLD_DIM,
  },
  backBtn: {
    borderRadius: 14, paddingVertical: 10, paddingHorizontal: 12,
    minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', borderWidth: 1.5, borderColor: GOLD,
  },
  backArrow: { color: GOLD, fontSize: 24, fontWeight: '600', lineHeight: 28 },
  headerTitle: { flex: 1, color: '#5C481C', fontSize: 19, fontWeight: '800', textAlign: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20, paddingHorizontal: 24 },
  statusIcon: { fontSize: 56 },
  statusText: { color: '#5C481C', fontSize: 16, fontWeight: '600', textAlign: 'center', lineHeight: 26 },
  compassOuter: {
    width: COMPASS_SIZE + 20,
    height: COMPASS_SIZE + 20,
    borderRadius: (COMPASS_SIZE + 20) / 2,
    backgroundColor: 'rgba(201,168,76,0.08)',
    borderWidth: 2, borderColor: 'rgba(201,168,76,0.3)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 12, elevation: 6,
  },
  compassRing: {
    width: COMPASS_SIZE, height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    backgroundColor: '#FFFCF7',
    borderWidth: 3, borderColor: GOLD,
    alignItems: 'center', justifyContent: 'center',
  },
  cardinal: {
    position: 'absolute',
    color: '#5C481C', fontSize: 13, fontWeight: '800',
  },
  cardinalN: { top: 10, alignSelf: 'center' },
  cardinalS: { bottom: 10, alignSelf: 'center' },
  cardinalE: { right: 12, top: COMPASS_SIZE / 2 - 10 },
  cardinalW: { left: 12, top: COMPASS_SIZE / 2 - 10 },
  dial: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qiblaPointerWrap: {
    position: 'absolute',
    width: 8,
    height: NEEDLE_H * 2,
    alignItems: 'center',
  },
  kaabaMarker: {
    position: 'absolute',
    top: -34,
    alignItems: 'center',
    gap: 2,
  },
  kaabaBadge: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#1a1a1a',
    borderWidth: 2, borderColor: GOLD,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, shadowRadius: 4, elevation: 4,
  },
  kaabaLabel: {
    color: '#5C481C', fontSize: 10, fontWeight: '800',
    textTransform: 'uppercase', letterSpacing: 0.5,
    backgroundColor: 'rgba(255,252,247,0.9)',
    paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6,
  },
  qiblaArrow: {
    width: 0, height: 0,
    borderLeftWidth: 7, borderRightWidth: 7, borderBottomWidth: NEEDLE_H * 1.5,
    borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: GOLD,
  },
  compassCenter: {
    position: 'absolute',
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: GOLD,
    borderWidth: 2, borderColor: '#FFFCF7',
  },
  kaabaIcon: { fontSize: 18 },
  angleText: { color: GOLD, fontSize: 48, fontWeight: '800' },
  angleLabel: { color: '#5C481C', fontSize: 14, fontWeight: '600', marginTop: -12 },
  distanceWrap: {
    backgroundColor: 'rgba(201,168,76,0.1)',
    borderRadius: 16, paddingVertical: 12, paddingHorizontal: 24,
    borderWidth: 1.5, borderColor: 'rgba(201,168,76,0.3)',
    alignItems: 'center', gap: 4,
  },
  distanceLabel: { color: '#7A6A50', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  distanceValue: { color: '#5C481C', fontSize: 22, fontWeight: '800' },
});

const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * expo-sensors bundles android.permission.ACTIVITY_RECOGNITION for its pedometer
 * APIs, which we don't use (only Magnetometer for the Qibla compass). Google Play
 * flags this permission as triggering the Health Apps Policy review, so we strip
 * it from the merged manifest.
 */
function withRemoveActivityRecognition(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    if (!manifest['uses-permission']) {
      return config;
    }
    manifest['uses-permission'] = manifest['uses-permission'].filter(
      (entry) => entry.$?.['android:name'] !== 'android.permission.ACTIVITY_RECOGNITION',
    );
    manifest['uses-permission'].push({
      $: {
        'android:name': 'android.permission.ACTIVITY_RECOGNITION',
        'tools:node': 'remove',
      },
    });
    return config;
  });
}

module.exports = withRemoveActivityRecognition;

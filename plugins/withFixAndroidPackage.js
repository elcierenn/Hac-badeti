const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// Expo prebuild generates MainActivity.kt/MainApplication.kt with the wrong
// package declaration when the Android package name has 3+ components (e.g.
// com.hacibadeti.app). It strips the last segment, writing "package com.hacibadeti"
// instead of "package com.hacibadeti.app", which causes "Unresolved reference 'R'"
// and "Unresolved reference 'BuildConfig'" compile errors.
module.exports = function withFixAndroidPackage(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const pkg = config.android?.package;
      if (!pkg) return config;

      const pkgPath = pkg.split('.').join(path.sep);
      const javaDir = path.join(
        config.modRequest.projectRoot,
        'android', 'app', 'src', 'main', 'java',
        pkgPath
      );

      for (const file of ['MainActivity.kt', 'MainApplication.kt']) {
        const fullPath = path.join(javaDir, file);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const fixed = content.replace(/^package .+$/m, `package ${pkg}`);
          if (content !== fixed) {
            fs.writeFileSync(fullPath, fixed);
          }
        }
      }

      return config;
    },
  ]);
};

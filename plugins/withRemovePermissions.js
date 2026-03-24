const { withAndroidManifest } = require('@expo/config-plugins');

const withRemovePermissions = (config, permissions) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    
    // Add 'tools' namespace if not present
    if (!androidManifest.manifest.$['xmlns:tools']) {
        androidManifest.manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }

    // Ensure 'uses-permission' array exists
    if (!androidManifest.manifest['uses-permission']) {
        androidManifest.manifest['uses-permission'] = [];
    }

    permissions.forEach((permissionName) => {
      // Check if permission already exists
      const existingPermission = androidManifest.manifest['uses-permission'].find(
        (item) => item.$['android:name'] === permissionName
      );

      if (existingPermission) {
        // If it exists, add tools:node="remove"
        existingPermission.$['tools:node'] = 'remove';
      } else {
        // If it doesn't exist, add it with tools:node="remove" to ensure it's blocked even if merged from libs
        androidManifest.manifest['uses-permission'].push({
          $: {
            'android:name': permissionName,
            'tools:node': 'remove',
          },
        });
      }
    });

    return config;
  });
};

module.exports = withRemovePermissions;

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for WatermelonDB
config.resolver.sourceExts.push('cjs');

// Fix for React Native DevTools on web
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Exclude React Native internals from web builds
  if (
    platform === 'web' &&
    (moduleName.includes('ReactDevToolsSettingsManager') ||
     moduleName.includes('setUpReactDevTools'))
  ) {
    return {
      type: 'empty',
    };
  }
  
  // Use default resolver
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;

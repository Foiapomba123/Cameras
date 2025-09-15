const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure resolver for web platform
config.resolver = {
  ...config.resolver,
  platforms: ['ios', 'android', 'native', 'web'],
};

// Enable web support in transformer
config.transformer = {
  ...config.transformer,
  assetPlugins: ['expo-asset/tools/hashAssetFiles'],
};

module.exports = config;
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Allow requests from all hosts for Replit proxy compatibility
config.server = {
  ...config.server,
  allowedHosts: 'all',
};

module.exports = config;
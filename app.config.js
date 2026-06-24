const { withAndroid } = require("@expo/config-plugins");

/** @type {import('expo/config').ExpoConfig} */
module.exports = ({ config }) => ({
  ...config,
  ios: {
    ...config.ios,
    config: {
      ...config.ios?.config,
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyCCqG1urGsVMYo1yP6hKHKl0zEeNUKAvtw",
    },
  },
  android: {
    ...config.android,
    config: {
      ...config.android?.config,
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyCCqG1urGsVMYo1yP6hKHKl0zEeNUKAvtw",
      },
    },
  },
});

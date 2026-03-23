import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.onesat.market',
  appName: '1Sat Market',
  webDir: 'www',
  server: {
    url: 'https://alpha.1sat.market',
    cleartext: false,
    // Enable CORS for development
    androidScheme: 'https',
    // Disable WebView caching for development
    allowNavigation: ['*']
  },
  ios: {
    contentInset: 'automatic'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      showSpinner: false
    }
  }
};

export default config;

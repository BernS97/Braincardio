import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ionic.braincardio',
  appName: 'braincardio',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;

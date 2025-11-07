import type { CapacitorConfig } from '@capacitor/cli';

const config = {
  appId: 'fr.silvercore.silvernote',
  appName: 'silverNote',
  webDir: 'dist',
  server: {
    url: 'https://app.silvernote.fr',
    cleartext: false
  }
};

export default config;

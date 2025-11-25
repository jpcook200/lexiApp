import 'dotenv/config';

export default {
  expo: {
    name: 'Lexigram',
    slug: 'lexigram',
    version: '1.0.0',
    scheme: 'lexigram',
    orientation: "portrait",
    // Fallback icon for platforms that don't support appearance
    icon: './assets/images/app-icon.png',

    splash: {
      image: './assets/images/splash-dark.png',
      backgroundColor: '#363636',
      resizeMode: 'contain',
      dark: {
        image: './assets/images/splash-dark.png',
        backgroundColor: '#494949',
      },
    },

    extra: {
      apiUrl: process.env.API_URL,
      environment: process.env.NODE_ENV,
      apiKey: process.env.API_KEY,
    },

    android: {
      package: 'com.jpcook19.lexigram',
      adaptiveIcon: {
        foregroundImage: './assets/images/app-icon.png',
        backgroundColor: '#ffffff',
      },
    },

    ios: {
      bundleIdentifier: 'com.jpcook19.lexigram',
      userInterfaceStyle: 'automatic', // respects light/dark mode
      icon: {
        light: './assets/images/app-icon.png',
        dark: './assets/images/app-icon-dark.png',
      },
    },

    plugins: [
      'expo-sqlite',
      'expo-secure-store',
      'expo-splash-screen',
    ],
  },
};

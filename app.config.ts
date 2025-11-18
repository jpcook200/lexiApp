export default {
  expo: {
    name: 'Lexigram',
    slug: 'lexigram',
    version: '1.0.0',
    scheme: 'lexigram',
    icon: './assets/images/app-icon.png',
    splash: {
      image: './assets/images/splash-icon.png',
      backgroundColor: '#ffffff',
      resizeMode: 'contain',
    },
    extra: {
      apiUrl: process.env.API_URL,
      environment: process.env.NODE_ENV,
      apiKey: process.env.API_KEY,
    },
    android: {
      package: 'com.jpcook19.lexigram',
    },
    ios: {
      bundleIdentifier: 'com.jpcook19.lexigram',
      userInterfaceStyle: 'automatic',
    },
    plugins: [
      'expo-sqlite',
      'expo-secure-store',
    ]
  },
};

export default {
  expo: {
    name: 'Lexigram',
    slug: 'lexigram',
    version: '1.0.0',
    scheme: 'lexigram',
    icon: './assets/images/app-icon.png',
    splash: {
      image: './assets/images/app-icon.png',
      backgroundColor: '#1c95ff',
      resizeMode: 'contain',
    },
    extra: {
      apiUrl: process.env.API_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      environment: process.env.NODE_ENV,
    },
    android: {
      package: 'com.jpcook19.lexigram',
    },
    ios: {
      bundleIdentifier: 'com.jpcook19.lexigram',
    },
  },
};

export default {
  expo: {
    name: 'MyApp',
    slug: 'my-app',
    version: '1.0.0',
    scheme: "yourapp",
    extra: {
      apiUrl: process.env.API_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      environment: process.env.NODE_ENV,
    },
  },
};

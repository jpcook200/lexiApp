import ThemedText from '@/components/ThemedText'; // adjust path if needed
import { ScrollView, View } from 'react-native';

const TermsOfService = () => {
  return (
    <ScrollView className="flex-1 bg-background-light dark:bg-background-dark p-6">
      <View className="space-y-4">
        <ThemedText className="text-3xl font-bold mb-4">Terms of Service</ThemedText>
        <ThemedText className="italic mb-2">Last updated: October 2025</ThemedText>

        <ThemedText className="text-base mb-2">
          Welcome to our app! These Terms of Service ("Terms") outline the rules and guidelines for using our app and related services.
          By using the app, you agree to these Terms.
        </ThemedText>

        <ThemedText className="text-xl font-semibold mt-4 mb-2">1. Use of the App</ThemedText>
        <ThemedText className="text-base mb-2">
          You agree to use the app only for lawful purposes and in a way that does not infringe on the rights of others
          or restrict or inhibit anyone else’s use and enjoyment of the app.
        </ThemedText>

        <ThemedText className="text-xl font-semibold mt-4 mb-2">2. User Data and Privacy</ThemedText>
        <ThemedText className="text-base mb-2">
          We take your privacy seriously. Our app currently stores data only on your device and does not collect personal information on our servers.
          Please refer to our Privacy Policy for more details about how your data is handled.
        </ThemedText>

        <ThemedText className="text-xl font-semibold mt-4 mb-2">3. Intellectual Property</ThemedText>
        <ThemedText className="text-base mb-2">
          All content, features, and functionality in the app (including text, design, and code) are owned by the app developers or their licensors.
          You may not copy, modify, distribute, or use any part of the app for commercial purposes without permission.
        </ThemedText>

        <ThemedText className="text-xl font-semibold mt-4 mb-2">4. Disclaimer</ThemedText>
        <ThemedText className="text-base mb-2">
          The app is provided “as is” and “as available.” We make no guarantees about its reliability, performance, or availability.
          You use the app at your own risk.
        </ThemedText>

        <ThemedText className="text-xl font-semibold mt-4 mb-2">5. Limitation of Liability</ThemedText>
        <ThemedText className="text-base mb-2">
          To the fullest extent permitted by law, we are not liable for any direct, indirect, or consequential damages arising from your use of the app,
          including but not limited to data loss, device damage, or service interruptions.
        </ThemedText>

        <ThemedText className="text-xl font-semibold mt-4 mb-2">6. Changes to These Terms</ThemedText>
        <ThemedText className="text-base mb-2">
          We may update these Terms occasionally to reflect app updates or policy changes.
          Continued use of the app after changes means you accept the new Terms.
        </ThemedText>

        <ThemedText className="text-xl font-semibold mt-4 mb-2">7. Contact Us</ThemedText>
        <ThemedText className="text-base mb-2">
          If you have any questions about these Terms, feel free to reach out to us at:
        </ThemedText>

        <ThemedText className="text-base font-semibold text-primary mb-8">
          lexigramapp@outlook.com
        </ThemedText>
      </View>
    </ScrollView>
  );
};

export default TermsOfService;

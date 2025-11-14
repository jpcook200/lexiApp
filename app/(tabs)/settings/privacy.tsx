import ThemedText from '@/components/ThemedText'; // adjust path if needed
import { ScrollView, View } from 'react-native';

const PrivacyPolicy = () => {
  return (
    <ScrollView className="flex-1 bg-background-light dark:bg-background-dark p-6">
      <View className="space-y-4">
        <ThemedText className="text-3xl font-bold mb-4">Privacy Policy</ThemedText>
        <ThemedText className="italic mb-2">Last updated: October 2025</ThemedText>

        <ThemedText className="text-base mb-2">
          Your privacy is important to us. This Privacy Policy explains how our app handles your information.
        </ThemedText>

        <ThemedText className="text-xl font-semibold mt-4 mb-2">1. Information We Collect</ThemedText>
        <ThemedText className="text-base mb-2">
          At this time, our app does not collect, store, or share any personal information on our servers.
          All data generated within the app (such as preferences, settings, or progress) is stored locally on your device only.
        </ThemedText>
        <ThemedText className="text-base mb-2">
          In the future, we may collect a device identifier (Device ID) to help us improve app performance and maintain user sessions.
          If we do, this information will:
        </ThemedText>
        <View className="pl-4">
          <ThemedText className="text-base">• Be used only for app functionality (e.g., syncing data or managing subscriptions),</ThemedText>
          <ThemedText className="text-base">• Never be sold or shared with third parties,</ThemedText>
          <ThemedText className="text-base">• Be stored securely.</ThemedText>
        </View>

        <ThemedText className="text-xl font-semibold mt-4 mb-2">2. Third-Party Services</ThemedText>
        <ThemedText className="text-base mb-2">
          We currently do not use any third-party analytics, tracking, or advertising tools.
          If this changes, we’ll update this policy to explain exactly what is used and why.
        </ThemedText>

        <ThemedText className="text-xl font-semibold mt-4 mb-2">3. Data Security</ThemedText>
        <ThemedText className="text-base mb-2">
          Because your data is stored on your device, you control it. Deleting the app will remove all local data associated with it.
        </ThemedText>

        <ThemedText className="text-xl font-semibold mt-4 mb-2">4. Changes to This Policy</ThemedText>
        <ThemedText className="text-base mb-2">
          We may update this Privacy Policy occasionally to reflect improvements or new features.
          The latest version will always be available in the app.
        </ThemedText>

        <ThemedText className="text-xl font-semibold mt-4 mb-2">5. Contact</ThemedText>
        <ThemedText className="text-base mb-8">
          If you have any questions or concerns about your privacy, please contact us at:
        </ThemedText>
        <ThemedText className="text-base font-semibold text-primary">
          lexigramapp@outlook.com
        </ThemedText>
      </View>
    </ScrollView>
  );
};

export default PrivacyPolicy;

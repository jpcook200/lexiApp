import ThemedText from '@/components/ThemedText';
import { ScrollView, View } from 'react-native';

const TermsOfService = () => {
  return (
    <ScrollView className="flex-1 bg-background-light dark:bg-background-dark p-6">
      <View className="space-y-4">
        <ThemedText className="text-3xl font-bold mb-4">Terms of Service & EULA</ThemedText>
        <ThemedText className="italic mb-2">Last updated: October 2025</ThemedText>

        <ThemedText className="text-base mb-2">
          These Terms of Service and End User License Agreement ("Terms") govern your use of the Lexigram mobile
          application ("App"), provided by an individual developer based in the United Kingdom.
          By downloading or using the App, you agree to these Terms.
        </ThemedText>

        {/* 1. License */}
        <ThemedText className="text-xl font-semibold mt-4 mb-2">1. License Grant</ThemedText>
        <ThemedText className="text-base mb-2">
          We grant you a personal, non-exclusive, non-transferable, revocable license to use the App for private,
          non-commercial purposes. You are licensing the App, not purchasing ownership.
        </ThemedText>

        {/* 2. Restrictions */}
        <ThemedText className="text-xl font-semibold mt-4 mb-2">2. Restrictions</ThemedText>
        <ThemedText className="text-base mb-2">
          You agree not to copy, modify, distribute, reverse engineer, or sublicense the App. You must not interfere
          with the App’s operation or attempt to bypass subscription-related limitations.
        </ThemedText>

        {/* 3. Privacy */}
        <ThemedText className="text-xl font-semibold mt-4 mb-2">3. No Account Data & Privacy</ThemedText>
        <ThemedText className="text-base mb-2">
          The App does not require user accounts and does not store personal data on servers. Only anonymous usage
          information (such as API call logs) is collected for debugging and analytics. Please refer to our Privacy
          Policy for details.
        </ThemedText>

        {/* 4. Subscriptions */}
        <ThemedText className="text-xl font-semibold mt-4 mb-2">4. Subscription & Payments</ThemedText>
        <ThemedText className="text-base mb-2">
          Lexigram offers optional weekly and yearly subscriptions. Payments are processed through the Apple App Store
          or Google Play Store and follow their billing policies. Subscriptions renew automatically unless cancelled at
          least 24 hours before renewal. Refunds must be requested through Apple or Google.
        </ThemedText>

        {/* 5. Availability */}
        <ThemedText className="text-xl font-semibold mt-4 mb-2">5. Availability & Updates</ThemedText>
        <ThemedText className="text-base mb-2">
          The App is provided “as is” without guarantees of reliability or performance. We may update or modify the App
          at any time, including adding or removing features.
        </ThemedText>

        {/* 6. Termination */}
        <ThemedText className="text-xl font-semibold mt-4 mb-2">6. Termination</ThemedText>
        <ThemedText className="text-base mb-2">
          We may suspend or terminate your license if you violate these Terms. Upon termination, you must stop using
          the App and delete it from your device.
        </ThemedText>

        {/* 7. Intellectual Property */}
        <ThemedText className="text-xl font-semibold mt-4 mb-2">7. Intellectual Property</ThemedText>
        <ThemedText className="text-base mb-2">
          All content, design, code, and features of the App belong to Lexigram or our licensors. These Terms do not
          grant you any rights beyond the limited license described above.
        </ThemedText>

        {/* 8. Third-Party Services */}
        <ThemedText className="text-xl font-semibold mt-4 mb-2">8. Third-Party Services</ThemedText>
        <ThemedText className="text-base mb-2">
          The App may depend on third-party APIs or services. By using the App, you also agree to their respective
          terms. We are not responsible for outages or errors caused by third-party providers.
        </ThemedText>

        {/* 9. Liability */}
        <ThemedText className="text-xl font-semibold mt-4 mb-2">9. Limitation of Liability</ThemedText>
        <ThemedText className="text-base mb-2">
          To the fullest extent permitted by law, Lexigram is not liable for indirect, incidental, or consequential
          damages, including data loss, device issues, or interruptions. Your use of the App is at your own risk.
        </ThemedText>

        {/* 10. Governing Law */}
        <ThemedText className="text-xl font-semibold mt-4 mb-2">10. Governing Law</ThemedText>
        <ThemedText className="text-base mb-2">
          These Terms are governed by the laws of England and Wales. Any disputes will be handled exclusively in the
          courts of England and Wales.
        </ThemedText>

        {/* Contact */}
        <ThemedText className="text-xl font-semibold mt-4 mb-2">11. Contact</ThemedText>
        <ThemedText className="text-base mb-2">
          If you have questions about these Terms, contact us at:
        </ThemedText>

        <ThemedText className="text-base font-semibold text-primary mb-8">
          lexigramapp@outlook.com
        </ThemedText>
      </View>
    </ScrollView>
  );
};

export default TermsOfService;

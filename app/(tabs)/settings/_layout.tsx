import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';

export default function SettingsLayout() {
    const { t } = useTranslation();
    const { colorScheme } = useColorScheme();
    
    return (
        <Stack screenOptions={{
            headerShown: false,
            headerBackTitle: t("back"),
            headerStyle: { 
                backgroundColor: colorScheme === 'dark' ? '#2C2C2C' : '#F9FAFB',
            },
            headerTitleStyle: {
                color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
            },
            headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
        }}>
            <Stack.Screen
                name="index"
                options={{ title: 'Settings' }}
            />
            <Stack.Screen
                name="nativeLanguages"
                options={{
                    presentation: 'card',
                    headerShown: true,
                    title: t("native_language"),
                }}
            />
            <Stack.Screen
                name="learningLanguages"
                options={{
                    presentation: 'card',
                    headerShown: true,
                    title: t("learning_language"),
                }}
            />
            <Stack.Screen
                name="wordsPerDay"
                options={{
                    presentation: 'card',
                    headerShown: true,
                    title: t("words_per_day"),
                }}
            />
            <Stack.Screen
                name="difficultyLevel"
                options={{
                    presentation: 'card',
                    headerShown: true,
                    title: t("proficiency_level"),
                }}
            />
            <Stack.Screen
                name="privacy"
                options={{
                    presentation: 'card',
                    headerShown: true,
                    title: 'Privacy Policy',
                }}
            />
            <Stack.Screen
                name="terms"
                options={{
                    presentation: 'card',
                    headerShown: true,
                    title: 'Terms of Service',
                }}
            />
            <Stack.Screen
                name="faqs"
                options={{
                    presentation: 'card',
                    headerShown: true,
                    title: 'FAQs',
                }}
            />
        </Stack>
    );
}

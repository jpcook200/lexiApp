import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';

export default function SettingsLayout() {
    const { colorScheme } = useColorScheme();
    return (
        <Stack screenOptions={{
            headerShown: false,
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
                options={{ title: 'Home' }}
            />
            <Stack.Screen
                name="userWordsList"
                options={{
                    presentation: 'card',
                    headerShown: false,
                    title: 'Your Vocabulary',
                }}
            />
            <Stack.Screen
                name="Practice"
                options={{
                    presentation: 'card',
                    headerShown: false,
                    title: 'Practice',
                }}
            />

        </Stack>
    );
}

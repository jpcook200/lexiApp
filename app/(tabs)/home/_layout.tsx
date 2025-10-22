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
                options={{ title: 'Settings' }}
            />
            <Stack.Screen
                name="userWordsList"
                options={{
                    presentation: 'card',
                    headerShown: false,
                    title: 'Native Language',
                }}
            />

        </Stack>
    );
}

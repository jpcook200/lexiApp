// app/index.tsx
import i18next from '@/services/i18next';
import { User } from '@/types/types';
import { getInstallationId } from '@/utilities/getInstallationId';
import * as Localization from 'expo-localization';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

const Index = () => {
    const db = useSQLiteContext();
  
    const checkUser = async () => {
        try {
            const locals = Localization.getLocales();
            const languageCode = locals[0]?.languageCode || 'en'
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
            const user = await db.getFirstAsync<User>('SELECT * FROM users');

            if (!user) {
                await db.runAsync(
                    `INSERT INTO users (native_lang, learn_lang, words_per_day, onboarding_completed, timezone) 
                    VALUES (?, ?, ?, ?, ?)`,
                    [languageCode, '', 5, 0, userTimezone]
                );

                router.replace('/(onboarding)/welcomeScreens/welcomeOne');
                return;
            }

            i18next.changeLanguage(user.native_lang);

            if (user.onboarding_completed === 0) {
                router.push('/(onboarding)/welcomeScreens/welcomeOne');
                return;
            }

            router.replace('/(tabs)/home');
        } catch (err) {
            alert('An error occurred while accessing the database. Please try again.');
            console.error('Error checking user:', err);
        }
    };

    const loadInstallationId = async () => { 
        const id = await getInstallationId();
        console.log("Installation ID:", id);
    }

    useEffect(() => {
        checkUser();
        loadInstallationId();
    }, []);

    return (
        <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="small" color="#1c95ffff" />
        </View>
    );
};

export default Index;

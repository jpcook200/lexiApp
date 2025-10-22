// app/_layout.tsx
import '@/services/i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as Localization from 'expo-localization';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import '../global.css';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export default function RootLayout() {
    const locals = Localization.getLocales();
    const languageCode = locals[0]?.languageCode || 'en'
    const [queryClient] = useState(() => new QueryClient());


    const [fontsLoaded] = useFonts({
        'Satoshi-Regular': require('@/assets/fonts/Satoshi-Regular.otf'),
        'Satoshi-Bold': require('@/assets/fonts/Satoshi-Bold.otf'),
        'Satoshi-Medium': require('@/assets/fonts/Satoshi-Medium.otf'),
        'Satoshi-Light': require('@/assets/fonts/Satoshi-Light.otf'),
        'Satoshi-Black': require('@/assets/fonts/Satoshi-Black.otf'),
        'Satoshi-BoldItalic': require('@/assets/fonts/Satoshi-BoldItalic.otf'),
        'Satoshi-Italic': require('@/assets/fonts/Satoshi-Italic.otf'),
        
    });

    if (!fontsLoaded || !languageCode) {
        return(
            <ActivityIndicator size="large" className="flex-1 justify-center items-center" />
        )            
    }
    
    return (
        <QueryClientProvider client={queryClient}>
            <SQLiteProvider
                databaseName="userDatabase.db"
                onInit={async (db) => {
                    await db.execAsync(`
                       
                        CREATE TABLE IF NOT EXISTS users (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            native_lang TEXT,
                            learn_lang TEXT,
                            words_per_day INTEGER DEFAULT 5,
                            onboarding_completed BOOLEAN DEFAULT 0,
                            difficulty_level TEXT,
                            reminders_on BOOLEAN DEFAULT 0,
                            timezone TEXT,
                            last_set INTEGER DEFAULT 0
                        );
                       
                        CREATE TABLE IF NOT EXISTS learned_words (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            word_id INTEGER,
                            user_id INTEGER,
                            learning_language TEXT,
                            native_language TEXT,
                            native_word TEXT,
                            learning_word TEXT,
                            learning_pronunciation TEXT,
                            native_pronunciation TEXT,
                            part_of_speech TEXT,
                            native_definition TEXT,
                            learning_definition TEXT,
                            learning_difficulty TEXT,
                            learning_sentence TEXT,
                            learning_gender TEXT,
                            learned_at DATETIME DEFAULT (datetime('now', 'localtime')),
                            favourite BOOLEAN DEFAULT 0,
                            FOREIGN KEY (user_id) REFERENCES users(id)
                        );
                       
                        
                        CREATE TABLE IF NOT EXISTS daily_words (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            word_id INTEGER,
                            user_id INTEGER,
                            learning_language TEXT,
                            native_language TEXT,
                            native_word TEXT,
                            learning_word TEXT,
                            learning_pronunciation TEXT,
                            native_pronunciation TEXT,
                            part_of_speech TEXT,
                            native_definition TEXT,
                            learning_definition TEXT,
                            learning_difficulty TEXT,
                            learning_sentence TEXT,
                            learning_gender TEXT,
                            time_sent TEXT DEFAULT (datetime('now', 'localtime')),
                            favourite BOOLEAN DEFAULT 0,
                            learned BOOLEAN DEFAULT 0,
                            FOREIGN KEY (user_id) REFERENCES users(id)
                        );

                        PRAGMA journal_mode=WAL;
                    `);
                }}
                options={{ useNewConnection: false }}
            >
                <Stack
                    screenOptions={{
                        headerShown: false,
                        }}
                />
            </SQLiteProvider>
        </QueryClientProvider>
    );
}

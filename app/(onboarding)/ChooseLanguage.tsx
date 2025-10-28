import BackButton from '@/components/BackButton';
import LanguageCard from '@/components/LanguageCard';
import MainButton from '@/components/MainButton';
import ThemedIcon from '@/components/ThemedIcon';
import ThemedText from '@/components/ThemedText';
import { commonLanguages } from '@/constants/languages';
import { User } from '@/hooks/useGetUser';
import i18next from '@/services/i18next';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChooseLanguage = () => {
    const [activeLang, setActiveLang] = useState<string | null>(null);
    const db = useSQLiteContext();
    const { t } = useTranslation();

    const handleNext = async () => { 
        if (!activeLang) {
            alert('Please select a language to continue.');
            return;
        }
        try {
            await db.runAsync('UPDATE users SET native_lang = ? WHERE id = ?', [activeLang, 1]);
            i18next.changeLanguage(activeLang);
            await db.getFirstAsync('SELECT * FROM users WHERE id = 1')

            return router.push('/(onboarding)/ChooseLearningLanguage');
        
        } catch (error) {
            alert ('There was an error saving your language. Please try again.');
            console.error('Error updating native language:', error);
        }
    }

    useEffect(() => {
        const loadUserLanguage = async () => {
            try {
                const user = await db.getFirstAsync<User>('SELECT * FROM users WHERE id = 1');
                if (user?.native_lang) {
                    setActiveLang(user.native_lang);
                }
            } catch (error) {
                console.error('Error loading native language:', error);
            }
        };
        loadUserLanguage();
    }, []);

    return (
        <SafeAreaView className="flex-1 h-full bg-secondary-light dark:bg-secondary-dark">
            <View className='w-full h-52 bg-secondary-light dark:bg-secondary-dark'>
                <View className='flex-1 justify-center items-center px-4'>
                    <BackButton/>
                    <View className='w-20 h-20 bg-item-light dark:bg-item-dark rounded-full flex items-center justify-center border border-border-light dark:border-border-dark'>
                        <ThemedIcon name='Languages' />
                    </View>
                    <ThemedText className='text-2xl font-bold mt-4'>{ t("whats_your_native_language") }</ThemedText>
                </View>
            </View>
            <ScrollView className='flex-1 bg-background-light dark:bg-background-dark border-t border-border-light dark:border-border-dark pt-4'>
                <View className="flex-row flex-wrap px-4 gap-4 justify-center">
                    {commonLanguages.map((lang) => (
                        <LanguageCard
                            key={lang.code}
                            icon={lang.flag}
                            name={t(lang.code)}
                            code={lang.code}
                            active={activeLang === lang.code}
                            onPress={() => setActiveLang(lang.code)}
                        />
                    ))}
                </View>
            </ScrollView>
            <View className='p-4 mb-4 border-t border-border-light dark:border-border-dark' >
                <MainButton
                    text={ t("next") }
                    onPress={handleNext}
                    next
                />
            </View>
        </SafeAreaView>
    );
};

export default ChooseLanguage;

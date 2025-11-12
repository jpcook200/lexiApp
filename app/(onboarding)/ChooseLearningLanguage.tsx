import BackButton from '@/components/BackButton';
import LanguageCard from '@/components/LanguageCard';
import MainButton from '@/components/MainButton';
import ThemedIcon from '@/components/ThemedIcon';
import ThemedText from '@/components/ThemedText';
import { commonLanguages } from '@/constants/languages';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChooseLearningLanguage = () => {
    const { t } = useTranslation();
    const [activeLang, setActiveLang] = useState<string | null>(null);
    const db = useSQLiteContext();

    const handleNext = async () => { 
        if (!activeLang) {
            alert(t("please_select"));
            return;
        }

        try {
            // Update the user's learning language in SQLite
            await db.runAsync(
                'UPDATE users SET learn_lang = ? WHERE id = ?',
                [activeLang, 1]
            );
            // Navigate to the difficulty selection screen
            router.push('/(onboarding)/DifficultySelection');
        } catch (error) {
            console.error('Error updating learning language:', error);
        }
    };
    
    return (
        <SafeAreaView className="flex-1 h-full bg-secondary-light dark:bg-secondary-dark">
            <View className='w-full h-52 bg-secondary-light dark:bg-secondary-dark'>
                <View className='flex-1 justify-center items-center px-4'>
                    <BackButton/>
                    <View className='w-20 h-20 bg-item-light dark:bg-item-dark rounded-full flex items-center justify-center border border-border-light dark:border-border-dark'>
                        <ThemedIcon name='Languages' />
                    </View>
                    <ThemedText className='text-2xl font-bold mt-4'>{ t("whats_your_learning_language") }</ThemedText>
                </View>
            </View>
            <View  className='flex-1'>
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
                <View className='p-4 mb-4 border-t border-border-light dark:border-border-dark'>
                    <MainButton
                        text={ t("next") }
                        onPress={handleNext}
                        next
                        accessibilityLabel="Proceed to Difficulty Selection"
                        accessibilityHint="Navigates to the difficulty selection screen"
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ChooseLearningLanguage;
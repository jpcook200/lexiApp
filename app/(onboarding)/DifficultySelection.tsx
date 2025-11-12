import BackButton from '@/components/BackButton';
import MainButton from '@/components/MainButton';
import ThemedIcon from '@/components/ThemedIcon';
import ThemedText from '@/components/ThemedText';
import { levels } from '@/constants/languages';
import useDatabase from '@/db/useDatabase';
import { useUserStore } from '@/hooks/useGetUser';
import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DifficultySelection = () => {
    const [activeLevel, setActiveLevel] = useState<string | null>(null);
    const { insertDifficultyLevel } = useDatabase();
    const db = useSQLiteContext();
    const { t } = useTranslation();
    const { user, fetchUser } = useUserStore();

    
    const handleNext = async () => { 
        if (!user) {
            return;
        }
        
        if (!activeLevel) {
            alert(t("please_select"));
            return;
        }

        try {
            await insertDifficultyLevel(user.learn_lang, activeLevel);
            await db.runAsync(
                'UPDATE users SET onboarding_completed = 1 WHERE id = ?',
                [1]
            );

            router.push('/(onboarding)/Subscribe');
        } catch (error) {
            console.error('Error updating learning language:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchUser(db)
        },[])
    )

    return (
        <SafeAreaView className="flex-1 h-full bg-secondary-light dark:bg-secondary-dark">
            <View className='w-full h-52 bg-secondary-light dark:bg-secondary-dark'>
                <View className='flex-1 justify-center items-center px-4'>
                    <BackButton/>
                    <View className='w-20 h-20 bg-item-light dark:bg-item-dark rounded-full flex items-center justify-center border-2 border-border-light dark:border-border-dark'>
                        <ThemedIcon name='Gauge' />
                    </View>
                    <ThemedText className='text-2xl font-bold mt-4'>{ t("whats_your_proficiency_level") }</ThemedText>
                </View>
            </View>
            <View className='flex-1'>
                <ScrollView className='flex-1 bg-background-light dark:bg-background-dark border-t border-border-light dark:border-border-dark pt-4'>
                    <View className="flex-row flex-wrap px-4 gap-4 justify-center">
                        {levels.map((level) => (
                            <Pressable key={ level.code } onPress={() => setActiveLevel(level.code)} className={`shadow-md w-36 h-36 border-2 ${activeLevel === level.code ? 'border-yellow-500' : 'border-border-light dark:border-border-dark'} rounded-2xl p-2 justify-center items-center ${activeLevel === level.code ? 'bg-orange-400' : 'bg-item-light dark:bg-item-dark'}`}>
                                <Text className='text-2xl w-full text-center uppercase font-bold text-primary'>{t(level.code)}</Text>
                                <ThemedText className='text-sm font-medium text-center'>{t(level.label.replace(' ', '_').toLowerCase())}</ThemedText>
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>
                <View className='p-4 mb-4 border-t border-border-light dark:border-border-dark'>
                    <MainButton
                        text={ t("next") }
                        onPress={handleNext}
                        next
                        accessibilityLabel="Proceed to Subscribe Selection"
                        accessibilityHint="Navigates to the subscribe screen"
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default DifficultySelection
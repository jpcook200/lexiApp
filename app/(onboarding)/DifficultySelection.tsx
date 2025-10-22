import BackButton from '@/components/BackButton';
import MainButton from '@/components/MainButton';
import ThemedIcon from '@/components/ThemedIcon';
import ThemedText from '@/components/ThemedText';
import { levels } from '@/constants/languages';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DifficultySelection = () => {
    const [activeLevel, setActiveLevel] = useState<string | null>(null);
    const db = useSQLiteContext();
    const { t } = useTranslation();
    
    const handleNext = async () => { 
        if (!activeLevel) {
            alert(t("please_select"));
            return;
        }

        try {
            await db.runAsync(
                'UPDATE users SET difficulty_level = ?, onboarding_completed = 1 WHERE id = ?',
                [activeLevel, 1]
            );

            router.push('/(onboarding)/Subscribe');
        } catch (error) {
            console.error('Error updating learning language:', error);
        }
    };

    return (
        <View className="flex-1 h-full bg-background-light dark:bg-background-dark">
            <View className='w-full h-1/4 bg-secondary-light dark:bg-secondary-dark border-b border-border-light dark:border-border-dark mb-4'>
                <SafeAreaView className='flex-1 justify-center items-center px-4'>
                    <BackButton/>
                    <View className='w-20 h-20 bg-item-light dark:bg-item-dark rounded-full flex items-center justify-center border-2 border-border-light dark:border-border-dark'>
                        <ThemedIcon name='Gauge' />
                    </View>
                    <ThemedText className='text-2xl font-bold mt-4'>{ t("whats_your_proficiency_level") }</ThemedText>
                </SafeAreaView>
            </View>
            <SafeAreaView edges={['bottom']} className='flex-1'>
                <ScrollView className='flex-1'>
                    <View className="flex-row flex-wrap px-4 gap-4 justify-center">
                        {levels.map((level) => (
                            <Pressable key={ level.code } onPress={() => setActiveLevel(level.code)} className={`w-36 h-36 border ${activeLevel === level.code ? 'border-accent-light' : 'border-border-light'} ${activeLevel === level.code ? 'dark:border-accent-dark' : 'dark:border-border-dark'} rounded-2xl p-2 justify-center items-center ${activeLevel === level.code ? 'bg-yellow-700' : 'bg-item-light dark:bg-item-dark'}`}>
                                <Text className='text-2xl w-full text-center uppercase font-bold text-primary'>{t(level.code)}</Text>
                                <ThemedText className='text-sm font-medium text-center'>{t(level.label.replace(' ', '_').toLowerCase())}</ThemedText>
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>
                <View className='px-4 mb-4'>
                    <MainButton
                        text={ t("next") }
                        onPress={handleNext}
                        next
                    />
                </View>
            </SafeAreaView>
        </View>
    )
}

export default DifficultySelection
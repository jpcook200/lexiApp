import useDatabase from '@/db/useDatabase';
import { useFocusEffect } from 'expo-router';
import { Check, Flame, Hourglass } from 'lucide-react-native';
import { DateTime } from 'luxon';
import { useColorScheme } from 'nativewind';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import ProgressBar from './ProgressBar';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';

type LearningTrackerProps = {
    progress: number;
    goal: number;
    setCurrentStreak: React.Dispatch<React.SetStateAction<boolean>>;
    currentStreak: boolean;
};

const LearningTracker = ({ progress, goal, setCurrentStreak, currentStreak }: LearningTrackerProps) => {
    const { t } = useTranslation();
    const { getWeeklyStreak } = useDatabase()
    const progressPercent = Math.min((progress / goal) * 100, 100);
    const { colorScheme } = useColorScheme();

    const getStreak = async () => {
        const result = await getWeeklyStreak();

        if (!result) {
            setCurrentStreak(false);
            return;
        }

        const today = DateTime.now().toISODate();

        const todayEntry = result.find(
            (item) => item.date === today && item.completed === 1
        );

        setCurrentStreak(!!todayEntry);
    };


    useFocusEffect(
        useCallback(() => {
            getStreak(); 
        }, [])
    );

    
    return (
        <ThemedView variant='item' className='mt-auto overflow-hidden border-t border-border-light dark:border-border-dark'>    
            <View className='p-4'>
                <View className='flex-row justify-between items-center mb-2'>
                    <ThemedText className='text-lg font-bold sm:text-md'>{ t("progress_today") }</ThemedText>
                    <ThemedText className='text-xl font-bold sm:text-md'>{Math.min(progress, goal)}/{goal}</ThemedText>
                </View>
                <ProgressBar progressPercent={progressPercent} />
                <View className='mt-4 sm:mt-2 flex-row justify-start items-center'>
                    <Flame size={20} color='#fc6a03' strokeWidth={3} />
                    <ThemedText className='ml-2 sm:text-sm' variant='subtext'>{t("daily_streak")}</ThemedText>
                    <View className='ml-auto'>
                        {currentStreak === true ? (
                            <Check size={18} color='green' strokeWidth={5} />  
                        ) : (
                            <Hourglass size={14} color='grey' strokeWidth={5} />   
                        ) }
                                    
                    </View>
                </View>
            </View>
            
        </ThemedView>
    )
}

export default LearningTracker
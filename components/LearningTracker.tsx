import useDatabase from '@/db/useDatabase';
import { useFocusEffect } from 'expo-router';
import { Check, Flame, Hourglass } from 'lucide-react-native';
import { DateTime } from 'luxon';
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
        <ThemedView variant='shaded' className='mt-auto overflow-hidden border border-border-light dark:border-border-dark rounded-2xl'>    
            <View className='p-4'>
                <View className='flex-row justify-between items-center'>
                    <ThemedText className='text-lg font-bold'>{ t("progress_today") }</ThemedText>
                    <ThemedText className='text-xl font-bold mt-1'>{Math.min(progress, goal)}/{goal}</ThemedText>
                </View>
                <ProgressBar progressPercent={progressPercent} />
                <View>
                    {progressPercent >= 100 && <ThemedText className='text-right mt-4 font-bold text-green-500'>{ t("goal_achieved") } 🎉</ThemedText>}
                </View>
                <View className='mt-4 flex-row justify-start items-center'>
                    <Flame size={20} color='#fc6a03' strokeWidth={3} />
                    <ThemedText className='ml-2' variant='subtext'>{t("daily_streak")}</ThemedText>
                    <View className='ml-auto'>
                        {currentStreak === true ? (
                            <Check size={20} color='green' strokeWidth={5} />  
                        ) : (
                            <Hourglass size={15} color='grey' strokeWidth={5} />   
                        ) }
                                    
                    </View>
                </View>
            </View>
            
        </ThemedView>
    )
}

export default LearningTracker
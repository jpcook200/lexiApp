import useDatabase from '@/db/useDatabase';
import { useFocusEffect } from 'expo-router';
import { Flame } from 'lucide-react-native';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import ProgressBar from './ProgressBAr';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';

type LearningTrackerProps = {
    progress: number;
    goal: number;
    setCurrentStreak: React.Dispatch<React.SetStateAction<number>>;
    currentStreak: number;
};

const LearningTracker = ({ progress, goal, setCurrentStreak, currentStreak }: LearningTrackerProps) => {
    const { t } = useTranslation();
    const { getStreakCount } = useDatabase()
    const progressPercent = Math.min((progress / goal) * 100, 100);

    const getStreak = async () => {
        const result = await getStreakCount()
        setCurrentStreak(result?.current || 0)
    }

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
                    
                    <ThemedText variant='subtext'>{ t("daily_streak") }</ThemedText>
                    <ThemedText className='text-2xl font-bold ml-auto'>{ currentStreak }</ThemedText>
                    <Flame size={20} color='#fc6a03' strokeWidth={3} />
                </View>
            </View>
            
        </ThemedView>
    )
}

export default LearningTracker
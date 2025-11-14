import useDatabase from '@/db/useDatabase';
import { useFocusEffect } from '@react-navigation/native';
import { Flame } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';

type LearningTrackerProps = {
    progress: number;
    goal: number;
};

const LearningTracker = ({ progress, goal }: LearningTrackerProps) => {
    const { t } = useTranslation();
    const { getStreakCount } = useDatabase();
    const [currentStreak, setCurrentStreak] = useState();
    const progressPercent = Math.min((progress / goal) * 100, 100);

    const handleGetStreakCount = async () => {
        const streak = await getStreakCount();
        setCurrentStreak(streak?.current || 0)
    }

    useFocusEffect(
        useCallback(() => {
            handleGetStreakCount()
        }, [])
    );

    return (
        <ThemedView variant='shaded' className='mt-auto overflow-hidden border border-border-light dark:border-border-dark rounded-2xl'>    
            <View className='p-4'>
                <View className='flex-row justify-between items-center'>
                    <ThemedText className='text-lg font-bold'>{ t("progress_today") }</ThemedText>
                    <ThemedText className='text-xl font-bold mt-1'>{Math.min(progress, goal)}/{goal}</ThemedText>
                </View>
                <View className='w-full h-3 bg-background-light dark:bg-background-dark rounded-full mt-2 overflow-hidden border border-border-light dark:border-border-dark'>
                    <View
                        style={{ width: `${progressPercent}%` }}
                        className={`h-full bg-primary`}
                    />
                </View>
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
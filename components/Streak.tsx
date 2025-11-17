import useDatabase from '@/db/useDatabase';
import { StreakRow } from '@/types/types';
import { useFocusEffect } from 'expo-router';
import { Check, Flame } from 'lucide-react-native';
import { DateTime } from 'luxon';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';

const Streak = ({ displayOnly }: {displayOnly: boolean}) => {
    const today = DateTime.now().toISODate();
    const { t } = useTranslation();
    const [streakData, setStreakData] = useState<StreakRow[]>([]);
    const [streakCounts, setStreakCounts] = useState({
        current: 0,
        longest: 0,
    });
    const { getWeeklyStreak, getStreakCount, initStreakRecord } = useDatabase();
    const days = [
        t("monday_abrv"),
        t("tuesday_abrv"),
        t("wednesday_abrv"),
        t("thursday_abrv"),
        t("friday_abrv"),
        t("saturday_abrv"),
        t("sunday_abrv"),
    ];

    const normalizeStreak = (streakData: StreakRow[]) => {   
        const last7Dates = Array.from({ length: 7 }).map((_, i) =>
            DateTime.now().minus({ days: 6 - i }).toISODate()
        );

        return last7Dates.map(date => {
            const streakItem = streakData.find(item => item.date === date);
            return streakItem ? streakItem : { date, completed: 0 };
        });
    };

    const getWeekdayAbbreviation = (dateString: string) => { 
        const date = DateTime.fromISO(dateString);
        return days[date.weekday - 1]; 
    }

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const loadStreakData = async () => {
                const results = await getWeeklyStreak();
                const streakCountsResults = await getStreakCount();

                if (!isActive) return;

                setStreakCounts({
                    current: streakCountsResults?.current || 0,
                    longest: Math.max(
                    streakCountsResults?.longest || 0,
                    streakCountsResults?.current || 0
                    ),
                });

                const normalizedResults = normalizeStreak(results);
                setStreakData(normalizedResults);
            };
            initStreakRecord()
            loadStreakData();

            return () => {
            isActive = false;
            };
        }, [])
    );

    return (
        <ThemedView variant='shaded' className='overflow-hidden border border-border-light dark:border-border-dark rounded-2xl mb-6 w-full'>
            <View className='p-4'>
                <ThemedText className='text-lg font-bold mb-2'>{t("streak")}</ThemedText>
                <View className='flex-row justify-between mt-2'>
                    {streakData.map((day, index) => (
                        <View key={day.date}>
                            {(day.completed === 1 || displayOnly)  ? (
                                    <View className='w-10 h-10 bg-primaryDark rounded-full flex justify-center items-center relative overflow-hidden'>
                                        <View className='absolute bg-primary w-[92%] h-[92%] left-0 top-0 rounded-full'></View>
                                        <Check color='#FFFFFF' size={20} strokeWidth={3} />
                                    </View>
                                    
                            ) : (
                                <View className={`w-10 h-10 rounded-full border-4 ${day.date === today ? 'border-primary' : 'border-background-light dark:border-background-dark'}`}></View>    
                            ) }
                            <ThemedText variant='subtext' className='text-center uppercase font-black mt-2'>{ displayOnly ? days[index][0] : getWeekdayAbbreviation(day.date)[0] }</ThemedText>
                        </View>    
                    ))}
                </View>
                <View className='border-t mt-4 pt-4 flex-row items-center justify-between border-border-light dark:border-border-dark'>
                    <ThemedText variant='subtext' className='text-lg font-bold'>{t("current_streak")}</ThemedText>
                    <View className='flex-row items-center gap-1'>
                        <Flame size={16} color='#fc6a03' strokeWidth={3} />
                        <ThemedText className='text-2xl font-bold'>{displayOnly ? '100' : (streakCounts.current || 0)}</ThemedText>
                        <ThemedText variant='subtext'>{ streakCounts.current === 1 ? t("day") : t("days") }</ThemedText>
                    </View>
                    
                </View>
                <View className=' mt-4 pt-4 flex-row items-center justify-between border-border-light dark:border-border-dark'>
                    <ThemedText variant='subtext' className='text-md'>{t("longest_streak")}</ThemedText>
                    <View className='flex-row items-center gap-1'>
                        <Flame size={14} color='#fc6a03' strokeWidth={3} />
                        <ThemedText className='text-lg font-bold'>{displayOnly ? '100' : (streakCounts.longest || 0)}</ThemedText>
                        <ThemedText className='text-sm' variant='subtext'>{ streakCounts.longest === 1 ? t("day") : t("days") }</ThemedText>
                    </View>
                    
                </View>
                
            </View>
        </ThemedView>
    )
}

export default Streak
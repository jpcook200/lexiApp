import LanguageIndicator from '@/components/LanguageIndicator';
import Logo from '@/components/Logo';
import Streak from '@/components/Streak';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import useDatabase from '@/db/useDatabase';
import { useUserStore } from '@/hooks/useGetUser';
import useInitStreak from '@/hooks/useInitStreak';
import { LearnedCounts, Word } from '@/types/types';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const { t } = useTranslation();
    const db  = useSQLiteContext()
    const { getLearnedWordsByTimeframe } = useDatabase();
    const { user, loading, fetchUser, setUser } = useUserStore();
    const [learnedWords, setLearnedWords] = useState<Word[]>([]);
    const [learnedCounts, setLearnedCounts] = useState<LearnedCounts>({
        today: 0,
        pastWeek: 0,
        allTime: 0
    })

    useInitStreak();

    const getLearnedWords = async () => { 
        if (!user) return;
        try {
            const results = await db.getAllAsync<Word>(`SELECT * FROM learned_words WHERE user_id = ? AND learn_lang = ? AND native_lang = ? ORDER BY learned_at DESC LIMIT 5`, [1, user.learn_lang, user.native_lang]);
            const { allTime, today, pastWeek } = await getLearnedWordsByTimeframe()
            setLearnedCounts(prev => ({...prev, 
                today: today, 
                pastWeek: pastWeek,
                allTime: allTime
            }))
            setLearnedWords(results);

        } catch (error) {
            console.error('Error fetching learned words:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getLearnedWords();

        }, [user])
    );

    useFocusEffect(
        useCallback(() => {
            fetchUser(db)

        }, [])
    );

    if (!user) { 
        return (
            <SafeAreaView edges={['top']} className='flex-1 h-full bg-background-light dark:bg-background-dark p-4 justify-center items-center'>
                <ActivityIndicator size='small' color='#1c95ffff'/>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView edges={['top']} className='flex-1 bg-background-light dark:bg-background-dark px-4'>
            <ScrollView className=''>
                <View className="mb-6 flex-row justify-between items-center">
                    <Logo/>
                    <LanguageIndicator
                        language={user.learn_lang}
                    />
                </View>
            
                <Streak
                    displayOnly={false}
                />
                <ThemedView variant='shaded' className='border border-border-light dark:border-border-dark rounded-2xl'>
                    <View className='p-4'>
                        <ThemedText className='text-lg font-bold'>{t('words_learned')}</ThemedText>
                        <View className='flex-row justify-between mt-4'>
                            <View>
                                <ThemedText className='text-4xl font-bold'>{ learnedCounts.today }</ThemedText>
                                <ThemedText variant='accent' className='text-md font-bold text-primary'>{t("today")}</ThemedText>
                            </View>
                            <View>
                                <ThemedText className='text-4xl font-bold'>{ learnedCounts.pastWeek }</ThemedText>
                                <ThemedText variant='accent' className='text-md font-bold text-primary'>{t("past_week")}</ThemedText>
                            </View>
                            <View>
                                <ThemedText className='text-4xl font-bold'>{ learnedCounts.allTime }</ThemedText>
                                <ThemedText variant='accent' className='text-md font-bold text-primary'>{t("all_time")}</ThemedText>
                            </View>
                        </View>
                        <ThemedView style={{minHeight: 135}} className='mt-6 border border-border-light dark:border-border-dark rounded-lg overflow-hidden' variant='item'>
                            { learnedWords?.length === 0 ? (
                                <View className='flex-1 justify-center items-center py-10 px-4'>
                                    <ThemedText variant='subtext' className='text-center italic opacity-50'>{t("no_words")}</ThemedText>
                                </View>
                            ) : (
                                learnedWords?.map((word, index) => (
                                    <View style={{height: 45}} key={index} className={`px-4 w-full flex-row justify-between items-center ${index % 2 === 0 ? 'bg-background-light dark:bg-background-dark' : 'bg-secondary-light dark:bg-secondary-dark' }`}>
                                        <ThemedText className='font-bold'>{ word?.learning_word }</ThemedText>
                                        <ThemedText variant='subtext' className='italic'>{ word?.native_word }</ThemedText>
                                    </View>
                                ))   
                            )}
                            
                        </ThemedView>
                        <TouchableOpacity accessibilityLabel='View All Learned Words' accessibilityHint='View all your learned words' style={{boxShadow: '0 4px 0 #2889e3ff'}} onPress={() => router.push('/(tabs)/home/userWordsList')} className='h-12 bg-primary w-full text-center rounded-lg mt-6 flex justify-center items-center'>
                            <Text className='font-bold text-text-dark'>{ t("view_all") }</Text>
                        </TouchableOpacity>
                    </View>
                </ThemedView>
            </ScrollView>
            
        </SafeAreaView>
    )
}


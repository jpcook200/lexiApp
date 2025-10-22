import LanguageIndicator from '@/components/LanguageIndicator';
import Streak from '@/components/Streak';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { Word } from '@/db/useDatabase';
import useGetUser from '@/hooks/useGetUser';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

import Logo from '@/components/Logo';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const { t } = useTranslation();
    const { user } = useGetUser();
    const [learnedWords, setLearnedWords] = useState<Word[]>([]);
    const db = useSQLiteContext();

    const getLearnedWords = async () => { 
        if (!user) return;
        try {
            const results = await db.getAllAsync<Word>(`SELECT * FROM learned_words WHERE user_id = ? AND learning_language = ? AND native_language = ? ORDER BY learned_at DESC LIMIT 5`,[1, user.learn_lang, user.native_lang]);
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

    return (
        <SafeAreaView edges={['top']} className='flex-1 bg-background-light dark:bg-background-dark px-4'>
            <View className="mb-6 flex-row justify-between items-center">
                <Logo/>
                <LanguageIndicator/>
            </View>
            <ScrollView className='g'>
                <Streak/>
                <ThemedView variant='shaded' className='border border-border-light dark:border-border-dark rounded-2xl'>
                    <View className='p-4'>
                        <ThemedText className='text-lg font-bold'>{t('words_learned')}</ThemedText>
                        <View className='flex-row justify-between mt-4'>
                            <View>
                                <ThemedText className='text-4xl font-bold'>0</ThemedText>
                                <ThemedText variant='accent' className='text-md font-bold text-primary'>{t("today")}</ThemedText>
                            </View>
                            <View>
                                <ThemedText className='text-4xl font-bold'>0</ThemedText>
                                <ThemedText variant='accent' className='text-md font-bold text-primary'>{t("this_week")}</ThemedText>
                            </View>
                            <View>
                                <ThemedText className='text-4xl font-bold'>0</ThemedText>
                                <ThemedText variant='accent' className='text-md font-bold text-primary'>{t("all_time")}</ThemedText>
                            </View>
                        </View>
                        <ThemedView className='mt-6 border border-border-light dark:border-border-dark rounded-lg min-h-32 overflow-hidden' variant='item'>
                            { learnedWords?.length === 0 ? (
                                <View className='flex-1 justify-center items-center py-10 px-4'>
                                    <ThemedText variant='subtext' className='text-center italic opacity-50'>{t("no_words")}</ThemedText>
                                </View>
                            ) : (
                                learnedWords?.map((word, index) => (
                                    <View key={index} className={`px-4 w-full py-4 flex-row justify-between ${index % 2 === 0 ? 'bg-background-light dark:bg-background-dark' : 'bg-secondary-light dark:bg-secondary-dark' }`}>
                                        <ThemedText className='font-bold'>{ word?.learning_word }</ThemedText>
                                        <ThemedText variant='subtext' className='italic'>{ word?.native_word }</ThemedText>
                                    </View>
                                ))   
                            )}
                            
                        </ThemedView>
                        <TouchableOpacity style={{boxShadow: '0 4px 0 #2889e3ff'}} onPress={() => router.push('/(tabs)/home/userWordsList')} className='h-12 bg-primary w-full text-center rounded-lg mt-6 flex justify-center items-center'>
                            <Text className='font-bold text-text-dark'>{ t("view_all") }</Text>
                        </TouchableOpacity>
                    </View>
                </ThemedView>
            </ScrollView>
            
        </SafeAreaView>
    )
}


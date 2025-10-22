import { getWords } from '@/api/getWords'
import CardStackSwiper from '@/components/CardStackSwiper'
import LanguageIndicator from '@/components/LanguageIndicator'
import LearningTracker from '@/components/LearningTracker'
import Logo from '@/components/Logo'
import useDatabase from '@/db/useDatabase'
import useGetUser from '@/hooks/useGetUser'
import { useFocusEffect } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { useCallback, useState } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export type ActiveWordsType = { 
    active: any[] | null;
    default: any[];
}

const learn = () => {
    const { setLastSet, increaseDifficultyLevel, deleteAllFromDailyWords, getDailyLearnedCount, getDailyWords, saveDailyWords, getLearnedWordsIds } = useDatabase();
    const { user } = useGetUser();
    const [progressToday, setProgressToday] = useState(0);
    const [activeWords, setActiveWords] = useState([])

    const handleGetProgessCount = async () => {
        try {
            const count = await getDailyLearnedCount();
            setProgressToday(count);
        } catch (error) {
            console.error('Error fetching daily learned words count:', error);
        }
    };

    const getHighestDifficultyLevel = (words) => {
        const difficulties = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];

        if (!Array.isArray(words) || words.length === 0) return null;

        // Map each word's difficulty to its index in the ordered list
        const indices = words
            .map(w => difficulties.indexOf(w.learning_difficulty?.toLowerCase()))
            .filter(i => i >= 0); // remove any invalid difficulty values

        if (indices.length === 0) return null;

        // Get the max index and return the corresponding difficulty
        const maxIndex = Math.max(...indices);
        return difficulties[maxIndex];
    };


    const handleGetWords = async () => {
        if (!user) return [];
        
        try {
            const storedDailyWords = await getDailyWords();
            const dailyWordIds = storedDailyWords.map((word) => word.word_id);
            const learnedWordIds = await getLearnedWordsIds();
            const userTimezone = user.timezone
            const localDatetime = new DateTime.now().setZone(userTimezone).toString();
            console.log(localDatetime)
            const localDate = localDatetime.split('T')[0];
            const storedDate = storedDailyWords.length > 0 ? storedDailyWords[0].time_sent?.split(' ')[0] : null;
            console.log(storedDate + ' vs ' + localDate)

            if (user.last_set === 1) { 
                return storedDailyWords.filter((word) => word.learned === 0);
            }
            
            if (1 < 2 || storedDailyWords.length === 0) {
                //its the next day or no words stored
                console.log(user?.words_per_day)
                setProgressToday(0);
                console.log('next day!')
                //delete all from daily words
                await deleteAllFromDailyWords();
                
                //fetch words per day amount of words
                const { words: newWords, lastSet } = await getWords({
                    nativeLang: user.native_lang,
                    learningLang: user.learn_lang,
                    difficulty: user.difficulty_level,
                    limit: user.words_per_day!,
                    excludeIds: [...learnedWordIds, ...dailyWordIds],
                    localDatetime: localDatetime,
                })
                console.log("Is this thie last set yet??>?????---------------" + lastSet)
                //save the new words to daily words
                const newData = await saveDailyWords(newWords);

                //remove any words that are learned (should be none but just in case)
                const filteredResults = newData.filter((word) => word.learned === 0);
                const highestWordDifficulty = getHighestDifficultyLevel(filteredResults);
                await increaseDifficultyLevel(highestWordDifficulty, user.difficulty_level);
                setActiveWords(filteredResults)
                if (user.last_set === 0 && (lastSet === true || lastSet === 'true')) { 
                    alert('Well Done You Have Completed the course, these are your last words to learn!')
                    await setLastSet();
                }
                return filteredResults;
            } else if (storedDate === localDate) {
                // The day is the same as the stored date
                console.log('same day!');
                if (user.words_per_day! > storedDailyWords.length) {
                    // The user increased their words per day setting, so fetch the difference
                    const { words: newWords, lastSet } = await getWords({
                        nativeLang: user.native_lang,
                        learningLang: user.learn_lang,
                        difficulty: user.difficulty_level,
                        limit: user.words_per_day! - storedDailyWords.length,
                        excludeIds: [...learnedWordIds, ...dailyWordIds],
                        localDatetime: localDatetime,
                    });

                    // Save and return the updated daily words
                    const newData = await saveDailyWords(newWords);
                    const filteredResults = newData.filter((word) => word.learned === 0);
                    setActiveWords(filteredResults);
                    return filteredResults;
                } else {
                    // Return the unlearned stored words for the current day
                    const filteredResults = storedDailyWords.filter((word) => word.learned === 0);
                    setActiveWords(filteredResults);
                    return filteredResults;
                }
            }
        
        } catch (error) {
            console.error('Error fetching daily words:', error);
            
            const errorStoredDailyWords = await getDailyWords();
            setActiveWords(errorStoredDailyWords.filter((word) => word.learned === 0));
            return errorStoredDailyWords.filter((word) => word.learned === 0);
        }
    }

    const { data, error, isPending, refetch } = useQuery({
        queryKey: ['words', user?.native_lang, user?.learn_lang, user?.words_per_day],
        queryFn: () => handleGetWords(),
        enabled: !!user,
        refetchOnWindowFocus: true,
        retry: (failureCount, error: any) => {
        // Don't retry if the error is a 400 (client error)
        if (error?.message?.includes('401') || error?.response?.status === 401) {
            return false;
        }
        return false; // or number of retries you want
    },
    });

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            if (isActive) {
                refetch();
                handleGetProgessCount();
            }
            return () => {
                isActive = false;
            };
        }, [])
    );

    return (
        <SafeAreaView className='flex-1 bg-background-light dark:bg-background-dark px-4'>
            <View className="mb-14 flex-row justify-between items-center">
                <Logo/>
                <LanguageIndicator/>
            </View>
            <CardStackSwiper
                activeWords={activeWords}
                setActiveWords={setActiveWords}
                updateProgress={handleGetProgessCount}
                progress={progressToday}
                isPending={isPending}
                practice={false}

            />
            <LearningTracker
                progress={progressToday || 0}
                goal={user?.words_per_day || 0}
            />
        </SafeAreaView>
        
    )
}

export default learn

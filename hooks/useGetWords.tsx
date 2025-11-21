import { getWords } from '@/api/getWords';
import useDatabase from '@/db/useDatabase';
import { User, Word } from '@/types/types';
import { createDirectory } from '@/utilities/createDirectory';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { useIAP } from 'react-native-iap';

const useGetWords = () => {
    const { setLastSet, increaseDifficultyLevel, deleteAllFromDailyWords, getDailyLearnedCount, getDailyWords, saveDailyWords, getLearnedWordsIds, saveLastFetchedDate, toggleRandomDailyWords } = useDatabase();
    const [progressToday, setProgressToday] = useState(0);
    const [activeWords, setActiveWords] = useState<Word[]>([]);
    const { getActiveSubscriptions, connected } = useIAP();
    
    const getHighestDifficultyLevel = (words: Word[]) => {
        const difficulties = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];
        if (!Array.isArray(words) || words.length === 0) return 'a1';

        const indices = words
            .map(w => difficulties.indexOf(w.learning_difficulty?.toLowerCase()))
            .filter(i => i >= 0);

        if (indices.length === 0) return 'a1';

        const maxIndex = Math.max(...indices);
        return difficulties[maxIndex];
    };

    const handleGetProgessCount = async () => {
        try {
            const count = await getDailyLearnedCount();
            setProgressToday(count ?? 0);
        } catch (error) {
            console.error('Error fetching daily learned words count:', error);
        }
    };

    const handleCompletedSet = (storedDailyWords: Word[]) => {
        return storedDailyWords.filter((word) => word.learned === 0 && word.hidden === 0);
    };

    const handleNewDayOrEmptyWords = async ({ user, learnedWordIds, dailyWordIds, localDatetime, deleteWords, transactionId }: {user: User, learnedWordIds: number[], dailyWordIds: number[], localDatetime: string, deleteWords: boolean, transactionId: string | null}) => {
        setProgressToday(0);
        await createDirectory();

        if (deleteWords) { 
            await deleteAllFromDailyWords();
        }

        const { words: newWords, lastSet } = await getWords({
            nativeLang: user.native_lang,
            learningLang: user.learn_lang,
            difficulty: user.difficulty_level,
            limit: user.words_per_day!,
            excludeIds: [...learnedWordIds, ...dailyWordIds],
            localDatetime,
            transactionId
        });
        
        await saveLastFetchedDate();

        const newData = await saveDailyWords(newWords);
        const filteredResults = newData.filter((word: Word) => word.learned === 0 && word.hidden === 0);
        
        const highestWordDifficulty = getHighestDifficultyLevel(filteredResults);
        const allSameAsHighest = filteredResults.length > 0 && filteredResults.every(word => (word.learning_difficulty ?? '').toLowerCase() === highestWordDifficulty);
        if (filteredResults.length > 0 && !allSameAsHighest) {
            await increaseDifficultyLevel(highestWordDifficulty);
        }
        
        setActiveWords(filteredResults);

        if (user.last_set === 0 && (lastSet === true)) {
            alert('Well Done You Have Completed the course, these are your last words to learn!');
            await setLastSet();
        }

        return filteredResults;
    };

    const handleSameDay = async ({ user, storedDailyWords, learnedWordIds, dailyWordIds, localDatetime, transactionId}: {user: User, storedDailyWords: Word[], learnedWordIds: number[], dailyWordIds: number[], localDatetime: string, transactionId: string | null}) => {
        let newStoredWords = storedDailyWords;
        const unhiddenWords = newStoredWords.filter((word) => word.hidden === 0);

        if (unhiddenWords.length < user.words_per_day!) {
            const wordsNeeded = user.words_per_day! - unhiddenWords.length;
            console.log("Needing to unhide words:", wordsNeeded);
            await toggleRandomDailyWords(wordsNeeded, 'show');
        }

        newStoredWords = await getDailyWords();

        if (user.words_per_day! > newStoredWords.length) {
            const { words: newWords, lastSet } = await getWords({
                nativeLang: user.native_lang,
                learningLang: user.learn_lang,
                difficulty: user.difficulty_level,
                limit: user.words_per_day! - newStoredWords.length,
                excludeIds: [...learnedWordIds, ...dailyWordIds],
                localDatetime,
                transactionId
            });

            await saveLastFetchedDate();    

            if (user.last_set === 0 && (lastSet === true)) {
                alert('Well Done You Have Completed the course, these are your last words to learn!');
                await setLastSet();
            }
        
            const newData = await saveDailyWords(newWords);
            console.log(newData.length, "----- new data length after fetching more words");
            const filteredResults = newData.filter((word) => word.learned === 0  && word.hidden === 0)

            setActiveWords(filteredResults);
            return filteredResults;
        } else {
            const filteredResults = newStoredWords.filter((word) => word.learned === 0 && word.hidden === 0);
            setActiveWords(filteredResults);
            return filteredResults;
        }
    };

    const handleGetWords = async (user: User) => {
        if (!user) return [];
        try {
            
            const storedDailyWords = await getDailyWords();
            const dailyWordIds = storedDailyWords.map((word: Word) => word.word_id);
            const learnedWordIds = await getLearnedWordsIds();

            const userTimezone = user.timezone;
            const localDatetime = DateTime.now().setZone(userTimezone).toString();

            const localDate = localDatetime.split('T')[0];
            const storedDate = user.last_fetched?.split(' ')[0] || null;

            if (!connected) { 
                return storedDailyWords.filter((word) => word.learned === 0 && word.hidden === 0);
            }
            const activeSubscriptions = await getActiveSubscriptions();
            const transactionId = activeSubscriptions[0]?.transactionId || null;

            if (user.last_set === 1 && user.difficulty_level === 'c2') {
                return handleCompletedSet(storedDailyWords);
            }

            if (storedDailyWords.length === 0 || !storedDate) {
                return handleNewDayOrEmptyWords({
                    user,
                    learnedWordIds,
                    dailyWordIds,
                    localDatetime,
                    deleteWords: false,
                    transactionId
                    
                });
            }

            if (localDate > storedDate) {
                return handleNewDayOrEmptyWords({
                    user,
                    learnedWordIds,
                    dailyWordIds,
                    localDatetime,
                    deleteWords: true,
                    transactionId
                });
            } else if (storedDate === localDate) {
                return handleSameDay({
                    user,
                    storedDailyWords,
                    learnedWordIds,
                    dailyWordIds,
                    localDatetime,
                    transactionId
                });
            }

            return storedDailyWords.filter((word) => word.learned === 0 && word.hidden === 0);

        } catch (error) {
            console.error('Error fetching daily words:', error);
            const errorStoredDailyWords = await getDailyWords();
            const fallbackWords = errorStoredDailyWords.filter((word) => word.learned === 0 && word.hidden === 0);
            setActiveWords(fallbackWords);
            return fallbackWords;
        }
    };

    return { handleGetWords, activeWords, setActiveWords, progressToday, setProgressToday, handleGetProgessCount };
};

export default useGetWords;
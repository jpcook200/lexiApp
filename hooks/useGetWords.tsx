import { getNativeTranslations, getWords } from '@/api/getWords';
import useDatabase from '@/db/useDatabase';
import { User, Word } from '@/types/types';
import { createDirectory } from '@/utilities/createDirectory';
import i18next from 'i18next';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { endConnection, initConnection, useIAP } from 'react-native-iap';
import { useUserStore } from './useGetUser';

const useGetWords = () => {
    const { getDailyLearnedCount, saveDailyWords, updateNativeWords, setLangChangedDate, resetProgressByLanguage, saveLastFetchedDate, getDailyWords, deleteAllFromDailyWords, getLearnedWordsIds, increaseDifficultyLevel, setLastSet, initStreakRecord, toggleRandomDailyWords, setLearningLanguage, setNativeLanguage } = useDatabase();
    const { getActiveSubscriptions} = useIAP();
    const [error, setError] = useState(false);
    const { t } = useTranslation();

    //state
    const [progressToday, setProgressToday] = useState(0);
    const [wordsLoading, setWordsLoading] = useState(false);
    
    const handleGetProgessCount = async () => {
        try {
            const count = await getDailyLearnedCount();
            setProgressToday(count ?? 0);
        } catch (error) {
            console.error('Error fetching daily learned words count:', error);
        }
    };

    const getTransactionId = async () => {
        try {
            await initConnection();
            const products = await getActiveSubscriptions();
            if (products && products.length > 0) {
                return products[0].transactionId || null;
            }
            
            return null;
        } catch (error) {
            console.error('Error initializing IAP connection:', error);
            
            return null;
        }
        finally {
            await endConnection();
        }
    }

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

    //Day handlers--------------------------------------------------------------------------------------------------------------------
    const handleNativeLanguageChange = async (lang: string) => {
        try {
            const storedDailyWords = await getDailyWords();
            if(storedDailyWords.length > 0) {
                const storedWordIds = storedDailyWords.map((word: Word) => word.word_id);
                const newTranslations = await getNativeTranslations(lang, storedWordIds);
                await updateNativeWords(newTranslations);

            }

            await setNativeLanguage(lang);
            await initStreakRecord();
            i18next.changeLanguage(lang);

        } catch (error) {
            console.error('Error setting native language:', error);
            throw error;
        }
    };

    const handleLanguageChange = async (
        wordsPerDay: number,
        oldLearnLang: string,
        oldNativeLang: string,
        newLearnLang: string,
        newNativeLang: string,
        lastChangedDate: string | undefined,
        userAccessLevel: 'pro' | 'free',
        userDifficultyLevel?: string,
        freshDate?: string | null
    ) => {
        let wordsToReturn: Word[] = [];
        
        const todayDate = DateTime.now().toISODate();
        const transactionId = await getTransactionId();

        try {
            if (userAccessLevel === 'free') {
                if (todayDate === lastChangedDate) {
                    throw new Error("lang_change_limit");
                }

                const { words: newWords, lastSet } = await getWords({
                    nativeLang: newNativeLang,
                    learnLang: newLearnLang,
                    difficulty: userDifficultyLevel || 'a1',
                    limit: wordsPerDay,
                    excludeIds: [],
                    currentDateTime: todayDate,
                    transactionId,
                    getDemoWords: todayDate === freshDate
                });

                if (newLearnLang !== oldLearnLang) {
                    await setLearningLanguage(newLearnLang);
                }

                if (newNativeLang !== oldNativeLang) {
                    await setNativeLanguage(newNativeLang);
                }

                await setLangChangedDate();

                await deleteAllFromDailyWords();
                await resetProgressByLanguage(oldLearnLang);

                const newData = await saveDailyWords(newWords);
                await saveLastFetchedDate();
                
                wordsToReturn =  newData;
            
            } else if (userAccessLevel === 'pro') { 
                const newData = await handleWPDChange(wordsPerDay, newLearnLang, newNativeLang, userDifficultyLevel = 'a1', todayDate, freshDate || '');
                if (newData) { 
                    wordsToReturn = newData;
                }
            }

            if (newLearnLang !== oldLearnLang) {
                await setLearningLanguage(newLearnLang);
            }

            if (newNativeLang !== oldNativeLang) {
                await setNativeLanguage(newNativeLang);
                i18next.changeLanguage(newNativeLang);
            }
            return wordsToReturn;
        } catch (error) {
            console.error('Error handling language change:', error);
            throw error;
        }
    };

    const handleWPDChange = async (selectedNumber: number, learnLang: string, nativeLang: string, difficulty: string, currentDateTime: string, freshDate: string ) => { 
        let wordsToReturn: Word[] | null = null;
        const storedWords = await getDailyWords(learnLang, nativeLang);
        const unhiddenStoredWords = storedWords.filter(word => word.hidden === 0);
        const currentDailyWords = unhiddenStoredWords.length;
        const todayDate = DateTime.now().toISODate();
        try {
            if (selectedNumber < currentDailyWords) {
                const wordsToRemove = currentDailyWords - selectedNumber;
                await toggleRandomDailyWords(wordsToRemove, 'hide');
                wordsToReturn = await getDailyWords();
            
            } else if (selectedNumber > currentDailyWords) {
                const wordsToAdd = selectedNumber - currentDailyWords;
                await toggleRandomDailyWords(wordsToAdd, 'show');
                const newStoredWords = await getDailyWords(learnLang, nativeLang);
                wordsToReturn = newStoredWords;
                const dailyWordIds = newStoredWords.map((word: Word) => word.word_id);
                const learnedWordIds = await getLearnedWordsIds(learnLang);
                
                if (selectedNumber > newStoredWords.length) {
                    const limit = selectedNumber - newStoredWords.length;
                    const transactionId = await getTransactionId();
                    const { words: newWords, lastSet } = await getWords({
                        nativeLang,
                        learnLang,
                        difficulty,
                        limit,
                        excludeIds: [...learnedWordIds, ...dailyWordIds],
                        currentDateTime,
                        transactionId,
                        getDemoWords: todayDate === freshDate
                    });
                    await saveLastFetchedDate();
                    const newData = await saveDailyWords(newWords);
                    wordsToReturn = newData;

                }
            } else { 
                wordsToReturn = storedWords;
            }
            
            return wordsToReturn
            
        } catch (error) {
            console.error('Error handling change in wpd:', error);
            throw error;
        }
    };
    
    const handleFirstDay = async (limit: number, nativeLang: string, learnLang: string, difficulty: string, currentDateTime: string) => {
        try {
            await createDirectory();
            const transactionId = await getTransactionId();
            const { words: newWords } = await getWords({
                nativeLang,
                learnLang,
                difficulty,
                limit,
                excludeIds: [],
                currentDateTime,
                transactionId,
                getDemoWords: true
            });
            
            const newData = await saveDailyWords(newWords);           
            await saveLastFetchedDate();
            return newData;
            
        } catch (error) {
            console.error('Error handling first day:', error);
            throw error;
        }
    };

    const handleSameDay = async () => {
        const updatedWords = useUserStore.getState().activeWordsStore;
        try {
            if (updatedWords.length === 0) {
                setWordsLoading(true);
                const storedDailyWords = await getDailyWords();
                return storedDailyWords;
            } else { 
                return null
            }
            
        } catch (error) {
            console.error('Error handling same day:', error);
            throw error;
        }
    };

    const handleNewDay = async (limit: number, nativeLang: string, learnLang: string, difficulty: string, currentDateTime: string, userLastSet: number, userAccessLevel: 'pro' | 'free') => { 
        try {
            await initStreakRecord();
            await deleteAllFromDailyWords();
            const transactionId = await getTransactionId();
            const storedDailyWords = await getDailyWords();
            const dailyWordIds = storedDailyWords.map((word: Word) => word.word_id);
            const learnedWordIds = await getLearnedWordsIds();
            setProgressToday(0);

            const { words: newWords, lastSet } = await getWords({
                nativeLang,
                learnLang,
                difficulty,
                limit,
                excludeIds: [...dailyWordIds, ...learnedWordIds],
                currentDateTime,
                transactionId
            });

            const newData = await saveDailyWords(newWords);           
            await saveLastFetchedDate();

            const highestWordDifficulty = getHighestDifficultyLevel(newData);
            const allSameAsHighest = newData.length > 0 && newData.every(word => (word.learning_difficulty ?? '').toLowerCase() === highestWordDifficulty);
            if (newData.length > 0 && !allSameAsHighest) {
                await increaseDifficultyLevel(highestWordDifficulty);
            }

            if (userLastSet === 0 && (lastSet === true)) {
                if (userAccessLevel === 'pro') { 
                    alert('Well done you have completed the course, these are your last words to learn!');

                } else if (userAccessLevel === 'free') {
                    alert('Well done you have completed the free course, consider upgrading to pro to access more words!');

                }
                
                await setLastSet();
            }

            return newData;
            
        } catch (error) {
            console.error('Error handling new day:', error);
            throw error;
        }
    }

    const handleGetWords = async (user: User, currentDateTime: string) => {
        let wordsToReturn: Word[] | null = null;
        const userLastFetched = user.last_fetched ? DateTime.fromISO(user.last_fetched.slice(0, 10)).startOf("day") : null;
        const currentDate = DateTime.fromISO(currentDateTime).startOf("day")
        await handleGetProgessCount();

        try {
            if (userLastFetched === null) {
                setWordsLoading(true);
                wordsToReturn = await handleFirstDay(
                    user.words_per_day,
                    user.native_lang,
                    user.learn_lang,
                    user.difficulty_level,
                    currentDateTime
                );

            } else if (userLastFetched < currentDate) {
                setWordsLoading(true);
                wordsToReturn = await handleNewDay(
                    user.words_per_day,
                    user.native_lang,
                    user.learn_lang,
                    user.difficulty_level,
                    currentDateTime,
                    user.last_set,
                    user.access_level
                );
            } else {
                wordsToReturn = await handleSameDay() || null;
            }

            if (wordsToReturn) {
                return wordsToReturn;
            }
            else { 
                return null;
            }
        } catch (error) {
            console.error('Error fetching words:', error);
            Alert.alert(t("error"), t("fetch_words_error"));
            setError(true);
            throw error;
        } finally {
            setWordsLoading(false);
        }
    }
    return { handleGetWords, handleNativeLanguageChange, handleGetProgessCount, progressToday, handleWPDChange, handleLanguageChange, wordsLoading, error}
};

export default useGetWords;
import CardStackSwiper from '@/components/CardStackSwiper'
import CardSwitcherButton from '@/components/CardSwitcherButton'
import LearningTracker from '@/components/LearningTracker'
import ThemedIcon from '@/components/ThemedIcon'
import ThemedText from '@/components/ThemedText'
import Tutorial from '@/components/Tutorial'
import useDatabase from '@/db/useDatabase'
import { useUserStore } from '@/hooks/useGetUser'
import useGetWords from '@/hooks/useGetWords'
import { Word } from '@/types/types'
import { useFocusEffect } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { DateTime } from 'luxon'
import { useColorScheme } from 'nativewind'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const learn = () => {
    const { handleGetWords, handleGetProgessCount, progressToday, wordsLoading, error } = useGetWords();
    const { t } = useTranslation();
    const db = useSQLiteContext();
    const { user, fetchUser, activeWordsStore, setActiveWordsStore, prependActiveWordStore, filterActiveWordsStore, reorderWordStore, setSelectedWordId } = useUserStore();
    const { toggleLearned, removeFromLearnedWords } = useDatabase();
    const [switchCardFaceState, setSwitchCardFaceState] = useState(false);
    const [currentStreak, setCurrentStreak] = useState <boolean>(false);
    const [showTutorial, setShowTutorial] = useState(false);
    const [lastWordLearned, setlastWordLearned] = useState<Word | null>(null);
    const { colorScheme } = useColorScheme();

    const handleUndoLearned = async () => {
        const today = DateTime.now().toISODate();
        const lastWordLearnedDate = lastWordLearned?.time_sent?.slice(0, 10)
        if (lastWordLearnedDate !== today) {
            return;
        }
        if (lastWordLearned != null && user) {
            await toggleLearned(lastWordLearned.word_id);
            await removeFromLearnedWords(lastWordLearned.word_id);
            prependActiveWordStore(lastWordLearned);
            setlastWordLearned(null);
            await handleGetProgessCount();
        }
    };

    const handleFocus = async () => {
        await fetchUser(db);
        const updatedUser = useUserStore.getState().user;
        const todayDate = DateTime.now().toISODate();
        const wordsToReturn = await handleGetWords(updatedUser!, todayDate);

        if (wordsToReturn) {
            setActiveWordsStore(wordsToReturn);
        }
        filterActiveWordsStore();
    };

    const loopCards = (index: number) => {
        if (!activeWordsStore) return;
        
        setTimeout(() => {
            reorderWordStore(index);
            const newActiveWords = useUserStore.getState().activeWordsStore;
            if (newActiveWords && newActiveWords.length > 0) {
                setSelectedWordId(newActiveWords[0].word_id);
            }
        }, 150);
    };

    //effects ------------------------------------------------------------------------------
    useFocusEffect(
        useCallback(() => { 
            handleFocus();
        }, [])
    ); 

    useEffect(() => {
        if (user) { 
            setShowTutorial(user.tutorial_completed === 0)
        }
    }, [user]);

    if (!user) {
        return (
            <SafeAreaView edges={['top']} className='flex-1 h-full bg-background-light dark:bg-background-dark p-4 justify-center items-center'>
                <ActivityIndicator size='small' color='#1c95ffff'/>
            </SafeAreaView>
        )
    }

    return (
        <>
            {showTutorial && <Tutorial
                setShowTutorial={setShowTutorial}
            />}
            <SafeAreaView edges={["top"]} className='flex-1 bg-background-light dark:bg-background-dark'>
                <View className=" flex-row justify-between items-center mt-1 mb-4 px-4 gap-4">
                    <TouchableOpacity style={{ boxShadow: `inset -3px -3px 0 0 ${colorScheme === 'dark' ? '#0000002c' : '#b7b7b727'}` }} disabled={!lastWordLearned} accessibilityLabel='Undo learning previous word' onPress={ () => handleUndoLearned() } className={`${!lastWordLearned && 'opacity-50'} flex-row items-center self-start rounded-full border border-border-light dark:border-border-dark bg-item-light dark:bg-item-dark pl-3 pr-4 h-10`}>
                        <ThemedIcon name='Undo' size={20} />
                        <ThemedText className='text-md ml-2 font-bold'>{t("undo")}</ThemedText>
                    </TouchableOpacity>
                 
                    <CardSwitcherButton
                        learnLang={user.learn_lang}
                        nativeLang={user.native_lang}
                        setSwitchCardFaceState={setSwitchCardFaceState}
                        switchFaceState={switchCardFaceState}
                    />
                </View>
                {wordsLoading && (progressToday < user.words_per_day)  ? (
                    <ActivityIndicator size={"small"} className='flex-1 justify-center items-center'/>
                ) : (
                    <>
                        <CardStackSwiper
                                activeWords={activeWordsStore}
                                updateProgress={handleGetProgessCount}
                                progress={progressToday}
                                practice={false}
                                user={user}
                                setCurrentStreak={setCurrentStreak}
                                setlastWordLearned={setlastWordLearned}
                                switchFace={switchCardFaceState}
                                error={error}
                                wordsLoading={wordsLoading}
                                loopCards={loopCards}
                        />
                    </>
                )}
                <LearningTracker
                    progress={progressToday || 0}
                    goal={user?.words_per_day || 0}
                    setCurrentStreak={setCurrentStreak}
                    currentStreak={currentStreak || false}
                />
                
            </SafeAreaView>
        </>
        
        
    )
}

export default learn

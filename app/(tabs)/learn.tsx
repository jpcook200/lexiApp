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
import { useFocusEffect } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { useSQLiteContext } from 'expo-sqlite'
import { DateTime } from 'luxon'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'
import { useIAP } from 'react-native-iap'
import { SafeAreaView } from 'react-native-safe-area-context'

const learn = () => {
    const { handleGetWords, setActiveWords, activeWords, handleGetProgessCount, progressToday } = useGetWords();
    const { t } = useTranslation();
    const { connected } = useIAP();
    const db = useSQLiteContext();
    const { user, loading, fetchUser} = useUserStore();
    const { toggleLearned, initStreakRecord, removeFromLearnedWords, switchCardFace } = useDatabase();
    const [switchCardFaceState, setSwitchCardFaceState] = useState(false);
    const [currentStreak, setCurrentStreak] = useState <boolean>(false);
    const [showTutorial, setShowTutorial] = useState(false);
    const [isInitialised, setIsInitialised] = useState(false)
    const [lastWordLearned, setlastWordLearned] = useState<Word | null>(null);
    
    const { data = [], error, isPending, refetch } = useQuery({
        queryKey: ['words', connected, user],
        queryFn: () => handleGetWords(user!),
        enabled: !!user && connected,
        refetchOnWindowFocus: true,
        retry: ( error: any) => {
            if (error?.message?.includes('401') || error?.response?.status === 401) {
                return false;
            }
            return false; 
        },
    });

    const handleUndoLearned = async () => {
        const today = DateTime.now().toISODate();
        const lastWordLearnedDate = lastWordLearned?.time_sent?.slice(0, 10)
        if (lastWordLearnedDate !== today) {
            return;
        }
        if (lastWordLearned != null && user) {
            await toggleLearned(lastWordLearned.word_id);
            await removeFromLearnedWords(lastWordLearned.word_id);
            setActiveWords((prev) => [lastWordLearned, ...prev]);
            setlastWordLearned(null);
            // if (progressToday == user?.words_per_day) { 
            //     const newCount = await updateStreakCount("decrement");
            //     await updateStreakRecord(0);
            //     setCurrentStreak(newCount);
            // }
            await handleGetProgessCount();
        }
    };

    //effects ------------------------------------------------------------------------------
    useFocusEffect(
        useCallback(() => {
            const handleFocus = async () => { 
                const today = DateTime.now().toISODate();
                setIsInitialised(false)
                const lastWordLearnedDate = lastWordLearned?.time_sent?.slice(0, 10)
                if (lastWordLearnedDate !== today) {
                    setlastWordLearned(null);
                }
                await fetchUser(db);
                await refetch();
                await initStreakRecord();
                await handleGetProgessCount();
                setIsInitialised(true)
            }
            let isActive = true;
            if (isActive) {
                handleFocus();
            }
            return async () => {
                isActive = false;
            };
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
                    <TouchableOpacity disabled={!lastWordLearned} accessibilityLabel='Undo learning previous word' onPress={ () => handleUndoLearned() } className={`${!lastWordLearned && 'opacity-50'} flex-row items-center self-start rounded-full border border-border-light dark:border-border-dark bg-item-light dark:bg-item-dark pl-3 pr-4 h-10`}>
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
                {isPending || !isInitialised ? (
                    <ActivityIndicator size={"small"} className='flex-1 justify-center items-center'/>
                ) : (
                    <>
                        <CardStackSwiper
                            activeWords={activeWords}
                            setActiveWords={setActiveWords}
                            updateProgress={handleGetProgessCount}
                            progress={progressToday}
                            practice={false}
                            user={user}
                            setCurrentStreak={setCurrentStreak}
                            setlastWordLearned={setlastWordLearned}
                            lastWordLearned={lastWordLearned}
                            switchFace={switchCardFaceState}    
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

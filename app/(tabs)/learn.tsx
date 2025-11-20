import CardStackSwiper from '@/components/CardStackSwiper'
import LanguageIndicator from '@/components/LanguageIndicator'
import LearningTracker from '@/components/LearningTracker'
import Logo from '@/components/Logo'
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
    const { toggleLearned, initStreakRecord, removeFromLearnedWords, updateStreakCount, updateStreakRecord } = useDatabase();
    
    const [currentStreak, setCurrentStreak] = useState <boolean>(false);
    const [showTutorial, setShowTutorial] = useState(false);
    const [isInitialised, setIsInitialised] = useState(false)
    const [lastWordLearned, setlastWordLearned] = useState<Word | null>(null);
    
    const { data = [], error, isPending, refetch } = useQuery({
        queryKey: ['words', connected],
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
                setIsInitialised(false)
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
            <SafeAreaView className='flex-1 bg-background-light dark:bg-background-dark px-4 pb-0'>
                <View className=" flex-row justify-between items-center">
                    <Logo/>
                    <LanguageIndicator
                        language={user.learn_lang}
                    />
                </View>
                {isPending || !isInitialised ? (
                    <ActivityIndicator size={"small"} className='flex-1 justify-center items-center'/>
                ) : (
                    <>
                        <TouchableOpacity disabled={!lastWordLearned} accessibilityLabel='Undo learning pervious word' onPress={ () => handleUndoLearned() } className={`${!lastWordLearned && 'opacity-50'} my-3 flex-row items-center self-start rounded-full border border-border-light dark:border-border-dark bg-item-light dark:bg-item-dark pl-3 pr-4 py-1`}>
                            <ThemedIcon name='Undo' size={ 20 } />
                            <ThemedText className='text-md ml-2 font-bold'>{t("undo")}</ThemedText>
                        </TouchableOpacity>
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
                        />
                            
                        <LearningTracker
                            progress={progressToday || 0}
                            goal={user?.words_per_day || 0}
                            setCurrentStreak={setCurrentStreak}
                            currentStreak={currentStreak || false}
                        />
                    </>
                )}
                
            </SafeAreaView>
        </>
        
        
    )
}

export default learn

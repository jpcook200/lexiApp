import CardStackSwiper from '@/components/CardStackSwiper'
import LanguageIndicator from '@/components/LanguageIndicator'
import LearningTracker from '@/components/LearningTracker'
import Logo from '@/components/Logo'
import Tutorial from '@/components/Tutorial'
import useDatabase from '@/db/useDatabase'
import { useUserStore } from '@/hooks/useGetUser'
import useGetWords from '@/hooks/useGetWords'
import { useFocusEffect } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { useSQLiteContext } from 'expo-sqlite'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { useIAP } from 'react-native-iap'
import { SafeAreaView } from 'react-native-safe-area-context'


const learn = () => {
    const { handleGetWords, setActiveWords, activeWords, handleGetProgessCount, progressToday } = useGetWords();
    const [currentStreak, setCurrentStreak] = useState<number>(0);
    const { updateStreakRecord, initStreakRecord } = useDatabase();
    const { user, loading, fetchUser} = useUserStore();
    const [showTutorial, setShowTutorial] = useState(false);
    const [isInitialised, setIsInitialised] = useState(false)
    const db = useSQLiteContext();
    const [cardsLoading, setCardsLoading] = useState(true)
    const { connected } = useIAP();
    
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
            <SafeAreaView className='flex-1 bg-background-light dark:bg-background-dark px-4'>
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
                        <CardStackSwiper
                            activeWords={activeWords}
                            setActiveWords={setActiveWords}
                            updateProgress={handleGetProgessCount}
                            progress={progressToday}
                            practice={false}
                            user={user}
                            setCurrentStreak={setCurrentStreak}
                        />
                        <LearningTracker
                            progress={progressToday || 0}
                            goal={user?.words_per_day || 0}
                            setCurrentStreak={setCurrentStreak}
                            currentStreak={currentStreak || 0}
                        />
                    </>
                )}
                
            </SafeAreaView>
        </>
        
        
    )
}

export default learn

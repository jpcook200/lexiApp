import CardStackSwiper from '@/components/CardStackSwiper'
import LanguageIndicator from '@/components/LanguageIndicator'
import LearningTracker from '@/components/LearningTracker'
import Logo from '@/components/Logo'
import Tutorial from '@/components/Tutorial'
import useDatabase from '@/db/useDatabase'
import { useUserStore } from '@/hooks/useGetUser'
import useGetWords from '@/hooks/useGetWords'
import useInitStreak from '@/hooks/useInitStreak'
import { useFocusEffect } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { useSQLiteContext } from 'expo-sqlite'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


const learn = () => {
    const { handleGetWords, setActiveWords, activeWords, handleGetProgessCount, progressToday  } = useGetWords();
    const { updateStreakRecord, updateStreakCount } = useDatabase();
    const { user, loading, fetchUser} = useUserStore();
    const [showTutorial, setShowTutorial] = useState(false);
    const [isInitialised, setIsInitialised] = useState(false)
    const db = useSQLiteContext();
    const [cardsLoading, setCardsLoading] = useState(true)
    
    useInitStreak();
    
    const { data = [], error, isPending, refetch } = useQuery({
        queryKey: ['words'],
        queryFn: () => handleGetWords(user!),
        enabled: !!user,
        refetchOnWindowFocus: true,
        retry: ( error: any) => {
            if (error?.message?.includes('401') || error?.response?.status === 401) {
                return false;
            }
            return false; 
        },
    });

    const handleDayComplete = async () => { 
        const date = new Date().toLocaleString('en-CA').split(',')[0];
        await updateStreakCount('increment');
        await updateStreakRecord(1, date);
    }

    useFocusEffect(
        useCallback(() => {
            const handleFocus = async () => { 
                setIsInitialised(false)
                await fetchUser(db);
                await refetch();
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

    useEffect(() => {
        if (user && (progressToday >= user?.words_per_day && isInitialised)) {
            handleDayComplete();
        }
    }, [progressToday, user]);

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
                    null
                ) : (
                    <>
                        <CardStackSwiper
                            activeWords={activeWords}
                            setActiveWords={setActiveWords}
                            updateProgress={handleGetProgessCount}
                            progress={progressToday}
                            isPending={isPending}
                            practice={false}
                            user={user}
                            cardsLoading={cardsLoading}
                        />
                        <LearningTracker
                            progress={progressToday || 0}
                            goal={user?.words_per_day || 0}
                        />
                    </>
                )}
                
            </SafeAreaView>
        </>
        
        
    )
}

export default learn

import CardStackSwiper from '@/components/CardStackSwiper'
import LanguageIndicator from '@/components/LanguageIndicator'
import LearningTracker from '@/components/LearningTracker'
import Logo from '@/components/Logo'
import Tutorial from '@/components/Tutorial'
import useDatabase from '@/db/useDatabase'
import useGetUser from '@/hooks/useGetUser'
import useGetWords from '@/hooks/useGetWords'
import useInitStreak from '@/hooks/useInitStreak'
import { useFocusEffect } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


const learn = () => {
    const { handleGetWords, setActiveWords, activeWords, handleGetProgessCount, progressToday  } = useGetWords();
    const { updateStreakRecord, updateStreakCount } = useDatabase();
    const [showTutorial, setShowTutorial] = useState(false);
    const { user } = useGetUser();
    const [isInitialised, setIsInitialised] = useState(false)
    useInitStreak();
    
    const { data, error, isPending, refetch } = useQuery({
        queryKey: ['words', user?.native_lang, user?.learn_lang, user?.words_per_day],
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

    useFocusEffect(
        useCallback(() => {
            const handleFocus = async () => { 
                setIsInitialised(false)
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
            console.log('runnging tutorial check')
            console.log('tutorial completed value:', user.tutorial_completed)
            setShowTutorial(user.tutorial_completed === 0)
        }
    }, [user]);

    const handleDayComplete = async () => { 
        const date = new Date().toLocaleString('en-CA').split(',')[0];
        await updateStreakCount('increment');
        await updateStreakRecord(1, date);
        
    }

    useEffect(() => {
        if (user && (progressToday >= user?.words_per_day && isInitialised)) {
            handleDayComplete();
        }
    }, [progressToday, user]);

    return (
        <>
            {showTutorial && <Tutorial
                setShowTutorial={setShowTutorial}
            />}
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
        </>
        
        
    )
}

export default learn

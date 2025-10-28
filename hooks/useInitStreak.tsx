import useDatabase from '@/db/useDatabase';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import useGetUser from './useGetUser';


const useInitStreak = () => {
    const { user } = useGetUser();
    const { insertStreakRecord } = useDatabase();
    const [functionHasRun, setFunctionHasRun] = useState(false);
    
    const handleStreakInit = async () => {
        if (!user) return;
        await insertStreakRecord();
        setFunctionHasRun(true);
    }

    useEffect(() => {
        if (!user) return;

        const subscription = AppState.addEventListener('change', nextState => {
            if (nextState === 'active' && !functionHasRun) {
                handleStreakInit();
            }
        });

        return () => subscription.remove();
    }, [user]);
    
    useFocusEffect(
        useCallback(() => {
            if (user || !functionHasRun) {
                handleStreakInit();
            }
        }, [user])
    );
}

export default useInitStreak
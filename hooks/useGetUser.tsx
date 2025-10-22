import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

export type User = {
    id: number;
    native_lang: string;
    learn_lang: string;
    words_per_day: number;
    onboarding_completed: number;
    reminders_on: 1 | 0;
    difficulty_level: 'a1' | 'a2' | 'a3' | 'b1' | 'b2' | 'c1' | 'c2';
    timezone: string;
};

const useGetUser = () => {
    const db = useSQLiteContext();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchUser = async () => {
        try {
            const result = await db.getFirstAsync<User>('SELECT * FROM users');
            setUser(result || null);

        } catch (err) {
                setError(err as Error);
                console.error('Error fetching user:', err);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            let isActive = true; 
            setLoading(true);
            fetchUser();
            setLoading(false);

            return () => {
                isActive = false;
            };
        }, [db])
    );

    return { user, loading, error, fetchUser };
};

export default useGetUser;

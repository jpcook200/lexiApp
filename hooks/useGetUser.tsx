import { User } from '@/types/types';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

const useGetUser = () => {
    const db = useSQLiteContext();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchUser = async () => {
        try {
            const result = await db.getFirstAsync<User & { difficulty_level?: string }>(
            `
                SELECT 
                    users.*, 
                    difficulties.level AS difficulty_level
                FROM users
                LEFT JOIN difficulties 
                    ON users.learn_lang = difficulties.lang
                WHERE users.id = ?
            `, [1]);
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

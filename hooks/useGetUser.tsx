import { User } from '@/types/types';
import { SQLiteDatabase } from 'expo-sqlite';
import { create } from 'zustand';

// Define store state + actions
type UserState = {
    user: User | null;
    loading: boolean;
    error: Error | null;
    selectedWordId: number | null;
    fetchUser: (db: SQLiteDatabase) => Promise<User | null>;
    setUser: (user: User | null) => void;
    setSelectedWordId: (id: number | null) => void;
};

// Create Zustand store
export const useUserStore = create<UserState>((set) => ({
    user: null,
    loading: true,
    error: null,
    selectedWordId: null,

    fetchUser: async (db: SQLiteDatabase) => {
        set({ loading: true, error: null });
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
                `,
                [1]
            );

            set({ user: result || null });
            return result || null;
        } catch (err) {
            
            console.error('Error fetching user:', err);
            set({ error: err as Error });
            return null;
        } finally {
            set({ loading: false });
        }
    },

    setUser: (user) => set({ user }),
    setSelectedWordId: (id) => set({ selectedWordId: id }),
}));

import { User, Word } from '@/types/types';
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
    activeWordsStore: any[];
    setActiveWordsStore: (words: any[]) => void;
    removeActiveWordStore: (wordId: number) => void;
    reorderWordStore: (index: number) => void;
    prependActiveWordStore: (word: Word) => void;
    filterActiveWordsStore: () => void;
};

// Create Zustand store
export const useUserStore = create<UserState>((set) => ({
    user: null,
    loading: true,
    error: null,
    selectedWordId: null,
    activeWordsStore: [],
    

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
    setActiveWordsStore: (words: Word[]) => set({ activeWordsStore: words }),
    removeActiveWordStore: (wordId: number) => 
    set((state) => ({
        activeWordsStore: Array.isArray(state.activeWordsStore)
            ? state.activeWordsStore.filter(w => w.id !== wordId)
            : []
    })),
    reorderWordStore: (index: number) =>
        set((state) => {
            const prev = state.activeWordsStore || [];

            if (index < 0 || index >= prev.length) return {};

            const swipedCard = prev[index];

            const remaining = [
                ...prev.slice(0, index),
                ...prev.slice(index + 1)
            ];

            const updated = [...remaining, swipedCard];

            return { activeWordsStore: updated };
        }),
    prependActiveWordStore: (word: Word) =>
        set((state) => ({
            activeWordsStore: state.activeWordsStore
                ? [word, ...state.activeWordsStore]
                : [word]
        })),
    filterActiveWordsStore: () =>
        set((state) => ({
            activeWordsStore: Array.isArray(state.activeWordsStore)
                ? state.activeWordsStore.filter(
                    (word) => word.learned === 0 && word.hidden === 0
                )
                : []
        })),



}));

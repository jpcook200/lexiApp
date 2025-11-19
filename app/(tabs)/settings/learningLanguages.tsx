import LanguagesList from '@/components/LanguagesList';
import ThemedView from '@/components/ThemedView';
import useDatabase from '@/db/useDatabase';
import { useUserStore } from '@/hooks/useGetUser';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';

const LearningLanguages = () => {
    const { setLearningLanguage, getAllStreakCounts } = useDatabase();
    const { user, loading, fetchUser } = useUserStore();
    const [streakCounts, setStreakCounts] = useState<any>([]);
    const db = useSQLiteContext();
    
    const handleSelectLanguage = async (languageCode: string) => {
        if(loading || !user) return;
        try {
            if(user.learn_lang === languageCode) {
                return router.back();
            }
            if (user?.access_level === 'free') {
                router.back();
                return router.push({
                    pathname: `/(tabs)/settings/changeLangConfirm/${languageCode}-learning`,
                });
            }
            await setLearningLanguage(languageCode);
            fetchUser(db);
            router.back();
        } catch (error) {
            console.error('Error setting learning language:', error);
        }
    };

    useEffect(() => {
        const fetchStreakCounts = async () => {
            try {
                const streakCounts = await getAllStreakCounts();
                console.log('Streak Counts:', streakCounts);
                setStreakCounts(streakCounts);

            } catch (error) {
                console.error('Error fetching streak counts:', error);
            }
        };

        fetchStreakCounts();
    }, []);
    
    return (
        <ThemedView className="flex-1 p-4">
            <LanguagesList
                onSelectLanguage={handleSelectLanguage}
                streakData={streakCounts}
                streakDisplay={ user?.access_level === 'free' }
            />
        </ThemedView>
    );
};

export default LearningLanguages;
import LanguagesList from '@/components/LanguagesList';
import ThemedView from '@/components/ThemedView';
import useDatabase from '@/db/useDatabase';
import { useUserStore } from '@/hooks/useGetUser';
import useGetWords from '@/hooks/useGetWords';
import { Word } from '@/types/types';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

const LearningLanguages = () => {
    const { setLearningLanguage, getAllStreakCounts } = useDatabase();
    const { user, loading, fetchUser, setActiveWordsStore, filterActiveWordsStore } = useUserStore();
    const { handleLanguageChange } = useGetWords();
    const [langLoading, setLangLoading] = useState(false);
    const [streakCounts, setStreakCounts] = useState<any>([]);
    
    const handleSelectLanguage = async (languageCode: string) => {
        setLangLoading(true);
        const updatedUser = useUserStore.getState().user;
        if(loading || !updatedUser) return;
        try {
            if(updatedUser.learn_lang === languageCode) {
                return router.back();
            }
            if (updatedUser.access_level === 'free') {
                router.back();
                return router.push({
                    pathname: `/(tabs)/settings/changeLangConfirm/${languageCode}-learning`,
                });
            }
            if (updatedUser?.access_level === 'pro') { 
                let newWords: Word[] = [];
                newWords = await handleLanguageChange(
                    updatedUser.words_per_day,
                    updatedUser.learn_lang,
                    updatedUser.native_lang,
                    languageCode,
                    updatedUser.native_lang,
                    updatedUser.lang_changed_date,
                    updatedUser.access_level,
                    updatedUser.difficulty_level,
                    updatedUser.fresh_date || ''
                );

                setActiveWordsStore([]);
                router.back();
                router.replace('/(tabs)/home');
            }
            
        } catch (error) {
            console.error('Error setting learning language:', error);
        } finally {
            setLangLoading(false);
        }
    };

    useEffect(() => {
        const fetchStreakCounts = async () => {
            try {
                const streakCounts = await getAllStreakCounts();
                setStreakCounts(streakCounts);

            } catch (error) {
                console.error('Error fetching streak counts:', error);
            }
        };

        fetchStreakCounts();
    }, []);
    
    return (
        <ThemedView className="flex-1 p-4">
            { langLoading ? (
                <ActivityIndicator size="small" className="flex-1 justify-center items-center bg-background-light dark:bg-background-dark" />
            ) : (
                <LanguagesList
                    onSelectLanguage={handleSelectLanguage}
                    streakData={streakCounts}
                    streakDisplay={ user?.access_level === 'pro' }
                />
            )}
            
        </ThemedView>
    );
};

export default LearningLanguages;
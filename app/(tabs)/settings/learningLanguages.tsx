import LanguagesList from '@/components/LanguagesList';
import ThemedView from '@/components/ThemedView';
import useDatabase from '@/db/useDatabase';
import { useUserStore } from '@/hooks/useGetUser';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

const LearningLanguages = () => {
    const { setLearningLanguage } = useDatabase();
    const { user, loading, fetchUser } = useUserStore();
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
                    pathname: `/(tabs)/settings/changeLangConfirm/${languageCode}`,
                });
            }
            await setLearningLanguage(languageCode);
            fetchUser(db);
            router.back();
        } catch (error) {
            console.error('Error setting learning language:', error);
        }
    };
    
    return (
        <ThemedView className="flex-1 p-4">
            <LanguagesList
                onSelectLanguage={handleSelectLanguage}
            />
        </ThemedView>
    );
};

export default LearningLanguages;
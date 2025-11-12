import LanguagesList from '@/components/LanguagesList';
import ThemedView from '@/components/ThemedView';
import useDatabase from '@/db/useDatabase';
import { useUserStore } from '@/hooks/useGetUser';
import { router } from 'expo-router';

const LearningLanguages = () => {
    const { setLearningLanguage } = useDatabase();
    const { user, loading } = useUserStore();
    
    const handleSelectLanguage = async (languageCode: string) => {
        if(loading || !user) return;
        try {
            if(user.learn_lang === languageCode) {
                return router.back();
            }
            if (user?.access_level === 'free') { 
                return router.push({
                    pathname: `/(tabs)/settings/changeLangConfirm/${languageCode}`,
                    params: { lang: languageCode }
                });
            }
            await setLearningLanguage(languageCode);
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
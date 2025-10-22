import LanguagesList from '@/components/LanguagesList';
import ThemedView from '@/components/ThemedView';
import useDatabase from '@/db/useDatabase';
import { router } from 'expo-router';

const LearningLanguages = () => {
    const { setLearningLanguage } = useDatabase();
    
    const handleSelectLanguage = async (languageCode: string) => {
        try {
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
import LanguagesList from '@/components/LanguagesList';
import ThemedView from '@/components/ThemedView';
import useDatabase from '@/db/useDatabase';
import i18next from '@/services/i18next';
import { router } from 'expo-router';

const NativeLanguages = () => {
    const { setNativeLanguage } = useDatabase();

    const handleSelectLanguage = async (languageCode: string) => {
        try {
            await setNativeLanguage(languageCode);
            i18next.changeLanguage(languageCode);
            router.back();
        } catch (error) {
            console.error('Error setting native language:', error);
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

export default NativeLanguages;
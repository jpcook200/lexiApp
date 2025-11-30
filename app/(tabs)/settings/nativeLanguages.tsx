import LanguagesList from '@/components/LanguagesList';
import ThemedView from '@/components/ThemedView';
import { useUserStore } from '@/hooks/useGetUser';
import useGetWords from '@/hooks/useGetWords';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';

const NativeLanguages = () => {
    const { user, loading, fetchUser, setActiveWordsStore } = useUserStore();
    const [langLoading, setlangLoading] = useState(false);
    const { handleNativeLanguageChange } = useGetWords();

    const handleSelectLanguage = async (languageCode: string) => {
        setlangLoading(true);
        const updatedUser = useUserStore.getState().user;
        if(loading || !updatedUser) return;
        try {
            if (updatedUser.native_lang === languageCode){
                return router.back();
            }
            
            await handleNativeLanguageChange(languageCode);
            setActiveWordsStore([]);
            router.back();
            
        } catch (error) {
            console.error('Error setting learning language:', error);
        } finally {
            setlangLoading(false);
        }
    };
    return (
        <ThemedView className="flex-1 p-4">
            {langLoading ? (
                <ActivityIndicator size="small" className="flex-1 justify-center items-center bg-background-light dark:bg-background-dark" />
            ) : (
                <LanguagesList
                    onSelectLanguage={handleSelectLanguage}
                />
            )}
            
        </ThemedView>
    );
};

export default NativeLanguages;
import BackButton from '@/components/BackButton';
import MainButton from '@/components/MainButton';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import useDatabase from '@/db/useDatabase';
import { useUserStore } from '@/hooks/useGetUser';
import useGetWords from '@/hooks/useGetWords';
import { router, useLocalSearchParams } from 'expo-router';
import { CircleAlert } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Word } from '../../../../types/types';

const changeLangConfirm = () => {
    const { user, setActiveWordsStore } = useUserStore();
    const { t } = useTranslation();
    const { setLearningLanguage, resetProgressByLanguage, setNativeLanguage } = useDatabase();
    const [loading, setLoading] = useState(false);
    const { handleLanguageChange } = useGetWords();
    const params = useLocalSearchParams<{ lang: string }>();
    const lang = params.lang.split('-')[0];
    const type = params.lang.split('-')[1];

    const handleChangeLang = async () => {
        setLoading(true);
        const updatedUser = useUserStore.getState().user;
        if (!updatedUser) return;

        let newWords: Word[] = [];

        try {
            if (type === 'learning') {
                newWords = await handleLanguageChange(
                    updatedUser.words_per_day,
                    updatedUser.learn_lang,
                    updatedUser.native_lang,
                    lang,
                    updatedUser.native_lang,
                    updatedUser.lang_changed_date,
                    updatedUser.access_level,
                    updatedUser.difficulty_level,
                    updatedUser.fresh_date

                );
                
            }

            // Success → update words + redirect
            setActiveWordsStore([]);
            router.back();
            router.replace('/(tabs)/home');
            
        } catch (error) {
            router.back();
            const errorMessage = error instanceof Error && error.message === "lang_change_limit"
                ? t("lang_change_limit")
                : t("could_not_change_language");
            
            return Alert.alert(t("error"), errorMessage);
        }finally {
            setLoading(false);
        }
    };

    
    return (
        <SafeAreaView className='flex-1 bg-background-light dark:bg-background-dark'>
        <ThemedView className="flex-1 gap-4 p-6 justify-between">
            <BackButton/>
                {loading ? (
                    <ActivityIndicator size="small" className="flex-1 justify-center items-center" />
                ) : (
                        <>
                            <View>
                                <View className="items-center justify-center mt-20 mb-10">
                                    <CircleAlert size={64} color="#1c95ff" />
                                    <ThemedText className='text-center mt-8 mb-6'>{t("warning_title") }</ThemedText>
                                    <ThemedText className='text-center'>{ t("warning_body") }</ThemedText>
                                </View>
                            </View>
                            <View className='py-12 gap-4'>
                                <MainButton
                                    text={t("confirm")}
                                    onPress={() => {
                                        handleChangeLang();
                                    }}
                                />
                                <TouchableOpacity>
                                    <ThemedText
                                        className="text-center text-primary mt-4"
                                        onPress={() => {
                                            router.back();
                                            router.push('../../../(onboarding)/Subscribe');
                                        }}
                                    >
                                        { t("premium_prompt") }
                                    </ThemedText>
                                </TouchableOpacity>
                                </View>
                            </>
                        
            )}
                
            </ThemedView>
            </SafeAreaView>
    )
}

export default changeLangConfirm
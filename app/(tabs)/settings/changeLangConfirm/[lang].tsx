import MainButton from '@/components/MainButton';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import useDatabase from '@/db/useDatabase';
import { useUserStore } from '@/hooks/useGetUser';
import i18next from '@/services/i18next';
import { router, useLocalSearchParams } from 'expo-router';
import { CircleAlert } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

const changeLangConfirm = () => {
    const { user } = useUserStore();
    const { t } = useTranslation();
    const { setLearningLanguage, resetProgressByLanguagePair, setNativeLanguage } = useDatabase();
    const params = useLocalSearchParams<{ lang: string }>();
    const lang = params.lang.split('-')[0];
    const type = params.lang.split('-')[1];

    const handleChangeLang = async() => {
        if (!user) return;
        router.back();
        router.replace('/(tabs)/home');
        if (type === 'learning') { 
            await setLearningLanguage(lang);
            await resetProgressByLanguagePair(user.native_lang, user.learn_lang);
        }
        else if (type === 'native') {
            await setNativeLanguage(lang);
            i18next.changeLanguage(lang);
            await resetProgressByLanguagePair(user.native_lang, user.learn_lang);
        }
    }
    
    return (
        <ThemedView className="flex-1 gap-4 p-6 justify-between">
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
        </ThemedView>
    )
}

export default changeLangConfirm
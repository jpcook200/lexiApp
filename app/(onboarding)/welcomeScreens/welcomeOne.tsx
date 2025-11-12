import MainButton from '@/components/MainButton';
import ThemedText from '@/components/ThemedText';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const WelcomeOne = () => {
    const { t } = useTranslation();
    
    return (
        <SafeAreaView className="flex-1 items-center bg-item-light dark:bg-item-dark p-6">
            <View className='absolute -top-10 -left-60 h-[100%] aspect-[1/1] rounded-br-full bg-background-light dark:bg-background-dark '></View>
            <View className='w-full flex-1'>
                <Image
                    className='w-full h-full object-contain'
                    source={require('@/assets/images/welcomeOne.png')}
                    alt="Welcome Illustration"
                />
            </View>
            <View className=' w-full justify-end py-8'>
                <View className='gap-4'>
                    <ThemedText className='text-5xl font-bold'>{t("welcome_to")}</ThemedText>
                    <ThemedText className='text-4xl font-black'>Lexigram</ThemedText>
                    <ThemedText variant='subtext' className='text-lg'>{t("welcome_desc")}</ThemedText>
                </View>
            </View>
            <MainButton
                text={ t("get_started") }
                onPress={() => router.push('./welcomeTwo')}
                next
                accessibilityLabel="Get Started with Lexigram"
                accessibilityHint="Navigates to the next welcome screen"
            />
        </SafeAreaView>
    );
};

export default WelcomeOne;


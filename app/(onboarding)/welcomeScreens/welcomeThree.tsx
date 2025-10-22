import BackButton from '@/components/BackButton';
import MainButton from '@/components/MainButton';
import Streak from '@/components/Streak';
import ThemedText from '@/components/ThemedText';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const WelcomeThree = () => {
    const { t } = useTranslation();
    return (
        <SafeAreaView className="flex-1 items-center bg-item-light dark:bg-item-dark p-6">
            <View className='absolute -top-10 -left-60 h-[100%] aspect-[1/1] rounded-br-full bg-background-light dark:bg-background-dark '></View>

            <BackButton />
  
            <View className='flex-1 justify-center items-center w-full'>
                <View className='w-5/6 relative'>
                        <Streak />
                        <View className='w-14 h-14 bg-primary mb-2 rounded-full flex justify-center items-center absolute -top-2 -right-2'>
                            <Image
                                source={require('@/assets/images/fire.png')}
                                className='w-3/4 h-3/4'
                            />
                        </View>
                    </View>
                
            </View>
            
            <View className=' w-full justify-end py-8'>
                <View className='gap-4'>
                    <ThemedText className='text-4xl font-bold'>{ t("simple_effective") }</ThemedText>
                    <ThemedText variant='subtext' className='text-lg'>{t("simple_effective_desc")}</ThemedText>
                </View>
            </View>
            <MainButton
                text={ t("next") }
                onPress={() => router.push('/(onboarding)/ChooseLanguage')}
                next
            />
        </SafeAreaView>
    )
}

export default WelcomeThree


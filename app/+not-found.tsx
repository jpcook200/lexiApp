import MainButton from '@/components/MainButton';
import ThemedText from '@/components/ThemedText';
import { router } from 'expo-router';
import { CircleSlash2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <SafeAreaView className='flex-1 p-4'>
      <View className='flex-1 justify-center items-center'>
        <CircleSlash2 size={64} color='#888888' />
        <ThemedText className='mt-6'>{t("not_found")}</ThemedText>
      </View>
      
      <MainButton
        text={t("back")}
        className='mt-auto'
        onPress={() => {
          router.back()
        }}
      />
    </SafeAreaView>
  )
}

export default NotFound
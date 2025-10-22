import ThemedIcon from '@/components/ThemedIcon'
import ThemedText from '@/components/ThemedText'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'

const BackButton = () => {
    const { t } = useTranslation();
    return (
        <TouchableOpacity onPress={() => router.back()} className='flex-row items-center self-start rounded-full border border-border-light dark:border-border-dark bg-item-light dark:bg-item-dark pl-3 pr-4 py-1'>
            <ThemedIcon name='ArrowLeft' size={ 20 } />
            <ThemedText className='text-lg ml-2 font-bold'>{t("back")}</ThemedText>
        </TouchableOpacity>
    )
}

export default BackButton
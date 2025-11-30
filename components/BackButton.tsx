import ThemedIcon from '@/components/ThemedIcon'
import ThemedText from '@/components/ThemedText'
import { router } from 'expo-router'
import { useColorScheme } from 'nativewind'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'

const BackButton = ({ white }: {white?: boolean}) => {
    const { t } = useTranslation();
    const { colorScheme } = useColorScheme();
    return (
        <TouchableOpacity style={{ boxShadow: `inset -3px -3px 0 0 ${colorScheme === 'dark' ? '#0000002c' : '#b7b7b727'}` }} accessibilityLabel='Navigate Back' onPress={() => router.back()} className={`flex-row items-center self-start rounded-full border border-border-light dark:border-border-dark ${white ? "bg-background-light dark:bg-background-dark" : "bg-item-light dark:bg-item-dark"} pl-3 pr-4 h-9`}>
            <ThemedIcon name='ArrowLeft' size={ 20 } />
            <ThemedText className='text-lg ml-2 font-bold'>{t("back")}</ThemedText>
        </TouchableOpacity>
    )
}

export default BackButton
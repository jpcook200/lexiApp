import { getLanguageFlag } from '@/utilities/helpers';
import { Text, View } from 'react-native';


const LanguageIndicator = ({ language }: {language: string}) => {
    
    return (
        <View className='border-2 border-border-light dark:border-border-dark rounded-full w-14 h-14 flex justify-center items-center relative bg-shade-light dark:bg-shade-dark'>
            <View className='bg-item-light dark:bg-item-dark absolute w-[90%] h-[90%] top-0 left-0 rounded-full'></View>
            <Text className='text-3xl '>{getLanguageFlag(language)}</Text>
        </View>
    )
}

export default LanguageIndicator
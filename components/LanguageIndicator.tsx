import { getLanguageFlag } from '@/utilities/helpers';
import { Text } from 'react-native';
import ThemedView from './ThemedView';


const LanguageIndicator = ({ language }: {language: string}) => {
    
    return (
        <ThemedView variant="shaded" className='border border-border-light dark:border-border-dark rounded-full w-12 h-12 flex justify-center items-center '>
            <Text className='text-2xl '>{getLanguageFlag(language)}</Text>
        </ThemedView>
    )
}

export default LanguageIndicator
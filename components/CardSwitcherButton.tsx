import { getLanguageFlag } from '@/utilities/helpers';
import { useSQLiteContext } from 'expo-sqlite';
import { Dispatch, SetStateAction } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ThemedIcon from './ThemedIcon';
import ThemedView from './ThemedView';

const CardSwitcherButton = ({ nativeLang, learnLang, setSwitchCardFaceState, switchFaceState}: { nativeLang: string, learnLang: string, setSwitchCardFaceState: Dispatch<SetStateAction<boolean>>, switchFaceState: boolean}) => {
    const db = useSQLiteContext();

    const switchFace = async () => {
        setSwitchCardFaceState(prev => !prev);
    };

    return (
        <TouchableOpacity className='h-10 justify-center items-center' onPress={switchFace} accessibilityLabel='Switch the front of the word card'>
            <ThemedView variant='shaded' className='border border-border-light dark:border-border-dark rounded-full w-full h-full flex-1 justify-center items-center'>
                <View className='flex-row items-center justify-center gap-1 px-2'>
                    {switchFaceState ? (
                        <>
                            <Text className='text-2xl'>{getLanguageFlag(nativeLang)}</Text>
                            <ThemedIcon name='RefreshCcw' size={14}/>
                            <Text className='text-2xl'>{getLanguageFlag(learnLang)}</Text>
                        </>
                    ) : (
                        <>
                            <Text className='text-2xl'>{getLanguageFlag(learnLang)}</Text>
                            <ThemedIcon name='RefreshCcw' size={14} strokeWidth={3}/>
                            <Text className='text-2xl'>{getLanguageFlag(nativeLang)}</Text>
                        </>
                    )}
                </View>
            </ThemedView>
        </TouchableOpacity>
    )
}

export default CardSwitcherButton
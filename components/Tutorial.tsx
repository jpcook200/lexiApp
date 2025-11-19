import useDatabase from '@/db/useDatabase';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import GestureIndicator from './GestureIndicator';
import MainButton from './MainButton';
import ThemedText from './ThemedText';

const Tutorial = ({ setShowTutorial }: {setShowTutorial: Dispatch<SetStateAction<boolean>>}) => {
    const [page, setPage] = useState(0);
    const { t } = useTranslation();
    const { setTutorialCompleted } = useDatabase();

    const handleFinish = async () => {
        setShowTutorial(false);
        await setTutorialCompleted();
    }
    return (
        <View className='w-full h-full absolute bg-item-light/80 dark:bg-item-dark/80 z-10'>
            {page === 0 && (
                <View className='w-full h-full px-4'>
                    <View className='h-[80%] flex justify-center items-center'>
                        <GestureIndicator
                            type='swipeLR'
                            color='#1c95ffff'
                        />
                        <ThemedText className='text-3xl font-bold text-center mb-4 mt-8'>{ t("swipe_left_right") }</ThemedText>
                        <ThemedText className='text-xl text-center font-bold text-gray-600'>{t("to_navigate")}</ThemedText>
                    </View>
                    
                    <MainButton
                        text='Next'
                        onPress={() => setPage(1)}
                        className='self-end'
                        accessibilityLabel='Next Page'
                    />
                </View>
            )}
            {page === 1 && (
                <View className='w-full h-full flex justify-center items-center p-4'>
                    <View className='h-[80%] flex justify-center items-center'>
                        <GestureIndicator
                            type='tap'
                            color='#1c95ffff'
                        />
                        <ThemedText className='text-3xl font-bold text-center mb-4 mt-8'>{t("tap_on_word")}</ThemedText>
                        <ThemedText className='text-xl text-center font-bold text-gray-600'>{ t("to_see_translation") }</ThemedText>
                    </View>
                    <MainButton
                        text='Next'
                        onPress={() => setPage(2)}
                        accessibilityLabel='Next Page'
                    />
                </View>
            )}
            {page === 2 && (
                <View className='w-full h-full flex justify-center items-center p-4'>
                    <View className='h-[80%] flex justify-center items-center'>
                        <GestureIndicator
                            type='swipeUp'
                            color='#1c95ffff'
                        />
                        <ThemedText className='text-3xl font-bold text-center mb-4 mt-8'>{ t("mark_words") }</ThemedText>
                        <ThemedText className='text-xl text-center font-bold mb-4'>{ t("swiping_up") }</ThemedText>
                        <ThemedText className='text-center font-medium text-lg text-gray-600'>{t("swipe_up_info")}</ThemedText>
                    </View>
                        <MainButton
                        text='Next'
                        onPress={() => handleFinish()}
                        accessibilityLabel='Close Tutorial'
                    />
                </View>
            )}
        </View>
    )
}

export default Tutorial
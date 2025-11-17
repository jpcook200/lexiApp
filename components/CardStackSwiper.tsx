import { User } from '@/types/types';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Word } from '../types/types';
import CardStackCard from './CardStackCard';
import ThemedIcon from './ThemedIcon';
import ThemedText from './ThemedText';

type CardStackSwiperProps = {
    activeWords?: Word[]
    setActiveWords?: React.Dispatch<React.SetStateAction<Word[]>>;
    updateProgress?: () => void;
    progress?: number;
    practice?: boolean;
    user: User;
    setCurrentStreak: React.Dispatch<React.SetStateAction<number>>;
};

const CardStackSwiper = ({ activeWords, setActiveWords, updateProgress, progress, practice, user, setCurrentStreak}: CardStackSwiperProps) => {
    const activeIndex = useSharedValue(0);
    const [indexState, setIndexState] = useState(0);
    const { t } = useTranslation();

    useEffect(() => {
        scheduleOnRN(() => {
            activeIndex.value = 0;
        });
    }, [activeWords]);  

    return (
        <GestureHandlerRootView className="w-full h-full px-6 flex justify-center items-center mb-8 mt-14">
            {(user?.words_per_day && progress) && progress >= user?.words_per_day ? (
                <View className="w-3/4 h-full flex justify-center items-center">
                    <ThemedIcon name="Rocket" size={32} />
                    <ThemedText className="font-bold text-center my-3">{t("goal_reached")}</ThemedText>
                    <TouchableOpacity accessibilityLabel='Go to Practice Words' style={{ boxShadow: '0 4px 0 #2889e3ff' }} onPress={() => router.push('/(tabs)/home/practice')} className="bg-primary p-4 rounded-lg mt-4 w-full flex-row justify-center items-center">
                        <Text className="font-bold text-text-dark">{t("practice")}</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View className="w-full h-full">
                    {Array.isArray(activeWords) &&
                        activeWords.slice(0, 4).map((word, index) => (
                            <CardStackCard
                                key={`${word.id}-${index}`}
                                index={index}
                                indexState={indexState}
                                activeIndex={activeIndex}
                                word={word}
                                setActiveWords={setActiveWords}
                                activeWords={activeWords}
                                updateProgress={updateProgress}
                                practice={practice}
                                numOfCards={activeWords?.length}
                                user={user!}
                                progress={progress}
                                setCurrentStreak={setCurrentStreak}
                            />
                        ))}
                </View>
            )}        
        </GestureHandlerRootView>
    )
}

export default CardStackSwiper
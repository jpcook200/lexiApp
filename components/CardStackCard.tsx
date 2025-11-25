import useDatabase from '@/db/useDatabase';
import { useUserStore } from '@/hooks/useGetUser';
import { User, Word } from '@/types/types';
import { useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { Dimensions, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { interpolate, SharedValue, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import WordCard from './WordCard';

type CardStackCardProps = {
    user: User;
    index: number;
    numOfCards?: number;
    activeIndex: SharedValue<number>;
    word: any;
    indexState: number;
    setActiveWords?: React.Dispatch<React.SetStateAction<Word[]>>;
    activeWords?: Word[];
    updateProgress?: () => void;
    practice?: boolean;
    progress?: number;
    setCurrentStreak: React.Dispatch<React.SetStateAction<boolean>>;
    lastWordLearned: Word | null;
    setlastWordLearned: React.Dispatch<React.SetStateAction<Word | null>>;
    switchFace: boolean;
};

const CardStackCard = ({ user, index, numOfCards, activeIndex, word, setActiveWords, activeWords = [], updateProgress, practice = false, progress, setCurrentStreak, lastWordLearned, setlastWordLearned, switchFace}: CardStackCardProps) => {
    const { t } = useTranslation();
    const player = useAudioPlayer(require("@/assets/sounds/cardswipe.mp3"));
    const learnedPlayer = useAudioPlayer(require("@/assets/sounds/learned.mp3"));
    const { setSelectedWordId } = useUserStore();
    const { toggleLearned, insertIntoLearnedWords, updateStreakCount, updateStreakRecord} = useDatabase();
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const translationX = useSharedValue(0);
    const translationY = useSharedValue(0);

    const handleSwipeUp = async () => {
        if (!word || !user || !setActiveWords || !updateProgress || practice || progress === undefined) return;
        try {
            await insertIntoLearnedWords(word);
            await toggleLearned(word.word_id)
            updateProgress();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setlastWordLearned(word);
            setActiveWords((prev: Word[]) => (Array.isArray(prev) ? prev.filter(w => w.id !== word.id) : []));
            
            if (activeWords.length <= 1) {
                await updateStreakCount("increment");
                const newValue = await updateStreakRecord(1);
                setCurrentStreak(newValue);
            }
        } catch (error) {
            console.error('Error marking word as learned:', error);
        }
    }
    
    const loopCards = (index: number) => {
        if (!setActiveWords) return;
        setSelectedWordId(activeWords[index + 1].word_id)
        setTimeout(() => {
            setActiveWords((prev: Word[]) => {
                const currentActive = prev || [];
                if (index < 0 || index >= currentActive.length) return prev;

                const swipedCard = currentActive[index];
                const remaining = [
                    ...currentActive.slice(0, index),
                    ...currentActive.slice(index + 1)
                ];
                const updated = [...remaining, swipedCard];
                return updated ;
            });
        }, 150);
    };

    const playSwipe = () => { 
        if(user.muted === 1) return;
        player.play()
    }

    const gesture = Gesture.Pan()
        .onChange((event) => {
            translationX.value = event.translationX;
            translationY.value = event.translationY;
            activeIndex.value = interpolate(
                Math.abs(translationX.value),
                [0, 500],
                [index, index + 1]
            );

        })
        .onEnd((event) => {
            if (Math.abs(event.velocityX) > 400 && activeWords.length > 1) {
                translationX.value = withSpring(
                    Math.sign(event.velocityX) * (screenWidth * 1.5),
                    { velocity: event.velocityX },
                );
                scheduleOnRN(playSwipe);
                scheduleOnRN(loopCards, index);
                activeIndex.value = withSpring(index + 1);
            } else if (event.velocityY < -300) {
                translationY.value = withSpring(
                    Math.sign(event.velocityY) * (screenHeight * 1.5),
                    { velocity: event.velocityY },
                );
                scheduleOnRN(handleSwipeUp);
                activeIndex.value = withSpring(index + 1);
            } else {
                translationY.value = withSpring(0);
                translationX.value = withSpring(0);
            }

        });

    
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            activeIndex.value,
            [index - 3, index - 2, index - 1, index, index + 1],
            [0, 0.4, 1, 1, 1],
            'clamp'
        ),
        transform: [
            {
                scale: interpolate(
                    activeIndex.value,
                    [index - 1, index,
                    index + 1],
                    [0.95, 1, 1]
                )
            },
            {
                translateY: interpolate(
                    activeIndex.value,
                    [index - 1, index, index + 1],
                    [-22, 0, 0]
                )
            },
            {
                translateX: activeWords.length > 1 ? translationX.value : 0
            },
            {
                translateY: practice === true ? 0 : translationY.value
            },
            {
                rotateZ: activeWords.length > 1 ? `${interpolate(translationX.value,
                    [-screenWidth / 1.5, 0, screenWidth / 1.5],
                    [-15, 0, 30])}deg` : '0deg'
            }
            
        ],
    }));

    const learnedAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            translationY.value,
            [0, -screenHeight / 8],
            [0, 1],
            'clamp'
        ),
    }));

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View
                style={[animatedStyle, {position: 'absolute', zIndex: numOfCards && numOfCards - index}]}
                className='h-full w-full absolute'
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`${word?.text ?? 'Word'} card`}
                accessibilityHint="Swipe left or right to navigate, swipe up to mark as learned"
            >
                <WordCard
                    word={word}
                    setActiveWords={setActiveWords}
                    practice={practice}
                    user={user}
                    switchFace={switchFace}
                />
                {!practice &&
                    <Animated.View style={[learnedAnimatedStyle]} className='absolute bottom-10 left-[50%] -translate-x-[50%] bg-green-400 rounded-md flex justify-center items-center overflow-hidden p-2 shadow-sm'>
                        <Text className='text-white font-black text-md uppercase'>{ t("learned") }</Text>
                    </Animated.View>
                }
            </Animated.View>
        </GestureDetector>
    )
}

export default CardStackCard
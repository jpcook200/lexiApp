import { textToSpeech } from '@/api/textToSpeech';
import useDatabase from '@/db/useDatabase';
import { User, Word } from '@/types/types';
import { Heart, Mars, Venus } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import ThemedIcon from './ThemedIcon';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';

type WordCardProps = {
    word: any;
    setActiveWords?: React.Dispatch<React.SetStateAction<Word[]>>;
    displayOnly?: boolean;
    practice?: boolean;
    user?: User;
};


export default function WordCard({ word, setActiveWords, displayOnly, practice, user }: WordCardProps) {
    const { t } = useTranslation();
    const { toggleFavourite } = useDatabase();
    const [ttsDisabled, setTtsDisabled] = useState(false);
    const { colorScheme } = useColorScheme();
    const cardClass = 'overflow-hidden rounded-2xl shadow-sm flex-1 border border-border-light dark:border-border-dark';
    const [isFlipped, setIsFlipped] = useState(false);
    const flipAnimation = useRef(new Animated.Value(0)).current

    const frontInterpolate = flipAnimation.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });

    const flipToFrontStyle = {
        transform: [{rotateY: frontInterpolate}]
    };

    const backInterpolate = flipAnimation.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });

    const flipToBackStyle = {
        transform: [{rotateY: backInterpolate}]
    };

    const flipCard = () => {
        if(isFlipped) {
            Animated.spring(flipAnimation, {
                toValue: 0,
                friction: 8,
                tension: 10,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.spring(flipAnimation, {
                toValue: 180,
                friction: 8,
                tension: 10,
                useNativeDriver: true,
            }).start();
        }
        setIsFlipped(!isFlipped);
    };

    const handleFavourite = async () => {
        if (!word || !setActiveWords) return;
        setActiveWords((prev: Word[]) => prev!.map(w => {
            if (w.id === word.id) {
                return {
                    ...w,
                    favourite: w.favourite === 1 ? 0 : 1
                };
            }
            return w;
            })
        );

        if (practice) {
            toggleFavourite(word.id, word.favourite === false ? 1 : 0); // update database
        }
    };

    const handleTextToSpeech = async (text: string, lang: string) => {
        if (ttsDisabled || !user) return;
        try {
            setTtsDisabled(true);
            await textToSpeech(text, lang);
        } catch (error) {
            alert('Error with text to speech. Please try again.');
        } finally {
            setTimeout(() => setTtsDisabled(false), 1000);
        }   
    }

    return (
        <View className='w-full h-full'>
            <TouchableWithoutFeedback accessibilityLabel='Flip Card' onPress={flipCard}>
                <View className='w-full h-full'>
                    <Animated.View style={[styles.card, flipToFrontStyle]} className='flex-1'>
                        <ThemedView variant='shaded' className={cardClass}>
                            <View className='p-8 flex-1'>
                                <View className='gap-4 flex-1'>
                                    <View className='w-full flex-row justify-end'>
                                        <TouchableOpacity accessibilityLabel='Text to Speech for Word' onPress={user ? (() => handleTextToSpeech(word?.learning_word, user.learn_lang)) : () => {}} disabled={displayOnly || ttsDisabled} className={`${ttsDisabled ? 'opacity-50' : ''}`}>
                                            <ThemedIcon name={ ttsDisabled ? 'VolumeOff' : 'Volume2' } size={28} />
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <ThemedText variant='primary' className='text-5xl font-bold'>
                                            { word?.learning_word }
                                        </ThemedText>
                                    </View>
                                    <View className='bg-primary w-auto px-5 py-1 rounded-full self-start'>
                                        <ThemedText className='font-bold capitalize text-white'>{ word?.part_of_speech }</ThemedText>
                                    </View>
                                </View>
                                <View className="flex-row justify-end">
                                    <TouchableOpacity accessibilityLabel='Toggle Favourite Word' disabled={ displayOnly } onPress={ () => handleFavourite() }>
                                        <Heart size={ 28 } color={word?.favourite === true || word?.favourite === 1 ? '#fc69b4' : colorScheme === 'dark' ? '#ffffff' : '#000000' } />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                        </ThemedView>
                    </Animated.View>
                    <Animated.View pointerEvents={isFlipped ? 'auto' : 'none'} style={[styles.card, StyleSheet.absoluteFill, flipToBackStyle]} className='flex-1'>
                        <ThemedView variant='shaded' className={cardClass}>
                            <View className='p-8 flex-1'>
                                <View className='gap-4 flex-1'>
                                    <View className='w-full flex-row justify-between'>
                                        <View>
                                            { (word?.learning_gender && word?.learning_gender !== 'n') && word?.learning_gender === 'm' ?
                                                <Mars size={ 28 } color='#1c95ffff' />
                                                    : word?.learning_gender === 'f' ?
                                                <Venus size={ 28 } color='#1c95ffff'/>
                                                : null
                                        }
                                        </View>
                                        <TouchableOpacity accessibilityLabel='Text to Speech for Example Sentence' onPress={() => handleTextToSpeech(word?.learning_sentence, user?.learn_lang || 'en')} disabled={displayOnly || ttsDisabled} className={`${ttsDisabled ? 'opacity-50' : ''}`}>
                                            <ThemedIcon name={ ttsDisabled ? 'VolumeOff' : 'Volume2' } size={28}/>
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <View>
                                            <ThemedText variant='primary' className='text-5xl font-bold'>{ word?.native_word }</ThemedText>
                                        </View>
                                        <ThemedText variant='subtext' className='text-lg'>{ word?.native_definition }</ThemedText>
                                    </View>
                                    <View>
                                        <ThemedText className='text-lg font-bold'>{ t("example") }</ThemedText>
                                        <ThemedText variant='subtext' className='text-lg italic'>{ word?.learning_sentence }</ThemedText>
                                    </View>
                                </View>
                                <View className="flex-row justify-end">
                                    <TouchableOpacity accessibilityLabel='Toggle Favourite word' disabled={ displayOnly } onPress={ () => handleFavourite() }>
                                        <Heart size={ 28 } color={word?.favourite === true || word?.favourite === 1 ? '#fc69b4' : colorScheme === 'dark' ? '#ffffff' : '#000000' } />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ThemedView>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
  card: {
        backfaceVisibility: 'hidden',
  }
});
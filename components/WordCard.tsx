import { useTextToSpeech } from '@/api/textToSpeech';
import useDatabase from '@/db/useDatabase';
import { useUserStore } from '@/hooks/useGetUser';
import { User } from '@/types/types';
import { formatSentenceByLanguage, trimEdgeChars } from '@/utilities/helpers';
import { Heart, Mars, Venus } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import ThemedIcon from './ThemedIcon';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';

type WordCardProps = {
    word: any;
    displayOnly?: boolean;
    practice?: boolean;
    user?: User;
    switchFace: boolean;
    cardsMoving: boolean;
    setActiveWords?: React.Dispatch<React.SetStateAction<any[]>>;
};


export default function WordCard({ word, displayOnly, practice, user, switchFace, setActiveWords }: WordCardProps) {
    const { t } = useTranslation();
    const { toggleFavourite } = useDatabase();
    const [ttsDisabled, setTtsDisabled] = useState(false);
    const { colorScheme } = useColorScheme();
    const cardClass = 'overflow-hidden rounded-2xl shadow-sm flex-1 border border-border-light dark:border-border-dark';
    const [isFlipped, setIsFlipped] = useState(switchFace);
    const flipAnimation = useRef(new Animated.Value(switchFace ? 180 : 0)).current
    const { tts, } = useTextToSpeech();
    const [showTranslation, setShowTranslation] = useState(false);
    const { toggleFavouriteStore } = useUserStore();

    useEffect(() => {
        setIsFlipped(switchFace);

        Animated.spring(flipAnimation, {
            toValue: switchFace ? 180 : 0,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start();
    }, [switchFace]);

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
        if (!word) return;
        if (practice && setActiveWords) {
            console.log(word.favourite)
            toggleFavourite(word.id, word.favourite);
            setActiveWords((prevWords) =>
                prevWords.map((w) =>
                    w.id === word.id
                        ? { ...w, favourite: word.favourite ? 0 : 1 } // flip favourite
                        : w
                )
            );
        } else { 
            toggleFavouriteStore(word.id);
        }
    };

    const handleTextToSpeech = async (text: string, lang: string) => {
        if (ttsDisabled || !user) return;
        try {
            setTtsDisabled(true);
            await tts(text, lang);
        } catch (error) {
            alert('Error with text to speech. Please try again.');
        } finally {
            setTimeout(() => setTtsDisabled(false), 1500);
        }   
    }

    return (
        <View className='w-full h-full'>
            <TouchableWithoutFeedback accessibilityLabel='Flip Card' onPress={flipCard}>
                <View className='w-full h-full'>
                    <Animated.View style={[styles.card, flipToFrontStyle]} className='flex-1'>
                        <ThemedView variant='shaded' className={cardClass} style={{boxShadow: '0 3px 5px rgba(0,0,0,0.2)' }}>
                            <View className='p-8 sm:p-4 flex-1'>
                                <View className=' flex-1'>
                                    <View className='w-full flex-row justify-end'>
                                        <TouchableOpacity accessibilityLabel='Text to Speech for Word' onPress={user ? (() => handleTextToSpeech(word?.learning_word, user.learn_lang)) : () => {}} disabled={displayOnly || ttsDisabled} className={`p-2 ${ttsDisabled ? 'opacity-50' : ''}`}>
                                            <ThemedIcon name={ ttsDisabled ? 'VolumeOff' : 'Volume2' } size={24} />
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <ThemedText variant='primary' className='text-5xl sm:text-4xl font-bold'>
                                            { (word?.learning_word).toLowerCase() }
                                        </ThemedText>
                                        <ThemedText variant='subtext' className='text-xl'>{ trimEdgeChars(word?.learning_pronunciation) }</ThemedText>
                                    </View>
                                    <View className='bg-primary w-auto px-5 py-1 rounded-full self-start mt-3'>
                                        <ThemedText className='font-bold capitalize text-white'>{ t(word?.part_of_speech) }</ThemedText>
                                    </View>
                                    
                                </View>
                                <View className="flex-row justify-between items-center">
                                    <View className='w-10 h-10 sm:w-8 sm:h-8 bg-primaryDark rounded-full flex justify-center items-center relative overflow-hidden'>
                                        <View className='absolute bg-primary w-[92%] h-[92%] left-0 top-0 rounded-full'></View>
                                        <Text className='text-white font-black capitalize sm:text-sm'>{ word?.learning_difficulty }</Text>
                                    </View>
                                    <TouchableOpacity accessibilityLabel='Toggle Favourite Word' disabled={ displayOnly } onPress={ () => handleFavourite() }>
                                        <Heart size={ 24 } color={word?.favourite === true || word?.favourite === 1 ? '#fc69b4' : colorScheme === 'dark' ? '#ffffff' : '#000000' } pointerEvents='none' />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                        </ThemedView>
                    </Animated.View>
                    <Animated.View pointerEvents={isFlipped ? 'auto' : 'none'} style={[styles.card, StyleSheet.absoluteFill, flipToBackStyle]} className='flex-1'>
                        <ThemedView variant='shaded' className={cardClass}>
                            <View className='p-8 sm:p-4 flex-1'>
                                <View className='gap-4 flex-1'>
                                    <View className='w-full flex-row justify-between items-center'>
                                        <View>
                                            { (word?.learning_gender && word?.learning_gender !== 'n') && word?.learning_gender === 'm' ?
                                                <Mars size={ 24 } color='#1c95ffff' />
                                                    : word?.learning_gender === 'f' ?
                                                <Venus size={ 24 } color='#1c95ffff'/>
                                                : null
                                        }
                                        </View>
                                        <TouchableOpacity accessibilityLabel='Text to Speech for Example Sentence' onPress={() => handleTextToSpeech(word?.learning_sentence, word?.learn_lang || 'en')} disabled={displayOnly || ttsDisabled} className={`p-2 ${ttsDisabled ? 'opacity-50' : ''}`}>
                                            <ThemedIcon name={ ttsDisabled ? 'VolumeOff' : 'Volume2' } size={24}/>
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <View>
                                            <ThemedText variant='primary' className='text-5xl mb-1 font-bold sm:text-4xl'>{ (word?.native_word).toLowerCase() }</ThemedText>
                                        </View>
                                        <ThemedText variant='subtext' className='text-lg'>{ formatSentenceByLanguage(word?.native_definition, word?.native_lang) }</ThemedText>
                                    </View>
                                    <View>
                                        <View className='flex-row items-center justify-between'>
                                            <ThemedText className='text-lg font-bold'>{t("example")}</ThemedText>
                                            <TouchableOpacity className='p-2' accessibilityLabel='Toggle Translation' onPress={() => setShowTranslation(!showTranslation)}>
                                                <ThemedIcon name="Repeat" size={17} className=''/>
                                            </TouchableOpacity>
                                        </View>
                                        
                                        {showTranslation ? (<ThemedText variant='subtext' className='text-lg italic'>{formatSentenceByLanguage(word?.native_sentence, word?.native_lang)}</ThemedText>)
                                            :
                                            (<ThemedText variant='subtext' className='text-lg italic'>{formatSentenceByLanguage(word?.learning_sentence, word?.learn_lang)}</ThemedText>
                                        )}
                                        
                                    </View>
                                </View>
                                <View className="flex-row items-center justify-between">
                                    <View className='w-10 h-10 sm:w-8 sm:h-8 bg-primaryDark rounded-full flex justify-center items-center relative overflow-hidden'>
                                        <View className='absolute bg-primary w-[92%] h-[92%] left-0 top-0 rounded-full'></View>
                                        <Text className='text-white font-black capitalize sm:text-sm'>{ word?.learning_difficulty }</Text>
                                    </View>
                                    <TouchableOpacity accessibilityLabel='Toggle Favourite word' disabled={ displayOnly } onPress={ () => handleFavourite() }>
                                        <Heart size={ 24 } color={word?.favourite === true || word?.favourite === 1 ? '#fc69b4' : colorScheme === 'dark' ? '#ffffff' : '#000000' } pointerEvents='none' />
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
import BackButton from '@/components/BackButton';
import MainButton from '@/components/MainButton';
import ThemedText from '@/components/ThemedText';
import WordCard from '@/components/WordCard';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const WelcomeTwo = () => {
    const { t } = useTranslation();
    const cardWidth = 280;
    const cardData = [
        {
            id: 1,
            native_word: 'hello',
            learning_word: 'bonjour',
            learning_pronunciation: 'bɔ̃.ʒuʁ',
            native_pronunciation: 'həˈloʊ',
            part_of_speech: 'interjection',
            native_definition: 'used as a greeting or to begin a conversation.',
            learning_definition: 'utilisé comme salutation ou pour commencer une conversation.',
            learning_difficulty: 'a1',
            learning_sentence: 'Bonjour! Comment ça va?',
            learning_gender: 'n',
        },
        {
            id: 2,
            native_word: 'thank you',
            learning_word: 'gracias',
            learning_pronunciation: 'ˈɡɾa.sjas',
            native_pronunciation: 'θæŋk juː',
            part_of_speech: 'interjection',
            native_definition: 'an expression of gratitude.',
            learning_definition: 'expresión de gratitud.',
            learning_difficulty: 'a1',
            learning_sentence: 'Gracias por tu ayuda.',
            learning_gender: 'n',
        },
        {
            id: 3,
            native_word: 'goodbye',
            learning_word: 'さようなら',
            learning_pronunciation: 'sa.yoː.na.ra',
            native_pronunciation: 'ɡʊdˈbaɪ',
            part_of_speech: 'expression',
            native_definition: 'used to express good wishes when parting.',
            learning_definition: '別れのあいさつとして使われる表現。',
            learning_difficulty: 'a2',
            learning_sentence: 'さようなら、また明日。',
            learning_gender: 'n',
        },
    ];

    const middleIndex = Math.floor(cardData.length / 2);

    return (
        <SafeAreaView className="flex-1 items-center bg-item-light dark:bg-item-dark p-6">
            <View className='absolute -top-10 -left-60 h-[100%] aspect-[1/1] rounded-br-full bg-background-light dark:bg-background-dark '></View>

            <BackButton />
  
            <View className='flex-1 justify-center items-center w-full'>
                <View style={{ width: cardWidth, height: 420, position: 'relative' }}>
                    {cardData.map((word, index) => {
                        const verticalOffset = index * 10;
                        const rotation = (index - middleIndex) * 5;
                        const horizontalOffset = (index - middleIndex) * 50; // adjust spread here

                        return (
                            <View
                                key={word.id}
                                style={{
                                    position: 'absolute',
                                    top: verticalOffset,
                                    left: horizontalOffset, // relative to container
                                    transform: [{ rotate: `${rotation}deg` }, { scale: 0.7 }],
                                    width: cardWidth,
                                    height: '100%',
                                }}
                            >
                                <WordCard
                                    word={word}
                                    displayOnly={ true}
                                />
                            </View>
                        );
                    })}
                </View>
            </View>
            
            <View className='w-full justify-end py-8'>
                <View className='gap-4'>
                    <ThemedText className='text-4xl font-bold'>{ t("daily_flashcards") }</ThemedText>
                    <ThemedText variant='subtext' className='text-lg'>{t("daily_flashcards_desc")}</ThemedText>
                </View>
            </View>
            <MainButton
                text={ t("next") }
                onPress={() => router.push('/(onboarding)/welcomeScreens/welcomeThree')}
                next
                accessibilityLabel="Proceed to Next Welcome Screen"
                accessibilityHint="Navigates to the third welcome screen"
            />
        </SafeAreaView>
    )
}

export default WelcomeTwo



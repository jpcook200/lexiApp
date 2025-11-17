import { getWordsCount } from '@/api/getWords';
import { useTextToSpeech } from '@/api/textToSpeech';
import BackButton from '@/components/BackButton';
import FiltersModal from '@/components/FiltersModal';
import MainButton from '@/components/MainButton';
import ProgressBar from '@/components/ProgressBAr';
import ThemedIcon from '@/components/ThemedIcon';
import ThemedText from '@/components/ThemedText';
import useDatabase from '@/db/useDatabase';
import { useUserStore } from '@/hooks/useGetUser';
import { FiltersType, Word } from '@/types/types';
import { router, useFocusEffect } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const userWordsList = () => {
    const [ttsDisabled, setTtsDisabled] = useState(false);
    const { t } = useTranslation();
    const { user } = useUserStore();
    const { toggleFavourite, setUserWordsTotal } = useDatabase();
    const { colorScheme } = useColorScheme(); // "light" | "dark"
    const { getLearnedWords } = useDatabase();
    const { tts } = useTextToSpeech();
    const [ userWordsTotalState, setUserWordsTotalState ] = useState(0);
    
    //state
    const [learnedWords, setLearnedWords] = useState<Word[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [filters, setFilters] = useState<FiltersType>({
        sortBy: 'dateAdded',
        favouritesOnly: false,
    });
    const progressPercent = Math.min((learnedWords.length / userWordsTotalState) * 100, 100);
    //functions
    const fetchLearnedWords = async (filters: FiltersType) => {
        try {
            const words = await getLearnedWords(filters); // Assuming user_id is 1 for demo
            setLearnedWords(words);
        } catch (error) {
            console.error('Error fetching learned words:', error);
        }
    };

    const handleFavourite = async (wordId: number, isFavourite: 0 | 1) => {
        try {
            await toggleFavourite(wordId, isFavourite);
            // Update local state to reflect the change
            fetchLearnedWords(filters);
        } catch (error) {
            console.error('Error toggling favourite status:', error);
        }
    };

    const applyFilters = (filters: FiltersType) => { 
        fetchLearnedWords(filters)
        setModalVisible(false)
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

    const handleGetWordsCount = async () => {
        if(!user) return;
        try {
            const wordsCount = await getWordsCount(user!.learn_lang, user!.access_level === 'pro');
            await setUserWordsTotal(wordsCount);
            setUserWordsTotalState(wordsCount);
        }catch (error) {
            console.error('Error getting words count:', error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchLearnedWords(filters);
            handleGetWordsCount()
        }, [user])
    );
    
    return (
        <SafeAreaView edges={['top']} className='h-full bg-item-light dark:bg-item-dark'>
            <View className='px-4 border-b-2 border-border-light dark:border-border-dark pb-4 '>
                <BackButton/>
                <ThemedText className='text-4xl font-bold my-4'>{ t("your_vocabulary") }</ThemedText>
                <View className='flex-row justify-between items-center mb-2'>
                    <View>
                        <ThemedText variant='subtext'>{ t("learned") }</ThemedText>
                        <ThemedText className='text-2xl font-bold'>{learnedWords.length}</ThemedText>
                    </View>
                    <View>
                        <ThemedText variant='subtext'>{ t("total") }</ThemedText>
                        <ThemedText className='text-2xl font-bold'>{userWordsTotalState}</ThemedText>
                    </View>
                    <TouchableOpacity accessibilityLabel='Open Filters Menu' onPress={() => setModalVisible(!modalVisible)}>
                        <ThemedIcon name='Settings' size={24} />
                    </TouchableOpacity>
                </View>
                <ProgressBar progressPercent={progressPercent}/>
            </View>
            <ScrollView className='flex-1'>
                {learnedWords.length === 0 ? (
                    <View className='flex-1 justify-center items-center mt-20 px-4'>
                        <ThemedText className='text-center text-lg opacity-50'>{ t("no_words") }</ThemedText>
                    </View>
                ): (
                    learnedWords.map((word, index) => (
                    <View key={index} className={`px-4 w-full py-4 ${index % 2 === 0 ? 'bg-background-light dark:bg-background-dark' : 'bg-secondary-light dark:bg-secondary-dark'}`}>
                        <View className='flex-row items-center justify-between mb-2'>
                                <View className='flex-row items-center flex-1 gap-1'>
                                    <TouchableOpacity accessibilityLabel='Text to Speech for Word' onPress={user ? (() => handleTextToSpeech(word?.learning_word, user.learn_lang)) : () => {}} disabled={ttsDisabled} className={`${ttsDisabled ? 'opacity-50' : ''}`}>
                                        <ThemedIcon name={ ttsDisabled ? 'VolumeOff' : 'Volume2' } size={20} />
                                    </TouchableOpacity>
                                <ThemedText className="font-bold text-xl flex-wrap mb-1 ml-1">{word?.learning_word}</ThemedText>
                                {(word?.learning_gender && word?.learning_gender !== 'n') && <ThemedIcon name={word?.learning_gender === 'm' ? 'Mars' : 'Venus'} size={16} />}
                            </View>
                            <ThemedText variant="subtext" className="italic ml-auto">{word?.native_word}</ThemedText>
                        </View>
                        <View className='flex-row items-center justify-between'>
                            <View className='flex-1 mr-4'>
                                <ThemedText className="text-sm bg-primary text-white px-3 py-0.5 font-bold rounded-full self-start capitalize">{word?.part_of_speech}</ThemedText>
                                <ThemedText variant="subtext" className="mt-2 flex-wrap">{word?.native_definition}</ThemedText>
                            </View>

                        </View>
                        <TouchableOpacity accessibilityLabel='Toggle Word Favourite' className='ml-auto p-2' onPress={ () => handleFavourite(word?.id, word?.favourite) }>
                            <Heart size={ 24 } color={word?.favourite === 1 ? '#fc69b4' : colorScheme === 'dark' ? '#ffffff' : '#000000' } pointerEvents='none' />
                        </TouchableOpacity>
                    </View>
                    ))
                )}
                
            </ScrollView>
            <View className="mt-auto w-full px-4 py-4 bg-background-light dark:bg-background-dark border-t border-border-light dark:border-border-dark justify-start">
                <MainButton
                    text={t("practice")}
                    onPress={() => router.push('/(tabs)/home/practice')}
                    accessibilityLabel='Start Practicing Words'
                    accessibilityHint='Start a practice session with your learned words'
                />
            </View>
            <FiltersModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                filters={filters}
                setFilters={setFilters}
                applyFilters={() => applyFilters(filters)}
            />
        </SafeAreaView>
    )
}

export default userWordsList
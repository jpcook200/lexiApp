import CardStackSwiper from '@/components/CardStackSwiper'
import DifficultyModal from '@/components/DifficultyModal'
import LanguageIndicator from '@/components/LanguageIndicator'
import ThemedText from '@/components/ThemedText'
import useDatabase from '@/db/useDatabase'
import useGetUser from '@/hooks/useGetUser'
import { Word } from '@/types/types'
import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const practice = () => {
    const { t } = useTranslation();
    const { user } = useGetUser();
    const { getPracticeWords } = useDatabase();
    
    const [modalVisible, setModalVisible] = useState(false);
    const [difficultyLevel, setDifficultyLevel] = useState('');
    const [activeWords, setActiveWords] = useState<Word[]>([]);

    const handleGetPracticeWords = async () => { 
        try {
            if(!user) return;
            const words = await getPracticeWords(100, difficultyLevel);
            setActiveWords(words);

        } catch (error) {
            console.error('Error fetching practice words:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            if (isActive) {
                handleGetPracticeWords();
            }
            return () => {
                isActive = false;
            };
        }, [user])
    );

    const handleApply = () => {
        handleGetPracticeWords();
        setModalVisible(false);
    };
    
    return (
        <>
            <SafeAreaView className='flex-1 bg-background-light dark:bg-background-dark px-4'>
                <View className="mb-14 flex-row justify-between items-center">
                    <Text className='text-4xl text-primary font-black'>Lexigram</Text>
                    <LanguageIndicator/>
                </View>
                <CardStackSwiper
                    activeWords={activeWords}
                    setActiveWords={setActiveWords}
                    practice={true}
                    getPracticeWords={handleGetPracticeWords}   
                />
                <View className='px-4 mt-4 flex-row justify-end'>
                    <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} className='border-2 border-border-light dark:border-border-dark rounded-full w-14 h-14 flex justify-center items-center relative bg-shade-light dark:bg-shade-dark'>
                        <View className='bg-item-light dark:bg-item-dark absolute w-[90%] h-[90%] top-0 left-0 rounded-full'></View>
                        <ThemedText className='text-center font-black'>{ t(difficultyLevel) || t("all") }</ThemedText>
                    </TouchableOpacity>
                </View>
                
            </SafeAreaView>
            <DifficultyModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                difficultyLevel={difficultyLevel}
                setDifficultyLevel={setDifficultyLevel}
                handleApply={handleApply}
            />
        </>
        
        
    )
}

export default practice
import CardStackSwiper from '@/components/CardStackSwiper'
import DifficultyModal from '@/components/DifficultyModal'
import LanguageIndicator from '@/components/LanguageIndicator'
import Logo from '@/components/Logo'
import ThemedText from '@/components/ThemedText'
import useDatabase from '@/db/useDatabase'
import { useUserStore } from '@/hooks/useGetUser'
import { Word } from '@/types/types'
import { useFocusEffect } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const practice = () => {
    const { t } = useTranslation();
    const { user, fetchUser } = useUserStore();
    const { getPracticeWords } = useDatabase();
    const db = useSQLiteContext()
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
                fetchUser(db)
                handleGetPracticeWords();
            }
            return () => {
                isActive = false;
            };
        }, [])
    );

    const handleApply = () => {
        handleGetPracticeWords();
        setModalVisible(false);
    };

    if (!user) { 
        return null;
    }
    
    return (
        <>
            <SafeAreaView className='flex-1 bg-background-light dark:bg-background-dark px-4'>
                <View className="mb-14 flex-row justify-between items-center">
                    <Logo/>
                    <LanguageIndicator
                        language={user.learn_lang}
                    />
                </View>
                {activeWords.length === 0 ? (
                    <View className='flex-1 justify-center items-center mt-20 px-4'>
                        <ThemedText className='text-center text-lg opacity-50'>{ t("no_words") }</ThemedText>
                    </View>
                ): (
                        <CardStackSwiper
                            activeWords={activeWords}
                            setActiveWords={setActiveWords}
                            practice={true}
                        />
                )}
                
                <View className='px-4 mt-4 flex-row justify-end'>
                    <TouchableOpacity accessibilityLabel='Open Filters Menu' onPress={() => setModalVisible(!modalVisible)} className='border-2 border-border-light dark:border-border-dark rounded-full w-14 h-14 flex justify-center items-center relative bg-shade-light dark:bg-shade-dark'>
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
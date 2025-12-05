import BackButton from '@/components/BackButton'
import CardStackSwiper from '@/components/CardStackSwiper'
import CardSwitcherButton from '@/components/CardSwitcherButton'
import DatePickerModal from '@/components/DatePickerModal'
import DifficultyModal from '@/components/DifficultyModal'
import LimitModal from '@/components/LimitModal'
import PracticeSettings from '@/components/PracticeSettings'
import ThemedText from '@/components/ThemedText'
import useDatabase from '@/db/useDatabase'
import { useUserStore } from '@/hooks/useGetUser'
import { PracticeFiltersType, Word } from '@/types/types'
import { useFocusEffect } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Practice = () => {
    const { t } = useTranslation();
    const { user, fetchUser } = useUserStore();
    const { getPracticeWords } = useDatabase();
    const db = useSQLiteContext()
    const [switchCardFaceState, setSwitchCardFaceState] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [filters, setFilters] = useState<PracticeFiltersType>({
        date: null,
        difficulty: 'All',
        limit: 0,
    })
    const [activeWords, setActiveWords] = useState<Word[]>([]);
    const [showPicker, setShowPicker] = useState(false);
    const [showLimitPicker, setShowLimitPicker] = useState(false);

    const handleGetPracticeWords = async (filters: PracticeFiltersType) => { 
        try {
            if(!user) return;
            const words = await getPracticeWords(filters);
            setActiveWords(words);
        } catch (error) {
            console.error('Error fetching practice words:', error);
        }
    };

    const loopCards = (index: number) => {
        if (!activeWords) return;
        
        setTimeout(() => {
            setActiveWords((prev = []) => {
                if (index < 0 || index >= prev.length) return prev;

                const swipedCard = prev[index];

                const remaining = [
                    ...prev.slice(0, index),
                    ...prev.slice(index + 1)
                ];

                const updated = [...remaining, swipedCard];

                return updated;
            });
        }, 150);
    };
    

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            if (isActive) {
                fetchUser(db)
                handleGetPracticeWords(filters);
            }
            return () => {
                isActive = false;
            };
        }, [])
    );

    if (!user) { 
        return null;
    }
    
    return (
        <>
            <SafeAreaView edges={["top"]} className='flex-1 bg-background-light dark:bg-background-dark'>
                <View className="mt-1 mb-4 flex-row items-center justify-between px-4">
                    <BackButton />
                    <CardSwitcherButton
                        learnLang={user.learn_lang}
                        nativeLang={user.native_lang}
                        setSwitchCardFaceState={setSwitchCardFaceState}
                        switchFaceState={switchCardFaceState}
                    />
                </View>
                {activeWords.length === 0 ? (
                    <View className='flex-1 justify-center items-center mt-0 px-4'>
                        <ThemedText className='text-center text-lg opacity-50'>{ t("no_words") }</ThemedText>
                    </View>
                ) : (
                    <CardStackSwiper
                        activeWords={activeWords}
                        setActiveWords={setActiveWords}
                        practice={true}
                        user={user}
                        setlastWordLearned={() => { }}
                        setCurrentStreak={() => { }}
                        loopCards={loopCards}
                        switchFace={switchCardFaceState}
                    />
                )}
                <PracticeSettings
                    setShowPicker={setShowPicker}
                    setModalVisible={setModalVisible}
                    setShowLimitPicker={setShowLimitPicker}
                    filters={filters}
                    setFilters={setFilters}
                    getPracticeWords={handleGetPracticeWords}
                />
            </SafeAreaView>

            <DatePickerModal
                modalVisible={showPicker}
                setModalVisible={setShowPicker}
                filters={filters}
                setFilters={setFilters}
                getPracticeWords={handleGetPracticeWords}
            />
            
            <DifficultyModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                filters={filters}
                setFilters={setFilters}
                getPracticeWords={handleGetPracticeWords}
            />

            <LimitModal
                modalVisible={showLimitPicker}
                setModalVisible={setShowLimitPicker}
                filters={filters}
                setFilters={setFilters}
                getPracticeWords={handleGetPracticeWords}
            />
        </>
    )
}

export default Practice
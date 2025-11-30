import ThemedText from '@/components/ThemedText';
import { freeWordsAllowance } from '@/constants/languages';
import useDatabase from '@/db/useDatabase';
import { useUserStore } from '@/hooks/useGetUser';
import useGetWords from '@/hooks/useGetWords';
import { router } from 'expo-router';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
const WordsPerDay = () => {
    const { t } = useTranslation();
    const { setWordsPerDay, updateStreakRecord, updateStreakCount, getUserLearnedWordsCount, getLearnedWordsIds, getDailyWords, toggleRandomDailyWords} = useDatabase();
    const { user, setActiveWordsStore, activeWordsStore, filterActiveWordsStore } = useUserStore();
    const { handleWPDChange } = useGetWords();
    const [wpdLoading, setWpdLoading] = useState(false);
    const [selectedNumber, setSelectedNumber] = useState<number>(10);
    const numbers = Array.from({ length: 30 }, (_, i) => i + 1);

    useEffect(() => {
        if (user && user.words_per_day) {
            setSelectedNumber(Number(user.words_per_day));
        }
    }, [user]);

    const handleSave = async (selectedNumber: number) => {
        if (!user || selectedNumber === user.words_per_day) return;
        setWpdLoading(true);
        const userProgress = await getUserLearnedWordsCount();
        const storedWords = await getDailyWords();
        const currentDailyWords = storedWords.length;
        const localDatetime = DateTime.now().setZone(user.timezone).toString();

        try {
            if (user.access_level === 'free' && selectedNumber > freeWordsAllowance) {
                return router.push('../../(onboarding)/Subscribe');
            }
            
            const newData = await handleWPDChange(selectedNumber, user.learn_lang, user.native_lang, user.difficulty_level, localDatetime);
            
            if (newData) { 
                setActiveWordsStore(newData);
                filterActiveWordsStore();
            }
            
            if (userProgress >= selectedNumber) {
                await updateStreakCount("increment");
                await updateStreakRecord(1);
            }
            await setWordsPerDay(selectedNumber);
            router.back();
        
        } catch (error) {
            Alert.alert(t("error"), t("wpd_change_error"));
        } finally { 
            setWpdLoading(false);
        }
    };

    if (wpdLoading) {
        return (
            <ActivityIndicator size="small" className="flex-1 justify-center items-center bg-background-light dark:bg-background-dark" />
        );
    }

    return (
        <View className="flex-1 bg-background-light dark:bg-background-dark p-4">
            <ThemedText className="mb-2 text-lg text-text-light dark:text-text-dark">{ t("selected") }: <Text className="font-bold">{selectedNumber}</Text></ThemedText>
            <View className="border border-border-light dark:border-border-dark rounded-lg w-full overflow-hidden bg-item-light dark:bg-item-dark pb-6">                
                <FlatList
                    data={numbers}
                    keyExtractor={(item) => item.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => handleSave(item)}
                            className={`p-4 border-b border-border-light dark:border-border-dark ${selectedNumber === item ? 'bg-primary/20' : ''}`}
                            accessibilityLabel={`Select ${item} words per day`}
                        >
                            <View className='flex-row items-center justify-center'>
                                <ThemedText className={`text-center text-lg ${selectedNumber === item ? 'font-bold text-primary' : ''}`}>
                                    {item}
                                </ThemedText>
                                {user && user.access_level === 'free' && item > freeWordsAllowance && 
                                    <Text className="absolute right-4 border border-primary text-white bg-primary rounded-full font-bold px-3 py-0.5 text-sm shadow-sm">Pro</Text>
                                }
                            </View>
                            
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    );
};

export default WordsPerDay;

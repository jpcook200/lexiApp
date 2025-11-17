import ThemedText from '@/components/ThemedText';
import useDatabase from '@/db/useDatabase';
import { useUserStore } from '@/hooks/useGetUser';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';

const WordsPerDay = () => {
    const { t } = useTranslation();
    const { setWordsPerDay, updateStreakRecord, updateStreakCount} = useDatabase();
    const { user, loading } = useUserStore();
    const [selectedNumber, setSelectedNumber] = useState<number>(10);
    const numbers = Array.from({ length: 30 }, (_, i) => i + 1);
    const freeWordsAllowance = 6;

    useEffect(() => {
        if (user && user.words_per_day) {
            setSelectedNumber(Number(user.words_per_day));
        }
    }, [user]);

    const handleSave = async (selectedNumber: number) => {
        if (!user) return;
        try {
            await setWordsPerDay(selectedNumber);
            router.back();
        } catch (error) {
            console.error('Error saving words per day:', error);
        }
    };

    const handleNumberSelect = (number: number) => {
        if(user && user.access_level === 'free' && number > freeWordsAllowance) {
            return router.push('../../(onboarding)/Subscribe');
        }
        handleSave(number);
    };

    if (loading) {
        return (
            <ActivityIndicator size="small" className="flex-1 justify-center items-center" />
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
                            onPress={() => handleNumberSelect(item)}
                            className={`p-4 border-b border-border-light dark:border-border-dark ${selectedNumber === item ? 'bg-primary/20' : ''}`}
                            accessibilityLabel={`Select ${item} words per day`}
                        >
                            <View className='flex-row items-center justify-center'>
                                <ThemedText className={`text-center text-lg ${selectedNumber === item ? 'font-bold text-primary' : ''}`}>
                                    {item}
                                </ThemedText>
                                {user && user.access_level === 'free' && item > freeWordsAllowance && 
                                    <Text className="absolute right-4 border border-primary text-primary rounded-full font-bold px-3 py-0.5 text-sm">Pro</Text>
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

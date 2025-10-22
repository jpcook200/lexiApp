import ThemedText from '@/components/ThemedText';
import useDatabase from '@/db/useDatabase';
import useGetUser from '@/hooks/useGetUser';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

const WordsPerDay = () => {
    const { t } = useTranslation();
    const { setWordsPerDay } = useDatabase();
    const { user, loading } = useGetUser();
    const [selectedNumber, setSelectedNumber] = useState<number>(10);
    const numbers = Array.from({ length: 30 }, (_, i) => i + 1);

    useEffect(() => {
        if (user && user.words_per_day) {
            setSelectedNumber(user.words_per_day);
        }
    }, [user]);

    const handleSave = async (selectedNumber: string) => {
        try {
            await setWordsPerDay(selectedNumber);
            router.back();
        } catch (error) {
            console.error('Error saving words per day:', error);
        }
    };

    if (loading) {
        return (
            <ActivityIndicator size="small" className="flex-1 justify-center items-center" />
        );
    }

    return (
        <View className="flex-1 bg-background-light dark:bg-background-dark p-4">
            <View className="border border-border-light dark:border-border-dark rounded-lg w-full overflow-hidden bg-item-light dark:bg-item-dark">
                <Picker
                    selectedValue={selectedNumber}
                    onValueChange={(itemValue) => setSelectedNumber(itemValue)}
                    dropdownIconColor="#888"
                    style={{ color: 'black' }}
                >
                    {numbers.map((num) => (
                        <Picker.Item key={num} label={num.toString()} value={num} />
                    ))}
                </Picker>
            </View>

            <ThemedText className="mt-6 text-lg text-text-light dark:text-text-dark">{ t("selected") }: <Text className="font-bold">{selectedNumber}</Text></ThemedText>

            <View className="mt-auto w-full px-4 py-4 bg-background-light dark:bg-background-dark border-t border-border-light dark:border-border-dark justify-start">
                <TouchableOpacity
                    onPress={() => handleSave(selectedNumber.toString())}
                    className="h-14 bg-primary w-full rounded-lg flex justify-center items-center"
                    style={{boxShadow: '0 4px 0 #2889e3ff'}}
                >
                    <Text className="text-white font-bold text-lg">{ t("save") }</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default WordsPerDay;

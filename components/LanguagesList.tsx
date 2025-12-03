import { useUserStore } from '@/hooks/useGetUser';
import { StreakCount } from '@/types/types';
import { Flame } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { commonLanguages } from '../constants/languages';
import ThemedText from './ThemedText';

const LanguagesList = ({ onSelectLanguage, streakData, streakDisplay }: { onSelectLanguage: (itemCode: string) => void, streakData?: StreakCount[], streakDisplay?: boolean }) => {
    const { t } = useTranslation();
    const { user } = useUserStore();

    const getStreakByLanguage = (langCode: string) => {
        const entry = streakData?.find((s) => s.learn_lang === langCode);
        return entry?.current ?? 0;
    };

    return (
       <FlatList
            data={commonLanguages}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
                <TouchableOpacity accessibilityLabel='Select Language' onPress={() => onSelectLanguage(item?.code)} className="flex-row items-center p-4 py-6 border-b border-border-light dark:border-border-dark">
                    <View className="flex-1 flex-row items-center">
                        <Text className="text-xl mr-2">{item.flag}</Text>
                        <ThemedText className="text-lg">{t(item.code)}</ThemedText>
                    </View>
                    {streakDisplay && streakData && (
                        <View className="shadow-sm bg-item-light dark:bg-item-dark px-3 py-1 rounded-full items-center flex-row gap-1 w-16 justify-center">
                            <Flame size={15} color='#fc6a03' strokeWidth={4} />
                            <ThemedText className="font-black">{getStreakByLanguage(item.code) || 0}</ThemedText>
                        </View>
                    )}
                </TouchableOpacity>
            )}
        />
    )
}

export default LanguagesList
import { useTranslation } from 'react-i18next';
import { FlatList, Text, TouchableOpacity } from 'react-native';
import { commonLanguages } from '../constants/languages';
import ThemedText from './ThemedText';

const LanguagesList = ({ onSelectLanguage }: { onSelectLanguage: (itemCode: string) => void }) => {
    const { t } = useTranslation();
    return (
       <FlatList
            data={commonLanguages}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={ () => onSelectLanguage(item?.code) } className="flex-row items-center p-4 py-6 border-b border-border-light dark:border-border-dark">
                    <Text className="text-xl mr-2">{item.flag}</Text>
                    <ThemedText className="text-lg">{t(item.code)}</ThemedText>
                </TouchableOpacity>
            )}
        />
    )
}

export default LanguagesList
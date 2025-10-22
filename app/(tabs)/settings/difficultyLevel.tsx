import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { levels } from '@/constants/languages';
import useDatabase from '@/db/useDatabase';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';

const LearningLanguages = () => {
    const { setDifficultyLevel } = useDatabase();
    const { t } = useTranslation();
    
    const handleSelectLevel = async (levelCode: string) => {
        try {
            await setDifficultyLevel(levelCode);
            router.back();
        } catch (error) {
            console.error('Error setting learning language:', error);
        }
    };
    
    return (
        <ThemedView className="flex-1 p-4">
            { levels.map((level) => (
                <TouchableOpacity
                    key={ level.code }
                    onPress={() => handleSelectLevel(level.code)}
                    className="p-6 border-b border-border-light dark:border-border-dark"
                >
                    <ThemedText className="text-lg font-medium">{t(level.label.replace(' ', '_').toLowerCase())} ({t(level.code)})</ThemedText>
                </TouchableOpacity>
            )) }
        </ThemedView>
    );
};

export default LearningLanguages;
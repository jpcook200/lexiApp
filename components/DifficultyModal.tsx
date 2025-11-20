import { ModalProps } from '@/types/types';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, TouchableOpacity, View } from 'react-native';
import MainButton from './MainButton';
import ThemedText from './ThemedText';


const DifficultyModal = ({ modalVisible, setModalVisible, filters, setFilters, getPracticeWords}: ModalProps) => {
    const { t } = useTranslation();
    const [previousDifficulty, setPreviousDifficulty] = useState<string | null>("");

    const handleApply = () => {
        setPreviousDifficulty(filters.difficulty);
        setModalVisible(false);
        getPracticeWords(filters);
    };

    useEffect(() => {
        setPreviousDifficulty(filters.difficulty);
    }, []);

    const handleClose = () => {
        setFilters(prev => ({
            ...prev,
            difficulty: previousDifficulty
        }));
        setModalVisible(false);
    };

    return (
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
            <View className="flex-1 justify-end"> 
                {/* The semi-transparent overlay */}
                <TouchableOpacity onPress={handleClose} className="absolute inset-0" />

                {/* Modal content - height wraps content automatically */}
                <View className="w-full bg-item-light dark:bg-item-dark p-4 rounded-t-3xl shadow-md">
                    <View className="flex-col mb-4">
                        <ThemedText className="text-lg font-medium">{t("proficiency_level")}</ThemedText>
                        
                        <View className="border-2 border-border-light dark:border-border-dark rounded-lg mt-2 overflow-hidden bg-item-light dark:bg-item-dark">
                            <Picker
                                dropdownIconColor="#888"
                                style={{ height: 150 }}
                                selectedValue={filters.difficulty || "all"}
                                onValueChange={(value) =>
                                setFilters((prev) => ({ ...prev, difficulty: value }))
                                }
                                accessibilityLabel="Choose Difficulty Level"
                            >
                                <Picker.Item label={t("all")} value="all" />
                                <Picker.Item label={t("beginner") + ` (${t("a1")})`} value="A1" />
                                <Picker.Item label={t("elementary") + ` (${t("a2")})`} value="A2" />
                                <Picker.Item label={t("intermediate") + ` (${t("b1")})`} value="B1" />
                                <Picker.Item label={t("upper_intermediate") + ` (${t("b2")})`} value="B2" />
                                <Picker.Item label={t("advanced") + ` (${t("c1")})`} value="C1" />
                                <Picker.Item label={t("proficient") + ` (${t("c2")})`} value="C2" />
                            </Picker>
                        </View>

                        <MainButton
                            text={t("apply")}
                            onPress={handleApply}
                            accessibilityLabel="Apply difficulty level"
                            className="my-6"
                        />
                    </View>
                </View>
            </View>
            </Modal>

    )
}

export default DifficultyModal;

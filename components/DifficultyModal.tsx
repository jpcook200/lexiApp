import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { Modal, TouchableOpacity, View } from 'react-native';
import MainButton from './MainButton';
import ThemedText from './ThemedText';

type DifficultyModalProps = {
    modalVisible: boolean;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    difficultyLevel: string;
    setDifficultyLevel: React.Dispatch<React.SetStateAction<string>>;
    handleApply: () => void;
};

const DifficultyModal = ({ modalVisible, setModalVisible, difficultyLevel, setDifficultyLevel, handleApply }: DifficultyModalProps) => {
    const { t } = useTranslation();
    return (
        <Modal visible={modalVisible} animationType='slide' transparent={true}>
            <View className='flex-1'>
                <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} className='flex-1'>
                </TouchableOpacity>
            </View>
            <View className='w-full h-1/3 bg-background-light dark:bg-background-dark p-4 rounded-t-3xl shadow-md'>
                <View className='flex-col mb-4'>
                    <ThemedText className='text-lg font-medium'>{ t("proficiency_level") }</ThemedText>
                    <View className='border-t border-border-light dark:border-border-dark rounded-lg mt-2 overflow-hidden bg-item-light dark:bg-item-dark'>
                        <Picker
                            dropdownIconColor="#888"
                            style={{
                                height: 150,
                            }}
                            selectedValue={difficultyLevel}
                            onValueChange={(value) => setDifficultyLevel(value)}
                        >
                            <Picker.Item label={ t("all") } value="" />
                            <Picker.Item label={ t("beginner") + ' ' +  `(${t("a1")})` } value="A1" />
                            <Picker.Item label={ t("elementary") + ' ' +  `(${t("a2")})` } value="A2" />
                            <Picker.Item label={ t("intermediate") + ' ' +  `(${t("b1")})` } value="B1" />
                            <Picker.Item label={ t("upper_intermediate") + ' ' +  `(${t("b2")})` } value="B2" />
                            <Picker.Item label={ t("advanced") + ' ' +  `(${t("c1")})` } value="C1" />
                            <Picker.Item label={ t("proficient") + ' ' +  `(${t("c2")})` } value="C2" />
                        </Picker>
                    </View>
                    <MainButton
                        text={t("apply")}
                        onPress={handleApply}
                    />
                </View>
            </View>
        </Modal>
    )
}

export default DifficultyModal;

import { ModalProps } from '@/types/types';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, TouchableOpacity, View } from 'react-native';
import MainButton from './MainButton';
import ThemedText from './ThemedText';

const LimitModal = ({ modalVisible, setModalVisible, filters, setFilters, getPracticeWords}: ModalProps) => {
    const { t } = useTranslation();
    const [prevLimit, setPrevLimit] = useState<number>(0);

    const handleApply = () => {
        setPrevLimit(filters.limit);
        setModalVisible(false);
        getPracticeWords(filters);
    };

    const handleClose = () => {
        setFilters(prev => ({
            ...prev,
            limit: prevLimit
        }));
        setModalVisible(false);
    };

    useEffect(() => {
        setPrevLimit(filters.limit)
    }, []);

    // Generate multiples of 5 up to 200
    const limitOptions = Array.from({ length: 40 }, (_, i) => (i + 1) * 5);

    return (
        <Modal visible={modalVisible} animationType='slide' transparent={true}>
            <View className='flex-1'>
                <TouchableOpacity onPress={() => handleClose()} className='flex-1'>
                </TouchableOpacity>
            </View>
            <View className='w-full h-1/3 bg-background-light dark:bg-background-dark p-4 rounded-t-3xl shadow-md'>
                <View className='flex-col mb-4'>
                    <ThemedText className='text-lg font-medium'>{ t("limit") }</ThemedText>
                    <View style={{height: 150}} className='border-2 border-border-light dark:border-border-dark rounded-lg mt-2 overflow-hidden bg-item-light dark:bg-item-dark'>
                        <Picker
                            selectedValue={filters.limit === 0 ? `${t("unlimited")}` : filters.limit.toString()}
                            onValueChange={(value) => setFilters(prev => ({
                                ...prev,
                                limit: value === 'unlimited' ? 0 : Number(value)
                            }))}
                            >
                                <Picker.Item label={t("unlimited")} value="unlimited" />
                                {limitOptions.map((num) => (
                                    <Picker.Item key={num} label={`${num}`} value={num.toString()} />
                                ))}
                        </Picker>
                    </View>
                    <MainButton
                        text={t("apply")}
                        onPress={() => handleApply()}
                        accessibilityLabel='Apply limit'
                        className='my-6'
                    />
                </View>
            </View>
        </Modal>
    )
}

export default LimitModal;

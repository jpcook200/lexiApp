import { ModalProps } from '@/types/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, TouchableOpacity, View } from 'react-native';
import MainButton from './MainButton';
import ThemedText from './ThemedText';

const DatePickerModal = ({ modalVisible, setModalVisible, setFilters, filters, getPracticeWords }: ModalProps) => {
    const { t } = useTranslation();
    const [prevDate, setPrevDate] = useState<string | null>("");

    const parseLocalDate = (dateString: string) => {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    const handleApply = () => {
        setPrevDate(filters.date);
        setModalVisible(!modalVisible);
        getPracticeWords(filters);
    }

    useEffect(() => {
            setPrevDate(filters.date);
        }, [filters]);
    
    const handleClose = () => {
        setFilters(prev => ({
            ...prev,
            date: prevDate
        }));
        setModalVisible(false);
    };

    useEffect(() => {
        console.log("filters date:", filters.date)
    }, [filters]);


    return (
        <Modal visible={modalVisible} animationType='slide' transparent={true}>
            <View className='flex-1'>
                <TouchableOpacity onPress={() => handleClose()} className='flex-1'>
                </TouchableOpacity>
            </View>
            <View className='w-full h-1/3 bg-background-light dark:bg-background-dark p-4 rounded-t-3xl shadow-md'>
                <View className='flex-col mb-4'>
                    <ThemedText className='text-lg font-medium'>{ t("date") }</ThemedText>
                    <View style={{height: 150}} className='border-2 border-border-light dark:border-border-dark rounded-lg mt-2 overflow-hidden bg-item-light dark:bg-item-dark'>
                        <DateTimePicker
                            mode='date'
                            display='spinner'
                            onChange={(event, selectedDate) => {
                                if (selectedDate) {
                                    const year = selectedDate.getFullYear();
                                    const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
                                    const day = String(selectedDate.getDate()).padStart(2, '0');

                                    setFilters(prev => ({
                                    ...prev,
                                    date: `${year}-${month}-${day}`,
                                    }));
                                }
                            }}

                            style={{
                                height: '100%',
                            }}
                            accessibilityLabel='Choose Date'
                            value={filters.date ? parseLocalDate(filters.date) : new Date()}
                            maximumDate={new Date()}
                        />
                    </View>
                    <MainButton
                        text={t("apply")}
                        onPress={() => handleApply()}
                        accessibilityLabel='Apply difficulty level'
                        className='my-6'
                    />
                </View>
            </View>
        </Modal>
    )
}

export default DatePickerModal;

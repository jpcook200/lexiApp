import { PracticeSettingsProps } from '@/types/types'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import { Pressable, TouchableOpacity, View } from 'react-native'
import ThemedIcon from './ThemedIcon'
import ThemedText from './ThemedText'
import ThemedView from './ThemedView'

const PracticeSettings = ({ setShowPicker, setModalVisible, setShowLimitPicker, filters, setFilters, getPracticeWords }: PracticeSettingsProps) => {
    const { t } = useTranslation();

    const handleSelectDate = (state: string) => {
        let date: string | null = null;
        switch(state) {
            case 'today':
                date = DateTime.now().toISODate()
                if(date === filters.date) {
                    setFilters(prev => ({ ...prev, date: null }));
                    return;
                }
                setFilters(prev => ({ ...prev, date: date }));
                break;
            case 'yesterday':
                date = DateTime.now().minus({ days: 1 }).toISODate();
                if(date === filters.date) {
                    setFilters(prev => ({ ...prev, date: null }));
                    return;
                }
                setFilters(prev => ({ ...prev, date: DateTime.now().minus({ days: 1 }).toISODate() }));
                break;
            default:
                setFilters(prev => ({ ...prev, date: null }));
        }
        getPracticeWords({ ...filters, date: date });
    }

    const activeDay = () => { 
        if(!filters.date) return null;
        const today = DateTime.now().toISODate();
        const yesterday = DateTime.now().minus({ days: 1 }).toISODate();

        if(filters.date === today) return 'today';
        if(filters.date === yesterday) return 'yesterday';
        return 'other';
    }

    return (
        <ThemedView variant='shaded' className='border border-border-light dark:border-border-dark rounded-2xl'>
            <View className='p-4'>
                <ThemedText className='font-bold text-lg mb-2'>{ t("date") }</ThemedText>
                <View className='flex-row items-center gap-4'>
                    <Pressable accessibilityLabel='set active date to today' onPress={() => handleSelectDate("today")} className={`rounded-full px-4 h-10 sm:h-8 border-2 border-border-light dark:border-border-dark flex-row items-center ${activeDay() === 'today' ? 'border-primary dark:border-primary bg-primary' : ''}`}>
                        <ThemedText className='font-bold text-lg'>{ t("today") }</ThemedText>
                    </Pressable>
                    <Pressable accessibilityLabel='set active date to yesterday' onPress={() => handleSelectDate("yesterday")} className={`rounded-full px-4 h-10 sm:h-8 border-2 border-border-light dark:border-border-dark flex-row items-center ${activeDay() === 'yesterday' ? 'border-primary dark:border-primary bg-primary' : ''}`}>
                        <ThemedText className='font-bold text-lg'>{t("yesterday")}</ThemedText>
                    </Pressable>
                    <TouchableOpacity accessibilityLabel='set custom active date' onPress={() => setShowPicker(true)} className={`rounded-full px-4 h-10 sm:h-8 border-2 border-border-light dark:border-border-dark flex-row items-center ${filters.date && activeDay() === 'other' ? 'border-primary dark:border-primary bg-primary' : ''}`}>
                        { filters.date !== null ? (
                            <ThemedText className='font-bold text-lg'>{ DateTime.fromISO(filters.date).toLocaleString(DateTime.DATE_SHORT) }</ThemedText>
                        ) : (
                            <ThemedIcon name='Calendar' size={20}/>
                        )}
                    </TouchableOpacity>
                </View>
                <View className='mt-4 flex-row justify-between items-center'>
                    <View>
                        <ThemedText className='font-bold text-lg mb-2'>{ t("proficiency_level") }</ThemedText>
                        <View className='flex-row items-center gap-4'>
                            <TouchableOpacity accessibilityLabel='choose difficulty filter' onPress={() => setModalVisible(true)} className='rounded-full px-4 h-10 sm:h-8 border-2 border-border-light dark:border-border-dark flex-row items-center bg-item-light dark:bg-item-dark'>
                                <ThemedText className='font-bold text-lg'>{ t((filters.difficulty ?? "all").toLowerCase()) }</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <ThemedText className='font-bold text-lg mb-2'>{ t("limit") }</ThemedText>
                        <View className='flex-row items-center gap-4'>
                            <TouchableOpacity accessibilityLabel='choose card amount limit' onPress={() => setShowLimitPicker(true)} className='rounded-full px-4 h-10 sm:h-8 border-2 border-border-light dark:border-border-dark flex-row items-center bg-item-light dark:bg-item-dark'>
                                { filters.limit === 0 ? (
                                    <ThemedIcon name='Infinity' size={22}/>
                                ) : <ThemedText className='font-bold text-lg'>{ filters.limit }</ThemedText>  }
                                
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </View>
        </ThemedView>
    )
}

export default PracticeSettings
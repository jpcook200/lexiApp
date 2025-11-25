import { PracticeSettingsProps } from '@/types/types'
import { CircleX } from 'lucide-react-native'
import { DateTime } from 'luxon'
import { useColorScheme } from 'nativewind'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'
import ThemedIcon from './ThemedIcon'
import ThemedText from './ThemedText'
import ThemedView from './ThemedView'

const PracticeSettings = ({ setShowPicker, setModalVisible, setShowLimitPicker, filters, setFilters, getPracticeWords }: PracticeSettingsProps) => {
    const { t } = useTranslation();
    const { colorScheme } = useColorScheme();

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

    const handleDeleteDate = () => {
        setFilters(prev => ({ ...prev, date: null }));
        getPracticeWords({ ...filters, date: null });
    }

    return (
        <ThemedView variant='item' className='mt-auto overflow-hidden border-t border-border-light dark:border-border-dark'>
            <View className='px-4 pt-4 flex-row justify-between items-center'>
                <View className='items-start'>
                    <ThemedText className='font-bold text-lg mb-2'>{t("date")}</ThemedText>
                    <View className='flex-row items-center gap-1'>
                        <TouchableOpacity style={{ boxShadow: `inset -3px -3px 0 0 ${colorScheme === 'dark' ? '#0000002c' : '#b7b7b727'}` }} accessibilityLabel='set custom active date' onPress={() => setShowPicker(true)} className={`bg-background-light dark:bg-background-dark rounded-full px-4 h-10 sm:h-8 border border-border-light dark:border-border-dark flex-row items-center ${filters.date && activeDay() === 'other' ? 'border-primary dark:border-primary bg-primary' : ''}`}>
                            { filters.date !== null ? (
                                <ThemedText className='font-bold text-lg'>{ DateTime.fromISO(filters.date).toLocaleString(DateTime.DATE_SHORT) }</ThemedText>
                            ) : (
                                <ThemedIcon name='Calendar' size={20}/>
                            )}
                        </TouchableOpacity>
                        {filters.date !== null && <TouchableOpacity onPress={() => handleDeleteDate()} className='p-1'>
                            <CircleX pointerEvents='none' size={20} color="red" />
                        </TouchableOpacity>}
                    </View>                  
                </View>
                <View>
                    <ThemedText className='font-bold text-lg mb-2'>{ t("proficiency_level") }</ThemedText>
                    <View className='flex-row items-center gap-4'>
                        <TouchableOpacity style={{ boxShadow: `inset -3px -3px 0 0 ${colorScheme === 'dark' ? '#0000002c' : '#b7b7b727'}` }} accessibilityLabel='choose difficulty filter' onPress={() => setModalVisible(true)} className='bg-background-light dark:bg-background-dark rounded-full px-4 h-10 sm:h-8 border border-border-light dark:border-border-dark flex-row items-center'>
                            <ThemedText className='font-bold text-lg'>{ t((filters.difficulty ?? "all").toLowerCase()) }</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <ThemedText className='font-bold text-lg mb-2'>{ t("limit") }</ThemedText>
                    <TouchableOpacity style={{ boxShadow: `inset -3px -3px 0 0 ${colorScheme === 'dark' ? '#0000002c' : '#b7b7b727'}` }} accessibilityLabel='choose card amount limit' onPress={() => setShowLimitPicker(true)} className='bg-background-light dark:bg-background-dark rounded-full px-4 h-10 sm:h-8 border border-border-light dark:border-border-dark flex-row items-center '>
                        { filters.limit === 0 ? (
                            <ThemedIcon name='Infinity' size={22}/>
                        ) : <ThemedText className='font-bold text-lg'>{ filters.limit }</ThemedText>  }
                        
                    </TouchableOpacity>
                </View>
            </View>
        </ThemedView>
    )
}

export default PracticeSettings
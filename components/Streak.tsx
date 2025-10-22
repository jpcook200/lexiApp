import { Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';



const Streak = () => {
    const { t } = useTranslation();
    const days = [
        t("monday_abrv"),
        t("tuesday_abrv"),
        t("wednesday_abrv"),
        t("thursday_abrv"),
        t("friday_abrv"),
        t("saturday_abrv"),
        t("sunday_abrv"),
    ];
    return (
        <ThemedView variant='shaded' className='overflow-hidden border border-border-light dark:border-border-dark rounded-2xl mb-6 w-full'>
            <View className='p-4'>
                <ThemedText className='text-lg font-bold mb-2'>{t("streak")}</ThemedText>
                <View className='flex-row justify-between mt-2'>
                    {Array.from({ length: 7 }).map((_, index) => (
                        <View key={index}>
                            <View className='w-10 h-10 bg-primaryDark mb-2 rounded-full flex justify-center items-center relative overflow-hidden'>
                                <View className='absolute bg-primary w-[92%] h-[92%] left-0 top-0 rounded-full'></View>

                                <Check color='#FFFFFF' size={20} strokeWidth={3} />
                            </View>
                            <ThemedText variant='subtext' className='text-center uppercase font-black'>{ days[index].charAt(0) }</ThemedText>
                        </View>    
                    ))}
                </View>
            </View>
        </ThemedView>
    )
}

export default Streak

import ThemedIcon from '@/components/ThemedIcon';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import useDatabase from '@/db/useDatabase';
import useGetUser from '@/hooks/useGetUser';
import { getLanguageFlag } from '@/utilities/helpers';
import { scheduleDailyReminder } from '@/utilities/notifications';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Linking, ScrollView, Switch, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
    const { t } = useTranslation();
    const { user, loading, error, fetchUser } = useGetUser();
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const { setRemindersOn, resetProgressByLanguagePair } = useDatabase();

    const sendEmail = () => {
        const email = 'support@example.com';
        const subject = 'App Feedback';
        const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

        Linking.openURL(mailtoUrl).catch(err => {
            console.error('Error opening email client:', err);
        });
    };

    const handleScheduleReminders = async () => {
        try {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                return alert('Please enable notifications in settings');
            }

            const newValue = user?.reminders_on === 1 ? 0 : 1;
            await setRemindersOn(newValue);

            // Notify user
            if (newValue === 1) {
                await scheduleDailyReminder();
            } else {
                await Notifications.dismissAllNotificationsAsync();
                await Notifications.cancelAllScheduledNotificationsAsync();
            }
        } catch (error) {
            console.error('Error toggling reminders:', error);
        } finally { 
            fetchUser(); // refresh user data to get updated reminders_on value
        }
    };

    const handleResetProgress = async () => { 
        try {
            if (!user) return;
            await resetProgressByLanguagePair(user.native_lang, user.learn_lang);
            router.replace('/'); // navigate to home to refresh data
        } catch (error) {
            console.error('Error resetting progress:', error);
            alert('An error occurred while resetting progress.');
        }
    }

    const showResetPopUp = () => {
        Alert.alert(
            t("are_you_sure"),
            t("confirm_reset_message"),
            [
            { text: "Confirm", onPress: () => handleResetProgress()},
            { text: "Cancel", style: "cancel" }
            ]
        );
    };


    if (loading || !user) {
        return (
            <SafeAreaView edges={['top']} className='flex-1 h-full bg-background-light dark:bg-background-dark p-4 justify-center items-center'>
                <ActivityIndicator size='small' color='#1c95ffff'/>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView edges={['top']} className='flex-1 h-full bg-background-light dark:bg-background-dark p-4'>
                <ThemedText>Error loading user data.</ThemedText>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['top']} className='flex-1 h-full bg-background-light dark:bg-background-dark p-4'>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <ThemedText className='text-3xl font-bold'>{ t("settings") }</ThemedText>
                <View className='flex flex-col gap-6 mt-6'>
                    <View>
                        <ThemedText className='capitalize'>{ t("appearance") }</ThemedText>
                        <ThemedView variant='item' className='border border-border-light dark:border-border-dark rounded-lg mt-2 px-4'>
                            <View className='flex-row items-center gap-4 h-20'>
                                <ThemedIcon name={'Sun'} size={20} />
                                <ThemedText className='text-lg font-medium'>{colorScheme === 'dark' ? t("dark_mode") : t("light_mode")}</ThemedText>
                                <View className='ml-auto'>
                                    <Switch
                                        value={colorScheme === 'dark'}
                                        onChange={toggleColorScheme}
                                    />
                                </View>
                            </View>
                        </ThemedView>
                    </View>
                    <View>
                        <ThemedText>{ t("notifications") }</ThemedText>
                        <ThemedView variant='item' className='border border-border-light dark:border-border-dark rounded-lg mt-2 px-4'>
                            <View className='flex-row items-center gap-4 h-20'>
                                <ThemedIcon name={'Bell'} size={20} />
                                <ThemedText className='text-lg font-medium'>{ t("reminders") }</ThemedText>
                                <View className='ml-auto'>
                                    <Switch
                                        onChange={() => handleScheduleReminders()}
                                        value={ user?.reminders_on === 1}
                                    />
                                </View>
                                
                            </View>
                            
                        </ThemedView>
                    </View>
                    <View>
                        <ThemedText>{t("subscription")}</ThemedText>
                        <ThemedView variant='item' className='border border-border-light dark:border-border-dark rounded-lg mt-2 px-4'>
                            <View className='flex-row items-center gap-4 h-20'>
                                <ThemedIcon name={'CreditCard'} size={20} />
                                <ThemedText className='text-lg font-medium'>{t("subscription")}</ThemedText>
                                <ThemedText className='ml-auto font-medium'>Premium</ThemedText>
                                <ThemedIcon name='ChevronRight' size={20} />
                            </View>
                            
                        </ThemedView>
                    </View>
                    <View>
                        <ThemedText>{ t("user") }</ThemedText>
                        <ThemedView variant='item' className='border border-border-light dark:border-border-dark rounded-lg mt-2 px-4'>
                            <TouchableOpacity onPress={() => router.push('/settings/nativeLanguages')} className='flex-row items-center gap-4 py-6 border-b border-border-light dark:border-border-dark h-20'>
                                <ThemedIcon name={'Earth'} size={20} />
                                <ThemedText className='text-lg font-medium'>{ t("native_language") }</ThemedText>
                                <ThemedText className='ml-auto'>{getLanguageFlag(user.native_lang) + ' ' +  t(user.native_lang) }</ThemedText>
                                <ThemedIcon name='ChevronRight' size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.push('/settings/learningLanguages')} className='flex-row items-center gap-4 py-6 border-b border-border-light dark:border-border-dark'>
                                <ThemedIcon name={'BookA'} size={20} />
                                <ThemedText className='text-lg font-medium'>{ t("learning_language") }</ThemedText>
                                <ThemedText className='ml-auto'>{getLanguageFlag(user.learn_lang) + ' ' + t(user.learn_lang) }</ThemedText>
                                <ThemedIcon name='ChevronRight' size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.push('/settings/wordsPerDay')} className='flex-row items-center gap-4 py-6 border-b border-border-light dark:border-border-dark'>
                                <ThemedIcon name={'ListOrdered'} size={20} />
                                <ThemedText className='text-lg font-medium'>{ t("words_per_day") }</ThemedText>
                                <ThemedText className='ml-auto'>{ user?.words_per_day}</ThemedText>
                                <ThemedIcon name='ChevronRight' size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.push('/settings/difficultyLevel')} className='flex-row items-center gap-4 py-6'>
                                <ThemedIcon name='Gauge' size={20} />
                                <ThemedText className='text-lg font-medium'>{ t("proficiency_level") }</ThemedText>
                                <ThemedText className='ml-auto uppercase w-'>{ user?.difficulty_level}</ThemedText>
                                <ThemedIcon name='ChevronRight' size={20} />
                            </TouchableOpacity>
                        </ThemedView>
                    </View>
                    <View>
                        <ThemedText>{ t("privacy_security") }</ThemedText>
                        <ThemedView variant='item' className='border border-border-light dark:border-border-dark rounded-lg px-4 mt-2'>
                            <TouchableOpacity onPress={() => router.push('/settings/privacy')} className='flex-row items-center gap-4 border-b border-border-light dark:border-border-dark h-20'>
                                <ThemedIcon name={'HatGlasses'} size={20} />
                                <ThemedText className='text-lg font-medium'>{ t("privacy_policy") }</ThemedText>
                                <ThemedIcon className='ml-auto' name='ChevronRight' size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.push('/settings/terms')} className='flex-row items-center gap-4 h-20'>
                                <ThemedIcon name={'Handshake'} size={20} />
                                <ThemedText className='text-lg font-medium'>{ t("terms_of_service") }</ThemedText>
                                <ThemedIcon className='ml-auto' name='ChevronRight' size={20} />
                            </TouchableOpacity>
                        </ThemedView>
                    </View>
                    <View>
                        <ThemedText>{ t("help_support") }</ThemedText>
                        <ThemedView variant='item' className='border border-border-light dark:border-border-dark rounded-lg px-4 mt-2'>
                            <TouchableOpacity onPress={() => router.push('/settings/faqs')} className='flex-row items-center gap-4 border-b border-border-light dark:border-border-dark h-20'>
                                <ThemedIcon name={'CircleQuestionMark'} size={20} />
                                <ThemedText className='text-lg font-medium'>{ t("faqs") }</ThemedText>
                                <ThemedIcon className='ml-auto' name='ChevronRight' size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => sendEmail()} className='flex-row items-center gap-4 h-20'>
                                <ThemedIcon name={'MessageCircle'} size={20} />
                                <ThemedText className='text-lg font-medium'>{ t("feedback") }</ThemedText>
                                <ThemedIcon className='ml-auto' name='ChevronRight' size={20} />
                            </TouchableOpacity>
                        </ThemedView>
                    </View>
                    <View>
                        <TouchableOpacity className='h-16 bg-red-500 flex items-center justify-center rounded-md border-red-400 border-2' onPress={() => showResetPopUp()}>
                            <ThemedText className='text-center font-bold'>{ t("reset_progress") }</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

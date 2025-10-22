import * as Notifications from 'expo-notifications';

const dailyNotifications = [
    {
        title: "Your new words are here! 📚",
        body: "Time to practice today's vocabulary and keep your streak going!",
    },
    {
        title: "Keep Learning! ✏️",
        body: "Today's words are ready. Open the app to practice now.",
    },
    {
        title: "Boost Your Vocabulary 🚀",
        body: "Don't forget to review and learn your words today!",
    },
];


export const scheduleDailyReminder = async () => {
    const notification = dailyNotifications[Math.floor(Math.random() * dailyNotifications.length)];
    await Notifications.dismissAllNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
        content: {
            title: notification.title,
            body: notification.body,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 10,
            minute: 30,
        },
    });
};

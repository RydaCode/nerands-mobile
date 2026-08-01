// services/notifications/localNotification.js

import * as Notifications from "expo-notifications";

export async function showLocalNotification({
    title,
    message,
    data = {},
}) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body: message,
            data,
        },
        trigger: null,
    });
}
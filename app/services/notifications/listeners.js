// services/notifications/listeners.js

import * as Notifications from "expo-notifications";
import { addNotification } from "../../../redux/store/slices/notificationSlice";

export function registerNotificationListeners(dispatch, router) {

    const receivedSubscription = Notifications.addNotificationReceivedListener(
        notification => {

            console.log(
                "NOTIFICATION RECEIVED:",
                notification
            );

            const data = notification.request.content.data;

            dispatch(
                addNotification({
                    notification_id: data.order_id,
                    title: notification.request.content.title,
                    message: notification.request.content.body,
                    ...data,
                    read: false,
                    created_at: new Date().toISOString(),
                })
            );
        }
    );

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data;
        console.log(
            "NOTIFICATION CLICKED:",
            data
        );

        if (data?.action_url) {
            router.push(data.action_url);
        }
    });

    return () => {
        receivedSubscription.remove();
        responseSubscription.remove();
    };
}
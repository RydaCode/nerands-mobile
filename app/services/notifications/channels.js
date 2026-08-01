// services/notifications/channels.js

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function createNotificationChannels() {
    if (Platform.OS !== "android") return;

    await Notifications.setNotificationChannelAsync("delivery", {
        name: "Delivery Notifications",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
        vibrationPattern: [0, 250, 250, 250],
    });

    await Notifications.setNotificationChannelAsync("orders", {
        name: "Order Notifications",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
    });

    await Notifications.setNotificationChannelAsync("general", {
        name: "General Notifications",
        importance: Notifications.AndroidImportance.DEFAULT,
        sound: "default",
    });
}
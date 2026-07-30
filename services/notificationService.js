import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import axiosInstance from "../hook/axiosInstance";

export const registerForPushNotifications = async () => {
    try {
        if (!Device.isDevice) {
            console.log("Push notifications require a physical device");
            return null;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            console.log("Notification permission denied");
            return null;
        }

        // Get Expo push token
        const token = (
            await Notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig?.extra?.eas?.projectId
            })
        ).data

        console.log("Expo Token:", token);
        return token;
    } catch(error) {
        console.log("Push registration error:", error.message);
        return null;
    }
};

export const registerDevice = async () => {
    const push_token = await registerForPushNotifications();
    if(!push_token){
        return;
    }

    await axiosInstance.post(
        "/notifications/register-device", {
            push_token,
            platform: Platform.OS,
            device_name: Device.deviceName || "Unknown Device"
        }
    );
};
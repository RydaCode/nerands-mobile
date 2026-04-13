// services/locationServices.js
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { setLocation } from "../redux/store/slices/locationSlice";
import store from "../redux/store/store";
import { toast } from "../utils/toast";

const LOCATION_TASK_NAME = "transporter-background-location";

// ------------------ Background Task ------------------
if (!TaskManager.isTaskDefined(LOCATION_TASK_NAME)) {
    TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
        if (error || !data?.locations?.length) return;

        try {
            const location = data.locations[0];
            const { latitude, longitude } = location.coords;

            // Update Redux store
            store.dispatch(setLocation({ latitude, longitude }));

            // TODO: send to backend if needed
            // await fetch(`${SERVER_URI}/transporter/update/`, {...});
        } catch (err) {
            console.error("Background location task error:", err);
        }
    });
}

// ------------------ Utility: Delay ------------------
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ------------------ Permission Request ------------------
async function requestPermissions({ foreground = true, background = false } = {}) {
    if (foreground) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            toast.error("Permission Denied", "Foreground location permission is required.");
            return false;
        }
    }

    if (background) {
        const { status } = await Location.requestBackgroundPermissionsAsync();
        if (status !== "granted") {
            toast.error("Permission Denied", "Background location permission is required.");
            return false;
        }
    }

    return true;
}

// ------------------ Foreground Tracking ------------------
let foregroundSubscription = null;

export async function startForegroundTracking() {
    const granted = await requestPermissions({ foreground: true });
    if (!granted) return false;

    // Stop previous subscription
    if (foregroundSubscription) {
        foregroundSubscription.remove();
    }

    foregroundSubscription = await Location.watchPositionAsync(
        {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 10,
        },
        (location) => {
            const { latitude, longitude } = location.coords;
            store.dispatch(setLocation({ latitude, longitude }));
        }
    );

    return true;
}

export async function stopForegroundTracking() {
    if (foregroundSubscription) {
        foregroundSubscription.remove();
        foregroundSubscription = null;
    }
}

// ------------------ Background Tracking ------------------
export async function startBackgroundTracking() {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    if (hasStarted) return true;

    const granted = await requestPermissions({ foreground: true, background: true });
    if (!granted) return false;

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
            notificationTitle: "Driver Active",
            notificationBody: "Your location is being shared for assignments",
        },
    });

    return true;
}

export async function stopBackgroundTracking() {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    if (hasStarted) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }
}
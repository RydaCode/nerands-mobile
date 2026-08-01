import { createNotificationChannels } from "./channels";
import { setupNotificationHandler } from "./handler";
import { registerNotificationListeners } from "./listeners";
import { registerDevice } from "./register";

export async function initializeNotifications (dispatch, router ) {
    setupNotificationHandler();
    await createNotificationChannels();
    await registerDevice();
    const cleanup = registerNotificationListeners(
        dispatch,
        router
    );
    return cleanup;
}
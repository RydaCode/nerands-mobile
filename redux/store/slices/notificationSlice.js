import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload;

            state.unreadCount = action.payload.filter(
                notification => !notification.read
            ).length;
        },

        addNotification: (state, action) => {

            // prevent duplicates
            const exists = state.notifications.find(
                notification =>
                    notification.notification_id ===
                    action.payload.notification_id
            );

            if (!exists) {
                state.notifications.unshift(action.payload);

                state.unreadCount += 1;
            }
        },

        markNotificationRead: (state, action) => {
            const notification =
                state.notifications.find(
                    item =>
                    item.notification_id === action.payload
                );

            if(notification && !notification.read){

                notification.read = true;

                state.unreadCount =
                    Math.max(
                        0,
                        state.unreadCount - 1
                    );
            }
        },

        markAllNotificationsRead: (state) => {

            state.notifications =
                state.notifications.map(notification => ({
                    ...notification,
                    read:true
                }));

            state.unreadCount = 0;
        },

        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        }
    }
});

export const {
    setNotifications,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications
} = notificationSlice.actions;

export default notificationSlice.reducer;
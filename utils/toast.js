import Toast from "react-native-toast-message";

export const toast = {
    show: (type, text1, text2, duration = 4000) => {
        Toast.show({
            type,
            text1,
            text2,
            position: "bottom",
            visibilityTime: duration,
            autoHide: true,
            bottomOffset: 80,
        });
    },

    success: (title, msg, duration) => toast.show("success", title, msg, duration),
    error: (title, msg, duration) => toast.show("error", title, msg, duration),
    info: (title, msg, duration) => toast.show("info", title, msg, duration),
};
import * as SecureStore from "expo-secure-store";

export const getTokens = async () => {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    return { accessToken, refreshToken };
};

export const setTokens = async ({ accessToken, refreshToken }) => {
    if (accessToken) {
        await SecureStore.setItemAsync("accessToken", accessToken);
    }
    if (refreshToken) {
        await SecureStore.setItemAsync("refreshToken", refreshToken);
    }
};
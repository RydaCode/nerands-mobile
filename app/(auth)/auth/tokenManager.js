import * as SecureStore from "expo-secure-store";

export const getTokens = async () => {
    const authToken = await SecureStore.getItemAsync("authToken");
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    return { authToken, refreshToken };
};

export const setTokens = async ({ authToken, refreshToken }) => {
    if (authToken) {
        await SecureStore.setItemAsync("authToken", authToken);
    }
    if (refreshToken) {
        await SecureStore.setItemAsync("refreshToken", refreshToken);
    }
};
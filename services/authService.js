import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

const ACCESS_KEY = 'authToken';
const REFRESH_KEY = 'refreshToken';

export const authService = {
    async getAccessToken() {
        return SecureStore.getItemAsync(ACCESS_KEY);
    },

    async getRefreshToken() {
        return SecureStore.getItemAsync(REFRESH_KEY);
    },

    async setTokens({ accessToken, refreshToken }) {
        if (accessToken) {
            await SecureStore.setItemAsync(ACCESS_KEY, accessToken);
        }
        
        if (refreshToken) {
            await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
        }
    },

    async clearTokens() {
        await SecureStore.deleteItemAsync(ACCESS_KEY);
        await SecureStore.deleteItemAsync(REFRESH_KEY);
    },

    decode(token) {
        return jwtDecode(token);
    },

    isExpired(token) {
        const { exp } = jwtDecode(token);
        return Date.now() >= exp * 1000;
    }
};
// hooks/useLogout.js
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { offlineQueue } from '../../../hook/useApi';
import { logoutUser } from '../../../redux/store/slices/authSlice';
import { toast } from '../../../utils/toast';

const useLogout = () => {
    const dispatch = useDispatch();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const logout = async () => {
        if (isLoggingOut) return { success: false };

        try {
            setIsLoggingOut(true);
            dispatch(logoutUser());

            await SecureStore.deleteItemAsync('authToken');
            await SecureStore.deleteItemAsync('refreshToken');

            if (Array.isArray(offlineQueue)) {
                offlineQueue.length = 0;
            }

            return { success: true };
        } catch (error) {
            console.error('Logout failed:', error.message);
            toast.error('Logout Failed', error.message);
            return {
                success: false,
                error: error.message ?? 'Logout failed',
            };
        } finally {
            setIsLoggingOut(false);
        }
    };
    return { logout, isLoggingOut };
};

export default useLogout;
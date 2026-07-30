import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../../hook/axiosInstance';
import { logoutUser, setUserData } from '../../../redux/store/slices/authSlice';
import { authService } from '../../../services/authService';
import { registerDevice } from '../../../services/notificationService';

const useRehydrateAuth = () => {
    const dispatch = useDispatch();
    const [rehydrated, setRehydrated] = useState(false);

    useEffect(() => {
        const restore = async () => {
            try {
                const token = await authService.getAccessToken();
                const refreshToken = await authService.getRefreshToken();

                // No token
                if (!token) {
                    dispatch(logoutUser());
                    setRehydrated(true);
                    return;
                }

                let finalToken = token;

                // Token expired
                if (authService.isExpired(token)) {
                    try {
                        const res = await axiosInstance.post(
                            '/auth/user/token/refresh', { refreshToken }
                        );

                        finalToken = res.data.accessToken;
                        await authService.saveAccessToken(
                            finalToken
                        );
                    } catch(err) {
                        await authService.clearTokens();
                        dispatch(logoutUser());
                        setRehydrated(true);
                        return;
                    }
                }

                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${finalToken}`;
                const decoded = authService.decode(finalToken);

                dispatch(
                    setUserData({
                        ...decoded,
                        isAuthenticated:true,
                    })
                );

                // Register device AFTER login is confirmed
                await registerDevice();
            } catch(err) {
                console.warn(
                    "Auth restore error:",
                    err
                );
                
                dispatch(logoutUser());
            } finally {
                setRehydrated(true);
            }
        };

        restore();
    }, [dispatch]);
    return rehydrated;
};

export default useRehydrateAuth;
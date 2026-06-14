import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../../hook/axiosInstance';
import { logoutUser, setUserData } from '../../../redux/store/slices/authSlice';
import { authService } from '../../../services/authService';

const useRehydrateAuth = () => {
    const dispatch = useDispatch();
    const [rehydrated, setRehydrated] = useState(false);

    useEffect(() => {
        const restore = async () => {
            try {
                const token = await authService.getAccessToken();
                const refreshToken = await authService.getRefreshToken();

                // 1. No token → unauthenticated
                if (!token) {
                    dispatch(logoutUser());
                    setRehydrated(true);
                    return;
                }

                let finalToken = token;

                // 2. Token expired → try refresh
                if (authService.isExpired(token)) {
                    try {
                        const res = await axiosInstance.post(
                            '/auth/user/token/refresh',
                            { refreshToken }
                        );

                        finalToken = res.data.accessToken;
                        await authService.saveAccessToken(finalToken);

                    } catch (err) {
                        // ONLY here user is truly logged out
                        await authService.clearTokens();
                        dispatch(logoutUser());
                        setRehydrated(true);
                        return;
                    }
                }

                // 3. Set auth header
                axiosInstance.defaults.headers.common['Authorization'] =
                    `Bearer ${finalToken}`;

                // 4. Decode + login
                const decoded = authService.decode(finalToken);

                dispatch(setUserData({
                    ...decoded,
                    isAuthenticated: true,
                }));

            } catch (err) {
                console.warn("Auth restore error:", err);
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
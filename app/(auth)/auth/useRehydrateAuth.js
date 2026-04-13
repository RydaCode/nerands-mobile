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

                // ✅ No token → guest mode
                if (!token) {
                    setRehydrated(true);
                    return;
                }

                // ✅ Attach token to axios immediately
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                const decoded = authService.decode(token);

                dispatch(setUserData({
                    user_id: decoded.user_id,
                    user_type: decoded.user_type,
                    email_add: decoded.email_add,
                    first_name: decoded.first_name,
                    last_name: decoded.last_name,
                    phone_num: decoded.phone_num,
                    gender: decoded.gender,
                    date_of_birth: decoded.date_of_birth,
                    country: decoded.country,
                    province: decoded.province,
                    profile_image: decoded.profile_image,
                    is_transporter: decoded.is_transporter,
                    is_runner: decoded.is_runner,
                    transporter_id: decoded.transporter_id,
                    runner_id: decoded.runner_id,
                    isAuthenticated: true,
                }));

                // 🔐 Refresh only if token expired
                if (authService.isExpired(token)) {
                    await axiosInstance.get('/auth/user/token/refresh');
                }

            } catch (err) {
                console.warn('Auth rehydrate failed:', err);
                await authService.clearTokens();
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
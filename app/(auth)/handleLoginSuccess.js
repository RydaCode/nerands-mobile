import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

export const handleLoginSuccess = async ({
    token, refresh_token, dispatch, setUserData, purpose
}) => {
    if (!token || !refresh_token) {
        throw new Error('Missing tokens');
    }

    await SecureStore.setItemAsync('authToken', token);
    await SecureStore.setItemAsync('refreshToken', refresh_token);

    const decoded = jwtDecode(token);

    dispatch(
        setUserData({
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
            created_at: decoded.created_at,
            is_verified: decoded.is_verified,
            isAuthenticated:  purpose === 'login' ? true : false,
        })
    );

    return decoded;
};
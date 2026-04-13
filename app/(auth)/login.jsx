import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import CustomButton from '../../components/Buttons/CustomButton';
import FormInputs from '../../components/FormFields/FormInputs';
import MainHeader from '../../components/MainHeader';
import useApi from '../../hook/useApi';
import { setUserData } from '../../redux/store/slices/authSlice';
import { toast } from '../../utils/toast';
import LoadingIndicator from '../LoadingIndicator';

const Login = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        login_id: '',
        password: '',
    });
    const { post, isLoading, flushQueue } = useApi('/auth/user/login');

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) router.replace('/(tabs)');
    }, [isAuthenticated]);

    const handleChangeText = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleLogin = async () => {
        if (!formData.login_id.trim()) {
            toast.error('Please enter phone number or email');
            return;
        }

        if (!formData.password) {
            toast.error('Please enter password');
            return;
        }

        const response = await post(formData);

        if (response?.offline) {
            toast.info('Offline', 'Login will be retried automatically when online');
            return;
        }

        if (!response?.success) {
            toast.error(response?.message);
            return;
        }
        // Save tokens and set user data
        try {
            const { token, refresh_token, user, runner, transporter } = response.data;
            if (!token || !refresh_token) {
                toast.error('Error', 'Missing token from server');
                return;
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
                    user_type: decoded.user_type,
                    isAuthenticated: true
                })
            );

            toast.success('Logged in successfully');
        } catch (err) {
            toast.error('Invalid login token');
        }
        // Attempt to flush offline queue in case there are pending requests
        flushQueue();
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-4">
                <MainHeader header_name="Sign In" textStyles="text-2xl" fontFamily="ubuntu-medium" />
            </View>

            <View className="flex-1 justify-center px-4">
                <FormInputs
                    title="Phone / Email"
                    defaultValue={formData.login_id}
                    handleChangeText={(value) => handleChangeText('login_id', value)}
                    desc="Enter your phone number or email"
                    borderStyle="border border-[#E2E8F0]"
                />
                <FormInputs
                    title="Password"
                    secureTextEntry
                    handleChangeText={(value) => handleChangeText('password', value)}
                    desc="Enter your password"
                    borderStyle="border border-[#E2E8F0]"
                />
                <CustomButton
                    title={isLoading ? 'Signing in...' : 'Sign in'}
                    handlePress={handleLogin}
                    disabled={isLoading}
                    otherStyles={`bg-primary p-4 mt-4 ${isLoading ? 'opacity-50' : ''}`}
                    textStyles="text-xl"
                />
                <View className="flex-row items-center my-5">
                    <Text className="text-slate text-sm">Don't have an account?</Text>
                    <TouchableOpacity onPress={() => router.push('/sign-up')} className="ml-2">
                        <Text className="font-bold text-primary">Click here</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {isLoading && <LoadingIndicator loading_text="Signing in..." />}
        </SafeAreaView>
    );
};

export default Login;
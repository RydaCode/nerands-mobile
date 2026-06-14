import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { Entypo, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import Headers from '../../components/Headers';
import { COLORS } from '../../constants/constants';
import useApi from '../../hook/useApi';
import { setUserData } from '../../redux/store/slices/authSlice';
import { toast } from '../../utils/toast';
import AuthLayout from '../AuthLayout';
import OverLay from '../OverLay';

const Login = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [focusedField, setFocusedField] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const [fieldErrors, setFieldErrors] = useState({});

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
        const errors = {};

        if (!formData.login_id.trim()) {
            errors.login_id = 'Email address / phone number is required';
        }

        if (!formData.password) {
            errors.password = 'Please enter password';
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            toast.error('Please complete all required fields');
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
                    created_at: decoded.created_at,
                    is_verified: decoded.is_verified,
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
        <>
        <SafeAreaView className="flex-1 bg-white px-4">
            <Headers header_name="Sign In" textStyles="text-2xl" fontFamily="ubuntu-medium" icon={<FontAwesome name="user" color={COLORS.slate} size={19} />} />

            <AuthLayout>
            <View className="flex-1 justify-center">
                {/* Email / Phone */}
                <Text
                    className="mb-2 text-black"
                    style={{ fontFamily: "roboto-medium" }}
                >
                    Email / Phone
                </Text>

                <View
                    className="flex-row items-center px-3 mb-6"
                    style={{
                        borderWidth: 2,
                        borderColor:
                            fieldErrors.login_id
                                ? 'red'
                                : focusedField === 'login_id'
                                    ? COLORS.green1
                                    : '#E5E7EB',
                        borderRadius: 10,
                        height: 50,
                    }}
                >
                    <FontAwesome
                        name="user"
                        size={20}
                        color={
                            focusedField === "login_id"
                                ? COLORS.green1
                                : COLORS.black
                        }
                    />

                    <TextInput
                        placeholder="Email / Phone"
                        placeholderTextColor={COLORS.gray}
                        defaultValue={formData.login_id}
                        keyboardType="default"
                        autoCapitalize="none"
                        autoCorrect={false}
                        textContentType="login_id"
                        onFocus={() => setFocusedField("login_id")}
                        onBlur={() => setFocusedField(null)}
                        onChangeText={(value) => handleChangeText('login_id', value)}
                        style={{
                            flex: 1,
                            marginLeft: 10,
                            height: "100%",
                            fontFamily: "roboto",
                            fontSize: 15,
                        }}
                    />
                </View>

                {fieldErrors.login_id && (
                    <Text
                        style={{
                            color: 'red',
                            marginTop: -15,
                            marginBottom: 15,
                            fontSize: 12,
                        }}
                    >
                        {fieldErrors.login_id}
                    </Text>
                )}

                {/* Password */}
                <Text
                    className="mb-2 text-black"
                    style={{ fontFamily: "roboto-medium" }}
                >
                    Password
                </Text>

                <View
                    className="flex-row items-center px-3"
                    style={{
                        borderWidth: 2,
                        borderColor:
                            fieldErrors.password
                                ? 'red'
                                : focusedField === 'password'
                                    ? COLORS.green1
                                    : '#E5E7EB',
                        borderRadius: 10,
                        height: 50,
                    }}
                >
                    <FontAwesome5
                        name="user-lock"
                        size={18}
                        color={
                            focusedField === "password"
                                ? COLORS.green1
                                : COLORS.black
                        }
                    />

                    <TextInput
                        placeholder="Password"
                        placeholderTextColor={COLORS.gray}
                        secureTextEntry={!showPassword}
                        autoCorrect={false}
                        textContentType="newPassword"
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        onChangeText={(value) => handleChangeText('password', value)}
                        style={{
                            flex: 1,
                            marginLeft: 10,
                            height: "100%",
                            fontFamily: "roboto",
                            fontSize: 15,
                        }}
                    />

                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Entypo
                            name={showPassword ? "eye-with-line" : "eye"}
                            size={23}
                            color={COLORS.slate}
                        />
                    </TouchableOpacity>
                </View>
                {fieldErrors.password && (
                    <Text
                        style={{
                            color: 'red',
                            marginTop: 5,
                            marginBottom: 15,
                            fontSize: 12,
                        }}
                    >
                        {fieldErrors.password}
                    </Text>
                )}

                <TouchableOpacity
                    className='mt-8'
                    onPress={() => router.push('./request-password-reset')}
                >
                    <Text
                        className='text-primary'
                        style={{fontFamily: 'roboto-medium'}}
                    >Forgot Password</Text>
                </TouchableOpacity>

                <View className="w-full mt-5">
                    <TouchableOpacity
                        style={{borderRadius: 10, height: 50}}
                        className={`bg-primary justify-center items-center ${isLoading ? 'opacity-50' : 'opacity-100'} elevation-sm border border-primary`}
                        disabled={isLoading}
                        accessibilityLabel="Sign up button"
                        onPress={() => handleLogin()}
                    >
                        {isLoading ? <ActivityIndicator size={25} color='white'/> :
                            <Text
                                className='text-white text-2xl'
                                style={{fontFamily: 'maven-medium'}}
                            >
                                Sign in
                            </Text>
                        }
                    </TouchableOpacity>
                </View>

                <View className="relative w-full mt-6 items-center justify-center">
                    {/* Left line */}
                    <View className="absolute left-0 right-0 h-[1px] bg-lavender" />

                    {/* OR text */}
                    <View className="bg-white px-4">
                        <Text className="text-slate" style={{fontFamily: 'roboto-medium'}}>OR</Text>
                    </View>
                </View>

                <View className='w-full justify-center items-center mt-2'>
                    <TouchableOpacity className='rounded py-2'
                        onPress={() => router.push({
                                pathname: '/loginotp',
                                params: { title: 'login' }
                            })
                        }
                    >
                        <Text
                            className='text-base text-slate'
                            style={{fontFamily: 'roboto-medium'}}
                        >
                            Sign in with <Text
                                className='text-primary'
                            >OTP</Text>
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row justify-center items-center my-5">
                    <TouchableOpacity onPress={() => router.push('/')} className="ml-2">
                        <Text className="text-slate text-base" style={{fontFamily: 'roboto-medium'}}>
                            Don't have an account? {" "}
                            <Text className="font-bold text-primary">
                                Tap here
                            </Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            </AuthLayout>
        </SafeAreaView>
        {isLoading && <OverLay/>}
        </>
    );
};

export default Login;
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { FontAwesome } from '@expo/vector-icons';
import Headers from '../../components/Headers';
import { COLORS } from '../../constants/constants';
import useApi from '../../hook/useApi';
import { toast } from '../../utils/toast';
import AuthLayout from '../AuthLayout';
import OverLay from '../OverLay';

const LoginOtp = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [focusedField, setFocusedField] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        otp_type: "email",
        purpose: "login",
        contact: ""
    });
    const { post, isLoading } = useApi('/auth/user/otp-login');

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) router.replace('/(tabs)');
    }, [isAuthenticated]);

    const handleChangeText = useCallback((key, value) => {
        setFormData(prev => ({
            ...prev,
            [key]: value,
        }));
    }, []);

    const sendOtp = async () => {
        if (!formData.otp_type.trim()) {
            toast.error('Select contact type');
            return;
        }

        if (!formData.purpose.trim()) {
            toast.error('Invalid purpose');
            return;
        }
        
        if (!formData.contact.trim()) {
            toast.error('Enter email address');
            return;
        }

        try {
            const res = await post(formData);
            
            toast.success(`OTP sent, please check your ${formData.otp_type}`);

            // ✅ Delay navigation by 1.5 seconds so toast is visible
            setTimeout(() => {
                router.push({
                    pathname: '/otpauth',
                    params: {
                        otp_type: formData.otp_type,
                        purpose: 'login',
                        contact: formData.contact,
                        user_id: res?.data?.user_id
                    }
                });
            }, 2000);
        } catch (error) {
            // timeout / no response
            if (!error.response) {

                toast.info(
                    'Network issue detected. If the OTP was sent, you can enter it on the next screen.'
                );

                setTimeout(() => {
                    router.push({
                        pathname: '/otpauth',
                        params: {
                            otp_type: formData.otp_type,
                            purpose: 'login',
                            contact: formData.contact,
                            user_id: res?.data?.user_id
                        }
                    });
                }, 2000);

                return;
            }
            
            toast.error(
                error?.response?.data?.message ||
                'Failed to send OTP'
            );
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white px-4">
            <Headers header_name="Sign In" textStyles="text-2xl" fontFamily="ubuntu-medium" icon={<FontAwesome name="user" color={COLORS.slate} size={19} />} />

            <AuthLayout>
            <View className="flex-1 justify-center">
                {/* Email */}
                <Text
                    className="mb-2 text-black"
                    style={{ fontFamily: "roboto-medium" }}
                >
                    Email
                </Text>

                <View
                    className="flex-row items-center px-3 mb-6"
                    style={{
                        borderWidth: 2,
                        borderColor:
                            focusedField === "contact"
                                ? COLORS.green1
                                : '#E5E7EB',
                        borderRadius: 10,
                        height: 50,
                    }}
                >
                    <FontAwesome
                        name="envelope"
                        size={20}
                        color={
                            focusedField === "contact"
                                ? COLORS.green1
                                : COLORS.black
                        }
                    />

                    <TextInput
                        placeholder="Email address"
                        placeholderTextColor={COLORS.gray}
                        defaultValue={formData.contact}
                        keyboardType="default"
                        autoCapitalize="none"
                        autoCorrect={false}
                        textContentType="contact"
                        onFocus={() => setFocusedField("contact")}
                        onBlur={() => setFocusedField(null)}
                        onChangeText={(value) => handleChangeText('contact', value)}
                        style={{
                            flex: 1,
                            marginLeft: 10,
                            height: "100%",
                            fontFamily: "roboto",
                            fontSize: 15,
                        }}
                    />
                </View>

                <View className="w-full">
                    <TouchableOpacity
                        style={{borderRadius: 10, height: 50}}
                        className={`bg-primary justify-center items-center elevation-sm border border-primary`}
                        accessibilityLabel="Send OTP"
                        onPress={() => sendOtp()}
                    >
                        {isLoading ? <ActivityIndicator size={25} color='white'/> :
                            <Text
                                className='text-white text-2xl'
                                style={{fontFamily: 'maven-medium'}}
                            >
                                Get Otp
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
                                pathname: '/login'
                            })
                        }
                    >
                        <Text
                            className='text-base text-slate'
                            style={{fontFamily: 'roboto-medium'}}
                        >
                            Sign in with <Text
                                className='text-primary'
                            >Password</Text>
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row justify-center items-center my-5">
                    <TouchableOpacity onPress={() => router.push('/')} className="ml-2">
                        <Text className="text-slate text-base" style={{fontFamily: 'roboto-medium'}}>
                            Don't have an account? {" "}
                            <Text className="font-bold text-primary">
                                Click here
                            </Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {isLoading && <OverLay />}
            </AuthLayout>
        </SafeAreaView>
    );
};

export default LoginOtp;
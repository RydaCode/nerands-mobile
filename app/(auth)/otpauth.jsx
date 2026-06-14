import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import useApi from '../../hook/useApi';
import { setUserData } from '../../redux/store/slices/authSlice';
import { toast } from '../../utils/toast';
import AuthLayout from '../AuthLayout';
import { handleLoginSuccess } from './handleLoginSuccess';
import { handleVerifyOTPLogin, handleVerifyOTPRegister, handleVerifyOTPResetPassword } from './verifyOTP';

const Otpauth = () => {
    const router = useRouter();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputs = useRef([]);
    const params = useLocalSearchParams();
    const dispatch = useDispatch();
    const {data, isLoading, error, post} = useApi(`/auth/user/verify-user`);
    const { post: resendOTPPost, isLoading: resendOTPLoading } = useApi('/auth/user/resend-otp');


    const [expiryTime, setExpiryTime] = useState(
        Date.now() + 60000
    );

    const [secondsLeft, setSecondsLeft] = useState(60);

    useEffect(() => {
        const interval = setInterval(() => {
            const remaining = Math.max(
                0,
                Math.floor((expiryTime - Date.now()) / 1000)
            );

            setSecondsLeft(remaining);
        }, 1000);

        return () => clearInterval(interval);
    }, [expiryTime]);

    const handleResendOtp = async () => {
        if (secondsLeft > 0) return;

        // await resendOtp();

        setExpiryTime(Date.now() + 60000);
    };

    // For OTP input handling - to be removed when OTP is implemented
    const handleChange = (text, index) => {
        const cleaned = text.replace(/\D/g, "");

        // 🚨 PASTE DETECTED (user pasted full OTP)
        if (cleaned.length > 1) {
            const digits = cleaned.slice(0, 6).split("");

            setOtp((prev) => {
                const newOtp = [...prev];

                digits.forEach((d, i) => {
                    newOtp[i] = d;
                });

                return newOtp;
            });

            // focus last filled box
            const next = Math.min(digits.length, 5);
            inputs.current[next]?.focus();

            return;
        }

        // normal single digit input
        const newOtp = [...otp];
        newOtp[index] = cleaned;
        setOtp(newOtp);

        if (cleaned && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    // Handle OTP verifications
    const purpose = params.purpose;
    const otp_type = params.otp_type;
    const contact = params.contact;
    const user_id = params.user_id;

    const handleOTPVerification = async () => {
        let result;

        switch (purpose) {
            case 'login':
                result = await handleVerifyOTPLogin({purpose, otp_type, contact, otp, user_id, post});
                break;

            case 'register':
                result = await handleVerifyOTPRegister({purpose, otp_type, contact, otp, user_id, post});
                break;

            case 'reset_password':
                result = await handleVerifyOTPResetPassword({purpose, otp_type, contact, otp, user_id, post});
                break;

            default:
                toast.error('Unknown verification purpose');
                break;
        }

        if (result?.success) {
            if (purpose === 'login') {
                try {
                    const { token, refresh_token } = result.data;

                    await handleLoginSuccess({
                        token,
                        refresh_token,
                        dispatch,
                        setUserData,
                        purpose
                    });

                    // ✅ Delay navigation by 1.5 seconds so toast is visible
                    setTimeout(() => {
                        router.push('../(tabs)');
                    }, 1500);
                } catch (error) {
                    toast.error(error.message || 'Login failed');
                }
            } else if (purpose === 'register') {
                try {
                    const { token, refresh_token } = result.data;

                    await handleLoginSuccess({
                        token,
                        refresh_token,
                        dispatch,
                        setUserData,
                        purpose
                    });

                    // ✅ Delay navigation by 1.5 seconds so toast is visible
                    setTimeout(() => {
                       router.push({
                            pathname: '/personaldetails',
                            params: {
                                purpose: purpose,
                                otp_type: otp_type,
                                contact: contact,
                                user_id: user_id
                            }
                        });
                    }, 1500);
                } catch (error) {
                    toast.error(error.message || 'Registration failed');
                }
            } else if (purpose === 'reset_password') {
                const { password_reset_token, user_id } = result?.data?.data;

                if (!password_reset_token) {
                    toast.error('Failed to generate reset token. Please try again.');
                    return;
                }

                try {
                    await SecureStore.setItemAsync(
                        'password_reset_token',
                        password_reset_token
                    );

                    if (password_reset_token) {
                        router.push({
                            pathname: '/reset-password',
                            params: {
                                purpose,
                                otp_type,
                                contact,
                                user_id,
                                token: password_reset_token
                            }
                        });   
                    }
                } catch (error) {
                    console.error(error);
                    toast.error('Unable to continue. Please try again.');
                }
            } else {
                toast.error('Unknown verification purpose');
            }
        }
    };

    // Resend the OTP
    const resendOTP = async () => {
        if (secondsLeft > 0) return;
        try {
            const res = await resendOTPPost({
                contact: params.contact,
                purpose: params.purpose,
                otp_type: params.otp_type
            });

            toast.success(
                res?.data?.message ||
                `OTP sent, please check your ${params.otp_type}`
            );
        } catch (error) {
            toast.error(
                res?.data?.message ||
                `OTP sent, was not sent, but if you recieved it, please enter it into the text boxes above.`
            );
        }
        setExpiryTime(Date.now() + 60000);
    }

    return (
        <AuthLayout>
            <SafeAreaView className="flex-1 items-center justify-center bg-white px-5">
                <Text className="text-2xl mb-4" style={{fontFamily: 'ubuntu-medium'}}>OTP Authentication</Text>
                <Text className="text-gray-600 mb-6 text-base text-center">
                    Enter the OTP sent to your email to complete your {purpose === 'register' ? 'registration' : purpose}.
                </Text>
                {/* OTP Input and Verify Button would go here */}
                <View className="w-full">
                    {/* OTP Inputs */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => (inputs.current[index] = ref)}
                                value={digit}
                                onChangeText={(text) => handleChange(text, index)}
                                keyboardType="number-pad"
                                textContentType="oneTimeCode" // iOS autofill support
                                maxLength={6}
                                style={{
                                    width: 45,
                                    height: 55,
                                    borderWidth: 2,
                                    borderColor: "#E5E7EB",
                                    textAlign: "center",
                                    fontSize: 25,
                                    borderRadius: 10,
                                    fontFamily: "roboto",
                                }}

                                onKeyPress={({ nativeEvent }) => {
                                    if (nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
                                        inputs.current[index - 1].focus();
                                    }
                                }}
                            />
                        ))}
                    </View>

                    <TouchableOpacity
                        className={`bg-primary py-3 ${isLoading ? 'opacity-50' : 'opacity-100'} rounded-lg mt-6 justify-center items-center`}
                        disabled={isLoading}
                        accessibilityLabel="Verify"
                        onPress={handleOTPVerification}
                    >
                        {isLoading ? <ActivityIndicator size={25} color='white'/> :
                            <Text
                                className='text-white text-lg'
                                style={{fontFamily: 'roboto-medium'}}
                            >
                                Verify
                            </Text>
                        }
                    </TouchableOpacity>

                    <Text
                        className='mt-6 text-gray-600 text-center'
                    >If you didn't receive the OTP, you can press the resend button below.</Text>

                    {secondsLeft > 0 ? (
                        <Text
                            className='mt-6 text-blue-500 text-center'
                        >Resend OTP in {secondsLeft}s</Text> 
                    ) : (
                        <TouchableOpacity
                            className="bg-blue-500 py-3 rounded-lg mt-6 justify-center items-center"
                            onPress={() => resendOTP()}
                        >
                            {resendOTPLoading ? <ActivityIndicator size={25} color='white'/> :
                                <Text
                                    className='text-white text-lg'
                                    style={{fontFamily: 'roboto-medium'}}
                                >
                                    Resend Otp
                                </Text>
                            }
                        </TouchableOpacity>
                    )}
                </View>
            </SafeAreaView>
        </AuthLayout>
    )
}

export default Otpauth
import { Entypo, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Headers from '../../components/Headers';
import { COLORS } from '../../constants/constants';
import { VALID_PREFIXES } from '../../constants/phonePrefixes';
import useApi from '../../hook/useApi';
import { toast } from '../../utils/toast';
import AuthLayout from '../AuthLayout';
import OverLay from '../OverLay';
import { getPasswordStrength } from './getPasswordStrength';
import { containsPersonalInfo, getPasswordError } from './passwordValidator';

const Register = () => {
    const [formData, setFormData] = useState({
        email_add: '',
        phone_num: '',
        password: '',
        confirm_password: '',
        otp_type: "email",
        purpose: "register"
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [focusedField, setFocusedField] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [phone, setPhone] = useState("");
    const router = useRouter();

    // Custom hook for API call
    const { data, isLoading, error, post } = useApi('/auth/user/register');

    // Helper function to validate email address
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    
    // Validate password
    const isValidPassword = (password) => {
        return (
            password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[0-9]/.test(password)
        );
    };

    // Password strength calculator
    const passwordStrength = getPasswordStrength(formData.password);

    // Helper function to validate phone number
    const normalizeZambianNumber = (phone) => {
        let cleaned = phone.replace(/\D/g, '');

        // If user entered full international format (260XXXXXXXXX)
        if (cleaned.startsWith('260')) {
            cleaned = cleaned.slice(3);
        }

        // If user entered leading 0 (0973...)
        if (cleaned.startsWith('0')) {
            cleaned = cleaned.slice(1);
        }

        return cleaned;
    };

    const isValidPhoneNumber = (phone) => {
        const normalized = normalizeZambianNumber(phone);

        if (normalized.length !== 9) return false;

        const prefix = normalized.slice(0, 3);

        return VALID_PREFIXES.has(prefix);
    };

    useEffect(() => {
        if (error) {
            toast.error(error.message[0] || 'Something went wrong');
            setErrorMessage(error.message[0] || 'Something went wrong');
        }
    }, [error]);

    const handleChangeText = useCallback((key, value) => {
        setFormData(prev => ({
            ...prev,
            [key]: value,
        }));

        setFieldErrors(prev => ({
            ...prev,
            [key]: false,
        }));
    }, []);

    const formatPhoneNumber = (phone) => {
        const cleaned = phone.replace(/\D/g, '');

        if (cleaned.startsWith('260')) {
            return `+${cleaned}`;
        }

        if (cleaned.startsWith('0')) {
            return `+260${cleaned.substring(1)}`;
        }

        return `+260${cleaned}`;
    };

    const warning = containsPersonalInfo(
        formData.password,
        formData.email_add,
        formData.phone_num
    );

    const handleSignUp = async () => {
        const errors = {};

        if (!formData.email_add.trim()) {
            errors.email_add = 'Email address is required';
        }
        else if (!isValidEmail(formData.email_add)) {
            errors.email_add = 'Enter a valid email address';
        }

        if (!formData.phone_num.trim()) {
            errors.phone_num = 'Phone number is required';
        }
        else if (!isValidPhoneNumber(formData.phone_num)) {
            errors.phone_num = 'Enter a valid phone number';
        }

        // Password validations
        const passwordError = getPasswordError(formData.password);

        if (passwordError) {
            errors.password = passwordError;
        }

        if (!formData.confirm_password) {
            errors.confirm_password = 'Re-enter your password';
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            toast.error('Please complete all required fields');
            return;
        }

        if (
            formData.password &&
            formData.confirm_password &&
            formData.password !== formData.confirm_password
        ) {
            errors.confirm_password = 'Passwords do not match';
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            toast.error(Object.values(errors)[0]);
            return;
        }

        setFieldErrors({});

        const payload = {
            ...formData,
            phone_num: '+260' + normalizeZambianNumber(formData.phone_num)
        };

        try {
            const res = await post(payload);

            toast.success(`OTP sent, please check your ${formData.otp_type}`);

            // ✅ Delay navigation by 1.5 seconds so toast is visible
            setTimeout(() => {
                router.push({
                    pathname: '/otpauth',
                    params: {
                        contact: formData.otp_type === 'email' ? formData.email_add : formData.phone_num,
                        otp_type: formData.otp_type,
                        purpose: 'register',
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
                            contact: formData.otp_type === 'email' ? formData.email_add : formData.phone_num,
                            otp_type: formData.otp_type,
                            purpose: 'register',
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
        <>
        <SafeAreaView className="flex-1 bg-white px-5">
            <Headers header_name="Create Account" textStyles="text-2xl" fontFamily="ubuntu-medium" icon={<FontAwesome name="user" color={COLORS.slate} size={19} />} />

            <AuthLayout>
            <ScrollView showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <View className="w-full justify-center items-center mt-6">
                    <View className="w-full">

                        {/* Email */}
                        <Text
                            className="mb-2 text-black"
                            style={{ fontFamily: "roboto-medium" }}
                        >
                            Email Address {fieldErrors.email_add && (
                                <Text className='text-red'>*</Text>
                            )}
                        </Text>

                        <View
                            className="flex-row items-center px-3 mb-6"
                            style={{
                                borderWidth: 2,
                                borderColor:
                                    fieldErrors.email_add
                                        ? 'red'
                                        : focusedField === 'email'
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
                                    focusedField === "email"
                                        ? COLORS.green1
                                        : COLORS.black
                                }
                            />

                            <TextInput
                                placeholder="Email address"
                                placeholderTextColor={COLORS.gray}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                textContentType="emailAddress"
                                onChangeText={(value) => handleChangeText('email_add', value)}
                                onFocus={() => setFocusedField("email")}
                                onBlur={() => setFocusedField(null)}
                                style={{
                                    flex: 1,
                                    marginLeft: 10,
                                    height: "100%",
                                    fontFamily: "roboto",
                                    fontSize: 15,
                                }}
                            />
                        </View>
                        {fieldErrors.email_add && (
                            <Text
                                style={{
                                    color: 'red',
                                    marginTop: -15,
                                    marginBottom: 15,
                                    fontSize: 12,
                                }}
                            >
                                {fieldErrors.email_add}
                            </Text>
                        )}

                        {/* Phone */}
                        <Text
                            className="mb-2 text-black"
                            style={{ fontFamily: "roboto-medium" }}
                        >
                            Phone Number {fieldErrors.phone_num && (
                                <Text className='text-red'>*</Text>
                            )}
                        </Text>

                        <View
                            className="flex-row items-center px-3 mb-6"
                            style={{
                                borderWidth: 2,
                                borderColor:
                                    fieldErrors.phone_num
                                        ? 'red'
                                        : focusedField === 'phone'
                                            ? COLORS.green1
                                            : '#E5E7EB',
                                borderRadius: 10,
                                height: 50,
                            }}
                        >
                            <FontAwesome
                                name="phone"
                                size={20}
                                color={
                                    focusedField === "phone"
                                        ? COLORS.green1
                                        : COLORS.black
                                }
                            />

                            {/* Country Code */}
                            <View
                                style={{
                                    paddingLeft: 10,
                                    paddingRight: 5,
                                    justifyContent: "center",
                                    borderRightWidth: 1,
                                    borderRightColor: '#E5E7EB',
                                }}
                            >
                                <Text
                                    style={{
                                        color: COLORS.slate,
                                        fontFamily: "roboto-medium",
                                        fontSize: 15,
                                    }}
                                >
                                    +260
                                </Text>
                            </View>

                            {/* Input */}
                            <TextInput
                                placeholder="Eg: 971234567"
                                placeholderTextColor={COLORS.grey}
                                keyboardType="phone-pad"
                                maxLength={9}
                                onFocus={() => setFocusedField("phone")}
                                onBlur={() => setFocusedField(null)}
                                onChangeText={(value) => {
                                    const numbersOnly = value.replace(/\D/g, '');
                                    handleChangeText('phone_num', numbersOnly);
                                }}
                                style={{
                                    flex: 1,
                                    height: "100%",
                                    fontFamily: "roboto-medium",
                                    fontSize: 15,
                                    justifyContent: 'center'
                                }}
                            />
                        </View>
                        {fieldErrors.phone_num && (
                            <Text style={{
                                color: 'red',
                                fontSize: 12,
                                marginTop: -15,
                                marginBottom: 15,
                            }}
                            >
                                {fieldErrors.phone_num}
                            </Text>
                        )}

                        {/* Password */}
                        <Text
                            className="mb-2 text-black"
                            style={{ fontFamily: "roboto-medium" }}
                        >
                            Password {fieldErrors.password && (
                                <Text className='text-red'>*</Text>
                            )}
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
                            <Text style={{
                                color: 'red',
                                marginTop: 5,
                                marginBottom: 5,
                                fontSize: 12
                            }}
                            >
                                {fieldErrors.password}
                            </Text>
                        )}

                        <View className="mt-2">
                            <View
                                style={{
                                    height: 6,
                                    backgroundColor: '#E5E7EB',
                                    borderRadius: 999,
                                    overflow: 'hidden',
                                }}
                            >
                                <View
                                    style={{
                                        height: '100%',
                                        width: passwordStrength.width,
                                        backgroundColor: passwordStrength.color,
                                    }}
                                />
                            </View>

                            {formData.password.length > 0 && (
                                <Text
                                    style={{
                                        color: passwordStrength.color,
                                        marginTop: 4,
                                        fontSize: 12,
                                        fontFamily: 'roboto-medium',
                                    }}
                                >
                                    {passwordStrength.label}
                                </Text>
                            )}
                        </View>

                        {warning && (
                            <Text
                                style={{
                                    color: '#F59E0B',
                                    fontSize: 12,
                                    marginTop: 4,
                                }}
                            >
                                ⚠ Your password appears to contain part of your email address or phone number. Consider choosing a more unique password.
                            </Text>
                        )}

                        {/* Confirm Password */}
                        <Text
                            className="mb-2 mt-6 text-black"
                            style={{ fontFamily: "roboto-medium" }}
                        >
                            Confirm Password {fieldErrors.confirm_password && (
                                <Text className='text-red text'>*</Text>
                            )}
                        </Text>

                        <View
                            className="flex-row items-center px-3 mb-6"
                            style={{
                                borderWidth: 2,
                                borderColor:
                                    fieldErrors.confirm_password
                                        ? 'red'
                                        : focusedField === 'confirmPassword'
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
                                    focusedField === "confirmPassword"
                                        ? COLORS.green1
                                        : COLORS.black
                                }
                            />

                            <TextInput
                                placeholder="Re-enter password"
                                placeholderTextColor={COLORS.gray}
                                secureTextEntry={!showConfirmPassword}
                                autoCorrect={false}
                                textContentType="newPassword"
                                onFocus={() => setFocusedField("confirmPassword")}
                                onBlur={() => setFocusedField(null)}
                                onChangeText={(value) => handleChangeText('confirm_password', value)}
                                style={{
                                    flex: 1,
                                    marginLeft: 10,
                                    height: "100%",
                                    fontFamily: "roboto",
                                    fontSize: 15,
                                }}
                            />

                            <TouchableOpacity
                                onPress={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                <Entypo
                                    name={showConfirmPassword ? "eye-with-line" : "eye"}
                                    size={23}
                                    color={COLORS.slate}
                                />
                            </TouchableOpacity>
                        </View>
                        {fieldErrors.confirm_password && (
                            <Text style={{ color: 'red', marginTop: -15, marginBottom: 15, fontSize: 12 }}>
                                {fieldErrors.confirm_password}
                            </Text>
                        )}

                    </View>
                    <View className="w-full">
                        <TouchableOpacity
                            style={{borderRadius: 10, height: 50}}
                            className={`bg-primary justify-center items-center ${isLoading ? 'opacity-50' : 'opacity-100'} elevation-sm border border-primary`}
                            disabled={isLoading}
                            accessibilityLabel="Sign up button"
                            onPress={() => handleSignUp()}
                        >
                            {isLoading ? <ActivityIndicator size={25} color='white'/> :
                                <Text
                                    className='text-white text-2xl'
                                    style={{fontFamily: 'maven-medium'}}
                                >
                                    Sign Up
                                </Text>
                            }
                        </TouchableOpacity>
                    </View>

                    <View className="w-full flex-row justify-start items-center my-5">
                        <Text className="text-slate text-sm">Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.push('/login/')} className="ml-2">
                            <Text className="font-bold text-primary">Tap here</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            
            </AuthLayout>
        </SafeAreaView>
        {isLoading && <OverLay/>}
        </>
    );
};

export default Register;
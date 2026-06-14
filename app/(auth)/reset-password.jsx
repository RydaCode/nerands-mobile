import { Entypo, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import Headers from '../../components/Headers';
import { COLORS } from '../../constants/constants';
import useApi from '../../hook/useApi';
import { setUserData } from '../../redux/store/slices/authSlice';
import { toast } from '../../utils/toast';
import AuthLayout from '../AuthLayout';
import OverLay from '../OverLay';
import { getPasswordStrength } from './getPasswordStrength';
import { handleLoginSuccess } from './handleLoginSuccess';
import { containsPersonalInfo, getPasswordError } from './passwordValidator';

const ResetPassword = () => {
    const dispatch = useDispatch();
    const [resettoken, setToken] = useState(null);
    useEffect(() => {
        const getToken = async () => {
            const storedToken = await SecureStore.getItemAsync(
                'password_reset_token'
            );
            setToken(storedToken);
        };

        getToken();
    }, []);

    const params = useLocalSearchParams();
    const [formData, setFormData] = useState({
        user_id: params.user_id,
        contact: params.contact,
        otp_type: "email",
        purpose: "reset_password",
        password: '',
        confirm_password: '',
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [focusedField, setFocusedField] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [phone, setPhone] = useState("");
    const router = useRouter();

    // Custom hook for API call
    const { data, isLoading, error, post } = useApi('/auth/user/reset-password');

    // Helper function to validate email address
    
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

    useEffect(() => {
        if (error) {
            toast.error(error.message || 'Something went wrong');
            setErrorMessage(error.message || 'Something went wrong');
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

    const warning = containsPersonalInfo(
        formData.password
    );

    const handleSignUp = async () => {
        const errors = {};

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
            token: resettoken
        };

        const res = await post(payload);
        
        console.log(res?.data?.data)

        if (res?.data?.data?.success) {
            const { token, refresh_token } = res?.data?.data;
            
            await handleLoginSuccess({
                token,
                refresh_token,
                dispatch,
                setUserData,
                purpose: 'login'
            });

            await SecureStore.deleteItemAsync('password_reset_token');
            toast.success(`Password reset successful. Welcome back!`);
            return;
        } else {
            toast.error(`Password reset failed. Please try again.`);
        }
    };
    
    return (
        <>
        <SafeAreaView className="flex-1 bg-white px-5">
            <Headers header_name="Reset Password" textStyles="text-2xl" fontFamily="ubuntu-medium" icon={<FontAwesome name="user" color={COLORS.slate} size={19} />} />

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
                        {/* Password */}
                        <Text
                            className="mb-2 text-black"
                            style={{ fontFamily: "roboto-medium" }}
                        >
                            New Password {fieldErrors.password && (
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
                                    Reset
                                </Text>
                            }
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

export default ResetPassword;
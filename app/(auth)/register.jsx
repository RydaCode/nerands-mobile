import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/Buttons/CustomButton';
import FormInputs from '../../components/FormFields/FormInputs';
import MainHeader from '../../components/MainHeader';
import { COLORS } from '../../constants/constants';
import useApi from '../../hook/useApi';
import { toast } from '../../utils/toast';
import LoadingIndicator from '../LoadingIndicator';
import Redirecting from '../Redirecting';

const Register = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email_add: '',
        phone_num: '',
        password: '',
        confirm_password: '',
    });

    const [agreement, setAgreement] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    // Custom hook for API call
    const { send, isLoading, error, post } = useApi('/auth/user/register', formData);

    console.log(error)

    useEffect(() => {
        if (send) {
            if (send?.success === true) {
                toast.success(send?.message || 'Account created successfully!');
                setIsSuccess(true);

                // ✅ Delay navigation by 1.5 seconds so toast is visible
                setTimeout(() => {
                    router.replace(`/(routes)/sign-in/?phone_num=${formData.phone_num}`);
                }, 1500);
            } else {
                toast.error(send?.message || 'Something went wrong');
            }
        }
    }, [send]);

    useEffect(() => {
        if (error) {
            toast.error(error.message || 'Something went wrong');
        }
    }, [error]);

    const handleChangeText = useCallback((key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleSignUp = () => {
        setErrorMessage('');

        // Validation Messages
        const validationMessages = {
            first_name: 'Enter First Name!',
            last_name: 'Enter Last Name!',
            email_add: 'Enter Email Address!',
            phone_num: 'Enter Phone Number!',
            password: 'Enter Password!',
            confirm_password: 'Re-enter Password!',
            agreement: 'You must agree to the terms and conditions.',
            passwordMismatch: 'Passwords do not match!',
        };

        // Validate required fields
        for (const [key, value] of Object.entries(formData)) {
            if (!value) {
                toast.error(validationMessages[key]);
                return;
            }
        }

        // Validate password match
        if (formData.password !== formData.confirm_password) {
            toast.error(validationMessages.passwordMismatch);
            return;
        }

        // Validate agreement checkbox
        if (!agreement) {
            toast.error(validationMessages.agreement);
            return;
        }
        // If all validations pass, send request
        post();
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-4">
                <MainHeader fontFamily='maven-bold' header_name="Sign Up" />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="w-full justify-center items-center px-4 mt-6">
                    {/* <Text className="text-xl mb-4" style={{ fontFamily: 'maven-bold' }}>
                        Create New Account
                    </Text> */}
                    <View className="w-full">
                        {[{ key: 'first_name', label: 'First Name' }, { key: 'last_name', label: 'Last Name' }].map(
                            ({ key, label }, index) => (
                                <FormInputs
                                    key={index}
                                    title={label}
                                    handleChangeText={(value) => handleChangeText(key, value)}
                                    desc={`Please enter ${label}.`}
                                    borderStyle="border border-lavender"
                                />
                            )
                        )}

                        {/* Gender Picker */}
                        <View className="w-full mt-3 mb-2">
                            <Text className="text-base mb-2" style={{ fontFamily: 'maven-bold' }}>
                                Gender
                            </Text>
                            <View className="border border-lavender rounded-lg">
                                <Picker
                                    selectedValue={formData.gender}
                                    onValueChange={(value) => handleChangeText('gender', value)}
                                    style={{ height: 50, width: '100%' }}
                                >
                                    <Picker.Item label="Select Gender" value="" />
                                    <Picker.Item label="Male" value="male" />
                                    <Picker.Item label="Female" value="female" />
                                </Picker>
                            </View>
                        </View>

                        {/* Remaining Fields */}
                        {[
                            { key: 'email_add', label: 'Email Address' },
                            { key: 'phone_num', label: 'Phone Number' },
                            { key: 'password', label: 'Password' },
                            { key: 'confirm_password', label: 'Confirm Password' },
                        ].map(({ key, label }, index) => (
                            <FormInputs
                                key={index}
                                title={label}
                                secureTextEntry={key.includes('password')}
                                handleChangeText={(value) => handleChangeText(key, value)}
                                desc={`Please enter ${label}.`}
                                borderStyle="border border-lavender"
                            />
                        ))}
                    </View>

                    <View className="w-full">
                        <Text className="text-slate text-sm">
                            By pressing the Sign-Up button, you agree to the Terms and Conditions of Nerands.
                        </Text>
                        <View className="my-5">
                            <BouncyCheckbox
                                isChecked={agreement}
                                onPress={() => setAgreement(!agreement)}
                                text="I Agree"
                                textStyle={{
                                    textDecorationLine: 'none',
                                    color: COLORS.slate,
                                    marginLeft: -10,
                                    fontSize: 13,
                                }}
                                size={20}
                                fillColor={COLORS.primary}
                                iconStyle={{ borderColor: COLORS.primary, borderRadius: 2 }}
                                innerIconStyle={{ borderWidth: 2, borderRadius: 2 }}
                                accessibilityLabel="Agree to Terms and Conditions"
                            />
                        </View>
                    </View>

                    <View className="w-full">
                        <CustomButton
                            title={isLoading ? 'Loading...' : 'Continue'}
                            handlePress={handleSignUp}
                            disabled={isLoading || !agreement}
                            otherStyles={`bg-primary p-4 mt-4 ${agreement ? 'opacity-100' : 'opacity-50'} ${
                                isLoading ? 'opacity-50' : 'opacity-100'
                            }`}
                            textStyles="text-xl"
                            accessibilityLabel="Sign up button"
                        />
                    </View>

                    <View className="w-full flex-row justify-start items-center my-5">
                        <Text className="text-slate text-sm">Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.push('/(routes)/sign-in/')} className="ml-2">
                            <Text className="font-bold text-primary">Click Here</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            {isLoading && <LoadingIndicator loading_text="Creating Account..." />}
            {isSuccess && <Redirecting title="Please wait..." />}
        </SafeAreaView>
    );
};

export default Register;
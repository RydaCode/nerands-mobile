import { FontAwesome } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { SafeAreaView } from 'react-native-safe-area-context'
import Headers from '../../components/Headers'
import { COLORS } from '../../constants/constants'
import { useUpdateUserData } from '../../utils/api/auth/useUpdateUserData'
import { toast } from '../../utils/toast'
import AuthLayout from '../AuthLayout'
import OverLay from '../OverLay'

const PersonalDetails = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [isSuccess, setIsSuccess] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [selectedGender, setSelectedGender] = useState();
    const [errorMessage, setErrorMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        gender: selectedGender,
        user_id: params.user_id
    });

    const genderOptions = [
        { label: 'Select gender', value: '' },
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
    ];

    const handleGenderChange = (value) => {
        setSelectedGender(value); // Update selected gender in state
        setFormData((prev) => ({
            ...prev,
            gender: value, // Update gender in formData
        }));
    };

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

    // Api call
    const { data, error: serverErrors, isLoading, updateUserData } = useUpdateUserData();

    const handleUpdateDetails = async () => {
        const errors = {};

        if (!formData.first_name.trim()) {
            errors.first_name = 'First name is required';
        }

        if (!formData.last_name.trim()) {
            errors.last_name = 'Last name is required';
        }

        if (!formData.gender) {
            errors.gender = 'Select gender';
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            toast.error('Please complete all required fields');
            return;
        }

        try {
            const res = await updateUserData(formData);

            if (res?.success) {
                toast.success('Personal Detail Updated Successfully');
                router.replace({
                    pathname: './otherinputs',
                    params: {user_id: params.user_id}
                });
            } else {
                toast.error(res?.message || 'Update failed');
            }

        } catch (error) {
            toast.error(error?.message || 'An error occurred');
        }
    }
    
    return (
        <AuthLayout>
        <SafeAreaView className="flex-1 bg-white px-5">
            
            <Headers header_name="Personal Details" textStyles="text-2xl" fontFamily="ubuntu-medium" icon={<FontAwesome name="user" color={COLORS.slate} size={19} />} />
            
            <ScrollView showsVerticalScrollIndicator={false} className="w-full"
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <View className="w-full justify-center items-center">
                    <View className="w-full">
                        {/* Email */}
                        <Text
                            className="mb-2 text-black"
                            style={{ fontFamily: "roboto-medium" }}
                        >
                            First Name {fieldErrors.first_name && (
                                <Text className='text-red'>*</Text>
                            )}
                        </Text>

                        <View
                            className="flex-row items-center px-3 mb-6"
                            style={{
                                borderWidth: 2,
                                borderColor:
                                    fieldErrors.first_name
                                        ? 'red'
                                        : focusedField === 'first_name'
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
                                    focusedField === "first_name"
                                        ? COLORS.green1
                                        : COLORS.black
                                }
                            />

                            <TextInput
                                placeholder="Eg: Brandy"
                                placeholderTextColor={COLORS.gray}
                                keyboardType="default"
                                autoCapitalize="words"
                                autoCorrect={false}
                                textContentType="firstName"
                                onFocus={() => setFocusedField("first_name")}
                                onBlur={() => setFocusedField(null)}
                                onChangeText={(value) => handleChangeText('first_name', value)}
                                style={{
                                    flex: 1,
                                    marginLeft: 10,
                                    height: "100%",
                                    fontFamily: "roboto",
                                    fontSize: 15,
                                }}
                            />
                        </View>
                    </View>

                    
                    <View className="w-full">
                        {/* Last name */}
                        <Text
                            className="mb-2 text-black"
                            style={{ fontFamily: "roboto-medium" }}
                        >
                            Last Name
                        </Text>

                        <View
                            className="flex-row items-center px-3 mb-6"
                            style={{
                                borderWidth: 2,
                                borderColor:
                                    fieldErrors.last_name
                                        ? 'red'
                                        : focusedField === 'last_name'
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
                                    focusedField === "lastName"
                                        ? COLORS.green1
                                        : COLORS.black
                                }
                            />

                            <TextInput
                                placeholder="Eg: Nyimbili"
                                placeholderTextColor={COLORS.gray}
                                keyboardType="default"
                                autoCapitalize="words"
                                autoCorrect={false}
                                textContentType="lastName"
                                onFocus={() => setFocusedField("last_name")}
                                onBlur={() => setFocusedField(null)}
                                onChangeText={(value) => handleChangeText('last_name', value)}
                                style={{
                                    flex: 1,
                                    marginLeft: 10,
                                    height: "100%",
                                    fontFamily: "roboto",
                                    fontSize: 15,
                                }}
                            />
                        </View>
                    </View>

                    <View className="w-full">
                        {/* Last name */}
                        <Text
                            className="mb-2 text-black"
                            style={{ fontFamily: "roboto-medium" }}
                        >
                            Gender
                        </Text>

                        <View
                            className="flex-row items-center px-3 mb-6"
                            style={{
                                borderWidth: 2,
                                borderColor:
                                    fieldErrors.gender
                                        ? 'red'
                                        : focusedField === 'gender'
                                            ? COLORS.green1
                                            : '#E5E7EB',
                                borderRadius: 10,
                                height: 50,
                            }}
                        >
                            <FontAwesome
                                name="venus-mars"
                                size={20}
                                color={
                                    focusedField === "gender"
                                        ? COLORS.green1
                                        : COLORS.black
                                }
                            />

                            <Dropdown
                                data={genderOptions}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Gender"
                                value={selectedGender}
                                onChange={(item) => {
                                    handleGenderChange(item.value);
                                }}
                                onFocus={() => setFocusedField("gender")}
                                onBlur={() => setFocusedField(null)}
                                style={{
                                    width: '100%',
                                    borderColor: COLORS.lavender,
                                    borderRadius: 5,
                                    paddingHorizontal: 12,
                                    height: 50,
                                }}
                            />
                        </View>
                    </View>

                    <View className="w-full">
                        <TouchableOpacity
                            className="bg-primary py-3 rounded-lg mt-6 justify-center items-center"
                            onPress={() => handleUpdateDetails()}
                        >
                            {isLoading ? <ActivityIndicator size={25} color='white'/> :
                                <Text className='text-white font-medium text-2xl' style={{fontFamily: 'maven-medium'}}>
                                    Submit
                                </Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            
        </SafeAreaView>
        {isLoading && <OverLay/>}
        </AuthLayout>
    )
}

export default PersonalDetails
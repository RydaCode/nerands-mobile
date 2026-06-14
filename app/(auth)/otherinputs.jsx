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

const otherInputs = () => {
    const params = useLocalSearchParams();
    const router = useRouter();
    const [isSuccess, setIsSuccess] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [selectedProvince, setSelectedProvince] = useState();
    const [fieldErrors, setFieldErrors] = useState({});

    const [formData, setFormData] = useState({
        user_id: params.user_id,
        province: selectedProvince,
        city: '',
        is_verified: true
    });

    const provinceOptions = [
        { label: 'Select province', value: '' },
        { label: 'Lusaka', value: 'Lusaka' },
        { label: 'Copper-Belt', value: 'Copper-Belt' },
        { label: 'Central', value: 'Central' },
        { label: 'Eastern', value: 'Eastern' },
        { label: 'Northern', value: 'Northern' },
        { label: 'Muchinga', value: 'Muchinga' },
        { label: 'Southern', value: 'Southern' },
        { label: 'Western', value: 'Western' },
        { label: 'North-Western', value: 'North-Western' },
        { label: 'Luapula', value: 'Luapula' },
    ];

    const handleProvinceChange = (value) => {
        setSelectedProvince(value); // Update selected province in state
        setFormData((prev) => ({
            ...prev,
            province: value, // Update province in formData
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

        if (!formData.province) {
            errors.province = 'Select province';
        }

        if (!formData.city.trim()) {
            errors.city = 'City / Town is required';
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            toast.error('Please complete all required fields');
            return;
        }

        try {
            const res = await updateUserData(formData);

            if (res?.success) {
                toast.success('Location Details Updated Successfully');
                router.replace({
                    pathname: '../(routes)/user-account',
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
            
            <Headers header_name="Location Details" textStyles="text-2xl" fontFamily="ubuntu-medium" icon={<FontAwesome name="location" color={COLORS.slate} size={19} />} />

            
            <ScrollView showsVerticalScrollIndicator={false} className="w-full"
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <View className="w-full justify-center items-center">
                    <View className="w-full">
                        {/* Province */}
                        <Text
                            className="mb-2 text-black"
                            style={{ fontFamily: "roboto-medium" }}
                        >
                            Province
                        </Text>

                        <View
                            className="flex-row items-center px-3 mb-6"
                            style={{
                                borderWidth: 2,
                                borderColor:
                                    fieldErrors.province
                                        ? 'red'
                                        : focusedField === 'province'
                                            ? COLORS.green1
                                            : '#E5E7EB',
                                borderRadius: 10,
                                height: 50,
                            }}
                        >
                            <FontAwesome
                                name="globe"
                                size={20}
                                color={
                                    focusedField === "province"
                                        ? COLORS.green1
                                        : COLORS.black
                                }
                            />

                            <Dropdown
                                data={provinceOptions}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Province"
                                value={selectedProvince}
                                onChange={(item) => {
                                    handleProvinceChange(item.value);
                                }}
                                onFocus={() => setFocusedField("province")}
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
                        {/* City */}
                        <Text
                            className="mb-2 text-black"
                            style={{ fontFamily: "roboto-medium" }}
                        >
                            City
                        </Text>

                        <View
                            className="flex-row items-center px-3 mb-6"
                            style={{
                                borderWidth: 2,
                                borderColor:
                                    fieldErrors.city
                                        ? 'red'
                                        : focusedField === 'city'
                                            ? COLORS.green1
                                            : '#E5E7EB',
                                borderRadius: 10,
                                height: 50,
                            }}
                        >
                            <FontAwesome
                                name="map-marker"
                                size={20}
                                color={
                                    focusedField === "city"
                                        ? COLORS.green1
                                        : COLORS.black
                                }
                            />

                            <TextInput
                                placeholder="Eg: Chingola"
                                placeholderTextColor={COLORS.gray}
                                keyboardType="default"
                                autoCapitalize="words"
                                autoCorrect={false}
                                textContentType="city"
                                onFocus={() => setFocusedField("city")}
                                onBlur={() => setFocusedField(null)}
                                onChangeText={(value) => handleChangeText('city', value)}
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
        </AuthLayout>
    )
}

export default otherInputs
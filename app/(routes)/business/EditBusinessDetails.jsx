import { Entypo, FontAwesome6 } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { MotiView } from 'moti'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormInputs from '../../../components/FormFields/FormInputs'
import Headers from '../../../components/Headers'
import { COLORS } from '../../../constants/constants'
import useApi from '../../../hook/useApi'
import { usePermissions } from '../../../hook/usePermissions'
import { capitalize } from '../../../utils/capitalize'
import { provinceOptions } from '../../../utils/provinceOptions'
import { toast } from '../../../utils/toast'
import SelectCategoryModal from './SelectCategoryModal'
import { businessType } from './businessType'

const EditBusinessModal = () => {
    const params = useLocalSearchParams();
    const router = useRouter();
    const [selectCategory, setSelectCategory] = useState(null);
    const [openSelectCategory, setOpenSelectCategory] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState(null);

    const { can } = usePermissions();
    const [errors, setErrors] = useState({});

    const {data: categories, isLoading: loadingCategories, error: errorCategories, get: getCategorires} = useApi(
        `/businesses/categories/all`
    );

    useEffect(() => {
        if (params.user_id) {
            getCategorires();   
        }
    }, [params.user_id]);

    const {data, isLoading, error, patch} = useApi(
        `/businesses/update`
    );

    const [formData, setFormData] = useState({
        business_id: params?.business_id,
        legal_name: params.legal_name || '',
        display_name: params.display_name || '',
        phone: params.phone || '',
        email: params.email || '',
        province: params.province || '',
        city: params.city || '',
        address: params.address || ''
    });

    useEffect(() => {
        if (params?.category_id && params?.business_type) {
            setFormData(prev => ({
                ...prev,
                category_id: selectCategory?.id || params.category_id || '',
                business_type: params?.business_type || ''
            }));
        }
    }, [params?.category_id, selectCategory?.id, params?.business_type]);

    const handleChangeText = useCallback((key, value) => {
        setFormData(prev => ({
            ...prev,
            [key]: value,
        }));

        setErrors(prev => {
            const updated = { ...prev };
            delete updated[key];
            return updated;
        });
    }, []);

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

    const updateBusinessDetails = async () => {
        let newErrors = {};
        
        if (!params.user_id) {
            newErrors.user_id = "User ID is required.";
        }

        if (!formData.business_id) {
            newErrors.business_id = "Business ID is required.";
        }
        
        if (!formData.legal_name) {
            newErrors.legal_name = "Business name is required.";
        }

        if (!formData.business_type) {
            newErrors.business_type = "Please select business type.";
        }

        if (!formData.display_name) {
            newErrors.display_name = "Select display name.";
        }

        if (!formData.phone) {
            newErrors.phone = "Enter phone number.";
        }

        if (!formData.email) {
            newErrors.email = "Enter email address.";
        }

        if (!formData.category_id) {
            newErrors.category_id = "Select category.";
        }

        if (!formData.province) {
            newErrors.province = "Select province.";
        }

        if (!formData.city) {
            newErrors.city = "Please enter city.";
        }

        if (!formData.address) {
            newErrors.address = "Please physical address.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast.error("Please fix the highlighted fields");
            return;
        }

        try {
            const payload = {
                ...formData,
                phone: '+260' + normalizeZambianNumber(formData.phone)
            };

            const res = await patch(payload);
            if (res?.success) {
                toast.success(res?.message || "Business details updated");
                router.back()
                return;
            }
            else if (!res?.success) {
                toast.error(res?.message || "Business details was not updatad");
                return;
            }
            else if (error) {
                toast.error(error.message || "Business details was not updatad, try again later");
                return;
            }
        } catch (err) {
            toast.error(err.message || "Failed to update Business details");
            return;
        }
    }

    return (
        <SafeAreaView className='flex-1 bg-white px-4'>
            <MotiView
                from={{ opacity: 0, translateY: 80 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 300 }}
                style={{borderTopLeftRadius: 20, borderTopRightRadius: 20}}
                className="bg-white pt-3 mb-0"
            >
                <Headers header_name='Business Hub'
                    fontFamily='outfit-medium'
                    textStyles='text-2xl'
                    icon={<Entypo name='menu' size={24} color={COLORS.slate}/>}
                />

                {/* Content */}
                <ScrollView className='w-full' contentContainerStyle={{paddingBottom: 200}} showsVerticalScrollIndicator={false}>
                    <View className="bg-grey_bg rounded-xl justify-between items-center my-8">
                        <Text
                            className="text-xl"
                            style={{ fontFamily: "outfit-medium" }}
                        >
                            Edit Business Details
                        </Text>
                    </View>

                    <FormInputs
                        title="Business Name"
                        handleChangeText={(value) =>
                            handleChangeText("name", value)
                        }
                        defaultValue={params?.legal_name}
                        borderStyle={`border ${errors.legal_name ? "border-red" : "border-[#E2E8F0]"}`}
                        autoFocus={true}
                        error={errors.legal_name}
                    />

                    <FormInputs
                        title="Display Name"
                        handleChangeText={(value) =>
                            handleChangeText("display_name", value)
                        }
                        defaultValue={params?.display_name}
                        placeholder='Eg: Nerands Cafe'
                        borderStyle={`border ${errors.display_name ? "border-red" : "border-[#E2E8F0]"}`}
                        autoFocus={true}
                        error={errors.display_name}
                    />

                    <View className='mt-4 mb-6'>
                        <Text className="text-base mb-1" style={{ fontFamily: "roboto-bold" }}>Business Type</Text>
                        <Text
                            className="text-sm mb-1 text-slate"
                            style={{ fontFamily: "roboto-medium", textAlign: 'justify' }}
                        >
                            Please select the business type.
                        </Text>
                        <Dropdown
                            data={businessType}
                            labelField="label"
                            valueField="value"
                            placeholder={capitalize(params?.business_type)}
                            value={formData.business_type}
                            mode="modal"
                            onChange={(item) => {
                                setFormData(prev => ({
                                    ...prev,
                                    business_type: item.value
                                }));
                            }}

                            style={{
                                borderWidth: 2,
                                borderColor: errors.business_type ? "red" : "#E2E8F0",
                                borderRadius: 12,
                                paddingHorizontal: 12,
                                height: 50,
                            }}
                        />
                        {errors.business_type && (
                            <Text className='text-red text-sm my-2' style={{fontFamily: 'roboto'}}>
                                {errors.business_type} *
                            </Text>
                        )}
                    </View>

                    {/* Phone */}
                    <Text
                        className="mb-2 text-black"
                        style={{ fontFamily: "roboto-medium" }}
                    >
                        Phone Number {errors.phone && (
                            <Text className='text-red'>*</Text>
                        )}
                    </Text>

                    <View
                        style={{
                            borderWidth: 2,
                            borderColor: errors.phone ? 'red' : '#E2E8F0',
                            borderRadius: 10,
                            height: 50,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 12,
                            marginBottom: 20,
                        }}
                    >
                        <Text style={{ fontFamily: "roboto-medium", marginRight: 8 }}>
                            +260
                        </Text>

                        <TextInput
                            defaultValue={params?.phone}
                            keyboardType="phone-pad"
                            maxLength={9}
                            value={formData.phone}
                            onChangeText={(value) => {
                                const numbersOnly = (value || '').replace(/\D/g, '');
                                handleChangeText('phone', numbersOnly);
                            }}
                            style={{
                                flex: 1,
                                fontFamily: "roboto-medium",
                            }}
                        />
                    </View>

                    {errors.phone && (
                        <Text style={{ color: 'red', fontSize: 12, marginBottom: 15, marginTop: -12 }}>
                            {errors.phone}
                        </Text>
                    )}

                    <FormInputs
                        title="Email address"
                        handleChangeText={(value) =>
                            handleChangeText("email", value)
                        }
                        mode="modal"
                        defaultValue={params?.email}
                        borderStyle={`border ${errors.email ? "border-red" : "border-[#E2E8F0]"}`}
                        autoFocus={true}
                        keyboardType={'email'}
                        error={errors.email}
                    />

                    {/* Select category */}
                    <View className='mt-2'>
                        <Text
                            className='text-base mb-2'
                            style={{fontFamily: 'roboto-medium'}}
                        >Category</Text>
                        <TouchableOpacity
                            style={{height: 50, borderColor: errors.category_id ? 'red' : '#E2E8F0',}}
                            className='border-2 flex-row px-3 rounded-xl justify-between items-center'
                            onPress={() => setOpenSelectCategory(true)}
                        >
                            <Text
                                className='text-lg'
                                style={{fontFamily: 'roboto'}}
                            >{selectCategory?.name || capitalize(params?.category_id)}</Text>
                            <FontAwesome6 name='angle-down' color={COLORS.slate}/>
                        </TouchableOpacity>

                        {errors.category_id && (
                            <Text style={{ color: 'red', fontSize: 12, marginBottom: 15, marginTop: 6 }}>
                                {errors.category_id}
                            </Text>
                        )}
                    </View>

                    <View className="my-5">
                        <Text className="text-base mb-1" style={{ fontFamily: "roboto-bold" }}>Province</Text>
                        <Text
                            className="text-sm mb-1 text-slate"
                            style={{ fontFamily: "roboto-medium", textAlign: 'justify' }}
                        >
                            Please select the province where the business HQ is located.
                        </Text>
                        <Dropdown
                            data={provinceOptions}
                            labelField="label"
                            valueField="value"
                            placeholder={capitalize(params?.province)}
                            value={formData.province}
                            mode="modal"
                            onChange={(item) => {
                                setFormData(prev => ({
                                    ...prev,
                                    province: item.value
                                }));
                            }}

                            style={{
                                borderWidth: 2,
                                borderColor: errors.province ? "red" : "#E2E8F0",
                                borderRadius: 12,
                                paddingHorizontal: 12,
                                height: 50,
                            }}
                        />
                        {errors.province && (
                            <Text className='text-red text-sm my-2' style={{fontFamily: 'roboto'}}>
                                {errors.province}
                            </Text>
                        )}
                    </View>

                    <FormInputs
                        title="City"
                        handleChangeText={(value) =>
                            handleChangeText("city", value)
                        }
                        defaultValue={params?.city}
                        borderStyle={`border ${errors.city ? "border-red" : "border-[#E2E8F0]"}`}
                        autoFocus={true}
                        error={errors.city}
                    />

                    <FormInputs
                        title="Address"
                        handleChangeText={(value) =>
                            handleChangeText("address", value)
                        }
                        defaultValue={params?.address}
                        borderStyle={`border ${errors.address ? "border-red" : "border-[#E2E8F0]"}`}
                        autoFocus={true}
                        error={errors.address}
                    />




                    <TouchableOpacity
                        className='bg-red py-3 rounded-2xl justify-center items-center mt-8'

                        onPress={() => {
                            if (!can('update_business_settings')) {
                                toast.error('You do not have permissions to edit business');
                                return;
                            }
                            updateBusinessDetails();
                        }}

                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size={27} color={COLORS.white}/>
                        ) : (
                            <Text
                                style={{fontFamily: 'outfit-medium'}}
                                className='text-white text-2xl'
                            >Update</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </MotiView>

            <SelectCategoryModal
                selectCategory={selectCategory}
                setSelectCategory={setSelectCategory}
                openSelectCategory={openSelectCategory}
                setOpenSelectCategory={setOpenSelectCategory}
                expandedCategory={expandedCategory}
                setExpandedCategory={setExpandedCategory}
                categories={categories}
            />
        </SafeAreaView>
    )
}

export default EditBusinessModal
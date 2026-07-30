import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormInputs from '../../../components/FormFields/FormInputs';
import Headers from '../../../components/Headers';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { provinceOptions } from '../../../utils/provinceOptions';
import { toast } from '../../../utils/toast';
import SelectCategoryModal from './SelectCategoryModal';
import { businessType } from './businessType';

const CreateBusiness = () => {
    const params = useLocalSearchParams();
    const router = useRouter();
    const [errors, setErrors] = useState({});
    const [selectCategory, setSelectCategory] = useState(null);
    const [openSelectCategory, setOpenSelectCategory] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState(null);

    const {data: categories, isLoading: loadingCategories, error: errorCategories, get: getCategorires} = useApi(
        `/businesses/categories/all`
    );

    useEffect(() => {
        if (params.user_id) {
            getCategorires();   
        }
    }, [params.user_id]);

    const {data, isLoading, error, post} = useApi(
        `/businesses/create`
    );
    const [formData, setFormData] = useState({
        user_id: params.user_id,
        legal_name: '',
        display_name: '',
        email: '',
        phone: '',
        country: '',
        province: '',
        city: '',
        address: '',
        country: 'Zambia'
    });

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            category_id: selectCategory?.id || '',
        }));
    }, [selectCategory]);

    console.log("FROM", formData)

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

    const createBusiness = async () => {
        let newErrors = {};
        
        if (!formData.user_id) {
            newErrors.user_id = "User ID is required.";
        }
        
        if (!formData.legal_name) {
            newErrors.legal_name = "Business name is required.";
        }

        if (!formData.business_type) {
            newErrors.business_type = "Select business type.";
        }

        if (!formData.display_name) {
            newErrors.display_name = "Enter business display name.";
        }

        if (!formData.email) {
            newErrors.email = "Enter email address.";
        }

        if (!formData.phone) {
            newErrors.phone = "Enter phone number.";
        }

        if (!formData.province) {
            newErrors.province = "Select province.";
        }

        if (!formData.city) {
            newErrors.city = "Enter city.";
        }

        if (!formData.address) {
            newErrors.address = "Enter physical address.";
        }

        if (!formData.category_id) {
            newErrors.category_id = "Select business category.";
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

            const res = await post(payload);
            if (res?.success) {
                toast.success(res?.message || "New business created");
                router.back();
                return;
            }
            else if (!res?.success) {
                toast.error(res?.message || "New business was not created");
                return;
            }
            else if (error) {
                toast.error(error.message || "New business was not created, try again later");
                return;
            }
        } catch (err) {
            toast.error(err.message || "Failed to create new business");
            return;
        }
    }

    return (
        // <AuthLayout>
            <SafeAreaView className='flex-1 bg-white items-center px-4 justify-between'>
                <Headers header_name='Business Hub' fontFamily='outfit-medium' textStyles='text-2xl' icon={<Ionicons name='business-sharp' size={15} color={COLORS.primary}/>}/>
                <View className='w-full flex-1  justify-center items-center'>
                    {/* Content */}
                    <ScrollView className='w-full' showsVerticalScrollIndicator={false} contentContainerStyle={{justifyContent: 'center', paddingBottom: 200}}>
                        <View className='bg-grey_bg mb-8 mt-6 px-1 py-1 rounded'>
                            <Text
                                className='text-xl'
                                style={{fontFamily: 'roboto-medium'}}
                            >Create New Business</Text>
                        </View>
                        
                        <FormInputs
                            title="Business Name"
                            handleChangeText={(value) =>
                                handleChangeText("legal_name", value)
                            }
                            placeholder='Eg Demula Enterprises Ltd.'
                            borderStyle={`border ${errors.legal_name ? "border-red" : "border-[#E2E8F0]"}`}
                            autoFocus={true}
                            error={errors.legal_name}
                        />

                        <FormInputs
                            title="Display Name"
                            handleChangeText={(value) =>
                                handleChangeText("display_name", value)
                            }
                            placeholder='Eg: Nerands Cafe'
                            borderStyle={`border ${errors.display_name ? "border-red" : "border-[#E2E8F0]"}`}
                            autoFocus={true}
                            error={errors.display_name}
                        />

                        <View className='mt-2 mb-4'>
                            <Text className="text-base mb-1" style={{ fontFamily: "roboto-medium" }}>Business Type</Text>
                            {/* <Text
                                className="text-sm mb-1 text-slate"
                                style={{ fontFamily: "roboto-medium", textAlign: 'justify' }}
                            >
                                Select the business type.
                            </Text> */}
                            <Dropdown
                                data={businessType}
                                labelField="label"
                                valueField="value"
                                placeholder='Select business type'
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
                                placeholder="Eg: 971234567"
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
                            placeholder='Eg: info1234xxx@gmail.com'
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
                                >{selectCategory?.name || 'Select category'}</Text>
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
                                placeholder="Select Province"
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
                            placeholder='Eg: Kasama'
                            borderStyle={`border ${errors.city ? "border-red" : "border-[#E2E8F0]"}`}
                            autoFocus={true}
                            error={errors.city}
                        />

                        <FormInputs
                            title="Physical address"
                            handleChangeText={(value) =>
                                handleChangeText("address", value)
                            }
                            placeholder='Eg: Common wealth road.'
                            borderStyle={`border ${errors.address ? "border-red" : "border-[#E2E8F0]"}`}
                            autoFocus={true}
                            error={errors.address}
                        />
                    </ScrollView>

                    <TouchableOpacity
                        className='bg-red py-3 w-full rounded-2xl justify-center items-center mb-3'
                        onPress={() => createBusiness()}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size={27} color={COLORS.white}/>
                        ) : (
                            <Text
                                style={{fontFamily: 'outfit-medium'}}
                                className='text-white text-2xl'
                            >Create Business</Text>
                        )}
                    </TouchableOpacity>
                </View>

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
        // </AuthLayout>
    )
}

export default CreateBusiness
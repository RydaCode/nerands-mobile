import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Dropdown } from "react-native-element-dropdown";
import { useSelector } from "react-redux";
import FormInputs from "../../../components/FormFields/FormInputs";
import { COLORS } from "../../../constants/constants";
import { VALID_PREFIXES } from "../../../constants/phonePrefixes";
import useApi from "../../../hook/useApi";
import { getUserTimezone } from "../../../utils/timezone";
import { toast } from "../../../utils/toast";
import OverLay from "../../OverLay";
import Redirecting from "../../Redirecting";

const CreateStore = ({
    business_id,
    business_name,
    display_name,
    business_category,
    email,
    country,
    logo_url,
    phone,
    province,
    registration_number,
    status,
    t_pin,
    tax_number,
    city
}) => {
    const { user_id, user_type, is_runner } = useSelector((state) => state.auth);
    const {
        latitude,
        longitude,
        displayCurrentLocation,
        locationServicesEnabled,
    } = useSelector((state) => state.location);
    const timezone = getUserTimezone();
    const router = useRouter();
    const [errors, setErrors] = useState({});
    const [run24hours, setRun24Hours] = useState(false);
    const [agreement, setAgreement] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const { data, isLoading, error, post } = useApi("/stores/create");

    // Strip phone number
    const displayPhone = phone.slice(4);

    const [formData, setFormData] = useState({
        business_id: business_id,
        user_id: user_id,
        store_country: country ||"Zambia",
        logo_url: logo_url,
        store_name: display_name,
        email: email,
        store_category: business_category,
        store_location: '',
        timezone: timezone || 'Africa/Lusaka'
    });

    useEffect(() => {
        if (latitude && longitude) {
            setFormData(prev => ({
                ...prev,
                store_latitude: latitude || 0.0,
                store_longitude: longitude || 0.0,
                city_town: city || '',
                store_phone_num: displayPhone || '',
                store_province: province || '',
                is_24_hours: run24hours || false
            }));
        }
    }, [
        latitude,
        longitude,
        displayPhone,
        run24hours
    ]);

    console.log(formData)

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

    const handleCreateStore = async() => {
        let newErrors = {};

        if (!formData.store_name) {
            newErrors.store_name = "Store name is required";
        }

        if (!formData.store_category) {
            newErrors.store_category = "Category is missing";
        }

        if (!formData.store_location) {
            newErrors.store_location = "Branch location is required";
        }

        if (!formData.store_phone_num) {
            newErrors.store_phone_num = "Phone number is required";
        }
        else if (!isValidPhoneNumber(formData.store_phone_num)) {
            newErrors.store_phone_num = "Enter a valid phone number";
        }

        if (!formData.store_province) {
            newErrors.store_province = "Please select a province";
        }

        if (!formData.city_town) {
            newErrors.city_town = "City/Town is required";
        }

        if (!agreement) {
            newErrors.agreement = "You must agree to continue";
        }

        setErrors(newErrors);

        // if (Object.keys(newErrors).length > 0) return;

        if (Object.keys(newErrors).length > 0) {
            toast.error("Please fix the highlighted fields");
            return;
        }

        const payload = {
            ...formData,
            store_phone_num: '+260' + normalizeZambianNumber(formData.store_phone_num)
        };

        // Trigger API request
        const res = await post(payload);

        if (res) {
            if (res?.data?.success === true) {
                toast.success(res?.data?.message || "Store created successfully");

                setIsRedirecting(true);
                setTimeout(() => {
                    router.back(); // Navigate back
                }, 3000);
            } else {
                toast.error(res?.data?.message || "Something went wrong");
            }
        }
    };

    // const categoryOptions = [
    //     { label: 'Restaurant', value: 'restaurant' },
    //     { label: 'Liquor', value: 'liquor' },
    //     { label: 'Fashion', value: 'fashion' },
    //     { label: 'Cosmetics', value: 'cosmetics' },
    //     { label: 'Electronics', value: 'electronics' },
    //     { label: 'Grocery', value: 'grocery' },
    //     { label: 'Supermarket', value: 'supermarket' },
    //     ...( (user_type === 'SUPER' || user_type === 'ADMIN') && is_runner
    //         ? [{ label: 'Local Market', value: 'local_market' }]
    //         : []
    //     ),
    // ];

    const provinceOptions = [
        { label: 'Lusaka', value: 'lusaka' },
        { label: 'Copperbelt', value: 'copperbelt' },
        { label: 'Central', value: 'central' },
        { label: 'Eastern', value: 'eastern' },
        { label: 'Northern', value: 'northern' },
        { label: 'Muchinga', value: 'muchinga' },
        { label: 'Southern', value: 'southern' },
        { label: 'Western', value: 'western' },
        { label: 'North-Western', value: 'north-western' },
        { label: 'Luapula', value: 'luapula' },
    ];

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="w-full justify-center items-center mt-6 px-4">
                    <View
                        // style={{ backgroundColor: "#ffebee" }}
                        className="w-full mb-8 rounded-md bg-[#a2fac777]"
                    >
                        <View className='px-2 pt-2'>
                            <Text
                                className="text-red text-md"
                                style={{ fontFamily: "roboto-bold" }}
                            >NOTE:</Text>
                            <Text className="text-black text-sm" style={{ fontFamily: "roboto-medium", textAlign: 'justify' }}>
                                During store creation, the system automatically captures and sets your current location as the branch / store location. You can update location from the dashboard.
                            </Text>
                        </View>
                        <View className='bg-white w-full my-2' style={{height: 1}}/>
                        <View className='flex-row items-center px-2 pb-2'>
                            <Ionicons name="location-sharp" size={15} color={COLORS.red} />
                            <Text className='text-sm ml-1 text-slate' numberOfLines={1} style={{ fontFamily: "roboto", textAlign: 'justify' }}>
                                {displayCurrentLocation}
                            </Text>
                        </View>
                        <View className='flex-row items-center px-2 pb-2'>
                            <Text className='text-sm ml-1 text-slate' numberOfLines={1} style={{ fontFamily: "roboto", textAlign: 'justify' }}>
                                Timezone: {timezone || 'Loading timezone...'}
                            </Text>
                        </View>
                    </View>
                    <View className="w-full">
                        {/* <FormInputs
                            title="Store Name"
                            defaultValue={display_name}
                            handleChangeText={(value) =>
                                handleChangeText("store_name", value)
                            }
                            borderStyle={`border ${errors.store_name ? "border-red" : "border-[#E2E8F0]"}`}
                            autoFocus={true}
                            error={errors.store_name}
                        /> */}

                        {/* <View className="mb-5">
                            <Text
                                className="text-base mb-1"
                                style={{ fontFamily: "roboto-bold" }}
                            >
                                Category
                            </Text>
                            <Text
                                className="text-sm mb-1 text-slate"
                                style={{ fontFamily: "roboto-medium", textAlign: 'justify' }}
                            >
                                Please select the category that best suits your store and products.
                            </Text>

                            <Dropdown
                                data={categoryOptions}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Category"
                                value={formData.store_category}
                                onChange={(item) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        store_category: item.value
                                    }));
                                }}

                                style={{
                                    borderWidth: 2,
                                    borderColor: errors.store_category ? "red" : "#E2E8F0",
                                    borderRadius: 12,
                                    paddingHorizontal: 12,
                                    height: 50,
                                }}
                            />
                            {errors.store_category && (
                                <Text className='text-red text-sm my-2' style={{fontFamily: 'roboto'}}>
                                    {errors.store_category}
                                </Text>
                            )}
                        </View> */}

                        <FormInputs
                            title="Branch / Store location"
                            placeholder='Eg: Levy mall or Cairo'
                            handleChangeText={(value) =>
                                handleChangeText("store_location", value)
                            }
                            desc=""
                            borderStyle={`border ${errors.store_location ? "border-red" : "border-[#E2E8F0]"}`}
                            error={errors.store_location}
                            textColor='black'
                            descFontFamily='roboto'
                        />

                        {/* Phone */}
                        <Text
                            className="mb-2 text-black"
                            style={{ fontFamily: "roboto-medium" }}
                        >
                            Branch / Store phone {errors.store_phone_num && (
                                <Text className='text-red'>*</Text>
                            )}
                        </Text>

                        <View
                            style={{
                                borderWidth: 2,
                                borderColor: errors.store_phone_num ? 'red' : '#E2E8F0',
                                borderRadius: 10,
                                height: 50,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: 12,
                                marginBottom: 20,
                            }}
                        >
                            <Text style={{ fontFamily: "roboto-medium", marginRight: 2 }}>
                                +260
                            </Text>

                            <TextInput
                                placeholder="Eg: 971234567"
                                keyboardType="phone-pad"
                                maxLength={9}
                                defaultValue={displayPhone}
                                onChangeText={(value) => {
                                    const numbersOnly = (value || '').replace(/\D/g, '');
                                    handleChangeText('store_phone_num', numbersOnly);
                                }}
                                style={{
                                    flex: 1,
                                    fontFamily: "roboto-medium",
                                }}
                            />
                        </View>

                        {errors.store_phone_num && (
                            <Text style={{ color: 'red', fontSize: 12, marginTop: 6 }}>
                                {errors.store_phone_num}
                            </Text>
                        )}

                        <View className="mb-5">
                            <Text className="text-base mb-1" style={{ fontFamily: "roboto-bold" }}>Province</Text>
                            {/* <Text
                                className="text-sm mb-1 text-slate"
                                style={{ fontFamily: "roboto-medium", textAlign: 'justify' }}
                            >
                                Select the province where the store is located.
                            </Text> */}
                            <Dropdown
                                data={provinceOptions}
                                placeholder={province}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Province"
                                value={formData.store_province}
                                mode="modal"
                                onChange={(item) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        store_province: item.value
                                    }));
                                }}

                                style={{
                                    borderWidth: 2,
                                    borderColor: errors.store_province ? "red" : "#E2E8F0",
                                    borderRadius: 12,
                                    paddingHorizontal: 12,
                                    height: 50,
                                }}
                            />
                            {errors.store_province && (
                                <Text className='text-red text-sm my-2' style={{fontFamily: 'roboto'}}>
                                    {errors.store_province}
                                </Text>
                            )}
                        </View>

                        <FormInputs
                            title="City"
                            defaultValue={city}
                            handleChangeText={(value) => handleChangeText("city_town", value)}
                            desc=""
                            borderStyle={`border ${errors.city_town ? "border-red" : "border-[#E2E8F0]"}`}
                            error={errors.city_town}
                            textColor='black'
                            descFontFamily='roboto'
                        />

                        <View className="w-full mb-6">
                            <Text
                                className="text-slate text-sm mb-2 mt-4"
                                style={{
                                    fontFamily: "roboto-medium",
                                    textAlign: "justify"
                                }}
                            >
                                Does your store operate 24 hours a day?
                            </Text>

                            <View className="flex-row items-center justify-between">
                                <Text
                                    className="text-slate text-sm"
                                    style={{
                                        fontFamily: "roboto-medium"
                                    }}
                                >
                                    Store operates 24/7
                                </Text>

                                <Switch
                                    value={run24hours}
                                    onValueChange={(value) => setRun24Hours(value)}
                                    trackColor={{
                                        false: "#cbd5e1",
                                        true: COLORS.primary
                                    }}
                                    thumbColor="#ffffff"
                                />
                            </View>
                        </View>
                    </View>
                    <View className="w-full mb-6">
                        <Text
                            className="text-slate text-sm mb-2 mt-8"
                            style={{ fontFamily: "roboto-medium", textAlign: 'justify' }}
                        >By pressing the create button, you sign up to the terms and conditions.</Text>
                        <BouncyCheckbox
                            isChecked={agreement}
                            onPress={() => setAgreement(!agreement)}
                            text="I agree"
                            textStyle={{
                                textDecorationLine: "none",
                                color: COLORS.slate,
                                marginLeft: -10,
                                fontSize: 13,
                            }}
                            size={21}
                            fillColor={COLORS.primary}
                            iconStyle={{ borderColor: COLORS.primary, borderRadius: 2, borderWidth: 2 }}
                            innerIconStyle={{ borderWidth: 2, borderRadius: 2 }}
                        />
                    </View>

                    <TouchableOpacity
                        className={`w-full py-3 bg-primary justify-center items-center rounded-xl ${agreement || isLoading ? "opacity-100" : "opacity-50"}`}
                        disabled={isLoading || !agreement}
                        onPress={() => handleCreateStore()}
                    >
                        {isLoading ? (
                            <ActivityIndicator size={30} color={COLORS.white}/>  
                        ) : (
                            <Text
                                className='text-white text-2xl'
                                style={{fontFamily: 'maven-medium'}}
                            >Create</Text>
                        )}
                    </TouchableOpacity>
                </View>
                <View className="pb-20" />
            </ScrollView>
            {isLoading && <OverLay/>}
            {isRedirecting &&  <Redirecting redirect_text="Please wait..." />}
        </KeyboardAvoidingView>
    );
};

export default CreateStore;
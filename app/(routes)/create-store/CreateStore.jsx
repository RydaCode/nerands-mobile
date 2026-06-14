import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Dropdown } from "react-native-element-dropdown";
import { useSelector } from "react-redux";
import FormInputs from "../../../components/FormFields/FormInputs";
import { COLORS } from "../../../constants/constants";
import { VALID_PREFIXES } from "../../../constants/phonePrefixes";
import useApi from "../../../hook/useApi";
import { toast } from "../../../utils/toast";
import OverLay from "../../OverLay";
import Redirecting from "../../Redirecting";

const CreateStore = () => {
    const { user_id, user_type, is_runner } = useSelector((state) => state.auth);
    const router = useRouter();
    const [errors, setErrors] = useState({});
    const [showOpenTimePicker, setShowOpenTimePicker] = useState(false);
    const [showCloseTimePicker, setShowCloseTimePicker] = useState(false);

    const updateTime = (key, selectedDate) => {
        const time = selectedDate || new Date();

        const formattedTime = formatTo24Hour(
            time.getHours(),
            time.getMinutes()
        );

        setFormData(prev => ({
            ...prev,
            [key]: formattedTime
        }));
    };

    const showOpenTimepicker = () => {
        setShowOpenTimePicker(true);
    };

    const showCloseTimepicker = () => {
        setShowCloseTimePicker(true);
    };

    // Function to convert to 24-hour format
    const formatTo24Hour = (hours, minutes) => {
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${hours < 10 ? `0${hours}` : hours}:${formattedMinutes}`;
    };

    useEffect(() => {
        if (latitude && longitude) {
            setFormData(prev => ({
                ...prev,
                store_latitude: latitude,
                store_longitude: longitude
            }));
        }
    }, [latitude, longitude]);

    // Use useSelector to get location data from Redux store
    const {
        latitude,
        longitude,
        displayCurrentLocation,
        locationServicesEnabled,
    } = useSelector((state) => state.location);

    const [formData, setFormData] = useState({
        user_id: user_id,
        store_name: "",
        store_category: '',
        store_phone_num: "",
        store_province: '',
        city_town: "",
        store_location: "",
        store_country: "Zambia",
        open_time: '',
        closing_time: '',
        store_latitude: latitude || 0.0,
        store_longitude: longitude || 0.0,
    });

    const [agreement, setAgreement] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const { data: response, isLoading, error, post } = useApi("/stores/create");

    useEffect(() => {
        if (response) {
            if (response.Response === "Success") {
                toast.success("Store created successfully");

                setIsRedirecting(true);
                setTimeout(() => {
                    router.back(); // Navigate back
                }, 3000);
            } else {
                toast.error(response.Response || "Something went wrong");
            }
        }

        if (error) {
            toast.error("An error occurred. Please try again.");
        }

        console.log(error);
    }, [response, error]);

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

    const onChangeOpenTime = (e, date) => {
        updateTime("open_time", date);
        setShowOpenTimePicker(false);
    };

    const onChangeCloseTime = (e, date) => {
        updateTime("closing_time", date);
        setShowCloseTimePicker(false);
    };

    const handleCreateStore = () => {
        let newErrors = {};

        if (!formData.store_name) {
            newErrors.store_name = "Store name is required";
        }

        if (!formData.store_category) {
            newErrors.store_category = "Please select a category";
        }

        if (!formData.store_location) {
            newErrors.store_location = "Store location is required";
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

        if (!formData.open_time) {
            newErrors.open_time = "Select opening time";
        }

        if (!formData.closing_time) {
            newErrors.closing_time = "Select closing time";
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
        post(payload);
    };

    const categoryOptions = [
        { label: 'Restaurant', value: 'restaurant' },
        { label: 'Liquor', value: 'liquor' },
        { label: 'Fashion', value: 'fashion' },
        { label: 'Cosmetics', value: 'cosmetics' },
        { label: 'Electronics', value: 'electronics' },
        { label: 'Grocery', value: 'grocery' },
        { label: 'Supermarket', value: 'supermarket' },
        ...( (user_type === 'SUPER' || user_type === 'ADMIN') && is_runner
            ? [{ label: 'Local Market', value: 'local_market' }]
            : []
        ),
    ];

    const provinceOptions = [
        { label: 'Lusaka', value: 'Lusaka' },
        { label: 'Copperbelt', value: 'Copperbelt' },
        { label: 'Central', value: 'Central' },
        { label: 'Eastern', value: 'Eastern' },
        { label: 'Northern', value: 'Northern' },
        { label: 'Muchinga', value: 'Muchinga' },
        { label: 'Southern', value: 'Southern' },
        { label: 'Western', value: 'Western' },
        { label: 'North-Western', value: 'North-Western' },
        { label: 'Luapula', value: 'Luapula' },
    ];

    return (
        <View className="flex-1 justify-center items-center bg-white relative">
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="w-full justify-center items-center mt-6 px-4">
                    <View
                        style={{ backgroundColor: "#ffebee" }}
                        className="w-full mb-8 rounded-md"
                    >
                        <View className='px-2 pt-2'>
                            <Text
                                className="text-red text-md"
                                style={{ fontFamily: "roboto-bold" }}
                            >NOTE:</Text>
                            <Text className="text-base" style={{ fontFamily: "roboto-medium", textAlign: 'justify' }}>
                                During store creation, the system automatically captures and sets your current location as the store location.
                            </Text>
                        </View>
                        <View className='bg-white w-full my-2' style={{height: 1}}/>
                        <View className='flex-row items-center px-2 pb-2'>
                            <Ionicons name="location-sharp" size={15} color={COLORS.red} />
                            <Text className='text-sm ml-1 text-slate' numberOfLines={1} style={{ fontFamily: "roboto-medium", textAlign: 'justify' }}>{displayCurrentLocation}</Text>
                        </View>
                    </View>
                    <View className="w-full">
                        <FormInputs
                            title="Store Name"
                            handleChangeText={(value) =>
                                handleChangeText("store_name", value)
                            }
                            borderStyle={`border ${errors.store_name ? "border-red" : "border-[#E2E8F0]"}`}
                            autoFocus={true}
                            error={errors.store_name}
                        />

                        <View className="mb-5">
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
                        </View>

                        {/* Phone */}
                        <Text
                            className="mb-2 text-black"
                            style={{ fontFamily: "roboto-medium" }}
                        >
                            Phone Number {errors.store_phone_num && (
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
                            <Text style={{ fontFamily: "roboto-medium", marginRight: 8 }}>
                                +260
                            </Text>

                            <TextInput
                                placeholder="Eg: 971234567"
                                keyboardType="phone-pad"
                                maxLength={9}
                                value={formData.store_phone_num}
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

                        <FormInputs
                            title="Store location"
                            placeholder=""
                            handleChangeText={(value) =>
                                handleChangeText("store_location", value)
                            }
                            desc="Please enter the store’s area location, as this will help clients locate your store more easily."
                            borderStyle={`border ${errors.store_location ? "border-red" : "border-[#E2E8F0]"}`}
                            error={errors.store_location}
                        />

                        <View className="mb-5">
                            <Text className="text-base mb-1" style={{ fontFamily: "roboto-bold" }}>Store province</Text>
                            <Text
                                className="text-sm mb-1 text-slate"
                                style={{ fontFamily: "roboto-medium", textAlign: 'justify' }}
                            >
                                Please select the province where the store is located.
                            </Text>
                            <Dropdown
                                data={provinceOptions}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Province"
                                value={formData.store_province}
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
                            title="Store city / town"
                            placeholder=""
                            handleChangeText={(value) => handleChangeText("city_town", value)}
                            desc="Please select the city or town where the store is located."
                            borderStyle={`border ${errors.city_town ? "border-red" : "border-[#E2E8F0]"}`}
                            error={errors.city_town}
                        />

                        <View className='w-full my-6'>
                            <Text className='text-sm text-slate mb-2'
                                style={{fontFamily: 'roboto-medium'}}
                            >Please select the time the store opens and closes.</Text>
                            <View className='w-full flex-row items-center justify-between'>
                                <View className='border justify-center items-center rounded-sm p-1 bg-grey_bg' style={{width: '49%', borderColor: errors.open_time ? "red" : "#E2E8F0"}}>
                                    <View className='flex-row justify-center items-center'>
                                        <MaterialIcons name="timer" size={18} color={COLORS.green1} />
                                        <Text className='text-base text-slate ml-1' style={{fontFamily: 'roboto-medium'}}>{formData.open_time}</Text>
                                    </View>
                                    <TouchableOpacity
                                        className="bg-green1 rounded-sm py-3 w-full justify-center items-center"
                                        onPress={showOpenTimepicker}
                                    >
                                        <Text
                                            className="ml-1 text-base text-white"
                                            style={{ fontFamily: "roboto-medium" }}
                                        >Select opening time</Text>
                                    </TouchableOpacity>
                                </View>

                                <View className='border justify-center items-center rounded-sm p-1 bg-grey_bg' style={{width: '49%', borderColor: errors.closing_time ? "red" : "#E2E8F0"}}>
                                    <View className='flex-row justify-center items-center'>
                                        <MaterialIcons name="timer" size={18} color={COLORS.green1} />
                                        <Text className='text-base ml-1 text-slate' style={{fontFamily: 'roboto-medium'}}>{formData.closing_time}</Text>
                                    </View>
                                    <TouchableOpacity
                                        className="bg-green1 rounded-sm py-3 w-full justify-center items-center"
                                        onPress={showCloseTimepicker}
                                    >
                                        <Text className="ml-1 text-base text-white"
                                            style={{ fontFamily: "roboto-medium" }}
                                        >Select closing time</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {errors.open_time ? (
                                <Text className='text-red text-sm mt-2'>
                                    Select opeing time
                                </Text>
                            ) : errors.closing_time ? (
                                <Text className='text-red text-sm mt-2'>
                                    Select closing time
                                </Text>
                            ) : null}

                            <View className='w-full'>
                                {showOpenTimePicker && (
                                    <DateTimePicker
                                        testID="openTimePicker"
                                        value={new Date()}
                                        mode="time"
                                        display="default"
                                        onChange={onChangeOpenTime}
                                    />
                                )}

                                {showCloseTimePicker && (
                                    <DateTimePicker
                                        testID="closeTimePicker"
                                        value={new Date()}
                                        mode="time"
                                        display="default"
                                        onChange={onChangeCloseTime}
                                    />
                                )}
                            </View>
                        </View>
                    </View>
                    <View className="w-full mb-6">
                        <Text
                            className="text-slate text-sm mb-8"
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
                            size={20}
                            fillColor={COLORS.primary}
                            iconStyle={{ borderColor: COLORS.primary, borderRadius: 2, borderWidth: 2 }}
                            innerIconStyle={{ borderWidth: 2, borderRadius: 2 }}
                        />
                    </View>

                    <TouchableOpacity
                        className={`w-full py-3 bg-primary justify-center items-center rounded ${agreement || isLoading ? "opacity-100" : "opacity-50"}`}
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
        </View>
    );
};

const styles = StyleSheet.create({
    picker: {
        height: 50,
        borderRadius: 5,
    },
    pickerItem: {
        color: COLORS.slate,
        fontSize: 13,
        fontFamily: "roboto-medium",
    },
});

export default CreateStore;
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useSelector } from "react-redux";
import CustomButton from "../../../components/Buttons/CustomButton";
import FormInputs from "../../../components/FormFields/FormInputs";
import { COLORS } from "../../../constants/constants";
import useApi from "../../../hook/useApi";
import { toast } from "../../../utils/toast";
import LoadingIndicator from "../../LoadingIndicator";
import Redirecting from "../../Redirecting";

const CreateStore = ({ router }) => {
    const { user_id, user_type, is_runner } = useSelector((state) => state.auth);
    // States for open and close time
    const [opentime, setStoreOpenTime] = useState("08:00"); // Default to 24-hour format
    const [closetime, setStoreClosingTime] = useState("17:00"); // Default to 24-hour format
    const [selectedCategory, setSelectedCategory] = useState("Select category"); // Picker selection state
    const [selectedprovince, setSelectedProvince] = useState("Lusaka"); // Picker selection state

    const [showOpenTimePicker, setShowOpenTimePicker] = useState(false);
    const [showCloseTimePicker, setShowCloseTimePicker] = useState(false);

    const onChangeOpenTime = (event, selectedDate) => {
        const selectedTime = selectedDate || new Date();
        let hours = selectedTime.getHours();
        let minutes = selectedTime.getMinutes();

        const formattedTime = formatTo24Hour(hours, minutes);
        setStoreOpenTime(formattedTime);
        setShowOpenTimePicker(false);
    };

    const onChangeCloseTime = (event, selectedDate) => {
        const selectedTime = selectedDate || new Date();
        let hours = selectedTime.getHours();
        let minutes = selectedTime.getMinutes();

        const formattedTime = formatTo24Hour(hours, minutes);
        setStoreClosingTime(formattedTime);
        setShowCloseTimePicker(false);
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

    // const { latitude, longitude, displayCurrentLocation } = useLocation();
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
        store_category: selectedCategory,
        store_phone_num: "",
        store_province: "",
        city_town: "",
        store_location: "",
        store_country: "Zambia",
        open_time: opentime,
        closing_time: closetime,
        store_latitude: latitude || 0.0,
        store_longitude: longitude || 0.0,
    });

    const [agreement, setAgreement] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isRedirecting, setIsRedirecting] = useState(false);

    const { data: response, post, isLoading, error } = useApi("/stores/create");

    useEffect(() => {
        if (response) {
            if (response.Response === "Success") {
                toast.success("Store created successfully");

                setIsRedirecting(true);
                setTimeout(() => {
                    router.back(); // Navigate back
                }, 5000);
            } else {
                toast.error(response.Response || "Something went wrong");
            }
        }

        if (error) {
            toast.error("An error occurred. Please try again.");
        }

        console.log(error);
    }, [response, error]);

    const handleChangeText = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value); // Update selected category in state
        setFormData((prev) => ({
            ...prev,
            store_category: value, // Update store_category in formData
        }));
    };

    const handleProvinceChange = (value) => {
        setSelectedProvince(value); // Update selected province in state
        setFormData((prev) => ({
            ...prev,
            store_province: value, // Update store_category in formData
        }));
    };

    const handleCreateStore = () => {
        setErrorMessage(""); // Clear error message

        const validations = [
            { field: formData.store_name, message: "Please enter the store name." },

            { field: formData.store_category, message: "Please select a store category." },

            {
                field: formData.store_location,
                message: "Please enter the store location.",
            },

            {
                field: formData.store_phone_num,
                message: "Please enter a valid store phone number.",
                validate: () => /^\d{10}$/.test(formData.store_phone_num),
            },

            { field: formData.store_province, message: "Please select the store's province." },

            { field: formData.city_town, message: "Please select the store's city or town." },

            { field: formData.open_time, message: "Please select the store's opening time." },

            { field: formData.closing_time, message: "Please select the store's closing time." },

            {
                field: agreement,
                message: "You must agree to the terms and conditions.",
            },
        ];

        for (let i = 0; i < validations.length; i++) {
            const { field, message, validate } = validations[i];
            const isValid = validate ? validate() : !!field;

            if (!isValid) {
                setErrorMessage(message);
                toast.error(message);
                return;
            }
        }

        // Trigger API request
        post(formData);
            // setFormData((prev) => ({
            //     ...prev,
            //     store_name: '',
            //     store_category: '',
            //     store_phone_num: '',
            //     store_province: '',
            //     city_town: '',
            //     store_location: '',
            //     open_time: opentime,
            //     closing_time: closetime,
            //     store_latitude: latitude,
            //     store_longitude: longitude,
        // }));
    };

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
                            borderStyle="border border-[#E2E8F0]"
                            autoFocus={true}
                        />

                        <View className="my-5">
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
                            <View
                                className="rounded-md border border-[#E2E8F0]"
                            >
                                <Picker
                                    selectedValue={selectedCategory}
                                    onValueChange={handleCategoryChange}
                                    style={styles.picker}
                                    itemStyle={styles.pickerItem}
                                >
                                    <Picker.Item label="Select Category" value="" />
                                    <Picker.Item label="Restaurant" value="Restaurant" />
                                    <Picker.Item label="Liquor" value="Liquor" />
                                    <Picker.Item label="Fashion" value="Fashion" />
                                    <Picker.Item label="Cosmetics" value="Cosmetics" />
                                    <Picker.Item label="Electronics" value="Electronics" />
                                    <Picker.Item label="Grocery" value="Grocery" />
                                    <Picker.Item label="Supermarket" value="Supermarket" />
                                    {(user_type === 'SUPER' || user_type === 'ADMIN') && is_runner && (
                                        <Picker.Item label="Local Market" value="local_market" />
                                    )}
                                </Picker>
                            </View>
                        </View>

                        <FormInputs
                            title="Store phone number"
                            placeholder=""
                            handleChangeText={(value) =>
                                handleChangeText("store_phone_num", value)
                            }
                            desc="Please provide an active store phone number to ensure easy communication with clients."
                            borderStyle="border-[#E2E8F0]"
                        />

                        <FormInputs
                            title="Store location"
                            placeholder=""
                            handleChangeText={(value) =>
                                handleChangeText("store_location", value)
                            }
                            desc="Please enter the store’s area location, as this will help clients locate your store more easily."
                            borderStyle="border border-[#E2E8F0]"
                        />

                        <View className="my-5">
                            <Text className="text-base mb-1" style={{ fontFamily: "roboto-bold" }}>Store province</Text>
                            <Text
                                className="text-sm mb-1 text-slate"
                                style={{ fontFamily: "roboto-medium", textAlign: 'justify' }}
                            >
                                Please select the province where the store is located.
                            </Text>
                            <View className="rounded-md border border-[#E2E8F0]">
                                <Picker
                                    selectedValue={selectedprovince}
                                    onValueChange={handleProvinceChange}
                                    style={styles.picker}
                                    itemStyle={styles.pickerItem}
                                >
                                    <Picker.Item label="Lusaka" value="Lusaka" />
                                    <Picker.Item label="Copper-Belt" value="Copper-Belt" />
                                    <Picker.Item label="Central" value="Central" />
                                    <Picker.Item label="Northern" value="Northern" />
                                    <Picker.Item label="Soutern" value="Soutern" />
                                    <Picker.Item label="Western" value="Western" />
                                    <Picker.Item label="Luapula" value="Luapula" />
                                    <Picker.Item label="Eastern" value="Eastern" />
                                    <Picker.Item label="Muchinga" value="Muchinga" />
                                    <Picker.Item label="North-Western" value="North-Western" />
                                </Picker>
                            </View>
                        </View>

                        <FormInputs
                            title="Store city / town"
                            placeholder=""
                            handleChangeText={(value) => handleChangeText("city_town", value)}
                            desc="Please select the city or town where the store is located."
                            borderStyle="border border-[#E2E8F0]"
                        />

                        <View className='w-full mb-6'>
                            <Text className='text-sm text-slate mb-2'
                                style={{fontFamily: 'roboto-medium'}}
                            >Please select the time the store opens and closes.</Text>
                            <View className='w-full flex-row items-center justify-between'>
                                <View className='border justify-center items-center rounded-sm p-1 border-[#E2E8F0] bg-grey_bg' style={{width: '49%'}}>
                                    <View className='flex-row justify-center items-center'>
                                        <MaterialIcons name="timer" size={18} color={COLORS.black} />
                                        <Text className='text-base text-slate ml-1' style={{fontFamily: 'roboto-medium'}}>{opentime}</Text>
                                    </View>
                                    <TouchableOpacity
                                        className="bg-primary rounded-sm py-3 w-full justify-center items-center"
                                        onPress={showOpenTimepicker}
                                    >
                                        <Text
                                            className="ml-1 text-base text-white"
                                            style={{ fontFamily: "roboto-medium" }}
                                        >Select opening time</Text>
                                    </TouchableOpacity>
                                </View>

                                <View className='border justify-center items-center rounded-sm p-1 border-[#E2E8F0] bg-grey_bg' style={{width: '49%'}}>
                                    <View className='flex-row justify-center items-center'>
                                        <MaterialIcons name="timer" size={18} color={COLORS.black} />
                                        <Text className='text-base ml-1 text-slate' style={{fontFamily: 'roboto-medium'}}>{closetime}</Text>
                                    </View>
                                    <TouchableOpacity
                                        className="bg-primary rounded-sm py-3 w-full justify-center items-center"
                                        onPress={showCloseTimepicker}
                                    >
                                        <Text className="ml-1 text-base text-white"
                                            style={{ fontFamily: "roboto-medium" }}
                                        >Select closing time</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

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
                    <View className="w-full">
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
                            iconStyle={{ borderColor: COLORS.primary, borderRadius: 2 }}
                            innerIconStyle={{ borderWidth: 2, borderRadius: 2 }}
                        />
                    </View>

                    <View className="w-full justify-center items-center">
                        <Text
                            className={`${errorMessage === "Success" ? "text-green2" : "text-red"} text-lg`}
                            style={{ fontFamily: "roboto-medium" }}
                        >
                            {errorMessage === "Success" ? "Please wait..." : errorMessage}
                        </Text>
                    </View>

                    <CustomButton
                        title={isLoading ? "Please wait..." : "Create"}
                        handlePress={handleCreateStore}
                        disabled={isLoading || !agreement}
                        otherStyles={`bg-primary p-4 mt-4 ${agreement ? "opacity-100" : "opacity-50"}`}
                        textStyles="text-2xl"
                    />
                </View>
                <View className="pb-20" />
            </ScrollView>
            {isLoading ? <LoadingIndicator loading_text="Creating store..." /> : null}
            {isRedirecting && !isLoading ? (
                <Redirecting redirect_text="Please wait..." />
            ) : null}
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
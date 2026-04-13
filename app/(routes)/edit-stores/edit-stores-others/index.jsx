import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import CustomButton from '../../../../components/Buttons/CustomButton';
import DescriptionInput from '../../../../components/FormFields/DescriptionInput';
import FormInputs from '../../../../components/FormFields/FormInputs';
import MainHeader from '../../../../components/MainHeader';
import { COLORS } from '../../../../constants/constants';
import useUpdate from '../../../../hook/useUpdate';
import LoadingIndicator from '../../../LoadingIndicator';
import Redirecting from '../../../Redirecting';

const index = () => {
    const params = useLocalSearchParams();
    const router = useRouter();

    // States for form data
    const [selectedCategory, setSelectedCategory] = useState(params.store_category);
    const [storename, setStoreName] = useState(params.store_name);
    const [storephonenumber, setStorePhoneNumber] = useState(params.store_phone_num);
    const [storelocation, setStoreLocation] = useState(params.store_location);
    const [storeprovince, setStoreProvince] = useState(params.store_province);
    const [storecity, setStoreCity] = useState(params.city_town);
    const [storedescription, setStoreDescription] = useState(params.store_description);

    // States for open and close time
    const [opentime, setStoreOpenTime] = useState(params.open_time === null ? '08:00' : params.open_time);  // Default to 24-hour format
    const [closetime, setStoreClosingTime] = useState(params.closing_time === null ? '17:00' : params.closing_time);  // Default to 24-hour format

    const [showOpenTimePicker, setShowOpenTimePicker] = useState(false); 
    const [showCloseTimePicker, setShowCloseTimePicker] = useState(false); 

    const onChangeOpenTime = (event, selectedDate) => {
        const selectedTime = selectedDate || new Date();
        let hours = selectedTime.getHours();
        let minutes = selectedTime.getMinutes();

        // Convert to 24-hour format
        const formattedTime = formatTo24Hour(hours, minutes);
        setStoreOpenTime(formattedTime);
        setShowOpenTimePicker(false);
    };

    const onChangeCloseTime = (event, selectedDate) => {
        const selectedTime = selectedDate || new Date();
        let hours = selectedTime.getHours();
        let minutes = selectedTime.getMinutes();

        // Convert to 24-hour format
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
        // Ensure the minutes are two digits
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${hours < 10 ? `0${hours}` : hours}:${formattedMinutes}`;
    };

    // Prepare the form data
    const [formData, setFormData] = useState({
        user_id: params.user_id,
        store_id: params.store_id,
        store_name: storename,
        store_category: selectedCategory,
        store_phone_num: storephonenumber,
        store_province: storeprovince,
        city_town: storecity,
        store_location: storelocation,
        open_time: opentime,
        closing_time: closetime,
        store_description: storedescription,
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [isRedirecting, setIsRedirecting] = useState(false); 
    const { update, isLoading, resend } = useUpdate(`/store/update/`, formData);

    console.log(update);

    useEffect(() => {
        setFormData(prevState => ({
            ...prevState,
            store_category: selectedCategory,
            open_time: opentime,
            closing_time: closetime,
            store_name: storename,
            store_phone_num: storephonenumber,
            store_province: storeprovince,
            city_town: storecity,
            store_location: storelocation,
            store_description: storedescription
        }));
    }, [selectedCategory, storename, storephonenumber, storeprovince, storecity, storelocation, storedescription, opentime, closetime]);

    useEffect(() => {
        if (update?.Response) {
            setErrorMessage(update.Response);
            // toast.success(update.Response);
            Toast.show({
                type: 'success',
                text1: 'Response',
                text2: update.Response,
                visibilityTime: 4000,
                animationType: 'slide',
                position: 'bottom',
            });

            if (update.Response === 'Success') {
                setIsRedirecting(true);
                setTimeout(() => {
                    router.back();
                }, 5000); 
            }
        }
    }, [update]);

    const handleUpdateStore = () => {
        setErrorMessage('');

        // Client-side validation
        if (!formData.store_name) {
            setErrorMessage('Please enter store name.');
            // toast.error('Please enter store name.');
            Toast.show({
                type: 'tomatoToast',
                text1: 'Response',
                text2: 'Please enter store name.',
                visibilityTime: 4000,
                animationType: 'slide',
                position: 'bottom',
            });
            return;
        }
        if (!formData.store_category) {
            setErrorMessage('Please select category.');
            // toast.error('Please select category.');
            Toast.show({
                type: 'tomatoToast',
                text1: 'Error',
                text2: 'Please select category.',
                visibilityTime: 4000,
                animationType: 'slide',
                position: 'bottom',
            });
            return;
        }
        // Trigger the API request to update the store data
        resend();
    };

    const Inputs = [
        {title: 'Store Name', defaultValue: storename, setter: setStoreName, desc: ''},
        {title: 'Area Location', defaultValue: storelocation, setter: setStoreLocation, desc: ''},
        {title: 'Phone number', defaultValue: storephonenumber, setter: setStorePhoneNumber, desc: ''},
        {title: 'Store province', defaultValue: storeprovince, setter: setStoreProvince, desc: 'Please select the province where the store is situated'},
        {title: 'Store city / town', defaultValue: storecity, setter: setStoreCity, desc: 'Please select the city / town where the store is located'},
    ];

    return (
        <SafeAreaView className="flex-1 bg-white items-center">
            <View className="px-4">
                <MainHeader fontFamily='ubuntu-medium' textStyles='text-2xl' header_name="Edit Store" />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="w-full px-4">
                    <View className="mt-10 w-full">

                    {Inputs.map((input, index) => (
                        <FormInputs
                            key={index}
                            title={input.title}
                            defaultValue={input.defaultValue}
                            handleChangeText={(value) => input.setter(value)}
                            borderStyle="border border-lavender"
                            desc={input.desc}
                        />
                    ))}
                        <View className="my-5">
                            <Text className="text-gray-700 text-lg mb-1" style={{ fontFamily: 'roboto-medium' }}>Category</Text>
                            <View className="rounded-md" style={{ borderWidth: 1, borderColor: 'lavender' }}>
                                <Picker
                                    selectedValue={selectedCategory}
                                    onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                                    style={styles.picker}
                                    itemStyle={styles.pickerItem}
                                >
                                    <Picker.Item label={selectedCategory} value={selectedCategory} />
                                    <Picker.Item label="Restaurant" value="Restaurant" />
                                    <Picker.Item label="Liquor Store" value="Liquor Store" />
                                    <Picker.Item label="Fashion" value="Fashion" />
                                    <Picker.Item label="Cosmetics" value="Cosmetics" />
                                    <Picker.Item label="Electronics" value="Electronics" />
                                    <Picker.Item label="Grocery" value="Grocery" />
                                    <Picker.Item label="Super Market" value="Super Market" />
                                </Picker>
                            </View>
                        </View>

                        <DescriptionInput
                            title="Description"
                            defaultValue={storedescription}
                            handleChangeText={(value) => setStoreDescription(value)}
                            otherStyles="text-lg"
                            desc="Ensure that you provide description that best describes your store"
                            lines={4}/>

                        <View style={styles.container}>
                            <Text style={styles.text}>Store Opening Time: {opentime}</Text>
                            <TouchableOpacity
                                className='bg-green2 p-4 flex-row w-full mb-3 justify-center items-center'
                                onPress={showOpenTimepicker}
                            >
                                <Feather name="clock" size={20} color={COLORS.white} />
                                <Text className='ml-2 text-lg text-white' style={{fontFamily: 'roboto-medium'}}>Select Opening Time</Text>
                            </TouchableOpacity>
                            <View className='my-4' />

                            <Text style={styles.text}>Store Closing Time: {closetime}</Text>
                            <TouchableOpacity
                                className='bg-green2 p-4 flex-row w-full mb-3 justify-center items-center'
                                onPress={showCloseTimepicker}
                            >
                                <Feather name="clock" size={20} color={COLORS.white} />
                                <Text className='ml-2 text-lg text-white' style={{fontFamily: 'roboto-medium'}}>Select Closing Time</Text>
                            </TouchableOpacity>

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

                        <View className="w-full justify-center items-center">
                            <Text
                                className={`${errorMessage === 'Success' ? 'text-green2' : 'text-red'} text-lg`}
                                style={{ fontFamily: 'roboto-medium' }}
                            >
                                {errorMessage === 'Success' ? 'Please wait...' : errorMessage}
                            </Text>
                        </View>

                        <View className="w-full">
                            <CustomButton
                                title={isLoading ? 'Please wait...' : 'Update'}
                                handlePress={handleUpdateStore}
                                disabled={isLoading}
                                otherStyles={`bg-primary p-4 mt-4 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
                                textStyles="text-2xl"
                            />
                        </View>
                    </View>
                </View>
                <View className="pb-10" />
            </ScrollView>

            <Toast />
            {isLoading ? <LoadingIndicator loading_text="Updating store..." /> : null}
            {isRedirecting ? <Redirecting redirect_text="Please wait..." /> : null}
        </SafeAreaView>
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
        fontFamily: 'roboto-medium',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
        fontFamily: 'roboto-medium'
    },
});

export default index;
import { Feather, FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import CustomButton from '../../../../components/Buttons/CustomButton';
import DescriptionInput from '../../../../components/FormFields/DescriptionInput';
import FormInputs from '../../../../components/FormFields/FormInputs';
import PickerInput from '../../../../components/FormFields/PickerInput';
import MainHeader from '../../../../components/MainHeader';
import useApi from '../../../../hook/useApi';
import LoadingIndicator from '../../../LoadingIndicator';
import Redirecting from '../../../Redirecting';

const FIELD_LIST = [
    { label: 'Store Name', key: 'store_name' },
    {
        label: 'Store Category',
        key: 'store_category',
        type: 'picker',
        options: [
            'Restaurant',
            'Liquor Store',
            'Fashion',
            'Cosmetics',
            'Electronics',
            'Grocery',
            'Super Market',
        ],
    },
    { label: 'Store Email', key: 'store_email' },
    { label: 'Store Phone Number', key: 'store_phone_num' },
    {
        label: 'Store Province',
        key: 'store_province',
        type: 'picker',
        options: [
            'Lusaka',
            'Copper Belt',
            'Central',
            'Luapula',
            'Northern',
            'Southern',
            'Eastern',
            'Western',
            'North Western',
            'Muchinga',
        ],
    },
    { label: 'Store City', key: 'city_town' },
    { label: 'Store Opening Time', key: 'open_time' },
    { label: 'Store Closing Time', key: 'closing_time' },
    { label: 'Store Country', key: 'store_country' },
    { label: 'Store Description', key: 'store_description', type: 'textarea' },
];

const UpdateStoreDataOneByOne = () => {
    const params = useLocalSearchParams();
    const router = useRouter();

    const fieldKey = params.field_key;
    const storeId = params.store_id;
    const initialValue = params.field_value || '';

    const field = FIELD_LIST.find((item) => item.key === fieldKey);
    const fieldLabel = field?.label || 'Field';
    const fieldType = field?.type || 'text';
    const fieldOptions = field?.options || [];

    const [value, setValue] = useState(initialValue);
    const [errorMessage, setErrorMessage] = useState('');
    const [isRedirecting, setIsRedirecting] = useState(false);

    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedTime, setSelectedTime] = useState(
        fieldKey === 'open_time' || fieldKey === 'closing_time' ? initialValue : ''
    );

    const { data, isLoading, error, patch } = useApi(`/stores/update`);

    useEffect(() => {
        if (data?.response) {
            const { response } = data;
            const isSuccess = response === 'Success';

            Toast.show({
                type: isSuccess ? 'success' : 'error',
                text1: 'Update Status',
                text2: response,
                visibilityTime: 4000,
                animationType: 'slide',
                position: 'bottom',
                text1Style: {
                    color: isSuccess ? '#32CD32' : 'black',
                    fontSize: 12,
                    fontFamily: 'maven-bold',
                },
                text2Style: {
                    color: isSuccess ? '#32CD32' : 'red',
                    fontSize: 12,
                },
            });

            if (isSuccess) {
                    setIsRedirecting(true);
                    setTimeout(() => {
                    router.back();
                }, 3000);
            }
        }
    }, [data]);

    const handleSubmit = () => {
        const currentValue =
        fieldKey === 'open_time' || fieldKey === 'closing_time'
            ? selectedTime
            : value;

        if (!currentValue.trim()) {
            const msg = `${fieldLabel} cannot be empty.`;
            setErrorMessage(msg);
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: msg,
            });
            return;
        }

        const payload = {
            store_id: storeId,
            [fieldKey]: currentValue,
        };

        patch(payload);
    };

    const onChangeTime = (event, selectedDate) => {
        setShowTimePicker(false);
        if (selectedDate) {
            const formattedTime = selectedDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            });
            setSelectedTime(formattedTime);
        }
    };

    const renderInputField = () => {
        if (fieldType === 'textarea') {
            return (
                <DescriptionInput
                    defaultValue={value}
                    handleChangeText={setValue}
                    title=""
                    lines={4}
                    desc=""
                />
            );
        }

        if (fieldType === 'picker') {
            return (
                <PickerInput
                    label={fieldLabel}
                    selectedValue={value}
                    onValueChange={(val) => setValue(val)}
                    options={fieldOptions}
                />
            );
        }

        if (fieldKey === 'open_time' || fieldKey === 'closing_time') {
            return (
                <View style={{ marginVertical: 10 }} className="justify-center">
                    <Text className="text-sm" style={{ fontFamily: 'roboto-medium' }}>
                        Current {fieldLabel}: {selectedTime}
                    </Text>
                    <TouchableOpacity
                        className="bg-green2 p-4 rounded-md flex-row w-full my-3 justify-center items-center"
                        onPress={() => setShowTimePicker(true)}
                    >
                        <Feather name="clock" size={18} color="white" />
                        <Text className="mx-2 text-sm text-white"
                            style={{ fontFamily: 'roboto-medium' }}
                        >
                        Select {fieldLabel}
                        </Text>
                        <FontAwesome name="caret-down" color="#fff" size={24} />
                    </TouchableOpacity>

                    {showTimePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={new Date()}
                            mode="time"
                            display="default"
                            onChange={onChangeTime}
                        />
                    )}
                </View>
            );
        }

        return (
            <FormInputs
                defaultValue={value}
                handleChangeText={setValue}
                borderStyle="border border-lavender"
                desc=""
            />
        );
    };

    return (
        <SafeAreaView className="flex-1 justify-center bg-white items-center">
            <View className="w-full px-4">
                <MainHeader fontFamily="maven-bold"header_name={`Edit ${fieldLabel}`}/>
            </View>

            <View className="flex-1 justify-center w-full px-4 my-10">
                <Text className="text-lg" style={{ fontFamily: 'maven-bold' }}>
                    {fieldLabel}
                </Text>

                {renderInputField()}

                {errorMessage && (
                    <Text
                        className="text-red mt-2 text-center" style={{ fontFamily: 'maven-medium' }}
                    >
                        {errorMessage}
                    </Text>
                )}

                <CustomButton
                    title={isLoading ? 'Updating...' : 'Update'}
                    handlePress={handleSubmit}
                    disabled={isLoading}
                    otherStyles={`bg-primary p-4 mt-4 ${
                        isLoading ? 'opacity-50' : 'opacity-100'
                    }`}
                    textStyles="text-lg"
                />
            </View>

            <Toast />
            {isLoading && <LoadingIndicator loading_text="Updating..." />}
            {isRedirecting && <Redirecting redirect_text="Please wait..." />}
        </SafeAreaView>
    );
};

export default UpdateStoreDataOneByOne;
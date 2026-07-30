import { Feather, FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../../../components/Buttons/CustomButton';
import DescriptionInput from '../../../../components/FormFields/DescriptionInput';
import FormInputs from '../../../../components/FormFields/FormInputs';
import PickerInput from '../../../../components/FormFields/PickerInput';
import MainHeader from '../../../../components/MainHeader';
import useApi from '../../../../hook/useApi';
import { toast } from '../../../../utils/toast';
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
        if (data) {
            if (data?.success) {
                toast.success(data?.message || `Successfully updated ${fieldLabel}`);
                setIsRedirecting(true);
                setTimeout(() => {
                    router.back();
                }, 3000);
            } else {
                toast.error(data?.message || `Failed To Upate  ${fieldLabel}`);
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
            toast.error('Validation Error', msg);
            return;
        }

        const payload = {
            business_id: params.business_id,
            store_id: storeId,
            [fieldKey]: currentValue,
        };

        patch(payload);
    };

    const onChangeTime = (event, selectedDate) => {
        setShowTimePicker(false);

        if (selectedDate) {
            const hours = selectedDate.getHours();
            const minutes = selectedDate.getMinutes();

            const formattedTime = `${
                hours < 10 ? `0${hours}` : hours
            }:${
                minutes < 10 ? `0${minutes}` : minutes
            }`;

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
                        className="bg-green2 py-3 rounded flex-row w-full my-3 justify-center items-center"
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
                <MainHeader fontFamily="ubuntu-medium" textStyles='text-2xl' header_name='Edit Store'/>
            </View>

            <View className="flex-1 justify-center w-full px-4 my-10">
                <Text className="text-lg font-semibold" style={{ fontFamily: 'roboto-medium' }}>
                    {fieldLabel}
                </Text>

                {renderInputField()}

                {errorMessage && (
                    <Text
                        className="text-red mt-2 text-center" style={{ fontFamily: 'roboto-medium' }}
                    >
                        {errorMessage}
                    </Text>
                )}

                <CustomButton
                    title={isLoading ? 'Updating...' : 'Update'}
                    handlePress={handleSubmit}
                    disabled={isLoading}
                    otherStyles={`bg-primary py-3 mt-4 ${
                        isLoading ? 'opacity-50' : 'opacity-100'
                    }`}
                    textStyles="text-2xl "
                />
            </View>

            {isLoading && <LoadingIndicator loading_text="Updating..." />}
            {isRedirecting && <Redirecting redirect_text="Please wait..." />}
        </SafeAreaView>
    );
};

export default UpdateStoreDataOneByOne;
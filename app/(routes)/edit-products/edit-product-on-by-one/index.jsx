import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import CustomButton from '../../../../components/Buttons/CustomButton';
import DescriptionInput from '../../../../components/FormFields/DescriptionInput';
import FormInputs from '../../../../components/FormFields/FormInputs';
import MainHeader from '../../../../components/MainHeader';
import useApi from '../../../../hook/useApi';
import LoadingIndicator from '../../../LoadingIndicator';
import Redirecting from '../../../Redirecting';

// Category options mapped by store type
const CATEGORY_OPTIONS = {
    Fashion: [
        'Men Shoes', 'Men jeans', 'Men T-shirts', 'Men shirts', "Men's boxers",
        'Dresses', 'Ladies Tops', 'Ladies bags', 'Ladies Shoes',
        'Ladies night wear', 'Skirts', 'Unisex', 'Sports wear'
    ],

    Restaurant: ['Any', 'Breakfast', 'Lunch', 'Supper', 'Drinks'],
    Electronics: ['Phones', 'Sound systems', 'Tv'],
    Cosmetics: ['Lotions', 'Bathing soaps', 'Creams', 'Nails', 'Body wash', 'Scrub'],
    Liquor: ['Wisky', 'Gin', 'Spirits', 'Wine', 'Lagar', 'Brandy', 'Ram', 'Cyders'],
    Grocery: ['Groceries'], // fallback
};

// Fields that can be edited
const FIELD_LIST = [
    { label: 'Product Name', key: 'product_name' },
    { label: 'Product Category', key: 'product_category', type: 'picker' },
    { label: 'Product Price', key: 'product_actual_price', type: 'textarea' },
    { label: 'Product Description', key: 'product_description', type: 'textarea' },
    { label: 'Product Colors', key: 'product_colors', type: 'multiselect' },
    { label: 'Product Sizes', key: 'product_sizes', type: 'multiselect' },
];

const EditProductField = () => {
    const params = useLocalSearchParams();
    const router = useRouter();

    const productId = params.product_id;
    const storeId = params.store_id;
    const storeCategory = params.store_category;
    
    let initialValue = params.product_value || '';
    const fieldLabelParam = params.product_label;

    // Parse JSON if editing colors or sizes
    if (fieldLabelParam?.toLowerCase().includes('color') || fieldLabelParam?.toLowerCase().includes('size')) {
        try {
            initialValue = JSON.parse(params.product_value);
        } catch {
            initialValue = [];
        }
    }
  
    const field = FIELD_LIST.find(f => f.label.toLowerCase() === fieldLabelParam?.toLowerCase());
    const fieldType = field?.type || 'text';
    const fieldKey = field?.key || fieldLabelParam;
    const fieldLabel = field?.label || fieldLabelParam;

    const [value, setValue] = useState(initialValue);
    const [errorMessage, setErrorMessage] = useState('');
    const [isRedirecting, setIsRedirecting] = useState(false);

    const { data: response, patch, isLoading } = useApi(`/products/update/`);

    useEffect(() => {
        if (response?.message) {
            if (!response.success) {
                showToast('error', 'Update Failed', response.message, 'red');
                setErrorMessage(response.message);
            } else {
                showToast('success', 'Update Successful', response.message, '#32CD32');
                setIsRedirecting(true);
                setTimeout(() => router.back(), 3000);
            }
        }
    }, [response]);

    const showToast = (type, title, message, color) => {
        Toast.show({
            type,
            text1: title,
            text2: message,
            position: 'bottom',
            visibilityTime: 3000,
            animationType: 'slide',
            text1Style: { fontSize: 14, fontFamily: 'roboto-bold', color },
            text2Style: { fontSize: 11, fontFamily: 'roboto-medium', color },
        });
    };

    const handleSubmit = async () => {
        if (!value) {
            setErrorMessage('Field is required.');
            return;
        }

        let cleanedValue = value;

        if (fieldKey === 'product_actual_price') {
            // Remove any non-digit or decimal characters (e.g. "K10,000" → "10000")
            cleanedValue = value.replace(/[^\d.]/g, '');
        }

        if (fieldKey === 'product_actual_price') {
            cleanedValue = value.replace(/[^\d.]/g, '');
        }

        if (Array.isArray(value)) {
            cleanedValue = JSON.stringify(value);
        }

        const payload = {
            product_id: productId,
            store_id: storeId,
            [fieldKey]: cleanedValue,
        };

        setErrorMessage('');
        await patch(payload);
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
        const options = CATEGORY_OPTIONS[storeCategory] || CATEGORY_OPTIONS['Grocery'];
            return (
                <View style={styles.fieldWrapper}>
                    <Text style={styles.label}>{fieldLabel}</Text>
                    <Text style={styles.desc}>Please select the product category.</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={value}
                            onValueChange={setValue}
                            style={styles.picker}
                            itemStyle={styles.pickerItem}
                        >
                        <Picker.Item label="Select option" value="" />
                            {options.map((opt) => (
                                <Picker.Item key={opt} label={opt} value={opt} />
                            ))}
                        </Picker>
                    </View>
                </View>
            );
        }

        if (fieldType === 'multiselect') {
            return (
                <View style={styles.fieldWrapper}>
                    <Text style={styles.label}>{fieldLabel}</Text>
                    <Text style={styles.desc}>Tap to remove or add more items manually.</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {value.map((item, idx) => (
                        <View key={idx} style={{ backgroundColor: '#E5E5F0', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, marginRight: 6, marginBottom: 6 }}>
                            <Text style={{ fontFamily: 'roboto-medium' }}>{item}</Text>
                        </View>
                        ))}
                    </View>
                    {/* Optional: Add a TextInput here to add more items dynamically */}
                </View>
            );
        }

        // Default: simple text input
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
                <MainHeader fontFamily="maven-bold" header_name={`Edit ${fieldLabel}`} />
            </View>

            <View className="flex-1 justify-center w-full px-4 my-10">
                <Text className="text-lg" style={{ fontFamily: 'maven-bold' }}>{fieldLabel}</Text>
                {renderInputField()}

                {errorMessage && (
                    <Text className="text-red mt-2 text-center" style={{ fontFamily: 'maven-medium' }}>
                        {errorMessage}
                    </Text>
                )}

                <CustomButton
                    title={isLoading ? 'Updating...' : 'Update'}
                    handlePress={handleSubmit}
                    disabled={isLoading}
                    otherStyles={`bg-primary p-4 mt-4 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
                    textStyles="text-lg"
                />
            </View>
            <Toast />
            {isLoading && <LoadingIndicator loading_text="Updating..." />}
            {isRedirecting && <Redirecting redirect_text="Please wait..." />}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    fieldWrapper: {
        marginVertical: 20,
    },
    label: {
        fontFamily: 'roboto-bold',
        fontSize: 18,
        color: '#000',
        marginBottom: 4,
    },
    desc: {
        fontFamily: 'roboto-medium',
        fontSize: 14,
        color: 'gray',
        marginBottom: 8,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#E5E5F0',
        borderRadius: 8,
        backgroundColor: '#fff',
        paddingHorizontal: 4,
    },
    picker: {
        height: 48,
        width: '100%',
    },
    pickerItem: {
        fontSize: 16,
        height: 44,
    },
});

export default EditProductField;
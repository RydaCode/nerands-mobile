import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DescriptionInput from '../../../../components/FormFields/DescriptionInput';
import FormInputs from '../../../../components/FormFields/FormInputs';
import MainHeader from '../../../../components/MainHeader';
import useApi from '../../../../hook/useApi';
import { toast } from '../../../../utils/toast';
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
    local_market: ['local_market'], // fallback
    Grocery: ['Groceries'], // fallback
};

// Fields that can be edited
const FIELD_LIST = [
    { label: 'Product Name', key: 'product_name' },
    { label: 'Product Category', key: 'product_category', type: 'picker' },
    { label: 'Product Price', key: 'product_price', type: 'textarea' },
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
                toast.error(response.message || 'Update Failed');
                setErrorMessage(response.message);
            } else {
                toast.success(response.message || 'Update Successful');
                setIsRedirecting(true);
                setTimeout(() => router.back(), 3000);
            }
        }
    }, [response]);

    const handleSubmit = async () => {
        if (!value) {
            setErrorMessage('Field is required.');
            return;
        }

        let cleanedValue = value;

        if (fieldKey === 'product_price') {
            // Remove any non-digit or decimal characters (e.g. "K10,000" → "10000")
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
        <SafeAreaView className="flex-1 px-4 justify-center bg-white items-center">
            <View className="w-full">
                <MainHeader fontFamily="ubuntu-medium" textStyles='text-2xl' header_name='Edit Product' />
            </View>

            <View className="flex-1 justify-center w-full my-10">
                <Text className="text-lg font-semibold" style={{ fontFamily: 'roboto-medium', marginBottom: -15 }}>{fieldLabel}</Text>
                {renderInputField()}

                {errorMessage && (
                    <Text className="text-red mt-2 text-center" style={{ fontFamily: 'maven-medium' }}>
                        {errorMessage}
                    </Text>
                )}

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isLoading || isRedirecting}
                    className="w-full justify-center items-center bg-primary py-3 mb-8 elevation-sm rounded border border-white"
                >
                    <Text className='text-2xl text-white' style={{fontFamily: 'maven-medium'}}>
                        {isLoading ? 'Please wait...' : 'Update'}
                    </Text>
                </TouchableOpacity>
            </View>
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
        height: 50,
        width: '100%',
    },
    pickerItem: {
        fontSize: 16,
        height: 44,
    },
});

export default EditProductField;
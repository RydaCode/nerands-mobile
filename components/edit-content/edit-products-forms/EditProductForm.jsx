import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import LoadingIndicator from '../../../app/LoadingIndicator';
import Redirecting from '../../../app/Redirecting';
import DescriptionInput from '../../../components/FormFields/DescriptionInput';
import MainHeader from '../../../components/MainHeader';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { PRODUCTS_IMAGE_URI } from '../../../RequestMethods';
import CustomButton from '../../Buttons/CustomButton';
import FormInputs from '../../FormFields/FormInputs';
import CategoryPicker from './CategoryPicker';

const EditProductForm = ({
        store_id,
        product_id,
        product_image,
        product_name,
        product_description,
        product_actual_price,
        product_status,
        store_name,
        store_category,
        product_category,
        product_colors,
        product_sizes,
        chili_option,
        product_extras_status,
        store_profileimage,
    }) => {
    const { user_id } = useSelector((state) => state.auth);
    const router = useRouter();

    const [selectedcategory, setSelectedCategory] = useState(product_category);
    const [chillieoption, setChillieOption] = useState(chili_option);
    const [productname, setProductName] = useState(product_name);
    const [productdescription, setProductDescription] = useState(product_description);
    const [productactualprice, setProductActualPrice] = useState(product_actual_price);
    const capitalize = (str) => {
        if (typeof str !== 'string') return str;
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const [productColorsText, setProductColorsText] = useState(
    Array.isArray(product_colors)
        ? product_colors.map(capitalize).join(', ') : (product_colors || '')
    );
    const [productSizesText, setProductSizesText] = useState(
    Array.isArray(product_sizes)
        ? product_sizes.map((s) => s.toUpperCase()).join(', ') : (product_sizes || '')
    );
    const [errorMessage, setErrorMessage] = useState('');
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [formData, setFormData] = useState({
        user_id,
        store_id,
        product_id,
        product_name: productname,
        product_category: selectedcategory,
        product_description: productdescription,
        product_actual_price: productactualprice,
        colors: productColorsText,
        sizes: productSizesText, 
        chili_option: chillieoption,
    });

    const { data: response, patch, isLoading, error } = useApi(`/products/update/`, formData);

    useEffect(() => {
        const parseInput = (input, transformFn) => input
        ?.split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .map(transformFn) || [];

        const data = {
            user_id,
            store_id,
            product_id,
            product_name: capitalize(productname),
            product_category: capitalize(selectedcategory),
            product_description: capitalize(productdescription),
            product_actual_price: productactualprice,
            colors: parseInput(productColorsText, capitalize),
            sizes: parseInput(productSizesText, capitalize),
        };

        if (store_category === 'Restaurant') {
            data.chili_option = chillieoption ?? false;
        }

        setFormData(data);
    }, [
        productname,
        selectedcategory,
        productdescription,
        productactualprice,
        productColorsText,
        productSizesText,
        chillieoption,
    ]);

    useEffect(() => {
        if (response?.message) {
            setErrorMessage(response.message);

            if (!response.success) {
                showToast('error', 'Update Failed', response.message, 'red');
            } else {
                showToast('success', 'Update Successful', response.message, '#32CD32');
                setIsRedirecting(true);
                setTimeout(() => router.back(), 5000);
            }
        }
    }, [response]);

    const showToast = (type, title, message, color) => {
        Toast.show({
            type,
            text1: title,
            text2: message,
            visibilityTime: 4000,
            animationType: 'slide',
            position: 'bottom',
            text1Style: {
                color,
                fontSize: 14,
                fontFamily: 'roboto-bold',
            },
            text2Style: {
                color,
                fontSize: 11,
                fontFamily: 'roboto-medium',
            },
        });
    };

    const handleUpdateProduct = () => {
        setErrorMessage('');

        // Validation...
        if (!formData.product_name) {
            return showToast('error', 'Validation Error', 'Product name cannot be empty!', 'red');
        }

        if (!formData.product_name) {
            setErrorMessage('Product name cannot be empty!');
            return showToast('error', 'Response', 'Product name cannot be empty!', 'red');
        }

        if (!formData.product_actual_price) {
            setErrorMessage('Price cannot be empty!');
            return showToast('error', 'Response', 'Price cannot be empty!', 'red');
        }

        if (isNaN(formData.product_actual_price) || Number(formData.product_actual_price) <= 0) {
            setErrorMessage('Price must be a number greater than 0!');
            return showToast('error', 'Response', 'Price must be a number greater than 0!', 'red');
        }

        if (!formData.product_description) {
            setErrorMessage('Description cannot be empty!');
            return showToast('error', 'Response', 'Description cannot be empty!', 'red');
        }

        const cleanedData = Object.fromEntries(
            Object.entries(formData).filter(([_, v]) => v !== undefined)
        );

        patch(cleanedData); // Trigger update
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        setFormData(prev => ({ ...prev, product_category: value }));
    };

    return (
        <>
            <SafeAreaView className="flex-1 bg-white">
                <View className="px-4 w-full">
                    <MainHeader fontFamily="maven-medium" textStyles="text-2xl" header_name="Edit Product" />
                </View>
                <View className="justify-center items-center px-4 w-full">
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Store Info */}
                        <View className="w-full flex-row items-center">
                            <View style={{ height: 80, width: 80 }} className="rounded-full border-2 border-lavender">
                                <Image className="h-full w-full rounded-full" source={{ uri: `${PRODUCTS_IMAGE_URI}${product_image}` }} />
                            </View>
                            <View className="w-[75%] ml-1">
                                <Text className="text-xl" style={{ fontFamily: 'roboto-medium' }}>{product_name}</Text>
                                <Text className="text-sm text-slate" style={{ fontFamily: 'roboto-medium' }}>{product_category}</Text>
                            </View>
                        </View>
                        {/* Form Fields */}
                        <View className="w-full mt-10">
                            <FormInputs
                                title="Product Name"
                                defaultValue={productname}
                                handleChangeText={setProductName}
                                borderStyle="border border-lavender"
                            />
                            <View className="my-5">
                                <Text className="text-black text-base mb-1" style={{ fontFamily: 'roboto-bold' }}>Product category</Text>
                                <View className="rounded-md border border-lavender">
                                    <CategoryPicker
                                        store_category={store_category}
                                        selectedcategory={selectedcategory}
                                        handleCategoryChange={handleCategoryChange}
                                    />
                                </View>
                            </View>
                            <FormInputs
                                title="Product Price"
                                defaultValue={productactualprice}
                                handleChangeText={setProductActualPrice}
                                borderStyle="border border-lavender"
                            />

                            <DescriptionInput
                                title="Description"
                                defaultValue={productdescription}
                                handleChangeText={setProductDescription}
                                borderStyle="border border-lavender rounded-md"
                                lines={4}
                            />

                            {/* Fashion Fields */}
                            {store_category === 'Fashion' && (
                                <>
                                    <FormInputs
                                        title="Product Colors"
                                        defaultValue={productColorsText}
                                        handleChangeText={setProductColorsText}
                                        desc="Edit colors separated by commas"
                                        borderStyle="border border-lavender"
                                    />

                                    <FormInputs
                                        title="Product Sizes"
                                        defaultValue={productSizesText}
                                        handleChangeText={setProductSizesText}
                                        desc="Edit sizes separated by commas"
                                        borderStyle="border border-lavender"
                                    />
                                </>
                            )}

                            {/* Restaurant Extras */}
                            {store_category === 'Restaurant' && (
                                <>
                                    {/* Chilli Option */}
                                    <View className="w-full">
                                        <Text className="text-gray-700 text-lg" style={{ fontFamily: 'maven-bold' }}>Chillie Option</Text>
                                        <Text className="text-slate text-sm mb-4" style={{ fontFamily: 'roboto-medium' }}>
                                            Enable / Deisable chilli selection for this item
                                        </Text>
                                        <BouncyCheckbox
                                            isChecked={chillieoption}
                                            onPress={() => setChillieOption(!chillieoption)}
                                            text={chillieoption ? 'Available' : 'Not available'}
                                            textStyle={{ textDecorationLine: 'none', color: COLORS.slate, marginLeft: -10, fontSize: 13 }}
                                            size={20}
                                            fillColor={COLORS.primary}
                                            iconStyle={{ borderColor: COLORS.primary, borderRadius: 2 }}
                                            innerIconStyle={{ borderWidth: 2, borderRadius: 2 }}
                                        />
                                    </View>
                                </>
                            )}
                            <View className="w-full justify-center items-center mt-4">
                                <Text className={`text-sm ${response?.success ? 'text-green2' : 'text-red'} text-base`}>
                                    {response?.success ? 'Please wait...' : errorMessage}
                                </Text>
                            </View>
                            <CustomButton
                                title={isLoading ? 'Please wait...' : 'Update'}
                                handlePress={handleUpdateProduct}
                                disabled={isLoading || isRedirecting}
                                otherStyles="bg-primary p-4 mt-4"
                                textStyles="text-2xl"
                            />
                        </View>
                        <View className="pb-20" />
                    </ScrollView>
                </View>
                <Toast />
                {isRedirecting && <Redirecting title="Success" />}
            </SafeAreaView>
            {isLoading && <LoadingIndicator loading_text="Updating product..." />}
        </>
    );
};

export default EditProductForm;
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import LoadingIndicator from '../../../app/LoadingIndicator';
import Redirecting from '../../../app/Redirecting';
import DescriptionInput from '../../../components/FormFields/DescriptionInput';
import MainHeader from '../../../components/MainHeader';
import useApi from '../../../hook/useApi';
import { PRODUCTS_IMAGE_URI } from '../../../RequestMethods';
import { toast } from '../../../utils/toast';
import FormInputs from '../../FormFields/FormInputs';
import CategoryPicker from './CategoryPicker';

const EditProductForm = ({
        store_id,
        product_id,
        product_image,
        product_name,
        product_description,
        product_price,
        product_status,
        store_name,
        store_category,
        product_category,
        product_extras_status,
        store_profileimage,
    }) => {
    const { user_id } = useSelector((state) => state.auth);
    const router = useRouter();

    const [selectedcategory, setSelectedCategory] = useState(product_category);
    const [productname, setProductName] = useState(product_name);
    const [productdescription, setProductDescription] = useState(product_description);
    const [productactualprice, setProductActualPrice] = useState(product_price);
    const capitalize = (str) => {
        if (typeof str !== 'string') return str;
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const [errorMessage, setErrorMessage] = useState('');
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [formData, setFormData] = useState({
        user_id,
        store_id,
        product_id,
        product_name: productname,
        product_category: selectedcategory,
        product_description: productdescription,
        product_price: productactualprice,
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
            product_price: productactualprice,
        };

        setFormData(data);
    }, [
        productname,
        selectedcategory,
        productdescription,
        productactualprice,
    ]);

    useEffect(() => {
        if (response?.message) {
            setErrorMessage(response.message);

            if (!response.success) {
                toast.error(response.message || 'Update Failed');
            } else {
                toast.success(response.message || 'Update Successful');
                setIsRedirecting(true);
                setTimeout(() => router.back(), 5000);
            }
        }
    }, [response]);

    const handleUpdateProduct = () => {
        setErrorMessage('');

        // Validation...
        if (!formData.product_name) {
            return toast.error('Product name cannot be empty!');
        }

        if (!formData.product_name) {
            setErrorMessage('Product name cannot be empty!');
            return toast.error('Product name cannot be empty!');
        }

        if (!formData.product_price) {
            setErrorMessage('Price cannot be empty!');
            return toast.error('Price cannot be empty!');
        }

        if (isNaN(formData.product_price) || Number(formData.product_price) <= 0) {
            setErrorMessage('Price must be a number greater than 0!');
            return toast.error('Price must be a number greater than 0!');
        }

        if (!formData.product_description) {
            setErrorMessage('Description cannot be empty!');
            return toast.error('Description cannot be empty!');
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
            <SafeAreaView className="flex-1 px-2 bg-white">
                <View className="px-2 w-full">
                    <MainHeader fontFamily="ubuntu-medium" textStyles="text-2xl" header_name="Edit Product" />
                </View>
                <View className="justify-center items-center w-full">
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Store Info */}
                        <View className="w-full flex-row items-center">
                            <View style={{ height: 70, width: 70 }} className="rounded-full border-2 border-lavender">
                                <Image className="h-full w-full rounded-full border-2 border-white" source={{ uri: `${PRODUCTS_IMAGE_URI}${product_image}` }} />
                            </View>
                            <View className="w-[75%] ml-1">
                                <Text className="text-lg" style={{ fontFamily: 'roboto-medium' }}>{product_name}</Text>
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
                            <View className="mb-5">
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
                                keyboardType='numeric'
                            />

                            <DescriptionInput
                                title="Description"
                                defaultValue={productdescription}
                                handleChangeText={setProductDescription}
                                borderStyle="border border-lavender rounded-md"
                                lines={4}
                            />

                            <View className="w-full justify-center items-center mt-4">
                                <Text className={`text-sm ${response?.success ? 'text-green2' : 'text-red'} text-base`}>
                                    {response?.success ? 'Please wait...' : errorMessage}
                                </Text>
                            </View>
                        </View>
                        {/* <View className="pb-20" /> */}
                    </ScrollView>
                    <TouchableOpacity
                        onPress={handleUpdateProduct}
                        disabled={isLoading || isRedirecting}
                        className="w-full justify-center items-center bg-primary py-3 mb-8 elevation-sm rounded border border-white"
                    >
                        <Text className='text-2xl text-white' style={{fontFamily: 'maven-medium'}}>
                            {isLoading ? 'Please wait...' : 'Update'}
                        </Text>
                    </TouchableOpacity>
                </View>
                {isRedirecting && <Redirecting title="Success" />}
            </SafeAreaView>
            {isLoading && <LoadingIndicator loading_text="Updating product..." />}
        </>
    );
};

export default EditProductForm;
import { ActivityIndicator, Animated, Image, Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
// import FashionCosmeticsProducts from '../../../components/create-product-components/FashionCosmeticsProducts'
// import RestaurantProducts from '../../../components/create-product-components/RestaurantProducts'
// import LiquorProducts from '../../../components/create-product-components/LiquorProducts'
// import GroceriesProducts from '../../../components/create-product-components/GroceriesProducts'
import { FontAwesome5 } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown'
import { useSelector } from 'react-redux'
import DescriptionInput from '../../../../components/FormFields/DescriptionInput'
import FormInputs from '../../../../components/FormFields/FormInputs'
import { COLORS } from '../../../../constants/constants'
import { SERVER_URI, STORES_IMAGE_URI } from '../../../../RequestMethods'
import { toast } from '../../../../utils/toast'
import OverLay from '../../../OverLay'
import { categoryMap } from './categoryMap'

const CreateProductCard = ({params}) => {
    const { user_id } = useSelector((state) => state.auth);
    const [selectedcategory, setSelectedCategory] = useState('Select category');
    const [chillioption, setChilliOption] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [fadeAnim] = useState(new Animated.Value(0));
    const [colorsinputs, setColorsInputs] = useState([{ id: Date.now().toString(), value: '' }]);
    const [sizesinputs, setSizesInputs] = useState([{ id: Date.now().toString(), value: '' }]);
    const [coloroption, setColorOption] = useState(false);
    const [sizeoption, setSizeOption] = useState(false);

    const [formData, setFormData] = useState({
        user_id: user_id,
        store_id: params.store_id,
        store_category: params.store_category,
        product_name: '',
        product_category: '',
        product_description: '',
        product_price: ''
    });

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
        }
    }, [errorMessage]);

    const handleChangeText = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        setFormData((prev) => ({
            ...prev,
            product_category: value,
        }));
    };

    const singleSelectCategories = ['Restaurant', 'local_market'];

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsMultipleSelection: !singleSelectCategories.includes(params.store_category),
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets?.length > 0) {
                const selectedImages = result.assets.map((asset) => asset.uri);
                setImages((prevImages) => [...prevImages, ...selectedImages]);
            } else {
                toast.info('No image selected or operation canceled.');
            }
        } catch (error) {
            console.error('Image picker error:', error);
            toast.error('Image picker error');
        }
    };

    const removeImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const handleCreateProduct = async () => {
        if (!formData.product_name)
            return toast.error('Please enter product name!');
        if (!formData.product_category)
            return toast.error('Please select product category!');
        if (!formData.product_price)
            return toast.error('Please enter product price!');
        if (!formData.product_description)
            return toast.error('Please provide product description!');
        if (images.length === 0)
            return toast.error('Please select at least one image.');

        try {
            setIsLoading(true);

            const token = await SecureStore.getItemAsync('authToken');
            if (!token) toast.info('You are not authenticated, please go and login');

            const formDataObj = new FormData();

            // Append text fields
            formDataObj.append('user_id', formData.user_id);
            formDataObj.append('store_id', formData.store_id);
            formDataObj.append('product_name', formData.product_name);
            formDataObj.append('product_category', formData.product_category);
            formDataObj.append('product_description', formData.product_description);
            formDataObj.append('product_price', formData.product_price);
            formDataObj.append('store_category', formData.store_category);

            // Append images
            images.forEach((imageUri, index) => {
                const fileType =
                    imageUri.endsWith('.png') ? 'image/png' :
                    imageUri.endsWith('.jpg') ? 'image/jpeg' :
                    imageUri.endsWith('.jpeg') ? 'image/jpeg' :
                    'image/jpeg';

                formDataObj.append('product_images', {
                    uri: imageUri,
                    name: `image_${index}.jpg`,
                    type: fileType,
                });
            });

            const response = await fetch(`${SERVER_URI}/products/create`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formDataObj,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Upload failed');
            }

            toast.success('Product created successfully!');

            // ✅ Reset form
            setImages([]);
            setFormData({
                ...formData,
                product_name: '',
                product_category: '',
                product_description: '',
                product_price: ''
            });

            // ✅ Reset selected category dropdown
            setSelectedCategory('Select category');

        } catch (error) {
            console.error("Upload error:", error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Automatically hide after 3 seconds
    useEffect(() => {
        if (errorMessage) {
            // Fade in
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            // After 3s, fade out
            const timer = setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => setErrorMessage(''));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    const dropdownData =
        categoryMap[params.store_category] || categoryMap.default;

    return (
        <>
            <View className="flex-1 justify-between">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View className='w-full flex-row justify-satrt items-center'>
                            <View style={{height: 70, width: 70}} className='rounded-full justify-center items-center border-2 border-lavender'>
                                <Image className='h-full w-full rounded-full border-2 border-white' source={{uri: `${STORES_IMAGE_URI}${params.store_profileimage}`}} />
                            </View>
                            <View className='w-[75%] ml-1'>
                                <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>{params.store_name}</Text>
                                <Text className='text-sm text-slate' style={{fontFamily: 'roboto-medium'}}>{params.store_category}</Text>
                            </View>
                        </View>
                        <View className='w-full mt-10'>
                            <FormInputs
                                title='Product Name'
                                handleChangeText={(value) => handleChangeText('product_name', value)}
                                desc='Please enter product name, ensure that the product name corresponds with product category'
                                borderStyle='border border-lavender'
                            />
                            <View className="mb-5">
                                <Text className="text-black text-base mb-1" style={{ fontFamily: 'roboto-medium' }}>Category</Text>
                                <Text className="text-sm mb-1 text-slate" style={{ fontFamily: 'roboto-medium' }}>Please select the product category to help users find your product easily.</Text>
                                
                                <Dropdown
                                    data={dropdownData}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select Category"
                                    value={selectedcategory}
                                    onChange={(item) => {
                                        handleCategoryChange(item.value);
                                    }}
                                    style={{
                                        borderWidth: 2,
                                        borderColor: COLORS.lavender,
                                        borderRadius: 12,
                                        paddingHorizontal: 12,
                                        height: 50,
                                    }}
                                />
                            </View>
                            <FormInputs
                                title='Price'
                                handleChangeText={(value) => handleChangeText('product_price', value)}
                                borderStyle='border border-lavender'
                                keyboardType='numeric'
                            />

                            <DescriptionInput
                                title='Description'
                                handleChangeText={(value) => handleChangeText('product_description', value)}
                                desc='Please add a descrpition to your product. Ensure to put a description that best describe your product.'
                                otherStyles='text-lg'
                                borderStyle='border-2 border-lavender rounded-xl'
                                lines={4}
                            />

                            <View className='w-full mt-10'>
                                {/* Pick Image Button */}
                                {params.store_category === 'Restaurant' || params.store_category === 'Liquor' || params.store_category === 'local_market' ? (
                                    <View className='w-full'>
                                        {images.length === 1 ? 
                                            <View>
                                                <Text className='text-sm text-red' style={{fontFamily: 'roboto-medium'}}>To change image, remove the current selected image.</Text>
                                            </View> :
                                            <TouchableOpacity
                                                onPress={pickImage}
                                                className={`border bg-grey_bg ${images.length === 0 ? 'border-lavender' : 'border-primary'} py-3 rounded w-full flex-row justify-center items-center`}
                                            >
                                                <FontAwesome5 name="camera" size={24} color={COLORS.green1} />
                                                {images.length === 0 ? (
                                                    <Text className="text-base ml-2">Pick Image</Text>
                                                ) : (
                                                    <>
                                                        {images.length > 0 && (
                                                            <Text
                                                                className="text-primary text-sm ml-2"
                                                                style={{ fontFamily: 'roboto-medium' }}
                                                            >
                                                                {images.length} Image{images.length > 1 ? 's' : ''} Selected
                                                            </Text>
                                                        )}
                                                    </>
                                                )}
                                            </TouchableOpacity>
                                        }
                                    </View>
                                ) : (
                                    <View className='w-full'>
                                        <View className='w-full items-center justify-center mb-4'>
                                            <Text className='text-sm text-red' style={{fontFamily: 'roboto-medium'}}>A maximum of 8 images are allowed</Text>
                                        </View>
                                        {images.length >= 8 ? 
                                            <View>
                                                <Text className='text-sm text-slate' style={{fontFamily: 'roboto-medium'}}>If you want to add different images, please remove some images you do not want.</Text>
                                            </View> :
                                            <TouchableOpacity
                                                onPress={pickImage}
                                                className={`border bg-grey_bg ${images.length === 0 ? 'border-lavender' : 'border-green2'} py-3 rounded-lg w-full flex-row justify-center items-center`}
                                            >
                                                <FontAwesome5 name="camera" size={24} color={COLORS.green1} />
                                                {images.length === 0 ? (
                                                    <Text className="text-lg text-green1 ml-2" style={{fontFamily: 'roboto-medium'}}>Pick Image</Text>
                                                ) : (
                                                    <>
                                                        {images.length > 0 && (
                                                            <Text
                                                                className="text-primary text-sm ml-2"
                                                                style={{ fontFamily: 'roboto-medium' }}
                                                            >
                                                                {images.length} Image{images.length > 1 ? 's' : ''} Selected
                                                            </Text>
                                                        )}
                                                    </>
                                                )}
                                            </TouchableOpacity>
                                        }
                                    </View>
                                )}

                                {/* Display selected images */}
                                {images.length > 2 && (
                                    <TouchableOpacity
                                        onPress={() => setImages([])}
                                        className="mt-5 w-[35%] justify-center items-center bg-red rounded-full py-1"
                                    >
                                        <Text className="text-white text-sm" style={{ fontFamily: 'roboto-medium' }}>
                                        Discard all
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                <ScrollView className={`${images.length === 0 ? 'mb-4' : 'mb-0'}`} horizontal showsHorizontalScrollIndicator={false}>
                                    <View
                                        animation='slideInLeft'
                                        iterationCount={1}
                                        className='flex-row items-center justify-between mt-3'>
                                        {images.map((uri, index) => (
                                            <View key={index} className="relative mr-1 rounded-md border border-lavender">
                                                <Image
                                                    source={{ uri }}
                                                    style={{ width: 105, height: 95 }}
                                                    className="rounded-md"
                                                />
                                                <TouchableOpacity
                                                    onPress={() => removeImage(index)}
                                                    className="absolute justify-center opacity-60 items-center top-1 right-1 h-[24px] w-[24px] bg-red rounded-full p-1"
                                                >
                                                    <FontAwesome5 name='times' color={COLORS.white} />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                </ScrollView>
                                <View className='w-full justify-center items-center mt-1'>
                                    <Text className={`text-sm text-${images.length > 8 ? 'red' : 'green1'}`}>{images.length} selected</Text>
                                </View>
                            </View>

                            <View className='w-full justify-center items-center mt-4'>
                                <Text className='text-red text-sm' style={{fontFamily: 'roboto-medium'}}>{images.length > 8 ? 'You have selcted more than 8 images, please remove some images to continue' : ''}</Text>
                            </View>
                            {errorMessage !== '' && (
                                <Animated.View
                                    style={{
                                        opacity: fadeAnim,
                                        width: '100%',
                                        alignItems: 'center',
                                        marginTop: 16,
                                    }}
                                >
                                    <Text
                                        className={`${errorMessage === 'Success' ? 'text-green2' : 'text-red'} text-sm`}
                                        style={{ fontFamily: 'roboto-medium' }}
                                    >
                                        {errorMessage === 'Success' ? 'Please wait...' : errorMessage}
                                    </Text>
                                </Animated.View>
                            )}
                        </View>
                        {/* <View className='pb-20' /> */}
                    </ScrollView>
                </TouchableWithoutFeedback>
                
                <TouchableOpacity
                    className={
                        `w-full py-3 bg-primary justify-center items-center rounded mb-6 elevation-sm
                        ${
                            images.length < 1 ||
                            !formData.product_name ||
                            !formData.product_price ||
                            !formData.product_category ||
                            images.length > 8 ? 'opacity-50' : 'opacity-100'
                        }
                    `}
                    disabled={
                        isLoading ||
                        images.length < 1 ||
                        images.length > 8 ||
                        !formData.product_name ||
                        !formData.product_price ||
                        !formData.product_category
                    }
                    onPress={() => handleCreateProduct()}
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
            {isLoading && <OverLay />}
        </>
    )
}

const styles = StyleSheet.create({
    picker: {
        height: 50,
        justifyContent: 'center',
        borderRadius: 5,
        alignItems: 'center',
        width: '100%'
    },
    pickerItem: {
        color: COLORS.red,
        fontSize: 13,
        fontFamily: 'roboto-medium',
    }
});

export default CreateProductCard
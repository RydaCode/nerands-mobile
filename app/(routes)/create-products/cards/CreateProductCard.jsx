import { Animated, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
// import FashionCosmeticsProducts from '../../../components/create-product-components/FashionCosmeticsProducts'
// import RestaurantProducts from '../../../components/create-product-components/RestaurantProducts'
// import LiquorProducts from '../../../components/create-product-components/LiquorProducts'
// import GroceriesProducts from '../../../components/create-product-components/GroceriesProducts'
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'
import * as ImagePicker from 'expo-image-picker'
import * as SecureStore from 'expo-secure-store'
import { useCallback, useEffect, useState } from 'react'
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import CustomButton from '../../../../components/Buttons/CustomButton'
import DescriptionInput from '../../../../components/FormFields/DescriptionInput'
import FormInputs from '../../../../components/FormFields/FormInputs'
import MainHeader from '../../../../components/MainHeader'
import { COLORS } from '../../../../constants/constants'
import { SERVER_URI, STORES_IMAGE_URI } from '../../../../RequestMethods'
import { toast } from '../../../../utils/toast'
import LoadingIndicator from '../../../LoadingIndicator'
import Redirecting from '../../../Redirecting'

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
        product_actual_price: '',
        sizes: sizesinputs,
        colors: colorsinputs,
        chili_option: chillioption,
    });

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            chili_option: chillioption,
            sizes: sizeoption ? sizesinputs : [],
            colors: coloroption ? colorsinputs : [],
        }));
    }, [chillioption, sizesinputs, colorsinputs, sizeoption, coloroption]);

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
                console.log('No image selected or operation canceled.');
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

    const colorArray = colorsinputs
    .map(input => input.value.trim())
    .filter(value => value.length > 0);

    const sizeArray = sizesinputs
    .map(input => input.value.trim())
    .filter(value => value.length > 0);

    const handleCreateProduct = async () => {
        if (!formData.product_name)
            return toast.error('Please enter product name!');
        if (!formData.product_category)
            return toast.error('Please select product category!');
        if (!formData.product_actual_price)
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
            formDataObj.append('product_actual_price', formData.product_actual_price);
            formDataObj.append('store_category', formData.store_category);
            formDataObj.append('chili_option', formData.chili_option ? 'true' : 'false');
            formDataObj.append('sizes', JSON.stringify(sizeArray));
            formDataObj.append('colors', JSON.stringify(colorArray));

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
                    Authorization: `Bearer ${token}`,
                    // DO NOT set Content-Type manually
                },
                body: formDataObj,
            });

            const data = await response.json();
            console.log("Response:", data);

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
                product_actual_price: '',
                colors: [],
                sizes: [],
                chili_option: false,
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

    const addColorsInputField = useCallback(() => {
        setColorsInputs(prev => [...prev, { id: Date.now().toString(), value: '' }]);
    }, []);

    const handleColorsInputChange = (id, value) => {
        setColorsInputs(prev =>
            prev.map(input => (input.id === id ? { ...input, value } : input))
        );
    };

    const removeColorsInputField = useCallback((id) => {
        if (colorsinputs.length > 1) {
            setColorsInputs(prev => prev.filter(input => input.id !== id));
        } else {
            toast.info("You can't remove the last text box!");
        }
    }, [colorsinputs.length]);
    
    const addSizesInputField = useCallback(() => {
        setSizesInputs(prev => [...prev, { id: Date.now().toString(), value: '' }]);
    }, []);

    const handleSizesInputChange = (id, value) => {
        setSizesInputs(prev =>
            prev.map(input => (input.id === id ? { ...input, value } : input))
        );
    };

    const removeSizesInputField = useCallback((id) => {
        if (sizesinputs.length > 1) {
            setSizesInputs(prev => prev.filter(input => input.id !== id));
        } else {
            toast.info("You can't remove the last text box!");
        }
    }, [sizesinputs.length]);

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

    return (
        <>
            <SafeAreaView className='flex-1 bg-white items-center px-4'>
                <MainHeader fontFamily='ubuntu-medium' textStyles='text-2xl' header_name='Create Product' />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className='flex-1'
                    // keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
                >
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
                                    <View className="my-5">
                                        <Text className="text-black text-lg mb-1" style={{ fontFamily: 'roboto-bold' }}>Product category</Text>
                                        <Text className="text-sm mb-1 text-slate" style={{ fontFamily: 'roboto-medium' }}>Please select the product category to help users find your product easily.</Text>
                                        <View className="border border-lavender rounded-md mb-2 bg-white justify-center p-0 items-center flex-row">
                                            
                                            {params.store_category === 'Fashion' ? (
                                                <Picker
                                                    selectedValue={selectedcategory}
                                                    onValueChange={handleCategoryChange}
                                                    style={styles.picker}
                                                    itemStyle={styles.pickerItem}
                                                >
                                                    <Picker.Item label='Select category' value='' />
                                                    <Picker.Item label='Men Shoes' value='Men Shoes' />
                                                    <Picker.Item label='Men jeans' value='Men jeans' />
                                                    <Picker.Item label='Men T-shirts' value='Men T-shirts' />
                                                    <Picker.Item label='Men shirts' value='Men shirts' />
                                                    <Picker.Item label="Men's boxers" value="Men's boxers" />
                                                    <Picker.Item label='Dresses' value='Dresses' />
                                                    <Picker.Item label='Ladies Tops' value='Ladies Tops' />
                                                    <Picker.Item label='Ladies bags' value='Ladies bags' />
                                                    <Picker.Item label='Ladies Shoes' value='Ladies Shoes' />
                                                    <Picker.Item label='Ladies night wear' value='Ladies night wear' />
                                                    <Picker.Item label='Skirts' value='Skirts' />
                                                    <Picker.Item label='Unisex' value='Unisex' />
                                                    <Picker.Item label='Sports wear' value='Sports wear' />
                                                </Picker>
                                            ) : params.store_category === 'Restaurant' ? (
                                                <Picker
                                                    selectedValue={selectedcategory}
                                                    onValueChange={handleCategoryChange}
                                                    style={styles.picker}
                                                    itemStyle={styles.pickerItem}
                                                >
                                                    <Picker.Item label='Select category' value='' />
                                                    <Picker.Item label='Any' value='Any' />
                                                    <Picker.Item label='Breakfast' value='Breakfast' />
                                                    <Picker.Item label='Lunch' value='Lunch' />
                                                    <Picker.Item label='Supper' value='Supper' />
                                                    <Picker.Item label='Drinks' value='Drinks' />
                                                </Picker>
                                            ) : params.store_category === 'Electronics' ? (
                                                <Picker
                                                    selectedValue={selectedcategory}
                                                    onValueChange={handleCategoryChange}
                                                    style={styles.picker}
                                                    itemStyle={styles.pickerItem}
                                                >
                                                    <Picker.Item label='Select category' value='' />
                                                    <Picker.Item label='Phones' value='Phones' />
                                                    <Picker.Item label='Sound systems' value='Sound systems' />
                                                    <Picker.Item label='Tv' value='Tv' />
                                                    <Picker.Item label='Drinks' value='Drinks' />
                                                </Picker>
                                            ) : params.store_category === 'Cosmetics' ? (
                                                <Picker
                                                    selectedValue={selectedcategory}
                                                    onValueChange={handleCategoryChange}
                                                    style={styles.picker}
                                                    itemStyle={styles.pickerItem}
                                                >
                                                    <Picker.Item label='Select category' value='' />
                                                    <Picker.Item label='Lotions' value='Lotions' />
                                                    <Picker.Item label='Bathing soaps' value='Bathing soaps' />
                                                    <Picker.Item label='Creams' value='Creams' />
                                                    <Picker.Item label='Nails' value='Nails' />
                                                    <Picker.Item label='Body wash' value='Body wash' />
                                                    <Picker.Item label='Scrub' value='Scrub' />
                                                </Picker>
                                            ) : params.store_category === 'Liquor' ? (
                                                <Picker
                                                    selectedValue={selectedcategory}
                                                    onValueChange={handleCategoryChange}
                                                    style={styles.picker}
                                                    itemStyle={styles.pickerItem}
                                                >
                                                    <Picker.Item label='Select category' value='' />
                                                    <Picker.Item label='Wisky' value='Wisky' />
                                                    <Picker.Item label='Gin' value='Gin' />
                                                    <Picker.Item label='Spirits' value='Spirits' />
                                                    <Picker.Item label='Wine' value='Wine' />
                                                    <Picker.Item label='Lagar' value='Lagar' />
                                                    <Picker.Item label='Brandy' value='Brandy' />
                                                    <Picker.Item label='Ram' value='Ram' />
                                                    <Picker.Item label='Cyders' value='Cyders' />
                                                </Picker>
                                            ) : params.store_category === 'local_market' ? (
                                                <Picker
                                                    selectedValue={selectedcategory}
                                                    onValueChange={handleCategoryChange}
                                                    style={styles.picker}
                                                    itemStyle={styles.pickerItem}
                                                >
                                                    <Picker.Item label='Select category' value='' />
                                                    <Picker.Item label='Vegies' value='Vegies' />
                                                    <Picker.Item label='Drie Kapenta' value='Drie Kapenta' />
                                                    <Picker.Item label='Drie Fish' value='Drie Fish' />
                                                    <Picker.Item label='Catapillas' value='Catapillas' />
                                                    <Picker.Item label='Beans' value='Beans' />
                                                    <Picker.Item label='Nuts' value='Nuts' />
                                                    <Picker.Item label='Fruits' value='Fruits' />
                                                    <Picker.Item label='Spices' value='Spices' />
                                                    <Picker.Item label='Spices' value='Spices' />
                                                </Picker>
                                            ) : (
                                                <Picker
                                                    selectedValue={selectedcategory}
                                                    onValueChange={handleCategoryChange}
                                                    style={styles.picker}
                                                    itemStyle={styles.pickerItem}
                                                >
                                                    <Picker.Item label='Select category' value='' />
                                                    <Picker.Item label='Groceries' value='Groceries' />
                                                </Picker>
                                            )}
                                        </View>
                                    </View>
                                    <FormInputs
                                        title='Product Price'
                                        handleChangeText={(value) => handleChangeText('product_actual_price', value)}
                                        desc='Please enter product order price'
                                        borderStyle='border border-lavender'
                                    />

                                    {params.store_category === 'Fashion' && (
                                        <View className="w-full">
                                            {/* Color Option */}
                                            <View className="w-full">
                                                <View className="w-full mb-4">
                                                    <Text className="text-black text-base" style={{ fontFamily: 'roboto-bold' }}>
                                                        Color Options
                                                    </Text>
                                                    <Text className="text-slate text-sm mb-2" style={{ fontFamily: 'roboto-medium' }}>
                                                        If the product comes in different colors, check the box and enter available colors below.
                                                    </Text>
                                                    <BouncyCheckbox
                                                        isChecked={coloroption}
                                                        onPress={() => {
                                                            const newValue = !coloroption;
                                                            setColorOption(newValue);
                                                            if (!newValue) {
                                                                setColorsInputs([]); // Reset only when unchecked
                                                            }
                                                        }}
                                                        text={`Colors Option: ${coloroption ? 'Available' : 'Not available'}`}
                                                        textStyle={{
                                                            textDecorationLine: 'none',
                                                            color: COLORS.black,
                                                            fontFamily: 'roboto-medium',
                                                            marginLeft: -10,
                                                            fontSize: 13,
                                                        }}
                                                        size={20}
                                                        fillColor={COLORS.primary}
                                                        iconStyle={{ borderColor: COLORS.primary, borderRadius: 2 }}
                                                        innerIconStyle={{ borderWidth: 2, borderRadius: 2 }}
                                                    />
                                                </View>
                                                {coloroption &&
                                                    <>
                                                        <Text className="mb-4 text-sm text-slate" style={{ fontFamily: 'roboto-medium' }}>
                                                            Add product colors if any. Ensure each color is entered in a separate text input.
                                                        </Text>
                                                        {colorsinputs.map((item) => (
                                                            <View key={item.id} className="flex-row justify-between items-center mb-3">
                                                                <View className="w-[87%] mr-1 h-14 px-2 border border-lavender rounded-md">
                                                                    <TextInput
                                                                        style={{ fontFamily: 'roboto-medium', fontSize: 13 }}
                                                                        className="flex-1"
                                                                        editable
                                                                        value={item.value}
                                                                        placeholder="Add color"
                                                                        onChangeText={(value) => handleColorsInputChange(item.id, value)}
                                                                        autoCorrect={false}
                                                                    />
                                                                </View>
                                                                <TouchableOpacity
                                                                    className="bg-lavender w-[11%] rounded-md h-14 items-center justify-center"
                                                                    onPress={() => removeColorsInputField(item.id)}
                                                                >
                                                                    <FontAwesome name="times" size={18} color={COLORS.red} />
                                                                </TouchableOpacity>
                                                            </View>
                                                        ))}

                                                        <TouchableOpacity
                                                            onPress={addColorsInputField}
                                                            className="bg-green2 flex-row w-full justify-center items-center p-2 mb-4 rounded-md"
                                                        >
                                                            <FontAwesome name="plus" size={17} color={COLORS.white} />
                                                            <Text className="text-white text-base py-1 ml-2" style={{ fontFamily: 'roboto-medium' }}>
                                                                Add color
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </>
                                                }
                                            </View>

                                            {/* Size Option */}
                                            <View className="w-full">
                                                <View className="w-full my-4">
                                                    <Text className="text-black text-base" style={{ fontFamily: 'roboto-bold' }}>
                                                        Size Options
                                                    </Text>
                                                    <Text className="text-slate text-sm mb-2" style={{ fontFamily: 'roboto-medium' }}>
                                                        If the product comes in different sizes, check the box and enter all available size below.
                                                    </Text>
                                                    <BouncyCheckbox
                                                        isChecked={sizeoption}
                                                        onPress={() => {
                                                            const newValue = !sizeoption;
                                                            setSizeOption(newValue);
                                                            if (!newValue) {
                                                                setSizesInputs([]); // Reset only when unchecked
                                                            }
                                                        }}
                                                        text={`Sizes Option: ${sizeoption ? 'Available' : 'Not available'}`}
                                                        textStyle={{
                                                            textDecorationLine: 'none',
                                                            color: COLORS.slate,
                                                            marginLeft: -10,
                                                            fontSize: 13,
                                                            color: COLORS.black,
                                                            fontFamily: 'roboto-medium',
                                                        }}
                                                        size={20}
                                                        fillColor={COLORS.primary}
                                                        iconStyle={{ borderColor: COLORS.primary, borderRadius: 2 }}
                                                        innerIconStyle={{ borderWidth: 2, borderRadius: 2 }}
                                                    />
                                                </View>

                                                {sizeoption &&
                                                    <>
                                                        <Text className="mb-4 text-sm text-slate" style={{ fontFamily: 'roboto-medium' }}>
                                                            Add product sizes if any. Ensure each size is entered in a separate text input.
                                                        </Text>
                                                        {sizesinputs.map((item) => (
                                                            <View key={item.id} className="flex-row justify-between items-center mb-3">
                                                                <View className="w-[87%] mr-1 h-14 px-2 border border-lavender rounded-md">
                                                                    <TextInput
                                                                        style={{ fontFamily: 'roboto-medium', fontSize: 13 }}
                                                                        className="flex-1"
                                                                        editable
                                                                        value={item.value}
                                                                        placeholder="Add size"
                                                                        onChangeText={(value) => handleSizesInputChange(item.id, value)}
                                                                        autoCorrect={false}
                                                                    />
                                                                </View>
                                                                <TouchableOpacity
                                                                    className="bg-lavender w-[11%] rounded-md h-14 items-center justify-center"
                                                                    onPress={() => removeSizesInputField(item.id)}
                                                                >
                                                                    <FontAwesome name="times" size={18} color={COLORS.red} />
                                                                </TouchableOpacity>
                                                            </View>
                                                        ))}

                                                        <TouchableOpacity
                                                            onPress={addSizesInputField}
                                                            className="bg-green2 flex-row w-full justify-center items-center p-2 mb-4 rounded-md"
                                                        >
                                                            <FontAwesome name="plus" size={17} color={COLORS.white} />
                                                            <Text className="text-white text-base py-1 ml-2" style={{ fontFamily: 'roboto-medium' }}>
                                                                Add size
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </>
                                                }
                                            </View>
                                        </View>
                                    )}
                                    
                                    {params.store_category === 'Restaurant' &&
                                        <View className='w-full mb-4'>
                                            <Text className='text-black text-base' style={{fontFamily: 'roboto-bold'}}>Chillie Option</Text>
                                            <Text className='text-slate text-sm mb-4' style={{fontFamily: 'roboto-medium'}}>If a product has chillie options, please check the box below, as this will allow clients to select whether they want the food with chilli or not</Text>
                                            <BouncyCheckbox
                                                isChecked={chillioption}
                                                onPress={() => setChilliOption(!chillioption)}
                                                text={`Chilli Option: ${chillioption ? 'Available' : 'Not available'}`}
                                                textStyle={{
                                                    textDecorationLine: 'none',
                                                    color: COLORS.black,
                                                    marginLeft: -10,
                                                    fontSize: 13,
                                                    fontFamily: 'roboto-medium',
                                                }}
                                                size={20}
                                                fillColor={COLORS.primary}
                                                iconStyle={{
                                                    borderColor: COLORS.primary,
                                                    borderRadius: 2,
                                                }}
                                                innerIconStyle={{
                                                    borderWidth: 2,
                                                    borderRadius: 2,
                                                }}
                                            />
                                        </View>
                                    }

                                    <DescriptionInput
                                        title='Description'
                                        handleChangeText={(value) => handleChangeText('product_description', value)}
                                        desc='Please add a descrpition to your product. Ensure to put a description that best describe your product.'
                                        otherStyles='text-lg mt-4'
                                        borderStyle='border border-lavender rounded-md'
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
                                                        className={`border-2 bg-grey_bg ${images.length === 0 ? 'border-lavender' : 'border-primary'} px-6 py-4 rounded-lg w-full flex-row justify-center items-center`}
                                                    >
                                                        <FontAwesome5 name="camera" size={24} color="blue" />
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
                                                        className={`border-2 bg-grey_bg ${images.length === 0 ? 'border-lavender' : 'border-green2'} px-6 py-4 rounded-lg w-full flex-row justify-center items-center`}
                                                    >
                                                        <FontAwesome5 name="camera" size={24} color="#32CD32" />
                                                        {images.length === 0 ? (
                                                            <Text className="text-base text-black ml-2" style={{fontFamily: 'roboto-medium'}}>Pick Image</Text>
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
                                                Remove all
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                        <ScrollView className={`${images.length === 0 ? 'mb-4' : 'mb-0'}`} horizontal showsHorizontalScrollIndicator={false}>
                                            <View
                                                animation='slideInLeft'
                                                iterationCount={1}
                                                className='flex-row items-center justify-between mt-3'>
                                                {images.map((uri, index) => (
                                                    <View key={index} className="relative mr-1 rounded-md border-2 border-lavender">
                                                        <Image
                                                            source={{ uri }}
                                                            style={{ width: 105, height: 95 }}
                                                            className="border-2 border-white rounded-md"
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
                        <CustomButton
                            title={isLoading ? 'Please wait...' : 'Create'}
                            handlePress={handleCreateProduct}
                            disabled={isLoading || images.length < 1 || images.length > 8}
                            otherStyles={`bg-primary p-4 my-1 'opacity-100' : 'opacity-50'} ${isLoading || images.length < 1 || images.length > 8 ? 'opacity-50' : 'opacity-100'}`}
                            textStyles='text-2xl'
                        />
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
            {isLoading && <LoadingIndicator loading_text="Creating product..." />}
            {errorMessage === 'Success' && <Redirecting title="Success" />}
        </>
    )
}

const styles = StyleSheet.create({
    picker: {
        height: 55,
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
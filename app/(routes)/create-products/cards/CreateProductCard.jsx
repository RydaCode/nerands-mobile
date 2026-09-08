import { ActivityIndicator, Animated, Image, Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
// import FashionCosmeticsProducts from '../../../components/create-product-components/FashionCosmeticsProducts'
// import RestaurantProducts from '../../../components/create-product-components/RestaurantProducts'
// import LiquorProducts from '../../../components/create-product-components/LiquorProducts'
// import GroceriesProducts from '../../../components/create-product-components/GroceriesProducts'
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import DescriptionInput from '../../../../components/FormFields/DescriptionInput'
import FormInputs from '../../../../components/FormFields/FormInputs'
import AppModal from '../../../../components/modals/AppModal'
import { COLORS } from '../../../../constants/constants'
import useApi from '../../../../hook/useApi'
import { STORES_IMAGE_URI } from '../../../../RequestMethods'
import { capitalize } from '../../../../utils/capitalize'
import { toast } from '../../../../utils/toast'
import { uploadImages } from '../../../../utils/uploadImages'
import OverLay from '../../../OverLay'
import SelectProductCategory from './SelectProductCategory'

const CreateProductCard = ({params}) => {
    const { user_id } = useSelector((state) => state.auth);
    const router = useRouter();
    // const [selectedcategory, setSelectedCategory] = useState('Select category');
    // const [chillioption, setChilliOption] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [fadeAnim] = useState(new Animated.Value(0));
    // const [colorsinputs, setColorsInputs] = useState([{ id: Date.now().toString(), value: '' }]);
    // const [sizesinputs, setSizesInputs] = useState([{ id: Date.now().toString(), value: '' }]);
    // const [coloroption, setColorOption] = useState(false);
    // const [sizeoption, setSizeOption] = useState(false);

    const [selectedcategory, setSelectedCategory] = useState(null);
    const [openCatModal, setOpenCatModal] = useState(false);

    const {data: getCategories, isLoading: loadCategories, error: categoriesErrors, get} = useApi();

    useEffect(() => {
        if (params.business_id) {
            get(`/businesses/products/categories/${params.business_id}`)
        }
    }, [params.business_id]);

    const {
        data: presignData,
        isLoading: presignLoading,
        error: presignError,
        post: presignImages
    } = useApi('/businesses/products/images/presign');

    const {
        data: productData,
        isLoading: productLoading,
        error: productError,
        post: createProduct
    } = useApi('/products/create');

    const [formData, setFormData] = useState({
        business_id: params.business_id,
        store_id: params.store_id,
        store_category: params.store_category,
        product_name: '',
        category_id: '',
        product_description: '',
        product_price: '',
        ingredients: ''
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

    const singleSelectCategories = ['restaurant', 'local_market'];

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsMultipleSelection: !singleSelectCategories.includes(
                    params.store_category
                ),
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets?.length > 0) {

                setImages((prevImages) => {
                    const availableSlots = 8 - prevImages.length;

                    const uniqueImages = result.assets.filter((newAsset) => {
                        return !prevImages.some((existingAsset) => {
                            return (
                                existingAsset.fileName === newAsset.fileName &&
                                existingAsset.fileSize === newAsset.fileSize
                            );
                        });
                    });

                    const newImages = uniqueImages.slice(0, availableSlots);

                    if (uniqueImages.length > availableSlots) {
                        toast.info('You can only select a maximum of 8 images.');
                    } else if (newImages.length < result.assets.length) {
                        toast.info('Some images were already selected.');
                    }

                    return [...prevImages, ...newImages];
                });

            } else {
                toast.info(
                    'No image selected or operation canceled.'
                );
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
    
        if (!formData.product_name?.trim()) {
            toast.error('Product name is required.');
            return;
        }
    
        if (!formData.product_price?.trim()) {
            toast.error('Product price is required.');
            return;
        }

        if (!formData.product_description.trim()) {
            toast.error('Description is required.');
            return;
        }

        if (!selectedcategory) {
            toast.error('Please select a product category.');
            return;
        }

        try {
            // Upload images first
            const uploadedImages = await uploadImages({
                images,
                business_id: params.business_id,
                presignImages
            });

            // Create product
            const response = await createProduct({
                business_id: params.business_id,
                store_id: params.store_id,
                product_name: formData.product_name.trim(),
                product_description: formData.product_description.trim(),
                store_category: formData.store_category.trim(),
                category_id: selectedcategory.id,
                product_price: formData.product_price.trim(),
                ingredients: formData.ingredients.trim(),
                images: uploadedImages.map(image => image.key),
            });

            if (!response?.success) {
                toast.error(
                    response?.message || 'Failed to create product'
                );
                return;
            }

            // ✅ Reset form
            setImages([]);
            setFormData({
                ...formData,
                product_name: '',
                category_id: '',
                product_description: '',
                product_price: '',
            });

            // ✅ Reset selected category dropdown
            setSelectedCategory(null);

            toast.success(
                response?.message || 'Product created successfully'
            );

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Failed to create product');
            }
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
                                <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>{capitalize(params.store_name)}</Text>
                                <Text className='text-sm text-slate' style={{fontFamily: 'roboto-medium'}}>{capitalize(params.store_category)}</Text>
                            </View>
                        </View>

                        <View
                            className='mt-6'
                        >
                            <Text
                                style={{fontFamily: 'roboto-medium'}}
                                className='text-sm mb-2'
                            >You can re-use existing products from business without creating a new product.</Text>

                            <TouchableOpacity
                                className='py-3 px-6 bg-primary rounded w-full justify-center items-center elevation'
                                onPress={() => router.push({
                                    pathname: '../../existing-products',
                                    params: {
                                        user_id,
                                        business_id: params.business_id,
                                        store_id: params.store_id,
                                        store_category: params.store_category
                                    }
                                })}
                            >
                                <Text
                                    style={{fontFamily: 'roboto-medium'}}
                                    className='text-base text-white'
                                >Use Existing</Text>
                            </TouchableOpacity>
                        </View>

                        <View className='w-full mt-10'>
                            <FormInputs
                                title='Product Name'
                                handleChangeText={(value) => handleChangeText('product_name', value)}
                                desc='Please enter product name, ensure that the product name corresponds with product category'
                                borderStyle='border border-lavender'
                            />

                            {/* Select category */}
                            <View className='w-full mb-6'>
                                <View
                                    className='w-full mb-2'
                                >
                                    <Text
                                        className='text-base'
                                        style={{fontFamily: 'roboto-medium'}}
                                    >Select Category</Text>
                                </View>
            
                                <TouchableOpacity
                                    className='flex-row justify-between items-center border-2 border-lavender rounded-xl p-3'
                                    onPress={() => setOpenCatModal(true)}
                                >
                                    {!selectedcategory ? (
                                        <Text
                                            className='text-slate'
                                            style={{fontFamily: 'roboto-medium'}}
                                        >Select</Text>
                                    ) : (
                                        <Text
                                            className='text-slate'
                                            style={{fontFamily: 'roboto-medium'}}
                                        >{selectedcategory?.name}</Text>
                                    )}
                                    <FontAwesome name='angle-down' color={COLORS.slate} size={24} />
                                </TouchableOpacity>
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

                            {(params.store_category === 'restaurant' || params.store_category === 'local_market') && (
                                <DescriptionInput
                                    title='Ingredients'
                                    handleChangeText={(value) => handleChangeText('ingredients', value)}
                                    desc='Please enter all ingredients used in this product, if any.'
                                    otherStyles='text-lg'
                                    borderStyle='border-2 border-lavender rounded-xl'
                                    lines={4}
                                />
                            )}
                            
                            <View className='w-full mt-10'>
                                {/* Pick Image Button */}
                                {params.store_category === 'restaurant' || params.store_category === 'liquor' || params.store_category === 'local_market' ? (
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
                                        // animation='slideInLeft'
                                        // iterationCount={1}
                                        className='flex-row items-center justify-between mt-3'>
                                        {images.map((asset, index) => (
                                            <View key={asset.assetId ?? asset.uri}
                                                className="relative mr-1 rounded-md border border-lavender"
                                            >
                                                <Image
                                                    source={{ uri: asset.uri }}
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
                            !selectedcategory.id ||
                            images.length > 8 ? 'opacity-50' : 'opacity-100'
                        }
                    `}
                    disabled={
                        presignLoading ||
                        productLoading ||
                        images.length < 1 ||
                        images.length > 8 ||
                        !formData.product_name ||
                        !formData.product_price ||
                        !selectedcategory.id
                    }
                    onPress={() => handleCreateProduct()}
                >
                    {presignLoading || productLoading ? (
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

            <AppModal
                visible={openCatModal}
                onClose={() => setOpenCatModal(false)}
            >
                <SelectProductCategory
                    onClose={() => setOpenCatModal(false)}
                    user_id={user_id}
                    category={selectedcategory}
                    setSelectedCategory={setSelectedCategory}
                    getCategories={getCategories}
                    reload={() => get(`/businesses/products/categories/${params.business_id}`)}
                />
            </AppModal>
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
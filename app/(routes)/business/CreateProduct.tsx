import Headers from '@/components/Headers'
import AppModal from '@/components/modals/AppModal'
import { COLORS } from '@/constants/constants'
import useApi from '@/hook/useApi'
import { usePermissions } from '@/hook/usePermissions'
import { useResponsive } from '@/hook/useResponsive'
import type { Category } from '@/types/category'
import { toast } from '@/utils/toast'
import { uploadImages } from '@/utils/uploadImages'
import { AntDesign, FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SelectProductCategory from './SelectProductCategory'

const CreateProduct = () => {
    const { can } = usePermissions();
    const params = useLocalSearchParams();
    const user_id = String(params.user_id ?? '');
    const business_id = String(params.business_id ?? '');
    const display_name = String(params.display_name ?? '');
    const business_type = String(params.business_type ?? '');
    const business_category = String(params.business_category ?? '');
    const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
    const singleSelectCategories = ['restaurant', 'local_market'];

    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [openCatModal, setOpenCatModal] = useState(false);

    const {data: getCategories, isLoading: loadCategories, error: categoriesErrors, get} = useApi();

    useEffect(() => {
        if (business_id) {
            get(`/businesses/products/categories/${business_id}`)
        }
    }, [business_id]);

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
    } = useApi('/businesses/products/create');
    
    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsMultipleSelection: !singleSelectCategories.includes(
                    business_category
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
    
    const removeImage = (index: number) => {
        setImages((prevImages) =>
            prevImages.filter((_, i) => i !== index)
        );
    };

    const [formData, setFormData] = useState({
        business_id,
        name: '',
        description: '',
        ingredients: ''
    });

    const handleCreateProduct = async () => {

        if (!formData.name?.trim()) {
            toast.error('Product name is required.');
            return;
        }

        if (!formData.description.trim()) {
            toast.error('Description is required.');
            return;
        }

        if (!selectedCategory) {
            toast.error('Please select a product category.');
            return;
        }

        try {
            // Upload images first
            const uploadedImages = await uploadImages({
                images,
                business_id,
                presignImages
            });

            // Create product
            const response = await createProduct({
                business_id,
                name: formData.name.trim(),
                description: formData.description.trim(),
                category_id: selectedCategory.id,
                images: uploadedImages.map(image => image.key)
            });

            if (!response?.success) {
                toast.error(
                    response?.message || 'Failed to create product'
                );
                return;
            }

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

    const {
        wp,
        listCardHeight,
        responsiveSize,
        isTablet
    } = useResponsive();

    return (
        <SafeAreaView className='flex-1 bg-white p-4'>
            <View className='w-full'>
                <Headers header_name='Create Product'
                    fontFamily='outfit-medium'
                    textStyles='text-2xl'
                    icon={<AntDesign name="product" size={18} color={COLORS.primary} />}
                    // handlePress={openMenu}
                />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
            <View className='flex-1 justify-center items-center mt-6'>
                <View className='w-full mb-6'>
                    <View
                        className='w-full mb-2'
                    >
                        <Text
                            className='text-base'
                            style={{fontFamily: 'roboto-medium'}}
                        >Product name</Text>
                    </View>
                    <TextInput
                        className='rounded-xl w-full px-3'
                        style={{
                            fontFamily: 'roboto-medium',
                            borderWidth: 2,
                            borderColor: COLORS.lavender,
                            height: 50
                        }}
                        value={formData.name}
                        onChangeText={(value) =>
                            setFormData(prev => ({
                                ...prev,
                                name: value
                            }))
                        }
                    />
                </View>

                <View className='w-full mb-6'>
                    <View
                        className='w-full mb-2'
                    >
                        <Text
                            className='text-base'
                            style={{fontFamily: 'roboto-medium'}}
                        >Description</Text>
                    </View>
                    <TextInput
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        className="rounded-xl w-full px-3 py-3"
                        style={{
                            fontFamily: 'roboto-medium',
                            borderWidth: 2,
                            borderColor: COLORS.lavender,
                            height: 110
                        }}
                        value={formData.description}
                        onChangeText={(value) =>
                            setFormData(prev => ({
                                ...prev,
                                description: value
                            }))
                        }
                    />
                </View>

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
                        {!selectedCategory ? (
                            <Text
                                className='text-slate'
                                style={{fontFamily: 'roboto-medium'}}
                            >Select</Text>
                        ) : (
                            <Text
                                className='text-slate'
                                style={{fontFamily: 'roboto-medium'}}
                            >{selectedCategory?.name}</Text>
                        )}
                        <FontAwesome name='angle-down' color={COLORS.slate} size={24} />
                    </TouchableOpacity>
                </View>

                {(business_category === 'restaurant' || business_category === 'local_market') && (
                    <View className="w-full mb-6">
                        <View className="w-full mb-2">
                            <Text
                                className="text-base"
                                style={{ fontFamily: 'roboto-medium' }}
                            >
                                Ingredients
                            </Text>
                        </View>

                        <TextInput
                            className="rounded-xl w-full px-3"
                            style={{
                                fontFamily: 'roboto-medium',
                                borderWidth: 2,
                                borderColor: COLORS.lavender,
                                height: 110
                            }}
                            value={formData.ingredients}
                            onChangeText={(value) =>
                                setFormData(prev => ({
                                    ...prev,
                                    ingredients: value
                                }))
                            }
                            placeholder="e.g. Chicken, lettuce, tomato, mayonnaise"
                            multiline
                        />
                    </View>
                )}
                
                <View className='w-full mt-10'>
                    {/* Pick Image Button */}
                    {business_category === 'restaurant' || business_category === 'liquor' || business_category === 'local_market' ? (
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
                <TouchableOpacity
                    className='w-full mt-10 bg-green2 justify-center items-center rounded-xl py-3'
                    onPress={handleCreateProduct}
                    disabled={presignLoading || productLoading}
                >
                    {(presignLoading || productLoading) ? (
                        <ActivityIndicator color={COLORS.white} size={25}/>
                    ) : (
                        <Text
                            className='text-xl text-white'
                            style={{fontFamily: 'outfit-medium'}}
                        >Create</Text>
                    )}
                </TouchableOpacity>
            </View>
            </ScrollView>

            <AppModal
                visible={openCatModal}
                onClose={() => setOpenCatModal(false)}
            >
                <SelectProductCategory
                    onClose={() => setOpenCatModal(false)}
                    user_id={user_id}
                    category={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    getCategories={getCategories}
                    reload={() => get(`/businesses/products/categories/${business_id}`)}
                />
            </AppModal>
        </SafeAreaView>
    )
}

export default CreateProduct
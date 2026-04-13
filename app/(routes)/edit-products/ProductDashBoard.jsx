import { FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { PRODUCTS_IMAGE_URI } from '../../../RequestMethods';
import { toast } from '../../../utils/toast';
import LoadingIndicator from '../../LoadingIndicator';

const ProductDashBoard = ({
    onClose,
    product_id,
    product_image,
    product_images,
    product_name,
    product_description,
    product_actual_price,
    product_status,
    store_name,
    store_id,
    product_category,
    product_colors,
    product_sizes,
    store_category,
    store_profileimage,
    active_status,
    is_available
}) => {
    const [opendeleteproduct, setOpenDeleteProduct] = useState(false);
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const itemWidth = screenWidth * 0.2;
    const productImages = Array.isArray(product_images) ? product_images : [];
    const productSizes = Array.isArray(product_sizes) ? product_sizes : [];
    const productColors = Array.isArray(product_colors) ? product_colors : [];

    const isStorePublished = active_status === true || active_status === 1 || active_status === 'true';

    const productData = [
        { label: 'Product name', value: product_name },
        { label: 'Product category', value: product_category },
        { label: 'Product price', value: `K${product_actual_price}` },
        { label: 'Product description', value: product_description },
    ];

    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const isPublished = product_status === true || product_status === 1 || product_status === 'true';
    const isAvailable = is_available === true || is_available === 1 || is_available === 'true';
    const [activeStatus, setActiveStatus] = useState(isPublished);
    const [availableStatus, setAvailableStatus] = useState(isAvailable);
    const [lastToggledStatus, setLastToggledStatus] = useState(null);

    const {
        data: publishResponse,
        isLoading,
        error,
        patch: publishProduct
    } = useApi(`/products/update/`);

    const {
        data: deleteResponse,
        isLoading: delLoading,
        error: delError,
        post: deleteProduct
    } = useApi(`/products/delete/`);

    const handlePublishProduct = () => {
        if (!isStorePublished) return;
        const toggledStatus = !activeStatus;

        publishProduct({
            product_id,
            product_status: toggledStatus,
            unpublish: !toggledStatus,
        });

        setLastToggledStatus(toggledStatus);
        setActiveStatus(toggledStatus);
    };

    const setMarkProductAvailable = () => {
        if (!isStorePublished) return;
        const toggledStatus = !availableStatus;

        publishProduct({
            product_id,
            is_available: toggledStatus,
            mark_unavailable: !toggledStatus,
        });

        setLastToggledStatus(toggledStatus);
        setAvailableStatus(toggledStatus);
    };

    const handleDeleteProduct = () => {
        if (!store_id || !product_id || !store_category) {
            toast.error('Delete Failed, Missing data');
            return;
        }
        deleteProduct({ product_id, store_id, store_category });
    };

    useEffect(() => {
        if (publishResponse?.message) {
            const isSuccess = publishResponse.success;
            const message =
                lastToggledStatus === true
                    ? 'Product published successfully.'
                    : 'Product unpublished successfully.';

            if (!isSuccess) {
                toast.error(`Update Failed, ${publishResponse.message}`);
            } else {
                toast.success(`Update Successful, ${message}`);
                setIsRedirecting(true);
                setTimeout(() => onClose(), 5000);
            }
        }
    }, [publishResponse]);

    useEffect(() => {
        if (!deleteResponse) return;

        if (deleteResponse?.json?.success) {
            toast.success(deleteResponse.json.message);
            setTimeout(() => onClose(), 3000);
        } else if (deleteResponse?.json?.message) {
            toast.error(deleteResponse.json.message);
        } else if (deleteResponse?.Response) {
            toast.error(deleteResponse.Response);
        } else {
            toast.error('Delete Failed, Unknown error');
        }
    }, [deleteResponse]);

    return (
        <SafeAreaView>
            <View
                animation="slideInUp"
                iterationCount={1}
                duration={500} //1 second
                easing="ease-in-out" //Easing for smoother animation
                style={{ borderTopRightRadius: 7, borderTopLeftRadius: 7, height: screenHeight * 0.65, }}
                className="w-full justify-center items-center bg-white relative"
            >
                {opendeleteproduct &&
                    <View className='justify-end bg-transparentBlack z-50 h-full w-full' style={{}}>
                        <MotiView
                            from={{ opacity: 0, translateY: 50 }}   // start hidden + lower
                            animate={{ opacity: 1, translateY: 0 }} // end visible + normal pos
                            transition={{ duration: 1000 }}
                            className=' p-4 elevation-md z-50 bg-lavender rounded-md'
                            style={{top: 10}}
                        >
                        <View className='mb-6 justify-center items-center'>
                            <Text className='text-2xl' style={{fontFamily: 'maven-medium'}}>{product_name}</Text>
                            <Text className='text-sm text-red' style={{fontFamily: 'roboto-medium'}}>Are you sure you want to delete this product?</Text>
                        </View>
                        <View className='flex-row justify-between items-center'>
                            <TouchableOpacity
                                onPress={() => setOpenDeleteProduct(false)}
                                style={{width: '48%'}}
                                className='bg-red p-4 justify-center items-center rounded-md'
                            >
                                <Text className='text-2xl text-white' style={{fontFamily: 'maven-medium'}}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleDeleteProduct}
                                style={{width: '48%'}}
                                className='bg-green-500 p-4 justify-center items-center rounded-md'
                            >
                                <Text className='text-2xl text-white' style={{fontFamily: 'maven-medium'}}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </MotiView>
                </View>
                }
                {/* Header */}
                <View className="items-center w-full px-4 ">
                    <View className="flex-row w-full items-center">
                        <Ionicons name="grid-outline" color={COLORS.black} size={18} />
                        <Text className="ml-1 text-2xl text-black" style={{ fontFamily: 'outfit-medium' }}>
                            Dashboard
                        </Text>
                    </View>
                    <View className="h-[1px] mb-1 mx-2 mt-1 w-full bg-lavender" />
                </View>
                <ScrollView
                    className="w-full"
                    contentContainerStyle={{ justifyContent: 'center' }}
                >
                    

                    {/* Product Images */}
                    <ScrollView
                        horizontal
                        className="my-4 px-4"
                        showsHorizontalScrollIndicator={false}
                    >
                        {productImages.map((imageName, index) => (
                            <TouchableOpacity
                                key={index}
                                style={{width: itemWidth, height: 60}}
                                className="mr-2 rounded-md justify-center items-center"
                            >
                                {imageName ? (
                                    <Image
                                        source={{ uri: `${PRODUCTS_IMAGE_URI}${imageName}` }}
                                        className="w-full h-full rounded-md"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <Text className='text-base'>No images</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    {/* Product Info */}
                    {productData.map((item, idx) => (
                        <TouchableOpacity key={idx} className="mb-4 px-4 "
                            onPress={() => router.push({pathname: '/edit-products/edit-product-on-by-one', params: {
                                store_id: store_id,
                                product_id: product_id,
                                store_category: store_category,
                                product_value: item.value,
                                product_label: item.label
                            }})}
                        >
                            <Text className="text-lg" style={{ fontFamily: 'roboto-medium' }}>
                                {item.label}
                            </Text>
                            <View className="w-full flex-row items-center">
                                <Text className="text-slate mr-2">{item.value}</Text>
                                <Ionicons name="create-outline" color={COLORS.green2} size={18} />
                                <Text className="text-sm text-green2">Edit</Text>
                            </View>
                        </TouchableOpacity>
                    ))}

                    {store_category === 'Fashion' && (
                        <>
                            {/* Product Colors ScrollView */}
                            <TouchableOpacity className="px-4 mb-2"
                                onPress={() =>
                                    router.push({
                                        pathname: '/edit-products/edit-product-on-by-one',
                                        params: {
                                            store_id: store_id,
                                            product_id: product_id,
                                            store_category: store_category,
                                            product_value: JSON.stringify(productColors), // pass as string
                                            product_label: 'Product Colors',
                                        },
                                    })
                                }
                            >
                                <View className="w-full flex-row items-center">
                                    <Text className="text-lg mr-2 mb-1" style={{ fontFamily: 'roboto-medium' }}>Product colors</Text>
                                    <Ionicons name="create-outline" color={COLORS.green2} size={18} />
                                    <Text className="text-sm text-green2">Edit</Text>
                                </View>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {productColors.length > 0 ? (
                                        productColors.map((color, index) => (
                                            <TouchableOpacity key={index} className="mb-4 bg-lavender p-2 mr-2 rounded-md px-4 "
                                                onPress={() =>
                                                    router.push({
                                                        pathname: '/edit-products/edit-product-on-by-one',
                                                        params: {
                                                            store_id: store_id,
                                                            product_id: product_id,
                                                            store_category: store_category,
                                                            product_value: JSON.stringify(productColors), // pass as string
                                                            product_label: 'Product Colors',
                                                        },
                                                    })
                                                }
                                            >
                                                <View className="w-full flex-row items-center">
                                                    <Text className="text-slate mr-2">{color}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ))
                                    ) : (
                                        <Text className="text-slate">No colors</Text>
                                    )}
                                </ScrollView>
                            </TouchableOpacity>

                            {/* Product Sizes ScrollView */}
                            <TouchableOpacity className="px-4 mb-4"
                                onPress={() =>
                                    router.push({
                                        pathname: '/edit-products/edit-product-on-by-one',
                                        params: {
                                            store_id: store_id,
                                            product_id: product_id,
                                            store_category: store_category,
                                            product_value: JSON.stringify(productSizes),
                                            product_label: 'Product Sizes',
                                        },
                                    })
                                }
                            >
                                <View className="w-full flex-row items-center">
                                    <Text className="text-lg mr-2 mb-1" style={{ fontFamily: 'roboto-medium' }}>Product sizes</Text>
                                    <Ionicons name="create-outline" color={COLORS.green2} size={18} />
                                    <Text className="text-sm text-green2">Edit</Text>
                                </View>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {productSizes.length > 0 ? (
                                        productSizes.map((size, index) => (
                                            <View key={index} className="mb-4 px-4 bg-lavender mr-2 rounded-md p-2">
                                                <Text className="text-slate mr-2">{size}</Text>
                                            </View>
                                        ))
                                    ) : (
                                        <Text className="text-slate">No sizes</Text>
                                    )}
                                </ScrollView>
                            </TouchableOpacity>
                        </>
                    )}
                    <View className="h-[1px] mb-2 mx-4 mt-1 bg-lavender" />

                    {/* Action Buttons */}
                    <View className="flex-row justify-between items-center px-4 border mb-2 ">
                        { !activeStatus ? (
                            <TouchableOpacity
                                disabled={!isStorePublished}
                                onPress={handlePublishProduct}
                                className="justify-center py-1 items-center rounded-md"
                                style={{ width: '32%', opacity: !isStorePublished ? 0.3 : 0.9 }}
                            >
                                <MaterialIcons name="publish" size={24} color={COLORS.green1} />
                                <Text className="text-sm text-green1" style={{ fontFamily: 'roboto-medium' }}>
                                    Publish
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={handlePublishProduct}
                                className="justify-center py-1 items-center rounded-md"
                                style={{ width: '32%' }}
                            >
                                <MaterialIcons name="unpublished" size={24} color={COLORS.green1} />
                                <Text className="text-sm text-green1" style={{ fontFamily: 'roboto-medium' }}>
                                    Unpublish
                                </Text>
                            </TouchableOpacity>
                        )}

                        {/* Available / Unavailable toggle button */}
                        <TouchableOpacity
                            disabled={!activeStatus}
                            onPress={setMarkProductAvailable}
                            className="justify-center py-1 items-center rounded-md"
                            style={{ width: '32%', opacity: !activeStatus ? 0.6 : 0.9 }}
                        >
                            {availableStatus ? (
                                <>
                                    <MaterialCommunityIcons name="close-circle-outline" size={20} color="purple" />
                                    <Text className="text-sm text-violet-800" style={{ fontFamily: 'roboto-medium' }}>
                                        Mark Unavailable
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="check-circle-outline" size={20} color="purple" />
                                    <Text className="text-sm text-violet-800" style={{ fontFamily: 'roboto-medium' }}>
                                        Mark Available
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="justify-center py-1 items-center rounded-md"
                            style={{ width: '32%' }}
                            onPress={() => router.push({pathname: '/edit-products/edit-product-others/', params: {
                                store_id,
                                product_id,
                                product_name,
                                product_description,
                                product_actual_price,
                                product_status,
                                store_name,
                                store_category,
                                product_category,
                                product_colors,
                                product_sizes,
                                store_profileimage,
                                product_image,
                                router,
                            }})}
                        >
                            <Ionicons name="create-outline" color={COLORS.green2} size={25} />
                            <Text className="text-sm text-green2" style={{ fontFamily: 'roboto-medium' }}>
                                Edit all
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() =>
                                router.push({
                                pathname: '/edit-products/add-extras-to-product',
                                params: { store_id, product_id },
                                })
                            }
                            className="justify-center py-1 items-center rounded-md"
                            style={{ width: '32%' }}
                        >
                            <MaterialCommunityIcons name="french-fries" size={27} color="#2563EB" />
                            <Text className="text-sm text-[#2563EB]" style={{ fontFamily: 'roboto-medium' }}>
                                Variants
                            </Text>
                        </TouchableOpacity>

                        {store_category === 'Restaurant' && (
                            <TouchableOpacity
                                onPress={() =>
                                    router.push({
                                    pathname: '/edit-products/add-extras-to-product',
                                    params: { store_id, product_id },
                                    })
                                }
                                className="justify-center py-1 items-center rounded-md"
                                style={{ width: '24%' }}
                            >
                                <MaterialCommunityIcons name="french-fries" size={27} color="#2563EB" />
                                <Text className="text-sm text-[#2563EB]" style={{ fontFamily: 'roboto-medium' }}>
                                    Extras
                                </Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            onPress={() => setOpenDeleteProduct(true)}
                            className="justify-center py-1 items-center rounded-md"
                            style={{ width: '32%' }}
                        >
                            <FontAwesome6 name="trash" color={COLORS.red} size={20} />
                            <Text className="text-sm text-red" style={{ fontFamily: 'roboto-medium' }}>
                                Delete
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
            {isLoading && <LoadingIndicator loading_text="Publishing product..." />}
            {delLoading && <LoadingIndicator loading_text="Deleting product..." />}
        </SafeAreaView>
    );
};

export default ProductDashBoard;

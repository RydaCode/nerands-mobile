import { FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { toast } from '../../../utils/toast';
import LoadingIndicator from '../../LoadingIndicator';
import ProductImagesGallery from '../../screens/other-single-product/ProductImagesGallery';

const ProductsSingleCard = ({
    onClose,
    product_id,
    product_image,
    product_images,
    product_name,
    product_description,
    product_price,
    product_status,
    store_name,
    store_id,
    product_category,
    store_category,
    store_profileimage,
    active_status,
    is_available,
    group_id,
    group_name,
    variant_is_required,
    variant_multi_select,
    variant_options,
}) => {
        const [opendeleteproduct, setOpenDeleteProduct] = useState(false);
        const {data: imagesData, isLoading: imagesLoading, error: imagesError, get: imagesGet} = useApi(`/products/product-images?product_id=${product_id}`);
        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;
        const itemWidth = screenWidth * 0.2;

        const isStorePublished = active_status === true || active_status === 1 || active_status === 'true';

        const productData = [
            { label: 'Product name', value: product_name },
            { label: 'Product category', value: product_category },
            { label: 'Product price', value: `K${product_price}` },
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
            imagesGet();
        }, []);

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
                    toast.success(message);
                    setIsRedirecting(true);
                    setTimeout(() => onClose(), 5000);
                }
            }
        }, [publishResponse]);

        useEffect(() => {
            if (!deleteResponse) return;

            if (deleteResponse?.json?.success) {
                toast.success(deleteResponse.json.message);
                // setTimeout(() => onClose(), 3000);
            } else if (deleteResponse?.json?.message) {
                toast.error(deleteResponse.json.message);
            } else if (deleteResponse?.Response) {
                toast.error(deleteResponse.Response);
            } else {
                toast.error('Delete Failed, Unknown error');
            }
        }, [deleteResponse]);

    return (
        <View className='flex-1'>
            <View
                style={{ borderTopRightRadius: 7, borderTopLeftRadius: 7 }}
                className="w-full justify-center items-center bg-white relative"
            >
                {opendeleteproduct &&
                    <>
                        <Pressable
                            className="absolute top-0 left-0 right-0 bottom-0 bg-black/40"
                            style={{ zIndex: 40 }}
                            onPress={() => setOpenDeleteProduct(false)}
                        />
                        <View className='flex-1 absolute z-40' style={{bottom: 40}}>
                                <MotiView
                                    from={{ opacity: 0, translateY: 50 }}   // start hidden + lower
                                    animate={{ opacity: 1, translateY: 0 }} // end visible + normal pos
                                    transition={{ duration: 1000 }}
                                >
                                <View className='bg-white px-4 pb-4 elevation-md z-50 rounded'>
                                    <View className='mb-6'>
                                        <Text className='text-2xl' style={{fontFamily: 'maven-medium'}}>Delete</Text>
                                    </View>
                                    <View className='justify-center items-center mb-6'>
                                        <Text className='text-base text-red' style={{fontFamily: 'roboto-medium'}}>Are you sure you want to delete this product?</Text>
                                    </View>
                                    <View className='flex-row justify-between items-center'>
                                        <TouchableOpacity
                                            onPress={handleDeleteProduct}
                                            style={{width: '48%'}}
                                            className='bg-green-500 p-4 justify-center items-center rounded'
                                        >
                                            <Text className='text-2xl text-white' style={{fontFamily: 'maven-medium'}}>Yes</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => setOpenDeleteProduct(false)}
                                            style={{width: '48%'}}
                                            className='bg-red p-4 justify-center items-center rounded'
                                        >
                                            <Text className='text-2xl text-white' style={{fontFamily: 'maven-medium'}}>No</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </MotiView>
                        </View>
                    </>
                }
                {/* Header */}
                <View className="items-center w-full px-4 ">
                    <View className="flex-row w-full items-center">
                        <Ionicons name="grid-outline" color={COLORS.black} size={18} />
                        <Text className="ml-1 text-xl text-black" style={{ fontFamily: 'outfit-medium' }}>
                            {product_name}
                        </Text>
                    </View>
                    <View className="h-[1px] mb-1 mx-2 mt-1 w-full bg-lavender" />
                </View>

                <ScrollView
                    className="w-full" showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ justifyContent: 'center' }}
                >
                    <ProductImagesGallery
                        mainImage={product_image}
                        images={Array.isArray(imagesData?.data) ? imagesData?.data : []}
                    />

                    <View className="h-[1px] my-4 bg-lavender" />
                    {/* Action Buttons */}
                    <View className="flex-row flex-wrap justify-between items-center">
                        { !activeStatus ? (
                            <TouchableOpacity
                                disabled={!isStorePublished}
                                onPress={handlePublishProduct}
                                className="justify-center py-1 items-center rounded-md border border-[#E2E8F0] mb-4"
                                style={{ width: '32%', opacity: !isStorePublished ? 0.3 : 0.9 }}
                            >
                                <View className='bg-[#DFF6E6] rounded-full justify-center items-center' style={{width: 45, height: 45}}>
                                    <MaterialIcons name="publish" size={24} color={COLORS.green1} />
                                </View>
                                <Text className="text-sm text-green1" style={{ fontFamily: 'roboto-medium' }}>
                                    Publish
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={handlePublishProduct}
                                className="justify-center py-1 items-center rounded-md border border-[#E2E8F0] mb-4"
                                style={{ width: '32%', height: 75 }}
                            >
                                <View className='bg-[#DFF6E6] rounded-full justify-center items-center' style={{width: 45, height: 45}}>
                                    <MaterialIcons name="unpublished" size={24} color={COLORS.green1} />
                                </View>
                                <Text className="text-sm text-green1" style={{ fontFamily: 'roboto-medium' }}>
                                    Unpublish
                                </Text>
                            </TouchableOpacity>
                        )}

                        {/* Available / Unavailable toggle button */}
                        <TouchableOpacity
                            disabled={!activeStatus}
                            onPress={setMarkProductAvailable}
                            className="justify-center py-1 items-center rounded-md border border-[#E2E8F0] mb-4"
                            style={{ width: '32%', height: 75, opacity: !activeStatus ? 0.6 : 0.9 }}
                        >
                            {availableStatus ? (
                                <>
                                    <View className='bg-[#DFF6E6] rounded-full justify-center items-center' style={{width: 45, height: 45}}>
                                        <MaterialCommunityIcons name="close-circle-outline" size={28} color="purple" />
                                    </View>
                                    <Text className="text-sm text-violet-800" style={{ fontFamily: 'roboto-medium' }}>
                                        Mark Unavailable
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <View className='bg-[#DFF6E6] rounded-full justify-center items-center' style={{width: 45, height: 45}}>
                                        <MaterialCommunityIcons name="check-circle-outline" size={20} color="purple" />
                                    </View>
                                    <Text className="text-sm text-violet-800" style={{ fontFamily: 'roboto-medium' }}>
                                        Mark Available
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="justify-center py-1 items-center  rounded-md border border-[#E2E8F0] mb-4"
                            style={{ width: '32%', height: 75 }}
                            onPress={() => router.push({pathname: '/edit-products/edit-product-others/', params: {
                                store_id,
                                product_id,
                                product_name,
                                product_description,
                                product_price,
                                product_status,
                                store_name,
                                store_category,
                                product_category,
                                store_profileimage,
                                product_image
                            }})}
                        >
                            <View className='bg-[#DFF6E6] rounded-full justify-center items-center' style={{width: 45, height: 45}}>
                                <Ionicons name="create-outline" color={COLORS.green2} size={22} />
                            </View>
                            <Text className="text-sm text-green2" style={{ fontFamily: 'roboto-medium' }}>
                                Edit all
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() =>
                                router.push({
                                    pathname: '/store-variants/AddOptionsToProduct',
                                    params: {
                                        store_id,
                                        product_id,
                                        group_id,
                                        group_name,
                                        variant_is_required,
                                        variant_multi_select,
                                        variant_options,
                                        product_image,
                                        product_images,
                                        product_name
                                    },
                                })
                            }
                            className="justify-center py-1 items-center rounded-md border border-[#E2E8F0] mb-4"
                            style={{ width: '32%' }}
                        >
                            <View className='bg-[#DFF6E6] rounded-full justify-center items-center' style={{width: 45, height: 45}}>
                                <MaterialCommunityIcons name="tune" size={22} color="#2563EB" />
                            </View>
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
                                className="justify-center py-1 items-center rounded-md border border-[#E2E8F0] mb-4"
                                style={{ width: '32%', height: 75 }}
                            >
                                <View className='bg-[#DFF6E6] rounded-full justify-center items-center' style={{width: 45, height: 45}}>
                                    <MaterialCommunityIcons name="french-fries" size={23} color="#2563EB" />
                                </View>
                                <Text className="text-sm text-[#2563EB]" style={{ fontFamily: 'roboto-medium' }}>
                                    Extras
                                </Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            onPress={() => setOpenDeleteProduct(true)}
                            className="justify-center py-1 items-center rounded-md border border-[#E2E8F0] mb-4"
                            style={{ width: '32%', height: 75 }}
                        >
                            <View className='bg-[#DFF6E6] rounded-full justify-center items-center' style={{width: 45, height: 45}}>
                                <FontAwesome6 name="trash" color={COLORS.red} size={17} />
                            </View>
                            <Text className="text-sm text-red" style={{ fontFamily: 'roboto-medium' }}>
                                Delete
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View className="h-[1px] mb-2 mt-1 bg-lavender" />
                    {/* Product Info */}
                    {productData.map((item, idx) => (
                        <TouchableOpacity key={idx} className="mb-4"
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
                    <View style={{paddingBlock: 40}}/>
                </ScrollView>
            </View>
            {isLoading && <LoadingIndicator loading_text="Publishing product..." />}
            {delLoading && <LoadingIndicator loading_text="Deleting product..." />}
        </View>
    )
}

export default ProductsSingleCard
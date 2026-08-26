import Headers from '@/components/Headers'
import { COLORS } from '@/constants/constants'
import useApi from '@/hook/useApi'
import { useResponsive } from '@/hook/useResponsive'
import { IMAGE_URI } from '@/RequestMethods'
import type { Product, ProductsResponse } from '@/types/product'
import { toast } from '@/utils/toast'
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import { MotiView } from 'moti'
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import agoTimeStamp from '../../../components/agoTimeStamp'
import { capitalize } from '../../../utils/capitalize'
import { formatDate } from '../../../utils/formatDateTime'
import { getAvatarColor, getFirstLetter } from '../../../utils/getInitials'

const Index = () => {
    const {
        user_id: userIdParam,
        business_id: businessIdParam,
        store_id: store_idIdParam,
        store_category: storeCategoryParam,
    } = useLocalSearchParams();
    const [productPrices, setProductPrices] = useState<Record<string, string>>({});
    const [usingProductId, setUsingProductId] = useState<string | null>(null);
    const [priceErrorId, setPriceErrorId] = useState<string | null>(null);

    const user_id = Array.isArray(userIdParam)
        ? userIdParam[0]
        : userIdParam

    const business_id = Array.isArray(businessIdParam)
        ? businessIdParam[0]
        : businessIdParam

    const store_id = Array.isArray(store_idIdParam)
        ? store_idIdParam[0]
        : store_idIdParam

    const store_category = Array.isArray(storeCategoryParam)
        ? storeCategoryParam[0]
        : storeCategoryParam

    const { data, isLoading, error, get } = useApi();
    const { wp } = useResponsive();

    const [products, setProducts] = useState<Product[]>([]);
    const [loadingMore, setLoadingMore] = useState(false);

    const currentPageRef = useRef(0);
    const totalPagesRef = useRef(1);
    const isFetchingRef = useRef(false);
    const hasMoreRef = useRef(true);
    const initialFetchRef = useRef(false);

    const {data: useProduct, isLoading: loadingUseProduct, error: errorUseProduct, post} =useApi(
        '/products/business/use'
    );

    console.log(products)

    // Fetch products
    const fetchPage = (requestedPage: number) => {
        if (!business_id || isFetchingRef.current || !hasMoreRef.current) return

        if (requestedPage <= currentPageRef.current) return

        if (totalPagesRef.current > 1 && requestedPage > totalPagesRef.current) {
            hasMoreRef.current = false
            return
        }

        currentPageRef.current = requestedPage
        isFetchingRef.current = true
        setLoadingMore(requestedPage > 1)

        get(`/businesses/products/get_all/available/${business_id}/${store_id}?page=${requestedPage}&limit=10`)
    }

    // Initial fetch
    useEffect(() => {
        if (!business_id || initialFetchRef.current) return

        initialFetchRef.current = true
        currentPageRef.current = 0
        totalPagesRef.current = 1
        isFetchingRef.current = false
        hasMoreRef.current = true

        setProducts([])
        setLoadingMore(false)

        fetchPage(1)
    }, [business_id]);

    const reload = () => {
        currentPageRef.current = 0
        totalPagesRef.current = 1
        isFetchingRef.current = false
        hasMoreRef.current = true

        setProducts([])
        fetchPage(1)
    }

    // Handle response
    useEffect(() => {
        const response = data as unknown as ProductsResponse
        if (!response?.data) return

        const responseData = response.data
        const responsePage = Number(responseData.page) || 1
        const responseTotalPages = Number(responseData.totalPages) || 1
        const responseProducts = responseData.products || []

        totalPagesRef.current = responseTotalPages

        // Ignore late/old responses
        if (responsePage < currentPageRef.current) {
            isFetchingRef.current = false
            setLoadingMore(false)
            return
        }

        setProducts(prev => {
            if (responsePage === 1) return responseProducts

            const existingIds = new Set(prev.map(product => product.id))
            const newProducts = responseProducts.filter(
                product => !existingIds.has(product.id)
            )

            return [...prev, ...newProducts]
        })

        hasMoreRef.current = responsePage < responseTotalPages
        isFetchingRef.current = false
        setLoadingMore(false)
    }, [data])

    // Load next page
    const loadMore = () => {
        if (isFetchingRef.current || !hasMoreRef.current) return

        const nextPage = currentPageRef.current + 1

        if (totalPagesRef.current > 1 && nextPage > totalPagesRef.current) {
            hasMoreRef.current = false
            return
        }

        fetchPage(nextPage)
    }

    const [formData, setFormData] = useState({
        business_id: business_id,
        store_id: store_id,
        store_category: store_category,
    });

    const handleUseProduct = async (
        id: string,
        name: string,
        price: string
    ) => {
        if (!id) {
            toast.error('Product Id is required.');
            return;
        }

        if (
            !formData.business_id ||
            !formData.store_id ||
            !formData.store_category
        ) {
            toast.error('Missing important IDs.');
            return;
        }

        // Remove previous price error
        setPriceErrorId(null);

        if (!price.trim()) {
            setPriceErrorId(id);
            toast.error(`Please enter product price for ${name}`);
            return;
        }

        const numericPrice = Number(price);

        if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
            setPriceErrorId(id);
            toast.error(`Please enter a valid product price for ${name}`);
            return;
        }

        const payload = {
            business_id: formData.business_id,
            store_id: formData.store_id,
            store_category: formData.store_category,
            product_id: id,
            product_price: numericPrice,
        };

        try {
            setUsingProductId(id);

            const res = await post(payload);

            if (!res?.success) {
                toast.error(
                    res?.message || 'Failed to use this product, please try again.'
                );
                return;
            }

            toast.success(
                res?.message || 'Product used successfully.'
            );
            reload();

        } catch (error) {
            console.error('USE PRODUCT ERROR:', error);

            toast.error('Something went wrong. Please try again.');

        } finally {
            setUsingProductId(null);
        }
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400 }}
        >
            <View className="w-full">
                <View className="w-full flex-row justify-between items-center">
                    <TouchableOpacity
                        className="rounded justify-center items-center overflow-hidden"
                        style={{
                            width: wp(19),
                            height: wp(16),
                            backgroundColor: getAvatarColor(item.id),
                        }}
                    >
                        {!item.primary_image?.image_url ? (
                            <Text
                                className="text-white text-2xl"
                                style={{ fontFamily: 'roboto-medium' }}
                            >
                                {getFirstLetter(item.name)}
                            </Text>
                        ) : (
                            <Image
                                source={{ uri: `${IMAGE_URI}${item.primary_image.image_url}` }}
                                className="rounded"
                                style={{ width: '100%', height: '100%' }}
                                contentFit="cover"
                                cachePolicy="memory-disk"
                                transition={500}
                            />
                        )}
                    </TouchableOpacity>

                    <View style={{ width: '78%' }}>
                        <Text
                            numberOfLines={1}
                            className="text-base"
                            style={{ fontFamily: 'roboto-medium' }}
                        >
                            {capitalize(item.name)}
                        </Text>

                        <Text
                            numberOfLines={1}
                            className="text-xs text-slate"
                            style={{ fontFamily: 'roboto' }}
                        >
                            Created: {formatDate(item.created_at)} - ({agoTimeStamp(item.created_at)})
                        </Text>
                    </View>
                </View>

                <View
                    className="w-full flex-row items-center mt-2"
                    style={{
                        justifyContent: item.already_exists ? 'flex-end' : 'space-between'
                    }}
                >
                    {!item.already_exists && (
                        <TextInput
                            placeholder="Price"
                            value={productPrices[item.id] || ''}
                            onChangeText={(text) => {
                                setProductPrices((prev) => ({
                                    ...prev,
                                    [item.id]: text,
                                }));

                                if (priceErrorId === item.id) {
                                    setPriceErrorId(null);
                                }
                            }}
                            className={`border rounded px-3 text-sm ${
                                priceErrorId === item.id
                                    ? 'border-red'
                                    : 'border-lavender'
                            }`}
                            style={{
                                height: wp(10),
                                width: '60%',
                                paddingVertical: 0,
                                includeFontPadding: false,
                                textAlignVertical: 'center',
                            }}
                            keyboardType="numeric"
                        />
                    )}
                    <TouchableOpacity
                        className="flex-row justify-center items-center rounded border ml-1"
                        style={{
                            width: '30%',
                            backgroundColor: item.already_exists ? COLORS.red : COLORS.extra_blue,
                            borderColor: item.already_exists ? COLORS.red : COLORS.extra_blue,
                            height: wp(10),
                        }}
                        disabled={usingProductId === item.id}
                        onPress={() =>
                            handleUseProduct(
                                item.id,
                                item.name,
                                productPrices[item.id] || ''
                            )
                        }
                    >
                        {usingProductId === item.id ? (
                            <ActivityIndicator
                                size="small"
                                color={COLORS.white}
                            />
                        ) : (
                            <>
                                <FontAwesome
                                    name={item.already_exists ? 'trash' : 'plus'}
                                    size={11}
                                    color={COLORS.white}
                                />
                                <Text className="ml-1 text-sm text-white">
                                    {item.already_exists ? 'Unuse' : 'Use'}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                <View className="w-full bg-grey_bg my-5" style={{ height: 1 }} />
            </View>
        </MotiView>
    )

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-3">
                <Headers
                    header_name="Existing Products"
                    fontFamily="outfit-medium"
                    textStyles="text-2xl"
                    icon={<AntDesign name="product" size={18} color={COLORS.primary} />}
                />
            </View>

            <View className="flex-1 px-3 items-center pt-8">
                {isLoading && products.length === 0 ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size={33} color={COLORS.primary} />
                        <Text
                            className="mt-2 text-slate"
                            style={{ fontFamily: 'roboto-medium' }}
                        >
                            Loading products...
                        </Text>
                    </View>
                ) : error && products.length === 0 ? (
                    <View className="flex-1 justify-center items-center">
                        <Text
                            className="mt-2 text-red"
                            style={{ fontFamily: 'roboto-medium' }}
                        >
                            No products found
                        </Text>
                    </View>
                ) : products.length === 0 ? (
                    <View className="flex-1 justify-center items-center">
                        <FontAwesome name="search" size={24} color={COLORS.slate} />

                        <Text
                            className="mt-2 text-slate"
                            style={{ fontFamily: 'roboto-medium' }}
                        >
                            There are no products in business
                        </Text>

                        <TouchableOpacity
                            className="bg-primary mt-3 rounded justify-center items-center px-5 py-3"
                            onPress={() =>
                                router.push({
                                    pathname: './CreateProduct',
                                    params: { user_id, business_id },
                                })
                            }
                        >
                            <Text
                                className="text-white"
                                style={{ fontFamily: 'roboto-medium' }}
                            >
                                Add products
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={products}
                        keyExtractor={item => item.id}
                        renderItem={renderProduct}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.2}

                        ListHeaderComponent={
                            <View className='my-6'>
                                <Text
                                    className="text-center text-sm"
                                    style={{ fontFamily: 'roboto-medium' }}
                                >
                                    There {products.length === 1 ? 'is only' : 'are'} {products?.length} {products.length === 1 ? 'product' : 'products'} under this business.
                                </Text>
                            </View>
                        }

                        ListFooterComponent={
                            loadingMore ? (
                                <View style={{ paddingVertical: 20, marginBottom: 40 }}>
                                    <ActivityIndicator color={COLORS.primary} size={30} />
                                    <Text
                                        className="text-center py-4 text-sm"
                                        style={{ fontFamily: 'roboto' }}
                                    >
                                        Loading more products...
                                    </Text>
                                </View>
                            ) : (
                                <View style={{ height: 40 }} />
                            )
                        }
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>

            {/* Create product button */}
            <View className="bg-white relative border-r border-l border-grey_bg py-5">
                <View className="absolute top-0 left-0 h-[1px] w-[41%] bg-grey_bg" />
                <View className="absolute top-0 right-0 h-[1px] w-[41%] bg-grey_bg" />

                <TouchableOpacity
                    className="absolute -top-7 self-center"
                    onPress={() =>
                        router.back()
                    }
                >
                    <View className="bg-white w-14 h-14 elevation-sm rounded-full justify-center items-center border-2 border-white">
                        <Entypo name="plus" size={25} color={COLORS.primary} />
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Index
import Headers from '@/components/Headers'
import AppModal from '@/components/modals/AppModal'
import { COLORS } from '@/constants/constants'
import useApi from '@/hook/useApi'
import { useResponsive } from '@/hook/useResponsive'
import { IMAGE_URI } from '@/RequestMethods'
import type { Product, ProductsResponse } from '@/types/product'
import { AntDesign, Entypo, FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import { MotiView } from 'moti'
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import agoTimeStamp from '../../../components/agoTimeStamp'
import { capitalize } from '../../../utils/capitalize'
import { formatDate } from '../../../utils/formatDateTime'
import { getAvatarColor, getFirstLetter } from '../../../utils/getInitials'
import DeactivateProductModal from './DeactivateProductModal'

const BusinessProducts = () => {
    const {
        user_id: userIdParam,
        business_id: businessIdParam,
    } = useLocalSearchParams()

        const user_id = Array.isArray(userIdParam)
        ? userIdParam[0]
        : userIdParam

    const business_id = Array.isArray(businessIdParam)
        ? businessIdParam[0]
        : businessIdParam


    const { data, isLoading, error, get } = useApi();
    const { wp, responsiveSize } = useResponsive();

    const [openDeactivateModal, setOpenDeactivateModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingMore, setLoadingMore] = useState(false);

    const currentPageRef = useRef(0);
    const totalPagesRef = useRef(1);
    const isFetchingRef = useRef(false);
    const hasMoreRef = useRef(true);
    const initialFetchRef = useRef(false);

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

        get(`/businesses/products/get_all/${business_id}?page=${requestedPage}&limit=10`)
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

                <View className="w-full flex-row justify-between items-center mt-3">
                    <TouchableOpacity
                        className="flex-row items-center"
                        style={{ width: '30%' }}
                        onPress={() =>
                            router.push({
                                pathname: './EditBusinessProduct',
                                params: {
                                    user_id,
                                    business_id,
                                    id: item.id,
                                    name: item.name,
                                    category_id: item.category?.id,
                                    category_name: item.category?.name,
                                    description: item.description,
                                },
                            })
                        }
                    >
                        <FontAwesome name="edit" size={13} color={COLORS.green2} />
                        <Text className="ml-1 text-sm text-green2">Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row justify-center items-center"
                        style={{ width: '30%' }}
                        onPress={() => {
                            setSelectedProduct(item)
                            setOpenDeactivateModal(true)
                        }}
                    >
                        <AntDesign
                            name="poweroff"
                            size={11}
                            color={
                                item.is_active ? COLORS.extra_blue : COLORS.green2
                            }
                        />
                        <Text
                            className="ml-1 text-sm"
                            style={{
                                color: item.is_active ? COLORS.extra_blue : COLORS.green2
                            }}
                        >
                            {item.is_active ? 'Deactivate' : 'Activate'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row justify-end items-center"
                        style={{ width: '30%' }}
                    >
                        <FontAwesome5 name="trash" size={11} color={COLORS.red} />
                        <Text className="ml-1 text-sm text-red">Delete</Text>
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
                    header_name="Business Products"
                    fontFamily="outfit-medium"
                    textStyles="text-2xl"
                    icon={<AntDesign name="product" size={18} color={COLORS.primary} />}
                />
            </View>

            <View className="flex-1 px-3 items-center">
                <View className="w-full mt-8 flex-1">
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
            </View>

            {/* Create product button */}
            <View className="bg-white relative border-r border-l border-grey_bg py-5">
                <View className="absolute top-0 left-0 h-[1px] w-[41%] bg-grey_bg" />
                <View className="absolute top-0 right-0 h-[1px] w-[41%] bg-grey_bg" />

                <TouchableOpacity
                    className="absolute -top-7 self-center"
                    onPress={() =>
                        router.push({
                            pathname: './CreateProduct',
                            params: { user_id, business_id },
                        })
                    }
                >
                    <View className="bg-white w-14 h-14 elevation-sm rounded-full justify-center items-center border-2 border-white">
                        <Entypo name="plus" size={25} color={COLORS.primary} />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Deactivate modal */}
            {selectedProduct && (
                <AppModal
                    visible={openDeactivateModal}
                    onClose={() => setOpenDeactivateModal(false)}
                >
                    <DeactivateProductModal
                        user_id={user_id}
                        business_id={business_id}
                        product={selectedProduct}
                        onClose={() => setOpenDeactivateModal(false)}
                        reload={reload}
                    />
                </AppModal>
            )}
        </SafeAreaView>
    )
}

export default BusinessProducts
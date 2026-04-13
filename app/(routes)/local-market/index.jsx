import { Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import MainHeader from '../../../components/MainHeader';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import LocalMarketCard from './LocalMarketCard';

const index = ({category='Localmarket'}) => {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const { user_id  } = useSelector((state) => state.auth);
    
    const [productsList, setProductsList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const loadingMoreRef = useRef(false);
    const { data, isLoading, error, get } = useApi(null);
    
    // Global refreshKey to trigger child refresh
    const [refreshKey, setRefreshKey] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
        
    // Window width for dynamic columns
    const numColumns = width > 600 ? 3 : 2;
    
    /* ------------------ INITIAL FETCH / REFRESH ------------------ */
    const fetchInitialProducts = async (user_id) => {
        setIsRefreshing(true);
        loadingMoreRef.current = false;
        setPage(1);
    
        try {
                // Optional parameters
            const catParam = category ? `&store_category=${encodeURIComponent(category)}` : '';
            const userParam = user_id ? `&user_id=${encodeURIComponent(user_id)}` : '';
    
            // Construct URL dynamically
            const url = `/products/local?page=1&limit=10${catParam}${userParam}`;
    
            const res = await get(url);
            const newData = Array.isArray(res?.data?.products) ? res.data.products : [];
    
            setProductsList(newData);
            setPage(1);
            setHasMore(res?.data?.pagination?.page < res?.data?.pagination?.pages);
        } catch (err) {
            console.warn('Failed to fetch initial products:', err);
        } finally {
            setIsRefreshing(false);
        }
    };
    
    useEffect(() => {
        fetchInitialProducts(user_id);
    }, [refreshKey, category, user_id]);
    
    const onRefresh = async () => {
        await fetchInitialProducts(user_id);
    };
    
    /* ------------------ FETCH MORE PRODUCTS / PAGINATION ------------------ */
    const fetchMoreProducts = async () => {
        if (loadingMoreRef.current || !hasMore || isRefreshing) return;
    
        loadingMoreRef.current = true;
        setIsLoadingMore(true);
    
        try {
            const nextPage = page + 1;
            // Exclude already fetched products
            const excludeIds = productsList.map((p) => p.product_id);
            const excludeParam = excludeIds.length > 0 ? `&excludeIds=${excludeIds.join(',')}` : '';
    
            // Optional parameters
            const catParam = category ? `&store_category=${encodeURIComponent(category)}` : '';
            const userParam = user_id ? `&user_id=${encodeURIComponent(user_id)}` : '';
    
            // Build URL dynamically
            const url = `/products/local?page=${nextPage}&limit=10${catParam}${excludeParam}${userParam}`;
    
            const res = await get(url);
            const newData = Array.isArray(res?.data?.products) ? res.data.products : [];
    
            // Append new products to the list
            setProductsList((prev) => [...prev, ...newData]);
            setPage(nextPage);
            setHasMore(res?.data?.pagination?.page < res?.data?.pagination?.pages);
    
        } catch (err) {
            console.warn('Failed to fetch more products:', err);
        } finally {
            setIsLoadingMore(false);
            loadingMoreRef.current = false;
        }
    };
    return (
        <SafeAreaView className='flex-1 bg-white justify-center w-full items-center'>
            <View className='px-2'>
                <MainHeader fontFamily='ubuntu-medium' textStyles='text-2xl' header_name='Local Market'/>
            </View>
            
            {/* Render */}
            <View className='bg-grey_bg flex-1 px-2'>
                <FlatList
                    data={productsList}
                    keyExtractor={(item) => item.product_id.toString()}
                    numColumns={numColumns}
                    renderItem={({ item }) => {
                        const productImages = Array.isArray(item.product_images) ? item.product_images : [];
                        const firstImage = productImages.length > 0
                        ? productImages[0]
                        : 'https://yourapp.com/placeholder.png';

                        return (
                            <LocalMarketCard
                                product_id={item.product_id}
                                product_images={productImages}
                                product_image={firstImage}
                                product_name={item.product_name}
                                product_description={item.product_description}
                                product_actual_price={item.product_actual_price}
                                product_price={item.product_price}
                                product_status={item.product_status}
                                store_name={item.store_name}
                                store_id={item.store_id}
                                store_phone_num={item.store_phone_num}
                                store_category={item.store_category}
                                product_category={item.product_category}
                                product_colors={item.colors}
                                product_sizes={item.sizes}
                                store_profileimage={item.store_profileimage}
                                store_location={item.store_location}
                                store_latitude={item.latitude}
                                store_longitude={item.longitude}
                                store_coverimage={item.store_coverimage}
                                store_description={item.store_description}
                                open_close={item.open_close}
                                average_rating={item.average_rating}
                                total_ratings={item.total_ratings}
                                favorited={item.favorited}
                            />
                        );
                    }}
                    ListEmptyComponent={
                        !isRefreshing && (
                            <View
                                style={{ flex: 1, width: '100%' }} className="justify-center items-center"
                            >
                                <Fontisto name="shopping-bag-1" size={50} color={COLORS.primary} />
                                <Text
                                    className="text-xl mt-2" style={{ fontFamily: 'roboto-medium' }}
                                >
                                    Unable To Load Products
                                </Text>

                                <TouchableOpacity
                                    style={{ width: '70%' }}
                                    className="flex-row bg-primary py-3 rounded-md justify-center items-center mt-4"
                                    onPress={onRefresh}
                                >
                                    <MaterialCommunityIcons name="reload" size={23} color="white" />
                                    <Text
                                        className="text-white text-lg ml-1" style={{ fontFamily: 'roboto-medium' }}
                                    >
                                        Reload
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                    onEndReached={fetchMoreProducts}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        isLoadingMore
                        ? <ActivityIndicator size={35} color={COLORS.primary} />
                        : <View style={{ height: 20 }} />
                    }
                    columnWrapperStyle={{ justifyContent: 'space-between', paddingTop: 20 }}
                    contentContainerStyle={{ paddingBottom: 40, flexGrow: 1, }}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={10}
                    windowSize={7}
                    removeClippedSubviews
                />
            </View>
        </SafeAreaView>
    )
}

export default index
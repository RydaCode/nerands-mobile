import { Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS } from '../../../../../../constants/constants';
import { Carticons } from '../../../../../../constants/icons';
import useApi from '../../../../../../hook/useApi';
import AllProductsCard from '../cards/AllProductsCard';

const AllProducts = ({ refreshKey, numColumns, category }) => {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const { user_id  } = useSelector((state) => state.auth);

    const [productsList, setProductsList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const loadingMoreRef = useRef(false);
    const { data, error, isLoading, get } = useApi(null);

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
            const url = `/products?page=1&limit=10${catParam}${userParam}`;

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

    /* ------------------ LOAD MORE ------------------ */
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
            const url = `/products?page=${nextPage}&limit=10${catParam}${excludeParam}${userParam}`;

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

    const showInitialLoader =
        isLoading && productsList.length === 0 && !isRefreshing;


        console.log("LIST OF P", productsList)

    /* ------------------ RENDER ------------------ */
    return (
        <>
            {isLoading && productsList.length === 0 ? (
                <View className='bg-white w-full h-full justify-end items-center'>
                    <ActivityIndicator color={COLORS.primary} size={32}/>
                    <Text className='text-base mt-2' style={{fontFamily: 'roboto-medium'}}>Loading products...</Text>
                </View>
            ) : error ? (
                <View className="justify-start h-full items-center w-full">
                    <Fontisto name="shopping-bag-1" size={50} color={COLORS.primary} />
                    <Text className="text-base mt-2" style={{ fontFamily: 'roboto-medium', textAlign: 'center' }}>
                        Unable To Load Products
                    </Text>
                    <Text className='text-sm text-slate' style={{fontFamily: 'roboto-medium', textAlign: 'center'}}>
                        This can be due to a poor internet connectivity, or server is down, try reloading the app.
                    </Text>
                    <TouchableOpacity
                        style={{ width: '40%' }}
                        className="flex-row bg-primary py-3 rounded-md justify-center items-center mt-4"
                        onPress={onRefresh}
                    >
                        <MaterialCommunityIcons name="reload" size={23} color="white" />
                        <Text className="text-white text-lg ml-1" style={{ fontFamily: 'roboto-medium' }}>
                            Reload
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : productsList?.length > 0 ? (
                <FlatList
                    data={productsList}
                        keyExtractor={(item) => item.product_id.toString()}
                        numColumns={numColumns}
                        renderItem={({ item }) => {
                            const productImages = Array.isArray(item.product_images) ? item.product_images : [];
                            const firstImage = productImages.length > 0
                            ? productImages[0] : Carticons.placeholder;

                            return (
                                <AllProductsCard
                                    product_id={item.product_id}
                                    product_images={productImages}
                                    product_image={firstImage}
                                    product_name={item.product_name}
                                    product_description={item.product_description}
                                    product_price={item.product_price}
                                    product_status={item.product_status}
                                    store_name={item.store_name}
                                    store_id={item.store_id}
                                    store_phone_num={item.store_phone_num}
                                    store_category={item.store_category}
                                    product_category={item.product_category}
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
                                    variant_groups={item.variant_groups}
                                    markup_percent={item.markup_percent}
                                    final_price={item.final_price}
                                    open_time={item.open_time}
                                    closing_time={item.closing_time}
                                    city_town={item.city_town}
                                    business_id={item.business_id}
                                />
                            );
                        }}

                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        onEndReached={fetchMoreProducts}
                        onEndReachedThreshold={0.5}
                        ListHeaderComponent={
                            isRefreshing && (
                                <View className="justify-center h-full items-center w-full">
                                    <ActivityIndicator size={40} color={COLORS.primary} />
                                    <Text className="text-xl mt-2" style={{ fontFamily: 'roboto-medium', textAlign: 'justify' }}>
                                        Loading Products...
                                    </Text>
                                </View>
                            )
                        }
                        ListFooterComponent={
                            isLoadingMore
                            ? <ActivityIndicator size={30} color={COLORS.primary} style={{marginTop: 30}} />
                            : <View style={{ height: 20 }} />
                        }
                        columnWrapperStyle={{ justifyContent: 'space-between', paddingTop: 20 }}
                        contentContainerStyle={{ paddingBottom: 40 }}
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={10}
                        windowSize={7}
                        removeClippedSubviews
                />
            ) : (
                <View className="justify-start pt-10 h-full items-center w-full">
                    <Fontisto name="shopping-bag-1" size={50} color={COLORS.primary} />
                    <Text className="text-base mt-2" style={{ fontFamily: 'roboto-medium', textAlign: 'center' }}>
                        No Products Found.
                    </Text>
                    <TouchableOpacity
                        style={{ width: '40%' }}
                        className="flex-row bg-primary py-3 rounded-md justify-center items-center mt-4"
                        onPress={onRefresh}
                    >
                        <MaterialCommunityIcons name="reload" size={23} color="white" />
                        <Text className="text-white text-lg ml-1" style={{ fontFamily: 'roboto-medium' }}>
                            Reload
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </>
    );
};

export default AllProducts;
import { FontAwesome, FontAwesome6, Fontisto, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import MainHeader from '../../../components/MainHeader';
import { Carticons, COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { STORES_IMAGE_URI } from '../../../RequestMethods';
import { makeCall } from '../../../utils/getDistance';
import { formatTime, isStoreOpen } from '../../../utils/isStoreOpen';
import LocalMarketCard from './LocalMarketCard';

const Index = ({category='Localmarket'}) => {
    const { latitude, longitude } = useSelector(state => state.location) || {};
    const router = useRouter();
    const { width } = useWindowDimensions();
    const { user_id  } = useSelector((state) => state.auth);
    const params = useLocalSearchParams();
    
    const [productsList, setProductsList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [ratestore, setRateStore] = useState(false);
    const loadingMoreRef = useRef(false);
    const { get, isLoading, error } = useApi(null);
    const {data:checkFavorites, error: errorCheckFavorites, isLoading: isLoadingCHeckFAvorite, get:getCheckFavorites} = useApi(`stores/favorites/check?user_id=${user_id}&store_id=${params.store_id}`);
    const [isFavorited, setIsFavorited] = useState(false);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [getReviews, setGetReviews] = useState(false);
    const [openMapsModal, setOpenMapsModal] = useState(false);
    const isFavoritedParam = params.favorited === "true";
    
    // Global refreshKey to trigger child refresh
    const [refreshKey, setRefreshKey] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
        
    // Window width for dynamic columns
    const numColumns = width > 600 ? 3 : 2;
    
    // Fetch products
    const fetchProducts = useCallback(async (reset = false) => {
    if (loadingMoreRef.current) return;

    loadingMoreRef.current = true;

    if (reset) setIsRefreshing(true);
    else setIsLoadingMore(true);   // 🔥 IMPORTANT

    try {
        const nextPage = reset ? 1 : page + 1;

        const res = await get(
            `/products/store?store_id=${params.store_id}&page=${nextPage}&limit=10`
        );

        const newData = Array.isArray(res?.data?.products)
            ? res.data.products
            : [];

        setProductsList(prev =>
            reset ? newData : [...prev, ...newData]
        );

        setPage(nextPage);
        setHasMore(nextPage < (res?.data?.pagination?.pages || 0));

    } catch (err) {
        console.warn('Failed to fetch products:', err);
    } finally {
        loadingMoreRef.current = false;

        if (reset) setIsRefreshing(false);
        else setIsLoadingMore(false);   // 🔥 IMPORTANT
    }
}, [page, params.store_id, get]);

    const { data:ratingpost, error: ratingposterror, isLoading:ratingLoading, post } = useApi();
    const { data: UserRatings, error:errorGetUserRatings, isLoading:loadingUserRatings, get: getUserRatings } = useApi(`/stores/${params.store_id}/rate/${user_id}`);

    useEffect(() => {
        if (UserRatings && UserRatings.success !== undefined) {
            setRating(UserRatings.rating || 0);
            setReview(UserRatings.review || '');
        } else {
            // Safety fallback if data is null/undefined
            setRating(0);
            setReview('');
        }
    }, [UserRatings]);

    useEffect(() => {
        getUserRatings();
    }, []);

    const submitRating = async () => {
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        try {
            const res = await post(
                { user_id, rating, review }, `/stores/${params.store_id}/rate`
            );

            if (res.success) {
                toast.success("Rating submitted");
                get(); // refresh rating
                setRateStore(false);
            } else {
                toast.error(res.message || "Failed to submit rating");
            }
        } catch (err) {
            console.error("Failed to submit rating", err);
        }
    };

    const AddToFavorites = async () => {
        try {
            const res = await post(
                { user_id, store_id: params.store_id },
                `/stores/favorites/add`
            );

            if (res.data.favorited === false) {
                toast.error(res.data.message);
            } else {
                setIsFavorited(res.data.favorited);
                toast.success(
                    res.data.message
                );
            }
        } catch (err) {
            console.error("Failed to toggle favorite", err);
            toast.error("Error occurred");
        }
    };
        
    useEffect(() => {
        fetchProducts(true);
    }, [params.store_category, params.store_id]);

    useEffect(() => {
        if (!user_id || !params.store_id) return;
        getCheckFavorites();
    }, [user_id, params.store_id]);

    const pointA = { latitude: latitude, longitude: longitude }; // User
    const pointB = { latitude: Number(params.store_latitude), longitude: Number(params.store_longitude) }; //Store

    const formatReviews = (count) => {
        if (!count) return 0;

        if (count >= 1_000_000) {
            return (count / 1_000_000).toFixed(1).replace('.0', '') + 'M';
        }

        if (count >= 1000) {
            return (count / 1000).toFixed(1).replace('.0', '') + 'K';
        }
        return count;
    }

    const onRefresh = async () => {
        await fetchProducts(true);
    };

    const favorited =
        params.favorited === true || params.favorited === 'true';

    const isManuallyClosed = params.open_close === false;
    const isTimeClosed = !isStoreOpen(params.open_time, params.closing_time);
    const isClosed = isManuallyClosed || isTimeClosed;

    return (
        <SafeAreaView className='flex-1 bg-white justify-center w-full items-center px-2'>
            <MainHeader fontFamily='ubuntu-medium' textStyles='text-2xl' header_name='Local Market'/>
            
            {/* Render Products */}
            <View className='flex-1 justify-center items-center'>
                {isLoading && productsList?.length === 0 ? (
                    <View>
                        <ActivityIndicator size={35} color={COLORS.primary}/>
                        <Text
                            className='text-lg mt-4'
                            style={{fontFamily: 'roboto-medium'}}
                        >
                            Loading products, please wait...
                        </Text>
                    </View>
                ) : productsList?.length === 0 ? (
                    <View className='justify-center items-center'>
                        <FontAwesome name='search' size={36} color={COLORS.slate}/>
                        <Text
                            className='text-xl mt-4'
                            style={{fontFamily: 'roboto-medium'}}
                        >
                            No products found.
                        </Text>
                        <Text
                            className='text-base mt-4 text-slate'
                            style={{fontFamily: 'roboto-medium'}}
                        >
                            There are no listings yet in this store.
                        </Text>
                    </View>
                ) : error ? (
                    <View className='justify-center items-center'>
                        <FontAwesome name='exclamation-triangle' size={36} color={COLORS.red}/>
                        <Text
                            className='text-xl mt-4'
                            style={{fontFamily: 'roboto-medium'}}
                        >
                            Error occurred.
                        </Text>
                        <Text
                            className='text-base mt-4 text-slate'
                            style={{fontFamily: 'roboto-medium'}}
                        >
                            There was an error fetching the products. Please try again later.
                        </Text>
                    </View>
                ) : productsList?.length > 0 ? (
                    <FlatList
                        data={productsList}
                        keyExtractor={(item) => item.product_id.toString()}
                        numColumns={numColumns}
                        renderItem={({ item }) => {
                            const productImages = Array.isArray(item.product_images) ? item.product_images : [];
                            const firstImage = productImages.length > 0
                            ? productImages[0]
                            : Carticons.placeholder; // Fallback image if product_images is empty or not an array

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

                        ListHeaderComponent={
                            <>
                                {/* Store Info */}
                                <View className='w-full mt-2 flex-row items-center'>
                                    <View
                                        style={{width: 80, height: 80}}
                                        className="rounded-full border-2 border-lavender"
                                    >
                                        <Image
                                            className='h-full w-full rounded-full border-2 border-white'
                                            source={{ uri: `${STORES_IMAGE_URI}${params.store_profileimage}` }}
                                        />
                                        {isClosed &&
                                            <View className='absolute w-full h-full bg-black opacity-70 rounded-full flex-row justify-center items-center'>
                                                <MaterialCommunityIcons name="lock" size={16} style={{color: COLORS.lite}} />
                                                <Text style={{fontFamily: 'roboto-medium'}} className='text-sm text-white'>Closed</Text>
                                            </View>
                                        }
                                    </View>

                                    <View className='ml-3 flex-1'>
                                        <Text numberOfLines={2} className="text-lg" style={{ fontFamily: 'roboto-medium' }}>{params.store_name}</Text>
                                        <Text className="text-sm text-slate" style={{ fontFamily: 'roboto-medium' }}>{params.store_phone_num}</Text>
                                    </View>

                                    <TouchableOpacity
                                        className='rounded-full h-[40px] bg-[#DFF6E6] border border-green1 w-[40px] items-center justify-center'
                                        onPress={() => makeCall(params.store_phone_num)}
                                    >
                                        <FontAwesome name='phone' size={20} style={{color: COLORS.green2}} />
                                    </TouchableOpacity>
                                </View>

                                {/* Store Opening Hours */}
                                <View className='mt-1 w-full px-2 my-4 bg-grey_bg rounded py-1'>
                                    <Text className='text-base text-green1' style={{ fontFamily: 'roboto-medium',textAlign: 'justify' }}>
                                        Open{params.open_time && params.closing_time ? ` from ${formatTime(params.open_time)} to ${formatTime(params.closing_time)}` : ' 24/7'}
                                    </Text>
                                </View>

                                {/* Store Description */}
                                <View className='mt-1 w-full px-2'>
                                    <Text className='text-sm text-gray-600' style={{ fontFamily: 'roboto-medium',textAlign: 'justify' }}>
                                        {params.store_description || 'No description available for this store.'}
                                    </Text>
                                </View>

                                {/* Store Actions */}
                                    <View className='flex-row items-center justify-between mt-8 '>
                                        <TouchableOpacity className='items-center border border-grey_bg rounded py-1'
                                            // onPress={() => setRateStore(true)}
                                            style={{width: '23.5%'}}
                                        >
                                            <View className='flex-row justify-center items-center'>
                                                <Ionicons name='star' size={13} color={COLORS.primary} />
                                                <Text className='text-sm' style={{fontFamily: 'roboto-medium', color: COLORS.green1}}>
                                                    {' '}{params.average_rating} ({params.review_count})


                                                </Text>
                                            </View>
                                            <Text className='text-sm' style={{ fontFamily: 'roboto-medium' }}>Rate Us</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            // onPress={() => setShowLocationMap(true)}
                                            className='items-center justify-center border border-grey_bg rounded py-1'
                                            style={{width: '23.5%'}}
                                        >
                                            <View className='flex-row items-center justify-center'>
                                                <FontAwesome6 name="location-dot"  size={13} color={COLORS.primary} />
                                                <Text className='text-sm text-lavender'> | </Text>
                                                <Text numberOfLines={1} className='text-sm text-green1' style={{fontFamily: 'roboto-medium'}}>30km</Text>
                                            </View>
                                            <Text className='text-sm' style={{ fontFamily: 'roboto-medium' }}>Location</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity className='items-center border border-grey_bg rounded py-1'
                                            // onPress={AddToFavorites}
                                            style={{width: '23.5%'}}
                                        >
                                            <MaterialCommunityIcons
                                                name={!favorited ? "cards-heart-outline" : "cards-heart"}
                                                size={16}
                                                color={COLORS.primary}
                                            />
                                            <Text className='text-sm' style={{ fontFamily: 'roboto-medium' }}>Favorites</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity className='justify-center items-center border border-grey_bg rounded py-1'
                                            // onPress={() => setModalVisible(true)}
                                            style={{width: '23.5%'}}
                                        >
                                            <View className='flex-row justify-center items-center'>
                                                <FontAwesome name='comments' size={16} color={COLORS.primary}/>
                                                <Text className='text-sm ml-1' style={{fontFamily: 'roboto-medium', color: COLORS.green1}}>
                                                    {params.review_count}
                                                </Text>
                                            </View>
                                            <Text className='text-sm' style={{fontFamily: 'roboto-medium'}}>Reviews</Text>
                                        </TouchableOpacity>
                                    </View>

                                {/* Tabs */}
                                {/* <View className='mb-20'/> */}
                            </>
                        }

                        ListEmptyComponent={
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
                        }
                        
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={onRefresh}
                                colors={[COLORS.primary]} // Android
                                tintColor={COLORS.primary} // iOS
                            />
                        }
                        onEndReached={() => {
                            if (hasMore && !loadingMoreRef.current) {
                                fetchProducts(false);
                            }
                        }}
                        onEndReachedThreshold={0.5}
                        refreshing={isRefreshing}
                        onRefresh={() => fetchProducts(true)}
                        ListFooterComponent={
                            isLoadingMore ? (
                                <View style={{ paddingVertical: 15 }}>
                                    <ActivityIndicator size={30} color={COLORS.primary} />
                                </View>
                            ) : null
                        }
                        columnWrapperStyle={{ justifyContent: 'space-between', paddingTop: 20 }}
                        contentContainerStyle={{ paddingBottom: 40, flexGrow: 1, }}
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={10}
                        windowSize={7}
                        removeClippedSubviews
                    />
                ) : null}
            </View>
        </SafeAreaView>
    )
}

export default Index
import { FontAwesome, FontAwesome6, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import MainHeader from '../../../components/MainHeader';
import AppModal from '../../../components/modals/AppModal';
import { Carticons, COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { useResponsive } from '../../../hook/useResponsive';
import { IMAGE_URI } from '../../../RequestMethods';
import { calculateDistance, makeCall } from '../../../utils/getDistance';
import { formatText, getAvatarColor } from '../../../utils/getInitials';
import { formatTime } from '../../../utils/isStoreOpen';
import { toast } from '../../../utils/toast';
import useProductCategoryTabs from '../../../utils/useProductCategoryTabs';
import LocalMarketCard from './LocalMarketCard';

const Index = ({category='Localmarket'}) => {
    const { latitude, longitude } = useSelector(state => state.location) || {};
    const router = useRouter();
    const { width } = useWindowDimensions();
    const { user_id  } = useSelector((state) => state.auth);
    const params = useLocalSearchParams();
    const { wp } = useResponsive();
    
    const [productsList, setProductsList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [ratestore, setRateStore] = useState(false);
    const loadingMoreRef = useRef(false);
    const { get, isLoading, error } = useApi(null);
    const {data:checkFavorites, error: errorCheckFavorites, isLoading: isLoadingCHeckFAvorite, get:getCheckFavorites} = useApi(`stores/favorites/check?user_id=${user_id}&store_id=${params.store_id}`);
    const {data: storedata, isLoading: loadingStore, error: errorStore, get: getStoreData } = useApi();
    const [activeCategory, setActiveCategory] = useState(null);
    const [isFavorited, setIsFavorited] = useState(false);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [getReviews, setGetReviews] = useState(false);
    const [openMapsModal, setOpenMapsModal] = useState(false);
    const isFavoritedParam = params.favorited === "true";
    
    // Global refreshKey to trigger child refresh
    const [refreshKey, setRefreshKey] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    const {
        tabs,
        isLoading: loadingTabs,
        error: errorTabs
    } = useProductCategoryTabs(
        storedata?.[0]?.business_id,
        params.store_id
    );

    useEffect(() => {
        if (params.store_id) {
            getStoreData(`/stores/get_store/${params.store_id}`);
        }
    }, [params.store_id]);
        
    // Window width for dynamic columns
    const numColumns = width > 600 ? 3 : 2;
    
    // Fetch products
    const fetchProducts = useCallback(async (reset = false) => {
        if (loadingMoreRef.current) return;

        loadingMoreRef.current = true;
        if (reset) setIsRefreshing(true);

        try {
            const nextPage = reset ? 1 : page + 1;
            const res = await get(`/products/store?store_id=${params.store_id}&cat_id=${activeCategory}&page=${nextPage}&limit=10`);
            const newData = Array.isArray(res?.data?.products) ? res.data.products : [];

            setProductsList(prev => reset ? newData : [...prev, ...newData]);
            setPage(nextPage);
            setHasMore(nextPage < (res?.data?.pagination?.pages || 0));
        } catch (err) {
            console.warn('Failed to fetch products:', err);
            toast.info('Failed to fetch products');
        } finally {
            loadingMoreRef.current = false;
            if (reset) setIsRefreshing(false);
        }
    }, [params.store_category, params.store_id, activeCategory, page, get]);

    useEffect(() => {
        fetchProducts(true);
    }, [params.store_category, params.store_id, activeCategory]);

    const {data: addFavorites, isLoading: loadingAddFavorites, error: errorAddFavorites, post: postAddFavorites} =useApi(
        `/stores/favorites/add`
    );

    const { data:ratingpost, error: ratingposterror, isLoading:ratingLoading, post } = useApi();
    const { data: UserRatings, error:errorGetUserRatings, isLoading:loadingUserRatings, get: getUserRatings } = useApi(
        `/stores/${params.store_id}/rate/${user_id}`
    );

    const {data: storereviews, isLoading: reviewsLoading, error: reviewsError, get: reviewsGet } = useApi(
        `/stores/${params.store_id}/reviews/`
    );

    const reviewItems = storereviews?.data?.reviews ?? [];

    useEffect(() => {
        if (params.store_id) {
            reviewsGet();   
        }
    }, [params.store_id]);

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
                reviewsGet(); // refresh rating
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
            const res = await postAddFavorites(
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

    return (
        <SafeAreaView className='flex-1 bg-white justify-center w-full items-center'>
            <View className='w-full px-2'>
                <MainHeader fontFamily='ubuntu-medium' textStyles='text-2xl' header_name='Local Market'/>
            </View>
            
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
                                    product_image={item.primary_image?.image_url}
                                    product_name={item.product_name}
                                    product_description={item.product_description}
                                    product_actual_price={item.product_actual_price}
                                    product_price={item.product_price}
                                    product_status={item.product_status}
                                    store_name={item.store_name}
                                    store_id={item.store_id}
                                    business_id={item.business_id}
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
                                    is_closed={storedata?.[0]?.is_closed}
                                />
                            );
                        }}

                        ListHeaderComponent={
                            <>
                                {/* Store Info */}
                                <View className='w-full mt-2 flex-row items-center'>
                                    <View
                                        style={{
                                            width: wp(23),
                                            height: wp(23),
                                            backgroundColor: getAvatarColor(params.store_id)
                                        }}
                                        className="w-20 h-20 rounded-full border-2 border-lavender"
                                    >
                                        {!params.store_profileimage ? (
                                            <Text
                                                className="text-white text-xs"
                                                style={{ fontFamily: 'roboto-medium' }}
                                            >
                                                Image...
                                            </Text>
                                        ) : (
                                            <Image
                                                source={{ uri: `${IMAGE_URI}${params.store_profileimage}` }}
                                                className="rounded"
                                                style={{ width: '100%', height: '100%', borderRadius: 9999, borderWidth: 1, borderColor: COLORS.white }}
                                                contentFit="cover"
                                                cachePolicy="memory-disk"
                                                transition={500}
                                            />
                                        )}
    
                                        {storedata?.[0]?.is_closed &&
                                            <View className='absolute w-full h-full bg-black opacity-70 rounded-full flex-row justify-center items-center'>
                                                <MaterialCommunityIcons name="lock" size={15} style={{color: COLORS.lite}} />
                                                <Text style={{fontFamily: 'roboto'}} className='text-sm text-white'>Closed</Text>
                                            </View>
                                        }
                                    </View>
    
                                    <View className='ml-3 flex-1'>
                                        <Text numberOfLines={1} className="text-base" style={{ fontFamily: 'roboto-medium' }}>{params.store_name}</Text>
                                        <Text className="text-sm text-gray-500" style={{ fontFamily: 'roboto-medium' }}>
                                            {formatText(params.store_category)}
                                        </Text>
                                    </View>
    
                                    <TouchableOpacity
                                        className='rounded-full h-[40px] bg-grey_bg border border-green1 w-[40px] items-center justify-center'
                                        onPress={() => makeCall(params.store_phone_num)}
                                    >
                                        <FontAwesome name='phone' size={20} style={{color: COLORS.green2}} />
                                    </TouchableOpacity>
                                </View>
    
                                {/* Store Description */}
                                <View className='my-2 w-full'>
                                    <Text className='text-sm text-gray-600' style={{ fontFamily: 'roboto' }}>{params.store_description}</Text>
                                </View>
    
                                {/* Store Opening Hours */}
                                <View className='mt-1 w-full px-2 my-4 bg-grey_bg rounded py-1'>
                                    <Text
                                        className="text-sm text-green1"
                                        style={{ fontFamily: 'roboto-medium', textAlign: 'justify' }}
                                    >
                                        {storedata?.[0]?.is_closed ? (
                                            storedata?.[0]?.open_close === false ? (
                                                <Text className="text-red">
                                                    🔴 Temporarily closed by the owner
                                                </Text>
                                            ) : (
                                                <Text className="text-red">
                                                    🔴 Closed until {storedata?.[0]?.next_opening?.day}{" "}
                                                    {storedata?.[0]?.next_opening?.time}
                                                </Text>
                                            )
                                        ) : (
                                            <>
                                                Open
                                                {storedata?.[0]?.is_24_hours
                                                    ? " 24/7"
                                                    : storedata?.[0]?.open_time && storedata?.[0]?.close_time
                                                        ? ` from ${formatTime(storedata[0].open_time)} to ${formatTime(storedata[0].close_time)}`
                                                        : ""
                                                }
                                            </>
                                        )}
                                    </Text>
                                </View>
    
                                {/* Store Actions */}
                                <View className='flex-row items-center justify-between my-5'>
                                    <TouchableOpacity className='justify-start items-center rounded'
                                        onPress={() => setRateStore(true)}
                                        style={{width: '23%'}}
                                    >
                                        <View className='flex-row justify-center items-center'>
                                            <Ionicons name='star' size={13} color={COLORS.primary} />
                                            <Text className='text-sm' style={{fontFamily: 'roboto', color: COLORS.green1}}>
                                                {' '}{params.average_rating} ({formatReviews(params.total_ratings)})
                                            </Text>
                                        </View>
                                        <Text className='text-sm' style={{ fontFamily: 'roboto' }}>Rate Us</Text>
                                    </TouchableOpacity>
    
                                    <View className='bg-grey_bg' style={{height: 25, width: 1.5}}/>
    
                                    <TouchableOpacity
                                        onPress={() => setOpenMapsModal(true)}
                                        className='items-center justify-center rounded'
                                        style={{width: '23%'}}
                                    >
                                        <View className='flex-row items-center justify-center'>
                                            <FontAwesome6 name="location-dot"  size={13} color={COLORS.primary} />
                                            <Text className='text-sm text-lavender'> | </Text>
                                            <Text numberOfLines={1} className='text-sm text-green1' style={{fontFamily: 'roboto'}}>{calculateDistance(pointA, pointB) || 0 + "Km"}</Text>
                                        </View>
                                        <Text className='text-sm' style={{ fontFamily: 'roboto' }}>Location</Text>
                                    </TouchableOpacity>
    
                                    <View className='bg-grey_bg' style={{height: 25, width: 1.5}}/>
    
                                    <TouchableOpacity className='items-center rounded'
                                        onPress={AddToFavorites}
                                        style={{width: '23%'}}
                                    >
                                        <MaterialCommunityIcons
                                            name={!isFavorited ? "cards-heart-outline" : "cards-heart"}
                                            size={16}
                                            color={COLORS.primary}
                                        />
                                        <Text className='text-sm' style={{ fontFamily: 'roboto' }}>Favorites</Text>
                                    </TouchableOpacity>
    
                                    <View className='bg-grey_bg' style={{height: 25, width: 1.5}}/>
    
                                    <TouchableOpacity className='justify-center items-center rounded'
                                        onPress={() => setGetReviews(true)}
                                        style={{width: '23%'}}
                                    >
                                        <View className='flex-row justify-center items-center'>
                                            <FontAwesome name='comments' size={16} color={COLORS.primary}/>
                                            <Text className='text-sm ml-1' style={{fontFamily: 'roboto', color: COLORS.green1}}>
                                                ({formatReviews(params.review_count)})
                                            </Text>
                                        </View>
                                        <Text className='text-sm' style={{fontFamily: 'roboto'}}>Reviews</Text>
                                    </TouchableOpacity>
                                </View>
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


            <AppModal
                visible={getReviews}
                onClose={() => setGetReviews(false)}
            >
                <View className='bg-white w-full justify-center items-center rounded-md' style={{borderTopLeftRadius: 20, borderTopRightRadius: 20}}>
                    <TouchableOpacity
                        className='w-full justify-center items-center'
                        style={{borderTopLeftRadius: 20, borderTopRightRadius: 20}}
                        onPress={() => setGetReviews(false)}
                    >
                        <View className='h-1 rounded-full my-2 bg-white w-[30%]'/>
                    </TouchableOpacity>

                    <View className='px-2'>
                        <View className='flex-row items-center mt-2'>
                            <FontAwesome name='comments' size={23}/>
                            <Text className='text-xl ml-1' style={{fontFamily: 'roboto-medium'}}>Reviews</Text>
                        </View>
                        <Text className='text-sm text-green1 mt-1' style={{fontFamily: 'roboto-medium', textAlign: 'justify'}}>
                            Please take time to read what people are saying about this store
                        </Text>
                    </View>

                    <View className='w-full flex-1 justify-center mt-8 pb-16 items-center'>
                        {reviewsLoading ?
                            <View className='items-center justify-center mb-8'>
                                <ActivityIndicator size={35} color={COLORS.primary}/>
                                <Text className='text-base text-slate' style={{fontFamily: 'roboto-medium'}}>Loading comments, please wait...</Text>
                            </View> :
                            <FlatList
                                data={reviewItems}
                                keyExtractor={(item) => item.rating_id}
                                renderItem={({item}) => (
                                    <View className='px-2 w-full'>
                                        <View className='w-full justify-center'>
                                            <View className='justify-between w-full items-center flex-row'>
                                                <View className='border-2 border-lavender justify-center items-center rounded-full' style={{width: 45, height: 45}}>
                                                    {item.profile_image ?
                                                        <Image className='h-full w-full rounded-full' source={{ uri: `${IMAGE_URI}${item.profile_image}` }} />
                                                        : <FontAwesome name='user' size={28} color={COLORS.slate}/> 
                                                    }
                                                </View>
                                                <View className='' style={{width: '83%'}}>
                                                    <Text className='text-base text-slate' style={{fontFamily: 'roboto-medium'}}>
                                                        {(`${item.first_name || ""} ${item.last_name || ""}`).trim() || "User"}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View className='w-full'>
                                                <View className='' >
                                                    <Text className='' style={{fontFamily: 'roboto', textAlign: 'justify'}}>
                                                        {item.review}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View className='w-full bg-grey_bg my-4' style={{height: 1}}/>
                                    </View>
                                )}

                                ListEmptyComponent={
                                    <View className='flex-1 justify-center items-center mb-4'>
                                        <FontAwesome name='comments' size={25}/>
                                        <Text className='text-base' style={{fontFamily: 'roboto-medium'}}>There are no comments yet</Text>
                                        <Text className='text-sm text-slate' style={{fontFamily: 'roboto-medium'}}>Be the first to comment.</Text>
                                    </View>
                                }

                                ListFooterComponent={
                                    !reviewsLoading &&
                                    <View className='w-full px-2 mb-4'>
                                        {/* Review Input */}
                                        <TouchableOpacity className='border w-full rounded border-lavender py-6 px-3'
                                            onPress={() => {
                                                setGetReviews(false)
                                                setRateStore(true)
                                            }}
                                        >
                                            <Text className='text-slate' style={{fontFamily: 'roboto-medium'}}>Write a comment...</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                                showsVerticalScrollIndicator={false}
                            />
                        }
                    </View>
                </View>
            </AppModal>

            <AppModal
                visible={ratestore}
                onClose={() => setRateStore(false)}
            >
                <View className='bg-white w-full justify-center items-center rounded-md pb-10'>
                    <View className='w-full flex-row justify-end px-4 mt-2'>
                        <TouchableOpacity
                            className='bg-grey_bg justify-center items-center rounded-full'
                            onPress={() => setRateStore(false)}
                            style={{
                                height: wp(8),
                                width: wp(8)
                            }}
                        >
                            <FontAwesome name='times' color={COLORS.red} size={16} />
                        </TouchableOpacity>
                    </View>

                    <Text className='text-xl mt-4' style={{fontFamily: 'roboto-medium'}}>Rate This Store</Text>

                    <View className='w-[90%] justify-center items-center'>
                        <View className='justify-center items-center pt-4 flex-row'>
                            {[...Array(5)].map((_, i) => (
                            <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
                                <MaterialIcons
                                name={i < rating ? "star" : "star-border"}
                                size={50}
                                color="#FFD700"
                                />
                            </TouchableOpacity>
                            ))}
                        </View>
                        {rating > 0 && (
                            <Text className="text-sm text-gray-500 my-4">
                                Your rating: {rating} ⭐
                            </Text>
                        )}
                        <View className='w-full'>
                            {/* Review Input */}
                            <Text className='text-base mb-1' style={{fontFamily: 'roboto-medium'}}>Write a review (Optional)</Text>
                            <TextInput
                                placeholder="Write a review..."
                                value={review}
                                onChangeText={setReview}
                                multiline
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#ddd',
                                    padding: 10,
                                    borderRadius: 4,
                                    marginBottom: 10,
                                    height: 80
                                }}
                            />
                        </View>
                        <TouchableOpacity
                            className='bg-primary my-4 py-3 w-full rounded-md elevation-lg justify-center items-center'
                            onPress={submitRating}
                        >
                            {ratingLoading ? (
                                <ActivityIndicator color={COLORS.white} size={27}/>
                            ) : (
                                <Text className='text-white text-2xl' style={{fontFamily: 'roboto-medium'}}>Done</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </AppModal>

            {loadingAddFavorites && (
                <MotiView
                    from={{ translateY: 400 }}
                    animate={{ translateY: 0 }}
                    exit={{ translateY: 400 }}
                    transition={{ type: 'timing', duration: 400 }}
                    className=' w-full bg-white'
                    style={{paddingBottom: 10}}
                >
                    <View 
                        className=' bg-transparent shadow-md justify-end py-8 items-center border-white w-full'
                        style={{
                            borderRadius: 20,
                            borderTopWidth: 1,
                            borderRightWidth: 1,
                            borderLeftWidth: 1
                        }}
                    >
                        <ActivityIndicator size={33} color={COLORS.primary}/>
                        <Text
                            style={{fontFamily: 'roboto-medium'}}
                            className='mt-2 text-sm text-slate'
                        >Adding store to favorites...</Text>
                    </View>
                </MotiView>
            )}

            <View
                className="w-full bg-[#e6f0fe] py-2"
                style={{ backgroundColor: '#e6f0fe' }}
            >
                <FlatList
                    data={tabs}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) =>
                        item.id ? item.id.toString() : `all-${index}`
                    }
                    contentContainerStyle={{
                        paddingHorizontal: 12,
                        gap: 10,
                    }}
                    renderItem={({ item }) => {
                        const isActive = activeCategory === item.id;

                        return (
                            <TouchableOpacity
                                onPress={() => setActiveCategory(item.id)}
                                activeOpacity={0.9}
                            >
                                <MotiView
                                    animate={{
                                        scale: isActive ? 1 : 0.96,
                                        opacity: isActive ? 1 : 0.7,
                                    }}
                                    transition={{
                                        type: 'spring',
                                        damping: 15,
                                    }}
                                    style={{
                                        backgroundColor: isActive
                                            ? COLORS.primary
                                            : 'rgba(255, 255, 255, 0.45)',
                                        borderWidth: 1,
                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                        borderRadius: 20,
                                        paddingHorizontal: 15,
                                        paddingVertical: 6,
                                    }}
                                >
                                    <Text
                                        className={
                                            isActive
                                                ? 'font-semibold text-white'
                                                : 'font-medium text-gray-700'
                                        }
                                    >
                                        {item.name}
                                    </Text>
                                </MotiView>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
        </SafeAreaView>
    )
}

export default Index
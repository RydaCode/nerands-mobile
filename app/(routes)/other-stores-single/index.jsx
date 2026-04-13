import { FontAwesome, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { MotiView } from 'moti';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import MainHeader from '../../../components/MainHeader';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { STORES_IMAGE_URI } from '../../../RequestMethods';
import { calculateDistance, makeCall } from '../../../utils/getDistance';
import { toast } from '../../../utils/toast';
import LoadingItems from './LoadingItems';
import OtherStoresSingleCard from './OtherStoresSingleCard';

const index = () => {
    const { user_id  } = useSelector((state) => state.auth);
    const params = useLocalSearchParams();
    const { latitude, longitude } = useSelector(state => state.location);
    const [productsList, setProductsList] = useState([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [ratestore, setRateStore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const loadingMoreRef = useRef(false);
    const { get, isLoading } = useApi(null);
    const {data:checkFavorites, error: errorCheckFavorites, isLoading: isLoadingCHeckFAvorite, get:getCheckFavorites} = useApi(`stores/favorites/check?user_id=${user_id}&store_id=${params.store_id}`);

    const [isFavorited, setIsFavorited] = useState(false);

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [getReviews, setGetReviews] = useState(false);
    const isFavoritedParam = params.favorited === "true";
    const isOpen = params.open_close === true || params.open_close === "true";

    // Window width for dynamic columns
      const { width } = useWindowDimensions();
      const numColumns = width > 600 ? 3 : 2;

    // Fetch products
    const fetchProducts = useCallback(async (reset = false) => {
        if (loadingMoreRef.current) return;

        loadingMoreRef.current = true;
        if (reset) setIsRefreshing(true);

        try {
            const nextPage = reset ? 1 : page + 1;
            const res = await get(`/products/store?store_id=${params.store_id}&page=${nextPage}&limit=10`);
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
    }, [params.store_category, params.store_id, page, get]);

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

                console.log("POST response", user_id);

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

    if (isLoading && productsList.length === 0) {
        return (
            <LoadingItems
                mainStyles='mt-24'
                textStyles='text-base text-slate'
                indicatorSize={50}
                indicatorTitle='Loading Products...'
            />
        );
    }

    const pointA = { latitude: latitude, longitude: longitude }; // User
    const pointB = { latitude: Number(params.store_latitude), longitude: Number(params.store_longitude) }; //Store

    return (
        <SafeAreaView className='flex-1 px-2 w-full justify-center relative bg-white'>
            <View className=''>
                <MainHeader header_name='Store' fontFamily='ubuntu-medium' textStyles='text-2xl' />
            </View>
            <FlatList
                data={productsList}
                keyExtractor={(item) => item.product_id.toString()}
                numColumns={numColumns}
                renderItem={({ item }) => {
                    const productImages = Array.isArray(item.product_images) ? item.product_images : [];
                    const firstImage = productImages.length > 0
                    ? productImages[0] : 'https://yourapp.com/placeholder.png';
                    return (
                        <OtherStoresSingleCard
                            params={params}
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
                        />
                    )
                }}
                onEndReached={() => {
                    if (hasMore && !loadingMoreRef.current) {
                        fetchProducts(false);
                    }
                }}
                onEndReachedThreshold={0.5}
                refreshing={isRefreshing}
                onRefresh={() => fetchProducts(true)}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    isLoadingMore ? (
                        <ActivityIndicator size={30} color={COLORS.primary} />
                    ) : null
                }

                columnWrapperStyle={{ justifyContent: 'space-between', paddingTop: 20 }}
                contentContainerStyle={{ paddingBottom: 40 }}
                initialNumToRender={10}
                windowSize={7}
                removeClippedSubviews
                ListEmptyComponent={
                    <View style={{ alignItems: 'center', marginTop: 100 }}>
                        <Fontisto name="shopping-bag-1" size={50} color={COLORS.green1} />
                        <Text className='text-base text-slate mt-2' style={{fontFamily: 'roboto-medium'}}>
                            <Text>No Products Found In This Store</Text>
                        </Text>
                    </View>
                }
                ListHeaderComponent={
                    <>
                        {/* Store Info */}
                        <View className='w-full mt-2 flex-row items-center'>
                            <View className="w-20 h-20 rounded-full border-2 border-lavender">
                                <Image className='h-full w-full rounded-full' source={{ uri: `${STORES_IMAGE_URI}${params.store_profileimage}` }} />
                                {!isOpen && (
                                    <View className='absolute w-full h-full bg-black opacity-70 rounded-full flex-row justify-center items-center'>
                                        <MaterialCommunityIcons name="lock" size={16} style={{color: COLORS.lite}} />
                                        <Text style={{fontFamily: 'roboto-medium'}} className='text-sm text-white'>Closed</Text>
                                    </View>
                                )}
                            </View>

                            <View className='ml-3 flex-1'>
                                <Text numberOfLines={1} className="text-base" style={{ fontFamily: 'roboto-medium' }}>{params.store_name}</Text>
                                <Text className="text-sm text-gray-500" style={{ fontFamily: 'roboto-medium' }}>{params.store_phone_num}</Text>
                            </View>

                            <TouchableOpacity
                                className='rounded-full h-[40px] bg-[#DFF6E6] border border-green1 w-[40px] items-center justify-center'
                                onPress={() => makeCall(params.store_phone_num)}
                            >
                                <FontAwesome name='phone' size={20} style={{color: COLORS.green2}} />
                            </TouchableOpacity>
                        </View>

                        {/* Store Description */}
                        <View className='my-2 w-full'>
                            <Text className='text-sm text-gray-600' style={{ fontFamily: 'roboto-medium' }}>{params.store_description}</Text>
                        </View>

                        {/* Store Actions */}
                        <View className='flex-row items-center justify-between mt-5'>
                            <TouchableOpacity className='items-center'
                                onPress={() => setRateStore(true)}
                            >
                                <View className='flex-row justify-center items-center'>
                                    <Ionicons name='star' size={18} color={COLORS.green1} />
                                    <Text className='text-sm' style={{fontFamily: 'roboto-medium', color: COLORS.green1}}>
                                        {params.average_rating} ({params.total_ratings})
                                    </Text>
                                </View>
                                <Text className='text-lg' style={{ fontFamily: 'roboto-medium' }}>Rate Us</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => router.push({ pathname: '/(routes)/maps/store-map/', params: {
                                    store_id,
                                    store_profileimage,
                                    store_name,
                                    store_description,store_phone_num } })}
                                className='items-center justify-center'
                            >
                                <View className='flex-row items-center justify-center'>
                                    <Ionicons name='location-outline' color={COLORS.green1} size={18} />
                                    <Text className='text-sm text-lavender'>| </Text>
                                    <Text numberOfLines={1} className='text-sm text-green1' style={{fontFamily: 'roboto-medium'}}>{calculateDistance(pointA, pointB) || 0 + "Km"}</Text>
                                </View>
                                <Text className='text-lg' style={{ fontFamily: 'roboto-medium' }}>Location</Text>
                            </TouchableOpacity>

                            <TouchableOpacity className='items-center'
                                onPress={AddToFavorites}
                            >
                                <MaterialCommunityIcons
                                    name={!isFavoritedParam ? "cards-heart-outline" : "cards-heart"}
                                    size={20}
                                    color={COLORS.primary}
                                />
                                <Text className='text-lg' style={{ fontFamily: 'roboto-medium' }}>Favorites</Text>
                            </TouchableOpacity>
                        </View>

                        <View className='flex-row items-center justify-between mt-5 mb-4'>
                            <TouchableOpacity className='justify-center items-center'
                                onPress={() => setGetReviews(true)}
                            >
                                <View className='flex-row justify-center items-center'>
                                    <FontAwesome name='comments' size={20} color={COLORS.green1}/>
                                    <Text className='text-sm ml-1' style={{fontFamily: 'roboto-medium', color: COLORS.green1}}>
                                        ({params.total_ratings})
                                    </Text>
                                </View>
                                <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>Reviews</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                }
            />

            {ratestore &&
                <>
                    <View className='absolute flex-1 bottom-2 left-1 w-full' style={{zIndex: 10000}}>
                        <MotiView
                            from={{ opacity: 0, translateY: 50 }}   // start hidden + lower
                            animate={{ opacity: 1, translateY: 0 }} // end visible + normal pos
                            transition={{ duration: 1000 }}
                            className=''
                        >
                            <View className='bg-white w-full justify-center items-center rounded-md'>
                                <TouchableOpacity
                                    className='w-full bg-red justify-center items-center'
                                    style={{borderTopLeftRadius: 5, borderTopRightRadius: 4}}
                                    onPress={() => setRateStore(false)}
                                >
                                    <View className='h-1 rounded-full my-2 bg-white w-[30%]'/>
                                </TouchableOpacity>

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
                                        onPress={() => submitRating()}
                                    >
                                        <Text className='text-white text-2xl' style={{fontFamily: 'roboto-medium'}}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>  
                        </MotiView>
                    </View>
                    <Pressable
                        className="absolute inset-0 bg-transparentBlack"
                        onPress={() => setRateStore(false)}
                    />
                </>
            }
            {getReviews &&
                <>
                    <View className='absolute flex-1 left-2 bottom-2 w-full' style={{zIndex: 10000, maxHeight: '80%'}}>
                        <MotiView
                            from={{ opacity: 0, translateY: 50 }}   // start hidden + lower
                            animate={{ opacity: 1, translateY: 0 }} // end visible + normal pos
                            transition={{ duration: 1000 }}
                            className='justify-end'
                        >
                            <View className='bg-white w-full justify-center items-center rounded-md'>
                                <TouchableOpacity
                                    className='w-full bg-red justify-center items-center'
                                    style={{borderTopLeftRadius: 5, borderTopRightRadius: 4}}
                                    onPress={() => setGetReviews(false)}
                                >
                                    <View className='h-1 rounded-full my-2 bg-white w-[30%]'/>
                                </TouchableOpacity>

                                <View className='px-2'>
                                    <Text className='mt-4 text-2xl' style={{fontFamily: 'roboto-medium'}}>Reviews</Text>
                                    <Text className='text-sm text-green1 mt-1' style={{fontFamily: 'roboto-medium', textAlign: 'justify'}}>
                                        See what people are saying about this store.
                                    </Text>
                                </View>

                                <View className='w-full justify-center mt-8 items-center'>
                                    <View className='px-2 w-full'>
                                        <View className='w-full justify-center'>
                                            <View className='justify-between w-full items-center flex-row'>
                                                <View className='border-2 border-lavender justify-center items-center rounded-full p-1' style={{width: 45, height: 45}}>
                                                    <FontAwesome name='user' size={28} color={COLORS.slate}/>
                                                </View>
                                                <View className='' style={{width: '83%'}}>
                                                    <Text className='text-base text-slate' style={{fontFamily: 'roboto-medium'}}>Sylveter Nyimbili</Text>
                                                </View>
                                            </View>
                                            <View className='justify-center w-full items-center'>
                                                <View className='' >
                                                    <Text className='' style={{fontFamily: 'roboto', textAlign: 'justify'}}>Hello this is a very good store, their services are awesome. Keep it up</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View className='w-full my-4' style={{height: 1}}/>
                                    </View>

                                    <View className='w-full px-2 mb-4'>
                                        {/* Review Input */}
                                        <TouchableOpacity className='border rounded border-lavender py-6 px-3'
                                            onPress={() => {
                                                setGetReviews(false)
                                                setRateStore(true)
                                            }}
                                        >
                                            <Text className='text-slate' style={{fontFamily: 'roboto-medium'}}>Write a review...</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>  
                        </MotiView>
                    </View>
                    <Pressable
                        className="absolute inset-0 bg-transparentBlack"
                        onPress={() => setGetReviews(false)}
                    />
                </>
            }
        </SafeAreaView>
    );
};

export default index;
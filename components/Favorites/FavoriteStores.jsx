import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import LoadingIndicator from '../../app/LoadingIndicator';
import { COLORS, SIZES } from '../../constants/constants';
import useApi from '../../hook/useApi';
import { STORES_IMAGE_URI } from '../../RequestMethods';
import { calculateDistance } from '../../utils/getDistance';
import { isStoreOpen } from '../../utils/isStoreOpen';
import { toast } from '../../utils/toast';

// ----------------- FavoritesCard -----------------
const FavoritesCard = ({
    user_id,
    store_id,
    store_profileimage,
    store_coverimage,
    store_name,
    store_latitude,
    store_longitude,
    store_location,
    store_category,
    store_description,
    store_phone_num,
    average_rating,
    total_ratings,
    isClosed,
    open_time,
    closing_time,
    open_close,
    latitude,
    longitude,
    onRemove, // parent callback to remove store
    post,
    router
}) => {
    const removeFavorite = async () => {
        // 1️⃣ Optimistic update: remove immediately
        if (onRemove) onRemove(store_id);

        try {
            const res = await post({ user_id, store_id: store_id }, `/stores/favorites/add`);

            if (res.data.favorited === false) {
                toast.success(res.data.message);
            } else {
                toast.error('Failed to remove favorite');
            }
        } catch (err) {
            toast.error('Error removing favorite');
            console.log(err);
        }
    };

    // Determine which screen to navigate to
    const handlePress = () => {
    const restaurantCategories = ['Restaurant', 'Liquor', 'Cafe', 'Vegies', 'Dries'];

    if (restaurantCategories.includes(store_category)) {
        router.push({
            pathname: '../(routes)/home-single-store/',
            params: {
                store_id,
                store_profileimage,
                store_coverimage,
                store_name,
                store_description,
                store_phone_num,
                open_close,
                store_latitude,
                store_longitude,
                store_location,
                store_category,
                average_rating,
                total_ratings,
                favorited: true,
                open_time,
                closing_time
            },
        });
    } else {
        router.push({
            pathname: '../(routes)/other-stores-single/',
                params: {
                    store_id,
                    store_profileimage,
                    store_coverimage,
                    store_name,
                    store_description,
                    store_phone_num,
                    open_close,
                    store_latitude,
                    store_longitude,
                    store_location,
                    store_category,
                    average_rating,
                    total_ratings,
                    favorited: true,
                    open_time,
                    closing_time
                },
            });
        }
    };

    return (
        <TouchableOpacity className="w-full items-center justify-center"
            onPress={handlePress}
        >
            <View className="flex-row justify-between items-center w-full">
                {/* Store Image */}
                <View className="relative rounded-sm" style={{ width: '29%', height: 70 }}>
                    <Image
                        className="h-full w-full rounded-sm"
                        source={{ uri: `${STORES_IMAGE_URI}${store_profileimage}` }}
                    />
                    {isClosed &&
                        <View className="absolute w-full h-full bg-black opacity-70 rounded-[3px] flex-row justify-center items-center z-50">
                            <MaterialCommunityIcons name="lock" size={16} color={COLORS.primary} />
                            <Text className="text-sm text-white ml-1">Closed</Text>
                        </View>
                    }
                </View>

                {/* Store Info */}
                <View className="" style={{width: '69%'}}>
                    <Text numberOfLines={1} className="text-base" style={{ fontFamily: 'roboto-medium' }}>
                        {store_name}
                    </Text>

                    <View className="flex-row my-1 items-center justify-between">
                        <View
                            className="items-center justify-center rounded-sm py-1"
                            style={{ width: '33%', backgroundColor: COLORS.grey_bg }}
                        >
                            <Text className="text-sm text-green1">{store_category}</Text>
                        </View>

                        <View style={{ width: '10%' }}>
                            {/* Remove Favorite Button */}
                            <TouchableOpacity className="justify-center items-center" onPress={removeFavorite}>
                                <FontAwesome name="times" size={23} color={COLORS.red} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center" style={{width: '27%'}}>
                            <Ionicons name="star" size={12} color={COLORS.primary} />
                            <Text
                                className='text-sm text-slate' style={{ marginLeft: 3 }}
                                numberOfLines={1}
                            >
                                {average_rating ? average_rating.toFixed(1) : 'New'}
                                {total_ratings > 0 && ` (${total_ratings})`}
                            </Text>
                        </View>

                        <View className="flex-row items-center justify-center" style={{width: '22%'}}>
                            <Ionicons name="location-outline" color={COLORS.primary} size={11} />
                            <Text
                                style={{ fontFamily: 'roboto', fontSize: SIZES.small, color: COLORS.slate }}
                                numberOfLines={1}
                            >
                                {calculateDistance(
                                    { latitude, longitude },
                                    { latitude: store_latitude, longitude: store_longitude }
                                )}
                            </Text>
                        </View>

                        <View className='flex-row justify-end' style={{width: '48%'}}>
                            <Text
                                numberOfLines={1}
                                style={{ fontFamily: 'roboto', color: COLORS.slate, fontSize: SIZES.small }}
                            >
                                {store_location}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <View className="w-full my-5 h-[1px] bg-slate opacity-10" />
        </TouchableOpacity>
    );
};

// ----------------- FavoriteStores Screen -----------------
const FavoriteStores = () => {
    const { latitude, longitude } = useSelector((state) => state.location) || {};
    const { user_id } = useSelector((state) => state.auth);
    const [storeList, setStoreList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const router = useRouter();

    const { get, isLoading, error } = useApi();
    const { post } = useApi();

    // Fetch first page
    const fetchStores = async () => {
        setRefreshing(true);
        try {
            const res = await get(`/stores/favorites/${user_id}?page=1&limit=10`);
            if (res?.data) {
                setStoreList(res.data);
                setPage(1);
                setHasMore(true);
            }
        } catch (err) {
            console.log(err);
        }
        setRefreshing(false);
    };

    // Load next page (pagination)
    const loadNextPage = async () => {
        if (!hasMore || loadingMore) return;

        setLoadingMore(true);
        const nextPage = page + 1;
        try {
            const res = await get(`/stores/favorites/${user_id}?page=${nextPage}&limit=10`);
            if (res?.data && res.data.length > 0) {
                setStoreList((prev) => [...prev, ...res.data]);
                setPage(nextPage);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.log(err);
        }
        setLoadingMore(false);
    };

    useEffect(() => {
        if (user_id) fetchStores();
    }, [user_id]);

    // Remove store instantly
    const removeFromList = (storeId) => {
        setStoreList((prev) => prev.filter((store) => store.store_id !== storeId));
    };

    if (isLoading && page === 1) return <LoadingIndicator loading_text="Loading stores..." />;
    if (error) return <Text>Error: {error.message}</Text>;

    return (
        <FlatList
            data={storeList}
            keyExtractor={(item) => item.store_id.toString()}
            refreshing={refreshing}
            onRefresh={fetchStores}
            onEndReached={loadNextPage}
            onEndReachedThreshold={0.5}

            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={fetchStores}
                    colors={[COLORS.primary]} // Android
                    tintColor={COLORS.primary} // iOS
                />
            }
            renderItem={({ item }) => {
                const isManuallyClosed = item.open_close === false;
                const isTimeClosed = !isStoreOpen(item.open_time, item.closing_time);
                const isClosed = isManuallyClosed || isTimeClosed;
                return (
                <FavoritesCard
                    user_id={user_id}
                    store_id={item.store_id}
                    store_profileimage={item.store_profileimage}
                    store_coverimage={item.store_coverimage}
                    store_name={item.store_name}
                    store_latitude={item.latitude}
                    store_longitude={item.longitude}
                    store_location={item.store_location}
                    store_category={item.store_category}
                    store_description={item.store_description}
                    store_phone_num={item.store_phone_num}
                    average_rating={item.avg_rating}
                    total_ratings={item.total_reviews}
                    isClosed={isClosed}
                    open_time={item.open_time}
                    closing_time={item.closing_time}
                    open_close={item.open_close}
                    latitude={latitude}
                    longitude={longitude}
                    onRemove={removeFromList}
                    post={post}
                    router={router}
                />
            )}}
            
            ListFooterComponent={() =>
                loadingMore ? <LoadingIndicator loading_text="Loading more..." /> : null
            }
            ListHeaderComponent={() => (
                <View className="flex-row my-6 mt-4 items-center justify-between">
                    <View className='flex-row justify-center items-center'>
                        <MaterialCommunityIcons name="heart" size={27} color={COLORS.primary} />
                        <Text style={{ fontFamily: 'roboto-medium' }} className="ml-1 text-xl">My Favorites</Text>
                    </View>
                    <View className='bg-navBtnBgHome rounded-sm py-2 px-4'>
                        <Text
                            style={{ fontFamily: 'roboto-medium' }} className='text-xl text-primary'
                        >
                            {storeList.length} {storeList.length === 1 ? 'Store' : 'Stores'}
                        </Text>
                    </View>
                </View>
            )}
            showsVerticalScrollIndicator={false}
        />
    );
};

export default FavoriteStores;
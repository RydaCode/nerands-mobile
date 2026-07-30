import { FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS } from '../../../../constants/constants';
import useApi from '../../../../hook/useApi';
import AllStoresCard from './cards/AllStoresCard';

const AllStores = ({ cat_name }) => {
    const { user_id } = useSelector((state) => state.auth);
    const { data, isLoading, get } = useApi();

    const [stores, setStores] = useState([]);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    console.log("STORES DATAAA", stores)

    const LIMIT = 10;

    // Fetch data
    const fetchStores = async (pageNumber) => {
        if (loadingMore) return;

        setLoadingMore(true);
        const offset = (pageNumber - 1) * LIMIT;

        try {
            const res = await get(
                `/stores/category?cat_name=${cat_name}&user_id=${user_id}&limit=${LIMIT}&offset=${offset}`
            );

            const newStores = res?.stores || [];

            setStores(prev => {
                const existingIds = new Set(prev.map(s => s.store_id));
                const filtered = newStores.filter(s => !existingIds.has(s.store_id));

                return pageNumber === 1 ? filtered : [...prev, ...filtered];
            });

            if (newStores.length < LIMIT) {
                setHasMore(false);
            }

            setPage(pageNumber);
        } finally {
            setLoadingMore(false);
        }
    };

    // Initial load
    useEffect(() => {
        setStores([]);
        setPage(1);
        setHasMore(true);

        fetchStores(1);
    }, [cat_name, user_id]);

    // Handle API response
    useEffect(() => {
        if (!data?.stores) return;

        const newStores = data?.stores;

        if (page === 1) {
            setStores(newStores);
        } else {
            setStores(prev => [...prev, ...newStores]);
        }

        // STOP condition
        if (newStores.length < LIMIT) {
            setHasMore(false);
        }

        setLoadingMore(false);
    }, [data]);

    // Load more
    const loadMore = () => {
        if (loadingMore || !hasMore) return;

        fetchStores(page + 1);
    };

    // UI states
    if (isLoading && stores?.length === 0) {
        return (
            <View className='flex-1 justify-center items-center'>
                <ActivityIndicator size={40} color={COLORS.primary} />
                <Text className='text-lg text-black' style={{ fontFamily: 'roboto-medium' }}>
                    Loading stores, please wait...
                </Text>
            </View>
        );
    }

    if (!stores?.length) {
        return (
            <View className='flex-1 justify-center items-center'>
                <FontAwesome5 name='search' color={COLORS.slate} size={40} />
                <Text className='text-lg text-black' style={{ fontFamily: 'roboto-medium' }}>
                    No stores found in this category
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={stores}
            keyExtractor={(item) => item.store_id.toString()}
            renderItem={({ item }) => {
                return (
                <AllStoresCard
                    store_id={item.store_id}
                    business_id={item.business_id}
                    store_profileimage={item.store_profileimage}
                    store_coverimage={item.store_coverimage}
                    store_name={item.store_name}
                    store_description={item.store_description}
                    store_phone_num={item.store_phone_num}
                    open_close={item.open_close}
                    store_latitude={item.latitude}
                    store_longitude={item.longitude}
                    store_location={item.store_location}
                    store_category={item.store_category}
                    average_rating={item.average_rating}
                    total_ratings={item.review_count}
                    favorited={item.favorited}
                    is_closed={item.is_closed}
                    open_time={item.open_time}
                    close_time={item.close_time}
                />
            )}}
            onEndReached={loadMore}
            onEndReachedThreshold={0.2}
            ListFooterComponent={() =>
                loadingMore ? (
                    <ActivityIndicator size={35} color={COLORS.primary} />
                ) : (
                    <View className='pb-8' />
                )
            }
            showsVerticalScrollIndicator={false}
        />
    );
};

export default AllStores;
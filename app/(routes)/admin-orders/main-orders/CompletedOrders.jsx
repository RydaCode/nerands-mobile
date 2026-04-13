import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SIZES } from '../../../../constants/constants';
import useApi from '../../../../hook/useApi';

// --- Single order row ---
const OrdersData = ({ order, router }) => {

    const total = order?.order_items?.reduce(
        (sum, item) => sum + (item.product_actual_price || 0) * (item.quantity || 0),
        0
    );

    const qty = order?.order_items?.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
    );

    const statusColors = {
        pending: 'red',
        processing: 'purple',
        in_transit: 'blue',
        completed: 'green',
    };

    return (
        <TouchableOpacity
            onPress={() =>
                router.push({
                    pathname: './admin-orders-single/',
                    params: {
                        user_id: order.user_id,
                        store_id: order.store_id,
                        order_id: order.order_id,
                        store_latitude: order.store_latitude,
                        store_longitude: order.store_longitude,
                        user_latitude: order.user_latitude,
                        user_longitude: order.user_longitude,
                        grand_total: total,
                    },
                })
            }
            className="flex-row justify-between items-center"
        >
            <View className="flex-row justify-start items-center">
                <View
                    style={{ borderRadius: SIZES.radius }}
                    className="h-[65px] w-[26%] border-2 border-lavender justify-center items-center"
                >
                    <Entypo size={40} name="box" color={COLORS.primary} />
                </View>
                <View className="w-[71.7%] flex-row ml-2 justify-between items-center">
                    <View className="w-full">
                        <Text className="text-lg" style={{ fontFamily: 'roboto-medium' }}>
                            Order No: {order.order_number}
                        </Text>
                        <View className="flex-row justify-between items-center mt-1">
                            <Text className="text-base text-primary" style={{ fontFamily: 'roboto-medium' }}>
                                Total: K{total}
                            </Text>
                            <Text className="text-slate text-sm ml-2" style={{ fontFamily: 'roboto-medium' }}>
                                Qty: {qty}
                            </Text>
                            <View
                                style={{ backgroundColor: statusColors[order.order_status] || 'gray' }}
                                className="flex-row rounded-sm px-2 py-0.5 items-center justify-center"
                            >
                                <Text className="text-white text-sm" style={{ fontFamily: 'roboto-medium' }}>
                                    {order.order_status}
                                </Text>
                            </View>
                        </View>
                        <View className="flex-row justify-between items-center mt-1">
                            <Text className="text-grey text-sm" style={{ fontFamily: 'roboto-medium' }}>
                                Time: {order.order_time}
                            </Text>
                            <Text className="text-grey text-sm" style={{ fontFamily: 'roboto-medium' }}>
                                Date: {order.order_date}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// --- Pending orders list ---
const CompletedOrders = ({ title, params }) => {
    const STATUS = 'completed';

    const router = useRouter();
    const { get, isLoading } = useApi();

    const [orderData, setOrders] = useState([]);
    const [nextCursor, setNextCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const appendOrders = (newOrders) => {
    setOrders((prev) => {
        const merged = [...prev, ...newOrders];
        const unique = merged.filter(
            (v, i, a) => a.findIndex((x) => x.order_id === v.order_id) === i
        );
        return unique;
    });
};

    // --- Build API URL with cursor ---
    const buildUrl = () => {
        let url = `/orders/adminorders/${params.store_id}?limit=10&order_status=${STATUS}`;

        if (nextCursor?.last_order_time && nextCursor?.last_order_id != null) {
            url += `&last_order_time=${encodeURIComponent(nextCursor.last_order_time)}`;
            url += `&last_order_id=${nextCursor.last_order_id}`;
        }

        return url;
    };

    // --- Initial fetch ---
    const fetchInitialOrders = async () => {
        if (!params.store_id) return;

        try {
            setIsRefreshing(true);
            setOrders([]);
            setNextCursor(null);
            setHasMore(true);

            const url = `/orders/adminorders/${params.store_id}?limit=10&order_status=${STATUS}`;
            const res = await get(url);

            const data = Array.isArray(res?.data?.data) ? res.data.data : [];
            setOrders(data);
            setNextCursor(res?.data?.next_cursor || null);
            setHasMore(res?.data?.next_cursor !== null);
        } catch (err) {
            console.error('Error refreshing orders:', err);
        } finally {
            setIsRefreshing(false);
        }
    };

    // --- Load more on scroll ---
    const loadMoreOrders = async () => {
        if (!hasMore || !nextCursor) return;

        try {
            const res = await get(buildUrl());
            const newOrders = Array.isArray(res?.data?.data) ? res.data.data : [];
            appendOrders(newOrders);

            setNextCursor(res?.data?.next_cursor || null);
            setHasMore(res?.data?.next_cursor !== null);
        } catch (err) {
            console.error('Error loading more orders:', err);
        }
    };

    // --- Fetch first page on mount ---
    useEffect(() => {
        fetchInitialOrders();
    }, [params.store_id]);

    // --- Loader ---
    if (orderData.length === 0 && isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text className="text-md mt-3 text-slate">Loading orders...</Text>
            </View>
        );
    }

    // --- FlatList render ---
    return (
        <FlatList
            data={orderData}
            keyExtractor={(item) => item.order_id.toString()}
            renderItem={({ item }) => (
                <View className="px-2">
                    <OrdersData order={item} router={router} />
                    <View className="w-full my-4 rounded-full bg-slate opacity-10" style={{ height: 1 }} />
                </View>
            )}
            ListHeaderComponent={() => (
                <View className="flex-row px-2 justify-between items-center my-6">
                    <Text className="mt-1 text-lg" style={{ fontFamily: 'roboto-medium' }}>
                        {title}
                    </Text>
                    <View
                        className="flex-row justify-start items-center py-[1px] px-2 rounded-full"
                        style={{ backgroundColor: '#F3F4F8' }}
                    >
                        <View
                            className="rounded-full bg-red border-1 border-red mr-1"
                            style={{ height: 10, width: 10 }}
                        />
                        <Text className="text-red" style={{ fontFamily: 'roboto-medium' }}>
                            {orderData?.length} Orders
                        </Text>
                    </View>
                </View>
            )}
            onEndReached={loadMoreOrders}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
            refreshing={isRefreshing}
            onRefresh={fetchInitialOrders}
        />
    );
};

export default CompletedOrders;
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import agoTimeStamp from '../../../../components/agoTimeStamp';
import { COLORS } from '../../../../constants/constants';
import useApi from '../../../../hook/useApi';

// --- Single order row ---
const OrdersData = ({ order, router, params }) => {

    const total = order?.order_items?.reduce(
        (sum, item) => sum + (item.product_actual_price || 0) * (item.quantity || 0),
        0
    );

    const qty = order?.order_items?.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
    );

    const statusColors = {
        in_transit: COLORS.extra_blue,
    };

    return (
        <TouchableOpacity
            onPress={() =>
                router.push({
                    pathname: './admin-orders-single/',
                    params: {
                        user_id: order.order.user_id,
                        order_number: order.order.order_number,
                        store_id: order.store_order.store_id,
                        order_id: order.order.order_id,
                        store_order_id: order.store_order.store_order_id,
                        store_latitude: params.store_latitude,
                        store_longitude: params.store_longitude,
                        grand_total: total,
                        order_status: 'in_transit'
                    },
                })
            }
            className="flex-row justify-between items-center"
        >
            <View className="flex-row justify-start items-center">
                <View
                    style={{ width: '23%', height: 60 }}
                    className="border bg-white rounded elevation-sm border-lavender justify-center items-center"
                >
                    <Entypo size={35} name="box" color={COLORS.slate} />
                </View>

                <View className="w-[71.7%] flex-row ml-2 justify-between items-center">
                    <View className="w-full">
                        <Text className="text-base" style={{ fontFamily: 'roboto-medium' }}>
                            Order No: {Number(order.order.order_number)}
                        </Text>

                        <View className="flex-row justify-between items-center mt-1">
                            
                            <Text className="text-slate text-sm ml-2" style={{ fontFamily: 'roboto-medium' }}>
                                Qty: {order.order.items_quantity}
                            </Text>

                            <View
                                style={{ backgroundColor: statusColors[order.store_order.status] || 'gray' }}
                                className="flex-row rounded-sm px-2 py-0.5 items-center justify-center"
                            >
                                <Text className="text-white text-sm">
                                    {order.store_order.status?.charAt(0).toUpperCase() + order.store_order.status?.slice(1)}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row justify-between items-center">
                            <Text
                                className="text-sm text-slate"
                                style={{ fontFamily: "roboto" }}
                            >
                                {new Date(order.store_order.created_at).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </Text>
                            <Text
                                className="text-sm text-slate mr-4"
                                style={{ fontFamily: "roboto" }}
                            >
                            {' '} ({agoTimeStamp(order.store_order.created_at)})
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// --- Pending Orders ---
const InTransitOrders = ({ title, params }) => {
    const router = useRouter();
    const STATUS = 'in_transit';
    const { get, isLoading } = useApi();
    const [orderData, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async (pageNumber = 1) => {
        if (loading) return;

        try {
            setLoading(true);

            const url = `/orders/adminorders/${params.store_id}?limit=10&page=${pageNumber}&order_status=${STATUS}`;
            const res = await get(url);

            const newOrders = Array.isArray(res?.data?.data) ? res.data.data : [];

            if (pageNumber === 1) {
                setOrders(newOrders);
            } else {
                setOrders(prev => [...prev, ...newOrders]);
            }

            if (newOrders.length < 10) {
                setHasMore(false);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // initial load
    useEffect(() => {
        setPage(1);
        setHasMore(true);
        fetchOrders(1);
    }, [params.store_id]);

    // load more
    const loadMore = () => {
        if (loading || !hasMore) return;

        const nextPage = page + 1;
        setPage(nextPage);
        fetchOrders(nextPage);
    };

    // refresh
    const onRefresh = () => {
        setPage(1);
        setHasMore(true);
        fetchOrders(1);
    };

    if (orderData.length === 0 && loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size={40} color={COLORS.primary} />
                <Text className="mt-3 text-slate text-lg" style={{fontFamily: 'roboto-medium'}}>Loading orders...</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={orderData}
            keyExtractor={(item) => item.order.order_id}
            renderItem={({ item }) => (
                <View className="px-2">
                    <OrdersData
                        order={item}
                        router={router}
                        params={params}
                    />
                    <View className="w-full my-4 rounded-full bg-slate opacity-10" style={{ height: 1 }} />
                </View>
            )}
            ListHeaderComponent={() => (
                <View className=" px-2 justify-center items-center my-6">
                    <View className="items-center py-[1px] justify-start px-2 w-full bg-[#F3F4F8]">
                        <Text className="text-black">
                            There {orderData?.length === 1 ? 'is': 'are'} <Text className='text-primary text-lg'>{orderData?.length}</Text> {title} from this store
                        </Text>
                    </View>
                </View>
            )}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={onRefresh}
        />
    );
};

export default InTransitOrders;
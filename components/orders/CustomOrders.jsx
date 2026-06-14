import { Entypo, Fontisto, Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import { COLORS, SIZES } from '../../constants/constants'
import useApi from '../../hook/useApi'
import EmptyState from '../EmptyState'
import agoTimeStamp from '../agoTimeStamp'

const OrdersData = ({ order, router }) => {
    const CustomProducts = order?.custom_products;

    const statusColorMap = {
        Pending: 'bg-rose-700',
        Accepted: 'bg-violet-500',
        In_progress: 'bg-indigo-500',
        Completed: 'bg-green2',
        Cancelled: 'bg-red'
    };

    const statusColor = statusColorMap[order.order_status] || 'bg-red';
    const dotClassName = `flex-row px-2 py-0.5 items-center justify-center rounded-sm ${statusColor}`;

    return (
        <TouchableOpacity
            onPress={() => router.push({pathname: '../(routes)/user-orders/single-user-custom-order/', params: {
                user_id:order.user_id,
                custom_order_id:order.custom_order_id,
                custom_order_num:order.custom_order_num,
                estimated_spend_amount: order.estimated_spend_amount,
                first_name:order.first_name,
                last_name:order.last_name,
                phone_number:order.phone_number,
                recipients_full_names:order.recipients_full_names,
                custom_order_latitude:order.custom_order_latitude,
                custom_order_longitude:order.custom_order_longitude,
                amount_spent:order.amount_spent,
                service_fee:order.service_fee,
                custom_products:order.custom_products,
                delivery_fee:order.delivery_fee,
                order_time:order.order_time,
                order_date:order.order_date,
                order_date_time:order.order_date_time
            }})}
            className='flex-row justify-between items-center'
        >
            <View className='flex-row justify-start items-center'>
                <View style={{borderRadius: SIZES.radius}} className='h-[65px] w-[26%] border-2 border-lavender justify-center items-center'>
                    <Entypo size={40} name="box" color={COLORS.primary} />
                </View>
                <View className='w-[71.7%] flex-row ml-2 justify-between items-center'>
                    <View className='w-full'>
                        <View className=''>
                            <Text className='text-md' style={{fontFamily: 'roboto-medium'}}>Order No: {order.custom_order_num}</Text>
                        </View>
                        <View className='flex-row justify-between items-center'>
                            <View>
                                <Text className='text-md text-primary' style={{fontFamily: 'roboto-bold'}}>Est: K{order.estimated_spend_amount.toLocaleString()}</Text>
                            </View>
                            <View className='flex-row items-center justify-start mx-2'>
                                <Text className='text-slate text-sm' style={{fontFamily: 'roboto-medium'}}>Qty: {CustomProducts.length}</Text>
                            </View>
                            <View className={dotClassName}>
                                <Text className='text-white text-sm' style={{fontFamily: 'roboto-medium'}}>{order.order_status}</Text>
                            </View>
                        </View>
                        <View className='flex-row justify-between items-center'>
                            <View>
                                <Text className='text-sm text-slate' style={{fontFamily: 'roboto-medium'}}>
                                    {new Date(order?.order_date_time).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </Text>
                            </View>
                            <View className='flex-row items-center justify-start mr-4'>
                                <Text className='text-sm text-slate' style={{fontFamily: 'roboto-medium'}}>
                                    {' '} ({agoTimeStamp(order.order_date_time)})</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const CustomOrders = ({title}) => {
    const router = useRouter();
    const { user_id } = useSelector((s) => s.auth);

    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { error, isLoading, get } = useApi();

    // Fetch on mount
    useEffect(() => {
        if (!user_id) return;
        fetchInitialOrders();
    }, [user_id]);

    // Fetch page 1
    const fetchInitialOrders = async () => {
        try {
            setIsRefreshing(true);

            const res = await get(
                `/customorders/orders/${user_id}?page=1&limit=10`
            );

            if (!res?.data) return;

            const { data, page, total, limit } = res.data;

            setOrders(Array.isArray(data) ? data : []);
            setPage(page);
            setHasMore(page < Math.ceil(total / limit));

        } catch (error) {
            console.error('Error refreshing orders:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const loadMoreOrders = async () => {
        try {
            const nextPage = page + 1;
            const res = await get(`/customorders/orders/${user_id}?page=${nextPage}&limit=10`);

            if (!res || !res.data) {
                console.warn('No response or missing data from API');
                return;
            }

            const newOrders = Array.isArray(res.data.data) ? res.data.data : [];
            setOrders((prev) => [...prev, ...newOrders]);
            setPage(nextPage);

            // Only run this if res.data exists
            if (res.data.total && res.data.limit) {
                setHasMore(nextPage < Math.ceil(res.data.total / res.data.limit));
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error loading more orders:', error);
            
        }
    };

    // Show loader while fetching
    if (orders === 0 && isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text className="text-md mt-3 text-slate">Loading orders...</Text>
            </View>
        );
    }

    return (
        <View className='pb-8 h-full'>
            {!user_id ?
                <View className="w-full h-full justify-center items-center bg-white">
                    
                    <Fontisto name="locked" size={30} color={COLORS.slate} />
                    <Text className="text-base my-4 text-slate" style={{fontFamily: 'roboto-medium'}}>
                        Please login to see your custom orders
                    </Text>
                    <TouchableOpacity
                        style={{ width: "90%" }}
                        className="bg-primary rounded elevation-md justify-center items-center py-2 mt-3"
                        onPress={() => router.push("/(auth)/login")}
                    >
                        <Text
                            className="text-white text-2xl"
                            style={{ fontFamily: "ubuntu-medium" }}
                        >
                            Login
                        </Text>
                    </TouchableOpacity>
                    </View>
                :
                <FlatList
                    data={Array.isArray(orders) ? orders : []}
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyExtractor={(item) => item.custom_order_id.toString()}
                    renderItem={({item}) => (
                        <View className=''>
                            <OrdersData order={item} router={router}/>
                            <View className='w-full my-5 rounded-full bg-slate opacity-10 h-[1px]'/>
                        </View>
                    )}
                    
                    ListEmptyComponent={() => (
                        <View className="flex-1 justify-center items-center relative">
                            <View
                                className="absolute bg-red justify-center items-center rounded-full"
                                style={{ height: 27, width: 27 }}
                            >
                                <Text className="text-white text-sm">0</Text>
                            </View>
                            <EmptyState
                                icon={ <Ionicons size={70} name="bag-outline" color={COLORS.slate} /> }
                                description="You have no orders"
                            />
                        </View>
                    )}
                    
                    showsVerticalScrollIndicator={false}
                    refreshing={isRefreshing}
                    onRefresh={fetchInitialOrders}
                    refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={fetchInitialOrders}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                    }
                    onEndReached={() => {
                        if (hasMore && !isRefreshing && !isLoading) {
                            loadMoreOrders();
                        }
                    }}
                    onEndReachedThreshold={0.5}
                />
            }
        </View>
    )
}

export default CustomOrders
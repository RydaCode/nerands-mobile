import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Dimensions, FlatList, Text, View, useWindowDimensions } from 'react-native'
import { useSelector } from 'react-redux'
import useApi from '../../../../hook/useApi'
import socket from '../../../../socket-io/socket'
import { toast } from '../../../../utils/toast'
import LoadingIndicator from '../../../LoadingIndicator'
import ClientDetails from './ClientDetails'
import CustomTransporter from './CustomTransporter'
import FindTransporter from './FindTransporter'
import OrderActions from './OrderActions'
import OrdersData from './OrdersData'
import RunnerDetails from './RunnerDetails'

const AdminSingleOrderCard = ({params}) => {
    const { width, height } = useWindowDimensions();
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = screenWidth * 0.40; // ~34% of screen width
    const router = useRouter();

    const [searchingTransporter, setSearchingTransporter] = useState(false);
    const [searchFailed, setSearchFailed] = useState(false);
    const [assignedTransporter, setAssignedTransporter] = useState(null);
    const [searchResults, setSearchResults] = useState(null);

    const STATUS = 'pending';
    const { get, isLoading } = useApi();
    const [orderData, setOrders] = useState({});
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [productTotals, setProductTotals] = useState({});

    const {data: mainOrder, isLoading: loadingMainOrder, error: errorMainOrder, get: getMainOrder} = useApi(
        `/orders/${params?.order_id}`
    )

    const {data: getTransporter, isLoading: loadingTransporter, error: errorTransporter, get: getTransporterData} = useApi(
        `/transporter/custom/${mainOrder?.transporter_id}`
    )
    
    useEffect(() => {
        if (mainOrder?.transporter_id) {
            getTransporterData();
        }
    }, [mainOrder?.transporter_id]);
    
    useEffect(() => {
        getMainOrder();
    }, []);

    useEffect(() => {
        if (!params?.store_id) return;

        socket.emit("join_store", params.store_id);

        console.log("Joining store room:", params.store_id);

        const handleStarted = (payload) => {
            console.log(
                "TRANSPORTER SEARCH STARTED:",
                payload
            );

            setSearchResults(payload);

            setSearchingTransporter(true);
            setSearchFailed(false);
        };

        const handleProgress = (payload) => {
            console.log(
                "TRANSPORTER SEARCH PROGRESS:",
                payload
            );

            setSearchResults(payload);
            setSearchingTransporter(true);
        };

        const handleFound = (payload) => {
            console.log("Transporter found", payload);

            setSearchingTransporter(false);
            setSearchFailed(false);

            setAssignedTransporter(payload.transporter);

            toast.success(
                "Transporter found",
                `${payload.transporter.first_name} assigned`
            );
        };


        const handleFailed = (payload) => {
            setSearchingTransporter(false);
            setSearchFailed(true);
            toast.error(payload.message);
        };


        socket.on(
            "transporter_search_started",
            handleStarted
        );

        socket.on(
            "transporter_search_progress",
            handleProgress
        );

        socket.on(
            "transporter_found",
            handleFound
        );

        socket.on(
            "transporter_search_failed",
            handleFailed
        );


        return () => {

            socket.off(
                "transporter_search_started",
                handleStarted
            );

            socket.off(
                "transporter_search_progress",
                handleProgress
            );

            socket.off(
                "transporter_found",
                handleFound
            );

            socket.off(
                "transporter_search_failed",
                handleFailed
            );
        };

    }, [params?.store_id]);

    useEffect(() => {

        if (!params?.store_id) return;

        socket.emit("join_store", params.store_id);


        const handleStatusUpdate = (payload) => {

            console.log("ORDER STATUS UPDATE:", payload);

            setOrders(prev => ({
                ...prev,
                status: payload.status
            }));

        };


        socket.on(
            "order_status_updated",
            handleStatusUpdate
        );


        return () => {
            socket.off(
                "order_status_updated",
                handleStatusUpdate
            );
        };


    }, [params?.store_id]);
    
    const items = orderData?.items || [];

    const summary = (items || []).reduce(
    (acc, item) => {
        const lineTotal =
        Number(item.product_price || 0) * Number(item.quantity || 0);

        acc.productTotal += Number(item.product_price || 0);
        acc.quantityTotal += Number(item.quantity || 0);
        acc.finalTotal += lineTotal;

        return acc;
    },
    { productTotal: 0, quantityTotal: 0, finalTotal: 0 }
    );
   

    const fetchOrders = async (pageNumber = 1) => {
        if (loading) return;

        try {
            setLoading(true);

            const url = `/orders/adminorder/${params.store_order_id}`;
            const res = await get(url);

            const newOrders = res?.data?.data;

            if (pageNumber === 1) {
                setOrders(newOrders);
            } else {
                setOrders(prev => [...prev, ...newOrders]);
            }

            if (newOrders?.length < 10) {
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

    const { latitude, longitude } = useSelector(state => state.location);

    const [transporter, setTransporter] = useState(null); // ✅ keep transporter state

    const [selectedMode, setSelectedMode] = useState('Motor-Bike');
 
    const { data:updateorder, error:errorUpdateOrder, patch } = useApi(`/orders/update/`)

    if (isLoading) {
        return <LoadingIndicator loading_text='Loading Order...' />
    }

    const handleTotalChange = (orderId, total) => {
        setProductTotals(prev => ({
            ...prev,
            [orderId]: total
        }));
    };

    const grandTotal = Object.values(productTotals).reduce(
        (sum, total) => sum + total, 0
    );

    // const grandTota = Number(summary.finalTotal) + Number(orderData?.shipping_fee);

    return (
        <View className="px-4 flex-1">
            {!orderData || orderData?.items?.length === 0 ? (
                <View>
                    <Text>There are are no products undder this order.</Text>
                </View>
            ) : (
                <>
                    <FlatList
                        data={orderData?.items || []}
                        keyExtractor={(item, i) => item.order_item_id || `${orderData.order_id}-${i}`}
                        renderItem={({ item }) => 
                            <OrdersData
                                order={item}
                                summary={summary}
                                order_type={mainOrder?.order_type}
                                onTotalChange={handleTotalChange}
                            />
                        }
                        ListHeaderComponent={() => (
                            <View className="mt-6">
                                <Text className="text-lg" style={{fontFamily: 'roboto-bold'}}>Order No: {params?.order_number}</Text>
                                <View className='bg-lavender w-full my-2' style={{height: 1}}/>
                            </View>
                        )}
                        ListFooterComponent={
                            <>
                                <View className='w-full'>
                                    {!orderData?.runner_active && (
                                        <View className="mt-4 mb-2 w-full flex-row justify-center items-center">
                                            <Text
                                                className="text-base text-primary"
                                                style={{ fontFamily: "roboto-medium" }}
                                            >
                                                Order Total: K{Number(summary.finalTotal).toLocaleString()}
                                            </Text>
                                            <Text className='text-2xl mx-4'>|</Text>
                                            <Text
                                                className="text-base text-green1"
                                                style={{ fontFamily: "roboto-medium" }}
                                            >
                                                Delivery Fee: K{Number(orderData?.shipping_fee).toLocaleString()}
                                            </Text>
                                        </View>
                                    )}
                                    <View className="mt-4 flex-row justify-between items-center">
                                        <Text className="text-2xl" style={{fontFamily: 'ubuntu-medium'}}>Grand Total</Text>
                                        <View className="bg-red px-6 py-2 rounded-sm">
                                            <Text className="text-white text-2xl" style={{fontFamily: 'ubuntu-medium'}}>
                                                K{grandTotal.toLocaleString()}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Client Info */}
                                <ClientDetails
                                    user_id={params.user_id}
                                    store_longitude={params.store_longitude}
                                    store_latitude={params.store_latitude}
                                />

                                {/* Transporter Info */}
                                {/* {['processing', 'in_progress', 'in_transit', 'completed'].includes(data?.status) && (
                                    <TransporterDetails
                                        transporter={data?.transporter}
                                        store={orderData}
                                        user={data?.user}
                                        onCall={(num) => console.log('Call', num)}
                                    />
                                )} */}

                                {orderData?.status !== 'cancelled' && (
                                    <>
                                        {/* Runner Details */}
                                        <RunnerDetails
                                            isRunnerActive={orderData?.runner_active}
                                            order_number={params.order_number}
                                        />

                                        {/* Custom Transporter */}
                                        {(getTransporter?.created_by === params.store_id ||
                                            (!getTransporter?.is_active &&
                                                orderData?.status === 'in_transit')) && (
                                            <CustomTransporter
                                                trans_data={getTransporter}
                                            />
                                        )}

                                        {/* Find Transporter */}
                                        <FindTransporter
                                            isRunnerActive={orderData?.runner_active}
                                            params={params}
                                            data={orderData}
                                            searching={searchingTransporter}
                                            searchFailed={searchFailed}
                                            transporter={assignedTransporter}
                                            searchResults={searchResults}
                                        />
                                    </>
                                )}

                                {orderData?.status === 'ready' && (
                                    <View className="flex-1 mb-4">
                                        <Text className="text-center text-green-600" style={{fontFamily: 'roboto-medium'}}>
                                            Order is ready to be transported, waiting for transporter to start off.
                                        </Text>
                                    </View>
                                )}
                                {orderData?.status === 'delayed' && (
                                    <View className="flex-1 mb-4">
                                        <Text className="text-center text-base text-red" style={{fontFamily: 'roboto-medium'}}>
                                            This order has been delayed, would love to resume or cancel the order, Please let cleint know where you stand.
                                        </Text>
                                    </View>
                                )}
                                <View className="mb-20" />
                            </>
                        }
                        showsVerticalScrollIndicator={false}
                    />

                    <OrderActions
                        orderId={orderData?.order_id}
                        store_order_id={params.store_order_id}
                        status={orderData?.status}
                        grandTotal={grandTotal}
                        params={orderData?.items}
                        store={orderData}
                        courier_type={orderData?.shipping_mode}
                        onUpdate={(newStatus) => console.log("Order updated:", newStatus)}
                        onTransporterAssigned={setTransporter} // ✅ lift transporter up
                    />
                </>
            )}
        </View>
    )
}

export default AdminSingleOrderCard;
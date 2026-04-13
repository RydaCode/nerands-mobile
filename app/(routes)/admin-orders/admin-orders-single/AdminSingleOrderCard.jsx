import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Dimensions, FlatList, Text, View, useWindowDimensions } from 'react-native'
import { useSelector } from 'react-redux'
import useApi from '../../../../hook/useApi'
import { formatWithSpaceThousands } from '../../../../utils/thousands'
import LoadingIndicator from '../../../LoadingIndicator'
import ClientDetails from './ClientDetails'
import OrderActions from './OrderActions'
import OrdersData from './OrdersData'
import TransporterDetails from './TransporterDetails'

const AdminSingleOrderCard = () => {
    const params = useLocalSearchParams();
    const { width, height } = useWindowDimensions();
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = screenWidth * 0.40; // ~34% of screen width
    const router = useRouter();

    const { data, isLoading, error, get } = useApi(`/orders/${params.order_id}`);
    const { latitude, longitude } = useSelector(state => state.location);

    const [transporter, setTransporter] = useState(null); // ✅ keep transporter state

    const [selectedMode, setSelectedMode] = useState('Motor-Bike');
 
    const { data:updateorder, error:errorUpdateOrder, patch } = useApi(`/orders/update/`)

    // Fetch general charges once
    useEffect(() => {
        get();
    }, []);

    if (isLoading) {
        return <LoadingIndicator loading_text='Loading Order...' />
    }

    const grandTota = Number(params.grand_total) + Number(params.delivery_fee);

    return (
        <View className="px-4 flex-1">
            <FlatList
                data={data?.items || []}
                keyExtractor={(item, i) => item.order_item_id || `${data.order_id}-${i}`}
                renderItem={({ item }) => <OrdersData order={item} />}
                ListHeaderComponent={() => (
                    <View className="mt-6">
                        <Text className="text-lg" style={{fontFamily: 'roboto-bold'}}>Order No: {data?.order_number}</Text>
                        <View className='bg-lavender w-full my-2' style={{height: 1}}/>
                    </View>
                )}
                ListFooterComponent={() => (
                    <>
                        <View className='w-full'>
                            <View className="mt-4 mb-2 w-full flex-row justify-center items-center">
                                <Text
                                    className="text-base text-primary"
                                    style={{ fontFamily: "roboto-medium" }}
                                >
                                    Order Total: K{Number(formatWithSpaceThousands(params.grand_total))}
                                </Text>
                                <Text className='text-2xl mx-4'>|</Text>
                                <Text
                                    className="text-base text-green1"
                                    style={{ fontFamily: "roboto-medium" }}
                                >
                                    Delivery Fee: K{Number(formatWithSpaceThousands(params.delivery_fee))}
                                </Text>
                            </View>
                            <View className="mt-4 flex-row justify-between items-center">
                                <Text className="text-2xl" style={{fontFamily: 'ubuntu-medium'}}>Grand Total</Text>
                                <View className="bg-red px-6 py-2 rounded-sm">
                                    <Text className="text-white text-2xl" style={{fontFamily: 'ubuntu-medium'}}>K{grandTota}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Client Info */}
                        <ClientDetails
                            client={data?.user}
                            store_longitude={params.store_longitude}
                            store_latitude={params.store_latitude}
                        />

                        {/* Transporter Info */}
                        {['processing', 'in_progress', 'completed'].includes(data?.order_status) && (
                            <TransporterDetails
                                transporter={data?.transporter}
                                store={data}
                                user={data?.user}
                                onCall={(num) => console.log('Call', num)}
                            />
                        )}

                        {data?.order_status === 'ready' && (
                            <View className="flex-1 mb-4">
                                <Text className="text-center text-green-600" style={{fontFamily: 'roboto-medium'}}>
                                    Order is ready to be transported, waiting for transporter to start off.
                                </Text>
                            </View>
                        )}
                        {data?.order_status === 'delayed' && (
                            <View className="flex-1 mb-4">
                                <Text className="text-center text-base text-red" style={{fontFamily: 'roboto-medium'}}>
                                    This order has been delayed, would love to resume or cancel the order, Please let cleint know where you stand.
                                </Text>
                            </View>
                        )}
                        <View className="mb-20" />
                    </>
                )}
                showsVerticalScrollIndicator={false}
            />

            <OrderActions
                orderId={params.order_id}
                status={data?.order_status}
                grandTotal={params.grand_total}
                params={data?.items[0]}
                courier_type={params.courier_type}
                onUpdate={(newStatus) => console.log("Order updated:", newStatus)}
                onTransporterAssigned={setTransporter} // ✅ lift transporter up
            />
        </View>
    )
}

export default AdminSingleOrderCard;
import { useEffect, useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import { useSelector } from 'react-redux'

import useApi from '../../../../hook/useApi'
import socket from '../../../../socket-io/socket'
import { toast } from '../../../../utils/toast'

import AppModal from '../../../../components/modals/AppModal'
import LoadingIndicator from '../../../LoadingIndicator'
import ClientDetails from './ClientDetails'
import CustomTransporter from './CustomTransporter'
import FindTransporter from './FindTransporter'
import OrderActions from './OrderActions'
import OrderDetailsModal from './OrderDetailsModal'
import OrdersData from './OrdersData'
import RunnerDetails from './RunnerDetails'

const AdminSingleOrderCard = ({ params }) => {
    const { get, isLoading } = useApi()

    const [orderData, setOrders] = useState({})
    const [loading, setLoading] = useState(false)

    const [searchingTransporter, setSearchingTransporter] = useState(false)
    const [searchFailed, setSearchFailed] = useState(false)
    const [assignedTransporter, setAssignedTransporter] = useState(null)
    const [searchResults, setSearchResults] = useState(null)
    const [transporter, setTransporter] = useState(null)

    const [selectedOrder, setSelectedOrder] = useState(null)
    const [productTotals, setProductTotals] = useState({})

    const { data: mainOrder, get: getMainOrder } = useApi(
        `/orders/${params?.order_id}`
    )

    const {
        data: getTransporter,
        get: getTransporterData
    } = useApi(
        `/transporter/custom/${mainOrder?.transporter_id}`
    )

    const { latitude, longitude } = useSelector(
        state => state.location
    )

    /**
     * -------------------------------------------------------
     * Main order
     * -------------------------------------------------------
     */

    useEffect(() => {
        if (!params?.order_id) return

        getMainOrder()
    }, [params?.order_id])

    /**
     * -------------------------------------------------------
     * Transporter
     * -------------------------------------------------------
     */

    useEffect(() => {
        if (!mainOrder?.transporter_id) return

        getTransporterData()
    }, [mainOrder?.transporter_id])

    /**
     * -------------------------------------------------------
     * Store order
     * -------------------------------------------------------
     */

    const fetchOrders = async () => {
        if (!params?.store_order_id || loading) return

        try {
            setLoading(true)

            const url = `/orders/adminorder/${params.store_order_id}`
            const res = await get(url)

            const data = res?.data?.data

            setOrders(data || {})
        } catch (error) {
            console.error('Failed to fetch order:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [params?.store_order_id])

    /**
     * -------------------------------------------------------
     * Order items
     *
     * mainOrder stores the actual order items displayed
     * in the FlatList.
     * -------------------------------------------------------
     */

    const items = mainOrder?.stores?.[0]?.items || []

    /**
     * -------------------------------------------------------
     * Order summary
     *
     * total_price is already calculated by the backend.
     * Do not calculate variant prices again here.
     * -------------------------------------------------------
     */

    const summary = items.reduce(
        (acc, item) => {
            const quantity = Number(item?.quantity || 0)
            const finalPrice = Number(item?.final_price || 0)

            const totalPrice = Number(
                item?.total_price || finalPrice * quantity
            )

            acc.productTotal += totalPrice
            acc.quantityTotal += quantity
            acc.finalTotal += totalPrice

            return acc
        },
        {
            productTotal: 0,
            quantityTotal: 0,
            finalTotal: 0
        }
    )

    /**
     * -------------------------------------------------------
     * Item total changes
     *
     * OrdersData can report its server-calculated total.
     * -------------------------------------------------------
     */

    const handleTotalChange = (orderId, total) => {
        setProductTotals(prev => ({
            ...prev,
            [orderId]: Number(total || 0)
        }))
    }

    /**
     * -------------------------------------------------------
     * Grand total
     *
     * Since the server already provides total_price,
     * summary.finalTotal is the reliable product total.
     *
     * Keep this separate from delivery fee because the
     * existing UI displays them separately.
     * -------------------------------------------------------
     */

    const grandTotal = summary.finalTotal

    /**
     * -------------------------------------------------------
     * Order details modal
     * -------------------------------------------------------
     */

    const openOrderDetails = order => {
        setSelectedOrder(order)
    }

    const closeOrderDetails = () => {
        setSelectedOrder(null)
    }

    /**
     * -------------------------------------------------------
     * Transporter search socket
     * -------------------------------------------------------
     */

    useEffect(() => {
        if (!params?.store_id) return

        socket.emit('join_store', params.store_id)
        console.log('Joining store room:', params.store_id)

        const handleStarted = payload => {
            console.log('TRANSPORTER SEARCH STARTED:', payload)

            setSearchResults(payload)
            setSearchingTransporter(true)
            setSearchFailed(false)
        }

        const handleProgress = payload => {
            console.log('TRANSPORTER SEARCH PROGRESS:', payload)
            setSearchResults(payload)
            setSearchingTransporter(true)
        }

        const handleFound = payload => {
            console.log('Transporter found:', payload)

            setSearchingTransporter(false)
            setSearchFailed(false)
            setAssignedTransporter(payload.transporter)

            toast.success(
                'Transporter found',
                `${payload.transporter.first_name} assigned`
            )
        }

        const handleFailed = payload => {
            console.log('TRANSPORTER SEARCH FAILED:', payload)

            setSearchingTransporter(false)
            setSearchFailed(true)
            toast.error(payload.message)
        }

        socket.on('transporter_search_started', handleStarted)
        socket.on('transporter_search_progress', handleProgress)
        socket.on('transporter_found', handleFound)
        socket.on('transporter_search_failed', handleFailed)

        return () => {
            socket.off('transporter_search_started', handleStarted)
            socket.off('transporter_search_progress', handleProgress)
            socket.off('transporter_found', handleFound)
            socket.off('transporter_search_failed', handleFailed)
        }
    }, [params?.store_id])

    /**
     * -------------------------------------------------------
     * Order status socket
     * -------------------------------------------------------
     */

    useEffect(() => {
        if (!params?.store_id) return

        socket.emit(
            'join_store',
            params.store_id
        )

        const handleStatusUpdate = payload => {
            console.log(
                'ORDER STATUS UPDATE:',
                payload
            )

            setOrders(prev => ({
                ...prev,
                status: payload.status
            }))
        }

        socket.on(
            'order_status_updated',
            handleStatusUpdate
        )

        return () => {
            socket.off(
                'order_status_updated',
                handleStatusUpdate
            )
        }
    }, [params?.store_id])

    /**
     * -------------------------------------------------------
     * Loading
     * -------------------------------------------------------
     */

    if (isLoading) {
        return (
            <LoadingIndicator
                loading_text="Loading Order..."
            />
        )
    }

    /**
     * -------------------------------------------------------
     * Render
     * -------------------------------------------------------
     */

    if (!orderData || items.length === 0) {
        return (
            <View className="px-4 flex-1">
                <Text>
                    There are no products under this order.
                </Text>
            </View>
        )
    }

    return (
        <View className="px-4 flex-1">

            <FlatList
                data={items}
                keyExtractor={(item, index) =>
                    item?.order_item_id ||
                    `${item?.product_id}-${index}`
                }

                renderItem={({ item }) => (
                    <OrdersData
                        order={item}
                        onPress={openOrderDetails}
                        onTotalChange={handleTotalChange}
                    />
                )}

                ListHeaderComponent={
                    <View className="mt-6">
                        <Text
                            className="text-lg"
                            style={{
                                fontFamily: 'roboto-bold'
                            }}
                        >
                            Order No: {params?.order_number}
                        </Text>

                        <View
                            className="bg-lavender w-full my-2"
                            style={{ height: 1 }}
                        />
                    </View>
                }

                ListFooterComponent={
                    <>
                        {!orderData?.runner_active && (
                            <View className="mt-4 mb-2 w-full flex-row justify-center items-center">

                                <Text
                                    className="text-base text-primary"
                                    style={{
                                        fontFamily:
                                            'roboto-medium'
                                    }}
                                >
                                    Order Total: K
                                    {summary.finalTotal.toLocaleString()}
                                </Text>

                                <Text className="text-2xl mx-4">
                                    |
                                </Text>

                                <Text
                                    className="text-base text-green1"
                                    style={{
                                        fontFamily:
                                            'roboto-medium'
                                    }}
                                >
                                    Delivery Fee: K
                                    {Number(
                                        orderData?.shipping_fee || 0
                                    ).toLocaleString()}
                                </Text>

                            </View>
                        )}

                        <View className="mt-4 flex-row justify-between items-center">

                            <Text
                                className="text-2xl"
                                style={{
                                    fontFamily:
                                        'ubuntu-medium'
                                }}
                            >
                                Grand Total
                            </Text>

                            <View className="bg-red px-6 py-2 rounded-sm">

                                <Text
                                    className="text-white text-2xl"
                                    style={{
                                        fontFamily:
                                            'ubuntu-medium'
                                    }}
                                >
                                    K
                                    {grandTotal.toLocaleString()}
                                </Text>

                            </View>
                        </View>

                        <ClientDetails
                            user_id={params.user_id}
                            store_longitude={
                                params.store_longitude
                            }
                            store_latitude={
                                params.store_latitude
                            }
                        />

                        {orderData?.status !== 'cancelled' && (
                            <>
                                <RunnerDetails
                                    isRunnerActive={
                                        orderData?.runner_active
                                    }
                                    order_number={
                                        params.order_number
                                    }
                                />

                                {(
                                    getTransporter?.created_by ===
                                        params.store_id ||

                                    (
                                        !getTransporter?.is_active &&
                                        orderData?.status ===
                                            'in_transit'
                                    )
                                ) && (
                                    <CustomTransporter
                                        trans_data={
                                            getTransporter
                                        }
                                        orderId={orderData?.order_id}
                                        store_order_id={params?.store_order_id}
                                        status={orderData?.status}
                                    />
                                )}

                                {orderData?.status !== 'completed' && (
                                    <FindTransporter
                                        isRunnerActive={
                                            orderData?.runner_active
                                        }
                                        params={params}
                                        data={orderData}
                                        searching={
                                            searchingTransporter
                                        }
                                        searchFailed={
                                            searchFailed
                                        }
                                        transporter={
                                            assignedTransporter
                                        }
                                        searchResults={
                                            searchResults
                                        }
                                    />
                                )}
                            </>
                        )}

                        {orderData?.status === 'ready' && (
                            <View className="flex-1 mb-4">

                                <Text
                                    className="text-center text-green-600"
                                    style={{
                                        fontFamily:
                                            'roboto-medium'
                                    }}
                                >
                                    Order is ready to be
                                    transported, waiting for
                                    transporter to start off.
                                </Text>

                            </View>
                        )}

                        {orderData?.status === 'delayed' && (
                            <View className="flex-1 mb-4">

                                <Text
                                    className="text-center text-base text-red"
                                    style={{
                                        fontFamily:
                                            'roboto-medium'
                                    }}
                                >
                                    This order has been delayed.
                                    Please let the client know
                                    where you stand.
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
                store_order_id={params?.store_order_id}
                status={orderData?.status}
                grandTotal={grandTotal}
                params={items}
                store={orderData}
                courier_type={
                    orderData?.shipping_mode
                }
                onUpdate={newStatus => {
                    setOrders(prev => ({
                        ...prev,
                        status: newStatus
                    }))
                }}
                onTransporterAssigned={
                    setTransporter
                }
            />

            <AppModal
                visible={!!selectedOrder}
                onClose={() => closeOrderDetails(false)}
            >
                <OrderDetailsModal
                    visible={!!selectedOrder}
                    order={selectedOrder}
                    onClose={closeOrderDetails}
                />
            </AppModal>

            {/* <OrderDetailsModal
                visible={!!selectedOrder}
                order={selectedOrder}
                onClose={closeOrderDetails}
            /> */}

        </View>
    )
}

export default AdminSingleOrderCard
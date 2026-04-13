import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import OrderBtn from '../../../components/cart/OrderBtn';
import OthersCartData from '../../../components/cart/OthersCartData';
import EmptyState from '../../../components/EmptyState';
import { COLORS, SIZES } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { clearOthersCart } from '../../../redux/store/slices/OthersCartSlice';

const OtherProductsTab = () => {
    const { user_id } = useSelector((state) => state.auth);
    const { latitude, longitude } = useSelector(state => state.location);
    const router = useRouter();
    const dispatch = useDispatch();
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Get screen dimensions for responsive UI
    const { width, height } = useWindowDimensions();
    const buttonWidth = width * 0.4; 

    const othersCartItems = useSelector(state => state.otherscart.othersCartItems);
    const [totalZMK, setTotalZMK] = useState(0);
    const [orderdata, setOrderData] = useState(null);

    // Update total price when cart changes
    useEffect(() => {
        const newTotal = othersCartItems.reduce((total, item) => total + item.total_price, 0);
        setTotalZMK(parseFloat(newTotal.toFixed(2))); // Ensuring proper decimal handling
    }, [othersCartItems]);

    // Update order data when cart items or total changes
    useEffect(() => {
        if (othersCartItems.length > 0) {
            setOrderData({
                user_id: user_id,
                order_type: 2,
                store_id: othersCartItems[0]?.store_id || '',
                store_name: othersCartItems[0]?.store_name || '',
                store_category: othersCartItems[0]?.store_category || '',
                store_phone_num: othersCartItems[0]?.store_phone_num || '',
                store_province: othersCartItems[0]?.store_province || '',
                order_area: othersCartItems[0]?.city_town || '',
                store_location: othersCartItems[0]?.store_location || '',
                open_time: othersCartItems[0]?.opentime || '',
                closing_time: othersCartItems[0]?.closing_time || '',
                store_latitude: othersCartItems[0]?.store_latitude ?? 0.0,
                store_longitude: othersCartItems[0]?.store_longitude ?? 0.0,
                user_latitude: latitude ?? 0.0,
                user_longitude: longitude ?? 0.0,
                cart_qty: othersCartItems.length,
                order_total_price: totalZMK,
                cart_items: othersCartItems.map(otherscart => ({
                    product_id: otherscart.product_id,
                    product_name: otherscart.product_name,
                    colors: otherscart.selected_colors,
                    sizes: otherscart.selected_sizes,
                    quantity: otherscart.product_qty,
                    product_actual_price: otherscart.product_actual_price,
                    product_price: otherscart.product_price,
                    total_price: otherscart.total_price,
                    product_notes: otherscart.product_notes || ''
                }))
            });
        }
    }, [othersCartItems, latitude, longitude, totalZMK]);

    // Custom API call hook
    const {
        data: orderResponse,
        isLoading,
        error,
        post: orderProduct
    } = useApi(`/orders/make_order/`);

    // console.log(orderResponse)

    const showToast = (type, title, message, color) => {
        Toast.show({
            type,
            text1: title,
            text2: message,
            visibilityTime: 4000,
            animationType: 'slide',
            position: 'bottom',
            text1Style: {
                color,
                fontSize: 14,
                fontFamily: 'roboto-bold',
            },
            text2Style: {
                color,
                fontSize: 11,
                fontFamily: 'roboto-medium',
            },
        });
    };

    useEffect(() => {
        if (orderResponse?.message) {
            const isSuccess = orderResponse.success;
            const message = 'Order made successfully.'

            if (!isSuccess) {
                showToast('error', 'Update Failed', orderResponse.message, 'red');
            } else {
                showToast('success', 'Order Successful', message, '#32CD32');
                setIsRedirecting(true);
                setTimeout(() => onClose(), 5000);
            }
        }
    }, [orderResponse]);

    const handlePlaceOrder = async () => {
        if (othersCartItems.length === 0 || !orderdata) return;
        orderProduct({
            orderdata
        });
    };

    const handleClearCart = () => dispatch(clearOthersCart());

    // Optimize FlatList rendering
    const renderItem = useCallback(({ item }) => <OthersCartData item={item} />, []);

    return (
        <View className="flex-1 bg-white justify-center items-center">
            <FlatList
                data={othersCartItems}
                keyExtractor={(item) => item.product_id}
                contentContainerStyle={{ flexGrow: 1 }}
                renderItem={renderItem}
                initialNumToRender={10}
                
                ListHeaderComponent={() =>
                    othersCartItems.length > 0 && (
                        <View>
                            <View className='w-full mt-3 mb-5 items-center justify-start'>
                                <Text className='text-slate text-base' style={{fontFamily: 'roboto-medium'}}>You have {othersCartItems.length} items in your cart</Text>
                            </View>
                            <TouchableOpacity
                                onPress={handleClearCart}
                                className='p-3 justify-end flex-row items-center rounded w-full mb-4 font-maven'
                            >
                                <Text className='text-red'>Remove all</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }

                ListFooterComponent={() =>
                    othersCartItems.length > 0 && (
                        <>
                            <View className="flex-row items-center justify-between my-5">
                                <Text className="text-2xl" style={{ fontFamily: 'ubuntu-medium' }}>Cart Total:</Text>
                                <View
                                    className="bg-red items-center justify-center"
                                    style={{ padding: 5, borderRadius: SIZES.radius, width: buttonWidth, height: height * 0.06 }}
                                >
                                    <Text style={{ fontFamily: 'ubuntu-medium' }} className="text-2xl text-white">
                                        ZMK {totalZMK.toLocaleString()}
                                    </Text>
                                </View>
                            </View>
                            <View className="mb-20" />
                        </>
                    )
                }

                ListEmptyComponent={() => (
                    <View className="flex-1 justify-center items-center relative">
                        <View className="absolute bg-red justify-center items-center rounded-full" style={{ height: 27, width: 27 }}>
                            <Text className="text-white text-sm">0</Text>
                        </View>
                        <EmptyState
                            icon={<Ionicons size={80} name="bag-outline" color={COLORS.slate} />}
                            description="Your general cart is empty"
                        />
                    </View>
                )}
                showsVerticalScrollIndicator={false}
            />

            {othersCartItems.length > 0 && (
                <OrderBtn
                    handlePlaceOrder={handlePlaceOrder}
                    router={router}
                    title="Order Now"
                    order_qty={othersCartItems.length}
                    order_total={totalZMK.toLocaleString()}
                />
            )}
        </View>
    );
};

export default OtherProductsTab;
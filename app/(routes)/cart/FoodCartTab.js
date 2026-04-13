import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CartData from "../../../components/cart/CartData";
import OrderBtn from "../../../components/cart/OrderBtn";
import DeliveryOptions from "../../../components/DeliveryOptions";
import EmptyState from "../../../components/EmptyState";
import { COLORS, SIZES } from "../../../constants/constants";
import useApi from "../../../hook/useApi";
import { clearCart } from "../../../redux/store/slices/CartSlice";
import { toast } from "../../../utils/toast";

const FoodCartTab = () => {
    const [delivery, setSelected] = useState(null);
    const { user_id } = useSelector((state) => state.auth);
    const { latitude, longitude } = useSelector((state) => state.location);
    const cartItems = useSelector((state) => state.cart.cartItems);

    const router = useRouter();
    const dispatch = useDispatch();

    const origin = useMemo(() => {
        if (latitude == null || longitude == null) return null;

        return {
            latitude: Number(latitude.toFixed(5)),
            longitude: Number(longitude.toFixed(5))
        };
    }, [latitude, longitude]);

    const destination = useMemo(() => ({
            latitude: cartItems[0]?.store_latitude,
            longitude: cartItems[0]?.store_longitude
        }), [cartItems[0]?.store_latitude, cartItems[0]?.store_longitude]
    );

    const { width, height } = Dimensions.get("window");
    const buttonWidth = width * 0.4;

    // Calculate cart total using useMemo for optimization
    const itemsTotal = useMemo(() => {
        return cartItems.reduce((total, item) => {
            return total + Number(item.total_price || 0);
        }, 0);
    }, [cartItems]);

    const deliveryFee = useMemo(() => {
        return Number(delivery?.fee ?? 0);
    }, [delivery]);

    const totalZMK = useMemo(() => {
        return Number((itemsTotal + deliveryFee).toFixed(2));
    }, [itemsTotal, deliveryFee]);

    // Build order data
    const orderdata = useMemo(() => {
        if (!delivery || cartItems.length === 0 || !user_id) return null;
        return {
            user_id,
            store_id: cartItems[0]?.store_id || "",
            store_name: cartItems[0]?.store_name || "",
            store_category: cartItems[0]?.store_category || "",
            store_phone_num: cartItems[0]?.store_phone_num || "",
            store_province: cartItems[0]?.store_province || "",
            order_area: cartItems[0]?.city_town || "",
            open_time: cartItems[0]?.opentime || "",
            closing_time: cartItems[0]?.closing_time || "",
            store_latitude: cartItems[0]?.store_latitude || 0.0,
            store_longitude: cartItems[0]?.store_longitude || 0.0,
            user_latitude: latitude || 0.0,
            user_longitude: longitude || 0.0,
            cart_qty: cartItems.length,
            order_total_price: itemsTotal,
            order_type: 1,
            delivery_fee: Number(deliveryFee ?? 0),
            delivery_mode: delivery.mode ?? 'Motor-Bike',
            cart_items: cartItems.map((cart) => ({
                product_id: cart.product_id,
                product_name: cart.product_name,
                quantity: cart.product_qty,
                extras: cart.selected_extras,
                chilioption: cart.chilioption,
                total_price: cart.total_price,
                product_actual_price: cart.product_actual_price,
                product_price: cart.product_price,
            })),
        };
    }, [cartItems, latitude, longitude, itemsTotal, user_id, deliveryFee]);

    // API hook
    const {
        data: orderResponse,
        isLoading,
        error,
        post: makeorder,
    } = useApi(`/orders/make_order/`);

    const handlePlaceOrder = async () => {
        if (!orderdata) return;

        if (!orderdata || !delivery) {
            toast.error("Please select a delivery option");
            return;
        }

        try {
            await makeorder(orderdata);
        } catch (err) {
            console.error("Order Error:", err);
            toast.success("Something went wrong");
        }
    };

    const handleClearCart = () =>
        dispatch(clearCart(), toast.success("Cart cleared successfully"));

    // Handle order response
    useEffect(() => {
        if (!orderResponse) return;

        if (orderResponse.success) {
            const orderMsg = `${orderResponse.message} (Order #${orderResponse.order_number})`;
            toast.success(orderMsg || "Order placed succesfully");

            setTimeout(() => {
                dispatch(clearCart());
                router.push("/orders");
            }, 2000);
        } else {
            toast.error(orderResponse.message || "Unknown error");
        }
    }, [orderResponse]);

    const CartFooter = useMemo(() => {
        if (cartItems.length === 0) return null;
        return (
            <>
                <View className='flex-row justify-center items-center mt-5 mb-3'>
                    <Text className='text-lg text-green1' style={{fontFamily: 'roboto-medium'}}>
                        Cart Total: K{itemsTotal}
                    </Text>
                    <Text className='mx-3 text-slate text-2xl'>|</Text>
                    <Text className='text-lg text-primary' style={{fontFamily: 'roboto-medium'}}>
                        Delivery Fee: K{deliveryFee}
                    </Text>
                </View>
                <View className="flex-row items-center justify-between mb-5">
                    <Text
                        className="text-2xl"
                        style={{ fontFamily: "ubuntu-medium" }}
                    >
                        Grand Total:
                    </Text>
                    <View
                        className="bg-red items-center justify-center"
                        style={{
                            padding: 4,
                            borderRadius: SIZES.radius,
                            width: buttonWidth,
                            height: height * 0.06,
                        }}
                    >
                        <Text
                            style={{ fontFamily: "ubuntu-medium" }}
                            className="text-xl text-white"
                        >
                            ZMK {totalZMK.toLocaleString()}
                        </Text>
                    </View>
                </View>

                <View className="w-full my-6">
                    <Text className="text-black text-lg" style={{ fontFamily: 'roboto-bold' }}>
                        Delivery Options
                    </Text>

                    {!delivery && (
                        <Text className="text-slate text-sm my-2" style={{ fontFamily: 'roboto-medium' }}>
                            Calculating delivery options…
                        </Text>
                    )}

                    <DeliveryOptions
                        origin={origin}
                        destination={destination}
                        onSelectMode={setSelected}
                    />

                    {delivery && (
                        <Text>
                            Selected: {delivery.mode} - K{delivery.fee}
                        </Text>
                    )}
                </View>
                <View className="mb-20" />
            </>
        );
    }, [cartItems.length, origin, destination, delivery]);

    return (
        <View className="flex-1 bg-white justify-center items-center">
            {isLoading && (
                <View className="flex-1 bg-white justify-center items-center w-full h-full absolute z-50">
                    <View className="left-0 right-0 top-0 bottom-0 justify-center items-center w-full px-4">
                        <View className="flex-row justify-center items-center self-center bg-grey_bg w-full py-4 rounded-md">
                            <ActivityIndicator size={50} color={COLORS.primary} />
                            <Text
                                className="ml-2 text-lg"
                                style={{ fontFamily: "roboto-medium" }}
                            >
                                Placing order...
                            </Text>
                        </View>
                    </View>
                </View>
            )}

            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.product_id.toString()}
                contentContainerStyle={{ flexGrow: 1 }}
                renderItem={({ item }) => <CartData item={item} />}
                ListHeaderComponent={() =>
                    cartItems.length > 0 && (
                        <View>
                            <View className="w-full mt-3 mb-5 items-center">
                                <Text
                                    className="text-slate text-base"
                                    style={{ fontFamily: "roboto-medium" }}
                                >
                                    You have {cartItems.length} items in your cart
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={handleClearCart}
                                className="p-3 justify-end flex-row items-center rounded w-full mb-4"
                            >
                                <Text className="text-red">Remove all</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
                ListFooterComponent={CartFooter}
                ListEmptyComponent={() => (
                    <View className="flex-1 justify-center items-center relative">
                        <View
                            className="absolute bg-red justify-center items-center rounded-full"
                            style={{ height: 27, width: 27 }}
                        >
                            <Text className="text-white text-lg">0</Text>
                        </View>
                        <EmptyState
                            icon={
                                <Ionicons size={80} name="bag-outline" color={COLORS.slate} />
                            }
                            description="Your food cart is empty"
                        />
                    </View>
                )}
                showsVerticalScrollIndicator={false}
            />

            {cartItems.length > 0 && (
                <OrderBtn
                    order_qty={cartItems.length}
                    order_total={totalZMK.toLocaleString()}
                    handlePlaceOrder={handlePlaceOrder}
                    router={router}
                    title={isLoading ? "Please wait" : "Order Now"}
                    disable={isLoading || !delivery ? true : false}
                />
            )}
        </View>
    );
};

export default FoodCartTab;
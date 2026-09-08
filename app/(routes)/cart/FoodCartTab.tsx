import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    SectionList,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import CartData from "../../../components/cart/CartData";
import LogingBtn from "../../../components/cart/LogingBtn";
import OrderBtn from "../../../components/cart/OrderBtn";
import DeliveryOptions from "../../../components/DeliveryOptions";
import EmptyState from "../../../components/EmptyState";

import { COLORS, SIZES } from "../../../constants/constants";
import useApi from "../../../hook/useApi";
import { clearCart } from "../../../redux/store/slices/CartSlices";
import { calculateItemTotal } from "../../../utils/calculateItemTotal";
import { toast } from "../../../utils/toast";

interface CartItem {
    cart_id: string;
    product_id: string;
    product_name: string;
    product_qty: number;
    product_price: number;
    final_price: number;
    selected_variants: unknown;
    product_notes?: string;

    store_id: string;
    business_id: string;
    store_name: string;
    store_category: string;
    store_phone_num: string;
    store_province: string;
    store_location: string;
    opentime: string;
    closing_time: string;
    store_latitude: number;
    store_longitude: number;
}

interface Delivery {
    fee: number;
    mode: string;
}

interface LocationState {
    latitude: number | null;
    longitude: number | null;
}

interface AuthState {
    user_id: string | null;
    isAuthenticated: boolean;
}

interface RootState {
    auth: AuthState;
    location: LocationState;
    cart: {
        cartItems: CartItem[];
    };
}

interface StoreGroup {
    store_id: string;
    business_id: string;
    store_name: string;
    store_category: string;
    store_phone_num: string;
    store_province: string;
    store_location: string;
    opentime: string;
    closing_time: string;
    store_latitude: number;
    store_longitude: number;
    items: CartItem[];
}

interface CartSection {
    store_id: string;
    store_name: string;
    data: CartItem[];
    itemSubtotal: number;
    itemCount: number;
}

interface OrderItem {
    product_id: string;
    product_name: string;
    variants: unknown;
    quantity: number;
    product_price: number;
    final_price: number;
    total_price: number;
    product_notes: string;
}

interface OrderStore {
    store_id: string;
    business_id: string;
    store_name: string;
    store_category: string;
    store_phone_num: string;
    store_province: string;
    store_location: string;
    open_time: string;
    closing_time: string;
    store_latitude: number;
    store_longitude: number;
    runner_active: boolean;
    shipping_fee: number;
    shipping_mode: string;
    runner_fee: number;
    items: OrderItem[];
}

interface OrderData {
    user_id: string | null;
    order_type: "Food";
    user_latitude: number;
    user_longitude: number;
    cart_qty: number;
    order_total_price: number;
    runner_data: null;
    stores: OrderStore[];
}

interface OrderResponse {
    success: boolean;
    message?: string;
    order_number?: string | number;
}

const FoodCartTab = () => {
    /*
    |--------------------------------------------------------------------------
    | Redux
    |--------------------------------------------------------------------------
    */

    const dispatch = useDispatch();
    const router = useRouter();

    const { user_id } = useSelector(
        (state: RootState) => state.auth
    );

    const isAuthenticated = useSelector(
        (state: RootState) => state.auth.isAuthenticated
    );

    const { latitude, longitude } = useSelector(
        (state: RootState) => state.location
    );

    const cartItems = useSelector(
        (state: RootState) => state.cart.cartItems
    );

    /*
    |--------------------------------------------------------------------------
    | Local State
    |--------------------------------------------------------------------------
    */

    const [delivery, setSelected] = useState<Delivery | null>(null);

    /*
    |--------------------------------------------------------------------------
    | Screen Dimensions
    |--------------------------------------------------------------------------
    */

    const { width, height } = Dimensions.get("window");

    const buttonWidth = width * 0.4;

    /*
    |--------------------------------------------------------------------------
    | Login
    |--------------------------------------------------------------------------
    */

    const handleLogin = () => {
        router.push("/(auth)/login");
    };

    /*
    |--------------------------------------------------------------------------
    | Delivery Origin
    |--------------------------------------------------------------------------
    */

    const origin = useMemo(() => {
        if (latitude == null || longitude == null) {
            return null;
        }

        return {
            latitude: Number(latitude.toFixed(5)),
            longitude: Number(longitude.toFixed(5))
        };
    }, [latitude, longitude]);

    /*
    |--------------------------------------------------------------------------
    | Delivery Destination
    |--------------------------------------------------------------------------
    |
    | Destination is the store location.
    |
    */

    const destination = useMemo(() => {
        if (!cartItems.length) {
            return null;
        }

        return {
            latitude: cartItems[0]?.store_latitude,
            longitude: cartItems[0]?.store_longitude
        };
    }, [cartItems]);

    /*
    |--------------------------------------------------------------------------
    | Delivery Fee
    |--------------------------------------------------------------------------
    */

    const deliveryFee = useMemo(
        () => Number(delivery?.fee ?? 0),
        [delivery]
    );

    /*
    |--------------------------------------------------------------------------
    | Items Total
    |--------------------------------------------------------------------------
    */

    const itemsTotal = useMemo(
        () => cartItems.reduce(
            (sum, item) => sum + calculateItemTotal(item),
            0
        ),
        [cartItems]
    );

    /*
    |--------------------------------------------------------------------------
    | Grand Total
    |--------------------------------------------------------------------------
    */

    const totalZMK = useMemo(
        () => itemsTotal + deliveryFee,
        [itemsTotal, deliveryFee]
    );

    /*
    |--------------------------------------------------------------------------
    | Total Quantity
    |--------------------------------------------------------------------------
    |
    | Example:
    |
    | Chicken × 2
    | Burger × 3
    |
    | cartItems.length = 2
    | totalItems = 5
    |
    */

    const totalItems = useMemo(
        () => cartItems.reduce(
            (sum, item) => sum + Number(item.product_qty || 0), 0
        ), [cartItems]
    );

    /*
    |--------------------------------------------------------------------------
    | Store Count
    |--------------------------------------------------------------------------
    */

    const storeCount = useMemo(
        () => new Set(
            cartItems.map((item) => item.store_id)
        ).size, [cartItems]
    );

    /*
    |--------------------------------------------------------------------------
    | Group Cart Items By Store
    |--------------------------------------------------------------------------
    */

    const storesArray = useMemo<StoreGroup[]>(() => {
        const groupedByStore = cartItems.reduce(
            (acc: Record<string, StoreGroup>, item) => {
                const storeId = item.store_id;

                if (!acc[storeId]) {
                    acc[storeId] = {
                        store_id: storeId,
                        business_id: item.business_id,
                        store_name: item.store_name,
                        store_category: item.store_category,
                        store_phone_num: item.store_phone_num,
                        store_province: item.store_province,
                        store_location: item.store_location,
                        opentime: item.opentime,
                        closing_time: item.closing_time,
                        store_latitude: item.store_latitude,
                        store_longitude: item.store_longitude,
                        items: []
                    };
                }

                acc[storeId].items.push(item);
                return acc;
            }, {}
        );

        return Object.values(groupedByStore);
    }, [cartItems]);

    /*
    |--------------------------------------------------------------------------
    | Order Data
    |--------------------------------------------------------------------------
    */

    const orderData = useMemo<OrderData | null>(() => {
        if (!cartItems.length) {
            return null;
        }

        return {
            user_id,
            order_type: "Food",
            user_latitude: latitude ?? 0.0,
            user_longitude: longitude ?? 0.0,

            /*
             * Total quantity of products.
             */
            cart_qty: totalItems,

            order_total_price: totalZMK,
            runner_data: null,

            stores: storesArray.map((store) => ({
                store_id: store.store_id,
                business_id: store.business_id,
                store_name: store.store_name,
                store_category: store.store_category,
                store_phone_num: store.store_phone_num,
                store_province: store.store_province,
                store_location: store.store_location,
                open_time: store.opentime,
                closing_time: store.closing_time,
                store_latitude: store.store_latitude ?? 0.0,
                store_longitude: store.store_longitude ?? 0.0,
                runner_active: false,
                shipping_fee: Number(deliveryFee ?? 0),
                shipping_mode: delivery?.mode ?? "Motor-Bike",
                runner_fee: 0,

                items: store.items.map((item) => ({
                    product_id: item.product_id,
                    product_name: item.product_name,

                    /*
                     * Variants now contain
                     * both normal variants
                     * and extras.
                     */
                    variants: item.selected_variants,

                    quantity: item.product_qty,
                    product_price: item.product_price,
                    final_price: item.final_price,
                    total_price: calculateItemTotal(item),
                    product_notes: item.product_notes || ""
                }))
            }))
        };
    }, [
        cartItems,
        latitude,
        longitude,
        user_id,
        totalItems,
        totalZMK,
        storesArray,
        delivery,
        deliveryFee
    ]);

    /*
    |--------------------------------------------------------------------------
    | Sections For SectionList
    |--------------------------------------------------------------------------
    */

    const sections = useMemo<CartSection[]>(() => {
        const grouped = cartItems.reduce(
            (acc: Record<string, CartSection>, item) => {
                if (!acc[item.store_id]) {
                    acc[item.store_id] = {
                        store_id: item.store_id,
                        store_name: item.store_name,
                        data: [],
                        itemSubtotal: 0,
                        itemCount: 0
                    };
                }

                acc[item.store_id].data.push(item);

                acc[item.store_id].itemSubtotal +=
                    calculateItemTotal(item);

                acc[item.store_id].itemCount +=
                    Number(item.product_qty || 0);

                return acc;
            }, {}
        );

        return Object.values(grouped);
    }, [cartItems]);

    /*
    |--------------------------------------------------------------------------
    | API
    |--------------------------------------------------------------------------
    */

    const {
        data: orderResponse,
        isLoading,
        error,
        post: makeorder
    } = useApi("/orders/make_order");

    /*
    |--------------------------------------------------------------------------
    | Place Order
    |--------------------------------------------------------------------------
    */

    const handlePlaceOrder = async () => {
        if (!orderData) return;

        if (!delivery) {
            toast.error("Please select a delivery option");
            return;
        }

        try {
            await makeorder(orderData);
        } catch (err) {
            console.error("Order Error:", err);
            toast.error("Something went wrong");
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Clear Cart
    |--------------------------------------------------------------------------
    */

    const handleClearCart = () => {
        dispatch(clearCart());
        toast.success("Cart cleared successfully");
    };

    /*
    |--------------------------------------------------------------------------
    | Order Response
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!orderResponse) return;

        const response = orderResponse as OrderResponse;

        if (response.success) {
            const orderMsg =
                `${response.message} (Order #${response.order_number})`;

            toast.success(orderMsg || "Order placed successfully");

            setTimeout(() => {
                dispatch(clearCart());
                router.push("/orders");
            }, 2000);
        } else {
            toast.error(response.message || "Unknown error");
        }
    }, [orderResponse, dispatch, router]);

    /*
    |--------------------------------------------------------------------------
    | Cart Footer
    |--------------------------------------------------------------------------
    */

    const CartFooter = useMemo(() => {
        if (!cartItems.length) {
            return null;
        }

        return (
            <>
                {/* Cart Total + Delivery Fee */}
                <View className="flex-row justify-center items-center mt-5 mb-3">
                    <Text
                        className="text-base text-green1"
                        style={{ fontFamily: "roboto-medium" }}
                    >
                        Cart Total: K{itemsTotal.toLocaleString()}
                    </Text>

                    <Text className="mx-3 text-slate text-2xl">
                        |
                    </Text>

                    <Text
                        className="text-base text-primary"
                        style={{ fontFamily: "roboto-medium" }}
                    >
                        Delivery Fee: K{deliveryFee.toLocaleString()}
                    </Text>
                </View>

                {/* Grand Total */}
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
                            height: height * 0.06
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

                {/* Delivery Options */}
                <View className="w-full my-6">
                    <Text
                        className="text-black text-lg"
                        style={{ fontFamily: "roboto-bold" }}
                    >
                        Delivery Options
                    </Text>

                    {!delivery && (
                        <Text
                            className="text-slate text-sm my-2"
                            style={{ fontFamily: "roboto-medium" }}
                        >
                            Checking available delivery options…
                        </Text>
                    )}

                    <DeliveryOptions
                        origin={origin}
                        destination={destination}
                        onSelectMode={setSelected}
                    />

                    {delivery && (
                        <Text
                            className="text-slate mt-2"
                            style={{ fontFamily: "roboto-medium" }}
                        >
                            Selected: {delivery.mode} - K{delivery.fee}
                        </Text>
                    )}
                </View>
            </>
        );
    }, [
        cartItems.length,
        origin,
        destination,
        delivery,
        itemsTotal,
        deliveryFee,
        totalZMK,
        buttonWidth,
        height
    ]);

    /*
    |--------------------------------------------------------------------------
    | SectionList Item
    |--------------------------------------------------------------------------
    */

    const renderItem = useCallback(
        ({ item }: { item: CartItem }) => (
            <CartData item={item} />
        ), []
    );

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <View className="flex-1 bg-white justify-center items-center">
            {/* ------------------------------------------------------------ */}
            {/* Loading Overlay */}
            {/* ------------------------------------------------------------ */}
            {isLoading && (
                <View className="flex-1 bg-white justify-center items-center w-full h-full absolute z-50">
                    <View className="left-0 right-0 top-0 bottom-0 justify-center items-center w-full px-4">
                        <View className="flex-row justify-center items-center self-center bg-grey_bg w-full py-4 rounded-md">
                            <ActivityIndicator
                                size={50}
                                color={COLORS.primary}
                            />

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

            {/* ------------------------------------------------------------ */}
            {/* Cart */}
            {/* ------------------------------------------------------------ */}
            <SectionList<CartItem, CartSection>
                sections={sections}
                keyExtractor={(item, index) =>
                    `${item.cart_id}-${index}`
                }
                renderSectionHeader={({ section }) => (
                    <View className="flex-row bg-gray-100 p-1 mb-1 justify-between items-center">
                        <Text
                            className="text-lg"
                            style={{ fontFamily: "roboto-bold" }}
                        >
                            {section.store_name}
                        </Text>

                        <Text className="text-sm text-slate">
                            {section.itemCount} item
                            {section.itemCount !== 1 ? "s" : ""}
                        </Text>
                    </View>
                )}
                renderItem={renderItem}
                ListHeaderComponent={() =>
                    cartItems.length > 0 && (
                        <View>
                            <View className="w-full mt-3 mb-5 items-center justify-start bg-gray-100 rounded p-2">
                                <Text
                                    className="text-black text-base"
                                    style={{
                                        fontFamily: "roboto-medium"
                                    }}
                                >
                                    You have {cartItems.length} item
                                    {cartItems.length !== 1
                                        ? "s"
                                        : ""}{" "}
                                    from {storeCount}{" "}
                                    {storeCount > 1
                                        ? "different "
                                        : ""}
                                    store
                                    {storeCount !== 1
                                        ? "s"
                                        : ""}{" "}
                                    in your food cart.
                                </Text>
                            </View>

                            {/* Remove All */}
                            <View className="flex-row w-full justify-end items-center mb-4">
                                <TouchableOpacity
                                    onPress={handleClearCart}
                                    className="p-1 justify-center flex-row items-center elevation-sm border border-white rounded bg-red"
                                >
                                    <FontAwesome5
                                        name="trash"
                                        color="white"
                                        size={13}
                                    />

                                    <Text
                                        style={{
                                            fontFamily: "roboto"
                                        }}
                                        className="text-white ml-1"
                                    >
                                        Remove all
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }
                ListFooterComponent={
                    <>
                        {CartFooter}

                        {!isAuthenticated && (
                            <View className="mb-4 w-full bg-[#FEF2F2] px-1 py-3 rounded justify-center items-center">
                                <Text
                                    className="text-base text-slate"
                                    style={{fontFamily: "roboto-medium"}}
                                >
                                    Please sign in to continue with this order.
                                </Text>
                            </View>
                        )}

                        <View className="mb-20" />
                    </>
                }
                ListEmptyComponent={() => (
                    <View
                        style={{ width: "100%", marginTop: 80 }}
                        className="h-full w-full justify-center items-center"
                    >
                        <View className="flex-1 justify-center items-center relative">
                            <EmptyState
                                icon={
                                    <FontAwesome
                                        name="shopping-cart"
                                        size={40}
                                        color={COLORS.slate}
                                    />
                                }
                                description="Your food cart is empty"
                            />
                        </View>

                        <TouchableOpacity
                            className="bg-primary justify-center items-center elevation-sm border border-white rounded py-3"
                            style={{ width: "100%" }}
                            onPress={() => router.push("../(tabs)/foods")}
                        >
                            <Text
                                className="text-lg text-white"
                                style={{ fontFamily: "roboto-medium" }}
                            >
                                Go shopping
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
            />

            {/* ------------------------------------------------------------ */}
            {/* Bottom Order Button */}
            {/* ------------------------------------------------------------ */}

            {!isAuthenticated ? (
                <LogingBtn
                    handlePress={handleLogin}
                />
            ) : cartItems.length > 0 ? (
                <OrderBtn
                    order_qty={totalItems}
                    order_total={totalZMK.toLocaleString()}
                    handlePlaceOrder={handlePlaceOrder}
                    loading={isLoading}
                    router={router}
                    title={
                        isLoading ? "Please wait" : "Order Now"
                    }
                    disable={isLoading || !delivery}
                />
            ) : null}
        </View>
    );
};

export default FoodCartTab;
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
    Image,
    SectionList,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";

import EmptyState from "../../../../components/EmptyState";
import { COLORS } from "../../../../constants/constants";
import useApi from "../../../../hook/useApi";
import { PRODUCTS_IMAGE_URI } from "../../../../RequestMethods";
import { toast } from "../../../../utils/toast";
import LoadingIndicator from "../../../LoadingIndicator";

const OrdersData = ({ order, store_name, order_type, onPress }) => {
    return (
        <>
            <TouchableOpacity
                onPress={onPress}
                className="flex-row justify-between items-center"
            >
                <View className="flex-row justify-start items-center">
                    <Image
                        source={{
                            uri: `${PRODUCTS_IMAGE_URI}${order.images?.[0]}`,
                        }}
                        style={{ borderRadius: 8 }}
                        className="h-[65px] w-[26%]"
                    />

                    <View className="w-[71.7%] flex-row ml-2 justify-between items-center">
                        <View className="w-full">
                            <Text
                                className="text-lg"
                                style={{ fontFamily: "roboto-medium" }}
                                numberOfLines={1}
                            >
                                {order.product_name}
                            </Text>

                            <View className="flex-row justify-between items-center">
                                <Text
                                    className="text-sm text-slate"
                                    style={{ fontFamily: "roboto-medium" }}
                                >
                                    Price: K{order.final_price}
                                </Text>

                                <Text
                                    className="text-slate text-sm mr-4"
                                    style={{ fontFamily: "roboto-medium" }}
                                >
                                    Qty:{order.quantity}
                                </Text>

                                <Text
                                    className="text-green2 text-sm mr-4"
                                    style={{ fontFamily: "roboto-medium" }}
                                >
                                    Total: K{order.total_price}
                                </Text>
                            </View>

                            <Text
                                numberOfLines={1}
                                className="text-grey text-sm"
                                style={{ fontFamily: "roboto-medium" }}
                            >
                                {order.desc}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

            <View className="bg-grey_bg w-full my-5" style={{ height: 1 }} />
        </>
    );
};

const UserOrdderSingleCard = ({ params, onOrderPress }) => {
    const user_id = params.user_id;
    const router = useRouter();
    const { width } = useWindowDimensions();
    const buttonWidth = width * 0.4;

    const { data, isLoading, get } = useApi(`/orders/${params.order_id}`);

    useEffect(() => {
        get();
    }, []);

    const {
        data: delteOrder,
        error: deleteOrderError,
        isLoading: deleteOrderLoading,
        del: deleteOrderData,
    } = useApi(`/orders/delete/${params.order_id}`);

    const deleteOrder = async () => {
        if (!params.order_id) {
            toast.error("Missing order ID");
            return;
        }

        try {
            await deleteOrderData();
            toast.success("Order removed successfully");
        } catch (error) {
            toast.error("Failed to delete this order");
        }
    };

    if (deleteOrderLoading) {
        return <LoadingIndicator loading_text="Removing order..." />;
    }

    if (isLoading) {
        return <LoadingIndicator loading_text="Loading order items..." />;
    }

    const sections = (data?.stores || []).map((store) => {
        const items = store.items || [];

        const storeTotal = items.reduce(
            (sum, item) => sum + Number(item.total_price || 0),
            0
        );

        const itemCount = items.reduce(
            (sum, item) => sum + Number(item.quantity || 0),
            0
        );

        return {
            title: store.store_name,
            store_id: store.store_id,
            store_phone: store.store_phone,
            status: store.status,
            shipping_fee: store.shipping_fee,
            runner_fee: store.runner_fee,
            discount_amount: store.discount_amount,
            runner_active: store.runner_active,
            shipping_mode: store.shipping_mode,
            store_latitude: store.store_latitude,
            store_longitude: store.store_longitude,
            data: items,
            total: storeTotal,
            itemCount,
        };
    });

    const stores = data?.stores || [];

    const orderSubtotal = stores.reduce(
        (storeSum, store) =>
            storeSum +
            (store.items || []).reduce(
                (itemSum, item) => itemSum + Number(item.total_price || 0),
                0
            ),
        0
    );

    const storeCount = stores.length;

    const totalItems = stores.reduce(
        (storeSum, store) =>
            storeSum +
            (store.items || []).reduce(
                (itemSum, item) => itemSum + Number(item.quantity || 0),
                0
            ),
        0
    );

    const shippingFee = data?.stores?.[0]?.shipping_fee ?? 0;
    const runnerFee = data?.stores?.[0]?.runner_fee ?? 0;
    const runnerActiveFee = data?.stores?.[0]?.runner_active ?? 0;

    const grandTotal =
        Number(orderSubtotal) + Number(runnerFee) + Number(shippingFee);

    const statusColorMap = {
        pending: "bg-rose-700",
        accepted: "bg-violet-500",
        in_progress: "bg-indigo-500",
        completed: "bg-green2",
        cancelled: "bg-red",
    };

    const orderTypeColorMap = {
        Food: "bg-coral",
        Normal: "bg-green1",
        Local_Market: "bg-indigo-500",
    };

    const statusColors = {
        pending: COLORS.red,
        accepted: COLORS.green1,
        processing: COLORS.extra_blue,
        ready: COLORS.coral,
        delayed: COLORS.red,
        cancelled: COLORS.red,
        completed: COLORS.green2,
        in_transit: COLORS.purple,
        returned: COLORS.grey,
    };

    const statusColor = statusColorMap[params.order_status] || "bg-red";
    const typeStatusColor = orderTypeColorMap[params.order_type] || "bg-green2";
    const orderType = `${typeStatusColor} py-2 rounded justify-center items-center`;
    const orderStatusClassName = `${statusColor} py-2 rounded justify-center items-center`;

    return (
        <View className="px-4">
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.order_item_id}
                renderSectionHeader={({ section }) => (
                    <View className="flex-row bg-gray-100 p-1 mb-1 justify-between items-center">
                        <Text
                            className="text-lg"
                            style={{ fontFamily: "roboto-bold" }}
                        >
                            {section.title}
                        </Text>

                        <Text className="text-sm text-slate">
                            {section.itemCount} item
                            {section.itemCount !== 1 ? "s" : ""}
                        </Text>
                    </View>
                )}
                renderItem={({ item, section }) => (
                    <OrdersData
                        order={item}
                        store_name={section.title}
                        order_type={params.order_type}
                        onPress={() => onOrderPress(item, section.title)}
                    />
                )}
                renderSectionFooter={({ section }) => (
                    <View
                        className="flex-row justify-between"
                        style={{ marginTop: -12, marginBottom: 40 }}
                    >
                        <View
                            className="rounded py-1 justify-center items-center"
                            style={{
                                width: buttonWidth,
                                backgroundColor:
                                    statusColors[section?.status] || COLORS.grey,
                            }}
                        >
                            <Text
                                className="text-lg text-white"
                                style={{ fontFamily: "roboto-medium" }}
                            >
                                {section.status?.charAt(0).toUpperCase() +
                                    section.status?.slice(1)}
                            </Text>
                        </View>

                        <View
                            className="bg-grey_bg rounded py-1 justify-center items-center"
                            style={{ width: buttonWidth }}
                        >
                            <Text
                                className="text-lg text-primary"
                                style={{ fontFamily: "ubuntu-medium" }}
                            >
                                Total: K{section.total.toLocaleString()}
                            </Text>
                        </View>
                    </View>
                )}
                ListHeaderComponent={() => (
                    <View className="mt-6">
                        <View className="w-full flex-row justify-between">
                            <View
                                className={orderType}
                                style={{ width: "48%" }}
                            >
                                <Text
                                    className="text-base text-white"
                                    style={{ fontFamily: "roboto-medium" }}
                                >
                                    {params.order_type
                                        ? params.order_type.charAt(0).toUpperCase() +
                                          params.order_type.slice(1)
                                        : ""}
                                </Text>
                            </View>
                        </View>

                        <View className="w-full mt-3 mb-5 items-center justify-start bg-white rounded py-1">
                            <Text
                                className="text-black text-base"
                                style={{ fontFamily: "roboto-medium" }}
                            >
                                You have {totalItems} item
                                {totalItems !== 1 ? "s" : ""} from {storeCount}{" "}
                                store{storeCount !== 1 ? "s" : ""}
                            </Text>
                        </View>
                    </View>
                )}
                ListFooterComponent={() => (
                    <View className="mb-10">
                        {runnerActiveFee === true && (
                            <View
                                style={{
                                    padding: 10,
                                    backgroundColor: "#e8f5e9",
                                    borderRadius: 8,
                                    borderLeftWidth: 1,
                                    borderLeftColor: "#4caf50",
                                }}
                            >
                                <Text
                                    className="text-red"
                                    style={{
                                        fontSize: 16,
                                        fontFamily: "roboto-medium",
                                        marginBottom: 4,
                                    }}
                                >
                                    Runner Active
                                </Text>

                                <Text
                                    className="text-sm"
                                    style={{
                                        fontSize: 14,
                                        color: "#555",
                                        textAlign: "justify",
                                    }}
                                >
                                    This order has an active runner. This means
                                    a runner collects all items from the
                                    respective stores and bundle them into one
                                    delivery.
                                </Text>
                            </View>
                        )}

                        <View
                            className="mt-4 justify-center items-center"
                            style={{
                                padding: 10,
                                backgroundColor: "#f5f5f5",
                                borderRadius: 8,
                            }}
                        >
                            <Text>
                                <Text
                                    className="text-green2 mt-2"
                                    style={{ fontFamily: "roboto-medium" }}
                                >
                                    Order Total:{" "}
                                    <Text className="text-red">
                                        K{Number(orderSubtotal).toLocaleString()}
                                    </Text>
                                </Text>
                            </Text>

                            <View className="flex-row justify-center items-center mt-2">
                                <Text
                                    className="text-green2"
                                    style={{ fontFamily: "roboto-medium" }}
                                >
                                    Runner Fee:{" "}
                                    <Text className="text-red">K{runnerFee}</Text>
                                </Text>

                                <Text style={{ marginHorizontal: 10 }}>|</Text>

                                <Text
                                    className="text-green2"
                                    style={{ fontFamily: "roboto-medium" }}
                                >
                                    Delivery Fee:{" "}
                                    <Text className="text-red">
                                        K{shippingFee}
                                    </Text>
                                </Text>
                            </View>
                        </View>

                        <View
                            className="mt-4 justify-center items-center"
                            style={{
                                padding: 10,
                                backgroundColor: "#f5f5f5",
                                borderRadius: 8,
                            }}
                        >
                            <Text
                                className="text-2xl text-primary"
                                style={{ fontFamily: "maven-medium" }}
                            >
                                Grand Total: K{Number(grandTotal).toLocaleString()}
                            </Text>
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <View
                        style={{ width: "100%", marginTop: 80 }}
                        className="h-full w-full justify-center items-center"
                    >
                        <View className="flex-1 justify-center items-center relative">
                            <EmptyState
                                icon={
                                    <FontAwesome5
                                        name="shopping-cart"
                                        size={40}
                                        color={COLORS.slate}
                                    />
                                }
                                description="Your general cart is empty"
                            />
                        </View>

                        <TouchableOpacity
                            className="bg-primary justify-center items-center elevation-sm border border-white rounded py-3"
                            style={{ width: "100%" }}
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
                contentContainerStyle={{ paddingBottom: 40 }}
            />
        </View>
    );
};

export default UserOrdderSingleCard;
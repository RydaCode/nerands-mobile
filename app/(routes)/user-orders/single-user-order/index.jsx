import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MainHeader from "../../../../components/MainHeader";
import AppModal from "../../../../components/modals/AppModal";
import { COLORS, SIZES } from "../../../../constants/constants";
import { PRODUCTS_IMAGE_URI } from "../../../../RequestMethods";
import UserOrdderSingleCard from "../cards/UserOrdderSingleCard";

const Index = () => {
    const params = useLocalSearchParams();
    const { width, height } = useWindowDimensions();

    const imageWidthModal = width * 0.25;
    const imageHeightModal = height * 0.1;
    const buttonWidth = width * 0.4;

    const [orderFullInfoModalVisible, setOrderFullInfoModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedStoreName, setSelectedStoreName] = useState("");

    const openOrderDetails = (order, storeName) => {
        setSelectedOrder(order);
        setSelectedStoreName(storeName);
        setOrderFullInfoModalVisible(true);
    };

    const closeOrderDetails = (value = false) => {
        setOrderFullInfoModalVisible(value);
        if (!value) {
            setSelectedOrder(null);
            setSelectedStoreName("");
        }
    };

    const variantsArray = selectedOrder
        ? Array.isArray(selectedOrder.variants)
            ? selectedOrder.variants
            : Object.values(selectedOrder.variants || {})
        : [];

    const finalProductPrice = Number(selectedOrder?.final_price || 0);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-4">
                <MainHeader
                    fontFamily="roboto-medium"
                    textStyles="text-2xl"
                    header_name="My Order"
                />
            </View>

            <View className="flex-1">
                <UserOrdderSingleCard
                    params={params}
                    onOrderPress={openOrderDetails}
                />
            </View>

            {orderFullInfoModalVisible && selectedOrder && (
                <View
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 9999,
                        elevation: 9999,
                    }}
                >
                    <AppModal
                        visible={orderFullInfoModalVisible}
                        onClose={() => closeOrderDetails(false)}
                    >
                        <View>
                            <View className="p-3 flex-row justify-between items-center">
                                <View className="flex-row justify-center items-center">
                                    <Text
                                        className="text-2xl ml-1"
                                        style={{ fontFamily: "outfit-medium" }}
                                    >
                                        Product Details
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    onPress={() => closeOrderDetails(false)}
                                    className="h-[30px] w-[30px] rounded-full justify-center items-center bg-grey_bg"
                                >
                                    <FontAwesome5
                                        name="times"
                                        color={COLORS.red}
                                        size={15}
                                    />
                                </TouchableOpacity>
                            </View>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                style={{ maxHeight: '93%', paddingBottom: 30 }}
                            >
                                <View
                                    className="bg-white w-full p-3"
                                    style={{
                                        borderRadius: SIZES.border,
                                    }}
                                >
                                    <View className="flex-row mb-4">
                                        <View
                                            className="relative"
                                            style={{
                                                width: imageWidthModal,
                                                height: imageHeightModal,
                                            }}
                                        >
                                            <Image
                                                className="w-full h-full"
                                                source={{
                                                    uri: `${PRODUCTS_IMAGE_URI}${selectedOrder.images?.[0]}`,
                                                }}
                                                style={{
                                                    borderRadius: SIZES.radius,
                                                    resizeMode: "cover",
                                                }}
                                            />
                                        </View>

                                        <View className="justify-center ml-[10px]">
                                            <Text
                                                className="text-base"
                                                style={{ fontFamily: "roboto-medium" }}
                                            >
                                                {selectedOrder.product_name}
                                            </Text>

                                            <Text
                                                className="text-red text-base"
                                                style={{ fontFamily: "roboto-medium" }}
                                            >
                                                K{finalProductPrice.toLocaleString()}
                                            </Text>

                                            <Text
                                                className="text-slate text-sm"
                                                style={{ fontFamily: "roboto-medium" }}
                                            >
                                                {selectedStoreName}
                                            </Text>
                                        </View>
                                    </View>

                                    {selectedOrder.notes && (
                                        <Text
                                            className="text-ms text-slate mb-4"
                                            style={{ fontFamily: "roboto-medium" }}
                                        >
                                            {selectedOrder.notes}
                                        </Text>
                                    )}

                                    <View className="flex-row justify-between items-center">
                                        <Text
                                            className="text-2xl"
                                            style={{ fontFamily: "ubuntu-medium" }}
                                        >
                                            Qty
                                        </Text>
                                        <Text
                                            className="text-2xl"
                                            style={{ fontFamily: "ubuntu-medium" }}
                                        >
                                            {selectedOrder.quantity}
                                        </Text>
                                    </View>

                                    <View className="w-full bg-lavender my-6" style={{ height: 1 }} />

                                    {variantsArray.map((group, index) => (
                                        <View key={group.group_id || index} className="mb-5">
                                            <Text
                                                style={{
                                                    fontFamily: "roboto-bold",
                                                    fontSize: 15,
                                                    marginBottom: 5,
                                                }}
                                            >
                                                {group.group_name}
                                            </Text>

                                            {Array.isArray(group.options) &&
                                                group.options.map((option) => (
                                                    <View
                                                        key={option.option_id}
                                                        className="flex-row justify-between items-center mb-2"
                                                    >
                                                        <View className="flex-row items-center">
                                                            <MaterialCommunityIcons
                                                                name="checkbox-marked"
                                                                size={27}
                                                                color={COLORS.primary}
                                                            />
                                                            <Text
                                                                style={{
                                                                    marginLeft: 4,
                                                                    fontSize: 15,
                                                                    fontFamily: "roboto-medium",
                                                                    color: COLORS.slate,
                                                                }}
                                                            >
                                                                {option.option_name}
                                                            </Text>
                                                        </View>

                                                        <Text
                                                            style={{
                                                                color: Number(option.option_price) > 0 ? COLORS.primary : COLORS.slate,
                                                                fontFamily: "roboto-medium",
                                                                fontSize: 14,
                                                            }}
                                                        >
                                                            {Number(option.option_price) > 0
                                                                ? `K${option.option_price}`
                                                                : "Free"}
                                                        </Text>
                                                    </View>
                                                ))}
                                        </View>
                                    ))}

                                    <View className="flex-row items-center justify-between my-4">
                                        <Text
                                            className="text-2xl"
                                            style={{ fontFamily: "ubuntu-medium" }}
                                        >
                                            Total:
                                        </Text>

                                        <View
                                            className="bg-primary items-center justify-center"
                                            style={{
                                                borderRadius: SIZES.radius,
                                                width: buttonWidth,
                                                height: height * 0.06,
                                            }}
                                        >
                                            <Text
                                                className="text-2xl text-white"
                                                style={{ fontFamily: "ubuntu-medium" }}
                                            >
                                                K{Number(selectedOrder.total_price || 0).toLocaleString()}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </AppModal>
                </View>
            )}
        </SafeAreaView>
    );
};

export default Index;
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { COLORS, SIZES } from '../../../../constants/constants';
import { IMAGE_URI } from '../../../../RequestMethods';

const OrderDetailsModal = ({ visible, order, onClose }) => {
    const { width, height } = useWindowDimensions();

    if (!order) return null;

    const variantsArray = Array.isArray(order?.variants)
        ? order.variants
        : Object.values(order?.variants || {});

    const finalPrice = Number(order?.final_price || 0);

    const totalPrice = Number(
        order?.total_price || finalPrice * Number(order?.quantity || 0)
    );

    return (
        <View className="px-3 pt-2 w-full">
            {/* Header */}
            <View className="flex-row justify-between items-center">
                <Text
                    className="text-2xl"
                    style={{ fontFamily: 'outfit-medium' }}
                >
                    Product Details
                </Text>

                <Pressable
                    onPress={onClose}
                    className="h-[30px] w-[30px] rounded-full justify-center items-center bg-grey_bg"
                >
                    <FontAwesome5
                        name="times"
                        color={COLORS.red}
                        size={15}
                    />
                </Pressable>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 50
                }}
            >
                {/* Product Info */}
                <View className="flex-row mt-3">
                    <Image
                        source={{
                            uri: `${IMAGE_URI}${order?.images?.[0]}`
                        }}
                        style={{
                            width: width * 0.25,
                            height: height * 0.10,
                            borderRadius: SIZES.radius
                        }}
                    />

                    <View className="ml-3 justify-center">
                        <Text
                            className="text-base"
                            style={{
                                fontFamily: 'roboto-medium'
                            }}
                        >
                            {order?.product_name}
                        </Text>

                        <Text
                            className="text-primary text-lg"
                            style={{
                                fontFamily: 'roboto-medium'
                            }}
                        >
                            K{finalPrice.toLocaleString()}
                        </Text>

                        <Text
                            className="text-slate text-sm"
                            style={{
                                fontFamily: 'roboto'
                            }}
                        >
                            From: {order?.store_name}
                        </Text>
                    </View>
                </View>

                {/* Notes */}
                {!!order?.notes && (
                    <Text
                        className="text-slate mt-3"
                        style={{
                            fontFamily: 'roboto-medium'
                        }}
                    >
                        {order.notes}
                    </Text>
                )}

                {/* Quantity */}
                <View className="flex-row w-full justify-between items-center mt-3">
                    <Text
                        className="text-2xl"
                        style={{
                            fontFamily: 'ubuntu-medium'
                        }}
                    >
                        Qty
                    </Text>

                    <Text
                        className="text-2xl"
                        style={{
                            fontFamily: 'ubuntu-medium'
                        }}
                    >
                        {order?.quantity}
                    </Text>
                </View>

                <View
                    style={{ height: 1 }}
                    className="w-full bg-lavender my-4"
                />

                {/* Variants */}
                {variantsArray.length > 0 && (
                    <>
                        <View className="mb-2">
                            <Text
                                className="text-2xl"
                                style={{
                                    fontFamily: 'outfit-medium'
                                }}
                            >
                                Variants
                            </Text>
                        </View>

                        {variantsArray.map((group, index) => (
                            <View
                                key={
                                    group?.group_id || index
                                }
                                className="mb-5"
                            >
                                <Text
                                    style={{
                                        fontFamily: 'roboto-bold',
                                        fontSize: 15,
                                        marginBottom: 5
                                    }}
                                >
                                    {group?.group_name}
                                </Text>

                                {Array.isArray(group?.options) &&
                                    group.options.map(
                                        (option, optionIndex) => (
                                            <View
                                                key={
                                                    option?.option_id ||
                                                    optionIndex
                                                }
                                                className="flex-row justify-between items-center mb-2"
                                            >
                                                <View className="flex-row items-center flex-1">
                                                    <MaterialCommunityIcons
                                                        name="checkbox-marked"
                                                        size={27}
                                                        color={
                                                            COLORS.primary
                                                        }
                                                    />

                                                    <Text
                                                        style={{
                                                            marginLeft: 4,
                                                            fontSize: 15,
                                                            fontFamily:
                                                                'roboto-medium',
                                                            color:
                                                                COLORS.slate
                                                        }}
                                                    >
                                                        {
                                                            option?.option_name
                                                        }
                                                    </Text>
                                                </View>

                                                <Text
                                                    style={{
                                                        color:
                                                            Number(
                                                                option?.option_price
                                                            ) > 0
                                                                ? COLORS.primary
                                                                : COLORS.slate,
                                                        fontFamily:
                                                            'roboto-medium',
                                                        fontSize: 14
                                                    }}
                                                >
                                                    {Number(
                                                        option?.option_price
                                                    ) > 0
                                                        ? `K${Number(
                                                                option.option_price
                                                            ).toLocaleString()}`
                                                        : 'Free'}
                                                </Text>
                                            </View>
                                        )
                                    )}
                            </View>
                        ))}
                    </>
                )}

                {/* Total */}
                <View className="flex-row justify-between items-center mt-4">
                    <Text
                        className="text-2xl"
                        style={{
                            fontFamily: 'ubuntu-medium'
                        }}
                    >
                        Total:
                    </Text>

                    <View className="bg-primary px-5 py-2 rounded">
                        <Text
                            className="text-white text-2xl"
                            style={{
                                fontFamily: 'ubuntu-medium'
                            }}
                        >
                            K{totalPrice.toLocaleString()}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default OrderDetailsModal;
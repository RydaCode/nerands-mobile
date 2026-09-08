import { useEffect } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SIZES } from '../../../../constants/constants';
import { IMAGE_URI } from '../../../../RequestMethods';

const OrdersData = ({ order, onPress, onTotalChange }) => {
    const finalPrice = Number(order?.final_price || 0);
    const totalPrice = Number(
        order?.total_price || finalPrice * Number(order?.quantity || 0)
    );

    useEffect(() => {
        onTotalChange?.(
            order?.order_item_id || order?.product_id,
            totalPrice
        );
    }, [totalPrice, order?.order_item_id, order?.product_id]);

    return (
        <>
            <TouchableOpacity
                onPress={() => onPress?.(order)}
                className="flex-row items-center"
            >
                <Image
                    source={{
                        uri: `${IMAGE_URI}${order?.images?.[0]}`
                    }}
                    style={{
                        width: '24%',
                        height: 60,
                        borderRadius: SIZES.radius
                    }}
                />

                <View className="flex-1 ml-3">
                    <Text className="text-base font-semibold">
                        {order?.product_name}
                    </Text>

                    <View className="flex-row justify-between">
                        <Text
                            className="text-slate text-sm"
                            style={{ fontFamily: 'roboto' }}
                        >
                            Qty: {order?.quantity}
                        </Text>

                        <Text
                            className="text-primary text-sm"
                            style={{ fontFamily: 'roboto-medium' }}
                        >
                            Total: K{totalPrice.toLocaleString()}
                        </Text>
                    </View>

                    <Text
                        numberOfLines={1}
                        className="text-grey text-sm"
                    >
                        {order?.notes}
                    </Text>
                </View>
            </TouchableOpacity>

            <View
                className="bg-lavender my-4"
                style={{ height: 1 }}
            />
        </>
    );
};

export default OrdersData;
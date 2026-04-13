import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons'
import { useState } from 'react'
import { Image, Modal, Pressable, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { COLORS, SIZES } from '../../../../constants/constants'
import { PRODUCTS_IMAGE_URI } from '../../../../RequestMethods'
import ExtraCheckbox from '../../../screens/StoreSingleScreen/ExtraCheckbox '

const OrdersData = ({ order }) => {
    const { width, height } = useWindowDimensions();
    const [orderFullInfoModalVisible, setOrderFullInfoModalVisible] = useState(false);
    const extras = order.extras || [];

    return (
        <>
            {/* Modal */}
            <Modal
                animationType="slide"
                transparent
                statusBarTranslucent
                visible={orderFullInfoModalVisible}
                onRequestClose={() => setOrderFullInfoModalVisible(false)}
            >
                <Pressable 
                    style={{ flex: 1, backgroundColor: COLORS.transparentBlack }} 
                    onPress={() => setOrderFullInfoModalVisible(false)} 
                />
                <View className="p-3 bg-white rounded-t-2xl" style={{ maxHeight: height * 0.8 }}>
                    {/* Header */}
                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                            <FontAwesome6 name="edit" size={20} />
                            <Text className="ml-2 text-xl font-bold">Product Details</Text>
                        </View>
                        <Pressable
                            onPress={() => setOrderFullInfoModalVisible(false)}
                            className="h-[30px] w-[30px] rounded-full justify-center items-center bg-red"
                        >
                            <FontAwesome5 name="times" color={COLORS.white} size={15} />
                        </Pressable>
                    </View>

                    {/* Product Info */}
                    <View className="flex-row mt-3">
                        <Image
                            source={{ uri: `${PRODUCTS_IMAGE_URI}${order.product_images}` }}
                            style={{ width: width * 0.30, height: height * 0.12, borderRadius: SIZES.radius }}
                        />
                        <View className="ml-3 justify-center">
                            <Text className="text-lg font-semibold">{order.product_name}</Text>
                            <Text className="text-red text-lg">ZMK {order.product_actual_price}</Text>
                            <Text className="text-slate text-sm">From: {order.store_name}</Text>
                        </View>
                    </View>

                    <Text className="text-slate mt-3">{order.desc}</Text>

                    {/* Extras */}
                    <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: height * 0.3 }}>
                        {order.chili_option && (
                            <ExtraCheckbox label="Chilli" price={0} checked />
                        )}
                            {extras.map(extra => (
                            <ExtraCheckbox
                                key={extra.extra_id}
                                label={extra.extra_name}
                                price={extra.extra_price}
                                checked
                            />
                        ))}
                    </ScrollView>

                    {/* Total */}
                    <View className="flex-row justify-between items-center mt-4">
                        <Text className="text-xl font-bold">Total:</Text>
                        <View className="bg-primary px-4 py-2 rounded-lg">
                            <Text className="text-white text-lg">ZMK {order.total_price}</Text>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Summary Card */}
            <TouchableOpacity 
                onPress={() => setOrderFullInfoModalVisible(true)} 
                className="flex-row items-center"
            >
                <Image
                    source={{ uri: `${PRODUCTS_IMAGE_URI}${order.product_images}` }}
                    style={{ width: '24%', height: 60, borderRadius: SIZES.radius }}
                />
                <View className="flex-1 ml-3">
                    <Text className="text-base font-semibold">{order.product_name}</Text>
                    <View className="flex-row justify-between">
                        <Text className="text-slate text-sm" style={{fontFamily: 'roboto'}}>Price: K{order.product_actual_price}</Text>
                        <Text className="text-slate text-sm" style={{fontFamily: 'roboto'}}>Qty: {order.quantity}</Text>
                        <Text className="text-primary text-sm" style={{fontFamily: 'roboto-medium'}}>Total: K{order.product_actual_price * order.quantity}</Text>
                    </View>
                    <Text numberOfLines={1} className="text-grey text-sm">{order.desc}</Text>
                </View>
            </TouchableOpacity>
            <View className='bg-lavender my-4' style={{height: 1}}/>
        </>
    );
};

export default OrdersData;
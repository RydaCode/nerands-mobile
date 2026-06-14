import { FontAwesome5, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons'
import { MotiView } from 'moti'
import { useEffect, useState } from 'react'
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { COLORS, SIZES } from '../../../../constants/constants'
import { PRODUCTS_IMAGE_URI } from '../../../../RequestMethods'

const OrdersData = ({ order, summary, order_type, onTotalChange }) => {
    const { width, height } = useWindowDimensions();
    const [orderFullInfoModalVisible, setOrderFullInfoModalVisible] = useState(false);
    const extras = order.extras || [];

    const variantsArray = Object.values(order.variants || {});

    const variantsTotal = variantsArray.reduce((total, item) => {
        // FOOD VARIANTS
        if (item.price) {
            return total + Number(item.price || 0);
        }

        // GENERAL VARIANTS
        if (item.options) {
            const optionsTotal = item.options.reduce(
                (sum, option) => sum + Number(option.price || 0),
                0
            );
            return total + optionsTotal;
        }

        return total;
    }, 0);

    const extrasTotal = extras.reduce(
        (sum, extra) => sum + Number(extra.price || 0), 0
    );

    const basePrice =
        variantsTotal > 0
            ? variantsTotal
            : Number((order.product_price * order.quantity) || 0);

    const finalProductPrice = basePrice + extrasTotal;

    console.log("QTY", order)

    const totalPrice =
        order_type === 'General'
            ? order.product_price * order.quantity
            : finalProductPrice * order.quantity;

    useEffect(() => {
        onTotalChange?.(order.product_id, totalPrice);
    }, [totalPrice]);

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
                {/* Overlay */}
                <MotiView
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={styles.overlay}
                >
                    <Pressable className="flex-1 inset-0 top-0 bottom-0 left-0 right-0"
                        onPress={() => setOrderFullInfoModalVisible(false)} 
                    />
                </MotiView>
                <MotiView
                    from={{ translateY: 300 }}
                    animate={{ translateY: 0 }}
                    exit={{ translateY: 300 }}
                    transition={{ type: 'timing', duration: 300 }}
                    style={styles.sheet}
                >
                    <View className="p-3 w-full">
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Header */}
                            <View className="flex-row justify-between items-center">
                                <View className="flex-row items-center">
                                    <FontAwesome6 name="edit" size={20} />
                                    <Text className="ml-2 text-2xl" style={{fontFamily: 'ubuntu-medium'}}>Product Details</Text>
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
                                    source={{ uri: `${PRODUCTS_IMAGE_URI}${order.product_images[0].url}` }}
                                    style={{ width: width * 0.25, height: height * 0.10, borderRadius: SIZES.radius }}
                                />
                                <View className="ml-3 justify-center">
                                    <Text className="text-base" style={{fontFamily: 'roboto-medium'}}>{order.product_name}</Text>
                                    <Text className="text-primary text-lg" style={{fontFamily: 'roboto-medium'}}>
                                        K{basePrice}
                                    </Text>
                                    <Text className="text-slate text-sm"  style={{fontFamily: 'roboto'}}>From: {order.store_name}</Text>
                                </View>
                            </View>

                            <Text className="text-slate mt-3" style={{fontFamily: 'roboto-medium'}}>{order.desc}</Text>
                            
                            <View className='flex-row w-full justify-between items-center'>
                                <Text
                                    className='text-2xl'
                                    style={{fontFamily: 'ubuntu-medium'}}
                                >Qty</Text>
                                <Text
                                    className='text-2xl'
                                    style={{fontFamily: 'ubuntu-medium'}}
                                >{order.quantity}</Text>
                            </View>

                            <View style={{height: 1}} className='w-full bg-lavender my-4'/>
                            
                            {/* Extras */}
                            {variantsArray?.length > 0 && (
                                <>
                                    <View className='mb-1'>
                                    <Text
                                        className='text-2xl'
                                        style={{fontFamily: 'ubuntu-medium'}}
                                    >Variants</Text>
                                    </View>
                                    
                                </>
                            )}

                            {order_type === 'Food' ? (
                                variantsArray.map((item) => (
                                    <View
                                        key={item.id}
                                        className="flex-row justify-between items-center mb-8"
                                    >
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <MaterialCommunityIcons
                                                name="checkbox-marked"
                                                size={27}
                                                color={COLORS.primary}
                                            />

                                            <Text
                                                style={{
                                                    marginLeft: 4,
                                                    fontSize: 14,
                                                    fontFamily: 'roboto-medium',
                                                    color: COLORS.slate
                                                }}
                                            >
                                                {item.name}
                                            </Text>
                                        </View>
                                        {/* <Text style={{ color: COLORS.primary, fontFamily: 'roboto-medium', fontSize: 14 }}>
                                            K{item.price}
                                            </Text> */}
                                        </View>
                                    ))
                                ) : order_type === 'General' ? (
                                    variantsArray?.length > 0 && variantsArray?.map((group) => (
                                        <View key={group.group_id} className="mb-4">
                                            <Text style={{ fontFamily: 'roboto-bold' }}>
                                                {group.group_name}
                                            </Text>

                                            {group.options?.map((option) => (
                                                <View
                                                    key={option.option_id}
                                                    className="flex-row justify-between items-center"
                                                >
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <MaterialCommunityIcons
                                                            name="checkbox-marked"
                                                            size={27}
                                                            color={COLORS.primary}
                                                        />

                                                        <Text
                                                            style={{
                                                                marginLeft: 4,
                                                                fontSize: 14,
                                                                fontFamily: 'roboto-medium',
                                                                color: COLORS.slate
                                                            }}
                                                        >
                                                            {option.name}
                                                        </Text>
                                                    </View>

                                                    {option.price > 0 && (
                                                        <Text style={{ color: COLORS.primary, fontFamily: 'roboto-medium', fontSize: 14 }}>
                                                            K{option.price}
                                                        </Text>
                                                    )}
                                                </View>
                                            ))}
                                        </View>
                                    )
                                )
                            ) : (
                                <></>
                            )}

                            {extras.length > 0 &&
                                <>
                                    <View className='mb-1'>
                                        <Text
                                            className='text-2xl'
                                            style={{fontFamily: 'ubuntu-medium'}}
                                        >Extras</Text>
                                    </View>
                                
                                    {extras.map((extra) => (
                                        <View
                                            key={extra.extra_id}
                                            className="flex-row justify-between items-center"
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <MaterialCommunityIcons
                                                    name="checkbox-marked"
                                                    size={27}
                                                    color={COLORS.primary}
                                                />

                                                <Text
                                                    style={{
                                                        marginLeft: 4,
                                                        fontSize: 14,
                                                        fontFamily: 'roboto-medium',
                                                        color: COLORS.slate
                                                    }}
                                                >
                                                    {extra.name}
                                                </Text>
                                            </View>

                                            <Text style={{ color: COLORS.primary, fontFamily: 'roboto-medium', fontSize: 14 }}>
                                                K{extra.price}
                                            </Text>
                                        </View>
                                    ))}
                                </>
                            }
                            {/* Total */}
                            <View className="flex-row justify-between items-center mt-4">
                                <Text className="text-2xl" style={{fontFamily: 'ubuntu-medium'}}>Total:</Text>
                                <View className="bg-primary px-5 py-2 rounded">
                                    <Text className="text-white text-2xl"  style={{fontFamily: 'ubuntu-medium'}}>
                                        K{finalProductPrice * order.quantity}
                                    </Text>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </MotiView>
            </Modal>

            {/* Summary Card */}
            <TouchableOpacity 
                onPress={() => setOrderFullInfoModalVisible(true)} 
                className="flex-row items-center"
            >
                <Image
                    source={{ uri: `${PRODUCTS_IMAGE_URI}${order.product_images[0].url}` }}
                    style={{ width: '24%', height: 60, borderRadius: SIZES.radius }}
                />
                <View className="flex-1 ml-3">
                    <Text className="text-base font-semibold">{order.product_name}</Text>
                    <View className="flex-row justify-between">
                        {/* <Text className="text-slate text-sm" style={{fontFamily: 'roboto'}}>Price: K{basePrice}</Text> */}
                        <Text className="text-slate text-sm" style={{fontFamily: 'roboto'}}>Qty: {order.quantity}</Text>
                        {order_type === 'General' ? (
                            <Text className="text-primary text-sm" style={{fontFamily: 'roboto-medium'}}>
                                Total: K{order.product_price * order.quantity}
                            </Text>
                        ) : (
                            <Text className="text-primary text-sm" style={{fontFamily: 'roboto-medium'}}>
                                Total: K{finalProductPrice * order.quantity}
                            </Text>
                        )}
                    </View>
                    <Text numberOfLines={1} className="text-grey text-sm">{order.product_notes}</Text>
                </View>
            </TouchableOpacity>
            <View className='bg-lavender my-4' style={{height: 1}}/>
        </>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },

    sheet: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        paddingBottom: 60,
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    }
});

export default OrdersData;
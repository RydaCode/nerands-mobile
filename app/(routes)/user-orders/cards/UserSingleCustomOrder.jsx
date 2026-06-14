import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { FlatList, Image, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { useSelector } from 'react-redux'
import { COLORS } from '../../../../constants/constants'
import { packageSizes } from '../../../../constants/packageSizes'
import { USER_IMAGE_URI } from '../../../../RequestMethods'
import { calculateDistance, estimateTime, makeCall } from '../../../../utils/getDistance'

const OrdersData = ({ order, router, selectedPackage }) => {
    const { width, height } = useWindowDimensions();

    // Calculate dynamic sizes based on screen width/height
    const imageWidthModal = width * 0.29; // 29% of the screen width for the image
    const imageHeightModal = height * 0.12; // 12% of the screen height for the image
    const buttonWidth = width * 0.4; // 40% of the screen width for buttons

    const [orderFullInfoModalVisible, setOrderFullInfoModalVisible] = useState(false);
    
    return (
        <>
            <TouchableOpacity
                onPress={() => setOrderFullInfoModalVisible(true)}
                className='flex-row justify-between items-center'
            >
                <View className='flex-row justify-start items-center'>
                    <View
                        style={{
                            width: '23%',
                            height: 60,
                            backgroundColor: selectedPackage?.backgroundColor,
                            borderColor: selectedPackage?.borderColor,
                        }}
                        className='border rounded justify-center items-center elevation-sm bg-white'
                    >
                        <Ionicons size={35} name="basket" color={selectedPackage.borderColor} />
                    </View>
                    <View className='w-[71.7%] flex-row ml-2 justify-between items-center'>
                        <View className='w-full'>
                            <View className=''>
                                <Text numberOfLines={2} className='text-base' style={{fontFamily: 'roboto-medium'}}>{order.name}</Text>
                            </View>
                            <View className='flex-row justify-between items-center'>
                                <View>
                                    <Text className='text-sm text-slate' style={{fontFamily: 'roboto-medium'}}>Est. Price K{order.estimatedPrice}</Text>
                                </View>
                                <View className='flex-row items-center justify-start'>
                                    <Text className='text-slate text-sm' style={{fontFamily: 'roboto-medium',}}>Qty: {order.qty}</Text>
                                </View>
                                <View>
                                    <Text className='text-sm text-primary'
                                        style={{
                                            fontFamily: 'roboto-medium',
                                            color: selectedPackage?.badgeColor
                                        }}
                                    >
                                        Est. Total K{order.estimatedPrice * order.qty}
                                    </Text>
                                </View>
                            </View>
                            {/* <View className='flex-row justify-between items-center'>
                                <View className='flex-row items-center justify-start mr-4'>
                                    <Text numberOfLines={1} className='text-grey text-sm' style={{fontFamily: 'roboto-medium'}}>Qty: {order.qty}</Text>
                                </View>
                            </View> */}
                        </View>
                        {/* <TouchableOpacity className='w-[8%] h-[50px] items-center justify-center'>
                            <FontAwesome name='times' size={19} color={COLORS.red} />
                        </TouchableOpacity> */}
                    </View>
                </View>
            </TouchableOpacity>
        </>
    )
}

const UserSingleCustomOrder = ({products}) => {
    const { latitude, longitude, displayCurrentLocation, locationServicesEnabled } = useSelector(state => state.location);
    const charges = useSelector(state => state.delivery.charges);
    const origin = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
    };

    const destination = {
        latitude: parseFloat(products?.runner_lat),
        longitude: parseFloat(products?.runner_lng),
    };
    
    if (!products) return null;
    const router = useRouter();
    const { width, height } = useWindowDimensions();
    const buttonWidth = width * 0.4; // 40% of the screen width for buttons

    const selectedPackage = packageSizes.find(
        item => item.id === products?.handling_fee_data?.id
    );

    const calculateServiceFee = (amount) => {
        let percent = charges?.charge_percent ?? 15;

        if (amount > 500) percent -= 4;
        else if (amount > 300) percent -= 3;
        else if (amount > 100) percent -= 2;

        const fee = +(amount * (percent / 100)).toFixed(2);

        // Cap the service fee at 150
        return Math.min(fee, 150);
    };

    const cartTotal = products?.custom_products?.reduce((sum, item) => {
        return sum + (Number(item.estimatedPrice || 0) * Number(item.qty || 0));
    }, 0);

    const serviceFee =
        products?.amount_spent === null || products?.amount_spent === 0
            ? Number(products.service_fee || 0)
            : Number(calculateServiceFee(products?.amount_spent) || 0);

    const cartTotalBeforeAndAfter = products?.amount_spent === null || products?.amount_spent === 0
        ? cartTotal
        : Number(products?.amount_spent);

    const grandTotal =
        Number(products?.delivery_fee || 0) + serviceFee + Number(cartTotalBeforeAndAfter) + Number(selectedPackage?.price || 0);

    const totalQuantity = products?.custom_products?.reduce((sum, item) => {
        return sum + Number(item.qty || 0);
    }, 0);

    return (
        <View className='px-4'>
            <FlatList
                data={products.custom_products || []} // Ensure data is an array
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <View>
                        <OrdersData
                            order={item}
                            router={router}
                            selectedPackage={selectedPackage}
                        />
                        <View className='w-full my-4 rounded-full bg-slate opacity-10 h-[1px]'/>
                    </View>
                )}

                // Place all static UI elements inside ListHeaderComponent
                ListHeaderComponent={() => (
                    <View>
                        <View className='my-6 items-center'>
                            <Text className='text-sm' style={{fontFamily: 'roboto-medium'}}>
                                This is a custom order
                            </Text>
                        </View>
                        <View className='flex-row justify-between items-center mb-6'>
                            <Text className='mt-1 text-lg' style={{fontFamily: 'roboto-medium'}}>Order No: {products?.custom_order_num}</Text>
                            <View className='flex-row justify-start items-center py-[1px] px-2 rounded-full bg-[#F3F4F8]'>
                                <View className='rounded-full bg-red border-1 border-red mr-1 h-[10px] w-[10px]'/>
                                <Text className='text-red' style={{fontFamily: 'roboto-medium'}}>{products?.order_status}</Text>
                            </View>
                        </View>
                    </View>
                )}

                ListFooterComponent={() => (
                    <>
                        <View>
                            <View className='w-full flex-row justify-end items-center mb-6'>
                                <Text
                                    className='text-lg text-primary'
                                    style={{fontFamily: 'roboto-medium'}}
                                >
                                    Est. Cart Total: K{Number(cartTotal).toLocaleString()}
                                </Text>
                            </View>
                            <Text className='text-lg mb-3' style={{fontFamily: 'roboto-medium'}}>Preffered Stores</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className='w-full mb-6'>
                                {products?.custom_stores?.map((item) => (
                                    <View key={item.id} className='mr-4 items-center justify-center bg-[#F3F4F8] rounded-full px-3 py-1'>
                                        <Text className='text-sm text-slate' style={{fontFamily: 'roboto-medium'}}>
                                            {item.name}
                                        </Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>

                        <View 
                            className='w-full rounded-md p-3 mb-8'
                            style={{
                                borderWidth: 1,
                                backgroundColor: selectedPackage?.backgroundColor,
                                borderColor: selectedPackage?.borderColor,
                            }}
                        >
                            <View className='mb-4 w-full flex-row justify-between items-center'>
                                <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>Budget</Text>
                                <View
                                    className='bg-coral items-center justify-center'
                                    style={{
                                        width: '50%',
                                        paddingVertical: 4,
                                        borderRadius: 999,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: selectedPackage?.badgeColor,
                                    }}
                                >
                                    <Text style={{fontFamily: 'roboto-medium'}} className='text-lg text-white'>ZMK {Number(products.estimated_spend_amount).toLocaleString()}</Text>
                                </View>
                            </View>
                            <View className='w-full flex-row justify-between items-center'>
                                <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>Total items</Text>
                                <View
                                    className='bg-coral items-center justify-center'
                                    style={{
                                        width: '50%',
                                        paddingVertical: 4,
                                        borderRadius: 999,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: selectedPackage?.badgeColor,
                                    }}
                                >
                                    <Text style={{fontFamily: 'roboto-medium'}} className='text-lg text-white'>{totalQuantity}</Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            className='p-2 my-3 elevation-sm rounded w-full items-center'
                            style={{
                                borderWidth: 1,
                                backgroundColor: selectedPackage?.backgroundColor,
                                borderColor: selectedPackage?.borderColor,
                            }}
                        >
                            <View className='flex-row justify-between items-center w-full'>
                                <View className='flex-row' style={{ width: '85%' }}>
                                    <Ionicons
                                        name={selectedPackage?.icon || 'box'}
                                        size={27}
                                        color={selectedPackage?.iconColor || COLORS.primary}
                                    />

                                    <Text
                                        className='text-lg ml-1 text-black'
                                        style={{ fontFamily: 'roboto-medium' }}
                                    >
                                        {selectedPackage?.name}
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        width: 25,
                                        height: 25,
                                        borderRadius: 100,
                                        borderWidth: 2,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderColor: selectedPackage?.badgeColor,
                                    }}
                                >
                                    <FontAwesome
                                        name='check'
                                        color={selectedPackage?.badgeColor}
                                    />
                                </View>
                            </View>

                            <View className='w-full'>
                                <Text
                                    className='text-sm text-slate'
                                    style={{
                                        textAlign: 'justify',
                                        fontFamily: 'roboto-medium'
                                    }}
                                >
                                    {selectedPackage?.description}
                                </Text>
                            </View>

                            <View className='w-full flex-row justify-between items-center mt-2'>
                                <Text
                                    className='text-lg'
                                    style={{
                                        textAlign: 'justify',
                                        fontFamily: 'roboto-medium',
                                        color:  selectedPackage?.badgeColor
                                    }}
                                >
                                    Package Size
                                </Text>
                                <View
                                    style={{
                                        width: '50%',
                                        paddingVertical: 4,
                                        borderRadius: 999,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: selectedPackage?.badgeColor,
                                    }}
                                >
                                    <Text
                                        className='text-white text-lg'
                                        style={{ fontFamily: 'roboto-bold' }}
                                    >
                                        K{selectedPackage?.price}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <View 
                            className='w-full rounded-md p-3 mb-8'
                            style={{
                                borderWidth: 1,
                                backgroundColor: selectedPackage?.backgroundColor,
                                borderColor: selectedPackage?.borderColor,
                            }}
                        >
                            <View className='mb-4 w-full flex-row justify-between items-center'>
                                <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>Amount Spent</Text>
                                <View
                                    className='items-center justify-center'
                                    style={{
                                        width: '50%',
                                        paddingVertical: 4,
                                        borderRadius: 999,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: selectedPackage?.badgeColor,
                                    }}
                                >
                                    <Text style={{fontFamily: 'roboto-medium'}} className='text-lg text-white'>ZMK {Number(products.amount_spent).toLocaleString()}</Text>
                                </View>
                            </View>

                            <View className='mb-4 w-full flex-row justify-between items-center'>
                                <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>
                                    {products.amount_spent === null || products.amount_spent === 0 ? 'Est. Service Fee' : 'Service Fee'}
                                </Text>
                                <View
                                    className='items-center justify-center'
                                    style={{
                                        width: '50%',
                                        paddingVertical: 4,
                                        borderRadius: 999,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: selectedPackage?.badgeColor,
                                    }}
                                >
                                    <Text style={{fontFamily: 'roboto-medium'}} className='text-lg text-white'>
                                        ZMK {products.amount_spent === null || products.amount_spent === 0 ?
                                                Number(products.service_fee).toLocaleString() :
                                                Number(calculateServiceFee(products.amount_spent))
                                            }
                                    </Text>
                                </View>
                            </View>

                            <View className='mb-4 w-full flex-row justify-between items-center'>
                                <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>Delivery Fee</Text>
                                <View
                                    className='items-center justify-center'
                                    style={{
                                        width: '50%',
                                        paddingVertical: 4,
                                        borderRadius: 999,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: selectedPackage?.badgeColor,
                                    }}
                                >
                                    <Text style={{fontFamily: 'roboto-medium'}} className='text-lg text-white'>K{products?.delivery_mode === 'custom' ? 0 : Number(products?.delivery_fee || 0).toLocaleString()}</Text>
                                </View>
                            </View>
                            <View className='mt-4 w-full flex-row justify-between items-center'>
                                <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>Grand Total</Text>
                                <View
                                    className='items-center justify-center'
                                    style={{
                                        width: '50%',
                                        paddingVertical: 4,
                                        borderRadius: 999,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: COLORS.primary,
                                    }}
                                >
                                    <Text style={{fontFamily: 'roboto-medium'}} className='text-lg text-white'>ZMK {Number(grandTotal).toLocaleString()}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View
                            className='p-2 my-3 elevation-sm rounded w-full items-center'
                            style={{
                                borderWidth: 1,
                                backgroundColor: selectedPackage?.backgroundColor
                                    ? selectedPackage.backgroundColor
                                    : '#ECFDF5',
                                borderColor: selectedPackage?.borderColor
                                    ? selectedPackage.borderColor
                                    : "#22C55E",
                            }}
                        >
                            <View className='flex-row justify-between items-center w-full'>
                                <View className='flex-row items-center' style={{ width: '85%' }}>
                                    <View
                                        className='border-2 border-lavender justify-center items-center rounded-full relative'
                                        style={{height: 65, width: 65}}
                                    >
                                        {products?.profile_image === null ?
                                        <FontAwesome name="user" size={30} color={COLORS.slate}/>
                                            : <Image
                                                source={{ uri: `${USER_IMAGE_URI}${products?.profile_image}` }}
                                                style={{ height: '100%', width: '100%' }}
                                                className='rounded-full border-2 border-white'
                                            />
                                        }
                                    </View>

                                    <View className='ml-1'>
                                        <Text
                                            className='text-lg text-black'
                                            style={{ fontFamily: 'roboto-medium' }}
                                        >
                                            {products?.first_name} {products?.last_name}
                                        </Text>
                                        <Text
                                            className='text-sm text-slate'
                                            style={{ fontFamily: 'roboto-medium' }}
                                        >
                                            {products?.phone_num}
                                        </Text>
                                    </View>
                                </View>

                                <View
                                    style={{
                                        width: 25,
                                        height: 25,
                                        borderRadius: 100,
                                        borderWidth: 2,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderColor: selectedPackage?.borderColor
                                            ? selectedPackage.borderColor
                                            : "#22C55E",
                                    }}
                                >
                                    <FontAwesome name='check' color={selectedPackage.iconColor? selectedPackage.iconColor : "#22C55E"} />
                                </View>
                            </View>

                            <View className='w-full'>
                                <Text
                                    className='text-sm text-slate'
                                    style={{
                                        textAlign: 'justify',
                                        fontFamily: 'roboto-medium'
                                    }}
                                >
                                    This is your assigned runner for this order. You can contact them to coordinate the pickup and delivery of your items. Make sure to provide clear instructions and communicate any specific requirements you may have for the delivery.
                                </Text>
                            </View>
                            <View className='w-full my-4'>
                                <Text
                                    className='text-sm text-slate'
                                    style={{
                                        textAlign: 'justify',
                                        fontFamily: 'roboto-medium'
                                    }}
                                >
                                    If you have any issues with your runner or the delivery process, please contact our support team immediately for assistance.
                                </Text>
                            </View>
                            <View className='w-full my-4'>
                                <Text
                                    className='text-base'
                                    style={{
                                        color: selectedPackage.iconColor,
                                        textAlign: 'justify',
                                        fontFamily: 'roboto-medium'
                                    }}
                                >
                                    Your runner is just {calculateDistance(origin, destination)} away from you{products?.delivery_mode === 'custom' ? null : ', with Estimated time of arrival: '}{
                                        estimateTime(origin, destination, products?.delivery_mode)
                                        }
                                </Text>
                            </View>

                            <View className='w-full flex-row items-center justify-between mt-2'>
                                <Text
                                    className='text-lg'
                                    style={{
                                        textAlign: 'justify',
                                        fontFamily: 'roboto-medium',
                                        color: selectedPackage.borderColor
                                    }}
                                >
                                    Runner
                                </Text>
                                <TouchableOpacity
                                    style={{
                                        width: 45,
                                        height:45,
                                        paddingVertical: 4,
                                        borderRadius: 999,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderWidth: 1,
                                        backgroundColor: selectedPackage?.backgroundColor
                                            ? selectedPackage.backgroundColor
                                            : '#ECFDF5',
                                        borderColor: selectedPackage?.borderColor
                                            ? selectedPackage.borderColor
                                            : "#22C55E",
                                    }}
                                    className='elevation-sm border border-lavender'
                                    onPress={() => makeCall(products?.phone_num)}
                                >
                                    <FontAwesome
                                        name='phone'
                                        size={20}
                                        color={
                                            selectedPackage?.borderColor
                                            ? selectedPackage.borderColor
                                            : "#22C55E"
                                        }
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className='pb-10' style={{ marginBottom: 80 }} />
                    </>
                )}

                ListEmptyComponent={
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <Text>No items available.</Text>
                    </View>
                }

                // Improve performance by disabling scroll indicator and enabling windowing
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                initialNumToRender={10}
                windowSize={5}
            />
        </View>
    )
}

export default UserSingleCustomOrder
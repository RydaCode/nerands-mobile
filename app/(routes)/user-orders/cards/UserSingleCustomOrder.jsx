import { Entypo, FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { FlatList, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { useSelector } from 'react-redux'
import { COLORS, SIZES } from '../../../../constants/constants'
import { calculateDistance, estimateTime, makeCall } from '../../../../utils/getDistance'

const OrdersData = ({ order, router }) => {
    const { width, height } = useWindowDimensions();

    // Calculate dynamic sizes based on screen width/height
    const imageWidthModal = width * 0.29; // 29% of the screen width for the image
    const imageHeightModal = height * 0.12; // 12% of the screen height for the image
    const buttonWidth = width * 0.4; // 40% of the screen width for buttons

    const [orderFullInfoModalVisible, setOrderFullInfoModalVisible] = useState(false);
    const [quantityControl, setQuantityControl] = useState(1);
    const [extras, setExtras] = useState(false);

    return (
        <>
            <TouchableOpacity
                onPress={() => setOrderFullInfoModalVisible(true)}
                className='flex-row justify-between items-center'
            >
                <View className='flex-row justify-start items-center'>
                    <View style={{borderRadius: SIZES.radius}} className='h-[65px] w-[26%] border-2 border-lavender justify-center items-center'>
                        <Entypo size={40} name="box" color={COLORS.primary} />
                    </View>
                    <View className='w-[71.7%] flex-row ml-2 justify-between items-center'>
                        <View className='w-[90%]'>
                            <View className=''>
                                <Text numberOfLines={2} className='text-base' style={{fontFamily: 'roboto-bold'}}>{order}</Text>
                            </View>
                            {/* <View className='flex-row justify-between items-center'>
                                <View>
                                    <Text className='text-lg text-primary' style={{fontFamily: 'roboto-bold'}}>K0</Text>
                                </View>
                                <View className='flex-row items-center justify-start mr-4'>
                                    <Text className='text-slate text-sm' style={{fontFamily: 'roboto-medium',}}>Qty:0</Text>
                                </View>
                            </View> */}
                            <View className='flex-row justify-between items-center'>
                                <View className='flex-row items-center justify-start mr-4'>
                                    <Text numberOfLines={1} className='text-grey text-sm' style={{fontFamily: 'roboto-medium'}}>Product</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity className='w-[8%] h-[50px] items-center justify-center'>
                            <FontAwesome name='times' size={19} color={COLORS.red} />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </>
    )
}

const UserSingleCustomOrder = ({products}) => {
    const { latitude, longitude, displayCurrentLocation, locationServicesEnabled } = useSelector(state => state.location);
    
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

    console.log("PROD", products);

    let CustomProducts = [];

    try {
        if (Array.isArray(products?.custom_products)) {
            CustomProducts = products.custom_products;
        } 
        else if (
            typeof products?.custom_products === "string" &&
            products.custom_products.trim().startsWith("[")
        ) {
            CustomProducts = JSON.parse(products.custom_products);
        }
    } catch (e) {
        console.error("Invalid custom_products JSON:", products?.custom_products);
        CustomProducts = [];
    }

    CustomProducts = CustomProducts
        .map(item => String(item).trim())
        .filter(Boolean)
        .map(
            item => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
        );

    // console.log(products.delivery_mode)

    // origin, destination,

    return (
        <View className='px-4'>
            <FlatList
                data={Array.isArray(CustomProducts) ? CustomProducts : []} // Ensure data is an array
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                    <View>
                        <OrdersData
                            order={item}
                            router={router}
                        />
                        <View className='w-full my-4 rounded-full bg-slate opacity-10 h-[1px]'/>
                    </View>
                )}

                // Place all static UI elements inside ListHeaderComponent
                ListHeaderComponent={() => (
                    <View>
                        <View className='my-6 items-center'>
                            <Text className='text-sm' style={{fontFamily: 'roboto-medium'}}>This is a custom order</Text>
                        </View>
                        <View className='flex-row justify-between items-center mb-6'>
                            <Text className='mt-1 text-lg' style={{fontFamily: 'roboto-bold'}}>Order No: {products.custom_order_num}</Text>
                            <View className='flex-row justify-start items-center py-[1px] px-2 rounded-full bg-[#F3F4F8]'>
                                <View className='rounded-full bg-red border-1 border-red mr-1 h-[10px] w-[10px]'/>
                                <Text className='text-red' style={{fontFamily: 'roboto-medium'}}>{products.order_status}</Text>
                            </View>
                        </View>
                    </View>
                )}

                ListFooterComponent={() => (
                    <>
                        <View className='w-full border border-lavender rounded-md p-3 mb-8'>
                            <View className='mb-6 w-full flex-row justify-between items-center'>
                                <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>Total items</Text>
                                <View
                                    className='bg-coral items-center justify-center'
                                    style={{ padding: 5, borderRadius: SIZES.radius, width: buttonWidth, height: height * 0.06 }}
                                >
                                    <Text style={{fontFamily: 'roboto-medium'}} className='text-lg text-white'>{CustomProducts.length}</Text>
                                </View>
                            </View>
                            <View className='mt-4 w-full flex-row justify-between items-center'>
                                <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>Max to Spend</Text>
                                <View
                                    className='bg-coral items-center justify-center'
                                    style={{ padding: 5, borderRadius: SIZES.radius, width: buttonWidth, height: height * 0.06 }}
                                >
                                    <Text style={{fontFamily: 'roboto-medium'}} className='text-lg text-white'>ZMK {Number(products.estimated_spend_amount).toLocaleString()}</Text>
                                </View>
                            </View>
                        </View>

                        <View className='w-full border border-lavender rounded-md p-3 mb-8'>
                            <View className='mb-6 w-full flex-row justify-between items-center'>
                                <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>Amount Spent</Text>
                                <View
                                    className='bg-coral items-center justify-center'
                                    style={{ padding: 5, borderRadius: SIZES.radius, width: buttonWidth, height: height * 0.06 }}
                                >
                                    <Text style={{fontFamily: 'roboto-medium'}} className='text-lg text-white'>ZMK {Number(products.amount_spent).toLocaleString()}</Text>
                                </View>
                            </View>
                            <View className='mt-4 mb-6 w-full flex-row justify-between items-center'>
                                <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>Service fee</Text>
                                <View
                                    className='bg-coral items-center justify-center'
                                    style={{ padding: 5, borderRadius: SIZES.radius, width: buttonWidth, height: height * 0.06 }}
                                >
                                    <Text style={{fontFamily: 'roboto-medium'}} className='text-lg text-white'>ZMK {Number(products.service_fee).toLocaleString()}</Text>
                                </View>
                            </View>
                            <View className='mt-4 mb-6 w-full flex-row justify-between items-center'>
                                <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>Delivery Fee</Text>
                                <View
                                    className='bg-coral items-center justify-center'
                                    style={{ padding: 5, borderRadius: SIZES.radius, width: buttonWidth, height: height * 0.06 }}
                                >
                                    <Text style={{fontFamily: 'roboto-medium'}} className='text-lg text-white'>ZMK {Number(products.delivery_fee).toLocaleString()}</Text>
                                </View>
                            </View>
                            <View className='mt-4 w-full flex-row justify-between items-center'>
                                <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>Grand Total</Text>
                                <View
                                    className='bg-primary items-center justify-center'
                                    style={{ padding: 5, borderRadius: SIZES.radius, width: buttonWidth, height: height * 0.06 }}
                                >
                                    <Text style={{fontFamily: 'roboto-medium'}} className='text-lg text-white'>ZMK {Number(+products.delivery_fee + +products.amount_spent + +products.service_fee).toLocaleString()}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View className='w-full'>
                            <View className='mb-2 bg-grey_bg rounded-full justify-center items-center p-1'>
                                <Text className='text-lg' style={{fontFamily: 'roboto-bold'}}>Transporter Details</Text>
                            </View>

                            <View className='w-full flex-row justify-between items-center mb-3'>
                                <TouchableOpacity className='w-[83%] flex-row justify-start items-center mb-3'>
                                    <View className='border-2 border-lavender rounded-full' style={{height: 47, width: 47}}>
                                        {/* <Image source={} /> */}
                                    </View>
                                    <View className='ml-2'>
                                        <Text className='text-md' style={{fontFamily: 'roboto-bold'}}>Sylvester</Text>
                                        <Text className='text-slate' style={{fontFamily: 'roboto-medium', fontSize: SIZES.small}}>0973304006</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity className='w-[15%] items-center justify-center'
                                     onPress={() => makeCall('0973304006')}
                                >
                                    <View className='border-2 border-lavender items-center justify-center bg-green2 rounded-full' style={{height: 47, width: 47}}>
                                        <FontAwesome5 name='phone' color={COLORS.white} size={15} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            
                            <TouchableOpacity
                                onPress={() => router.push({pathname: '../maps/user-map/'})}
                                className='flex-row rounded-full w-full justify-between items-center'>
                                <View className='flex-row bg-grey_bg rounded-full w-[62%] justify-center items-center p-2'>
                                    <Ionicons name='location-sharp' size={14} color={COLORS.red } />
                                    <Text className='text-sm text-red' style={{fontFamily: 'roboto-medium'}}>
                                        {calculateDistance(origin, destination)} • Eta: {estimateTime(origin, destination, products.delivery_mode)}
                                    </Text>
                                </View>

                                <View className='w-[15%] items-center justify-center'>
                                    <View className='border-2 border-lavender items-center justify-center bg-grey_bg rounded-full' style={{height: 47, width: 47}}>
                                        <Ionicons name='location-sharp' size={20} color={COLORS.green2} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* <View className='w-full justify-center items-center mt-6'>
                            <Text className='text-red text-lg' style={{fontFamily: 'roboto-medium'}}>{products.order_status}</Text>
                        </View> */}

                        <View className='w-full flex-row justify-between items-center mb-6 mt-8'>
                            <TouchableOpacity className='w-full bg-red p-3 justify-center items-center rounded-md'>
                                <Text className='text-white text-2xl' style={{fontFamily: 'ubuntu-medium'}}>Remove Order</Text>
                            </TouchableOpacity>
                        </View>
                        <View className='pb-10' />
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
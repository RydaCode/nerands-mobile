import { FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import haversine from 'haversine'
import { useEffect, useState } from 'react'
import { FlatList, Image, Linking, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { useSelector } from 'react-redux'
import { COLORS, SIZES } from '../../../../constants/constants'
import useApi from '../../../../hook/useApi'
import { PRODUCTS_IMAGE_URI } from '../../../../RequestMethods'
import LoadingIndicator from '../../../LoadingIndicator'
import ExtraCheckbox from '../../../screens/StoreSingleScreen/ExtraCheckbox '

const OrdersData = ({ order, router }) => {
    const { width, height } = useWindowDimensions();

    // Calculate dynamic sizes based on screen width/height
    const imageWidthModal = width * 0.25; // 29% of the screen width for the image
    const imageHeightModal = height * 0.10; // 12% of the screen height for the image
    const buttonWidth = width * 0.4; // 40% of the screen width for buttons

    const [orderFullInfoModalVisible, setOrderFullInfoModalVisible] = useState(false);
    const extras = order.extras || [];

    return (
        <>
            {/* Start publish store modal */}
            <Modal
                animationType="slide"
                transparent={true}
                statusBarTranslucent={true}
                visible={orderFullInfoModalVisible}
                onRequestClose={() => { setOrderFullInfoModalVisible(false); }}
            >
                <Pressable style={styles.centeredView} onPress={() => { setOrderFullInfoModalVisible(false)}}/>
                <View style={styles.centeredView}
                    animation='slideInUp'
                >
                    <View style={[styles.modalView, { backgroundColor: '#fff', borderRadius: SIZES.radius, padding: 10, width: '100%', maxWidth: width }]} >
                        {/* Container */}
                        <View className='p-1 flex-row justify-between items-center'>
                            <View className='flex-row justify-center items-center'>
                                <FontAwesome6 name="edit" size={22}/>
                                <Text className='text-2xl ml-1' style={{fontFamily: 'ubuntu-medium'}}>Product Details</Text>
                            </View>
                            <Pressable
                                onPress={() => {setOrderFullInfoModalVisible(false)}}
                                className='h-[30px] w-[30px] rounded-full justify-center items-center bg-red'>
                                <FontAwesome5 name='times' color={COLORS.white} size={15} />
                            </Pressable>
                        </View>
                        <View
                            className='bg-white w-full p-3'
                            style={{
                                maxWidth: width, borderRadius: SIZES.border // Ensure it does not exceed the device width
                            }}
                        >
                            {/* Product Image and Info */}
                            <View className='flex-row mb-4'>
                                <View className='relative' style={{ width: imageWidthModal, height: imageHeightModal }}>
                                    <Image
                                        className='w-full h-full'
                                        source={{uri:`${PRODUCTS_IMAGE_URI}${order.product_images}`}}
                                        style={{ borderRadius: SIZES.radius, resizeMode: 'cover' }}
                                    />
                                </View>
                                <View className='justify-center ml-[10px]'>
                                    <Text className='text-lg' style={{ fontFamily: 'roboto-medium' }}>{order.product_name}</Text>
                                    <Text className='text-red text-lg'  style={{ fontFamily: 'roboto-medium' }}>ZMK {order.product_price}</Text>
                                    <Text className='text-slate text-sm' style={{ fontFamily: 'roboto-medium' }}>From: {order.store_name}</Text>
                                </View>
                            </View>

                            <Text className='text-ms text-slate mb-4' style={{fontFamily: 'roboto-medium'}}>{order.desc}</Text>

                            {/* Quantity Control */}
                            <View className='flex-row justify-between items-center mb-6'>
                                <Text className='text-xl' style={{fontFamily: 'ubuntu-medium'}}>Quantity</Text>
                                <View className='flex-row items-center'>
                                    <Text className='text-xl' style={{fontFamily: 'maven-bold'}}>{order.quantity}</Text>
                                </View>
                            </View>
                            {/* Extras Section */}
                            <ScrollView style={{ maxHeight: height * 0.3 }} showVericallScrollIndicator={false}>
                                {order.chili_option &&
                                    <View className='mb-3'>
                                        <Text className="mb-2 font-semibold text-2xl" style={{ fontFamily: 'maven-medium' }}>Extras</Text>
                                        <ExtraCheckbox
                                            label="Chilli"
                                            price={0}
                                            checked={true}
                                        />
                                    </View>
                                }
                                {extras.length > 0 && (
                                    extras.map(extra => (
                                        <ExtraCheckbox
                                            checked={true}
                                            key={extra.extra_id}
                                            label={extra.extra_name}
                                            price={extra.extra_price}
                                        />
                                    ))
                                )}
                            </ScrollView>

                            {/* Total Amount */}
                            <View className='flex-row items-center justify-between mb-5'>
                                <Text className='text-2xl' style={{ fontFamily: 'ubuntu-medium' }}>Total:</Text>
                                <View
                                    className='bg-primary items-center justify-center P-[5px]'
                                    style={{
                                        borderRadius: SIZES.radius,
                                        width: buttonWidth,
                                        height: height * 0.06
                                    }}
                                >
                                    <Text style={{fontFamily: 'ubuntu-medium'}} className='text-2xl text-white'>ZMK {order.total_price}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Start public modal */}

            <TouchableOpacity
                onPress={() => setOrderFullInfoModalVisible(true)}
                className='flex-row justify-between items-center'
            >
                <View className='flex-row justify-start items-center'>
                    <Image
                        source={{uri:`${PRODUCTS_IMAGE_URI}${order.product_images}`}}
                        style={{borderRadius: SIZES.radius}} className='h-[65px] w-[26%]'
                    />
                    <View className='w-[71.7%] flex-row ml-2 justify-between items-center'>
                        <View className='w-full'>
                            <View className=''>
                                <Text className='text-base' style={{fontFamily: 'roboto-medium'}}>{order.product_name}</Text>
                            </View>
                            <View className='flex-row justify-between items-center'>
                                <View>
                                    <Text className='text-base text-primary' style={{fontFamily: 'roboto-medium'}}>K{order.product_price}</Text>
                                </View>
                                {/* <View className='flex-row items-center justify-start mr-4'>
                                    <Text className='text-slate text-sm' style={{fontFamily: 'roboto-medium',}}>Qty:{order.quantity}</Text>
                                </View> */}
                                <View className='flex-row items-center justify-start mr-4'>
                                    <Text className='text-slate text-sm' style={{fontFamily: 'roboto-medium',}}>Qty:{order.quantity}</Text>
                                </View>
                            </View>
                            <View className='flex-row justify-between items-center'>
                                <View className='flex-row items-center justify-start mr-4'>
                                    <Text numberOfLines={1} className='text-grey text-sm' style={{fontFamily: 'roboto-medium'}}>{order.desc}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </>
    )
}

const AdminSingleOrderCard = () => {
    const { latitude, longitude, displayCurrentLocation, locationServicesEnabled } = useSelector(state => state.location);
    const params = useLocalSearchParams();
    // const user_id = params.user_id;

    const router = useRouter();
    const { width, height } = useWindowDimensions();
    const buttonWidth = width * 0.4; // 40% of the screen width for buttons

    const { data, isLoading, error, get, del } = useApi(`/orders/${params.order_id}`);
    const { data:UserData, isLoading:UserLoading, error:UserError, get:GetUserData } = useApi(`/orders/${params.order_id}`);

    useEffect(() => {
        get();
        GetUserData();
    }, []);

    // const {data:gettransporter, isLoading:transporterloading, error:transportererrors, refetch:transporterrefetch} = useApi(`/deliveryman/transporter/${user_id}`);

    const origine_lat = parseFloat(latitude);
    const origine_lng = parseFloat(longitude);
    const destination_lat = parseFloat(data?.items[0]?.store_latitude);
    const destination_lng = parseFloat(data?.items[0]?.store_longitude);

    const directions = [
        {latitude: origine_lat, longitude: origine_lng},
        {latitude: destination_lat, longitude: destination_lng}
    ]

    const calculateDistance = (pointA, pointB) => {
        const distanceKm = haversine(pointA, pointB) / 1000; // Convert meters to km
        return distanceKm < 1 ? `${Math.round(distanceKm * 1000) || ''} meters` : `${distanceKm.toFixed(2) || 0}Km`;
    };

    const pointA = directions[0]; // Transporter
    const pointB = directions[1]; // Store

    const estimateTime = (pointA, pointB, averageSpeedKmh = 40) => {
        const distanceKm = haversine(pointA, pointB) / 1000;
        const timeHours = distanceKm / averageSpeedKmh;
        const totalMinutes = Math.ceil(timeHours * 60);
        
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
      
        if (hours > 0) {
            return `${hours} hr${hours > 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
        } else {
            return `${minutes} min${minutes !== 1 ? 's' : ''}`;
        }
    };

    // const tansproter_lat = parseFloat(gettransporter?.latitude);
    // const tansproter_lng = parseFloat(gettransporter?.longitude);

    // const directions_trans = [
    //     {latitude: origine_lat, longitude: origine_lng},
    //     {latitude: -15.01245, longitude: 28.23158}
    // ]

    // const calculateDistanceTrans = (pointAT, pointBT) => {
    //     const distanceKm = haversine(pointAT, pointBT) / 1000; // Convert meters to km
    //     return distanceKm < 1 ? `${Math.round(distanceKm * 1000) || ''} meters` : `${distanceKm.toFixed(2) || 0}Km`;
    // };

    // const pointAT = directions_trans[0]; // Transporter
    // const pointBT = directions_trans[1]; // Store

    // const estimateTimeTrans = (pointAT, pointBT, averageSpeedKmh = 40) => {
    //     const distanceKm = haversine(pointAT, pointBT) / 1000;
    //     const timeHours = distanceKm / averageSpeedKmh;
    //     const totalMinutes = Math.ceil(timeHours * 60);
        
    //     const hours = Math.floor(totalMinutes / 60);
    //     const minutes = totalMinutes % 60;
      
    //     if (hours > 0) {
    //       return `${hours} hr${hours > 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
    //     } else {
    //       return `${minutes} min${minutes !== 1 ? 's' : ''}`;
    //     }
    // };

    const MakeCall = (phone_num) => {
        let phoneNumber = '';
        if (Platform.OS === 'android') {phoneNumber = `tel: +26${phone_num}`; }
        else {phoneNumber = `telprompt: +260${phone_num}`; }
        Linking.openURL(phoneNumber);
    };

    // API hook
    const {
        data: updateResponse,
        isLoading: updateLoading,
        error: updateError,
        patch: updateOrder,
    } = useApi(`/orders/update/`);

    const {
        data: findTransporterResponse,
        isLoading: findtranspoterLoading,
        error: findTranporterError,
        get: findtransporter,
    } = useApi(`/transporter/search?latitude=${data?.items[0]?.store_latitude}&longitude=${data?.items[0]?.store_longitude}`);
    
    console.log("IFYALO",findTransporterResponse)

    // Toast helper
    const showToast = (type, title, message, color) => {
        Toast.show({
            type,
            text1: title,
            text2: message,
            visibilityTime: 3000,
            animationType: 'slide',
            position: 'bottom',
            text1Style: {
                color,
                fontSize: 14,
                fontFamily: 'roboto-bold',
            },
                text2Style: {
                color,
                fontSize: 11,
                fontFamily: 'roboto-medium',
            },
        });
    };

    // Update order dynamically
    const handleUpdateOrder = async (nextStatus) => {
        if (!data?.order_id) return;

        const payload = {
            order_id: data.order_id,
            order_status: nextStatus,
        };

        try {
            await updateOrder(payload);
        } catch (err) {
            console.error('Order Error:', err);
            showToast('error', 'Order Failed', 'Something went wrong', 'red');
        }
    };

    const handleFindTransporter = () => {
        if (!data?.order_id) return;
        findtransporter()
        console.log("Find Transporter")
        // console.log("IFYALO",data)
    }

    // useEffect(() => {
    //     findtransporter
    // }, []);

    // Handle order response
    useEffect(() => {
        if (!updateResponse) return;

        if (updateResponse.success) {
            const orderMsg = `${updateResponse.message}`;
            showToast('success', 'Order Updated', orderMsg, '#32CD32');

            // Optional navigation/cleanup
            // setTimeout(() => {
            //   dispatch(clearCart());
            //   router.push('/orders');
            // }, 2000);

        } else {
            showToast(
                'error',
                'Order Failed', updateResponse.message || 'Unknown error',
                'red'
            );
        }
    }, [updateResponse]);
    
    // mapping to avoid brittle ternaries
    const STATUS_CONFIG = {
        pending: {
            bg: 'bg-coral',
            label: 'Accept Order',
            instruction: 'You can now accept this order.',
            disabled: false,
        },
        processing: {
            bg: 'bg-blue-500',
            label: 'Processing...',
            instruction: 'This order is being processed.',
            disabled: true,
        },
        accepted: {
            bg: 'bg-indigo-500',
            label: 'Find Transporter',
            instruction: 'This order has been accepted. Find transporter when ready.',
            disabled: false,
        },
        in_progress: {
            bg: 'bg-purple-500',
            label: 'Mark as Completed',
            instruction: 'This order is in transit.',
            disabled: false,
        },
        completed: {
            bg: 'bg-green-600',
            label: 'Completed',
            instruction: 'This order has been successfully delivered.',
            disabled: true,
        },
        cancelled: {
            bg: 'bg-red-600',
            label: 'Cancelled',
            instruction: 'This order has been cancelled.',
            disabled: true,
        }
    };
    const cfg = STATUS_CONFIG[data?.order_status] ?? { bg: 'bg-gray-400', label: '', disabled: true };
{/* Loading indicator */}
    {updateLoading && <LoadingIndicator loading_text="Updating order..." />}
    return (
        <>
            <View className='px-4'>
                <FlatList
                    data={data?.items || []} // Use the nested items array
                    keyExtractor={(item, index) => item.order_item_id || `${data.order_id}-${item.product_id}-${index}`} // Use unique order_item_id
                    renderItem={({item}) => (
                        <View>
                            <OrdersData order={item} router={router}/>
                            <View className='w-full my-4 rounded-full bg-slate opacity-10 h-[1px]'/>
                        </View>
                    )}

                    // Place all static UI elements inside ListHeaderComponent
                    ListHeaderComponent={() => (
                        <View className='flex-row justify-between items-center my-6'>
                            <Text className='mt-1 text-base' style={{fontFamily: 'roboto-medium'}}>Order No: {data?.order_number}</Text>
                            <View className='flex-row justify-start items-center py-[1px] px-2 rounded-full bg-[#F3F4F8]'>
                                <View className='rounded-full bg-red border-1 border-red mr-1 h-[10px] w-[10px]'/>
                                <Text className='text-red' style={{fontFamily: 'roboto-medium'}}>Pending</Text>
                            </View>
                        </View>
                    )}

                    ListFooterComponent={() => (
                        <>
                            <View className='mt-4 mb-6 w-full flex-row justify-between items-center'>
                                <Text className='text-2xl' style={{fontFamily: 'ubuntu-medium'}}>Grand Total</Text>
                                <View
                                    className='bg-red items-center justify-center'
                                    style={{
                                        padding: 5,
                                        borderRadius: SIZES.radius,
                                        width: buttonWidth,
                                        height: height * 0.06
                                    }}
                                >
                                    <Text style={{fontFamily: 'ubuntu-medium'}} className='text-xl text-white'>K{params.grand_total}</Text>
                                </View>
                            </View>

                            <View className='w-full'>
                                <View className='mb-2 bg-grey_bg rounded-full justify-center items-center p-1'>
                                    <Text className='text-xl' style={{fontFamily: 'ubuntu-medium'}}>Client's Details</Text>
                                </View>

                                <View className='w-full flex-row justify-between items-center mb-3'>
                                    <TouchableOpacity className='w-[83%] flex-row justify-start items-center mb-3'>
                                        <View className='border-2 border-lavender rounded-full' style={{height: 47, width: 47}}>
                                        <Image
                                            source={{uri: `${PRODUCTS_IMAGE_URI}${data?.items[0]?.profile_image}`}}
                                            className='rounded-full h-full w-full'
                                        />
                                        </View>
                                        <View className='ml-2'>
                                            <Text className='text-base' style={{fontFamily: 'roboto-medium'}}>{data?.items[0]?.first_name} {data?.items[0]?.last_name}</Text>
                                            <Text className='text-slate text-sm' style={{fontFamily: 'roboto-medium', fontSize: SIZES.small}}>{data?.items[0]?.phone_num}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity className='w-[15%] items-center justify-center'
                                        onPress={() => MakeCall(data?.items[0]?.phone_num)}
                                    >
                                        <View className='border-2 border-lavender items-center justify-center bg-green2 rounded-full' style={{height: 47, width: 47}}>
                                            <FontAwesome5 name='phone' color={COLORS.white} size={15} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    // onPress={() => router.push({pathname: '../maps/user-store-order-map', params: {
                                    //     store_latitude:data[0]?.store_latitude,
                                    //     store_longitude:data[0]?.store_longitude,
                                    //     store_name: data[0]?.store_name,
                                    //     store_profileImage: data[0]?.store_profileImage,
                                    //     store_phone_num: data[0]?.store_phone_num
                                    // }})}
                                    className='flex-row rounded-full w-full justify-between items-center'>
                                    <View className='flex-row bg-grey_bg rounded-full w-[80%] justify-center items-center p-3'>
                                        <Ionicons name='location-sharp' size={15} color={COLORS.green2 } />
                                        <Text className='text-sm text-green2'>Client is {calculateDistance(pointA, pointB)} Away | {estimateTime(pointA, pointB)}</Text>
                                    </View>

                                    <View className='w-[15%] items-center justify-center'>
                                        <View className='border-2 border-lavender items-center justify-center bg-grey_bg rounded-full' style={{height: 47, width: 47}}>
                                            <Ionicons name='location-sharp' size={20} color={COLORS.green2} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {data?.order_status !== 'processing' || data?.transporter_id === null ||data?.transporter_type &&
                                <View className='w-full mt-10'>
                                    <View className='mb-2 bg-grey_bg rounded-full justify-center items-center p-1'>
                                        <Text className='text-xl' style={{fontFamily: 'ubuntu-medium'}}>Transporter - Bike</Text>
                                        {/* <Text className='text-lg' style={{fontFamily: 'maven-bold'}}>Transporter - {gettransporter?.courier_type}</Text> */}
                                    </View>

                                    <View className='w-full flex-row justify-between items-center mb-3'>
                                        <TouchableOpacity className='w-[83%] flex-row justify-start items-center mb-3'>
                                            <View className='border-2 border-lavender rounded-full' style={{height: 47, width: 47}}>
                                                {/* <Image className='rounded-full h-full w-full' source={{uri: `${USER_IMAGE_URI}${gettransporter?.profile_image}`}} /> */}
                                            </View>
                                            <View className='ml-2'>
                                                <Text className='text-base' style={{fontFamily: 'maven-bold'}}>Sylveter</Text>
                                                <Text className='text-slate' style={{fontFamily: 'maven-medium', fontSize: SIZES.small}}>0973304006</Text>
                                            </View>
                                            {/* <View className='ml-2'>
                                                <Text className='text-md' style={{fontFamily: 'maven-bold'}}>{gettransporter?.first_name} {gettransporter?.last_name}</Text>
                                                <Text className='text-slate' style={{fontFamily: 'maven-medium', fontSize: SIZES.small}}>{gettransporter?.phone_num}</Text>
                                            </View> */}
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            className='w-[15%] items-center justify-center'
                                            // onPress={() => MakeCall('0973304006')}
                                        >
                                            <View className='border-2 border-lavender items-center justify-center bg-green2 rounded-full' style={{height: 47, width: 47}}>
                                                <FontAwesome5 name='phone' color={COLORS.white} size={15} />
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                    <View className='flex-row justify-center items-center w-full mb-2'>
                                        <Text>
                                            {/* <Text className='text-slate' style={{fontFamily: 'maven-bold'}}>{gettransporter.courier_type === 'Motor-Car' ? 'Car' : 'Bike'}: {gettransporter?.transporter_car_bike_color} {gettransporter?.transporter_car_bike_name} {gettransporter?.transporter_car_model} - </Text> */}
                                            {/* <Text className='text-slate' style={{fontFamily: 'maven-bold'}}>Reg: {gettransporter?.transporter_car_bike_reg_number}</Text> */}
                                            <Text className='text-slate' style={{fontFamily: 'maven-bold'}}>Reg: 12587</Text>
                                        </Text>
                                    </View>
                                    
                                    <TouchableOpacity
                                        onPress={() => router.push({pathname: '../maps/user-transporter-map/', params: {
                                            // transporter_id:gettransporter?.user_id
                                        }})}
                                        className='flex-row rounded-full w-full justify-between items-center'>
                                        <View className='flex-row bg-grey_bg rounded-full w-[82%] justify-center items-center p-2'>
                                            <Ionicons name='location-sharp' size={15} color={COLORS.green2 } />
                                            {/* <Text className='text-sm text-green2' style={{fontFamily: 'maven-medium'}}>Transporter is {calculateDistanceTrans(pointAT, pointBT)} Away | {estimateTimeTrans(pointAT, pointBT)}</Text> */}
                                        </View>

                                        <View className='w-[15%] items-center justify-center'>
                                            <View className='border-2 border-lavender items-center justify-center bg-grey_bg rounded-full' style={{height: 47, width: 47}}>
                                                <Ionicons name='location-sharp' size={20} color={COLORS.green2} />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            }
                            <View className='w-full justify-center items-center'>
                                <View className='w-[70%] flex-row justify-center p-2 items-center my-6 bg-primary rounded-full'>
                                    <Text className='text-lg text-white' style={{fontFamily: 'roboto-medium'}}>Status: {data?.order_status}</Text>
                                    {/* <Text className='text-white text-lg ml-2' style={{fontFamily: 'maven-bold'}}>{params.order_status.charAt(0).toUpperCase() + params.order_status.slice(1)}</Text> */}
                                </View>
                            </View>

                            {/* Instruction text above the button */}
                            {cfg.instruction !== '' && (
                            <Text
                                className="text-base text-center text-green2"
                                style={{ fontFamily: 'roboto-medium' }}
                            >
                                {cfg.instruction}
                            </Text>
                            )}

                            {/* Action button */}
                            {data?.order_status === 'accepted' ?
                                <View className='w-full flex-row justify-between items-center mb-6 mt-3'>
                                    <TouchableOpacity
                                        className={`bg-red p-3 justify-center w-full items-center rounded-md`}
                                        onPress={handleFindTransporter}
                                        // disabled={disabled || updateLoading}
                                    >
                                        <Text className="text-white text-2xl" style={{ fontFamily: 'ubuntu-medium' }}>
                                            {updateLoading ? 'Updating...' : 'Find Transporter'}
                                        </Text>
                                    </TouchableOpacity>
                                </View> :

                                <View className='w-full flex-row justify-between items-center mb-6 mt-3'>
                                    <TouchableOpacity
                                        className={`${cfg.bg} p-3 justify-center w-full items-center rounded-md`}
                                        onPress={() => handleUpdateOrder('accepted')}
                                        disabled={cfg.disabled || updateLoading}
                                    >
                                        <Text className="text-white text-2xl" style={{ fontFamily: 'ubuntu-medium' }}>
                                            {updateLoading ? 'Updating...' : cfg.label}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            <View className='w-full flex-row justify-between items-center mb-6 mt-3'>
                                <TouchableOpacity
                                    className={`${cfg.bg} p-3 justify-center w-full items-center rounded-md`}
                                    onPress={() => handleUpdateOrder('accepted')}
                                    disabled={cfg.disabled || updateLoading}
                                >
                                    <Text className="text-white text-2xl" style={{ fontFamily: 'ubuntu-medium' }}>
                                        {updateLoading ? 'Updating...' : cfg.label}
                                    </Text>
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
                />
            </View>
            <Toast/>
        </>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.transparentBlack,
    },
    modalView: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },

        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default AdminSingleOrderCard
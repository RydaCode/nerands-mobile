import { Entypo, FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import haversine from 'haversine-distance';
import { useEffect, useState } from 'react';
import { FlatList, Image, Linking, Modal, Pressable, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Toast from 'react-native-toast-message';
import { PRODUCTS_IMAGE_URI, USER_IMAGE_URI } from '../../RequestMethods';
import LoadingIndicator from '../../app/LoadingIndicator';
import Redirecting from '../../app/Redirecting';
import { COLORS, SIZES } from '../../constants/constants';
import useApi from '../../hook/useApi';
import useUpdate from '../../hook/useUpdate';

const OrdersData = ({ order, router }) => {
    const { width, height } = useWindowDimensions();

    // Calculate dynamic sizes based on screen width/height
    const imageWidthModal = width * 0.29; // 29% of the screen width for the image
    const imageHeightModal = height * 0.12; // 12% of the screen height for the image
    const buttonWidth = width * 0.4; // 40% of the screen width for buttons

    const [orderFullInfoModalVisible, setOrderFullInfoModalVisible] = useState(false);
    const [extras, setExtras] = useState(false);
    const {data: extradata, isLoading: isLoadingExtras, error: errorextras} = useApi(`/product/productextras/${order.product_id}/${order.order_id}/`);
    return (
        <>
            {/* Start public modal */}
            <TouchableOpacity
                className='flex-1 justify-center items-center'
                onPress={() => setOrderFullInfoModalVisible(false) }
            >
                <Modal
                    animationType="slide"
                    transparent={true}
                    statusBarTranslucent={true}
                    visible={orderFullInfoModalVisible}
                    onRequestClose={() => { setOrderFullInfoModalVisible(false); }}
                >
                    <Pressable
                        className='flex-1 justify-center items-center bg-transparentBlack'
                        onPress={() => setOrderFullInfoModalVisible(false)}
                    />
                    <View className='flex-1 justify-center items-center w-full mb-14'>
                        <View
                            className='bg-white w-full p-3'
                            style={{ maxWidth: width, borderRadius: SIZES.border }}
                        >
                            <Pressable
                                onPress={() => setOrderFullInfoModalVisible(false)}
                                className='flex-row justify-between mb-3'
                            >
                                <Text className='text-black text-2xl' style={{fontFamily: 'maven-bold'}}>Product Details</Text>
                                <View className='bg-red rounded-full justify-center items-center w-7 h-7' >
                                    <Entypo name="cross" color={COLORS.white} />
                                </View>
                            </Pressable>

                            {/* Product Image and Info */}
                            <View className='flex-row mb-4'>
                                <View className='relative' style={{ width: imageWidthModal, height: imageHeightModal }}>
                                    <Image className='w-full h-full'
                                        source={{uri: `${PRODUCTS_IMAGE_URI}${order.product_image}`}}
                                        style={{ borderRadius: SIZES.radius, resizeMode: 'cover' }}
                                    />
                                    <View
                                        className='absolute top-0 left-0 right-0 w-full h-full bottom-0 bg-black opacity-70 justify-center items-center'
                                        style={{ borderRadius: SIZES.border }}
                                    >
                                        <MaterialCommunityIcons name="lock" size={16} color={COLORS.lite} />
                                        <Text className='text-white text-sm'>Unavailable</Text>
                                    </View>
                                </View>
                                <View className='justify-center ml-[10px]'>
                                    <Text className='text-xl' style={{ fontFamily: 'maven-bold' }}>{order.product_name}</Text>
                                    <Text className='text-red text-xl'  style={{ fontFamily: 'maven-bold' }}>ZMK {order.product_actual_price}</Text>
                                    <Text className='text-slate text-sm' style={{ fontFamily: 'roboto-medium' }}>From: {order.store_name}</Text>
                                </View>
                            </View>

                            <Text className='text-ms text-slate mb-4' style={{fontFamily: 'roboto-medium'}}>{order.product_notes}</Text>

                            {/* Quantity Control */}
                            <View className='flex-row justify-between items-center mb-6'>
                                <Text className='text-xl' style={{fontFamily: 'maven-bold'}}>Quantity</Text>
                                <View className='flex-row items-center'>
                                    <Text className='text-xl' style={{fontFamily: 'maven-bold'}}>{order.quantity}</Text>
                                </View>
                            </View>

                            {/* Extras Section */}
                            <View className='mb-7'>
                            {Array.isArray(extradata) && extradata.length > 0 ?
                                <Text className='mb-2 text-lg' style={{ fontFamily: 'maven-bold'}}>Extras</Text>: null}
                                <View className='mb-4'>
                                {Array.isArray(extradata) && extradata.length > 0 ? (
                                    extradata.map((item, index) => (
                                        <View className='w-full flex-row items-center justify-between mb-3' key={index}>
                                            <View className='w-[80%]'>
                                                <BouncyCheckbox
                                                    isChecked={true}
                                                    disabled={true}
                                                    text={item.extra_name}
                                                    textStyle={{ textDecorationLine: "none", color: COLORS.slate, marginLeft: -10, fontSize: 13 }}
                                                    size={20}
                                                    fillColor={COLORS.green2}
                                                    iconStyle={{ borderColor: COLORS.green2, borderRadius: 2 }}
                                                    innerIconStyle={{ borderWidth: 2, borderRadius: 2 }}
                                                />
                                            </View>
                                            <Text className='text-md' style={{fontFamily: 'maven-medium', color: COLORS.primary }}>K{item.extra_price}</Text>
                                        </View>
                                    ))
                                ) : null}
                                </View>
                            </View>

                            {/* Total Amount */}
                            <View className='flex-row items-center justify-between mb-5'>
                                <Text className='text-2xl' style={{ fontFamily: 'maven-bold' }}>Total:</Text>
                                <View
                                    className='bg-primary items-center justify-center P-[5px]'
                                    style={{ borderRadius: SIZES.radius, width: buttonWidth, height: height * 0.06 }} >
                                    <Text style={{fontFamily: 'maven-bold'}} className='text-2xl text-white'>ZMK {order.product_price}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </TouchableOpacity>
            {/* End product modal */}
        
            <TouchableOpacity
                onPress={() => setOrderFullInfoModalVisible(true)}
                className='flex-row justify-between items-center'
            >
                <View className='flex-row justify-start items-center'>
                    <Image
                        source={{uri: `${PRODUCTS_IMAGE_URI}${order.product_image}`}}
                        style={{borderRadius: SIZES.radius}} className='h-[65px] w-[26%]'
                    />
                    <View className='w-[71.7%] flex-row ml-2 justify-between items-center'>
                        <View className='w-[90%]'>
                            <View className=''>
                                <Text className='text-md' style={{fontFamily: 'maven-bold'}}>{order.product_name}</Text>
                            </View>
                            <View className='flex-row justify-between items-center'>
                                <View>
                                    <Text className='text-lg text-primary' style={{fontFamily: 'maven-bold'}}>K{order.product_price}</Text>
                                </View>
                                <View className='flex-row items-center justify-start mr-4'>
                                    <Text className='text-slate text-sm' style={{fontFamily: 'maven-medium',}}>Qty:{order.quantity}</Text>
                                </View>
                            </View>
                            <View className='flex-row justify-between items-center'>
                                <View className='flex-row items-center justify-start mr-4'>
                                    <Text numberOfLines={1} className='text-grey text-sm' style={{fontFamily: 'maven-medium'}}>{order.product_notes}</Text>
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

const AdminSingleOrderCard = (props) => {
    const router = useRouter();
    const user_id = '20250224_1629007291740407340729_67bc822cb1de46.283611430da19cbb202460a3e5c9b65232566259';
    const {data: orderdata, isLoading: isLoadingOrder, error: errororder} = useApi(`/order/adminorders/${props.store_id}/${props.order_id}/`);
    const {data: userdata, isLoading: isLoadingUser, error: erroruser} = useApi(`/user/users/${props.user_id}/`);
    
    const { width, height } = useWindowDimensions();
    const buttonWidth = width * 0.4; // 40% of the screen width for buttons

    // Custom hook for handling API request (accepting order)
    const { update:acceptorder, updateLoading:acceptOrderLoading, updateError:acceptOrderError, resend:acceptorderresend } = useUpdate(`/order/update/`, {
        order_id: props.order_id,
        process_order: 'YES',
        order_status: 'processing'
    });

    // Custom hook for handling API request (cancel order)
    const { update:cancelorder, updateLoading:cancelOrderLoading, updateError:cancelOrderError, resend:cancelorderresend } = useUpdate(`/order/update/`, {
        order_id: props.order_id,
        process_order: 'YES',
        order_status: 'cancelled'
    });

    const {data:gettransporter, isLoading:transporterloading, error:transportererrors, refetch:transporterrefetch} = useApi(`/deliveryman/transporter/${orderdata[0]?.user_id}`);

    // console.log(gettransporter)

    const [errorMessage, setErrorMessage] = useState('');
    const [redirect, setRedirect] = useState(false);

    const calculateDistance = (pointA, pointB) => {
        const distanceKm = haversine(pointA, pointB) / 1000; // Convert meters to km
        return distanceKm < 1 ? `${Math.round(distanceKm * 1000)} meters` : `${distanceKm.toFixed(2)} km`;
    };

    const pointA = { latitude: props.user_latitude, longitude: props.user_longitude }; // User
    const pointB = { latitude: props.store_latitude, longitude: props.store_longitude }; //Store
    
    const calculateTransporterDistance = (pointAT, pointBT) => {
        const distanceKm = haversine(pointAT, pointBT) / 1000; // Convert meters to km
        return distanceKm < 1 ? `${Math.round(distanceKm * 1000)} meters` : `${distanceKm.toFixed(2)} km`;
    };

    const pointAT = { latitude: gettransporter?.latitude, longitude: gettransporter?.longitude }; // User
    const pointBT = { latitude: props.store_latitude, longitude: props.store_longitude }; //Store

    useEffect(() => {
        if (acceptorder && acceptorder.Response) {
            setErrorMessage(acceptorder.Response);
            if (acceptorder.Response === 'Success') {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Order accepted',
                    visibilityTime: 4000,
                    position: 'bottom',
                    text1Style: { color: '#32CD32', fontSize: 18, fontFamily: 'maven-bold' },
                    text2Style: { color: '#32CD32', fontSize: 14, fontFamily: 'maven-medium' },
                });
                // setTimeout(() => {
                //         router.back(); // Redirect after 4 seconds
                //         setRedirect(true);
                // }, 4000);
            } else {
                showToastError(acceptorder.Response);
            }
        }
        if (cancelorder && cancelorder.Response) {
            setErrorMessage(cancelorder.Response);
            if (cancelorder.Response === 'Success') {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Order accepted',
                    visibilityTime: 4000,
                    position: 'bottom',
                    text1Style: { color: '#32CD32', fontSize: 18, fontFamily: 'maven-bold' },
                    text2Style: { color: '#32CD32', fontSize: 14, fontFamily: 'maven-medium' },
                });
                setTimeout(() => {
                        // router.back(); // Redirect after 4 seconds
                        setRedirect(true);
                }, 4000);
            } else {
                showToastError(cancelorder.Response);
            }
        }
        if (acceptOrderError) {
            showToastError("An error occurred. Please try again.");
        }
    }, [acceptorder, cancelorder, acceptOrderError]);

    const showToastError = (message) => {
        setErrorMessage(message);
        Toast.show({
            type: 'error', 
            text1: 'Error', 
            text2: message,
            visibilityTime: 4000,
            position: 'bottom',
            text1Style: { color: 'red', fontSize: 18, fontFamily: 'maven-bold' },
            text2Style: { color: 'red', fontSize: 14, fontFamily: 'maven-medium' },
        });
    };

    const makePhoneCall = (phoneNumber) => {
        if (!phoneNumber || typeof phoneNumber !== 'string') {
            showToastError("Invalid phone number.");
            return;
        }
    
        let url = `tel:${phoneNumber}`;
        Linking.openURL(url).catch((err) => {
            console.error('Error:', err);
            showToastError("Failed to make the call.");
        });
    };

    const handleAcceptOrder = () => {
        //Accept order
        acceptorderresend();
    };

    const handleDeclineOrder = () => {
        //Decline order
        cancelorderresend();
    };

    if (redirect) {
        return <Redirect />;
    }
    
    // console.log(orderdata[0]?.store_id)

    return (
        <View className='mx-2 pb-10'>
            <FlatList
                data={orderdata}
                keyExtractor={(item) => item.o_id}
                renderItem={({item}) => (
                    <View>
                        <OrdersData order={item} router={router}/>
                        <View className='w-full my-4 rounded-full bg-slate opacity-10 h-[1px]'/>
                    </View>
                )}

                ListHeaderComponent={() => (
                    <View className='flex-row justify-between items-center my-6'>
                        <Text className='mt-1 text-2xl' style={{fontFamily: 'maven-bold'}}>Order No: {orderdata[0]?.order_number}</Text>
                        <View className='flex-row justify-start items-center py-[1px] px-2 rounded-full bg-[#F3F4F8]'>
                            <View className='rounded-full bg-red border-1 border-red mr-1 h-[10px] w-[10px]'/>
                            <Text className='text-red' style={{fontFamily: 'maven-medium'}}>Pending</Text>
                        </View>
                    </View>
                )}

                ListFooterComponent={() => (
                    <>
                        <View className='mt-4 mb-6 w-full flex-row justify-between items-center'>
                            <Text className='text-2xl' style={{fontFamily: 'maven-bold'}}>Grand Total</Text>
                            <View
                                className='bg-primary items-center justify-center'
                                style={{ padding: 5, borderRadius: SIZES.radius,  width: buttonWidth, height: height * 0.06 }} >
                                <Text style={{fontFamily: 'maven-bold'}} className='text-xl text-white'>ZMK {props.grand_total}</Text>
                            </View>
                        </View>
                        <View className='mb-2 bg-grey_bg rounded-full justify-center items-center p-1'>
                            <Text className='text-lg' style={{fontFamily: 'maven-bold'}}>Client's Details</Text>
                        </View>
                        <View className='w-full flex-row justify-between items-center mb-3'>
                            <TouchableOpacity className='w-[83%] flex-row justify-start items-center mb-3'>
                                <View className='border-2 border-lavender rounded-full' style={{height: 47, width: 47}}>
                                    <Image className='rounded-full h-full w-full' source={{uri: `${USER_IMAGE_URI}${userdata[0]?.profile_image}`}} />
                                </View>
                                <View className='ml-2'>
                                    <Text className='text-md' style={{fontFamily: 'maven-bold'}}>{userdata[0]?.first_name} {userdata[0]?.last_name}</Text>
                                    <Text className='text-slate text-sm' style={{fontFamily: 'maven-medium'}}>{userdata[0]?.phone_num}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => makePhoneCall(userdata[0]?.phone_num)}
                                className='w-[15%] items-center justify-center'
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
                                <Ionicons name='location-sharp' size={20} color={COLORS.red } />
                                <Text className='text-sm text-red' style={{fontFamily: 'maven-medium'}}>Client is {calculateDistance(pointA, pointB)} Away</Text>
                            </View>

                            <View className='w-[15%] items-center justify-center'>
                                <View className='border-2 border-lavender items-center justify-center bg-grey_bg rounded-full' style={{height: 47, width: 47}}>
                                    <Ionicons name='location-sharp' size={20} color={COLORS.green2} />
                                </View>
                            </View>
                        </TouchableOpacity>

                        {gettransporter?.assign_order_id === orderdata[0]?.order_id ?
                            <View className='w-full mt-10'>
                                <View className='mb-2 bg-grey_bg rounded-full justify-center items-center p-1'>
                                    <Text className='text-lg' style={{fontFamily: 'maven-bold'}}>Transporter</Text>
                                </View>

                                <View className='w-full flex-row justify-between items-center mb-3'>
                                    <TouchableOpacity className='w-[83%] flex-row justify-start items-center mb-3'>
                                        <View className='border-2 border-lavender rounded-full' style={{height: 47, width: 47}}>
                                            <Image className='rounded-full h-full w-full' source={{uri: `${USER_IMAGE_URI}${gettransporter?.profile_image}`}} />
                                        </View>
                                        <View className='ml-2'>
                                            <Text className='text-md' style={{fontFamily: 'maven-bold'}}>{gettransporter?.first_name} {gettransporter?.last_name}</Text>
                                            <Text className='text-slate' style={{fontFamily: 'maven-medium', fontSize: SIZES.small}}>{gettransporter?.phone_num}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity className='w-[15%] items-center justify-center'>
                                        <View className='border-2 border-lavender items-center justify-center bg-green2 rounded-full' style={{height: 47, width: 47}}>
                                            <FontAwesome5 name='phone' color={COLORS.white} size={15} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                
                                <TouchableOpacity
                                    onPress={() => router.push({pathname: '../maps/user-transporter-map/', params: {

                                    }})}
                                    className='flex-row rounded-full w-full justify-between items-center'>
                                    <View className='flex-row bg-grey_bg rounded-full w-[80%] justify-center items-center p-2'>
                                        <Ionicons name='location-sharp' size={20} color={COLORS.red } />
                                        <Text className='text-sm text-red' style={{fontFamily: 'maven-medium'}}>Transporter is {calculateTransporterDistance(pointAT, pointBT)} Away</Text>
                                    </View>

                                    <View className='w-[15%] items-center justify-center'>
                                        <View className='border-2 border-lavender items-center justify-center bg-grey_bg rounded-full' style={{height: 47, width: 47}}>
                                            <Ionicons name='location-sharp' size={20} color={COLORS.green2} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View> : <></>
                        }

                        <View className='w-full justify-center items-center mt-6'>
                            <Text className='text-red text-lg' style={{fontFamily: 'maven-medium'}}>
                                {orderdata[0]?.order_status === 'pending' ? (
                                    'Pending'
                                    ) : orderdata[0]?.order_status === 'processing' ? (
                                        'Processing...'
                                    ) : orderdata[0]?.order_status === 'in_progress' ? (
                                        'In Transit'
                                    ) : orderdata[0]?.order_status === 'delivered' ? (
                                        'Delivered'
                                    ) : orderdata[0]?.order_status === 'cancelled' ? (
                                        'Cancelled'
                                    ) : (
                                        'Order Error'
                                    )
                                }
                            </Text>
                        </View>

                        {orderdata[0]?.order_status === 'cancelled' ?
                            <View className='w-full items-center mb-6 mt-3'>
                                <TouchableOpacity
                                    className='w-full bg-red p-3 justify-center items-center'
                                    // onPress={handleDeclineOrder}
                                >
                                    <Text className='text-white text-xl' style={{fontFamily: 'maven-medium'}}>Delete Order</Text>
                                </TouchableOpacity>
                            </View> :
                            <View className='w-full flex-row justify-between items-center mb-6 mt-3'>
                                {orderdata[0]?.order_status === 'pending' ? (
                                    <TouchableOpacity
                                        disabled={orderdata[0]?.order_status !== 'processing' || orderdata[0]?.order_status !== 'pending' ? false : true}
                                        className='w-[56%] bg-green2 p-3 justify-center items-center'
                                        onPress={handleAcceptOrder}
                                    >
                                        <Text className='text-white text-xl' style={{fontFamily: 'maven-medium'}}>Accept</Text>
                                    </TouchableOpacity>
                                    ) : orderdata[0]?.order_status === 'processing' && gettransporter.length < 0 ? (
                                        <TouchableOpacity
                                            disabled={orderdata[0]?.order_status !== 'processing' || orderdata[0]?.order_status !== 'pending' ? false : true}
                                            className='w-[56%] bg-green2 p-3 justify-center items-center'
                                            onPress={() => router.push({pathname: '../transporter/FindTransporter/', params: {
                                                store_latitude: orderdata[0]?.store_latitude,
                                                store_longitude: orderdata[0]?.store_longitude,
                                                assign_order_id: orderdata[0]?.order_id,
                                                assigned_store_id: orderdata[0]?.store_id,
                                                assigned_order_number: orderdata[0]?.order_number,
                                                assigned_store_name: orderdata[0]?.store_name,
                                                assign_store_latitude: orderdata?.store_latitude,
                                                assign_store_longitude: orderdata[0]?.store_longitude,
                                                destination_latitude: orderdata[0]?.user_latitude,
                                                destination_longitude: orderdata[0]?.user_longitude,
                                                store_assign_phone: orderdata[0]?.store_phone_num,
                                                destination_phone: userdata[0]?.phone_num,
                                                store_profileImage: orderdata[0]?.store_profileImage
                                            }})}
                                        >
                                            <Text className='text-white text-xl' style={{fontFamily: 'maven-medium'}}>Find Transporter</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <></>
                                    )
                                }
                                <TouchableOpacity
                                    style={{width: orderdata[0]?.order_status === 'processing' && gettransporter.length < 0 ? '100%' : '42%'}}
                                    className='bg-red p-3 justify-center items-center'
                                    onPress={handleDeclineOrder}
                                >
                                    <Text className='text-white text-xl' style={{fontFamily: 'maven-medium'}}>Decline</Text>
                                </TouchableOpacity>
                            </View>
                        }

                        <Toast/>
                        {acceptOrderLoading ? <LoadingIndicator loading_text='Accepting Order...'/> : <></>}
                        {cancelOrderLoading ? <LoadingIndicator loading_text='Cancelling Order...'/> : <></>}
                        {errorMessage === 'Success' ? <Redirecting title='Success'/> : <></>}
                    </>
                )}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default AdminSingleOrderCard
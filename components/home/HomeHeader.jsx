import { COLORS } from '@/constants/constants';
import { useResponsive } from '@/hook/useResponsive';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { SIZES } from '../../constants/constants';
import { Carticons } from '../../constants/icons';
import { useNotificationModal } from './NotificationContext';
// import { useLocation } from '../../LocationContext';
// import { useSelector } from 'react-redux';

const HomeHeader = ({ location }) => {
    // const { displayCurrentLocation, locationServicesEnabled } = useLocation();
    // const { latitude, longitude, displayCurrentLocation, locationServicesEnabled } = useSelector(state => state.location);
    const router = useRouter();

    const othersCartItems = useSelector(state => state.otherscart.othersCartItems);
    const cartItems = useSelector(state => state.cart.cartItems);
    const localMarketCart = useSelector(state => state.localmarketcart.localMarketCartItems);
    const unreadCount = useSelector(state => state.notifications.notifications);

    const {
        openNotifications
    } = useNotificationModal();

    const finalNotCount = (unreadCount?.length > 99 ? '99+' : unreadCount?.length) || 0;

    const totalOtherCartItems = othersCartItems.reduce(
        (sum, item) => sum + (item.product_qty || 0),
        0
    );

    const totalFoodCartItems = cartItems.reduce(
        (sum, item) => sum + (item.product_qty || 0),
        0
    );

    const totaLocalMarketCartItems = localMarketCart.reduce(
        (sum, item) => sum + (item.product_qty || 0),
        0
    );

    const cartNum = totalFoodCartItems + totalOtherCartItems + totaLocalMarketCartItems || 0;

    const {
        responsiveSize,
        isTablet
    } = useResponsive();
    return (
        <View className='items-center w-full'>
            <View className='w-full flex-row justify-between items-center'>
                {/* <View className='justify-center items-center' style={{width: '30%', height: 30}}>
                    <Image className='w-full' style={{height: 33}} source={Carticons.navlogo} resizeMode='contain'/>
                </View> */}
                <View>
                    <View className='flex-row items-center'>
                        <View
                            style={{width: 40, height: 30}}
                        >
                            <Image className='h-full w-full' source={Carticons.navlogo} resizeMode='contain'/>
                        </View>
                        <Text className=' text-primary text-2xl' style={{fontFamily: 'maven-bold', fontWeight: SIZES.h2}} >Nerands</Text>
                    </View>
                </View>
                <View className='flex-row justify-between items-center mr-2' style={{width: '34%'}}>
                    <TouchableOpacity
                        style={{ backgroundColor: COLORS.navBtnBgHome, height: responsiveSize(8, 30, 40), width: responsiveSize(8, 30, 40) }}
                        className='rounded-full justify-center items-center'
                    >
                        <Ionicons name='search' size={20} color={COLORS.black} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={openNotifications}
                        style={{ backgroundColor: COLORS.navBtnBgHome, height: responsiveSize(8, 30, 40), width: responsiveSize(8, 30, 40) }}
                        className='bg-blue-500 rounded-full justify-center items-center relative'
                    >
                        <FontAwesome name="bell" size={17} color={COLORS.black} />
                        {/* <Text className='text-2xl'>🥗</Text> */}
                        <View
                            style={{width: responsiveSize(8, 12, 23), height: responsiveSize(8, 12, 23)}}
                            className='absolute left-5 -top-[5px] bottom-0 border border-white justify-center items-center bg-red size-[21px] rounded-full'
                        >
                            <Text className='text-white text-sm'>{finalNotCount}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.push('../../cart/')}
                        style={{ backgroundColor: COLORS.navBtnBgHome, height: responsiveSize(8, 30, 40), width: responsiveSize(8, 30, 40) }}
                        className='rounded-full justify-center items-center relative'
                    >
                        {/* <FontAwesome name="bell" size={17} color={COLORS.slate} /> */}
                        <FontAwesome6 name="bag-shopping" size={17} color={COLORS.black} />
                        <View
                            style={{width: responsiveSize(8, 12, 23), height: responsiveSize(8, 12, 23)}}
                            className='absolute left-5 -top-[5px] bottom-0 border border-white justify-center items-center bg-red size-[21px] rounded-full'
                        >
                            <Text className='text-white text-sm'>{cartNum}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity
                onPress={() => router.push({pathname: '/(routes)/maps/user-map/', params: {
                    location
                }})}
                className='flex-row items-center justify-start pb-1 w-full'
            >
                <Ionicons name='location-sharp' size={14} color={COLORS.primary } />
                {/* <Text>📍</Text> */}
                <Text
                    numberOfLines={1}
                    className='text-sm text-slate mr-[5px] '
                    style={{fontFamily: 'roboto-medium'}}
                >{location || 'Fething location'}</Text>
                <Entypo name='chevron-down' type='entypo' size={18} color={COLORS.slate } />
            </TouchableOpacity>
        </View>
    )
}

export default HomeHeader
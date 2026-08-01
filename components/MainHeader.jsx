import { COLORS } from '@/constants/constants'
import { useResponsive } from '@/hook/useResponsive'
import { FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useNotificationModal } from './home/NotificationContext'

const MainHeader = ({ header_name, otherStyles, textStyles, fontFamily }) => {
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
        <View className={`flex-row pt-1 justify-between items-center w-full mb-1 ${otherStyles}`}>
            <View>
                <TouchableOpacity
                    className='rounded-full bg-primary justify-center items-center'
                    onPress={() => router.back()}
                    style={{ height: responsiveSize(8, 33, 43), width: responsiveSize(8, 33, 43)}}
                >
                    <FontAwesome name='angle-left' size={19} style={{ color: COLORS.white }} />
                </TouchableOpacity>
            </View>
            <View className='w-[47%] ml-1 items-center justify-center'>
                <Text numberOfLines={1} style={{fontFamily: `${fontFamily}`}} className={`${textStyles}`}>{header_name}</Text>
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
                    className='rounded-full justify-center items-center relative'
                >
                    <FontAwesome name="bell" size={17} color={COLORS.black} />
                    <View
                        style={{ top: -8, width: responsiveSize(8, 12, 23), height: responsiveSize(8, 12, 23) }}
                        className='absolute left-5 bottom-0 justify-center items-center bg-red border border-white rounded-full'
                    >
                        <Text className='text-white text-sm'>{finalNotCount}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.push('../cart/')}
                    style={{ backgroundColor: COLORS.navBtnBgHome, width: responsiveSize(8, 30, 40), height: responsiveSize(8, 30, 40) }}
                    className='rounded-full justify-center items-center relative'
                >
                    <View className='flex-row justify-center items-center'>
                        {/* <Text className='text-2xl'>📦</Text> */}
                        <FontAwesome6 name="bag-shopping" size={15} color={COLORS.black} />
                    </View>
                    <View
                        style={{ top: -8, width: responsiveSize(8, 12, 23), height: responsiveSize(8, 12, 23) }}
                        className='absolute left-5 bottom-0 justify-center items-center bg-red border border-white rounded-full'
                    >
                        <Text  className='text-white text-sm' >{cartNum}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default MainHeader
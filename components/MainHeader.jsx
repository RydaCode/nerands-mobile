import { COLORS, SIZES } from '@/constants/constants'
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
    return (
        <View className={`flex-row pt-1 justify-between items-center w-full mb-1 ${otherStyles}`}>
            <View>
                <TouchableOpacity
                    className='rounded-full bg-primary justify-center items-center'
                    onPress={() => router.back()}
                    style={{ height: SIZES.navBtn, width: SIZES.navBtn}}
                >
                    <FontAwesome name='angle-left' size={19} style={{ color: COLORS.white }} />
                </TouchableOpacity>
            </View>
            <View className='w-[47%] ml-1 items-center justify-center'>
                <Text numberOfLines={1} style={{fontFamily: `${fontFamily}`}} className={`${textStyles}`}>{header_name}</Text>
            </View>
            <View className='flex-row justify-between items-center'>
                <TouchableOpacity
                    style={{ backgroundColor: COLORS.navBtnBgHome }}
                    className='w-8 h-8 rounded-full justify-center items-center'
                >
                    <Ionicons name='search' size={20} color={COLORS.black} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={openNotifications}
                    style={{ backgroundColor: COLORS.navBtnBgHome }}
                    className='w-8 h-8 bg-blue-500 mx-4 rounded-full justify-center items-center relative'
                >
                    <FontAwesome name="bell" size={17} color={COLORS.black} />
                    {/* <View className='flex-row justify-center items-center'>
                        <Text className='text-2xl'>🥗</Text>
                        <FontAwesome name="shopping-cart" size={15} color={COLORS.slate} />
                    </View> */}
                    <View
                        style={{ top: -5, height: 21, width: 21 }}
                        className='absolute left-5 bottom-0 justify-center items-center bg-red border border-white rounded-full'
                    >
                        <Text className='text-white text-sm'>{finalNotCount}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.push('../cart/')}
                    style={{ backgroundColor: COLORS.navBtnBgHome }}
                    className='w-8 h-8 bg-blue-500 rounded-full mr-2 justify-center items-center relative'
                >
                    <View className='flex-row justify-center items-center'>
                        {/* <Text className='text-2xl'>📦</Text> */}
                        <FontAwesome6 name="bag-shopping" size={15} color={COLORS.black} />
                    </View>
                    <View
                        style={{ top: -5, height: 21, width: 21 }}
                        className='absolute w-8 h-8 left-5 bottom-0 justify-center items-center bg-red border border-white rounded-full'
                    >
                        <Text  className='text-white' style={{fontSize: 11}} >{cartNum}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default MainHeader
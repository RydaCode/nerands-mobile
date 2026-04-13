import { COLORS } from '@/constants/constants';
import { FontAwesome6 } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Carticons } from '../../constants/icons';
// import { useLocation } from '../../LocationContext';
// import { useSelector } from 'react-redux';

const HomeHeader = ({ location }) => {
    // const { displayCurrentLocation, locationServicesEnabled } = useLocation();
    // const { latitude, longitude, displayCurrentLocation, locationServicesEnabled } = useSelector(state => state.location);
    const router = useRouter();

    const othersCartItems = useSelector(state => state.otherscart.othersCartItems);
    const cartItems = useSelector(state => state.cart.cartItems);
    return (
        <View className='items-center w-full'>
            <View className='w-full flex-row justify-between items-center'>
                <View className='justify-start' style={{width: '30%', height: 40}}>
                    <Image className='w-full h-full' source={Carticons.navlogo} resizeMode='contain'/>
                </View>
                {/* <View>
                    <View className='flex-row items-center'>
                        <Image className='w-[37px] h-[37px]' source={Carticons.navlogo}/>
                        <Text className='ml-[5px] text-primary' style={{ fontSize: SIZES.mainTitles, fontFamily: 'outfit-bold', fontWeight: SIZES.h2}} >Nerands</Text>
                    </View>
                </View> */}
                <View className='flex-row justify-between items-center'>
                    <TouchableOpacity
                        style={{ backgroundColor: COLORS.navBtnBgHome }}
                        className='w-8 h-8 rounded-full justify-center items-center'
                    >
                        <Ionicons name='search' size={20} color={COLORS.slate} />
                    </TouchableOpacity>

                    {cartItems.length > 0 &&
                        <TouchableOpacity
                            onPress={() => router.push('../../cart/')}
                            style={{ backgroundColor: COLORS.navBtnBgHome }}
                            className='w-8 h-8 bg-blue-500 rounded-full mx-4 justify-center items-center relative'
                        >
                            {/* <FontAwesome name="bell" size={17} color={COLORS.slate} /> */}
                            <Text className='text-2xl'>🥗</Text>
                            <View
                                className='absolute left-5 -top-[5px] bottom-0 border-[1px] border-white justify-center items-center bg-red size-[21px] rounded-full'
                            >
                                <Text className='text-white text-sm'>{cartItems.length}</Text>
                            </View>
                        </TouchableOpacity>
                    }
                    {othersCartItems.length > 0 &&
                        <TouchableOpacity
                            onPress={() => router.push('../../cart/')}
                            style={{
                                backgroundColor: COLORS.navBtnBgHome,
                                marginLeft: cartItems.length > 0 ? 4 : 16
                            }}
                            className='w-8 h-8 bg-blue-500 rounded-full ml-4 justify-center items-center relative'
                        >
                            <Text className='text-2xl'>📦</Text>
                            {/* <FontAwesome name="shopping-cart" size={20} color={COLORS.slate} /> */}
                            <View
                                className='absolute left-5 -top-[5px] size-[21px] rounded-full bg-red bottom-0 border-white border-[1px] justify-center items-center'
                            >
                                <Text className='text-white text-sm'>{othersCartItems.length}</Text>
                            </View>
                        </TouchableOpacity>
                    }
                    {othersCartItems.length > 0 || cartItems.length > 0 ? <></> :
                        <TouchableOpacity
                            onPress={() => router.push('../../cart/')}
                            style={{ backgroundColor: COLORS.navBtnBgHome }}
                            className='w-8 h-8 rounded-full mx-4 justify-center items-center relative'
                        >
                            {/* <FontAwesome name="bell" size={17} color={COLORS.slate} /> */}
                            <FontAwesome6 name="bag-shopping" size={17} color="grey" />
                            <View
                                className='absolute left-5 -top-[5px] bottom-0 border-[1px] border-white justify-center items-center bg-red size-[21px] rounded-full'
                            >
                                <Text className='text-white text-sm'>0</Text>
                            </View>
                        </TouchableOpacity>
                    }
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
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import MainHeader from '../../components/MainHeader';
import MenuItem from '../../components/menu-items/MenuItem';
import { COLORS } from '../../constants/constants';

const Menu = () => {
    const { latitude, longitude, displayCurrentLocation } = useSelector(state => state.location);
    const router = useRouter();

    // Define the menu items dynamically
    const menuItems = [
        // { title: 'Stores', icon: <FontAwesome5 name="store-alt" color={"#54C571"} size={20} />, route: '../(routes)/stores-menu-items/' },
        { title: 'Parcels', 
            icon: 
                <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 47, height: 47}}>
                    <Ionicons size={20} name="bag-outline" color={COLORS.green1} />
                </View>,
            route: '../(routes)/parcels-menu-items/' },
        // { title: 'Hotels', icon: <FontAwesome6 name="hotel" color="#54C571" size={20} />, route: '../(routes)/hotels-menu-items/' },
        // { title: 'Bus Tickets', icon: <FontAwesome6 name="bus" color="#54C571" size={25} />, route: '../(routes)/bus-tickets/' },
        // { title: 'Transporter', icon: <MaterialCommunityIcons name="bike-fast" color="#54C571" size={27} />, route: '../(routes)/transporter/' },
        // { title: 'Runner', icon: <MaterialIcons name="directions-run" size={27} color="#54C571" />, route: '../(routes)/runner/' },
        // { title: 'Create Store', icon: <Ionicons name="create-outline" size={27} color="#54C571" />, route: '../(routes)/create-store/' },
        { title: 'Custom Order', icon:
            <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 47, height: 47}}>
                <Ionicons size={20} name="bag-outline" color={COLORS.purple} />
            </View>,
            route: '../(routes)/custom-order-menu-items/' },
        // { title: 'Sign Up', icon: <FontAwesome6 size={20} name="user-plus" color="#54C571" />, route: '../(routes)/sign-up/' },
        { title: 'My Account', icon:
            <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 47, height: 47}}>
                <FontAwesome size={21} name="user" color={COLORS.purple} />
            </View>,
            route: '../(routes)/user-account/' },
        // { title: 'Logout', icon: <FontAwesome5 name="sign-out-alt" size={20} color="red" />, route: '../(routes)/user-account/', textStyles: 'text-red' }
    ];

    return (
        <SafeAreaView className='flex-1 bg-white px-4'>
            <MainHeader textStyles='text-2xl' fontFamily='maven-medium' header_name='Menu' />
            <View className='w-full items-center mt-4'>
                <Text style={{ fontFamily: 'roboto' }}>Your current location:</Text>
            </View>
            <TouchableOpacity className='items-center justify-center mt-1 pb-1 w-full'>
                <View className='flex-row items-center justify-center mt-1 pb-1 w-full'>
                    <Ionicons name='location-sharp' size={14} color={COLORS.red} />
                    <Text
                        numberOfLines={1}
                        className='text-sm text-slate mr-[5px] '
                        style={{ fontFamily: 'roboto' }}
                    >
                        {displayCurrentLocation}
                    </Text>
                </View>
                {/* <View className='flex-row items-center justify-center mt-1 pb-1 w-full'>
                    <Text
                        numberOfLines={1}
                        className='text-sm text-slate mr-[5px] '
                        style={{ fontFamily: 'roboto' }}
                    >
                        {latitude === null ? 'Lat...' : latitude} || {longitude === null ? 'Long...' : longitude}
                    </Text>
                    <Entypo name='chevron-down' type='entypo' size={18} color={COLORS.slate} />
                </View> */}
            </TouchableOpacity>

            <View className='w-full mt-3 items-center justify-center'>
                <Text className='text-xl' style={{ fontFamily: 'roboto-medium' }}>Choose a service</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    flexGrow: 1,
                    width: '100%',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    paddingBottom: 20,
                }}
                className=' bg-white'>
                <MotiView
                    from={{ opacity: 0, translateY: 50 }}   // start hidden + lower
                    animate={{ opacity: 1, translateY: 0 }} // end visible + normal pos
                    transition={{ duration: 1000 }}
                    className='justify-end'
                >
                <View className='flex-row flex-wrap items-center justify-between'>
                    {menuItems.map((item, index) => (
                        <MenuItem
                            key={index}
                            title={item.title}
                            icon={item.icon}
                            router={router}
                            route_name={item.route}
                            textStyles={item.textStyles}
                        />
                    ))}
                </View>
                </MotiView>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Menu;
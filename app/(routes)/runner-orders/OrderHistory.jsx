import { Entypo, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import agoTimeStamp from '../../../components/agoTimeStamp';
import { COLORS } from '../../../constants/constants';
import { calculateDistance } from '../../../utils/getDistance';

const OrderHistory = ({title, historyData, reload}) => {
    const { user_id, runner_id, is_runner } = useSelector((s) => s.auth);
    const { latitude, longitude } = useSelector(state => state.location);
    const router = useRouter();

    const pointA = { latitude: latitude, longitude: longitude }; // User

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'red'; // orange
            case 'Processing':
                return '#3B82F6'; // blue
            case 'Accepted':
                return '#22C55E'; // green
            case 'In_Transit':
                return '#8B5CF6'; // purple
            case 'Delivered':
                return '#10B981'; // emerald
            default:
                return '#6B7280'; // gray
        }
    };

    return (
        <View className='justify-center items-center mt-1'>
            {historyData?.length === 0 ? (
                <View className='h-full justify-center items-center'>
                    <FontAwesome name='search' size={40} color={COLORS.slate}/>
                    <Text className='text-base text-slate mt-3' style={{fontFamily: 'roboto-medium'}}>
                        You currently have no order {title.toLowerCase()}
                    </Text>
                
                    <TouchableOpacity
                        onPress={reload}
                        className='flex-row justify-center items-center mt-4 px-6 py-2 bg-primary rounded'
                    >
                        {/* <ActivityIndicator size={20} color={COLORS.white}/> */}
                        <MaterialCommunityIcons name="reload" size={24} color="white" />
                        <Text
                            className='text-base text-white ml-1'
                            style={{fontFamily: 'roboto-medium'}}
                        >Reload</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={historyData || []}
                    keyExtractor={(item) => item.order_id}
                    renderItem={({item}) => (
                        <View className='justify-center items-center mt-4'>
                            <TouchableOpacity
                                className='elevation-sm w-full border border-lavender rounded mb-4 p-2 bg-white'
                                onPress={() => router.push({
                                    pathname: 'runner-single-order',
                                    params: {
                                        runner_id: runner_id,
                                        order_id: item.order_id,
                                        order_number: item.order_number,
                                        order_type: item.order_type,
                                        errand_price: item.errand_price === null ? 0 : item.errand_price,

                                        user_id: item.user_id,
                                        first_name: item.first_name,
                                        last_name: item.last_name,
                                        email: item.email_add,
                                        phone: item.phone_num,
                                        gender: item.gender,
                                        country: item.country,
                                        province: item.province,
                                        city: item.city_town,
                                        profile_image: item.profile_image,
                                        user_type: item.user_type,
                                        created_at: item.created_at,

                                        user_lat: item.destination_lat,
                                        user_lng: item.destination_lng,
                                        order_status: item.order_status,
                                    }
                                })}
                            >
                                <View className='items-center'>
                                    <View className='w-full flex-row justify-start items-center mb-0.5'>
                                        <View
                                            className='flex-row justify-start items-center'
                                            style={{width: '55%'}}
                                        >
                                            <Entypo name='box' size={16} color={COLORS.primary}/>
                                            <Text className='ml-2 text-lg text-black' style={{fontFamily: 'roboto-medium'}}>
                                                {item.order_number}
                                            </Text>
                                        </View>
                                        <View
                                            style={{width: '43%'}}
                                            className='flex-row justify-end items-center'
                                        >
                                            <Text
                                                style={{fontFamily: 'roboto-medium'}}
                                                className='text-sm text-slate'
                                            >{agoTimeStamp(item.assigned_time)}</Text>
                                        </View>
                                    </View>
                                    <View className='w-full flex-row justify-between items-center'>
                                        <View className='flex-row justify-start items-center'>
                                            <Entypo name='location' size={16} color={COLORS.primary}/>
                                            <Text className='text-sm ml-2 text-slate' style={{fontFamily: 'roboto-medium'}}>
                                                {item.city === null ? 'City not available' : item.city}
                                            </Text>
                                            <View className='bg-grey_bg ml-3 px-2 py-1 rounded-full'>
                                                <Text className='text-sm text-slate' style={{fontFamily: 'roboto-medium'}}>
                                                    {calculateDistance(pointA, { latitude: item.destination_lat, longitude: item.destination_lng })}
                                                </Text>
                                            </View>
                                        </View>
                                        <View className='border border-lavender rounded p-2'>
                                            <Text className='ml-2 text-base text-black' style={{fontFamily: 'roboto-medium'}}>View Order</Text>
                                        </View>
                                    </View>
                                </View>
                                <View className='flex-row mt-4 justify-between items-center'>
                                    <View className='w-[48.5%] py-2 justify-center items-center bg-navBtnBgHome rounded'>
                                        <Text className='text-base text-slate' style={{fontFamily: 'roboto-medium'}}>
                                            TYPE: <Text className='ml-1 text-green2 text-base' style={{fontFamily: 'roboto-medium'}}>
                                                {item.order_type?.charAt(0).toUpperCase() + item.order_type?.slice(1)}
                                            </Text>
                                        </Text>
                                    </View>
                                    <View className='w-[48.5%] py-2 justify-center items-center rounded'
                                        style={{
                                            backgroundColor: getStatusColor(item.order_status?.charAt(0).toUpperCase() + item.order_status?.slice(1))
                                        }}
                                    >
                                        <Text className='ml-1 text-white text-base' style={{fontFamily: 'roboto-medium'}}>
                                            {item.order_status}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}

                    ListHeaderComponent={() => (
                        <View className='w-full mb-2'>
                            <Text className='text-lg my-4' style={{fontFamily: 'roboto-medium'}}>You have {historyData?.length || 0} orders today</Text>
                            <Text className='text-sm text-red' style={{textAlign: 'justify', fontFamily: 'roboto-medium'}}>
                                Make sure you complete all accepted errands today to avoid inconveniencing customers.
                            </Text>
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    small: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
    },

    medium: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5.84,
        elevation: 5,
    },

    large: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
    },
})

export default OrderHistory
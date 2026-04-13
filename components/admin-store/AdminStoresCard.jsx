import { Feather, Ionicons } from '@expo/vector-icons'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { COLORS, SIZES } from '../../constants/constants'
import { STORES_IMAGE_URI } from '../../RequestMethods'

const AdminStoresCard = ({
    active_status,
    city_town,
    closing_time,
    created_date,
    delivery_status,
    store_latitude,
    location,
    store_longitude,
    open_close,
    open_time,
    store_category,
    store_country,
    store_coverimage,
    store_description,
    store_email,
    store_id,
    store_location,
    store_name,
    store_phone_num,
    store_profileimage,
    store_province,
    store_ratings,
    user_id,
    is_available,
    router}) => {
    
    return (
        <TouchableOpacity
            onPress={() => router.push({pathname: '/(routes)/admin-store-single/', params: {
                active_status: active_status,
                city_town: city_town,
                closing_time: closing_time,
                created_date: created_date,
                delivery_status: delivery_status,
                store_latitude: store_latitude,
                location: location,
                store_longitude: store_longitude,
                open_close: open_close,
                open_time: open_time,
                store_category: store_category,
                store_country: store_country,
                store_coverimage: store_coverimage,
                store_description: store_description,
                store_email: store_email,
                store_id: store_id,
                store_location: store_location,
                store_name: store_name,
                store_phone_num: store_phone_num,
                store_profileimage: store_profileimage,
                store_province: store_province,
                store_ratings: store_ratings,
                user_id: user_id,
                router: router
            }})}
            className='w-full items-center justify-center'>
            <View className='flex-row justify-between items-center w-full'>
                <View style={{borderRadius: 3, width: '29%', height: '70'}} className='relative'>
                    <Image style={{borderRadius: 3, width: '100%', height: '100%'}} className='w-full h-full'
                        source={{uri:`${STORES_IMAGE_URI}${store_profileimage}`}}
                    />
                    {open_close === false && (
                        <View className="w-full h-full justify-center items-center bg-transparentBlack absolute" style={{ borderRadius: 3 }}>
                            <Feather name="lock" size={15} style={{ color: COLORS.slate, opacity: 0.9, marginRight: 2 }} />
                        </View>
                    )}
                </View>
                <View className='w-[68%]'>
                    <View className='flex-row items-center'>
                        <Text numberOfLines={2} className='text-base'
                            style={{ fontFamily: 'roboto-bold' }}>{store_name}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}} >
                        <Text className='text-sm' numberOfLines={1} style={{ color: COLORS.slate }} >{store_category}</Text>
                    </View>
                    <View className='flex-row mt-1 items-center'>
                        <View>
                            {active_status === false ?
                                <View className='bg-red rounded-lg px-3'>
                                    <Text className='text-sm text-white'>Inactive</Text>
                                </View> :
                                <View className='bg-green-500 rounded-lg px-3'>
                                    <Text className='text-sm text-white'>Active</Text>
                                </View>
                            }
                        </View>
                        <View style={{ height:5, width: 5, backgroundColor: COLORS.slate, borderRadius: SIZES.round, alignSelf: 'center', justifyContent: 'center', marginHorizontal: 13 }} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', justifyContent: 'center',  marginRight: 4, }} >
                            <Ionicons name='location-outline' color={COLORS.slate} size={11} />
                            <Text style={{ fontFamily: 'maven', fontSize: SIZES.small, color: COLORS.slate }} >1.5km</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View className='w-full my-3 h-[1px] rounded-full bg-slate opacity-10'/>
        </TouchableOpacity>
    )
}

export default AdminStoresCard
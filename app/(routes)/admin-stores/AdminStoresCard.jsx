import { Feather, Ionicons } from '@expo/vector-icons'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import { COLORS, SIZES } from '../../../constants/constants'
import { usePermissions } from '../../../hook/usePermissions'
import { capitalize } from '../../../utils/capitalize'
import { calculateDistance } from '../../../utils/getDistance'
import { getAvatarColor, getInitials } from '../../../utils/getInitials'
import { isStoreOpen } from '../../../utils/isStoreOpen'
import { toast } from '../../../utils/toast'

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
    business_id,
    legal_name,
    display_name,
    business_type,
    business_category,
    router
}) => {
    const { can } = usePermissions();
    const {
        latitude,
        longitude,
        displayCurrentLocation,
        locationServicesEnabled,
    } = useSelector((state) => state.location);

    const pointA = { latitude: latitude, longitude: longitude };
    const pointB = { latitude: store_latitude, longitude: store_longitude };
    
    return (
        <TouchableOpacity
            onPress={() => {
                if (!can('view_stores')) {
                    toast.error('Unauthorized');
                    return;
                }

                router.push({
                    pathname: '/(routes)/admin-store-single/',
                    params: {
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
                        router: router,
                        business_id: business_id,
                        display_name: display_name,
                        business_type: business_type
                    }
                });
            }}

            className='w-full items-center justify-center'>
            <View className='flex-row justify-between items-center w-full'>
                <View className='relative justify-center items-center rounded'
                    style={{width: '23%', height: '60', backgroundColor: getAvatarColor(store_id)}}
                >
                    <Text
                        className='text-white'
                        numberOfLines={1}
                        style={{
                            fontFamily: 'roboto-medium',
                            fontSize: 20,
                        }}
                    >{getInitials(store_location)}</Text>
                    {/* {!store_profileimage ? (
                            <Text
                            className='text-white'
                            numberOfLines={1}
                            style={{
                                fontFamily: 'roboto-medium',
                                fontSize: 20,
                            }}
                        >{getInitials(store_location)}</Text>
                    ) : (
                        <Image style={{borderRadius: 3, width: '100%', height: '100%'}} className='w-full h-full'
                            source={{uri:`${STORES_IMAGE_URI}${store_profileimage}`}}
                        />
                    )} */}
                    {isStoreOpen(open_time, open_close) && (
                        <View className="w-full h-full justify-center items-center bg-transparentBlack absolute" style={{ borderRadius: 3 }}>
                            <View className='w-full h-full relative'>
                                <Feather
                                    name="lock" size={15}
                                    style={{
                                        position: 'absolute',
                                        color: store_profileimage ? COLORS.slate : COLORS.red,
                                        opacity: 1,
                                        right: 4,
                                        top: 4
                                    }}
                                />
                            </View>
                        </View>
                    )}
                </View>
                <View className='' style={{width: '75%'}}>
                    <View className='flex-row items-center'>
                        <Text numberOfLines={2} className='text-base'
                            style={{ fontFamily: 'roboto-bold' }}>{capitalize(store_location)}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}} >
                        <Text className='text-sm' numberOfLines={1} style={{ color: COLORS.slate }} >{capitalize(store_category)}</Text>
                    </View>
                    <View className='flex-row mt-1 items-center'>
                        <View>
                            {active_status === false ?
                                <View className='bg-red rounded-lg px-3'>
                                    <Text className='text-sm text-white'>Private</Text>
                                </View> :
                                <View className='bg-slate rounded-lg px-3'>
                                    <Text className='text-sm text-white'>Public</Text>
                                </View>
                            }
                        </View>
                        <View style={{ height:5, width: 5, backgroundColor: COLORS.slate, borderRadius: SIZES.round, alignSelf: 'center', justifyContent: 'center', marginHorizontal: 13 }} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', justifyContent: 'center',  marginRight: 4, }} >
                            <Ionicons name='location-outline' color={COLORS.slate} size={11} />
                            <Text style={{ fontFamily: 'roboto', fontSize: SIZES.small, color: COLORS.slate }} >
                                {calculateDistance(pointA, pointB)}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <View className='w-full my-6 h-[1px] rounded-full bg-slate opacity-10'/>
        </TouchableOpacity>
    )
}

export default AdminStoresCard
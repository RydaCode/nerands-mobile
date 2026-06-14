import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import { COLORS, SIZES } from '../../../../constants/constants'
import { STORES_IMAGE_URI } from '../../../../RequestMethods'
import { calculateDistance } from '../../../../utils/getDistance'
import { isStoreOpen } from '../../../../utils/isStoreOpen'

const StoresCard = (item) => {
    const { latitude, longitude } = useSelector((state) => state.location) || {};
    const router = useRouter();

    const isManuallyClosed = item?.item?.open_close === false;
    const isTimeClosed = !isStoreOpen(item?.item?.open_time, item?.item?.closing_time);
    const isClosed = isManuallyClosed || isTimeClosed;
    
    return (
        <TouchableOpacity className="w-full items-center justify-center"
            onPress={() => router.push({
                pathname: '../local-market-store-details/',
                params: {
                    store_id: item?.item?.store_id,
                    store_profileimage: item?.item?.store_profileimage,
                    store_name: item?.item?.store_name,
                    store_location: item?.item?.store_location,
                    store_latitude: item?.item?.latitude,
                    store_longitude: item?.item?.longitude,
                    store_description: item?.item?.store_description,
                    open_close: item?.item?.open_close,
                    average_rating: item?.item?.average_rating,
                    total_ratings: item?.item?.total_ratings,
                    review_count: item?.item?.review_count,
                    promoted: item?.item?.promoted,
                    store_coverimage: item?.item?.store_coverimage,
                    store_category: item?.item?.store_category,
                    open_time: item?.item?.open_time,
                    closing_time: item?.item?.closing_time,
                    city_town: item?.item?.city_town,
                    favorited: item?.item?.favorited,
                    created_date: item?.item?.created_date,
                    store_phone_num: item?.item?.store_phone_num,
                }
            })}
        >
            <View className="flex-row justify-between items-center w-full">
                {/* Store Image */}
                <View className="relative rounded" style={{ width: '29%', height: 70 }}>
                    <Image
                        className="h-full w-full rounded-sm"
                        source={{ uri: `${STORES_IMAGE_URI}${item?.item?.store_profileimage}` }}
                    />
                    {isClosed &&
                        <View className="absolute w-full h-full bg-black opacity-70 rounded flex-row justify-center items-center z-50">
                            <MaterialCommunityIcons name="lock" size={16} color={COLORS.primary} />
                            <Text className="text-sm text-white ml-1">Closed</Text>
                        </View>
                    }
                </View>

                {/* Store Info */}
                <View className="flex-row justify-between" style={{width: '69%'}}>
                    <View style={{width: '86%'}} className=''>
                        <Text numberOfLines={1} className="text-base" style={{ fontFamily: 'roboto-medium' }}>
                            {item?.item?.store_name}
                        </Text>

                        <View className="flex-row justify-start items-center">
                            <View className="flex-row items-center" style={{width: '49%'}}>
                                <Ionicons name="location-outline" color={COLORS.primary} size={11} />
                                <Text
                                    className='text-sm text-slate' style={{ marginLeft: 3 }}
                                    numberOfLines={1}
                                >
                                    {item?.item?.store_location}
                                </Text>
                            </View>

                            <View className="flex-row items-center justify-center" style={{width: '40%'}}>
                                <Ionicons name="location-outline" color={COLORS.primary} size={11} />
                                <Text
                                    style={{ fontFamily: 'roboto', fontSize: SIZES.small, color: COLORS.slate }}
                                    numberOfLines={1}
                                >
                                    {calculateDistance(
                                        { latitude, longitude },
                                        { latitude: item?.item?.latitude, longitude: item?.item?.longitude }
                                    )}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row my-1 items-center justify-between">
                            <View
                                className="items-center justify-center rounded px-2 py-1"
                                style={{ backgroundColor: COLORS.grey_bg }}
                            >
                                <Text className="text-sm text-slate">{item?.item?.store_category}</Text>
                            </View>

                            <View className="flex-row items-center" style={{width: '49%'}}>
                                <Ionicons name="star" size={12} color={COLORS.primary} />
                                <Text
                                    className='text-sm text-slate' style={{ marginLeft: 3 }}
                                    numberOfLines={1}
                                >
                                    {item?.item?.average_rating ? item?.item?.average_rating.toFixed(1) : 'No ratings yet'}
                                    {item?.item?.total_ratings > 0 && ` (${item?.item?.total_ratings})`}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ width: '12%' }} className='justify-center items-center'>
                        {/* Remove Favorite Button */}
                        <TouchableOpacity 
                            style={{width: 27, height: 27}}
                            className="rounded-full justify-center items-center bg-navBtnBgHome"
                            // onPress={removeFavorite}
                        >
                            <MaterialCommunityIcons name="heart" size={17} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View className="w-full my-5 h-[1px] bg-slate opacity-10" />
        </TouchableOpacity>
    )
}

export default StoresCard
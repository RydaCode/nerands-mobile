import { COLORS, SIZES } from '@/constants/constants';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { STORES_IMAGE_URI } from '../../../../../RequestMethods';
import { calculateDistance } from '../../../../../utils/getDistance';

const AllStoresCard = ({
    store_id,
    store_profileimage,
    store_coverimage,
    store_name,
    store_description,
    store_phone_num,
    open_close,
    store_latitude,
    store_longitude,
    store_location,
    store_category,
    average_rating,
    total_ratings,
    favorited
}) => {
    const router = useRouter();
    const { latitude, longitude } = useSelector((state) => state.location);

    const specialCategories = ['Restaurant', 'Liquor'];
    const isSpecial = specialCategories.includes(store_category);
    return (
        <TouchableOpacity
            onPress={() =>
                router.push({
                    pathname: isSpecial ? '../home-single-store/' : '../other-stores-single/', params: {
                        store_id,
                        store_profileimage,
                        store_coverimage,
                        store_name,
                        store_description,
                        store_phone_num,
                        open_close,
                        store_latitude,
                        store_longitude,
                        store_location,
                        store_category,
                        average_rating,
                        total_ratings,
                        favorited
                    }
                })
            }
            activeOpacity={0.7}
            className='w-full'
        >
            <View className='flex-row justify-between items-center'>
                <View className='relative rounded-sm' style={{width: '27%', height: 72}}>
                    <Image
                        className='w-full h-full rounded-sm'
                        source={{uri:`${STORES_IMAGE_URI}${store_profileimage}`}}
                    />
                    {open_close === false && (
                        <View className="absolute w-full h-full bg-black opacity-70 rounded-sm flex-row justify-center items-center z-50">
                            <MaterialCommunityIcons name="lock" size={16} color={COLORS.primary} />
                            <Text className="text-sm text-white ml-1">Closed</Text>
                        </View>
                    )}
                </View>
                <View className='' style={{width: '62%'}}>
                    <View className='flex-row items-center'>
                        <Text numberOfLines={1} className='text-base'
                            style={{ fontFamily: 'roboto-medium',}}>{store_name}</Text>
                    </View>
                    <View
                        className="items-center justify-center rounded-sm py-1 my-1"
                        style={{ width: '33%', backgroundColor: COLORS.grey_bg }}
                    >
                        <Text className="text-sm text-green1">{store_category}</Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center" style={{width: '27%'}}>
                            <Ionicons name="star" size={12} color={COLORS.primary} />
                            <Text
                                className='text-sm text-slate' style={{ marginLeft: 3 }}
                                numberOfLines={1}
                            >
                                {average_rating ? average_rating.toFixed(1) : 'New'}
                                {total_ratings > 0 && ` (${total_ratings})`}
                            </Text>
                        </View>

                        <View className="flex-row items-center justify-center" style={{width: '22%'}}>
                            <Ionicons name="location-outline" color={COLORS.primary} size={11} />
                            <Text
                                style={{ fontFamily: 'roboto', fontSize: SIZES.small, color: COLORS.slate }}
                                numberOfLines={1}
                            >
                                {calculateDistance(
                                    { latitude, longitude },
                                    { latitude: store_latitude, longitude: store_longitude }
                                )}
                            </Text>
                        </View>

                        <View className='flex-row justify-end' style={{width: '48%'}}>
                            <Text
                                numberOfLines={1}
                                style={{ fontFamily: 'roboto', color: COLORS.slate, fontSize: SIZES.small }}
                            >
                                {store_location}
                            </Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    className='justify-center items-center'
                >
                    <MaterialCommunityIcons
                        name={!favorited ? "cards-heart-outline" : "cards-heart"}
                        size={20}
                        color={COLORS.primary}
                    />
                </TouchableOpacity>
            </View>
            <View className='w-full my-3' style={{height: 1, borderRadius: SIZES.round, backgroundColor: COLORS.slate, opacity: 0.1}} />
        </TouchableOpacity>
    )
}

export default AllStoresCard
import { FontAwesome6 } from '@expo/vector-icons'
import { Text, TouchableOpacity, View } from 'react-native'
import { SIZES } from '../../../../../constants/constants'

const SearchAdmin = ({router, params}) => {
    return (
        <TouchableOpacity
            onPress={() => router.push({pathname: '../admins-route/search-admin/', params: {
                store_latitude: params.store_latitude,
                location: params.location,
                store_longitude: params.store_longitude,
                open_close: params.open_close,
                open_time: params.open_time,
                store_category: params.store_category,
                store_country: params.store_country,
                store_coverimage: params.store_coverimage,
                store_description: params.store_description,
                store_email: params.store_email,
                store_id: params.store_id,
                store_location: params.store_location,
                store_name: params.store_name,
                store_phone_num: params.store_phone_num,
                store_profileimage: params.store_profileimage,
                store_province: params.store_province,
                store_ratings: params.store_ratings,
                user_id: params.user_id,
                router: router
            }})}
            style={{borderRadius: SIZES.border}}
            className='h-full items-center justify-center bg-white border-1 border-lavender w-full'
        >
            <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 45, height: 45}}>
                <FontAwesome6 name="user-plus" color='#54C571' size={17} />
            </View>
            <Text className='text-sm'>New Admin</Text>
        </TouchableOpacity>
    )
}

export default SearchAdmin
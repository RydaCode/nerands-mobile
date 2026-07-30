import { FontAwesome5 } from '@expo/vector-icons'
import { Text, TouchableOpacity, View } from 'react-native'
import { SIZES } from '../../../../../constants/constants'

const UpdateStoreProfileImageOthers = ({router, params}) => {
    return (
        <TouchableOpacity
            onPress={() => router.push({pathname: '../edit-stores/update-store-profile-image-others/', params: {
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
                business_id: params.business_id,
                router: router
            }})}
            style={{borderRadius: SIZES.border}}
            className='h-full w-full items-center justify-center border-1 border-lavender bg-white'
        >
            <View className='bg-[#fff] border border-[#54C571] elevation-sm justify-center items-center rounded-full' style={{width: 45, height: 45}}>
                <FontAwesome5 name="camera" color="#54C571" size={20} />
            </View>
            <View className='justify-center items-center'>
                <Text className='text-sm'>Update Image</Text>
            </View>
        </TouchableOpacity>
    )
}

export default UpdateStoreProfileImageOthers
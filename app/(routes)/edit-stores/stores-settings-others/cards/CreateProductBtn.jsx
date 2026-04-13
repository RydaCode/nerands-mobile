import { Ionicons } from '@expo/vector-icons'
import { Text, TouchableOpacity, View } from 'react-native'

const CreateProductBtn = ({router, params}) => {
    return (
        <TouchableOpacity
            style={{width: '100%'}}
            className='h-full items-center justify-center bg-white border-1 rounded-md border-lavender w-full'
            onPress={() => router.push({pathname: '/create-products/', params: {
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
        >
            <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 45, height: 45}}>
                <Ionicons name="create" size={22} color="#54C571" />
            </View>
            <View className='items-center justify-center'>
                <Text className='text-sm' >Create Product</Text>
            </View>
        </TouchableOpacity>
    )
}

export default CreateProductBtn
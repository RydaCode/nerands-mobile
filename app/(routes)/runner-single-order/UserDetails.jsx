import { Entypo, FontAwesome } from '@expo/vector-icons'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { COLORS } from '../../../constants/constants'
import { USER_IMAGE_URI } from '../../../RequestMethods'
import { calculateDistance, makeCall } from '../../../utils/getDistance'

const UserDetails = ({params, pointA}) => {
    return (
        <View
            className='elevation-sm w-full border border-lavender rounded mt-8 p-2 bg-white relative'
        >
            <View className='absolute px-1 bg-white' style={{top: -13, left: 4}}>
                <Text className='text-xl font-semibold' style={{fontFamily: 'roboto-medium'}}>Client Details</Text>
            </View>
            <View className='flex-row justify-between items-center mt-3 mb-2'>
                <View className='border-2 border-lavender rounded-full justify-center items-center' style={{width: 60, height: 60}}>
                    {!params.profile_image ? <FontAwesome name='user' size={35} color={COLORS.slate}/> :
                        <Image
                            className="w-full h-full rounded-full"
                            source={{ uri: `${USER_IMAGE_URI}${params.profile_image}` }}
                            style={{ resizeMode: "cover" }}
                        />
                    }
                </View>
                <View className='w-[65%]'>
                    <Text numberOfLines={1} className='text-lg font-semibold' style={{fontFamily: 'roboto-medium'}}>{params.first_name} {params.last_name}</Text>
                    <Text className='text-base text-slate' style={{fontFamily: 'roboto-medium'}}>{params.phone}</Text>
                </View>
                <TouchableOpacity
                    className='bg-grey_bg rounded-full justify-center items-center border border-lavender' style={{width: 45, height: 45}}
                    onPress={() => makeCall(params.phone)}
                >
                    <FontAwesome name='phone' size={25} color={COLORS.green2}/>
                </TouchableOpacity>
            </View>
            <View className='items-center'>
                <View className='w-full flex-row justify-between items-center'>
                    <View className='flex-row justify-start items-center'>
                        <Entypo name='location' size={16} color={COLORS.primary}/>
                        <Text className='text-base ml-2 text-slate' style={{fontFamily: 'roboto-medium'}}>
                            {!params.city ? 'City not available' : params.city}
                        </Text>
                        <View className='bg-grey_bg ml-3 px-2 py-1 rounded-full'>
                            <Text className='text-sm text-slate' style={{fontFamily: 'roboto-medium'}}>
                                {calculateDistance(pointA, { latitude: params.user_lat, longitude: params.user_lng })}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default UserDetails
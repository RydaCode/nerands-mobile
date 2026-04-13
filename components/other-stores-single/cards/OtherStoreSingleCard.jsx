import { View, Text, TouchableOpacity, Image } from 'react-native'
import { SIZES, COLORS } from '../../../constants/constants'
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router';

const OtherStoreSingleCard = ({id, image, name, desc, price, status, store}) => {
    const router = useRouter();
    return (
        <TouchableOpacity
            onPress={() => router.push({ pathname: '../(routes)/other-single-product/', params: {
                id, image, name, desc, price, status, store
            }})}
            activeOpacity={0.7}
            className='w-[48.5%] mb-6 items-center justify-center relative'
        >
            <View className='w-full flex-row items-center mb-1' >
                <View className='flex-row items-center justify-center mr-1' >
                    <Ionicons name='location-outline' color={COLORS.slate} size={13} />
                    <Text className='text-sm text-slate ml-[2px]' numberOfLines={1} style={{ fontFamily: 'maven-medium' }} >{store}</Text>
                </View>
            </View>
            <View className='h-[200px] w-full relative'>
                <Image resizeMode='cover' className='h-full w-full' source={image}/>
                <TouchableOpacity className='absolute flex-row h-[30px] w-full opacity-70 bottom-0 items-center justify-center bg-primary'>
                    <FontAwesome color={COLORS.white} name='shopping-cart' size={20} />
                    <Text style={{fontFamily: 'maven-medium'}} className='ml-2 text-white text-opacity-100'>ADD TO CART</Text>
                </TouchableOpacity>
            </View>
            <View className='w-full items-center justify-center p-1'>
                <Text className='text-xl' style={{fontFamily: 'maven-bold' }}>{name}</Text>
            </View>
            <View className='w-full items-center justify-center p-1'>
                <Text className='text-primary text-xl' style={{fontFamily: 'maven-bold' }}>K{price}</Text>
            </View>
            <View style={{backgroundColor: '#F3F4F8'}} className='w-full rounded-full mt-2 -ml-1 p-1 flex-row justify-center items-center mb-1' >
                <View className='flex-row items-center justify-center mr-1' >
                    <MaterialCommunityIcons name="store" color={COLORS.slate} size={13} />
                    <Text numberOfLines={1} className='ml-[2px] text-sm text-slate' style={{ fontFamily: 'maven-medium' }} >Nerands Stores</Text>
                </View>
            </View>
            <TouchableOpacity className='absolute h-[30px] w-[30px] top-8 right-2 items-center justify-center bg-white rounded-full'>
                <MaterialCommunityIcons color={COLORS.primary} name='heart-outline' size={20} />
            </TouchableOpacity>
            <View className='w-full mt-1 h-[1px] rounded-full bg-slate opacity-10'/>
        </TouchableOpacity>
    )
}

export default OtherStoreSingleCard
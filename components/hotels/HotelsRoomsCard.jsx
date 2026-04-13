import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS, SIZES } from '@/constants/constants'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';

const HotelsRoomsCard = ({ id, image, name, desc }) => {
    const router = useRouter();
    return (
        <TouchableOpacity
            onPress={() => router.push({pathname: '../(routes)/hotel-room-single/', params: {
                id, image, name, desc
            }})}
            className='px-2 w-full'>
            <View className='flex-row justify-between items-center'>
                <Image
                    className='w-[31%] h-[80px] rounded-[3px]'
                    source={image}
                />
                <View className='w-[58%]' >
                    <View className='flex-row items-center'>
                        <Feather name="lock" size={15} style={{color: COLORS.slate, opacity: 0.5, marginRight: 2,}} />
                        <Text
                            numberOfLines={2}
                            className='text-xl'
                            style={{ fontFamily: 'maven-medium', fontSize: SIZES.main,}}>{name}</Text>
                    </View>
                    <View className='flex-row'>
                        <Text numberOfLines={2}  className='text-slate text-sm' style={{ fontFamily: 'maven'}} >{desc}</Text>
                    </View>
                    <View className='flex-row items-center' style={{marginTop: SIZES.base }} >
                        <View className='flex-row items-center'>
                            <View className='flex-row'>
                                <Ionicons name="star" size={12} style={{color: COLORS.grey, marginRight: 3,}} />
                                <Ionicons name="star" size={12} style={{color: COLORS.slate, marginRight: 3,}} />
                                <Ionicons name="star" size={12} style={{color: COLORS.green1, marginRight: 3,}} />
                                <Ionicons name="star" size={12} style={{color: COLORS.green2, marginRight: 3,}} />
                                <Ionicons name="star" size={12} style={{color: COLORS.red}} />
                            </View>
                        </View>
                        <View className='h-[5px] w-[5px] bg-slate rounded-full self-center justify-center mx-[13px]'/>
                        <View className='flex-row items-center justify-center self-center mr-1'>
                            <Ionicons name='location-outline' color={COLORS.slate} size={11} />
                            <Text className='text-slate text-sm' style={{ fontFamily: 'maven'}} >1.5km</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    className='justify-center items-center h-[80px]'
                >
                    <MaterialCommunityIcons name="heart-outline" size={23} style={{color: COLORS.green2}} />
                </TouchableOpacity>
            </View>
            <View className='w-full my-3 rounded-full h-[1px] bg-slate opacity-10'/>
        </TouchableOpacity>
    )
}

export default HotelsRoomsCard
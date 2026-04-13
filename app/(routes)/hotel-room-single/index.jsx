import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import MainHeader from '../../../components/MainHeader'
import { useLocalSearchParams } from 'expo-router'
import HotelRoomSingleCard from '../../../components/hotels/HotelRoomSingleCard'

const index = () => {
    const params = useLocalSearchParams();
    return (
        <SafeAreaView className='flex-1 px-2 bg-white items-center'>
            <View className=''>
                <MainHeader header_name={params.name} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <HotelRoomSingleCard
                    id={params.id}
                    image={params.image}
                    name={params.name}
                    desc={params.desc}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

export default index
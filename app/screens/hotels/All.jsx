import { FontAwesome } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { ActivityIndicator, FlatList, Text, View } from 'react-native'
import { COLORS } from '../../../constants/constants'
import { store_data } from '../../../constants/store_data'
import HotelsCard from './cards/HotelsCard'

const All = () => {
    const router = useRouter();
    return (
        <View className='flex-1'>
            {(!store_data) ? (
                <View className='flex-1 justify-center items-center'>
                    <ActivityIndicator size={35} color={COLORS.primary}/>
                    <Text
                        className='text-base text-slate'
                        style={{fontFamily: 'roboto-medium'}}
                    >Loading Hotel & Lodges Listings...</Text>
                </View>
            ) : store_data.length === 0 ? (
                <View className='flex-1 justify-center items-center'>
                    <FontAwesome name='search' size={30} color={COLORS.slate}/>
                    <Text
                        className='text-base text-slate mt-3'
                        style={{fontFamily: 'roboto-medium'}}
                    >No Hotels & lodges are listed yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={store_data}
                    keyExtractor={(item) => '12453mkj'}
                    renderItem={({item}) => (
                        <View className='w-full flex-row flex-wrap items-center justify-between'>
                            <HotelsCard
                                key={hotel.id}
                                hotel_name={hotel.name}
                                description={hotel.desc}
                                hotel_image={hotel.image}
                                latitude='15.21358'
                                longitude='25.32658'
                                router={router}
                            />
                        </View>
                    )}

                    ListHeaderComponent={
                        <View className='px-2 pb-10'>
                            <Text className='mt-5' style={{fontFamily: 'maven-medium'}}>Hotels</Text>
                        </View>
                    }
                />
            )}
        </View>
    )
}

export default All
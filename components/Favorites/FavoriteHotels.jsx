import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { COLORS, SIZES } from '../../constants/constants'

const HotelsData = ({ product, router }) => (
    <TouchableOpacity
        className='w-[100%] justify-center items-center'
        activeOpacity={0.7}
    >
        <Image
            source={product.image}
            style={{borderRadius: SIZES.radius}} className='h-[220px] w-[100%]'
        />
        <View className='w-[100%] justify-center items-center'>
            <View className='w-[100%]'>
                <View>
                    <Text numberOfLines={1} className='font-bold' style={{fontFamily: 'maven-medium'}}>{product.name}</Text>
                    <Text className='font-bold' style={{fontFamily: 'maven-medium', color: COLORS.green2}}>Total: K125</Text>
                </View>
                <View className='w-[100%]'>
                    <Text numberOfLines={2} style={{fontSize: SIZES.small, fontFamily: 'maven-medium', color: COLORS.slate}}>{product.desc}</Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>
)

const FavoriteHotels = () => {
    const router = useRouter();
    return (
        <View className='items-center flex flex-row mx-2'>
            <FlatList
                data={[]}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <>
                        <HotelsData product={item} router={router}/>
                        <View className='w-full my-2' style={{height: 1, borderRadius: SIZES.round, backgroundColor: COLORS.slate, opacity: 0.1}} />
                    </>
                )}
                ListHeaderComponent={() => (
                    <View className='flex-row mb-4 mt-5 mx-2 items-center justify-center'>
                        <MaterialCommunityIcons name="heart" size={15} style={{color: COLORS.primary}} />
                        <Text style={{fontFamily: 'maven-medium'}} className='ml-1'>You have 12 hotels / lodges in your favorites</Text>
                    </View>
                )}
                showsVerticalScrollIndicator={false}

                // ListEmptyComponent={() => (
                //     <EmptyState
                //         title='Items founds'
                //         subtitle='Create store'
                //     />
                // )}
            />
        </View>
    )
}

export default FavoriteHotels
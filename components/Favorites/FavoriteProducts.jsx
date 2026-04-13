import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { COLORS, SIZES } from '../../constants/constants'

const ProductsData = ({ product, router }) => (
    <TouchableOpacity
        className='px-2 w-full items-center justify-center'
    >
        <View className='flex-row justify-between items-center'>
            <View className='flex-row justify-start items-center'>
                <Image
                    source={product.image}
                    style={{borderRadius: SIZES.radius}} className='h-[65px] w-[26%]'
                />
                <View className='w-[71.7%] flex-row ml-2 justify-between items-center'>
                    <View className='w-[90%]'>
                        <View>
                            <Text numberOfLines={1} className='font-bold' style={{fontFamily: 'maven-medium'}}>{product.name}</Text>
                            <Text className='font-bold' style={{fontFamily: 'maven-medium', color: COLORS.green2}}>Total: K125</Text>
                        </View>
                        <View className=''>
                            <Text numberOfLines={2} style={{fontSize: SIZES.small, fontFamily: 'maven-medium', color: COLORS.slate}}>{product.desc}</Text>
                        </View>
                    </View>
                    <TouchableOpacity className='w-[8%] h-[50px] items-center justify-center'>
                        <MaterialCommunityIcons name="dots-vertical" size={24} color='black' />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        <View className='w-full my-3 h-[1px] rounded-full bg-slate opacity-10'/>
    </TouchableOpacity>
)

const FavoriteProducts = () => {
    const router = useRouter();
    return (
        <View className='items-center'>
            <FlatList
                data={[]}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <ProductsData product={item} router={router}/>
                )}
                ListHeaderComponent={() => (
                    <View className='flex-row mb-4 mt-5 mx-2 items-center justify-center'>
                        <MaterialCommunityIcons name="heart" size={15} style={{color: COLORS.primary}} />
                        <Text style={{fontFamily: 'maven-medium'}} className='ml-1'>You have 12 products in your favorites</Text>
                    </View>
                )}

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

export default FavoriteProducts
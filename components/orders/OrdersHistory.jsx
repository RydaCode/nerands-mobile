import { View, Text, Image, FlatList, ScrollView } from 'react-native'
import React from 'react'
import my_orders from '../../constants/my_orders'
import { TouchableOpacity } from 'react-native'
import { COLORS, SIZES } from '../../constants/constants'
import { FontAwesome } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const OrdersData = ({ order, router }) => (
    <TouchableOpacity
        onPress={() => router.push('../../screens/orders/OrderSingle/OrderSingle')}
        className='flex-row justify-between items-center'
    >
        <View className='flex-row justify-start items-center'>
            <Image
                source={order.image}
                style={{borderRadius: SIZES.radius}} className='h-[65px] w-[26%]'
            />
            <View className='w-[71.7%] flex-row ml-2 justify-between items-center'>
                <View className='w-[90%]'>
                    <View className=''>
                        <Text className='font-bold' style={{fontFamily: 'maven-medium'}}>Order No: {order.order_number}</Text>
                    </View>
                    <View className='flex-row justify-between items-center'>
                        <View>
                            <Text className='font-bold' style={{fontFamily: 'maven-medium', color: COLORS.green2}}>Total: K215</Text>
                        </View>
                        <View className='flex-row items-center justify-start mx-2'>
                            <Text style={{fontFamily: 'maven-medium', color: COLORS.slate, fontSize: SIZES.small}}>Qty:{my_orders.length}</Text>
                        </View>
                        <View style={{backgroundColor: COLORS.green2, borderRadius: SIZES.radius, }} className='flex-row px-2 py-0.5 items-center justify-center'>
                            <Text style={{fontFamily: 'maven-medium', color: COLORS.white, fontSize: SIZES.small}}>Delivered</Text>
                        </View>
                    </View>
                    <View className='flex-row justify-between items-center'>
                        <View>
                            <Text style={{fontFamily: 'maven-medium', color: COLORS.grey, fontSize: SIZES.small}}>Time: 12:47:30</Text>
                        </View>
                        <View className='flex-row items-center justify-start mr-4'>
                            <Text style={{fontFamily: 'maven-medium', color: COLORS.grey, fontSize: SIZES.small}}>Date: 12.10.2024</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity className='w-[8%] h-[50px] items-center justify-center'>
                    <FontAwesome name='times' size={19} color={COLORS.red} />
                </TouchableOpacity>
            </View>
        </View>
    </TouchableOpacity>
)

const OrdersHistory = ({title}) => {
    const router = useRouter();
    return (
        <ScrollView className='mx-2' showsVerticalScrollIndicator={false}>
            <View className='flex-row justify-between items-center my-6'>
                <Text className='mt-1 font-bold' style={{fontFamily: 'maven-medium'}}>{title}</Text>
            </View>
            {my_orders.map((order) => (
                <View key={order.id}>
                    <OrdersData order={order} router={router}/>
                    <View className='w-full my-2' style={{height: 1, borderRadius: SIZES.round, backgroundColor: COLORS.slate, opacity: 0.1}} />
                </View>
            ))}
            <View className='mt-28' />
        </ScrollView>
    )
}

export default OrdersHistory
import { FontAwesome } from '@expo/vector-icons'
import { useEffect } from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { COLORS } from '../../../constants/constants'
import useApi from '../../../hook/useApi'
import AmountSpent from './AmountSpent'
import FindTransporter from './FindTransporter'
import OrderDetails from './OrderDetails'
import SingleOrderCard from './SingleOrderCard'
import UserDetails from './UserDetails'

const CustomOrder = ({params, pointA}) => {
    const {data, isLoading, error, get} = useApi(
        `/runner/errands/custom_order?runner_id=${params.runner_id}&order_id=${params.order_id}`
    );

    useEffect(() => {
        get();
    }, []);

    const cartTotal = data?.custom_products?.reduce((total, item) => {
        const itemTotal = (item.estimatedPrice || 0) * (item.qty || 0);
        return total + itemTotal;
    }, 0);

    return (
        isLoading ? (
            <View className='w-full h-full mt-50 bg-white justify-center items-center'>
                <ActivityIndicator size={50} color={COLORS.primary} />
                <Text className='text-base' style={{fontFamily: 'roboto-medium'}}>Loading Orders, please wait...</Text>
            </View>
        ) : !data || data.length === 0 ? (
            <View className='h-full justify-center items-center'>
                <FontAwesome name='search' size={40} color={COLORS.slate}/>
                <Text className='text-lg text-slate' style={{fontFamily: 'roboto-medium'}}>No products found under this order</Text>
            </View>
        ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
                <UserDetails
                    params={params}
                    pointA={pointA}
                />

                <OrderDetails
                    params={params}
                    data={data}
                />

                <View
                    className='elevation-sm w-full border border-lavender rounded mb-8 p-2 pt-6 bg-white relative'
                >
                    <View className='absolute px-1 bg-white' style={{top: -13, left: 4}}>
                        <Text className='text-xl font-semibold' style={{fontFamily: 'roboto-medium'}}>Order Items</Text>
                    </View>
                    {data?.custom_products?.map((item) => (
                        <SingleOrderCard
                            key={item.id}
                            item={item}
                        />
                    ))}
                    <View className='w-full flex-row justify-end mt-2'>
                        <Text
                            style={{fontFamily: 'roboto-medium'}}
                            className='text-base text-primary font-semibold'
                        >
                            <Text className='text-black'>Cart total: </Text> K{Number(cartTotal || 0).toLocaleString()}
                        </Text>
                    </View>
                </View>

                <AmountSpent
                    params={params}
                    pointA={pointA}
                    data={data}
                />

                <FindTransporter
                    params={params}
                    pointA={pointA}
                    data={data}
                />
            </ScrollView>
        )
    )
}

export default CustomOrder
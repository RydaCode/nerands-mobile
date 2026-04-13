import { useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MainHeader from '../../../../components/MainHeader'
import AdminSingleOrderCard from './AdminSingleOrderCard'

const index = () => {
    const params = useLocalSearchParams();

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <View className='px-2'>
                <MainHeader fontFamily='ubuntu-medium' textStyles='text-2xl' header_name='User Order' />
            </View>
            <AdminSingleOrderCard
                user_id={params.user_id}
                store_id={params.store_id}
                order_id={params.order_id}
                grand_total={params.grand_total}
                store_latitude={params.store_latitude}
                store_longitude={params.store_longitude}
                user_latitude={params.user_latitude}
                user_longitude={params.user_longitude}
                delivery_fee={params.delivery_fee}
                courier_type={params.courier_type}
            />
        </SafeAreaView>
    )
}

export default index
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
                params={params}
            />
        </SafeAreaView>
    )
}

export default index
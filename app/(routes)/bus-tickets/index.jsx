import { View, Text, SafeAreaView, FlatList } from 'react-native'
import MainHeader from '../../../components/MainHeader'
import BusesCard from '../../screens/buses-screens/BusesCard'

const index = () => {
    return (
        <SafeAreaView className='flex-1 bg-white'>
            <View className='px-2 mb-4'>
                <MainHeader header_name='Bus Tickets' />
            </View>

            <View className='w-full px-2'>
                <BusesCard />
            </View>
        </SafeAreaView>
    )
}

export default index
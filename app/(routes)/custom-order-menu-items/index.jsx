import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import MainHeader from '../../../components/MainHeader'
import CustomOrderScreen from '../../screens/custom-orders/CustomOrderScreen'

const index = () => {
    const charges = useSelector(state => state.delivery.charges);
    return (
        <SafeAreaView className='flex-1 w-full items-center bg-white'>
            <View className='px-4'>
                <MainHeader textStyles='text-2xl' fontFamily='maven-medium' header_name='Custom Order' />
            </View>
            <CustomOrderScreen />
        </SafeAreaView>
    )
}

export default index
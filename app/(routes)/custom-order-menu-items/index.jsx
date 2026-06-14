import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import MainHeader from '../../../components/MainHeader'
import CustomOrderScreen from './cards/CustomOrderScreen'

const Index = () => {
    const charges = useSelector(state => state.delivery.charges);
    return (
        <SafeAreaView className='flex-1 w-full px-2 items-center bg-white relative'>
            <MainHeader textStyles='text-2xl' fontFamily='ubuntu-medium' header_name='Custom Order' />
            <CustomOrderScreen />
        </SafeAreaView>
    )
}

export default Index
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import MainHeader from '../../../components/MainHeader'
import CustomOrder from './CustomOrder'
import GeneralOrder from './GeneralOrder'

const index = () => {
    const params = useLocalSearchParams();
    const { latitude, longitude } = useSelector(state => state.location);
    const router = useRouter();
    const pointA = { latitude: latitude, longitude: longitude }; // User

    return (
        <SafeAreaView className='flex-1 bg-white px-2'>
            <MainHeader fontFamily='ubuntu-medium' textStyles='text-2xl' header_name='Single Order'/>
            
            {params.order_type === 'custom' ? (
                <CustomOrder
                    params={params}
                    pointA={pointA}
                />
            ) : (
                <GeneralOrder
                    params={params}
                    pointA={pointA}
                />
            )}
        </SafeAreaView>
    )
}

export default index
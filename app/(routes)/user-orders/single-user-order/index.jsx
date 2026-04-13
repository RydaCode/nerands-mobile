import { useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MainHeader from '../../../../components/MainHeader'
import UserOrdderSingleCard from '../cards/UserOrdderSingleCard'

const index = () => {
    const params = useLocalSearchParams();
    
    return (
        <SafeAreaView className='flex-1 bg-white'>
            <View className='px-4'>
                <MainHeader fontFamily='roboto-medium' textStyles='text-2xl' header_name='My Order' />
            </View>
            <UserOrdderSingleCard params={params}/>
        </SafeAreaView>
    )
}

export default index
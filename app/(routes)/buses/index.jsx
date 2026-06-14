import { FontAwesome } from '@expo/vector-icons'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MainHeader from '../../../components/MainHeader'
import { COLORS } from '../../../constants/constants'

const Index = () => {
    return (
        <SafeAreaView className='bg-whie flex-1 px-2'>
            <MainHeader header_name='Buses' textStyles='text-2xl' fontFamily='ubuntu-medium' />
            <View className='flex-1 justify-center items-center'>
                <FontAwesome name='search' size={30} color={COLORS.slate}/>
                <Text
                    className='text-base text-slate mt-3'
                    style={{fontFamily: 'roboto-medium'}}
                >No Buses Listed Yet</Text>
            </View>
        </SafeAreaView>
    )
}

export default Index
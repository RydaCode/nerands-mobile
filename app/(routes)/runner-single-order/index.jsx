import { FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MainHeader from '../../../components/MainHeader'
import SingleOrderCard from './SingleOrderCard'

const index = (params) => {
    return (
        <SafeAreaView className='flex-1 bg-white px-2'>
            <MainHeader fontFamily='maven-medium' textStyles='text-2xl' header_name='Single Orders'/>
            <FlatList
                data={[]}
                ListHeaderComponent={<SingleOrderCard params={params}/>}
                showsVerticalScrollIndicator={false}
                // contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
            />
        </SafeAreaView>
    )
}

export default index
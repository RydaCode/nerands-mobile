import { useState } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MainHeader from '../../../components/MainHeader'
import History from '../../../components/parcels/History'
import LocalParcelDelivery from '../../../components/parcels/LocalParcelDelivery'
import ParcelsTabs from '../../../components/parcels/ParcelsTabs'
import SendParcelLongDistance from '../../../components/parcels/SendParcelLongDistance'

const Parcels = () => {
    const tabs = ['Local Parcels', 'Long Distance', 'History'];
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const DisplayTabContent = () => {
        switch (activeTab) {
            case 'Local Parcels': return <LocalParcelDelivery title='Local Parcels'/>
            case 'Long Distance': return <SendParcelLongDistance title='Long Distance'/>
            case 'History': return <History title='Parcels History'/>
            default:
            break;
        }
    }

    return (
        <SafeAreaView className='flex-1 px-4 justify-start items-center bg-white'>
            <MainHeader textStyles='text-2xl' fontFamily='ubuntu-medium' header_name='Parcels'/>

            <View className='w-full pb-2 mt-5'>
                <ParcelsTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </View>
            {DisplayTabContent()}
        </SafeAreaView>
    )
}

export default Parcels
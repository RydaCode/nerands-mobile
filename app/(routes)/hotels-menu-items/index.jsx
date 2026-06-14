import { useState } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MainHeader from '../../../components/MainHeader'
import All from '../../screens/hotels/All'
import GuestHouses from '../../screens/hotels/GuestHouses'
import Hotels from '../../screens/hotels/Hotels'
import HotelTabs from '../../screens/hotels/HotelTabs'
import Lodges from '../../screens/hotels/Lodges'
import Motels from '../../screens/hotels/Motels'

const Hotel = () => {

    const tabs = ['All', 'Hotels', 'Lodges', 'Guest Houses', 'Motels'];
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const DisplayTabContent = () => {
        switch (activeTab) {
            case 'All': return <All title='All'/>
            case 'Hotels': return <Hotels title='Hotels'/>
            case 'Lodges': return <Lodges title='Lodges'/>
            case 'Guest Houses': return <GuestHouses title='Guest Houses'/>
            case 'Motels': return <Motels title='Motels'/>
            default:
            break;
        }
    }

    return (
        <SafeAreaView className='flex-1 bg-white px-2'>
            <MainHeader header_name='Hotels & Lodges' textStyles='text-2xl' fontFamily='ubuntu-medium' />
            <View className='w-full mt-5'>
                <HotelTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </View>
            <View className='w-full mt-1 flex-1'>
                {DisplayTabContent()}
            </View>
        </SafeAreaView>
    )
}

export default Hotel
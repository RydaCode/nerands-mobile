import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MainHeader from '../../../components/MainHeader'
import HotelTabs from '../../screens/hotels/HotelTabs'
import { COLORS } from '../../../constants/constants'
import All from '../../screens/hotels/All'
import Hotels from '../../screens/hotels/Hotels'
import Lodges from '../../screens/hotels/Lodges'
import GuestHouses from '../../screens/hotels/GuestHouses'
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
        <SafeAreaView style={{backgroundColor: COLORS.white}} className='flex-1'>
            <View className='px-2'>
                <MainHeader header_name='Hotels & Lodges' />
            </View>
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
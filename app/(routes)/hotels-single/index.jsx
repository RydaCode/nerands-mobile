import { View, Text, SafeAreaView, Image } from 'react-native'
import MainHeader from '../../../components/MainHeader'
import { useLocalSearchParams } from 'expo-router'
import styles from '../../../constants/styles.tabs'
import { useState } from 'react'
import HotelSingleTabs from '../../screens/hotel-single/HotelSingleTabs'
import Rooms from '../../screens/hotel-single/Rooms'
import Reserved from '../../screens/hotel-single/Reserved'
import BreakFast from '../../screens/hotel-single/BreakFast'
import Lunch from '../../screens/hotel-single/Lunch'
import Supper from '../../screens/hotel-single/Supper'
import Others from '../../screens/hotel-single/Others'
import Hostory from '../../screens/hotel-single/Hostory'

// hotel_name, description, hotel_image, latitude, longitude, router

const index = () => {
    const tabs = ['Rooms', 'Reserved', 'Break Fast', 'Lunch', 'Supper', 'Others', 'Hostory'];
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const params = useLocalSearchParams();

    const DisplayTabContent = () => {
        switch (activeTab) {
            case 'Rooms': return <Rooms title='Rooms'/>
            case 'Reserved': return <Reserved title='Reserved'/>
            case 'Break Fast': return <BreakFast title='Break Fast'/>
            case 'Lunch': return <Lunch title='Lunch'/>
            case 'Supper': return <Supper title='Supper'/>
            case 'Others': return <Others title='Others'/>
            case 'Hostory': return <Hostory title='Hostory'/>
            default:
            break;
        }
    }

    return (
        <SafeAreaView className='flex-1 items-center bg-white'>
            <View className='px-2'>
                <MainHeader header_name={params.hotel_name} />
            </View>
            <View className='w-full mt-5'>
                <HotelSingleTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </View>
            <View className='flex-1 w-full mt-1'>
                {DisplayTabContent()}
            </View>
        </SafeAreaView>
    )
}

export default index
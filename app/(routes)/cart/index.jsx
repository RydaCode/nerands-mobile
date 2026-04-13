import { useWindowDimensions, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MainHeader from '../../../components/MainHeader'
// import CartData from '../../../components/cart/CartData'
// import OrderBtn from '../../../components/cart/OrderBtn'
import { useRouter } from 'expo-router'
// import { SIZES } from '../../../constants/constants'
// import { clearCart } from '../../../redux/slices/CartSlice';
import { useState } from 'react'
import { useSelector } from 'react-redux'
// import useSend from '../../../hook/useSend'
import CartTabs from './CartTabs'
import FoodCartTab from './FoodCartTab'
import OtherProductsTab from './OtherProductsTab'

const index = () => {
    const { latitude, longitude, displayCurrentLocation, locationServicesEnabled } = useSelector(state => state.location);
    const router = useRouter();

    // Get the window dimensions for responsiveness
    const { width, height } = useWindowDimensions();

    const tabs = ['Food Cart', 'General Cart'];
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const DisplayTabContent = () => {
        switch (activeTab) {
            case 'Food Cart': return <FoodCartTab category="Food Cart"/>;
            case 'General Cart': return <OtherProductsTab category="General Cart" />;
            default: return null;
        }
    };

    return (
        <SafeAreaView className='flex-1 bg-white px-4'>
            <View className='w-full mb-4'>
                <MainHeader fontFamily={'ubuntu-medium'} textStyles='text-2xl' header_name='Cart'/>
            </View>

            {/* Store Menu Tabs */}
            <View className='mb-2'>
                <CartTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
            </View>

            {/* Tab Content */}
            {DisplayTabContent()}
        </SafeAreaView>
    )
}

export default index
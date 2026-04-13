import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainHeader from '../../../components/MainHeader';
import OrderTabs from '../../../components/orders/OrderTabs';
import OrderHistory from './OrderHistory';
import PendingOrders from './PendingOrders';
import TodayOrders from './TodayOrders';

const index = () => {
    const params = useLocalSearchParams();

    const tabs = ['Today', 'Pending Orders', 'Order History'];
    const [activeTab, setActiveTab] = useState(tabs[0]);
    
    const DisplayTabContent = () => {
        switch (activeTab) {
            case 'Today': return <TodayOrders title='Today' params={params}/>
            case 'Pending Orders': return <PendingOrders title='Pending Orders'/>
            case 'Order History': return <OrderHistory title='Orders History'/>
            default:
            break;
        }
    }

    return (
        <SafeAreaView className='flex-1 bg-white px-2'>
            <MainHeader fontFamily='maven-medium' textStyles='text-2xl' header_name='Runner Orders'/>
            <View className='w-full mt-5 mb-1'>
                <OrderTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
                {DisplayTabContent()}
            </View>
        </SafeAreaView>
    )
}

export default index
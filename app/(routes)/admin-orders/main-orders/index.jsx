import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainHeader from '../../../../components/MainHeader';
import AdminOrders from './AdminOrders';
import CancelledOrders from './CancelledOrders';
import CompletedOrders from './CompletedOrders';
import InTransitOrders from './InTransitOrders';
import OrderTabs from './OrderTabs';
import PendingOrders from './PendingOrders';
import ProcessingOrders from './ProcessingOrders';

const index = () => {
    const params = useLocalSearchParams();
    const router = useRouter();
    const tabs = ['Pending', 'Processing', 'In_Transit', 'Completed', 'Cancelled', 'History'];
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const DisplayTabContent = () => {
        switch (activeTab) {
            case 'Pending': return <PendingOrders title="Pending Orders" params={params}/>;
            case 'Processing': return <ProcessingOrders title="Processing Orders" params={params}/>;
            case 'In_Transit': return <InTransitOrders title="Orders In Transit" params={params}/>;
            case 'Completed': return <CompletedOrders title="Completed Orders" params={params}/>;
            case 'Cancelled': return <CancelledOrders title="Cancelled Orders" params={params}/>;
            case 'History': return <AdminOrders title="Orders History" params={params}/>;
            default:
            break;
        }
    };

    return (
        <SafeAreaView className='flex-1 bg-white items-center'>
            <View className='w-full px-4'>
                <MainHeader fontFamily='ubuntu-medium' textStyles='text-2xl' header_name='Admin Orders' />
            </View>

            <View className='px-2'>
                <View className="w-full mt-3">
                    <OrderTabs
                        tabs={tabs}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </View>
                {DisplayTabContent()}
            </View>
        </SafeAreaView>
    )
}

export default index
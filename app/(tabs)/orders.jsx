import { useState } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MainHeader from '../../components/MainHeader'
import CustomOrders from '../../components/orders/CustomOrders'
import OrderTabs from '../../components/orders/OrderTabs'
import OrdersComponent from '../../components/orders/OrdersComponent'

const Orders = () => {
    const tabs = ['Orders', 'Custom Orders'];
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const DisplayTabContent = () => {
        switch (activeTab) {
            case 'Orders': return <OrdersComponent title=''/>
            case 'Custom Orders': return <CustomOrders title='Custom Orders'/>
            // case 'Orders History': return <OrdersHistory title='Orders History'/>
            default:
            break;
        }
    }

    return (
        <SafeAreaView className='flex-1 justify-start items-center pb-20 bg-white'>
            <View className='mx-4'>
                <MainHeader fontFamily='ubuntu-medium' textStyles='text-2xl' header_name='My Orders'/>
            </View>
            <View className='w-full mt-5 mb-1'>
                <OrderTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </View>
            <View className='w-full mt-2 px-4'>
                {DisplayTabContent()}
            </View>
        </SafeAreaView>
    )
}

export default Orders
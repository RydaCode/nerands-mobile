import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainHeader from '../../../components/MainHeader';
import AllStores from '../../screens/menu-items/stores/AllStores';
import StoresTabs from '../../screens/menu-items/stores/StoresTabs';

const Index = () => {
    const tabs = ['All', 'Restaurant', 'Liquor', 'Fashion', 'Cosmetics', 'Electronics'];
    const [activeTab, setActiveTab] = useState(tabs[0]);

    return (
        <SafeAreaView className='flex-1 bg-white px-2'>
            <MainHeader textStyles='text-2xl' fontFamily='ubuntu-medium' header_name='Stores' />

            <View className='w-full mt-2 pb-1'>
                <StoresTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </View>
            <View className='my-3'/>
            <AllStores title={activeTab} cat_name={activeTab} />
        </SafeAreaView>
    );
};

export default Index;
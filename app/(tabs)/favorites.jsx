import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FavoriteHotels from '../../components/Favorites/FavoriteHotels';
import FavoritesTabs from '../../components/Favorites/FavoritesTabs';
import FavoriteStores from '../../components/Favorites/FavoriteStores';
import MainHeader from '../../components/MainHeader';

const Favorites = () => {
    const tabs = ['Favorite Stores', 'Favorite Hotels'];
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const DisplayTabContent = () => {
        switch (activeTab) {
            case 'Favorite Stores': return <FavoriteStores title='Favorite Stores'/>
            // case 'Favorite Products': return <FavoriteProducts title='Favorite Products'/>
            case 'Favorite Hotels': return <FavoriteHotels title='Favorite Hotels'/>
            default:
            break;
        }
    }

    return (
        <SafeAreaView className='flex-1 px-4 justify-start items-center bg-white'>
            <View className=''>
                <MainHeader fontFamily='ubuntu-medium' textStyles='text-2xl' header_name='Favorites'/>
            </View>
            <View className='w-full mt-1'>
                <FavoritesTabs
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

export default Favorites
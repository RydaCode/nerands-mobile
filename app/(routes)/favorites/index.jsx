import { View } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import MainHeader from '../../../components/MainHeader';
import FavoritesTabs from '../../../components/Favorites/FavoritesTabs';
import FavoriteStores from '../../../components/Favorites/FavoriteStores';
import FavoriteProducts from '../../../components/Favorites/FavoriteProducts';
import FavoriteHotels from '../../../components/Favorites/FavoriteHotels';

const index = () => {
    const tabs = ['Favorite Stores', 'Favorite Products', 'Favorite Hotels'];
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const DisplayTabContent = () => {
        switch (activeTab) {
            case 'Favorite Stores': return <FavoriteStores title='Favorite Stores'/>
            case 'Favorite Products': return <FavoriteProducts title='Favorite Products'/>
            case 'Favorite Hotels': return <FavoriteHotels title='Favorite Hotels'/>
            default:
            break;
        }
    }

    return (
        <SafeAreaView className='flex-1 justify-start items-center bg-white'>
            <View className='mx-2'>
                <MainHeader header_name='Favorites'/>
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

export default index
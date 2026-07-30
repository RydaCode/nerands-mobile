import { Fontisto } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import FavoriteHotels from '../../components/Favorites/FavoriteHotels';
import FavoritesTabs from '../../components/Favorites/FavoritesTabs';
import FavoriteStores from '../../components/Favorites/FavoriteStores';
import MainHeader from '../../components/MainHeader';
import { COLORS } from '../../constants/constants';

const Favorites = () => {
    const tabs = ['Favorite Stores', 'Favorite Hotels'];
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const router = useRouter();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

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
        <SafeAreaView className='flex-1 justify-start items-center bg-white'>
            <View className='px-2'>
                <MainHeader fontFamily='ubuntu-medium' textStyles='text-2xl' header_name='Favorites'/>
            </View>

            {!isAuthenticated ? (
                <View className="w-full h-full justify-center items-center bg-white px-2">
                    
                    <Fontisto name="locked" size={30} color={COLORS.slate} />
                    <Text className="text-base my-4 text-slate" style={{fontFamily: 'roboto-medium'}}>
                        Please login to see your favorites
                    </Text>
                    <TouchableOpacity
                        style={{ width: "90%" }}
                        className="bg-primary rounded elevation-md justify-center items-center py-2 mt-3"
                        onPress={() => router.push("/(auth)/login")}
                    >
                        <Text
                            className="text-white text-2xl"
                            style={{ fontFamily: "ubuntu-medium" }}
                        >
                            Login
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : isAuthenticated ? (
                <>
                    <View className='w-full mt-1 px-2'>
                        <FavoritesTabs
                            tabs={tabs}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    </View>
                    <View className='w-full mt-1 flex-1'>
                        {DisplayTabContent()}
                    </View>
                </>
            ) : null}
        </SafeAreaView>
    )
}

export default Favorites
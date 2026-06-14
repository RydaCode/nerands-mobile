import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import MainHeader from '../../../components/MainHeader';
import AdminStoresCard from '../../../components/admin-store/AdminStoresCard';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';

const index = () => {
    const { user_id } = useSelector((state) => state.auth);
    const router = useRouter();

    const { data, isLoading, error, get, } = useApi(`/stores/admin-stores/${user_id}`);

    useEffect(() => {
        if (user_id) {
            get(); // Fetch stores
        }
    }, [user_id]);

    const storeList = data?.data ?? [];
    const storeCount = data?.count ?? 0;

    return (
        <SafeAreaView className="flex-1 px-2 items-center bg-white">
            <MainHeader fontFamily="ubuntu-medium" textStyles='text-2xl' header_name="My Stores" />
            {isLoading ? (
                <View className='w-full h-full justify-center items-center'>
                    <ActivityIndicator size={50} color={COLORS.primary}/>
                    <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>
                        Loading your stores, please wait...
                    </Text>
                </View>
            ) : error ? (
                <View className='w-full h-full justify-center items-center'>
                    <Text className='text-base text-red' style={{fontFamily: 'roboto-medium'}}>
                        An error occured, please restart the app. 
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={storeList}
                    keyExtractor={(item) => item.store_id?.toString() ?? Math.random().toString()}
                    renderItem={({ item }) => (
                        <AdminStoresCard
                            {...item}
                            router={router} />
                    )}
                    ListHeaderComponent={() => (
                        <View className="flex-row mb-4 mt-4 mx-2 items-center justify-center">
                            <MaterialCommunityIcons name="store" size={20} style={{ color: COLORS.primary }} />
                            <Text style={{ fontFamily: 'roboto-medium' }} className="ml-1">
                                You have {storeCount} {storeCount === 1 ? 'store' : 'stores'}
                            </Text>
                        </View>
                    )}
                    ListEmptyComponent={() => (
                        <View className="mt-10 items-center">
                            <Text style={{ fontFamily: 'roboto-medium', fontSize: 16, color: '#666' }}>
                                You haven't created any stores yet.
                            </Text>
                            {/* Or use your custom <EmptyState /> component */}
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

export default index;
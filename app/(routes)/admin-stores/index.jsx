import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import MainHeader from '../../../components/MainHeader';
import AdminStoresCard from '../../../components/admin-store/AdminStoresCard';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import LoadingIndicator from '../../LoadingIndicator';
// import EmptyState from '../../../components/EmptyState';

const index = () => {
    const { user_id } = useSelector((state) => state.auth);
    const router = useRouter();

    const { data, isLoading, error, get, } = useApi(`/stores/admin-stores/${user_id}`);

    useEffect(() => {
        if (user_id) {
            get(); // Fetch stores
        }
    }, [user_id]);

    if (isLoading) return <LoadingIndicator loading_text="Fetching stores..." />;
    if (error) return <Text>Error: {error.message}</Text>;

    const storeList = data?.data ?? [];
    const storeCount = data?.count ?? 0;

    return (
        <SafeAreaView className="flex-1 px-4 justify-center items-center bg-white">
            <View style={{ flex: 1 }}>
                <MainHeader fontFamily="ubuntu-medium" textStyles='text-2xl' header_name="My Stores" />

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
            </View>
        </SafeAreaView>
    );
};

export default index;
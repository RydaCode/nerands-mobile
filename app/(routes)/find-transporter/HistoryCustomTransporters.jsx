import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { makeCall } from '../../../utils/getDistance';
import { toast } from '../../../utils/toast';

const HistoryCustomTransporters = ({created_by, custom_order_id, store_order_id, order_type, is_runner}) => {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [list, setList] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [assigningId, setAssigningId] = useState(null);

    const { data, isLoading, error, get } = useApi(
        `/transporter/custom/suggested/${created_by}?limit=10&page=${page}`
    );

    const {data: assignCustomTransporter, isLoading: assignLoading, error: assingError, post} = useApi(
        '/transporter/custom/assign-old'
    );
    
    const handleAssignCustomTransporter = async (transporter_id) => {
        if (assigningId) return;

        setAssigningId(transporter_id);

        try {
            const res = await post({
                transporter_id,
                custom_order_id,
                created_by: created_by,
                order_type: order_type,
                is_runner: is_runner
            });

            if (res?.data.data.success) {
                toast.success(res?.data.data.message || 'Transporter assigned successfully.');
            } else {
                toast.error(res?.data.data.message || 'Failed to assign transporter.');
            }

        } catch (error) {
            toast.error('An error occurred.');
        } finally {
            setAssigningId(null);
        }
    };

    // fetch when page changes
    useEffect(() => {
        get();
    }, [page]);

    // handle API response
    useEffect(() => {
        if (data?.data) {

            if (page === 1) {
                setList(data.data);
            } else {
                setList(prev => [...prev, ...data.data]);
            }

            setLoadingMore(false);
            setRefreshing(false);
            setInitialLoading(false);
        }
    }, [data]);

    // load more (infinite scroll)
    const loadMore = () => {
        if (loadingMore || !data?.totalPages || page >= data.totalPages) return;

        setLoadingMore(true);
        setPage(prev => prev + 1);
    };

    // 🔥 pull to refresh
    const onRefresh = async () => {
        setRefreshing(true);
        setPage(1);
        setList([]);

        await get(); // 🔥 force fetch immediately
    };

    // 🔥 manual reload button
    const reload = () => {
        setRefreshing(true);
        setPage(1);
        get();
    };

    return (
        <View className='h-full mt-4'>
            {error &&
                <View className='w-full h-full justify-center items-center mb-6'>
                    <Text className='text-slate text-base mt-3' style={{fontFamily: 'roboto-medium'}}>
                        Failed to load suggestions
                    </Text>
                    <TouchableOpacity
                        className='bg-primary py-3 mt-3 rounded justify-center items-center'
                        style={{width: '50%'}}
                        onPress={reload}
                    >
                        <Text className='text-white text-lg' style={{fontFamily: 'roboto-medium'}}>
                            Reload
                        </Text>
                    </TouchableOpacity>
                </View>
            }
            <FlatList
                data={list}
                keyExtractor={(item) => item.transporter_id.toString()}
                renderItem={({ item }) => (
                    <View className='justify-center w-full mb-8 elevation-sm border p-2 rounded border-lavender bg-white'>
                        <View className='flex-row justify-between items-center'>
                            <View className='border border-lavender rounded justify-center items-center' style={{width: '18%', height: 50}}>
                                <FontAwesome name='user' size={35} color={COLORS.slate}/>
                            </View>
                            <View className='' style={{width: '64%'}}>
                                <Text className='text-base' numberOfLines={1} style={{fontFamily: 'roboto-medium'}}>
                                    {item.first_name} {item.last_name}
                                </Text>
                                <Text className='text-sm text-slate' style={{fontFamily: 'roboto-medium'}}>
                                    {item.phone_number}
                                </Text>
                            </View>
                            <TouchableOpacity
                                className='border rounded-full border-lavender bg-grey_bg justify-center items-center elevation-sm'
                                style={{width: 40, height: 40}}
                                onPress={() => makeCall(item.phone_number)}
                            >
                                <FontAwesome name='phone' color={COLORS.green2} size={20}/>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            disabled={assigningId === item.transporter_id || assignCustomTransporter?.success}
                            style={{
                                backgroundColor: assignCustomTransporter?.success ? COLORS.lavender : COLORS.green2
                            }}
                            className='justify-center items-center mt-2 rounded elevation-sm py-2 border border-white'
                            onPress={() => handleAssignCustomTransporter(item.transporter_id)}
                        >
                            <Text className='text-lg text-white' style={{fontFamily: 'roboto-medium'}}>
                                {assigningId === item.transporter_id ? 'Assigning...' : 'Assign'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListHeaderComponent={() => (
                    <Text className='mb-6 text-white rounded p-2' style={{fontFamily: 'roboto-medium', textAlign: 'justify', backgroundColor: '#f87171'}}>
                        Select a transporter from your history or create a new custom transporter in the other tab.
                    </Text>
                )}

                ListEmptyComponent={
                    isLoading ? (
                        <View className='w-full h-full justify-center items-center'>
                            <ActivityIndicator size={40} color={COLORS.primary}/>
                            <Text className='text-slate text-base mt-3' style={{fontFamily: 'roboto-medium'}}>
                                Loading suggested transporters...
                            </Text>
                        </View>
                    ) : (
                        <View className='justify-center w-full items-center'>
                            <FontAwesome name='search' size={40} color={COLORS.slate}/>
                            <Text className='text-slate text-base mt-3' style={{fontFamily: 'roboto-medium'}}>
                                No transporters found
                            </Text>
                        </View>
                    )
                }

                onEndReached={loadMore}
                onEndReachedThreshold={0.5}

                // 🔥 pull to refresh
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }

                // loading more indicator
                ListFooterComponent={
                    loadingMore ? (
                        <ActivityIndicator size={40} color={COLORS.primary} />
                    ) : null
                }
            />
        </View>
    )
}

export default HistoryCustomTransporters